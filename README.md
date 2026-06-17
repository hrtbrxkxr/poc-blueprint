# White-Label Platform — Consumer Blueprint (consumer-a)

A production-ready white-label frontend platform built with **Consumer Repository + Git Submodules** (no Module Federation, no monorepo).

Each consumer is its own fork of this repository. The shell (`app/` + `shell/` + `configs/`) is owned locally by the consumer; modules, the design system, shared utilities, and branding are pulled in as independent Git Submodules and statically imported into the shell's build through the module loader.

---

## Repositories

| Repository | Description |
|---|---|
| [poc-blueprint](https://github.com/hrtbrxkxr/poc-blueprint) | **This repo** — consumer-a, the blueprint/orchestrator |
| [poc-blueprint-module-a](https://github.com/hrtbrxkxr/poc-blueprint-module-a) | Module A — BMI Calculator (frontend + BFF), fully implemented |
| [poc-blueprint-module-b](https://github.com/hrtbrxkxr/poc-blueprint-module-b) | Module B (placeholder, follows module-a's pattern) |
| [poc-blueprint-module-c](https://github.com/hrtbrxkxr/poc-blueprint-module-c) | Module C (placeholder, follows module-a's pattern) |
| [poc-blueprint-shared-ui](https://github.com/hrtbrxkxr/poc-blueprint-shared-ui) | Design system — Button, Input, Modal, Table, Tabs, Toast, Loader, Card |
| [poc-blueprint-shared-utils](https://github.com/hrtbrxkxr/poc-blueprint-shared-utils) | Utilities — date, number, string, storage, logger, debounce, validation |
| [poc-blueprint-branding](https://github.com/hrtbrxkxr/poc-blueprint-branding) | consumer-a logos, icons, fonts, images, assets |

There is no separate `shell` repository — unlike microfrontend/Module-Federation variants of this platform, the shell (`app/`, `shell/`, `configs/`) is **not** a submodule. It is consumer-local code that each fork owns and customizes directly.

---

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **pnpm** workspaces
- **Turborepo**
- **Zustand** (global state: auth, theme, app)
- **TanStack React Query**
- **Zod** (config + request validation)
- **Vitest** (+ Supertest for BFF integration tests)
- **Express** (module BFFs)
- **jose** (JWT verification via remote JWKS)
- **eslint-plugin-boundaries** (enforces module isolation)

No Module Federation, no Tailwind, no monorepo — modules are lazily `import()`-ed by `shell/module-loader/loadModule.ts` directly from their submodule path and bundled into the single shell build.

---

## Prerequisites

Make sure these are installed before you begin:

```bash
# Check Node.js version (must be >= 20)
node -v

# Install pnpm (if not installed)
npm install -g pnpm@9.12.0

# Check pnpm version
pnpm -v

# Verify SSH key is added to GitHub (required for submodules)
ssh -T git@github.com
# Expected: Hi hrtbrxkxr! You've successfully authenticated...
```

---

## Clone

### First time (clone everything at once)

```bash
git clone --recurse-submodules git@github.com:hrtbrxkxr/poc-blueprint.git
cd poc-blueprint
```

### If you already cloned without `--recurse-submodules`

```bash
git submodule update --init --recursive
# or:
pnpm submodules:init
```

---

## Install Dependencies

```bash
pnpm install
```

This installs dependencies for the shell and every submodule workspace project (`packages/shared-ui`, `packages/shared-utils`, `modules/module-a/frontend`, `modules/module-a/bff`) in one pass — see `pnpm-workspace.yaml`.

Or run the full first-time setup in one step:

```bash
pnpm bootstrap   # init submodules + copy .env.example -> .env + pnpm install
```

---

## Build

```bash
# Build the shell (also typechecks + lints via next build)
pnpm build

# Build a specific module's BFF (compiles to dist/, used by its Dockerfile)
pnpm --filter module-a-bff build
```

There's no separate "build shared packages first" step — `@platform/shared-ui` and `@platform/shared-utils` are TypeScript-source workspace packages (`workspace:*`) consumed directly by the shell's bundler; they don't need a pre-build.

---

## Run (Development)

Unlike a Module-Federation setup, the **shell and every module frontend run as one process** — modules are bundled directly into the shell. Only module BFFs run as separate services.

```bash
# Terminal 1 — Shell + all module frontends (http://localhost:3000)
pnpm dev

# Terminal 2 — Module A BFF (http://localhost:4001)
pnpm --filter module-a-bff dev
```

### Port reference

| Service | URL |
|---|---|
| Shell (includes all module frontends) | http://localhost:3000 |
| Module A — BFF | http://localhost:4001 |
| Module B — BFF | http://localhost:4002 (once implemented) |
| Module C — BFF | http://localhost:4003 (once implemented) |

Visit a module directly at `http://localhost:3000/modules/module-a`.

> **Note:** A module's BFF only needs to be running if you're exercising that module's data fetching (e.g. clicking "Calculate" in the BMI Calculator). The shell and module UI render fine without it — only the network call fails, caught by `shell/boundaries/ModuleErrorBoundary.tsx`.

---

## Test

```bash
# Shell + tests/ (root)
pnpm test

# A submodule's own tests
pnpm --filter @platform/shared-utils test
pnpm --filter module-a-bff test

# Module A's integration tests (frontend+bff, uses Supertest)
cd modules/module-a && pnpm exec vitest run
```

---

## Type Check

```bash
# Shell (app/, shell/, configs/, tests/ only — see tsconfig.json excludes)
pnpm typecheck

# A submodule, independently
pnpm --filter @platform/shared-ui typecheck
pnpm --filter module-a-bff typecheck
```

Each submodule has its own `tsconfig.json` and is typechecked independently, since each has its own dependency set (e.g. `module-a-bff` needs Express's types, `shared-ui` needs JSX).

---

## Submodule Workflow

### Pull latest changes (consumer repo + all submodules)

```bash
git pull && git submodule update --remote --merge
```

### Update a single submodule to its latest commit

```bash
git submodule update --remote --merge modules/module-a
```

### Check which commit each submodule is pinned to

```bash
git submodule status
```

### After pulling the consumer repo (if submodules are behind)

```bash
git submodule update --init --recursive
```

### Make changes to a submodule (e.g., shared-ui)

```bash
# Go into the submodule
cd packages/shared-ui

# Make your changes, then commit and push inside the submodule repo
git add .
git commit -m "feat: add new component"
git push origin main

# Come back to the consumer repo and update the pointer
cd ../..
git add packages/shared-ui
git commit -m "chore: bump shared-ui to latest"
git push origin main
```

### Push every submodule to the remote already declared in `.gitmodules`

```bash
git submodule sync --recursive && git submodule foreach 'git push -u origin main'
```

---

## Project Structure

```
poc-blueprint/                     ← You are here (consumer-a)
├── .gitmodules                    ← Submodule declarations
├── .gitignore
├── .eslintrc.json                 ← eslint-plugin-boundaries module-isolation rules
├── package.json                   ← Root scripts
├── pnpm-workspace.yaml            ← Workspace members
├── turbo.json                     ← Build pipeline
├── tsconfig.json                  ← Shell TypeScript config (paths to submodules)
├── next.config.ts
│
├── app/                           ← Next.js App Router entry
│   ├── layout.tsx                 ← fetches theme, wraps AppProvider + LayoutFactory
│   ├── page.tsx
│   ├── not-found.tsx
│   ├── error.tsx
│   └── modules/[moduleId]/page.tsx ← routes into ModuleRenderer
│
├── shell/                         ← Consumer-owned (NOT a submodule)
│   ├── layouts/                   ← SidebarLayout, TopbarLayout, DashboardLayout, BlankLayout, LayoutFactory
│   ├── navigation/                ← menu, permissions, breadcrumbs, navigation.service
│   ├── providers/                 ← AppProvider, QueryProvider, ThemeProvider, AuthProvider
│   ├── auth/                      ← AuthGuard, PermissionGuard, jwt.service, auth.service/store
│   ├── boundaries/                ← AppErrorBoundary, ModuleErrorBoundary, RouteBoundary
│   ├── maintenance/                ← MaintenanceProvider, MaintenancePage, maintenance.service
│   ├── module-loader/             ← registry, moduleResolver, loadModule, ModuleRenderer
│   ├── state/                     ← Zustand stores/selectors/actions (auth, theme, app)
│   ├── hooks/                     ← useTheme, useAuth, useModules
│   ├── services/                  ← theme.service, auth.service
│   ├── types/ constants/ utils/
│   └── README.md                  ← shell responsibilities & boundaries
│
├── configs/                       ← Zod-validated consumer configuration
│   ├── modules.ts                 ← which modules are enabled, their BFF URLs
│   ├── branding.ts  layout.ts  theme.ts  auth.ts  routes.ts  environment.ts
│
├── modules/
│   ├── module-a/                  ← [submodule] BMI Calculator, fully implemented
│   │   ├── frontend/               ← components/hooks/services/validations/constants/types
│   │   ├── bff/                    ← Express routes/services/clients/middleware/mappers (port 4001)
│   │   ├── tests/                  ← unit/integration/mocks
│   │   └── module.config.ts
│   ├── module-b/                  ← [submodule] placeholder
│   └── module-c/                  ← [submodule] placeholder
│
├── packages/
│   ├── shared-ui/                 ← [submodule] design system + Storybook
│   └── shared-utils/               ← [submodule] date/number/string/storage/logger/debounce/validation
│
├── branding/                      ← [submodule] consumer-a logos, icons, fonts, images
│
├── tests/                         ← shell-level unit/integration/mocks
├── docs/                          ← architecture, module-development, consumer-onboarding,
│                                     deployment, theme-system, submodule-guide, troubleshooting, diagrams
├── scripts/bootstrap.sh
└── .github/workflows/
    ├── ci.yml                     ← PR: lint + typecheck + test + build
    ├── cd.yml                     ← main → build shell, deploy to Vercel
    └── module-deploy.yml          ← module/<id> branch → build/test/push module BFF Docker image
```

---

## Environment Variables

Copy `.env.example` to `.env` (never commit the real file — it's gitignored):

```bash
cp .env.example .env
```

```env
# Consumer identity
NEXT_PUBLIC_CONSUMER_ID=consumer-a
NEXT_PUBLIC_ENV=development

# Backend services
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# Local dev fallback values — in staging/production these are overwritten from
# Vault at server boot, never read from here. See docs/secrets-management.md.
THEME_SERVICE_URL=http://localhost:8080/theme
AUTH_SERVICE_URL=http://localhost:8080/auth
MAINTENANCE_SERVICE_URL=http://localhost:8080/maintenance
JWT_PUBLIC_KEY_URL=http://localhost:8080/auth/.well-known/jwks.json
JWT_ISSUER=https://auth.platform.local
JWT_AUDIENCE=consumer-a

# Module BFF endpoints (consumed by the shell's module loader — not secret)
NEXT_PUBLIC_MODULE_A_BFF_URL=http://localhost:4001
NEXT_PUBLIC_MODULE_B_BFF_URL=http://localhost:4002
NEXT_PUBLIC_MODULE_C_BFF_URL=http://localhost:4003

# Vault AppRole — leave all three blank for local dev (no-op fallback to the values above)
VAULT_ADDR=https://vault.internal:8200
VAULT_ROLE_ID=
VAULT_SECRET_ID=
VAULT_SECRET_PATH=secret/data/consumer-a
```

All of these are validated lazily (on first use, after Vault hydration runs) by `configs/environment.ts#getEnv()` (Zod) — a missing or malformed value throws immediately with a clear error instead of a runtime crash later. See [docs/secrets-management.md](docs/secrets-management.md) for exactly how the Vault-managed keys get from Vault into `process.env` before the app serves a single request.

---

## Add a New Consumer

1. Fork this repository to `consumer-<name>`.
2. Point `branding/` at the new consumer's own branding repo: `git submodule set-url branding git@github.com:org/<name>-branding.git`.
3. Update `configs/branding.ts`, `NEXT_PUBLIC_CONSUMER_ID` in `.env`, and `JWT_AUDIENCE`.
4. Adjust `configs/layout.ts` (sidebar/topbar/dashboard/blank), `configs/auth.ts`, `configs/routes.ts` for the new consumer's behavior.
5. Choose which modules to enable in `configs/modules.ts`.
6. `pnpm bootstrap && pnpm dev`.

See [docs/consumer-onboarding.md](docs/consumer-onboarding.md) for the full guide.

---

## Add a New Module

1. Create a new GitHub repo, e.g. `poc-blueprint-module-d`, copying `modules/module-a`'s structure (`frontend/`, `bff/`, `tests/`, `module.config.ts`) as a starting point.
2. Add it as its own submodule:

```bash
git submodule add git@github.com:hrtbrxkxr/poc-blueprint-module-d.git modules/module-d
```

3. `pnpm-workspace.yaml` already globs `modules/*/frontend` and `modules/*/bff`, so no workspace changes are needed.
4. Add its BFF URL to `.env`:

```env
NEXT_PUBLIC_MODULE_D_BFF_URL=http://localhost:4004
```

5. Register it in `configs/modules.ts` and add a case in `shell/module-loader/loadModule.ts` pointing at `modules/module-d/frontend`.
6. Enable it for a consumer by including its `id` in that consumer's `configs/modules.ts`.

See [docs/module-development.md](docs/module-development.md) for the full guide.

---

## CI/CD

GitHub Actions workflows run automatically:

| Workflow | Trigger | What it does |
|---|---|---|
| `ci.yml` | Every PR to `main` | lint → typecheck → test → build |
| `cd.yml` | Push to `main` | Build the shell, deploy to Vercel |
| `module-deploy.yml` | Push to `module/<id>` branch | Build + test that module's BFF, build & push its Docker image to GHCR |

See [docs/deployment.md](docs/deployment.md) and [docs/diagrams.md](docs/diagrams.md) for the full CI/CD and deployment flow diagrams.

---

## Dependency Rules

```
ALLOWED
  app          →  shell, shared-ui, shared-utils, branding
  shell        →  shared-ui, shared-utils, branding, module entry points (module loader only)
  module-*     →  shared-ui, shared-utils
  module-*/frontend  →  module-*/bff  →  backend service

FORBIDDEN
  module-a         →  module-b  or  module-c     (cross-module imports)
  module-a/bff     →  module-b/bff               (cross-BFF calls)
  shared-ui / shared-utils  →  shell or modules   (shared must not know consumers)
  module-*         →  shell                       (modules must never import shell)
```

Enforced by `eslint-plugin-boundaries` — see `.eslintrc.json` and [docs/architecture.md](docs/architecture.md#dependency-rules).

---

## Troubleshooting

**Submodule directory is empty after cloning**
```bash
git submodule update --init --recursive
```

**`Cannot find module '@platform/shared-ui'`**
```bash
pnpm submodules:init
pnpm install
```

**Module route 404s**
- Confirm the module is registered in `configs/modules.ts`.
- Confirm there's a matching case in `shell/module-loader/loadModule.ts`.

**Theme flashes default colors on load**
- `THEME_SERVICE_URL` in `.env` is wrong or unreachable — `shell/services/theme.service.ts` falls back to `configs/theme.ts`'s default on fetch failure.

**`pnpm build` fails with an environment validation error**
- Compare your `.env` against `.env.example` — see `configs/environment.ts` for the exact Zod schema and required keys.

**ESLint `boundaries/element-types` error**
- You imported across a forbidden boundary (cross-module, module→shell, or shared→consumer). Re-route the logic through `shared-ui`/`shared-utils`, or move it into the BFF.

**SSH authentication fails for submodules**
```bash
# Test your SSH key
ssh -T git@github.com

# If it fails, add your key to the agent
ssh-add ~/.ssh/id_ed25519
```
