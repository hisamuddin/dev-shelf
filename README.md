# DevShelf

Discover, organize, and share reusable developer resources.

This repository is the same-day MVP slice of the DevShelf startup platform. It includes a polished responsive React client and an Express API with seeded development data. The API uses a clean store boundary so the demo can run without MongoDB; Mongoose model definitions and Docker Compose are included for the persistence hardening phase.

## What works today

- Public home, search, filters, resource details, categories, and trending content.
- Demo registration/login with JWT access tokens.
- Bookmarking and personal collections.
- Contributor draft and submit workflow.
- Admin queue with request changes and approve/publish actions.
- Prefix-aware in-memory cache with TTL, hits, misses, and invalidation.
- Health endpoint, request IDs, security headers, consistent JSON errors.

## Run locally

Requirements: Node.js 22.22+ and npm 10+.

```powershell
npm install
npm run dev
```

Open http://localhost:5173. The API is available at http://localhost:5000/api/v1.

Demo accounts:

- Admin: `admin@devshelf.dev` / `DevShelf123!`
- Contributor: `maya@devshelf.dev` / `DevShelf123!`

To run the API alone:

```powershell
npm run start -w server
```

## Docker

```powershell
docker compose up --build
```

The current app is intentionally runnable without an external database. MongoDB is provisioned in Compose as the next persistence target; move the store implementation behind the existing interface before enabling multi-instance deployment.

## Architecture

```text
client (Vite + React)
  -> REST /api/v1
server (Express modular monolith)
  -> auth, resource, collection, submission and admin modules
  -> cache service
  -> in-memory demo store (replaceable with MongoStore)
MongoDB (Docker-ready persistence target)
```

## Next hardening pass

1. Replace `server/src/store.js` with Mongoose repositories and seed scripts.
2. Add refresh-token rotation with secure httpOnly cookies and email reset delivery.
3. Add full Jest/Supertest and React Testing Library coverage.
4. Add Swagger UI, file upload validation, audit persistence, and production observability.
5. Replace process-local cache with distributed caching when horizontal scaling begins.

See `server/src/models/` for the first Mongoose schema and `docs/openapi.yaml` for the API contract.

## Project handbook

- [Setup and dependency guide](docs/SETUP.md)
- [Azure deployment guide](docs/AZURE_DEPLOYMENT.md)
- [Architecture and runtime flows](docs/ARCHITECTURE.md)
- [Build and implementation record](docs/BUILD_AND_FLOW.md)
- [Testing and acceptance cases](docs/TEST_PLAN.md)
- [Dependency rollup reference](docs/automation/07-dependency-rollup.md)
- [Branching, pull requests, and code review](docs/ENGINEERING_WORKFLOW.md)
- [GitHub branch protection and approval policy](docs/automation/08-branch-protection.md)
- [Automation overview](automation/README.md)
- [CI pipeline details](automation/CI_PIPELINE.md)

## Documentation

### Architecture

- [Codebase overview](docs/architecture/codebase-overview.md)
- [Component reference](docs/architecture/component-reference.md)
- [Dependency graph](docs/architecture/dependency-graph.md)

### Development workflow

- [Development guide](docs/automation/01-develop.md)
- [Testing guide](docs/automation/02-test.md)
- [Dependency rollup reference](docs/automation/07-dependency-rollup.md)
- [Sample test](docs/automation/03-sample-test.md)
- [Commit guide](docs/automation/04-commit.md)
- [Pull-request guide](docs/automation/05-pull-request.md)
- [Review guide](docs/automation/06-review.md)
- [Branch protection and approval policy](docs/automation/08-branch-protection.md)

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution entry point and [SECURITY.md](SECURITY.md) for vulnerability reporting.
