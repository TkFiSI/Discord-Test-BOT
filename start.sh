#!/usr/bin/env bash
set -euo pipefail

# Fallback entrypoint for Railway/Railpack when monorepo root is used.
# It builds and runs the Node bot from the bot/ subdirectory.

cd "$(dirname "$0")/bot"

# Install dependencies (production if available on platform)
if command -v npm >/dev/null 2>&1; then
  if npm ci --only=production; then
    echo "Installed production dependencies via npm ci"
  else
    echo "npm ci --only=production failed, running full npm ci"
    npm ci
  fi
else
  echo "npm not found"
  exit 1
fi

# Start the bot
npm start
