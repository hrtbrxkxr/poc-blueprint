import type { ReactNode } from "react";
import { AppErrorBoundary } from "./AppErrorBoundary";

export function RouteBoundary({ children }: { children: ReactNode }) {
  return <AppErrorBoundary>{children}</AppErrorBoundary>;
}
