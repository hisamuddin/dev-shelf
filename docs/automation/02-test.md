# Testing Guide

## Detected test setup

The server package configures the Node.js built-in test runner through:

```json
"test": "node --test"
```

No test files, test folders, coverage configuration, mocking library, or end-to-end test runner currently exist.

## Current commands

From the repository root:

```powershell
npm test
npm run build
```

The current `npm test` command completes with zero tests. This is a verified repository gap, not evidence that the application is fully tested.

## Recommended test structure

When tests are added, keep them close to the package they validate:

```text
server/test/
├── cache.test.js
├── auth.test.js
└── resources.test.js
client/src/
└── __tests__/
    ├── auth.test.jsx
    └── resource-card.test.jsx
```

Use the built-in Node runner for server unit tests first. Add Supertest for HTTP integration and React Testing Library/Vitest only through an explicit dependency change with package scripts and CI updates.

## Test layers to implement

- Unit: `MemoryCache`, validation helpers, and workflow state transitions.
- API integration: auth, resource search, bookmarks, submissions, moderation, and cache invalidation.
- Component: auth forms, resource cards, search/filter behavior, protected routes, and admin actions.
- Browser smoke: guest search → contributor submit → admin approve → publish.
- Performance/security: pagination behavior, rate limiting, dependency audit, and sensitive-log checks.

## Running a focused test

Once a test file exists:

```powershell
node --test server/test/cache.test.js
npm test -- --test-name-pattern="cache hit"
```

These commands use the configured Node test runner. Coverage is not configured yet; do not report coverage until a coverage tool and threshold are added.

## Test data and isolation

The current demo store is process-local and resets on restart. Tests should create isolated store/cache instances or use a dedicated test fixture factory. Do not use demo credentials or shared mutable state for production-like integration tests.

## Failure troubleshooting

- Re-run one focused test with `node --test <file>`.
- Check async tests await the operation under test.
- Reset cache state between cases.
- Avoid network or MongoDB dependencies in unit tests.
- If an integration test requires MongoDB, document Docker as a prerequisite and clean up test data.
