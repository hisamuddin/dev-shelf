# Build and Implementation Record

This document explains how the repository was created from an empty Git workspace and how each dependency participates in the application flow.

## Build sequence

1. Initialize the repository and define the root npm workspace.
2. Create `client` and `server` packages with independent scripts.
3. Add the Vite React shell and responsive DevShelf design system.
4. Add the Express server, security middleware, request IDs, and error envelope.
5. Add seeded users, resources, submissions, and collections for a deterministic demo.
6. Add auth, resource search, bookmark, collection, contribution, moderation, and publish endpoints.
7. Add the in-memory cache and invalidate public query caches after writes.
8. Add Mongoose schema groundwork and Docker Compose infrastructure.
9. Add OpenAPI/Postman artifacts and this engineering handbook.
10. Build the client and smoke-test the guest, user, and admin paths.

## Dependency-to-feature map

| Dependency           | Used by | Why it exists                                        |
| -------------------- | ------- | ---------------------------------------------------- |
| `react`              | client  | Component-driven UI                                  |
| `react-router` 8.3.0 | client  | URL-addressable product flows and browser navigation |
| `axios`              | client  | Central API calls and token headers                  |
| `lucide-react`       | client  | Consistent interface icons                           |
| `react-markdown`     | client  | Render resource notes                                |
| `express`            | server  | REST API and middleware pipeline                     |
| `zod`                | server  | Request payload validation                           |
| `jsonwebtoken`       | server  | Demo access-token issuance and verification          |
| `bcryptjs`           | server  | Password hash comparison and creation                |
| `helmet`             | server  | Secure response headers                              |
| `cors`               | server  | Controlled local client/API origin access            |
| `express-rate-limit` | server  | Basic request throttling                             |
| `mongoose`           | server  | MongoDB schema and migration boundary                |
| `vite`               | client  | Dev server and production bundling                   |

## End-to-end feature flows

### Explore

`Home search` → `React Router /explore?q=...` → `Axios GET /resources` → `MemoryCache` → filtered data → `ResourceCard` → `/resources/:slug`.

### Bookmark

`Save to shelf` → auth guard → `POST /bookmarks/:resourceId` → user bookmark list toggles → resource cache prefix invalidates → toast confirmation.

### Share

`Share a resource` → login guard → form validation → `POST /submissions` → `POST /submissions/:id/submit` → submission status `submitted` → contributor dashboard.

### Approval

`Admin` → `GET /admin/dashboard` and `GET /admin/submissions` → `POST /admin/submissions/:id/approve` or `request_changes` → approved item exposes `Publish` → `POST /admin/submissions/:id/publish` → resource inserted as published → public cache invalidated.

## Delivery definition

An MVP change is ready when its route is connected, input and authorization rules exist, empty/loading/error/success states are represented, documentation is updated, and the relevant build or test command passes.

## Known MVP gaps

- The demo store resets on server restart.
- The contributor edit/resubmit screen is not yet connected in the UI.
- The current automated test command has no test files yet.
- MongoDB models are present, but repository wiring is the next persistence phase.
- Real refresh-token cookies, email delivery, file upload validation, and persisted audit logs remain future work.
