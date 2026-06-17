#!/usr/bin/env bash
set -euo pipefail

echo "Initializing submodules..."
git submodule update --init --recursive

echo "Copying .env.example to .env (skip if exists)..."
[ -f .env ] || cp .env.example .env

echo "Installing dependencies..."
pnpm install

echo "Bootstrap complete. Run 'pnpm dev' to start the shell."
