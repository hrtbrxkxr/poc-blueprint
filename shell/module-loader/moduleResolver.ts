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
  const module = getModule(moduleId);
  const maintenance = useMaintenance();
  const permissions = usePermissions();

  if (!module) return { status: "not-found" };
  if (module.status === "disabled") return { status: "disabled" };
  if (module.status === "maintenance" || maintenance.modules[moduleId]) return { status: "maintenance" };
  if (module.requiresAuth && !module.permissions.every((perm) => permissions.includes(perm))) {
    return { status: "forbidden" };
  }
  return { status: "ready" };
}
