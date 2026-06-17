import { z } from "zod";

export const moduleStatusSchema = z.enum(["enabled", "disabled", "maintenance"]);

export const moduleConfigSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  route: z.string(),
  bffUrl: z.string().url(),
  requiresAuth: z.boolean(),
  permissions: z.array(z.string()).default([]),
  status: moduleStatusSchema,
  icon: z.string().optional(),
});

export type ModuleConfig = z.infer<typeof moduleConfigSchema>;

export const moduleConfigs: ModuleConfig[] = [
  moduleConfigSchema.parse({
    id: "module-a",
    displayName: "BMI Calculator",
    route: "/modules/module-a",
    bffUrl: process.env.NEXT_PUBLIC_MODULE_A_BFF_URL ?? "http://localhost:4001",
    requiresAuth: true,
    permissions: ["module-a:read"],
    status: "enabled",
    icon: "activity",
  }),
];
