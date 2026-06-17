import { z } from "zod";

/**
 * Every server-facing field has a mock/dev default so `next build` never fails
 * just because Vault hasn't been wired up yet (e.g. a fresh Vercel project with
 * no env vars configured). Real deployments should still set these explicitly —
 * see .env.example and docs/secrets-management.md — the defaults exist purely
 * so the build/CI pipeline is never blocked on missing configuration.
 */
const environmentSchema = z.object({
  NEXT_PUBLIC_CONSUMER_ID: z.string().min(1).default("consumer-a"),
  NEXT_PUBLIC_ENV: z.enum(["development", "staging", "production"]).default("development"),
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default("http://localhost:8080"),
  THEME_SERVICE_URL: z.string().url().default("http://localhost:8080/theme"),
  AUTH_SERVICE_URL: z.string().url().default("http://localhost:8080/auth"),
  MAINTENANCE_SERVICE_URL: z.string().url().default("http://localhost:8080/maintenance"),
  NEXT_PUBLIC_MODULE_A_BFF_URL: z.string().url().default("http://localhost:4001"),
  NEXT_PUBLIC_MODULE_B_BFF_URL: z.string().url().optional(),
  NEXT_PUBLIC_MODULE_C_BFF_URL: z.string().url().optional(),
  JWT_ISSUER: z.string().min(1).default("https://auth.platform.local"),
  JWT_AUDIENCE: z.string().min(1).default("consumer-a"),
});

export type Environment = z.infer<typeof environmentSchema>;

/**
 * The server-only fields below (THEME_SERVICE_URL, AUTH_SERVICE_URL, MAINTENANCE_SERVICE_URL,
 * JWT_ISSUER, JWT_AUDIENCE) may be hydrated from Vault at server boot (see
 * shell/services/secrets.service.ts and instrumentation.ts) before this is ever read.
 * Validation is lazy and cached so it runs *after* that hydration, not at import time.
 */
let cached: Environment | undefined;

export function getEnv(): Environment {
  if (!cached) {
    cached = loadEnvironment();
  }
  return cached;
}

function loadEnvironment(): Environment {
  const parsed = environmentSchema.safeParse({
    NEXT_PUBLIC_CONSUMER_ID: process.env.NEXT_PUBLIC_CONSUMER_ID,
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    THEME_SERVICE_URL: process.env.THEME_SERVICE_URL,
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL,
    MAINTENANCE_SERVICE_URL: process.env.MAINTENANCE_SERVICE_URL,
    NEXT_PUBLIC_MODULE_A_BFF_URL: process.env.NEXT_PUBLIC_MODULE_A_BFF_URL,
    NEXT_PUBLIC_MODULE_B_BFF_URL: process.env.NEXT_PUBLIC_MODULE_B_BFF_URL,
    NEXT_PUBLIC_MODULE_C_BFF_URL: process.env.NEXT_PUBLIC_MODULE_C_BFF_URL,
    JWT_ISSUER: process.env.JWT_ISSUER,
    JWT_AUDIENCE: process.env.JWT_AUDIENCE,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid environment configuration:\n${parsed.error.issues
        .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
        .join("\n")}`,
    );
  }

  return parsed.data;
}
