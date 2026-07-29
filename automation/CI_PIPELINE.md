# CI Pipeline

The original combined workflow at `.github/workflows/ci.yml` is preserved. The separated workflows at `.github/workflows/build.yml`, `.github/workflows/test.yml`, and `.github/workflows/security-scan.yml` provide explicit governance checks for pull requests, default-branch pushes, and the scheduled dependency audit.

## Stages

1. Checkout the commit associated with the PR or push.
2. Set up Node.js 20 with npm caching.
3. Run `npm ci` to enforce the lockfile.
4. Run `npm test` in the test workflow.
5. Run `npm run build` in the build workflow.
6. Run `npm audit --audit-level=high` in the security workflow.

## Future gates

- ESLint and Prettier checks.
- Server unit and API integration tests.
- Client component tests.
- Dependency audit with an agreed vulnerability threshold.
- Container build smoke test.
- OpenAPI contract validation.
- Preview deployment for UI changes.

The repository currently has no lint, format, coverage, CodeQL, or container-scan command configured. Add those as separate intentional changes after selecting tools and thresholds.

## Failure handling

- Do not merge a red required check.
- Fix the branch and push again; the workflow reruns automatically.
- If a dependency advisory is temporarily accepted, document owner, rationale, and expiry in an issue.
- If CI is flaky, quarantine the test only with a follow-up issue and an owner; do not silently ignore failures.
