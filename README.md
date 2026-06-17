# consumer-a (White Label Platform Blueprint)

Consumer-owned repository for the White Label Platform. Each consumer (`consumer-a`, `consumer-b`, ...) is a fork of this blueprint. Shared code — each module (`modules/module-a`, `modules/module-b`, `modules/module-c`), `packages/shared-ui`, `packages/shared-utils`, and `branding` — is pulled in as its own Git Submodule; `app`, `shell`, and `configs` are owned locally by each consumer.

See [docs/architecture.md](docs/architecture.md) for the full design and [docs/diagrams.md](docs/diagrams.md) for sequence/flow diagrams.

## Quick start

```bash
git clone --recurse-submodules <this-repo-url>
cd consumer-a
pnpm bootstrap   # init submodules, copy .env.example -> .env, pnpm install
pnpm dev         # http://localhost:3000
```

If you already cloned without `--recurse-submodules`: `pnpm submodules:init`.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the Next.js shell in dev mode |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint, including module-boundary rules |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest (shell + tests/) |
| `pnpm submodules:init` | First-time submodule checkout |
| `pnpm submodules:sync` | Pull latest commits for all submodules |

## Repository layout

```
app/        Next.js App Router entry (layout, page, error, not-found)
shell/      Consumer-owned: layouts, nav, auth, providers, module loader, state
configs/    Zod-validated consumer configuration (modules, branding, theme, auth, routes, env)
modules/
  module-a/       Git submodule — BMI Calculator, fully implemented (frontend + bff)
  module-b/       Git submodule — placeholder
  module-c/       Git submodule — placeholder
packages/
  shared-ui/      Git submodule — Button, Input, Modal, Table, Tabs, Toast, Loader, Card
  shared-utils/   Git submodule — date/number/string/storage/logger/debounce/validation
branding/   Git submodule — logos, icons, fonts, images, assets for this consumer
docs/       Architecture, module-development, onboarding, deployment, theme-system, submodule-guide, troubleshooting
.github/workflows/   ci.yml (PR), cd.yml (main → Vercel), module-deploy.yml (module/* branch → BFF container)
```

## Module isolation

Modules cannot import each other or the shell; only the shell may import a module's public `frontend/index.ts`, and only via the module loader. Enforced by `eslint-plugin-boundaries` — see [.eslintrc.json](.eslintrc.json) and [docs/architecture.md](docs/architecture.md#dependency-rules).

## Submodules

This POC wires `.gitmodules` to local sibling repos under `_submodule-sources/` so the architecture is fully runnable without external hosting. Swap in real remotes for production — see [docs/submodule-guide.md](docs/submodule-guide.md#pushing-each-submodule-to-its-own-remote) for the exact commands to push each submodule (including each module individually) to its own GitHub repo.
