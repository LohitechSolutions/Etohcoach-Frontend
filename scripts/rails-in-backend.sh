#!/usr/bin/env bash
# Run `bundle exec rails …` in Etohcoach-Backend with rbenv (same as Yarn scripts).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND="$ROOT/Etohcoach-Backend"

if [[ -x "${HOME}/.rbenv/bin/rbenv" ]]; then
  eval "$("${HOME}/.rbenv/bin/rbenv" init - bash)"
elif [[ -d "${HOME}/.rbenv/shims" ]]; then
  export PATH="${HOME}/.rbenv/shims:${PATH}"
fi

cd "$BACKEND"
exec bundle exec rails "$@"
