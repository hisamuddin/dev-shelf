# DevShelf Setup and Dependency Guide

This guide takes a new developer from a clean checkout to a running local DevShelf instance.

## 1. Prerequisites

Install Node.js 20+, npm 10+, Git, and optionally Docker Desktop.

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

### Client dependencies

- React and React DOM: UI runtime.
- Vite: development server and production bundler.
- React Router: page navigation.
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
