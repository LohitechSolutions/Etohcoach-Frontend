#!/usr/bin/env bash
# Non-interactive shells (Yarn, CI) don't load ~/.zshrc — initialize rbenv here.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND="$ROOT/Etohcoach-Backend"

if [[ -x "${HOME}/.rbenv/bin/rbenv" ]]; then
  eval "$("${HOME}/.rbenv/bin/rbenv" init - bash)"
elif [[ -d "${HOME}/.rbenv/shims" ]]; then
  export PATH="${HOME}/.rbenv/shims:${PATH}"
fi

# Help native extensions find keg-only Homebrew libs (libffi, libpq) when compiling.
if [[ "$(uname -s)" == "Darwin" ]] && command -v brew >/dev/null 2>&1; then
  for _prefix in libffi libpq; do
    _pc="$(brew --prefix "${_prefix}" 2>/dev/null)/lib/pkgconfig" || true
    if [[ -d "${_pc}" ]]; then
      export PKG_CONFIG_PATH="${_pc}${PKG_CONFIG_PATH:+:${PKG_CONFIG_PATH}}"
    fi
  done
fi

cd "$BACKEND"
exec bundle install "$@"
