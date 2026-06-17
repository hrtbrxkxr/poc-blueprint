"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useModules } from "../hooks/useModules";

export function TopbarLayout({ children }: { children: ReactNode }) {
  const modules = useModules();

  return (
    <div>
      <header style={{ display: "flex", gap: 16, padding: 16, borderBottom: "1px solid #e5e7eb" }}>
        {modules.map((module) => (
          <Link key={module.id} href={module.route}>
            {module.displayName}
          </Link>
        ))}
      </header>
      <main style={{ padding: 24 }}>{children}</main>
    </div>
  );
}
