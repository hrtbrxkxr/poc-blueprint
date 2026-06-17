import type { ReactNode } from "react";
import type { LayoutVariant } from "@/configs/layout";
import { SidebarLayout } from "./SidebarLayout";
import { TopbarLayout } from "./TopbarLayout";
import { DashboardLayout } from "./DashboardLayout";
import { BlankLayout } from "./BlankLayout";

const layouts: Record<LayoutVariant, (props: { children: ReactNode }) => ReactNode> = {
  sidebar: SidebarLayout,
  topbar: TopbarLayout,
  dashboard: DashboardLayout,
  blank: BlankLayout,
};

export function LayoutFactory({ variant, children }: { variant: LayoutVariant; children: ReactNode }) {
  const Layout = layouts[variant];
  return <Layout>{children}</Layout>;
}
