import { createHash } from "node:crypto";
import { existsSync, lstatSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const repo = resolve(fileURLToPath(new URL("..", import.meta.url)));
const failures = [];
const warnings = [];

function fileHash(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function filesBelow(directory) {
  const output = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) output.push(...filesBelow(path));
    else if (entry.isFile()) output.push(path);
  }
  return output;
}

function mirrorMatches(canonical, mirror) {
  if (!existsSync(mirror)) return false;
  const canonicalFiles = filesBelow(canonical).map((path) => relative(canonical, path)).sort();
  const mirrorFiles = filesBelow(mirror).map((path) => relative(mirror, path)).sort();
  if (canonicalFiles.join("\n") !== mirrorFiles.join("\n")) return false;
  return canonicalFiles.every((path) => fileHash(join(canonical, path)) === fileHash(join(mirror, path)));
}

for (const path of [
  "README.md",
  "README.en.md",
  "install.ps1",
  "install.sh",
  ".codex-plugin/plugin.json",
  ".claude-plugin/plugin.json"
]) {
  if (readFileSync(join(repo, path), "utf8").includes("YOUR_ORG")) failures.push(`${path}: YOUR_ORG remains`);
}

try {
  execFileSync("git", ["rev-parse", "--verify", "HEAD"], { cwd: repo, stdio: "ignore" });
} catch {
  failures.push("repository has no initial commit");
}

try {
  const origin = execFileSync("git", ["remote", "get-url", "origin"], { cwd: repo, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  if (!origin) failures.push("origin has no URL");
} catch {
  failures.push("repository has no origin remote");
}

const canonical = join(repo, "skills", "jp-sepia");
for (const mirrorRelative of [".agents/skills/jp-sepia", ".grok/skills/jp-sepia"]) {
  const mirror = join(repo, mirrorRelative);
  if (!mirrorMatches(canonical, mirror)) failures.push(`${mirrorRelative}: differs from canonical skill`);
  if (existsSync(mirror) && !lstatSync(mirror).isSymbolicLink()) {
    warnings.push(`${mirrorRelative}: physical mirror; keep package-preflight in CI to prevent drift`);
  }
}

if (failures.length > 0) {
  console.error(`FAIL: ${failures.length} release blockers`);
  for (const failure of failures) console.error(`- ${failure}`);
} else {
  console.log("PASS: publish identity and plugin metadata are ready");
}
for (const warning of warnings) console.warn(`WARN: ${warning}`);
if (failures.length > 0) process.exitCode = 1;
