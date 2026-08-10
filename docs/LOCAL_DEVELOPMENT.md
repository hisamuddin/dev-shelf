# Local Development Runbook

This guide records the verified local build and run flow for DevShelf on Windows with VS Code and PowerShell.

## Verified status

Verified on 2026-08-11 from the repository root:

| Check | Result |
| --- | --- |
| Node.js | `v24.19.0` |
| npm | `11.17.0` |
| Dependencies | Installed successfully with optional packages |
| Server tests | 4 passed, 0 failed |
| Client production build | Passed |
| API health | Healthy on port `5000` |
| Client | HTTP 200 on port `5173` |

The demo uses the in-memory data store by default. MongoDB/Cosmos DB is not required for local startup.

## First-time setup

Open a VS Code PowerShell terminal and run:

```powershell
Set-Location "C:\Users\hisam\OneDrive\Documents\startup"
npm.cmd install --include=optional --no-audit --no-fund
```

The project requires Node.js `22.22.0` or newer. Confirm the active runtime before installing:

```powershell
node --version
npm.cmd --version
```

If PowerShell reports that `npm.ps1` is unsigned or cannot be loaded, use
`npm.cmd` for every npm command. This uses the Windows command wrapper and
does not require changing the machine execution policy:

```powershell
npm.cmd --version
npm.cmd test
npm.cmd run build
npm.cmd run dev
```

Alternatively, select **Command Prompt** as the VS Code terminal profile and
the regular `npm` command will work there.

## Test and build

Run the server tests:

```powershell
npm.cmd test
```

Build the client for production:

```powershell
npm.cmd run build
```

The build output is written to `client/dist/`.

## Start locally

From the repository root:

```powershell
npm.cmd run dev
```

This starts both processes through `concurrently`:

- API: `http://localhost:5000`
- Client: `http://localhost:5173`

Open the client at:

```text
http://localhost:5173/
```

Verify the API directly:

```powershell
Invoke-RestMethod http://localhost:5000/api/v1/health
```

Expected response data includes `"status":"healthy"`.

## Stop locally

Press `Ctrl+C` in the terminal running `npm run dev`.

If a process remains, identify listeners and stop only the local DevShelf processes:

```powershell
Get-NetTCPConnection -State Listen |
  Where-Object { $_.LocalPort -in 5000,5173,5174 } |
  Select-Object LocalPort,OwningProcess

Stop-Process -Id <process-id> -Force
```

## Port behavior

The normal ports are:

| Component | Preferred port | Behavior if occupied |
| --- | ---: | --- |
| API | `5000` | Startup fails until the port is free |
| Vite client | `5173` | Vite automatically tries `5174`, then the next available port |

Always use the URL printed by Vite in the terminal when it selects a fallback port.

## Troubleshooting

### Node engine error

The repository declares Node.js `>=22.22.0`. If `node --version` is older, update Node.js and reopen the VS Code terminal before running `npm install`.

### Missing native Rolldown binding

If the client build reports `Cannot find native binding` for Rolldown, repair optional dependencies from the repository root:

```powershell
npm.cmd install --include=optional --no-audit --no-fund
npm.cmd run build
```

### Client cannot connect to the API

Make sure `npm run dev` started both processes. Check the API first:

```powershell
Invoke-RestMethod http://localhost:5000/api/v1/health
```

If this request fails, free port `5000` and restart `npm run dev`. If the API is healthy but the browser is on another Vite port, use the exact client URL printed by Vite.

### Port already in use

Inspect the process before stopping it:

```powershell
Get-NetTCPConnection -State Listen -LocalPort 5000,5173,5174 |
  Select-Object LocalPort,OwningProcess
```

Stop only the process that belongs to this DevShelf run, then start `npm run dev` again.
