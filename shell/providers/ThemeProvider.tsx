"use client";

import { useEffect, type ReactNode } from "react";
import { useThemeStore } from "../state/stores/theme.store";
import { themeToCssVariables } from "../utils/cssVariables";
import { loadFont } from "../utils/fontLoader";
import { fetchTheme } from "../services/theme.service";
import { themeConfig } from "@/configs/theme";
import type { ThemeResponse } from "@/configs/theme";

export function ThemeProvider({ initialTheme, children }: { initialTheme?: ThemeResponse; children: ReactNode }) {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    if (initialTheme) setTheme(initialTheme);
  }, [initialTheme, setTheme]);

  useEffect(() => {
    const poll = async () => {
      try {
        const next = await fetchTheme();
        setTheme(next);
      } catch {
        // keep last known theme on transient failure
      }
    };
    const interval = setInterval(poll, themeConfig.pollIntervalMs);
    return () => clearInterval(interval);
  }, [setTheme]);

  useEffect(() => {
    Object.entries(themeToCssVariables(theme)).forEach(([key, value]) =>
      document.documentElement.style.setProperty(key, value),
    );
    loadFont(theme.fontUrl, theme.fontFamily);
  }, [theme]);

  return <>{children}</>;
}
