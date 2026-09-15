#!/usr/bin/env bash
# Vercel ignored build step (ADR-0021). Runs from the project root directory (site/).
# Exit 0 skips the build; exit 1 lets it proceed.
# Builds only when the commit touches site/, data/, or docs/rules/.

repo_root="$(git rev-parse --show-toplevel 2>/dev/null)" || exit 1
cd "$repo_root" || exit 1

# A first commit or a shallow clone without a parent: build to be safe.
git rev-parse --verify --quiet HEAD^ >/dev/null || exit 1

if git diff --quiet HEAD^ HEAD -- site data docs/rules; then
  echo "No changes to site/, data/, or docs/rules/. Skipping the site build."
  exit 0
fi

echo "Site sources changed. Building."
exit 1
