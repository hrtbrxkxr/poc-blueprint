"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchMaintenanceStateClient, type MaintenanceState } from "./maintenance.client";
import { MaintenancePage } from "./MaintenancePage";
import { MAINTENANCE_POLL_INTERVAL_MS } from "../constants";

const MaintenanceContext = createContext<MaintenanceState>({ global: false, modules: {} });

export function useMaintenance() {
  return useContext(MaintenanceContext);
}

export function MaintenanceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MaintenanceState>({ global: false, modules: {} });

  useEffect(() => {
    let active = true;
    const poll = async () => {
      const next = await fetchMaintenanceStateClient();
      if (active) setState(next);
    };
    poll();
    const interval = setInterval(poll, MAINTENANCE_POLL_INTERVAL_MS);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  if (state.global) {
    return <MaintenancePage scope="platform" />;
  }

  return <MaintenanceContext.Provider value={state}>{children}</MaintenanceContext.Provider>;
}
