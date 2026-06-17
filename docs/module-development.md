# Module Development Guide

## Creating a new module

1. Create a new standalone repo for the module (e.g. `module-d`), copying `modules/module-a`'s structure as a starting point.
2. Fill in `module.config.ts` (id, displayName, route, permissions, bffPort).
3. Implement `frontend/` (components/hooks/services/validations/constants/types, exported from `frontend/index.ts`) and `bff/` (Express routes/services/clients/middleware/mappers/validations/types, entry `server.ts`).
4. Add unit tests under `tests/unit`, integration tests under `tests/integration`, mocks under `tests/mocks`.
5. In each consumer repo that wants the module: `git submodule add <module-d-repo-url> modules/module-d && git commit -m "add module-d submodule"`.
6. Register the module in the consumer's `configs/modules.ts` and add a case in `shell/module-loader/loadModule.ts`.

Each module is its own Git submodule (`modules/module-a`, `modules/module-b`, `modules/module-c` — not a shared `modules` submodule), so it can be versioned, branched, and deployed independently. To pick up new commits from an existing module's repo: `git submodule update --remote modules/module-a && git add modules/module-a && git commit -m "bump module-a"`.

## Rules

- A module frontend may only import `@platform/shared-ui` and `@platform/shared-utils`.
- A module BFF may only call its own backend services — never another module's BFF.
- No module may import another module's code.

## BMI Calculator reference

`modules/module-a` is a complete example: `frontend/components/BmiCalculator.tsx` calls `frontend/services/bmi.service.ts`, which POSTs to the module's own BFF (`bff/routes/bmi.routes.ts` → `bff/services/bmi.service.ts`).
