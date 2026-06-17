import { z } from "zod";

export const themeResponseSchema = z.object({
  primaryColor: z.string(),
  secondaryColor: z.string(),
  fontFamily: z.string(),
  fontUrl: z.string().url(),
});

export type ThemeResponse = z.infer<typeof themeResponseSchema>;

export const themeConfig = {
  endpoint: "/theme",
  pollIntervalMs: 5 * 60 * 1000,
  fallback: themeResponseSchema.parse({
    primaryColor: "#2563eb",
    secondaryColor: "#22c55e",
    fontFamily: "Inter",
    fontUrl: "https://fonts.googleapis.com/css2?family=Inter",
  }),
};
