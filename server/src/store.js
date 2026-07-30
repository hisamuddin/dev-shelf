import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const resourceSeeds = [
  ["Designing resilient REST APIs", "A practical field guide to versioning, idempotency, pagination, and errors.", "REST APIs", "Intermediate", "API & Backend", "Maya Patel", ["Node.js", "Express", "Architecture"], "# version your contracts\n\nA stable API starts with explicit boundaries. Prefer additive changes and document error envelopes."],
  ["React performance patterns", "A focused collection of patterns for keeping React interfaces fast as they grow.", "Article", "Intermediate", "Frontend", "Noah Williams", ["React", "JavaScript", "Performance"], "## Render less, learn more\n\nUse memoization at meaningful boundaries and profile before optimizing."],
  ["System design interview map", "A visual route through the concepts that show up in senior engineering interviews.", "Roadmap", "Advanced", "System Design", "Aarav Mehta", ["System Design", "Interview", "Distributed Systems"], "### The loop\n\nStart with requirements, estimate load, draw the core path, then expose the bottleneck."],
  ["Docker commands worth remembering", "A compact, project-ready cheat sheet for images, containers, and Compose.", "Cheat Sheet", "Beginner", "DevOps", "Priya Sharma", ["Docker", "CLI", "DevOps"], "```bash\ndocker compose up --build\ndocker compose logs -f api\n```\n\nKeep commands close to the workflow they support."],
  ["TypeScript starter kit", "A small, opinionated foundation for shipping typed frontend features quickly.", "Starter Template", "Intermediate", "TypeScript", "Leo Martins", ["TypeScript", "Vite", "Tooling"], "## Start with boundaries\n\nTypes should make incorrect states harder to represent, not add ceremony."],
  ["MongoDB aggregation recipes", "Useful pipelines for analytics, leaderboards, and moderation dashboards.", "Database Query", "Advanced", "Data & Databases", "Sara Khan", ["MongoDB", "Aggregation", "Analytics"], "```js\n[{ $group: { _id: '$status', count: { $sum: 1 } } }]\n```"],
  ["Git branch hygiene", "A collaborative branch workflow that keeps small teams moving without ceremony.", "Developer Tool", "Beginner", "Git & GitHub", "Owen Carter", ["Git", "GitHub", "Teamwork"], "## Small branches, clear intent\n\nA branch should tell one story and be easy to review."],
  ["Accessible component checklist", "A concise QA pass for keyboard, focus, contrast, labels, and motion.", "Checklist", "Intermediate", "Frontend", "Isha Rao", ["Accessibility", "UI", "Quality"], "### Before you ship\n\nTab through the experience. If the focus path is confusing, the interface is not finished."],
  ["JavaScript event loop visualized", "Understand microtasks, macrotasks, and why async code sometimes surprises you.", "Learning Resource", "Intermediate", "JavaScript", "Ethan Brooks", ["JavaScript", "Async", "Fundamentals"], "## Queue the work\n\nThe event loop is a scheduling model, not a second thread."],
  ["Interview-ready SQL patterns", "Window functions, joins, and data-shaping patterns for real coding rounds.", "Interview Prep", "Advanced", "Interview Prep", "DevShelf Team", ["SQL", "Interview", "Data"], "```sql\nselect *, row_number() over (partition by team order by score desc)\nfrom scores;\n```"],
].map(([title, description, type, difficulty, category, contributor, technologies, content], index) => ({
  id: `r-${index + 1}`, title, slug: slugify(title), description, type, difficulty, category, contributor, contributorId: `u-${(index % 5) + 2}`, technologies, tags: technologies, content, status: "published", featured: index < 3, verified: index < 6, views: 1200 - index * 73, bookmarks: 140 - index * 7, rating: 4.7 - index * 0.08, publishedAt: new Date(Date.now() - index * 86_400_000).toISOString(),
}));

const users = [
  { id: "u-1", name: "DevShelf Admin", username: "admin", email: "admin@devshelf.dev", role: "admin", passwordHash: bcrypt.hashSync("DevShelf123!", 10), bio: "Keeping the shelf useful.", bookmarks: [], collections: [] },
  ...[["Maya Patel", "maya"], ["Noah Williams", "noah"], ["Aarav Mehta", "aarav"], ["Priya Sharma", "priya"], ["Leo Martins", "leo"]].map(([name, emailName], index) => ({ id: `u-${index + 2}`, name, username: name.toLowerCase().replace(" ", "."), email: `${emailName}@devshelf.dev`, role: "contributor", passwordHash: bcrypt.hashSync("DevShelf123!", 10), bio: "Builder, learner, and generous documenter.", bookmarks: [], collections: [] })),
];

const submissions = [
  { id: "s-1", title: "Production Node.js checklist", category: "API & Backend", difficulty: "Advanced", description: "A pre-flight checklist for reliable Node.js services.", technologies: ["Node.js", "Observability"], status: "submitted", contributorId: "u-2", contributor: "Maya Patel", updatedAt: new Date().toISOString() },
  { id: "s-2", title: "CSS layout patterns", category: "Frontend", difficulty: "Intermediate", description: "A practical map of grid and flexbox decisions.", technologies: ["CSS", "UI"], status: "changes_requested", contributorId: "u-3", contributor: "Noah Williams", updatedAt: new Date(Date.now() - 86_400_000).toISOString(), reviewNote: "Add browser support notes and a live example." },
];

