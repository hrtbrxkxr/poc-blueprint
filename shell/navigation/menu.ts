import { listModules } from "../module-loader/registry";

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
}

export function buildMenu(): MenuItem[] {
  return listModules()
    .filter((module) => module.status === "enabled")
    .map((module) => ({ id: module.id, label: module.displayName, href: module.route, icon: module.icon }));
}
