# Git Submodule Guide

## What's a submodule

Six independent submodules: `modules/module-a`, `modules/module-b`, `modules/module-c`, `packages/shared-ui`, `packages/shared-utils`, `branding`. Everything else (`app`, `shell`, `configs`) is consumer-local. Each module is its own repo (not one shared `modules` repo) so it can be versioned and deployed independently of the others.

In this POC the submodule `url`s in `.gitmodules` point at local paths under `_submodule-sources/` for demonstration. In a real deployment, replace each with the team's actual remote (e.g. `git@github.com:org/module-a.git`) via `git submodule set-url <path> <new-url>` — see "Pushing each submodule to its own remote" below.

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

## Pushing each submodule to its own remote

Each of the six submodules (`modules/module-a`, `modules/module-b`, `modules/module-c`, `packages/shared-ui`, `packages/shared-utils`, `branding`) is a full, independent git repo nested inside the consumer working tree. To move one to a real remote (e.g. GitHub):

```bash
# 1. Create the empty remote repo first (GitHub UI, or: gh repo create org/module-a --private)

# 2. From the consumer repo root, enter the submodule's checkout
cd modules/module-a

# 3. Point it at the new remote and push
git remote remove origin          # drop the local file:// path used in this POC
git remote add origin git@github.com:org/module-a.git
git push -u origin main

# 4. Back in the consumer repo root, repoint .gitmodules at the new remote
cd ../..
git submodule set-url modules/module-a git@github.com:org/module-a.git
git add .gitmodules modules/module-a
git commit -m "Point module-a submodule at its own remote"
```

Repeat for `modules/module-b`, `modules/module-c`, `packages/shared-ui`, `packages/shared-utils`, and `branding`. After all six are repointed, a fresh `git clone --recurse-submodules <consumer-repo>` will pull every submodule from its real remote instead of the local POC path.

## Troubleshooting

- **Detached HEAD inside a submodule**: expected — submodules are pinned to a commit, not a branch. `git checkout <branch>` inside the submodule before committing new work there.
- **Empty submodule directory after clone**: you forgot `--recurse-submodules`; run `git submodule update --init --recursive`.
- **"fatal: transport 'file' not allowed"**: when using local-path submodule URLs (as in this POC), pass `-c protocol.file.allow=always`.
- **Submodule shows as modified with no edits**: someone else bumped the pinned commit; run `git submodule update`.
