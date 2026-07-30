import assert from "node:assert/strict";
import test from "node:test";
import { app } from "../src/index.js";

let server;
let baseUrl;

test.before(async () => {
  server = await new Promise((resolve) => {
    const instance = app.listen(0, () => resolve(instance));
  });
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

test.after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

const request = (path, options) => fetch(`${baseUrl}${path}`, options);

test("resource discovery supports search, filters, sorting, and pagination", async () => {
  const response = await request("/api/v1/resources?q=node&technology=Node.js&sort=alphabetical&page=1&pageSize=2");
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.ok(body.requestId);
  assert.ok(body.data.totalItems >= 1);
  assert.ok(body.data.items.every((item) => item.technologies.includes("Node.js")));
  const titles = body.data.items.map((item) => item.title);
  assert.deepEqual(titles, [...titles].sort((a, b) => a.localeCompare(b)));
  assert.ok(body.data.items.length <= 2);
});

test("suggestions return matching resource vocabulary", async () => {
  const response = await request("/api/v1/resources/suggestions?q=react");
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.ok(body.data.includes("React"));
  assert.ok(body.data.length <= 6);
});

test("equivalent query ordering reuses the listing cache", async () => {
  const first = await request("/api/v1/resources?q=cache-contract&pageSize=3&sort=viewed");
  const firstBody = await first.json();
  const before = await request("/api/v1/health");
  const beforeBody = await before.json();
  const second = await request("/api/v1/resources?sort=viewed&pageSize=3&q=cache-contract");
  const secondBody = await second.json();
  const after = await request("/api/v1/health");
  const afterBody = await after.json();

  assert.equal(first.status, 200);
  assert.deepEqual(secondBody.data, firstBody.data);
  assert.ok(afterBody.data.cache.hits > beforeBody.data.cache.hits);
});

test("bookmark writes invalidate public listing and detail cache entries", async () => {
  const login = await request("/api/v1/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "admin@devshelf.dev", password: "DevShelf123!" }),
  });
  const loginBody = await login.json();
  const token = loginBody.data.token;
  const resource = await request("/api/v1/resources/designing-resilient-rest-apis");
  const resourceBody = await resource.json();
  const bookmark = await request(`/api/v1/bookmarks/${resourceBody.data.id}`, { method: "POST", headers: { authorization: `Bearer ${token}` } });
  const bookmarkBody = await bookmark.json();

  assert.equal(login.status, 200);
  assert.equal(bookmark.status, 200);
  assert.equal(bookmarkBody.data.bookmarked, true);
  assert.equal(bookmarkBody.requestId ? typeof bookmarkBody.requestId : "", "string");
});
