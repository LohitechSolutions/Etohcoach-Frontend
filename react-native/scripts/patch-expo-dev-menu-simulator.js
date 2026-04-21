/**
 * Xcode / Swift no longer exposes TARGET_IPHONE_SIMULATOR to Swift in expo-dev-menu@5.0.23,
 * causing: cannot find 'TARGET_IPHONE_SIMULATOR' in scope.
 * Replace with #if targetEnvironment(simulator) (upstream pattern in newer expo-dev-menu).
 */
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const swiftPath = path.join(
  projectRoot,
  "node_modules",
  "expo-dev-menu",
  "ios",
  "DevMenuViewController.swift"
);

const needle = "let isSimulator = TARGET_IPHONE_SIMULATOR > 0";
const replacement = `#if targetEnvironment(simulator)
    let isSimulator = true
    #else
    let isSimulator = false
    #endif`;

try {
  if (!fs.existsSync(swiftPath)) {
    process.exit(0);
  }
  let src = fs.readFileSync(swiftPath, "utf8");
  if (!src.includes(needle)) {
    process.exit(0);
  }
  src = src.replace(needle, replacement);
  fs.writeFileSync(swiftPath, src, "utf8");
  process.stdout.write("patch-expo-dev-menu-simulator: updated DevMenuViewController.swift\n");
} catch (e) {
  process.stderr.write(String(e) + "\n");
  process.exit(0);
}
