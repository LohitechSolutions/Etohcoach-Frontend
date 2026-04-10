#!/usr/bin/env bash
# Same rbenv bootstrap as bundle-in-backend.sh (Yarn / non-interactive).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND="$ROOT/Etohcoach-Backend"

if [[ -x "${HOME}/.rbenv/bin/rbenv" ]]; then
  eval "$("${HOME}/.rbenv/bin/rbenv" init - bash)"
elif [[ -d "${HOME}/.rbenv/shims" ]]; then
  export PATH="${HOME}/.rbenv/shims:${PATH}"
fi

cd "$BACKEND"
exec bundle exec rails server -b 0.0.0.0 -p 3000 "$@"
