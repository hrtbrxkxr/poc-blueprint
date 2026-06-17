"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useModules } from "../hooks/useModules";

export function SidebarLayout({ children }: { children: ReactNode }) {
  const modules = useModules();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 240, borderRight: "1px solid #e5e7eb", padding: 16 }}>
        <nav>
          {modules.map((module) => (
            <Link key={module.id} href={module.route} style={{ display: "block", padding: "8px 0" }}>
              {module.displayName}
            </Link>
          ))}
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 24 }}>{children}</main>
    </div>
  );
}
