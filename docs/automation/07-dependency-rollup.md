# Dependency Rollup Reference

This document records the dependency-consolidation decisions for DevShelf. Use it when Dependabot opens several related pull requests at the same time.

## Runtime baseline

- Node.js: `22.12+` for local development and GitHub Actions.
- npm: `10+`.
- Docker images: `node:26-alpine` for the client and server containers.
- The root `package.json` declares the Node and npm engine requirements so an older local runtime reports the incompatibility early.

Vite 8, concurrently 10, and the Mongoose 9 dependency tree require a newer Node runtime than the previous Node 20.18 workspace runtime. Validate with a supported Node version before interpreting build results.

## Rollup scope

The rollup groups the currently related Dependabot updates:

- React and React DOM 19.
- Vite 8, React Markdown 10, and Lucide React 1.
- Express 5, Express Rate Limit 8, Mongoose 9, Zod 4, and bcryptjs 3.
- concurrently 10 and Axios 1.19.
- Node 26 Alpine images.
- `actions/checkout` 7 and `actions/setup-node` 7.

Apply the package changes together, regenerate `package-lock.json`, and test the resulting dependency graph. Do not merge React or React DOM independently because the pair must remain on the same major version.

## Express 5 compatibility note

Express 5 uses a newer `path-to-regexp` implementation. Inline constrained parameters such as:

```text
/api/v1/admin/submissions/:id/:action(approve|reject|request_changes)
```

can fail during application startup. Use a plain `:action` parameter and validate the allowed action against an explicit map inside the handler. This keeps invalid actions rejected while allowing the server to start on Express 5.

## Validation checklist

Run from a clean install with the supported Node runtime:

```powershell
npm ci
npm audit --audit-level=high
npm test
npm run build
git diff --check
docker compose config
```

The repository currently has no test files, so `npm test` reports zero tests. The high-severity audit gate passes after the React Router security fix, while two moderate React Router 6 advisories remain documented for a future router replacement decision.

Start the server separately for an API smoke check:

```powershell
$env:PORT = "5100"
npm run start -w server
Invoke-WebRequest http://localhost:5100/api/v1/health
Invoke-WebRequest http://localhost:5100/api/v1/resources
```

Docker image builds require Docker Desktop's Linux daemon to be running. If it is unavailable, record the gap rather than claiming the image build passed.

## Pull-request handling

Create one short-lived `chore/dependency-rollup` branch from the latest `main`. Open one ready-for-review PR targeting `main` with the complete validation evidence. Request two reviewers because dependency changes can affect security and runtime compatibility. After CI and approvals pass, squash-merge the rollup, then close superseded Dependabot PRs and delete their branches. Do not close them before the rollup is safely merged.
