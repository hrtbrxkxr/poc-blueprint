import type { ReactNode } from "react";
import type { ThemeResponse } from "@/configs/theme";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { AuthProvider } from "./AuthProvider";
import { MaintenanceProvider } from "../maintenance/MaintenanceProvider";
import { AppErrorBoundary } from "../boundaries/AppErrorBoundary";

export function AppProvider({ initialTheme, children }: { initialTheme?: ThemeResponse; children: ReactNode }) {
  return (
    <AppErrorBoundary>
      <QueryProvider>
        <ThemeProvider initialTheme={initialTheme}>
          <AuthProvider>
            <MaintenanceProvider>{children}</MaintenanceProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    </AppErrorBoundary>
  );
}
