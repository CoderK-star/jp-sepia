import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const manifestPath = resolve(root, "cases.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const errors = [];
const operations = new Set(["write", "review", "refactor", "recreate"]);

function fail(message) {
  errors.push(message);
}

if (manifest.schemaVersion !== 1) fail("schemaVersion must be 1");
if (manifest.outputPolicy?.default !== "artifact-first-compact") fail("default output policy must be artifact-first-compact");
if (manifest.outputPolicy?.detailTrigger !== "explicit-user-request") fail("detail trigger must be explicit-user-request");
if (manifest.outputPolicy?.review !== "diagnosis-only-compact") fail("review output policy must be diagnosis-only-compact");
if (!Array.isArray(manifest.operations) || manifest.operations.length !== 4) {
  fail("operations must define the four supported operations");
}
for (const operation of manifest.operations ?? []) {
  if (!operations.has(operation)) fail(`unknown operation: ${operation}`);
}

const ids = new Set();
for (const testCase of manifest.cases ?? []) {
  if (!testCase.id || ids.has(testCase.id)) fail(`duplicate or missing case id: ${testCase.id}`);
  ids.add(testCase.id);
  if (!(testCase.id in (manifest.documentTypes ?? {}))) fail(`${testCase.id}: missing document type`);
  if (!testCase.fixture || !existsSync(resolve(root, testCase.fixture))) fail(`${testCase.id}: missing fixture`);
  for (const field of ["requiredFacts", "forbiddenTerms"]) {
    if (!Array.isArray(testCase[field]) || testCase[field].length === 0) fail(`${testCase.id}: ${field} must be a non-empty array`);
  }
}

const expectedTestIds = new Set(
  (manifest.cases ?? []).flatMap((testCase) => (manifest.operations ?? []).map((operation) => `${testCase.id}/${operation}`))
);
if (expectedTestIds.size !== 28) fail(`expected 28 expanded tests, got ${expectedTestIds.size}`);
if (!Array.isArray(manifest.verbosityCases) || manifest.verbosityCases.length !== 2) {
  fail("verbosityCases must define default and explicit-detail cases");
} else {
  const verbosityIds = new Set(manifest.verbosityCases.map((item) => item.id));
  if (!verbosityIds.has("default-compact") || !verbosityIds.has("explicit-detail")) {
    fail("verbosityCases must include default-compact and explicit-detail");
  }
}

const args = process.argv.slice(2);
const resultFlag = args.indexOf("--results");
if (resultFlag >= 0) {
  const resultPath = args[resultFlag + 1];
  if (!resultPath) {
    fail("--results requires a JSON file path");
  } else if (!existsSync(resolve(process.cwd(), resultPath))) {
    fail(`results file does not exist: ${resultPath}`);
  } else {
    const report = JSON.parse(readFileSync(resolve(process.cwd(), resultPath), "utf8"));
    const seen = new Set();
    for (const result of report.results ?? []) {
      if (!expectedTestIds.has(result.testId)) fail(`unexpected result testId: ${result.testId}`);
      if (seen.has(result.testId)) fail(`duplicate result testId: ${result.testId}`);
      seen.add(result.testId);
      const [caseId, operation] = (result.testId ?? "").split("/");
      const testCase = (manifest.cases ?? []).find((item) => item.id === caseId);
      if (!testCase || result.route !== manifest.documentTypes[caseId]) fail(`${result.testId}: incorrect route`);
      if (result.operation !== operation) fail(`${result.testId}: incorrect operation`);
      if (typeof result.output !== "string" || result.output.trim().length === 0) fail(`${result.testId}: output is missing`);
      if (operation !== "review") {
        for (const fact of testCase?.requiredFacts ?? []) {
          if (!result.output.includes(fact)) fail(`${result.testId}: required fact missing: ${fact}`);
        }
      }
      for (const term of testCase?.forbiddenTerms ?? []) {
        if (result.output.includes(term)) fail(`${result.testId}: forbidden term present: ${term}`);
      }
    }
    for (const testId of expectedTestIds) if (!seen.has(testId)) fail(`missing result: ${testId}`);
  }
}

if (errors.length > 0) {
  console.error(`FAIL (${errors.length})`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`PASS: ${manifest.cases.length} cases × ${manifest.operations.length} operations = ${expectedTestIds.size} tests`);
  console.log(`PASS: ${manifest.negativeCases.length} negative invocation cases defined`);
  console.log(`PASS: ${manifest.verbosityCases.length} verbosity policy cases defined`);
}
