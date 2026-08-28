import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI required").optional(),
  CLERK_SECRET_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_STREAM_API_KEY: z.string().min(1).optional(),
  STREAM_API_KEY: z.string().min(1).optional(),
  STREAM_API_SECRET: z.string().min(1).optional(),
  SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  INNGEST_EVENT_KEY: z.string().optional(),
  INNGEST_SIGNING_KEY: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

// Build-time: allow missing env (for `next build` without secrets) — warn instead of throw
const parsed = envSchema.safeParse(process.env);
if (!parsed.success && process.env.NODE_ENV === "production" && !process.env.CI) {
  console.warn("[env] validation warnings:", parsed.error.flatten().fieldErrors);
}

export const env = {
  MONGODB_URI: process.env.MONGODB_URI ?? "",
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ?? "",
  STREAM_API_KEY: process.env.NEXT_PUBLIC_STREAM_API_KEY ?? process.env.STREAM_API_KEY ?? "",
  STREAM_API_SECRET: process.env.STREAM_API_SECRET ?? "",
  SENTRY_DSN: process.env.SENTRY_DSN ?? "",
  INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY ?? "",
  INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY ?? "",
  NODE_ENV: process.env.NODE_ENV ?? "development",
} as const;

export function assertEnv(name: keyof typeof env) {
  if (!env[name]) throw new Error(`Missing env: ${name}`);
  return env[name];
}
