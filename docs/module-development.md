# Module Development Guide

## Creating a new module

1. Create a new standalone repo for the module (e.g. `module-d`), copying `modules/module-a`'s structure as a starting point.
2. Fill in `module.config.ts` (id, displayName, route, permissions, bffPort).
3. Implement `frontend/` (components/hooks/services/validations/constants/types, exported from `frontend/index.ts`) and `bff/` (Express routes/services/clients/middleware/mappers/validations/types, entry `server.ts`).
4. Add unit tests under `tests/unit`, integration tests under `tests/integration`, mocks under `tests/mocks`.
5. In each consumer repo that wants the module: `git submodule add <module-d-repo-url> modules/module-d && git commit -m "add module-d submodule"`.
6. Register the module in the consumer's `configs/modules.ts` and add a case in `shell/module-loader/loadModule.ts`.

Each module is its own Git submodule (`modules/module-a`, `modules/module-b`, `modules/module-c` — not a shared `modules` submodule), so it can be versioned, branched, and deployed independently. To pick up new commits from an existing module's repo: `git submodule update --remote modules/module-a && git add modules/module-a && git commit -m "bump module-a"`.

## Running a module standalone (without the shell)

Each module ships its own `vite.config.ts` + `frontend/dev/` playground, so you can iterate on a module entirely on its own — no consumer repo, no shell, no auth:

```bash
cd modules/module-a            # or wherever you cloned the module's own repo
cd bff && pnpm dev             # Terminal 1 — the module's BFF
pnpm dev                       # Terminal 2, from the module root — Vite playground, http://localhost:5173
```

`frontend/dev/main.tsx` mounts the module's page component (e.g. `ModuleAPage`) directly. The BFF is only needed for real data fetching — UI/styling work alone doesn't need it. When scaffolding a brand-new module, copy `modules/module-a`'s `vite.config.ts`, `index.html`, and `frontend/dev/` as part of step 1 above so the new module gets this for free.

If the module's own repo has been cloned standalone (not as part of a consumer repo's workspace), it resolves `@hrtbrxkxr/shared-ui`/`@hrtbrxkxr/shared-utils` from GitHub Packages rather than a local workspace link — see [docs/submodule-guide.md](submodule-guide.md#run-any-submodule-independently) for the one-time `GITHUB_TOKEN` setup that requires.

## Rules

- A module frontend may only import `@hrtbrxkxr/shared-ui` and `@hrtbrxkxr/shared-utils`.
- A module BFF may only call its own backend services — never another module's BFF.
- No module may import another module's code.

## BMI Calculator reference

`modules/module-a` is a complete example: `frontend/components/BmiCalculator.tsx` calls `frontend/services/bmi.service.ts`, which POSTs to the module's own BFF (`bff/routes/bmi.routes.ts` → `bff/services/bmi.service.ts`).
