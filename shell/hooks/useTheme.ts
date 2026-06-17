import { useThemeStore } from "../state/stores/theme.store";

export function useTheme() {
  return useThemeStore((state) => state.theme);
}
