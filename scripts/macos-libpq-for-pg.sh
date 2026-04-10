#!/usr/bin/env bash
# Homebrew libraries + Bundler build flags for native gems on macOS (pg, ffi).
# Yarn runs without a login shell — initialize rbenv here.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND="$ROOT/Etohcoach-Backend"

if [[ -x "${HOME}/.rbenv/bin/rbenv" ]]; then
  eval "$("${HOME}/.rbenv/bin/rbenv" init - bash)"
elif [[ -d "${HOME}/.rbenv/shims" ]]; then
  export PATH="${HOME}/.rbenv/shims:${PATH}"
fi

if ! command -v brew >/dev/null 2>&1; then
  echo "Homebrew not found. Install from https://brew.sh then re-run this script."
  exit 1
fi

echo "Installing libpq (PostgreSQL client; gem pg)..."
brew install libpq

PG_CONFIG="$(brew --prefix libpq)/bin/pg_config"
if [[ ! -x "$PG_CONFIG" ]]; then
  echo "Expected pg_config at $PG_CONFIG — not found."
  exit 1
fi

echo "Installing libffi (native dep for gem ffi → sassc → activeadmin_addons)..."
brew install libffi

LIBFFI="$(brew --prefix libffi)"
if [[ ! -d "$LIBFFI" ]]; then
  echo "libffi prefix missing at $LIBFFI"
  exit 1
fi

cd "$BACKEND"
echo "Bundler: build.pg → $PG_CONFIG"
bundle config set --local build.pg "--with-pg-config=$PG_CONFIG"

# ffi extconf: use Homebrew libffi (keg-only); helps compilation on Apple Silicon / newer macOS.
echo "Bundler: build.ffi → $LIBFFI"
bundle config set --local build.ffi "--enable-system-libffi --with-system-libffi-dir=$LIBFFI"

echo ""
echo "OK. Now run from repo root:"
echo "  yarn install:backend"
echo ""
echo "If ffi still fails: xcode-select --install  (Command Line Tools), then retry."
echo "PostgreSQL server for db:prepare: brew install postgresql@16 && brew services start postgresql@16"
