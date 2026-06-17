import type { ComponentType } from "react";

type ModuleLoader = () => Promise<{ default: ComponentType<{ bffUrl: string }> }>;

const loaders: Record<string, ModuleLoader> = {
  "module-a": () =>
    import("../../modules/module-a/frontend").then((mod) => ({
      default: mod.ModuleAPage as ComponentType<{ bffUrl: string }>,
    })),
};

export function loadModule(moduleId: string): ModuleLoader | undefined {
  return loaders[moduleId];
}
