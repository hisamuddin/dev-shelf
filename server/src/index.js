import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { store } from "./store.js";
import { MemoryCache } from "./cache.js";
import { issueToken, requireAuth, requireRole } from "./auth.js";

const app = express();
const cache = new MemoryCache(45_000);
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false }));
app.use((req, res, next) => { req.id = randomUUID(); res.setHeader("X-Request-Id", req.id); next(); });

const ok = (res, data, message = "Success", meta) => res.json({ success: true, message, data, ...(meta ? { meta } : {}) });
const fail = (res, status, message, errors) => res.status(status).json({ success: false, message, ...(errors ? { errors } : {}) });
const publicUser = ({ passwordHash, ...user }) => user;
const resourceInput = z.object({ title: z.string().min(5).max(150), description: z.string().min(20).max(300), category: z.string().min(2), difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]), technologies: z.array(z.string()).min(1), content: z.string().min(20) });

app.get("/health", (req, res) => ok(res, { status: "healthy", database: "demo-memory", uptime: process.uptime(), timestamp: new Date().toISOString(), environment: process.env.NODE_ENV || "development" }));
app.get("/api/v1/health", (req, res) => ok(res, { status: "healthy", cache: cache.stats() }));

app.post("/api/v1/auth/register", (req, res) => { const parsed = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8) }).safeParse(req.body); if (!parsed.success) return fail(res, 422, "Please check the highlighted fields.", parsed.error.issues); if (store.findUserByEmail(parsed.data.email)) return fail(res, 409, "An account with this email already exists."); const user = store.createUser(parsed.data); return ok(res, { user: publicUser(user), token: issueToken(user) }, "Welcome to DevShelf."); });
app.post("/api/v1/auth/login", (req, res) => { const user = store.findUserByEmail(req.body.email || ""); if (!user || !bcrypt.compareSync(req.body.password || "", user.passwordHash)) return fail(res, 401, "Email or password is incorrect."); return ok(res, { user: publicUser(user), token: issueToken(user) }, "Welcome back."); });
app.get("/api/v1/auth/me", requireAuth, (req, res) => { const user = store.getUser(req.user.sub); return user ? ok(res, { user: publicUser(user) }) : fail(res, 404, "User not found."); });

app.get("/api/v1/resources", (req, res) => { const key = `resources:${JSON.stringify(req.query)}`; const cached = cache.get(key); if (cached) return ok(res, cached, "Resources fetched from cache."); const data = store.publicResources({ q: req.query.q, difficulty: req.query.difficulty, category: req.query.category, page: Number(req.query.page || 1), pageSize: Number(req.query.pageSize || 8) }); cache.set(key, data); return ok(res, data, "Resources fetched successfully."); });
app.get("/api/v1/resources/featured", (req, res) => { const data = store.resources.filter((r) => r.featured && r.status === "published"); return ok(res, data); });
app.get("/api/v1/resources/trending", (req, res) => ok(res, [...store.resources].filter((r) => r.status === "published").sort((a, b) => b.views - a.views).slice(0, 5)));
app.get("/api/v1/resources/:slug", (req, res) => { const key = `resource:${req.params.slug}`; const cached = cache.get(key); if (cached) return ok(res, cached); const resource = store.getResource(req.params.slug); return resource ? (cache.set(key, resource), ok(res, resource)) : fail(res, 404, "Resource not found."); });
app.get("/api/v1/categories", (req, res) => { const counts = {}; store.resources.forEach((r) => { counts[r.category] = (counts[r.category] || 0) + 1; }); return ok(res, Object.entries(counts).map(([name, count]) => ({ name, count }))); });

