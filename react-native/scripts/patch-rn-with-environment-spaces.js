/**
 * React Native's with-environment.sh runs the child script as `$1` (unquoted).
 * When the project path contains spaces, the shell splits the path and codegen fails.
 * This patch quotes the invocation so builds work under paths like "Audrey Chaillet/Etoh Coach".
 *
 * Idempotent: safe to run on every npm install.
 */
const fs = require("fs");
const path = require("path");

const target = path.join(
  __dirname,
  "..",
  "node_modules",
  "react-native",
  "scripts",
  "xcode",
  "with-environment.sh"
);

if (!fs.existsSync(target)) {
  process.exit(0);
}

let s = fs.readFileSync(target, "utf8");
const before = s;

// Original RN 0.74 template
s = s.replace(
  /# Execute argument, if present\r?\nif \[ -n "\$1" \]; then\r?\n  \$1\r?\nfi\r?\n/,
  `# Execute argument, if present (must be quoted so paths with spaces work)\nif [ -n "$1" ]; then\n  "$@"\nfi\n`
);

if (s !== before) {
  fs.writeFileSync(target, s, "utf8");
  console.log("[patch-rn-with-environment-spaces] Patched", path.relative(process.cwd(), target));
}
