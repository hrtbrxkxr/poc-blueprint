import { getModule } from "../module-loader/registry";

export function canAccessModule(moduleId: string, userPermissions: string[]): boolean {
  const module = getModule(moduleId);
  if (!module) return false;
  return module.permissions.every((perm) => userPermissions.includes(perm));
}
