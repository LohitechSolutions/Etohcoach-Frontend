/**
 * Ensures @invertase/react-native-apple-authentication resolves to the local stub
 * without relying on Metro resolveRequest (some CLI paths skip custom resolvers).
 */
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const target = path.join(
  projectRoot,
  "src/shims/npm/@invertase/react-native-apple-authentication"
);
const scopeDir = path.join(projectRoot, "node_modules", "@invertase");
const linkPath = path.join(scopeDir, "react-native-apple-authentication");

if (!fs.existsSync(path.join(target, "package.json"))) {
  process.stderr.write(
    "ensure-apple-shim-link: stub missing at " + target + "\n"
  );
  process.exit(0);
}

fs.mkdirSync(scopeDir, { recursive: true });
try {
  const stat = fs.lstatSync(linkPath);
  if (stat.isSymbolicLink() || stat.isDirectory()) {
    fs.rmSync(linkPath, { recursive: true, force: true });
  } else {
    fs.unlinkSync(linkPath);
  }
} catch {
  /* absent */
}

const rel = path.relative(path.dirname(linkPath), target);
fs.symlinkSync(rel, linkPath, "dir");
