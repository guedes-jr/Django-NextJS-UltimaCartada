#!/usr/bin/env bash
# =============================================================================
# Cartada Viva — seed.sh
# Loads demo data into the local database.
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")/backend"

echo "[SEED] Activating venv..."
source "$BACKEND_DIR/.venv/bin/activate"
cd "$BACKEND_DIR"

echo "[SEED] Loading demo data..."
python manage.py seed_demo

deactivate
