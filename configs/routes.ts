import { z } from "zod";

export const routeConfigSchema = z.object({
  path: z.string(),
  moduleId: z.string(),
  requiresAuth: z.boolean(),
  permissions: z.array(z.string()).default([]),
});

export type RouteConfig = z.infer<typeof routeConfigSchema>;

export const routeConfigs: RouteConfig[] = [
  routeConfigSchema.parse({
    path: "/modules/module-a",
    moduleId: "module-a",
    requiresAuth: true,
    permissions: ["module-a:read"],
  }),
];
