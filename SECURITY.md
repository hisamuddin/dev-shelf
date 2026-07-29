# Security Policy

## Supported versions

This repository is an early-stage MVP. Security fixes should target the latest branch and release only; older demo snapshots are not supported.

## Reporting a vulnerability

Please do not open a public issue for a suspected vulnerability.

TODO: Configure GitHub Private Vulnerability Reporting or add the official security contact before public distribution.

Include, where safe:

- A concise description and impact.
- Affected path, endpoint, dependency, or workflow.
- Reproduction steps or a minimal proof of concept.
- Affected version/commit and environment.
- Suggested mitigation, if known.

Do not include real credentials, tokens, personal data, or production secrets in a report.

## Response expectations

The repository owner should acknowledge a report privately, assess severity, coordinate a fix, and publish a sanitized advisory only after a fix or mitigation is available.

## Security practices

- Keep secrets in environment or GitHub secret storage; never commit them.
- Use generic authentication errors and avoid sensitive logging.
- Review dependency alerts and workflow permissions.
- Treat the in-memory store and demo credentials as local-development-only.
