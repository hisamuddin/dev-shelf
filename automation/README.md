# DevShelf Automation

This folder documents repeatable project automation. Machine-executed CI lives in `.github/workflows/ci.yml`; this folder explains what it does, how to run equivalent checks locally, and how releases should be handled.

## Automation map

```text
Pull request / push
        ↓
.github/workflows/ci.yml
        ↓
npm ci → npm test → npm run build
        ↓
review gates → merge → release checklist
```

## Principles

- Fail fast on dependency or build errors.
- Keep CI deterministic with `npm ci` and the committed lockfile.
- Run cheap checks before expensive integration checks.
- Never put production secrets in workflow files.
- Use GitHub environment secrets for deployment credentials.
- Keep deployment separate from pull-request validation until the release gate is approved.

## Local equivalent

```powershell
npm ci
npm test
npm run build
```

See [CI pipeline](CI_PIPELINE.md) and [release runbook](RELEASE_RUNBOOK.md).
