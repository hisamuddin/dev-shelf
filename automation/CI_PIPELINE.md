# CI Pipeline

The workflow at `.github/workflows/ci.yml` runs for pull requests and pushes to the default branch.

## Stages

1. Checkout the commit associated with the PR or push.
2. Set up Node.js 20 with npm caching.
3. Run `npm ci` to enforce the lockfile.
4. Run `npm test`.
5. Run `npm run build` to verify the Vite production bundle.

## Future gates

- ESLint and Prettier checks.
- Server unit and API integration tests.
- Client component tests.
- Dependency audit with an agreed vulnerability threshold.
- Container build smoke test.
- OpenAPI contract validation.
- Preview deployment for UI changes.

## Failure handling

- Do not merge a red required check.
- Fix the branch and push again; the workflow reruns automatically.
- If a dependency advisory is temporarily accepted, document owner, rationale, and expiry in an issue.
- If CI is flaky, quarantine the test only with a follow-up issue and an owner; do not silently ignore failures.
