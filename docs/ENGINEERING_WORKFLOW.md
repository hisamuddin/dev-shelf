# Engineering Workflow: Branches, PRs, and Code Review

## Branch strategy

Use short-lived branches from the protected default branch:

```text
main
├── feature/resource-search
├── fix/cache-invalidation
├── docs/architecture-handbook
└── chore/upgrade-dependencies
```

Naming rules:

- `feature/<short-description>` for product behavior.
- `fix/<short-description>` for defects.
- `docs/<short-description>` for documentation-only work.
- `chore/<short-description>` for maintenance and tooling.

The repository default branch is `main`. Always update `main` before creating a short-lived work branch, and never develop directly on `main`.

## Commit rules

Prefer focused commits with imperative messages:

```text
feat: add contributor submission flow
fix: invalidate resource cache after publish
docs: add architecture and release workflow
test: cover admin moderation transitions
```

Keep unrelated formatting and refactors out of feature commits. Never commit secrets, generated `dist/` output, `node_modules`, or local `.env` files.

## Pull request requirements

Every PR should include the problem, user impact, implementation summary, scope/non-goals, screenshots or API examples, test commands/results, rollout notes, and known limitations.

The standard security-change flow is:

1. Merge documentation or prerequisite work into `main`.
2. Create `fix/<short-description>` from the latest `main`.
3. Open a ready-for-review PR targeting `main` (do not leave it as a draft).
4. Request two reviewers for security, dependency, authentication, data, or deployment changes.
5. Wait for CI and the requested approvals before merging.
6. Squash-merge the PR and delete the branch.

## Review rules

- At least one reviewer for normal changes; two for auth, data, security, or deployment changes.
- CI must pass before merge.
- Review behavior, API contracts, authorization, validation, failure states, tests, and documentation—not only formatting.
- The author resolves or explicitly discusses every actionable comment.
- Use squash merge for small feature branches to keep the default branch readable.
- Delete merged branches unless they are needed for release or investigation.

The current GitHub rule for `main` requires a pull request and resolved conversations, but does not enforce a minimum number of approving reviews. That setting is an administrative merge gate; it does not replace the project review policy above. Record any intentional exception in the PR conversation.

## Review checklist

- [ ] Scope matches the issue or product requirement.
- [ ] No secrets, credentials, or personal data entered into source control.
- [ ] Public/protected/admin boundaries are correct.
- [ ] Validation and error responses are consistent.
- [ ] Cache invalidation is covered where needed.
- [ ] Loading, empty, error, and success states are handled.
- [ ] Tests cover the changed behavior.
- [ ] README/docs/API contract updated.
- [ ] `npm run build` passes.
- [ ] `npm test` passes.

## Release flow

1. Merge reviewed PR into `main`.
2. Create a version tag such as `v0.1.0`.
3. Run the release workflow or deployment pipeline.
4. Verify health, auth, public search, and moderation flows in the target environment.
5. Record rollback steps and release notes.
