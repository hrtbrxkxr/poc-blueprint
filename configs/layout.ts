import { z } from "zod";

export const layoutVariantSchema = z.enum(["sidebar", "topbar", "dashboard", "blank"]);
export type LayoutVariant = z.infer<typeof layoutVariantSchema>;

export const layoutConfigSchema = z.object({
  variant: layoutVariantSchema,
  collapsibleSidebar: z.boolean().default(true),
  showBreadcrumbs: z.boolean().default(true),
});

export type LayoutConfig = z.infer<typeof layoutConfigSchema>;

export const layoutConfig: LayoutConfig = layoutConfigSchema.parse({
  variant: "sidebar",
  collapsibleSidebar: true,
  showBreadcrumbs: true,
});
