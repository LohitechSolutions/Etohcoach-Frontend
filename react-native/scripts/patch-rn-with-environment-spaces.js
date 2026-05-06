/**
 * When the project path contains spaces, React Native codegen fails:
 * - script_phases.rb emits `/bin/sh -c "$WITH_ENVIRONMENT $SCRIPT_PHASES_SCRIPT"`, which the shell parses as multiple tokens.
 * - with-environment.sh used to run the child as `$1` (unquoted).
 *
 * Patches both so builds work under paths like ".../Application /Etohcoach/...".
 *
 * Idempotent: safe to run on every npm install. After changing script_phases.rb, run `pod install`
 * in `ios/` so Xcode regenerates the React-Codegen script phases.
 */
const fs = require("fs");
const path = require("path");

function patchWithEnvironmentSh() {
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
    return;
  }

  let s = fs.readFileSync(target, "utf8");
  const before = s;

  s = s.replace(
    /# Execute argument, if present\r?\nif \[ -n "\$1" \]; then\r?\n  \$1\r?\nfi\r?\n/,
    `# Execute argument, if present (must be quoted so paths with spaces work)\nif [ -n "$1" ]; then\n  "$@"\nfi\n`
  );

  if (s !== before) {
    fs.writeFileSync(target, s, "utf8");
    console.log("[patch-rn-with-environment-spaces] Patched", path.relative(process.cwd(), target));
  }
}

function patchScriptPhasesRb() {
  const target = path.join(
    __dirname,
    "..",
    "node_modules",
    "react-native",
    "scripts",
    "react_native_pods_utils",
    "script_phases.rb"
  );

  if (!fs.existsSync(target)) {
    return;
  }

  let s = fs.readFileSync(target, "utf8");
  const before = s;

  // Avoid `/bin/sh -c "..."` — paths with spaces break tokenization, and nested quotes break CocoaPods JSON.
  const direct = `"$WITH_ENVIRONMENT" "$SCRIPT_PHASES_SCRIPT"`;
  s = s.replace(
    /\/bin\/sh -c "\$WITH_ENVIRONMENT \$SCRIPT_PHASES_SCRIPT"/,
    direct
  );
  s = s.replace(
    /\/bin\/sh -c "\\"\$WITH_ENVIRONMENT\\" \\"\$SCRIPT_PHASES_SCRIPT\\""/,
    direct
  );

  if (s !== before) {
    fs.writeFileSync(target, s, "utf8");
    console.log("[patch-rn-with-environment-spaces] Patched", path.relative(process.cwd(), target));
  }
}

patchWithEnvironmentSh();
patchScriptPhasesRb();
