/**
 * Always run the Expo CLI from this app's node_modules (never ~/node_modules).
 * Use: node scripts/run-expo.cjs start --clear
 */
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const appRoot = path.join(__dirname, "..");
const workspaceRoot = path.join(appRoot, "..");

function resolveExpoCli() {
  const roots = [appRoot, workspaceRoot];
  for (const root of roots) {
    const candidate = path.join(root, "node_modules", "expo", "bin", "cli");
    if (fs.existsSync(candidate)) return candidate;
  }
  try {
    return require.resolve("expo/bin/cli", { paths: [appRoot, workspaceRoot] });
  } catch {
    return null;
  }
}

const expoCli = resolveExpoCli();

if (!expoCli) {
  console.error(
    "Expo CLI not found under this app or the monorepo root.\n" +
      "Tried:\n  " +
      path.join(appRoot, "node_modules", "expo", "bin", "cli") +
      "\n  " +
      path.join(workspaceRoot, "node_modules", "expo", "bin", "cli") +
      "\nRun `yarn install` from the repo root, then try again."
  );
  process.exit(1);
}

const result = spawnSync(process.execPath, [expoCli, ...process.argv.slice(2)], {
  cwd: appRoot,
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status === null ? 1 : result.status);
