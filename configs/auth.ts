import { z } from "zod";

export const authConfigSchema = z.object({
  loginPath: z.string(),
  logoutPath: z.string(),
  unauthorizedRedirect: z.string(),
  tokenStorageKey: z.string(),
  refreshThresholdSeconds: z.number().positive(),
});

export type AuthConfig = z.infer<typeof authConfigSchema>;

export const authConfig: AuthConfig = authConfigSchema.parse({
  loginPath: "/login",
  logoutPath: "/logout",
  unauthorizedRedirect: "/login",
  tokenStorageKey: "platform_access_token",
  refreshThresholdSeconds: 60,
});
