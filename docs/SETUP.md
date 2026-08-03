# DevShelf Setup and Dependency Guide

This guide takes a new developer from a clean checkout to a running local DevShelf instance.

## 1. Prerequisites

Install Node.js 22.22+, npm 10+, Git, and optionally Docker Desktop.

Verify on Windows PowerShell:

```powershell
node --version
npm --version
git --version
```

## 2. Install dependencies

Run from the repository root:

```powershell
npm install
```

The root workspace installs dependencies for both `client` and `server`.

For coordinated Dependabot updates, follow the [dependency rollup reference](automation/07-dependency-rollup.md). Do not install the rollup with an older Node runtime and treat engine warnings as a successful validation.

### Client dependencies

- React and React DOM: UI runtime.
- Vite: development server and production bundler.
- React 19 and React DOM 19: paired UI runtime versions.
- React Router 8.3.0: page navigation. The client imports its declarative APIs from `react-router` rather than `react-router-dom`.
- Axios: API client with auth-header injection.
- React Hook Form: form composition target for future form extraction.
- Lucide React: accessible icon primitives.
- React Markdown: resource content rendering.

### Server dependencies

- Express: HTTP API.
- Helmet and CORS: secure HTTP defaults and browser access policy.
- Express Rate Limit: basic abuse protection.
- Zod: request validation.
- JSON Web Token: access-token authentication.
- bcryptjs: password hashing.
- Mongoose: persistence model boundary for MongoDB.

The current dependency baseline is Node.js 22.22+, Express 5, Vite 8, Mongoose 9, and the patched React Router 8.3.0 package.

## 3. Environment configuration

Copy the examples when local overrides are needed:

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

The demo works with defaults. Never commit real secrets. For production, replace the local JWT secret and set a real MongoDB connection string.

## 4. Start the development app

```powershell
npm run dev
```

- Client: http://localhost:5173
- API: http://localhost:5000
- API health: http://localhost:5000/api/v1/health

## 5. Start with Docker

```powershell
docker compose up --build
```

Compose starts `client`, `server`, and `mongodb`. The current demo server uses its in-memory store so it remains usable even when MongoDB is not connected; repository wiring over the existing Mongoose models is the next persistence milestone.

## 6. Demo credentials

- Admin: `admin@devshelf.dev` / `DevShelf123!`
- Contributor: `maya@devshelf.dev` / `DevShelf123!`

These credentials are for local development only.

## 7. Useful commands

```powershell
npm run build
npm test
npm run start -w server
```

## 8. Troubleshooting

- API errors: confirm the server is listening on port 5000.
- Empty admin metrics: wait for the dashboard request to load or reload the page.
- Stale local auth: use `Sign out`, then log in again.
- Port conflict: stop the process using 5000 or 5173.
- Demo data reset: restarting the server recreates the in-memory dataset.

## 9. Azure deployment

See [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md) for the Azure Static Web Apps, App Service, Cosmos DB, GitHub variables, and verification flow.
