"use client";

import type { MaintenanceState } from "./maintenance.service";
export type { MaintenanceState };

export async function fetchMaintenanceStateClient(): Promise<MaintenanceState> {
  const response = await fetch("/api/maintenance");
  if (!response.ok) {
    return { global: false, modules: {} };
  }
  return response.json();
}
