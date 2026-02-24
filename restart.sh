#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Stopping existing servers on ports 5000 and 5173 (if any)..."
if command -v lsof >/dev/null 2>&1; then
  FRONT_PID=$(lsof -ti tcp:5173 || true)
  BACK_PID=$(lsof -ti tcp:5000 || true)

  if [ -n "$FRONT_PID" ]; then
    kill $FRONT_PID
  fi
  if [ -n "$BACK_PID" ]; then
    kill $BACK_PID
  fi
else
  echo "lsof not found; skipping port cleanup."
fi

echo "Starting backend..."
npm --prefix "$ROOT_DIR/backend" run dev &
BACK_PID=$!

echo "Starting frontend..."
npm --prefix "$ROOT_DIR/frontend" run dev &
FRONT_PID=$!

echo "Backend PID: $BACK_PID"
echo "Frontend PID: $FRONT_PID"

echo "Servers are running. Press Ctrl+C to stop."
wait
