import { z } from "zod";

export const brandingConfigSchema = z.object({
  consumerId: z.string(),
  displayName: z.string(),
  logo: z.object({
    light: z.string(),
    dark: z.string(),
    favicon: z.string(),
  }),
  supportEmail: z.string().email(),
});

export type BrandingConfig = z.infer<typeof brandingConfigSchema>;

export const brandingConfig: BrandingConfig = brandingConfigSchema.parse({
  consumerId: "consumer-a",
  displayName: "Consumer A",
  logo: {
    light: "/branding/logos/consumer-a-light.svg",
    dark: "/branding/logos/consumer-a-dark.svg",
    favicon: "/branding/icons/favicon.ico",
  },
  supportEmail: "support@consumer-a.example.com",
});
