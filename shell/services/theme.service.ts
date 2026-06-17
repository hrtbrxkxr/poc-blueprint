import { themeResponseSchema, type ThemeResponse } from "@/configs/theme";
import { getEnv } from "@/configs/environment";

export async function fetchTheme(): Promise<ThemeResponse> {
  const response = await fetch(getEnv().THEME_SERVICE_URL, { next: { revalidate: 300 } });
  if (!response.ok) {
    throw new Error(`Theme fetch failed: ${response.status}`);
  }
  return themeResponseSchema.parse(await response.json());
}
