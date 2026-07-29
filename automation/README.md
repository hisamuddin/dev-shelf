# DevShelf Automation

This folder documents repeatable project automation. The original combined check is preserved at `.github/workflows/ci.yml`; the repository also has separate build, test, and security workflows for clearer GitHub governance.

## Automation map

```text
Pull request / push
        ↓
.github/workflows/build.yml
        ↓
.github/workflows/test.yml
        ↓
.github/workflows/security-scan.yml
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
