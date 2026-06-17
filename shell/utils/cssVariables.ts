import type { ThemeState } from "../types/theme.types";

export function themeToCssVariables(theme: ThemeState): Record<string, string> {
  return {
    "--color-primary": theme.primaryColor,
    "--color-secondary": theme.secondaryColor,
    "--font-family": theme.fontFamily,
  };
}

export function cssVariablesToStyleString(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join(" ");
}
