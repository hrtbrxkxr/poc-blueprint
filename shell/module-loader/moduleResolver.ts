import { getModule } from "./registry";
import { useMaintenance } from "../maintenance/MaintenanceProvider";
import { usePermissions } from "../state/selectors/auth.selectors";

export type ModuleResolution =
  | { status: "ready" }
  | { status: "not-found" }
  | { status: "disabled" }
  | { status: "maintenance" }
  | { status: "forbidden" };

export function useModuleResolution(moduleId: string): ModuleResolution {
  const moduleConfig = getModule(moduleId);
  const maintenance = useMaintenance();
  const permissions = usePermissions();

  if (!moduleConfig) return { status: "not-found" };
  if (moduleConfig.status === "disabled") return { status: "disabled" };
  if (moduleConfig.status === "maintenance" || maintenance.modules[moduleId]) return { status: "maintenance" };
  if (moduleConfig.requiresAuth && !moduleConfig.permissions.every((perm) => permissions.includes(perm))) {
    return { status: "forbidden" };
  }
  return { status: "ready" };
}
