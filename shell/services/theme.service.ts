import { themeResponseSchema, type ThemeResponse } from "@/configs/theme";
import { env } from "@/configs/environment";

export async function fetchTheme(): Promise<ThemeResponse> {
  const response = await fetch(env.THEME_SERVICE_URL, { next: { revalidate: 300 } });
  if (!response.ok) {
    throw new Error(`Theme fetch failed: ${response.status}`);
  }
  return themeResponseSchema.parse(await response.json());
}
