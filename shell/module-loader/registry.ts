import { moduleConfigs, type ModuleConfig } from "@/configs/modules";

const registry = new Map<string, ModuleConfig>(moduleConfigs.map((module) => [module.id, module]));

export function registerModule(module: ModuleConfig) {
  registry.set(module.id, module);
}

export function getModule(id: string): ModuleConfig | undefined {
  return registry.get(id);
}

export function listModules(): ModuleConfig[] {
  return Array.from(registry.values());
}
