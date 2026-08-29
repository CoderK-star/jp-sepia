# Installs the jp-sepia skill at USER scope for Claude Code, Codex, Grok Build,
# and Antigravity on Windows. Uses directory junctions (Claude / Codex / Grok)
# and a copy (Antigravity). Re-run to update.
#
#   Set-ExecutionPolicy -Scope Process Bypass
#   .\install.ps1

$ErrorActionPreference = "Stop"

$RepoUrl = if ($env:JP_SEPIA_REPO) { $env:JP_SEPIA_REPO } else { "https://github.com/CoderK-star/jp-sepia.git" }
$CloneDir = if ($env:JP_SEPIA_HOME) { $env:JP_SEPIA_HOME } else { Join-Path $HOME ".jp-sepia" }

function Test-SkillHere {
    param([string]$Root)
    return Test-Path (Join-Path $Root "skills\jp-sepia\SKILL.md")
}

$here = $PSScriptRoot
if (-not $here -or -not (Test-SkillHere $here)) {
    if (Test-Path (Join-Path $CloneDir ".git")) {
        Write-Host "updating $CloneDir"
        git -C $CloneDir pull --ff-only
    } else {
        git clone $RepoUrl $CloneDir
    }
    & (Join-Path $CloneDir "install.ps1")
    exit $LASTEXITCODE
}

$Root = $here
$Skill = Join-Path $Root "skills\jp-sepia"

function Set-Junction {
    param([string]$Link, [string]$Target)
    $parent = Split-Path $Link -Parent
    if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent | Out-Null }
    if (Test-Path $Link) { Remove-Item $Link -Recurse -Force }
    New-Item -ItemType Junction -Path $Link -Target $Target | Out-Null
    Write-Host "linked  $Link"
}

Set-Junction (Join-Path $HOME ".claude\skills\jp-sepia") $Skill
Set-Junction (Join-Path $HOME ".agents\skills\jp-sepia") $Skill
Set-Junction (Join-Path $HOME ".grok\skills\jp-sepia") $Skill

$Ag = Join-Path $HOME ".gemini\config\skills\jp-sepia"
$AgParent = Split-Path $Ag -Parent
if (-not (Test-Path $AgParent)) { New-Item -ItemType Directory -Path $AgParent | Out-Null }
if (Test-Path $Ag) { Remove-Item $Ag -Recurse -Force }
Copy-Item -Recurse $Skill $Ag
Write-Host "copied  $Ag"

$WfDir = Join-Path $HOME ".gemini\antigravity\global_workflows"
if (-not (Test-Path $WfDir)) { New-Item -ItemType Directory -Path $WfDir | Out-Null }
$Wf = Join-Path $WfDir "jp-sepia.md"
Copy-Item (Join-Path $Root ".agents\workflows\jp-sepia.md") $Wf -Force
Write-Host "copied  $Wf"

Write-Host ""
Write-Host "Installed at user scope:"
Write-Host "  Claude Code : ~/.claude/skills/jp-sepia (junction)"
Write-Host "  Codex       : ~/.agents/skills/jp-sepia (junction)"
Write-Host "  Grok Build  : ~/.grok/skills/jp-sepia (junction)"
Write-Host "  Antigravity : ~/.gemini/config/skills/jp-sepia (copy) + /jp-sepia workflow"
