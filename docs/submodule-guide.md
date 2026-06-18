# Git Submodule Guide

## What's a submodule

Six independent submodules: `modules/module-a`, `modules/module-b`, `modules/module-c`, `packages/shared-ui`, `packages/shared-utils`, `branding`. Everything else (`app`, `shell`, `configs`) is consumer-local. Each module is its own repo (not one shared `modules` repo) so it can be versioned and deployed independently of the others.

Each submodule's `url` in `.gitmodules` points at its real GitHub remote (e.g. `git@github.com:hrtbrxkxr/poc-blueprint-module-a.git`). Every one of them is also a complete, standalone repo in its own right — see "Run any submodule independently" below.

## Clone

```bash
git clone --recurse-submodules <consumer-repo-url>
# or, if already cloned:
git submodule update --init --recursive
```

## Sync (pull latest submodule commits)

```bash
pnpm submodules:sync
# equivalent to:
git submodule sync --recursive
git submodule update --init --recursive --remote
```

## Update a single submodule and pin the new commit

```bash
cd modules/module-a
git checkout main && git pull
cd ../..
git add modules/module-a
git commit -m "bump module-a submodule"
```

## Run any submodule independently

Submodules don't require a consumer repo at all — clone one on its own and it's a fully working project:

```bash
git clone git@github.com:hrtbrxkxr/poc-blueprint-module-a.git
cd poc-blueprint-module-a
```

`module-a` and `module-c`/`module-b` (once implemented) depend on `@platform/shared-ui`/`@platform/shared-utils` via real semver ranges (`^1.0.0`), resolved from GitHub Packages rather than `workspace:*` — there's no parent workspace to link against outside this consumer repo. Before `pnpm install` will work, export a GitHub PAT with `read:packages` scope (the package's own `.npmrc` already points `@platform:*` at `https://npm.pkg.github.com`):

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
pnpm install
```

Then, depending on which submodule you cloned:

| Submodule | Run it with |
|---|---|
| `module-a` (or any implemented module) | `cd bff && pnpm dev` (BFF, port from `module.config.ts`) **and**, in a second terminal, `pnpm dev` from the module root (Vite playground for the frontend, port 5173) |
| `shared-ui` | `pnpm storybook` (port 6006) |
| `shared-utils` | `pnpm test` (no UI — it's pure functions) |
| `branding` | nothing to run — static assets only |

A module's frontend playground (`frontend/dev/`) mounts its page component directly with no shell, no auth, and no other modules present. It needs the BFF running only if you're exercising actual data fetching — otherwise the UI renders fine and just the network call fails.

This is the same setup whether you're inside this consumer repo's workspace or a true standalone clone — the only difference is that inside the workspace, `pnpm`'s `link-workspace-packages=true` (root `.npmrc`) resolves `@platform/shared-ui`/`@platform/shared-utils` to the local `packages/*` source instead of fetching from GitHub Packages, so edits there show up immediately without needing a publish.

## Pushing each submodule to its own remote

Each of the six submodules (`modules/module-a`, `modules/module-b`, `modules/module-c`, `packages/shared-ui`, `packages/shared-utils`, `branding`) is a full, independent git repo nested inside the consumer working tree. Work inside one exactly like any standalone repo, just from that subdirectory:

```bash
cd modules/module-a
git checkout main && git pull
git checkout -b feature/your-change
# ... make changes, commit ...
git push -u origin feature/your-change
gh pr create --base main --title "feat: your change"
```

To push every submodule's current `main` to the remote already declared in `.gitmodules` in one shot:

```bash
git submodule sync --recursive && git submodule foreach 'git push -u origin main'
```

After a submodule PR merges, the consumer repo's pointer to it doesn't update automatically — `modules/module-a` etc. are commit pointers, not live references:

```bash
cd modules/module-a
git checkout main && git pull   # fast-forward to the now-merged commit

cd ../..
git add modules/module-a
git commit -m "chore: bump module-a submodule"
git push origin main
```

If the submodule you just repointed (e.g. a brand-new repo) hasn't had its remote configured yet:

```bash
# 1. Create the empty remote repo first (GitHub UI, or: gh repo create org/module-d --private)

# 2. From the consumer repo root, enter the submodule's checkout
cd modules/module-d

# 3. Point it at the new remote and push
git remote add origin git@github.com:org/module-d.git
git push -u origin main

# 4. Back in the consumer repo root, repoint .gitmodules at the new remote
cd ../..
git submodule set-url modules/module-d git@github.com:org/module-d.git
git add .gitmodules modules/module-d
git commit -m "Point module-d submodule at its own remote"
```

## Publishing shared-ui / shared-utils

Unlike the modules, `shared-ui` and `shared-utils` are also published as real npm packages (to GitHub Packages) so a standalone clone of any module can `pnpm install` them without a parent workspace. Pushing to `main` updates the repo, but nothing re-publishes until a version tag is pushed:

```bash
cd packages/shared-ui          # or packages/shared-utils
npm version patch              # bumps package.json + creates git tag vX.Y.Z
git push origin main --tags
```

The pushed tag (`v*`) triggers that submodule's own `.github/workflows/publish.yml`, which runs `pnpm build` (compiles `dist/`, plus a precompiled Tailwind CSS bundle for shared-ui) and `pnpm publish` to `https://npm.pkg.github.com`, authenticated via the workflow's own `GITHUB_TOKEN` (no PAT setup needed for CI — only for someone `pnpm install`-ing the result locally, per "Run any submodule independently" above).

Until you've actually pushed a tag at least once, standalone clones of `module-a` (or any other module) will get a `404` trying to install `@platform/shared-ui`/`@platform/shared-utils` from GitHub Packages — there's nothing published yet.

## Troubleshooting

- **Detached HEAD inside a submodule**: expected — submodules are pinned to a commit, not a branch. `git checkout <branch>` inside the submodule before committing new work there.
- **Empty submodule directory after clone**: you forgot `--recurse-submodules`; run `git submodule update --init --recursive`.
- **Submodule shows as modified with no edits**: someone else bumped the pinned commit; run `git submodule update`.
- **`pnpm install` 404s on `@platform/shared-ui` in a standalone clone**: either `GITHUB_TOKEN` isn't exported (needs `read:packages` scope), or no version has been published yet — see "Publishing shared-ui / shared-utils" above.
