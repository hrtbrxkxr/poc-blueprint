import { create } from "zustand";
import type { ThemeState } from "../../types/theme.types";
import { themeConfig } from "@/configs/theme";

interface ThemeStoreState {
  theme: ThemeState;
  setTheme: (theme: ThemeState) => void;
}

export const useThemeStore = create<ThemeStoreState>((set) => ({
  theme: themeConfig.fallback,
  setTheme: (theme) => set({ theme }),
}));
