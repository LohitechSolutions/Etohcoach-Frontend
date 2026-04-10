#!/usr/bin/env node
/**
 * EtOHCoach — point the Expo app at the Rails API under Etohcoach-Backend/.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const railsRoot = path.join(root, "Etohcoach-Backend");
const exists = fs.existsSync(railsRoot);
const rubyVerPath = path.join(railsRoot, ".ruby-version");
const rubyWant = fs.existsSync(rubyVerPath)
  ? fs.readFileSync(rubyVerPath, "utf8").trim()
  : "(see Etohcoach-Backend/.ruby-version)";

console.log("");
console.log("EtOHCoach — Rails API + Expo");
console.log("────────────────────────────────────────────────────────────");
console.log(`Etohcoach-Backend: ${exists ? "found" : "missing (expected at repo root)"}`);
console.log('');
console.log("IMPORTANT: Run `yarn dev:expo-and-api` from your app root directory");
console.log("  (the folder whose package.json lists dev:expo-and-api — same level as Etohcoach-Backend/).");
console.log("If you are already in Etohcoach-Backend/, run:  yarn dev:with-expo");
console.log("");
console.log(`Ruby must match Etohcoach-Backend/.ruby-version (${rubyWant}).`);
console.log(`  rbenv:  rbenv install ${rubyWant} && cd Etohcoach-Backend && rbenv local ${rubyWant}`);
console.log("  Then:   gem install bundler:2.4.22");
console.log("");
console.log("First time on macOS, if `pg` or `ffi` fails to compile:");
console.log("  yarn install:backend:mac-pg   # Homebrew libpq + libffi + bundle config");
console.log("  yarn install:backend");
console.log("");
console.log("First time (PostgreSQL server running for db:prepare):");
console.log("  brew install postgresql@16 && brew services start postgresql@16");
console.log("  yarn install:backend");
console.log("  yarn db:prepare:backend   # uses rbenv + bundler 2 (avoid bin/rails from wrong PATH)");
console.log("");
console.log("Run API (listens on 0.0.0.0:3000) + Expo together:");
console.log("  yarn dev:expo-and-api");
console.log("");
console.log("Frontend API base URL (packages/framework/src/config.js):");
console.log("  • EXPO_PUBLIC_API_URL in react-native/.env (copy .env.example), or");
console.log("  • USE_LOCAL_ROOT_BACKEND + LOCAL_API_HOST/PORT (default 127.0.0.1:3000)");
console.log("");
console.log("Android emulator: adb reverse tcp:3000 tcp:3000");
console.log("  or set LOCAL_API_HOST to 10.0.2.2 in config.js.");
console.log("Physical device: set EXPO_PUBLIC_API_URL to http://<your-lan-ip>:3000");
console.log("────────────────────────────────────────────────────────────");
console.log("");

process.exit(0);
