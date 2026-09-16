#!/bin/zsh
# Usage: run-review.sh <slug> <round> <task-file> [model] [suffix]
# Prompts, logs and last messages go to $WOF_CODEX_LOGS (default $TMPDIR/wof-codex).
# <task-file> holds the chapter-specific task details (chapter, YAML, OQs, prior reviews, scope).
set -u
slug=$1; round=$2; task=$3; model=${4:-gpt-5.6-sol}; suffix=${5:-codex}
dir=${WOF_CODEX_LOGS:-${TMPDIR:-/tmp}/wof-codex}
mkdir -p $dir
repo=/Users/frostnoxia/Developer/gluniverse-aot
prompt=$dir/$slug-r$round-$suffix-prompt.md
{
  print -r -- "You are an independent reviewer. First read \`.claude/agents/wof-reviewer.md\` in the repository and follow its instructions as your role and review method, with these task details."
  print
  cat $task
  print
  print -r -- "- Run dice simulations in Python in a temporary directory outside the repository when odds matter, and quote the numbers."
  print -r -- "- Another reviewer writes \`docs/reviews/$slug-review-$round.md\` in parallel. Do not read or edit it."
  print -r -- "- Do not edit any project file except your own review. Write it to \`docs/reviews/$slug-review-$round-$suffix.md\`. Count only findings still open this round."
  print
  print -r -- "Severity guide: Critical = contradicts an ADR or glossary without being logged as an open question, lets GM judgment reach something ADR-0024 keeps closed, or is a rules bug that breaks play or makes an ADR-0014 target unreachable. Major = undefined edge case or ordering problem likely in normal play, or a significant odds, balance, or fidelity problem. Minor = wording, clarity, small gaps."
  print
  print -r -- "Final message: under 80 words, the review file path and counts of Critical, Major, and Minor findings."
} > $prompt
touch $dir/$slug-r$round-$suffix-start
codex exec -m $model -s workspace-write --skip-git-repo-check -C $repo -o $dir/$slug-r$round-$suffix-last.md - < $prompt > $dir/$slug-r$round-$suffix-log.txt 2>&1
print "exit $?"
cat $dir/$slug-r$round-$suffix-last.md
print "files touched:"
cd $repo && find . -type f -newer $dir/$slug-r$round-$suffix-start -not -name .DS_Store
