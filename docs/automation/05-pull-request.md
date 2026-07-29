# Pull Request Guide

## 1. Create a branch

Start from the protected default branch and update it first:

```powershell
git checkout main
git pull --ff-only origin main
git checkout -b feature/resource-search
```

Use feature/, fix/, docs/, refactor/, or chore/ prefixes with a short kebab-case description. Security work must use the `fix/<short-description>` pattern and start from the latest `main`.

## 2. Implement and validate

Run the commands supported by this repository:

```powershell
npm ci
npm test
npm run build
git diff --check
```

There is currently no configured lint or formatting script. Do not claim those checks passed; record them as not available in the PR.

## 3. Prepare the PR

```powershell
git status
git add <focused-files>
git commit -m "docs(architecture): explain runtime boundaries"
git push -u origin feature/resource-search
```

Use the repository's .github/pull_request_template.md. The PR should explain:

- What changed and why.
- User/developer impact.
- Affected components and API routes.
- Tests and exact results.
- Screenshots or API evidence for UI/API changes.
- Database, configuration, dependency, security, performance, and deployment impact.
- Breaking changes and rollback plan.
- Related issue or requirement.

## 4. Keep the branch current

Prefer a clean branch update before review:

```powershell
git fetch origin
git rebase origin/main
git push --force-with-lease
```

Only force-with-lease a personal feature branch. Never force-push the protected default branch.

## 5. Respond to review

- Reply with evidence or a concise explanation.
- Push follow-up commits; do not rewrite reviewed history unless the team explicitly prefers it.
- Resolve conversations only after the requested change is implemented or the reviewer agrees.
- Re-run checks after review changes.

## 6. Merge checklist

- Required CI checks are green.
- At least one reviewer approved; security, dependency, authentication, data, and deployment changes need two reviewers under the project policy.
- All actionable conversations are resolved.
- Documentation and release notes are updated.
- The branch is up to date with the target.
- Squash merge is used for small focused changes unless the team chooses another policy.
- Delete the branch after merge.

## 7. Security-change example

```powershell
git switch main
git pull --ff-only origin main
git switch -c fix/react-router-security
```

Push the branch and open a ready-for-review PR against `main`. Request two reviewers, wait for CI and both approvals, then squash-merge and delete `fix/react-router-security` after the PR is merged. A branch created from an old feature or documentation branch is not an acceptable substitute for starting from `main`.
