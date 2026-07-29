# Development Guide

## Repository facts

- Repository type: npm workspace monorepo with `client` and `server` packages.
- Runtime: Node.js 20+.
- Package manager: npm 10+ with the root `package-lock.json`.
- Frontend: React/Vite.
- Backend: Express/Node.js.
- Database target: MongoDB/Mongoose; runtime demo data is in memory.
- Supporting services: MongoDB through Docker Compose, optional for the current demo.

## Clone and install

```powershell
git clone https://github.com/hisamuddin/dev-shelf.git
cd dev-shelf
npm ci
```

Use `npm ci` for a clean lockfile-driven install. Use `npm install` only when intentionally changing dependencies.

## Configuration

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

The local defaults are sufficient for the demo. Do not commit `.env` files. The important variables are `PORT`, `CLIENT_URL`, `JWT_ACCESS_SECRET`, `MONGODB_URI`, `VITE_API_BASE_URL`, and `VITE_APP_NAME`; the example files are the source of truth for names.

## Start the application

```powershell
npm run dev
```

The root script starts the server on port 5000 and client on port 5173. To start only one package:

```powershell
npm run dev -w server
npm run dev -w client
```

## Docker and supporting services

```powershell
docker compose up --build
```

Compose starts `client`, `server`, and `mongodb`. The current server does not connect Mongoose to MongoDB yet, so restarting the server resets demo data.

## Debugging

- API health: `http://localhost:5000/health` and `http://localhost:5000/api/v1/health`.
- Browser UI: `http://localhost:5173`.
- Inspect the browser network panel for failed `/api/v1` requests.
- Check the server terminal for request IDs and unexpected errors.
- If auth appears stale, sign out and log in again.

## Formatting and linting

No ESLint or Prettier configuration/scripts were detected. Preserve the existing two-space JavaScript/JSON/YAML style and run `git diff --check` before committing. Add lint/format tooling in a separate reviewed change rather than silently introducing it.

## IDE guidance

Any JavaScript/React IDE with ESLint/Prettier disabled or configured from the repository files is suitable. `.editorconfig` provides baseline indentation and line-ending rules.

## Common problems

- `EADDRINUSE`: another process is using port 5000 or 5173; stop it or change the local port intentionally.
- API 401: the browser token is missing/expired; sign in again.
- Empty admin metrics: wait for the async dashboard request to finish.
- Data disappeared: expected with the current in-memory store after a server restart.
- Docker unavailable: run the local npm commands; MongoDB is not required for the demo.