app.get("/api/v1/bookmarks", requireAuth, (req, res) => ok(res, store.getUser(req.user.sub)?.bookmarks.map((id) => store.resources.find((r) => r.id === id)).filter(Boolean) || []));
app.post("/api/v1/bookmarks/:resourceId", requireAuth, (req, res) => { const resource = store.resources.find((r) => r.id === req.params.resourceId); if (!resource) return fail(res, 404, "Resource not found."); const bookmarked = store.toggleBookmark(req.user.sub, resource.id); cache.invalidatePrefix("resources:"); return ok(res, { bookmarked }, bookmarked ? "Saved to your shelf." : "Removed from your shelf."); });
app.get("/api/v1/collections", requireAuth, (req, res) => ok(res, store.getUser(req.user.sub)?.collections || []));
app.post("/api/v1/collections", requireAuth, (req, res) => { if (!req.body.name?.trim()) return fail(res, 422, "Collection name is required."); return ok(res, store.createCollection(req.user.sub, req.body.name.trim()), "Collection created."); });
app.post("/api/v1/collections/:id/resources", requireAuth, (req, res) => ok(res, store.addToCollection(req.user.sub, req.params.id, req.body.resourceId), "Added to collection."));

app.get("/api/v1/submissions/mine", requireAuth, (req, res) => ok(res, store.submissions.filter((s) => s.contributorId === req.user.sub)));
app.post("/api/v1/submissions", requireAuth, (req, res) => { const parsed = resourceInput.safeParse(req.body); if (!parsed.success) return fail(res, 422, "Please complete all required fields.", parsed.error.issues); return ok(res, store.createSubmission(req.user.sub, parsed.data), "Draft saved."); });
app.patch("/api/v1/submissions/:id", requireAuth, (req, res) => ok(res, store.updateSubmission(req.user.sub, req.params.id, req.body), "Draft updated."));
app.post("/api/v1/submissions/:id/submit", requireAuth, (req, res) => ok(res, store.submitSubmission(req.user.sub, req.params.id), "Sent to the review queue."));

app.get("/api/v1/admin/dashboard", requireAuth, requireRole("admin"), (req, res) => ok(res, { resources: store.resources.length, published: store.resources.filter((r) => r.status === "published").length, pending: store.submissions.filter((s) => s.status === "submitted").length, contributors: store.users.filter((u) => u.role === "contributor").length, cache: cache.stats() }));
app.get("/api/v1/admin/submissions", requireAuth, requireRole("admin"), (req, res) => ok(res, store.submissions));
app.post("/api/v1/admin/submissions/:id/:action(approve|reject|request_changes)", requireAuth, requireRole("admin"), (req, res) => { const submission = store.submissions.find((s) => s.id === req.params.id); if (!submission) return fail(res, 404, "Submission not found."); const actions = { approve: "approved", reject: "rejected", request_changes: "changes_requested" }; submission.status = actions[req.params.action]; submission.reviewNote = req.body.note || (submission.status === "rejected" ? "Please revise and resubmit." : "Looks good. Ready to publish."); submission.updatedAt = new Date().toISOString(); return ok(res, submission, "Moderation action recorded."); });
app.post("/api/v1/admin/submissions/:id/publish", requireAuth, requireRole("admin"), (req, res) => { const submission = store.submissions.find((s) => s.id === req.params.id); if (!submission) return fail(res, 404, "Submission not found."); submission.status = "published"; const resource = { id: `r-${randomUUID()}`, slug: submission.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), ...submission, type: "Community Resource", content: `## ${submission.title}\n\n${submission.description}`, contributorId: submission.contributorId, views: 0, bookmarks: 0, rating: 5, featured: false, publishedAt: new Date().toISOString() }; store.resources.unshift(resource); cache.invalidatePrefix("resources:"); return ok(res, resource, "Resource published and public cache invalidated."); });
app.get("/api/v1/admin/cache/stats", requireAuth, requireRole("admin"), (req, res) => ok(res, cache.stats()));

app.use((err, req, res, next) => { console.error(`[${req.id}]`, err); fail(res, 500, "Something went wrong. Try again shortly."); });
const port = Number(process.env.PORT || 5000);
if (process.env.NODE_ENV !== "test") app.listen(port, () => console.log(`DevShelf API listening on http://localhost:${port}`));
export { app };
