# Branch Protection and Approval Policy

This reference records the repository's GitHub merge settings and the stricter team workflow expected from contributors.

## Protected branch

`main` is the protected default branch. Changes must arrive through a pull request. Conversations must be resolved before merge, and stale approvals are dismissed when new changes invalidate the reviewed state.

The current GitHub rule intentionally has zero required approving reviews. This means GitHub will not block a merge solely because an approval is missing. It does not mean that review is optional under the project policy:

- Normal changes: request at least one reviewer.
- Security, dependency, authentication, data, and deployment changes: request two reviewers.
- CI must pass and actionable conversations must be resolved.
- If an exception is necessary, record the reason and the owner approval in the PR conversation.

Review requirements can be made a hard GitHub gate later without changing the contributor workflow documented here.

## Required flow for a security change

```text
main
  ↓ update locally
fix/<short-description>
  ↓ ready-for-review PR → main
two reviewers + CI
  ↓ squash merge
main + deleted branch
```

PowerShell example:

```powershell
git switch main
git pull --ff-only origin main
git switch -c fix/react-router-security
git push --set-upstream origin fix/react-router-security
```

Open the PR as ready for review, target `main`, request two reviewers, wait for CI and approvals, then squash-merge and delete the branch after merge.

## Dependency rollups

When several related Dependabot PRs are open, create one `chore/dependency-rollup` branch from the latest `main`. Include the compatible upgrades and validation evidence in one ready PR. Close individual Dependabot PRs only after the rollup has merged; mark them as superseded in their closing comment when possible.

See the [dependency rollup reference](07-dependency-rollup.md) and [pull-request guide](05-pull-request.md) for the detailed commands.
