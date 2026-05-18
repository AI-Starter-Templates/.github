#!/usr/bin/env bash
#
# Diff this repo's GitHub settings against the desired-state file. Prints
# `gh api ...` commands for every drift. No auto-apply — the operator runs
# the printed commands. Exit 0 if clean, 1 if any drift.
#
# Required: gh (authenticated), jq.

set -euo pipefail

DESIRED=".github/desired-repo-settings.json"

if [[ ! -f "$DESIRED" ]]; then
  echo "Missing $DESIRED — run from the repo root." >&2
  exit 1
fi

if ! command -v gh >/dev/null 2>&1 || ! command -v jq >/dev/null 2>&1; then
  echo "Required: gh + jq on PATH." >&2
  exit 1
fi

REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
echo "Auditing $REPO against $DESIRED"
echo

DRIFT=0

note_drift() {
  DRIFT=1
  printf '  ⚠ drift: %s\n' "$1"
  printf '    fix:   %s\n\n' "$2"
}

#
# --- Section 1: security_and_analysis (secret scanning + push protection +
#                 Dependabot security updates)
#
SAA_CURRENT=$(gh api "repos/$REPO" --jq '.security_and_analysis')
SAA_DESIRED=$(jq -c '.security_and_analysis' "$DESIRED")

for key in secret_scanning secret_scanning_push_protection dependabot_security_updates; do
  want=$(echo "$SAA_DESIRED" | jq -r --arg k "$key" '.[$k] // "enabled"')
  have=$(echo "$SAA_CURRENT" | jq -r --arg k "$key" '.[$k].status // "disabled"')
  if [[ "$have" != "$want" ]]; then
    note_drift \
      "security_and_analysis.$key = $have (want $want)" \
      "gh api -X PATCH repos/$REPO -f security_and_analysis[$key][status]=$want"
  fi
done

#
# --- Section 2: merge settings
#
MERGE_CURRENT=$(gh api "repos/$REPO" --jq '{delete_branch_on_merge, allow_squash_merge, allow_merge_commit, allow_rebase_merge}')
MERGE_DESIRED=$(jq -c '.merge' "$DESIRED")

for key in delete_branch_on_merge allow_squash_merge allow_merge_commit allow_rebase_merge; do
  want=$(echo "$MERGE_DESIRED" | jq -r --arg k "$key" '.[$k]')
  have=$(echo "$MERGE_CURRENT" | jq -r --arg k "$key" '.[$k]')
  if [[ "$have" != "$want" ]]; then
    note_drift \
      "$key = $have (want $want)" \
      "gh api -X PATCH repos/$REPO -F $key=$want"
  fi
done

#
# --- Section 3: branch protection on main
#
if PROT_CURRENT=$(gh api "repos/$REPO/branches/main/protection" 2>/dev/null); then
  :
else
  PROT_CURRENT='{}'
fi
PROT_DESIRED=$(jq -c '.branch_protection_main' "$DESIRED")

want_contexts=$(echo "$PROT_DESIRED" | jq -c '.required_status_check_contexts | sort')
have_contexts=$(echo "$PROT_CURRENT" | jq -c '.required_status_checks.contexts // [] | sort')
if [[ "$have_contexts" != "$want_contexts" ]]; then
  note_drift \
    "branch_protection.main.required_status_checks.contexts = $have_contexts (want $want_contexts)" \
    "gh api -X PUT repos/$REPO/branches/main/protection/required_status_checks/contexts -f contexts[]=...  (see desired JSON for full list)"
fi

want_reviews=$(echo "$PROT_DESIRED" | jq -r '.required_approving_review_count')
have_reviews=$(echo "$PROT_CURRENT" | jq -r '.required_pull_request_reviews.required_approving_review_count // 0')
if [[ "$have_reviews" != "$want_reviews" ]]; then
  note_drift \
    "required_approving_review_count = $have_reviews (want $want_reviews)" \
    "gh api -X PUT repos/$REPO/branches/main/protection — see GitHub docs for the full PUT body"
fi

for key in required_linear_history required_signatures; do
  want=$(echo "$PROT_DESIRED" | jq -r --arg k "$key" '.[$k]')
  have=$(echo "$PROT_CURRENT" | jq -r --arg k "$key" '.[$k].enabled // false')
  if [[ "$have" != "$want" ]]; then
    note_drift \
      "branch_protection.main.$key = $have (want $want)" \
      "gh api -X POST repos/$REPO/branches/main/protection/$key  (or -X DELETE if want=false)"
  fi
done

for key in allow_force_pushes allow_deletions; do
  want=$(echo "$PROT_DESIRED" | jq -r --arg k "$key" '.[$k]')
  have=$(echo "$PROT_CURRENT" | jq -r --arg k "$key" '.[$k].enabled // false')
  if [[ "$have" != "$want" ]]; then
    note_drift \
      "branch_protection.main.$key = $have (want $want)" \
      "see GitHub docs: PUT /repos/$REPO/branches/main/protection"
  fi
done

if [[ "$DRIFT" -eq 0 ]]; then
  echo "✓ All settings match $DESIRED."
  exit 0
fi

echo "Found drift. Re-run after applying the fix commands above."
exit 1
