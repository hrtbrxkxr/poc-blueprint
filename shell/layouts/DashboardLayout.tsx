"use client";

import type { ReactNode } from "react";
import { SidebarLayout } from "./SidebarLayout";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarLayout>
      <div style={{ display: "grid", gap: 16 }}>{children}</div>
    </SidebarLayout>
  );
}
