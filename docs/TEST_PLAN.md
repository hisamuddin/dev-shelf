# DevShelf Test Plan

## Test strategy

Use a pyramid:

1. Unit tests for cache, validation, state transitions, and helpers.
2. API integration tests with Supertest and a test database or isolated store.
3. React Testing Library tests for forms, cards, routes, and state changes.
4. Browser smoke tests for the critical guest → user → admin journey.

## Current verification

```powershell
npm run build
npm test
```

The client build passes. The server test runner now executes API integration tests with an isolated in-memory store and ephemeral HTTP listener; database-backed and browser suites remain planned.

## API test cases

| ID | Scenario | Expected result |
| --- | --- | --- |
| API-01 | Health endpoint | 200, healthy status and cache stats |
| API-02 | Search published resources | 200, paginated results, unpublished items excluded |
| API-03 | Filter by difficulty/category | Only matching resources returned |
| API-03A | Filter by technology/type/tag and verified/featured flags | Only matching published resources returned |
| API-03B | Sort and page discovery results | Stable sort, bounded page size, and correct page metadata |
| API-03C | Search suggestions | Matching titles, categories, types, contributors, and technologies returned |
| API-04 | Resource detail by slug | 200 for published slug, 404 for unknown slug |
| API-05 | Register valid user | 200, JWT returned, password omitted |
| API-06 | Duplicate registration | 409 generic conflict |
| API-07 | Invalid login | 401 generic message |
| API-08 | Bookmark resource | Toggle true/false and invalidate public cache |
| API-09 | Duplicate collection resource | Resource appears once |
| API-10 | Invalid protected request | 401 without valid Bearer token |
| API-11 | Non-admin admin request | 403 |
| API-12 | Valid submission | 422 on invalid fields; draft on valid payload |
| API-13 | Submit draft | Status becomes submitted |
| API-14 | Admin request changes | Status becomes changes_requested with note |
| API-15 | Admin approve | Status becomes approved |
| API-16 | Admin publish | Published resource appears in public search |
| API-17 | Cache hit/miss | Counters increase and TTL removes expired value |
| API-18 | Request correlation | Success and error envelopes include the `X-Request-Id` value |

## Frontend test cases

| ID | Scenario | Expected result |
| --- | --- | --- |
| UI-01 | Home loads | Hero, featured resources, categories, and CTA visible |
| UI-02 | Search from hero | Navigate to Explore with query parameter |
| UI-03 | Explore filter | Query string and result list update |
| UI-04 | Empty search | Empty state and clear-filters action visible |
| UI-05 | Resource details | Content, tags, contributor, rating, and save action visible |
| UI-06 | Save while logged out | Informative login toast |
| UI-07 | Login form | Successful redirect to dashboard/admin |
| UI-08 | Bookmark while logged in | Button state and toast update |
| UI-09 | Collection create | New collection appears in dashboard |
| UI-10 | Submission validation | Required fields block invalid submission |
| UI-11 | Submission success | Success state and dashboard link visible |
| UI-12 | Admin queue | Pending items and moderation actions visible |
| UI-13 | Theme toggle | Light/dark theme persists locally |
| UI-14 | Mobile layout | Navigation, filters, cards, and forms remain usable |

## Manual smoke test

1. Start `npm run dev`.
2. Open `http://localhost:5173` as a guest.
3. Search `React`, open a result, and verify details.
4. Log in as Maya and save a resource.
5. Create and submit a resource.
6. Log in as admin and approve the submission.
7. Publish it and verify it appears in Explore.
8. Check `/api/v1/health` and confirm the API is healthy.

## Regression checklist

- No route returns a blank screen.
- No protected data is visible after sign out.
- Public results contain only published resources.
- Publish invalidates relevant cache keys.
- Client production build passes.
- Docker Compose starts all declared services.
- No secrets or local `.env` files are committed.
