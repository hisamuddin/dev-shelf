import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
  CORS_ALLOWED_ORIGINS: z.string().optional(),
  DATABASE_MODE: z.enum(["memory", "mongo"]).default("memory"),
  MONGODB_URI: z.string().min(1).optional(),
  JWT_ACCESS_SECRET: z.string().optional(),
}).passthrough();

const parsed = environmentSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

const environment = parsed.data;
const accessSecret = environment.JWT_ACCESS_SECRET || "devshelf-local-secret";

if (environment.NODE_ENV === "production" && accessSecret.length < 32) {
  throw new Error("JWT_ACCESS_SECRET must contain at least 32 characters in production.");
}

if (environment.DATABASE_MODE === "mongo" && !environment.MONGODB_URI) {
  throw new Error("MONGODB_URI is required when DATABASE_MODE=mongo.");
}

export const config = Object.freeze({
  nodeEnv: environment.NODE_ENV,
  port: environment.PORT,
  clientUrl: environment.CLIENT_URL,
  corsOrigins: [...new Set([environment.CLIENT_URL, ...(environment.CORS_ALLOWED_ORIGINS || "").split(",").map((value) => value.trim()).filter(Boolean)])],
  databaseMode: environment.DATABASE_MODE,
  mongoUri: environment.MONGODB_URI,
  jwtAccessSecret: accessSecret,
});
