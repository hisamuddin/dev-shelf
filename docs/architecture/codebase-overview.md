# DevShelf Codebase Overview

## Repository purpose

DevShelf is a modular-monolith developer-resource library. The current repository is a same-day MVP that lets visitors search resources, users save and submit them, and admins review and publish submissions.

## Detected technology

| Concern           | Evidence                                                                   |
| ----------------- | -------------------------------------------------------------------------- |
| Languages         | JavaScript, JSX, JSON, YAML, Markdown                                      |
| Frontend          | React 19, Vite 8, React Router, Axios, React Markdown, Lucide React        |
| Backend           | Node.js 22.12+ runtime, Express 5                                          |
| Package manager   | npm workspaces with `package-lock.json`                                    |
| Database target   | MongoDB with Mongoose models; current runtime uses an in-memory demo store |
| Cache             | Custom process-local `MemoryCache`                                         |
| Containers        | Dockerfiles for client/server and `docker-compose.yml` with MongoDB        |
| Test framework    | Node built-in test runner is configured; no test files exist yet           |
| Lint/format tools | No ESLint or Prettier scripts detected                                     |
| CI                | `.github/workflows/ci.yml` plus separated build/test/security workflows    |

## Runtime versions and commands

The package metadata and setup guide require Node.js 22.12+ and npm 10+. The root commands are:

```powershell
npm install
npm run dev
npm run build
npm test
```

## Entry points

- Client entry: `client/src/main.jsx`.
- Client HTML shell: `client/index.html`.
- Server entry: `server/src/index.js`.
- Server development mode: `node --watch src/index.js`.
- Server production-style local start: `node src/index.js`.

## Repository tree

```text
client/
├── Dockerfile
├── index.html
├── package.json
└── src/
    ├── main.jsx
    └── styles.css
server/
├── Dockerfile
├── package.json
└── src/
    ├── auth.js
    ├── cache.js
    ├── index.js
    ├── store.js
    └── models/
        ├── Resource.js
        └── User.js
docs/
├── architecture/
├── automation/
├── ARCHITECTURE.md
├── BUILD_AND_FLOW.md
├── ENGINEERING_WORKFLOW.md
├── SETUP.md
├── TEST_PLAN.md
├── openapi.yaml
└── postman.collection.json
automation/
.github/
├── workflows/
├── ISSUE_TEMPLATE/
├── CODEOWNERS
├── dependabot.yml
└── pull_request_template.md
docker-compose.yml
package.json
```

## Startup and request processing

`npm run dev` starts the server and client concurrently. The React app sends REST requests to `/api/v1`; the Express server applies security middleware, assigns a request ID, validates/authenticates the request where required, reads or updates the store, and returns a consistent JSON envelope.

Express 5 route parameters are validated inside handlers. Avoid inline regex parameter constraints because the newer `path-to-regexp` parser can reject them during startup.

## Configuration and data access

Configuration is read from environment variables with safe local defaults. `.env.example` files document server and client variables. The current store is `server/src/store.js`; Mongoose schemas under `server/src/models/` document the intended MongoDB boundary but are not connected at runtime yet.

## Authentication and authorization

`server/src/auth.js` issues short-lived JWT access tokens and provides `requireAuth` and `requireRole`. User and admin routes are protected at the API boundary. The client stores the demo token locally; production should move refresh-token handling to secure httpOnly cookies.

## Logging, observability, and errors

The API sets `X-Request-Id`, returns generic error messages, exposes `/health` and `/api/v1/health`, and logs unexpected server errors. Full structured logging, metrics, tracing, and persisted audit logs are not implemented yet.

## Caching

`server/src/cache.js` provides TTL, hit/miss statistics, size reporting, direct invalidation, and prefix invalidation for public resource reads. It is process-local and must be replaced or backed by a distributed cache before horizontal scaling.

## Deployment approach

Local development uses Vite/Node. Docker Compose provides client, server, and MongoDB services. GitHub Actions validates install, tests, build, and dependency security. There is no production deployment workflow or hosting configuration in the repository.

## Known risks and limitations

- In-memory data resets when the server restarts.
- No automated test files, linting, or formatting scripts exist yet.
- `npm audit --audit-level=high` passes; two moderate React Router 6 advisories remain until the router replacement decision is made.
- Docker image builds require a running Docker Desktop Linux daemon; `docker compose config` can still validate the Compose definition without the daemon.
- Demo credentials and JWT defaults are unsuitable for production.
- MongoDB models are groundwork, not active persistence.
