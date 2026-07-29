# Code Review Guide

## Cross-language review order

### Functional correctness

- Does the change satisfy the stated requirement and acceptance cases?
- Are business rules enforced at the server boundary rather than only in the UI?
- Are empty, loading, success, and failure states coherent?
- Are public, authenticated, contributor, and admin capabilities separated?

### Validation and errors

- Are inputs validated for shape, size, and allowed values?
- Are errors consistent and actionable without exposing stack traces?
- Are not-found, conflict, unauthorized, and forbidden cases distinguishable?
- Are asynchronous failures handled and awaited?

### Security and privacy

- Are authentication and role checks applied to every protected route?
- Are passwords, tokens, reset links, and internal moderation notes excluded from responses/logs?
- Are secrets absent from source, workflows, fixtures, screenshots, and examples?
- Are request sizes, rate limits, CORS, URL inputs, uploads, and injection risks addressed?
- Does the dependency change have a security and license impact?

### Data and performance

- Are database queries bounded, indexed, projected, and paginated?
- Are transaction boundaries and consistency rules clear?
- Could concurrency cause duplicate bookmarks, lost updates, or stale counts?
- Are cache keys deterministic and invalidated after writes?
- Does the change add unnecessary network requests or bundle weight?

### Maintainability

- Does the code respect client/server/module boundaries?
- Are names and abstractions clear without premature complexity?
- Is duplicated business logic avoided?
- Is the README/API/architecture documentation updated?
- Are migration and rollback steps documented?

## JavaScript/React-specific checks

- Promise chains and async handlers handle rejection paths.
- Inputs are validated on the server; client validation improves UX but is not authorization.
- JWT handling does not expose long-lived secrets to browser storage in production.
- React effects have correct dependencies and do not create duplicate requests.
- Route guards do not rely only on hidden navigation.
- Components expose keyboard focus, semantic labels, sufficient contrast, and usable mobile touch targets.
- Markdown, URLs, and user-submitted content are rendered safely.
- Dependency and bundle-size changes are intentional.
- State updates do not use stale closures for bookmarks, collections, or admin refreshes.

## Review evidence

A reviewer should be able to find:

- The requirement or issue.
- The changed files and architectural boundary.
- Tests or a documented test gap.
- Build output and manual smoke evidence.
- API/schema/configuration changes.
- Security, performance, deployment, and rollback notes.

## Decision labels

- Blocker: correctness, security, data loss, broken build, or missing required authorization.
- Required change: important quality issue that should be fixed before merge.
- Suggestion: optional improvement that does not block merge.
- Question: clarification needed before approval.

## Approval standard

Approve only when the behavior is correct, safe, maintainable, documented, and verified at the level appropriate for the risk.
