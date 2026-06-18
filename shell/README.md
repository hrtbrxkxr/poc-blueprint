# Shell

The shell is local, consumer-owned code — never a submodule.

## Responsibilities

Layout, navigation, auth, providers, module loading, error boundaries, maintenance, theme loading, global state, route guards.

## Boundaries

The shell must **not** contain business logic, API logic (beyond its own auth/theme/maintenance calls), or module logic. Module UI and data fetching belong in `modules/*/frontend` and `modules/*/bff`.

## Dependency rules

- Shell may import `@hrtbrxkxr/shared-ui`, `@hrtbrxkxr/shared-utils`, `@platform/branding`, `configs/*`, and module entry points via the module loader.
- Shell must not import module internals directly (only the public `frontend/index.ts` export of each module).
- Modules must never import the shell.

## Module loading

`module-loader/registry.ts` holds the in-memory module registry seeded from `configs/modules.ts`. `ModuleRenderer` resolves auth/maintenance/permission state via `moduleResolver.ts` before lazily importing the module's `frontend/index.ts` through `loadModule.ts`.

## Theme loading

`providers/ThemeProvider.tsx` fetches `/theme` from the backend (ISR-cached on the server, polled client-side every 5 minutes), writes CSS variables onto `document.documentElement`, and dynamically injects the brand font `<link>`.

## Auth flow

1. `AuthProvider` hydrates `auth.store` from persisted session on mount.
2. `AuthGuard` redirects unauthenticated users to `configs/auth.ts#unauthorizedRedirect`.
3. `PermissionGuard` conditionally renders based on the user's permission list.
4. BFFs independently validate the JWT via `jwt.service.ts`'s remote JWKS (shared verification logic, not shared session state).
