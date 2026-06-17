import type { ReactNode } from "react";
import "./globals.css";
import { AppProvider } from "@/shell/providers/AppProvider";
import { LayoutFactory } from "@/shell/layouts/LayoutFactory";
import { layoutConfig } from "@/configs/layout";
import { brandingConfig } from "@/configs/branding";
import { fetchTheme } from "@/shell/services/theme.service";
import { themeConfig } from "@/configs/theme";

export const metadata = {
  title: brandingConfig.displayName,
  icons: { icon: brandingConfig.logo.favicon },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const initialTheme = await fetchTheme().catch(() => themeConfig.fallback);

  return (
    <html lang="en">
      <body>
        <AppProvider initialTheme={initialTheme}>
          <LayoutFactory variant={layoutConfig.variant}>{children}</LayoutFactory>
        </AppProvider>
      </body>
    </html>
  );
}
