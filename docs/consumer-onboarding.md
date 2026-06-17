# Consumer Onboarding

## Creating a new consumer

1. Fork this repository (the blueprint) to `consumer-<name>`.
2. Replace `branding/` submodule pointer with the new consumer's branding repo (logos, icons, fonts).
3. Update `configs/branding.ts`, `configs/environment.ts` defaults, and `.env.example` with the new `NEXT_PUBLIC_CONSUMER_ID`.
4. Adjust `configs/layout.ts`, `configs/auth.ts`, `configs/routes.ts` for consumer-specific layout/auth/route behavior.
5. Choose which modules to enable in `configs/modules.ts`.
6. Run `pnpm bootstrap` then `pnpm dev`.

## What's shared vs. owned

| Shared (submodules) | Owned (consumer-local) |
|---|---|
| `modules/` | `app/` |
| `packages/shared-ui` | `shell/` |
| `packages/shared-utils` | `configs/` |
| `branding/` (consumer's own fork of this submodule) | `.env`, deployment config |
