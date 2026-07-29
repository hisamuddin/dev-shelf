# Commit Guide

## Format

Use Conventional Commits:

~~~text
<type>(optional-scope): <description>
~~~

## Types

- feat: new user-facing behavior.
- fix: defect correction.
- docs: documentation-only changes.
- test: tests or test infrastructure.
- refactor: behavior-preserving code restructuring.
- perf: performance improvement.
- build: build or dependency changes.
- ci: workflow or automation changes.
- chore: maintenance that does not change product behavior.
- revert: revert a previous commit.

## DevShelf examples

~~~text
feat(resources): add difficulty filtering
fix(cache): invalidate public pages after publish
docs(architecture): explain MongoDB migration boundary
test(server): cover cache expiry
ci: add npm dependency audit
chore(deps): update React patch version
~~~

## Breaking changes

Use ! and explain the migration in the body:

~~~text
feat(api)!: change resource response envelope

BREAKING CHANGE: Clients must read resource data from the new response field.
~~~

## Commit discipline

- Keep commits small and coherent.
- Use an imperative description under roughly 72 characters.
- Explain why and tradeoffs in the body when the change is non-obvious.
- Reference issues with the repository's GitHub issue number when one exists.
- Run git diff --check, relevant tests, and the client build before committing.
- Never commit .env, credentials, tokens, node_modules, dist, or real user data.
- Review staged files with git status and git diff --cached before commit.

## Secret protection

If a secret is accidentally staged, stop, remove it from the index, rotate it, and report the exposure privately. Removing the file from a later commit does not make a leaked secret safe.
