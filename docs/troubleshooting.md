# Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Cannot find module '@platform/shared-ui'` | Submodules not initialized | `pnpm submodules:init` |
| Empty `modules/`, `branding/`, `packages/shared-*` folders | Cloned without `--recurse-submodules` | `git submodule update --init --recursive` |
| Theme flashes default colors on load | `fetchTheme()` failing server-side, falling back to `themeConfig.fallback` | Check `THEME_SERVICE_URL` in `.env` |
| Module route 404s | Module not registered in `configs/modules.ts` or no case in `shell/module-loader/loadModule.ts` | Add both |
| ESLint `boundaries/element-types` error | Cross-module or module→shell import | Re-route through `shared-ui`/`shared-utils`, or move logic into the BFF |
| `pnpm build` fails with zod validation error | Missing/invalid env var | Compare `.env` against `.env.example`, see `configs/environment.ts` |