export const store = {
  users, resources: resourceSeeds, submissions,
  findUserByEmail(email) { return users.find((user) => user.email.toLowerCase() === email.toLowerCase()); },
  getUser(id) { return users.find((user) => user.id === id); },
  publicResources({ q = "", difficulty = "", category = "", technology = "", type = "", tag = "", featured = "", verified = "", sort = "recent", page = 1, pageSize = 8 } = {}) {
    const query = String(q).trim().toLowerCase();
    const normalise = (value) => String(value || "").trim().toLowerCase();
    const matchesBoolean = (value, expected) => value === "" || value === undefined || value === null || (value === true ? expected : value === false ? !expected : normalise(value) === String(expected));
    const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
    const safePageSize = Math.min(50, Math.max(1, Number.parseInt(pageSize, 10) || 8));
    const filtered = resourceSeeds.filter((r) => {
      const searchable = [r.title, r.description, r.detailedDescription, r.category, r.type, r.contributor, r.content, ...r.technologies, ...(r.tags || [])].filter(Boolean).join(" ").toLowerCase();
      return r.status === "published" && (!query || searchable.includes(query)) && (!difficulty || normalise(r.difficulty) === normalise(difficulty)) && (!category || normalise(r.category) === normalise(category)) && (!technology || r.technologies.some((item) => normalise(item) === normalise(technology))) && (!type || normalise(r.type) === normalise(type)) && (!tag || (r.tags || []).some((item) => normalise(item) === normalise(tag))) && matchesBoolean(featured, r.featured) && matchesBoolean(verified, r.verified);
    });
    const sorters = {
      recent: (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt),
      viewed: (a, b) => b.views - a.views,
      bookmarked: (a, b) => b.bookmarks - a.bookmarks,
      rated: (a, b) => b.rating - a.rating,
      alphabetical: (a, b) => a.title.localeCompare(b.title),
      trending: (a, b) => (b.views + b.bookmarks * 4 + b.rating * 100) - (a.views + a.bookmarks * 4 + a.rating * 100),
    };
    filtered.sort(sorters[sort] || sorters.recent);
    const start = (safePage - 1) * safePageSize;
    return { items: filtered.slice(start, start + safePageSize), totalItems: filtered.length, totalPages: Math.max(1, Math.ceil(filtered.length / safePageSize)), page: safePage, pageSize: safePageSize, sort: sorters[sort] ? sort : "recent" };
  },
  resourceSuggestions(q = "", limit = 6) {
    const query = String(q).trim().toLowerCase();
    if (!query) return [];
    const values = resourceSeeds.flatMap((resource) => [resource.title, resource.category, resource.type, resource.contributor, ...resource.technologies, ...(resource.tags || [])]);
    return [...new Set(values.filter((value) => value.toLowerCase().includes(query)))].slice(0, Math.min(10, Math.max(1, Number.parseInt(limit, 10) || 6)));
  },
  getResource(slug) { return resourceSeeds.find((r) => r.slug === slug && r.status === "published"); },
  createUser({ name, email, password }) { const user = { id: `u-${randomUUID()}`, name, username: slugify(name), email, role: "user", passwordHash: bcrypt.hashSync(password, 10), bio: "New to the shelf.", bookmarks: [], collections: [] }; users.push(user); return user; },
  toggleBookmark(userId, resourceId) { const user = this.getUser(userId); const resource = resourceSeeds.find((item) => item.id === resourceId); if (!user || !resource) return null; const exists = user.bookmarks.includes(resourceId); user.bookmarks = exists ? user.bookmarks.filter((id) => id !== resourceId) : [...user.bookmarks, resourceId]; resource.bookmarks += exists ? -1 : 1; return !exists; },
  createCollection(userId, name) { const user = this.getUser(userId); const collection = { id: `c-${randomUUID()}`, name, resourceIds: [], createdAt: new Date().toISOString() }; user.collections.push(collection); return collection; },
  addToCollection(userId, collectionId, resourceId) { const collection = this.getUser(userId).collections.find((item) => item.id === collectionId); if (!collection.resourceIds.includes(resourceId)) collection.resourceIds.push(resourceId); return collection; },
  createSubmission(userId, input) { const user = this.getUser(userId); const submission = { id: `s-${randomUUID()}`, ...input, status: "draft", contributorId: userId, contributor: user.name, updatedAt: new Date().toISOString() }; submissions.unshift(submission); return submission; },
  updateSubmission(userId, id, input) { const item = submissions.find((submission) => submission.id === id && submission.contributorId === userId); if (!item) return null; Object.assign(item, input, { updatedAt: new Date().toISOString() }); return item; },
  submitSubmission(userId, id) { const item = submissions.find((submission) => submission.id === id && submission.contributorId === userId); if (!item) return null; item.status = "submitted"; item.updatedAt = new Date().toISOString(); return item; },
};
