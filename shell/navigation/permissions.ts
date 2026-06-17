import { getModule } from "../module-loader/registry";

export function canAccessModule(moduleId: string, userPermissions: string[]): boolean {
  const moduleConfig = getModule(moduleId);
  if (!moduleConfig) return false;
  return moduleConfig.permissions.every((perm) => userPermissions.includes(perm));
}
