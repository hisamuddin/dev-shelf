import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { config } from "./config.js";

const secret = config.jwtAccessSecret;

export const issueToken = (user) => jwt.sign({ sub: user.id, role: user.role, name: user.name }, secret, { expiresIn: "2h", jwtid: randomUUID() });

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  try { if (!header.startsWith("Bearer ")) throw new Error("missing"); req.user = jwt.verify(header.slice(7), secret); next(); } catch { res.status(401).json({ success: false, message: "Please sign in to continue.", requestId: req.id }); }
};

export const requireRole = (...roles) => (req, res, next) => roles.includes(req.user?.role) ? next() : res.status(403).json({ success: false, message: "You do not have access to this area.", requestId: req.id });
