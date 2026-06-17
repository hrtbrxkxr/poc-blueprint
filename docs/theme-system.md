# Dynamic Theme System

Theme is owned by the backend, not the repo. `GET /theme` returns:

```json
{
  "primaryColor": "#2563eb",
  "secondaryColor": "#22c55e",
  "fontFamily": "CompanyFont",
  "fontUrl": "https://cdn.company.com/company-font.woff2"
}
```

## Flow

```mermaid
sequenceDiagram
    participant Server as Next.js Server (RootLayout)
    participant API as Theme Service
    participant Client as ThemeProvider (browser)

    Server->>API: GET /theme (ISR, revalidate 300s)
    API-->>Server: ThemeResponse
    Server->>Client: initialTheme prop (SSR, avoids FOUC)
    Client->>Client: apply CSS variables + load font
    loop every 5 minutes
        Client->>API: GET /theme
        API-->>Client: ThemeResponse
        Client->>Client: re-apply if changed
    end
```

## Implementation

- `shell/services/theme.service.ts#fetchTheme` — typed fetch validated by `configs/theme.ts#themeResponseSchema`.
- `shell/providers/ThemeProvider.tsx` — receives SSR `initialTheme`, polls client-side, writes `--color-primary`/`--color-secondary`/`--font-family` via `shell/utils/cssVariables.ts`, loads the font via `shell/utils/fontLoader.ts`.
- `shell/hooks/useTheme.ts` — read access for any component.
