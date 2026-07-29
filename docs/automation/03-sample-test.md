# Sample Test: MemoryCache

## Status

This is a recommended starting point. The repository has no test files yet, so this example is intentionally documentation-only and does not modify production code or claim a test pass.

## Component selected

`server/src/cache.js` exports `MemoryCache`, a small deterministic unit with TTL, hit/miss counters, direct invalidation, and prefix invalidation. It has no database or network dependency, making it the safest first test target.

## Scenarios

- Positive: a stored, non-expired key returns its value and records a hit.
- Validation/edge: a missing key returns `undefined` and records a miss.
- Failure/expiry: an expired key is removed and treated as a miss.
- Invalidation: direct and prefix invalidation remove expected entries only.

## Arrange-Act-Assert example

```js
import test from "node:test";
import assert from "node:assert/strict";
import { MemoryCache } from "../src/cache.js";

test("returns a cached value and records a hit", () => {
  // Arrange
  const cache = new MemoryCache();
  cache.set("resources:react", { items: ["r-1"] });

  // Act
  const result = cache.get("resources:react");

  // Assert
  assert.deepEqual(result, { items: ["r-1"] });
  assert.equal(cache.stats().hits, 1);
});

test("expires a value and records a miss", async () => {
  // Arrange
  const cache = new MemoryCache();
  cache.set("short-lived", "value", 1);
  await new Promise((resolve) => setTimeout(resolve, 5));

  // Act
  const result = cache.get("short-lived");

  // Assert
  assert.equal(result, undefined);
  assert.equal(cache.stats().misses, 1);
});
```

The sample uses only the repository’s configured Node test runner and built-in assertions. Save it as `server/test/cache.test.js` when implementing the first test slice, then run `node --test server/test/cache.test.js`.
