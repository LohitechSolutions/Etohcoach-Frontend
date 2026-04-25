/**
 * EXConstants (expo-constants) uses:
 *   bash -l -c "$PODS_TARGET_SRCROOT/../scripts/get-app-config-ios.sh"
 * The string passed to -c is reparsed; paths with spaces break ("Audrey Chaillet/...").
 * Use `source` with a quoted path instead.
 *
 * Idempotent; safe to run on every npm install.
 */
const fs = require("fs");
const path = require("path");

const target = path.join(
  __dirname,
  "..",
  "node_modules",
  "expo-constants",
  "ios",
  "EXConstants.podspec"
);

if (!fs.existsSync(target)) {
  process.exit(0);
}

let s = fs.readFileSync(target, "utf8");
const before = s;

s = s.replace(
  /:script => 'bash -l -c "\$PODS_TARGET_SRCROOT\/\.\.\/scripts\/get-app-config-ios\.sh"'/,
  ':script => \'bash -l -c "source \\"$PODS_TARGET_SRCROOT/../scripts/get-app-config-ios.sh\\""\''
);

if (s !== before) {
  fs.writeFileSync(target, s, "utf8");
  console.log(
    "[patch-expo-constants-app-config] Patched",
    path.relative(process.cwd(), target)
  );
}
