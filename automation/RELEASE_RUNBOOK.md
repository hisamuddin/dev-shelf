# Release Runbook

## Pre-release

- Confirm the target commit is merged into `main`.
- Confirm CI is green.
- Review dependency audit output.
- Verify environment variables and secrets exist in the target environment.
- Confirm database backup and rollback plan for a persisted deployment.

## Release

```powershell
git fetch origin
git checkout main
git pull --ff-only origin main
git tag -a v0.1.0 -m "DevShelf MVP release"
git push origin v0.1.0
```

Use a different version after the first release. Do not force-push release tags.

## Smoke test after release

1. Open the public homepage.
2. Search for `React`.
3. Open a resource detail page.
4. Log in with a non-admin test account.
5. Create a test submission if the environment allows it.
6. Verify admin moderation and publishing.
7. Check `/health` and `/api/v1/health`.
8. Confirm logs contain request IDs and no secrets.

## Rollback

- Prefer reverting the release commit through a reviewed PR.
- If a deployment is broken, redeploy the last known-good tag.
- For database changes, execute the documented down migration or restore the approved backup.
- Record the incident, impact, timeline, and follow-up actions.
