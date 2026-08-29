#!/usr/bin/env bash
# Installs the jp-sepia skill at USER scope for Claude Code, Codex, Grok Build,
# and Antigravity. Claude Code / Codex / Grok follow symlinks; Antigravity
# gets a copy. For project-scope installs, see README.md.
#
# One-liner (clones to ~/.jp-sepia, or $JP_SEPIA_HOME, then installs):
#   curl -fsSL https://raw.githubusercontent.com/YOUR_ORG/jp-sepia/main/install.sh | bash
# Re-run the same line to update everything.
set -euo pipefail

REPO_URL="${JP_SEPIA_REPO:-https://github.com/YOUR_ORG/jp-sepia.git}"
CLONE_DIR="${JP_SEPIA_HOME:-$HOME/.jp-sepia}"

# Piped via curl (or run outside a checkout): clone/update first, then re-exec
# from the clone so the symlinks have a permanent target.
SCRIPT_SRC="${BASH_SOURCE[0]:-}"
if [ -z "$SCRIPT_SRC" ] || [ ! -f "$(cd "$(dirname "$SCRIPT_SRC")" 2>/dev/null && pwd)/skills/jp-sepia/SKILL.md" ]; then
  if [ -d "$CLONE_DIR/.git" ]; then
    echo "updating $CLONE_DIR"
    git -C "$CLONE_DIR" pull --ff-only
  else
    git clone "$REPO_URL" "$CLONE_DIR"
  fi
  exec bash "$CLONE_DIR/install.sh"
fi

ROOT="$(cd "$(dirname "$SCRIPT_SRC")" && pwd)"
SKILL="$ROOT/skills/jp-sepia"

link() {
  mkdir -p "$(dirname "$2")"
  ln -sfn "$1" "$2"
  echo "linked  $2"
}

link "$SKILL" "$HOME/.claude/skills/jp-sepia"
link "$SKILL" "$HOME/.agents/skills/jp-sepia"
link "$SKILL" "$HOME/.grok/skills/jp-sepia"

AG="$HOME/.gemini/config/skills/jp-sepia"
mkdir -p "$(dirname "$AG")"
rm -rf "$AG"
cp -R "$SKILL" "$AG"
echo "copied  $AG"

WF="$HOME/.gemini/antigravity/global_workflows/jp-sepia.md"
mkdir -p "$(dirname "$WF")"
cp "$ROOT/.agents/workflows/jp-sepia.md" "$WF"
echo "copied  $WF"

echo ""
echo "Installed at user scope:"
echo "  Claude Code : ~/.claude/skills/jp-sepia (symlink)"
echo "  Codex       : ~/.agents/skills/jp-sepia (symlink)"
echo "  Grok Build  : ~/.grok/skills/jp-sepia (symlink)"
echo "  Antigravity : ~/.gemini/config/skills/jp-sepia (copy) + /jp-sepia workflow"
echo ""
echo "Keep this clone: the symlinks point into it. To update everything,"
echo "re-run the install one-liner (or 'git pull' here, then re-run"
echo "install.sh to refresh the Antigravity copy)."
