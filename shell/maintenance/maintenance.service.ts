import { getEnv } from "@/configs/environment";

export interface MaintenanceState {
  global: boolean;
  modules: Record<string, boolean>;
}

export async function fetchMaintenanceState(): Promise<MaintenanceState> {
  const response = await fetch(getEnv().MAINTENANCE_SERVICE_URL);
  if (!response.ok) {
    return { global: false, modules: {} };
  }
  return (await response.json()) as MaintenanceState;
}
