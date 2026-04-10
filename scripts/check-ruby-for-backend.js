#!/usr/bin/env node
/**
 * Ensures the shell Ruby matches Etohcoach-Backend/.ruby-version before bundle install.
 *
 * Set SKIP_RUBY_CHECK=1 only if `ruby -v` is already correct in your terminal but this
 * script still sees the wrong one (e.g. IDE uses a different PATH), or for CI you control.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.join(__dirname, "..");
const railsRoot = path.join(root, "Etohcoach-Backend");
const wantPath = path.join(railsRoot, ".ruby-version");
const want = fs.readFileSync(wantPath, "utf8").trim();

/** Yarn/Node don't load ~/.zshrc — put rbenv shims ahead of /usr/bin/ruby. */
function rbenvPathPrefix() {
  const home = process.env.HOME;
  if (!home) return "";
  const shims = path.join(home, ".rbenv", "shims");
  return fs.existsSync(shims) ? `${shims}${path.delimiter}` : "";
}

const rubyEnv = {
  encoding: "utf8",
  cwd: railsRoot,
  env: {
    ...process.env,
    PATH: rbenvPathPrefix() + (process.env.PATH || ""),
  },
};

if (process.env.SKIP_RUBY_CHECK === "1") {
  console.warn(
    "SKIP_RUBY_CHECK=1: skipping Ruby check. Ensure `ruby -v` is " +
      want +
      " before `bundle install`.\n" +
      "Note: Ruby 3.2+ will fail — builder_base requires Ruby < 3.1."
  );
  process.exit(0);
}

let rubyLine;
try {
  rubyLine = execSync("ruby -v", rubyEnv).trim();
} catch {
  console.error("Ruby is not installed or not on PATH.");
  process.exit(1);
}

const m = rubyLine.match(/ruby (\d+\.\d+\.\d+)/i);
const current = m ? m[1] : rubyLine;

if (current !== want) {
  console.error("");
  console.error("Wrong Ruby for Etohcoach-Backend.");
  console.error(`  Required (from .ruby-version): ${want}`);
  console.error(`  Current (ruby -v in ${railsRoot}): ${rubyLine}`);
  console.error("");
  console.error("Ruby must match Etohcoach-Backend/.ruby-version when run from that folder.");
  console.error("Yarn does not load ~/.zshrc; this script prepends ~/.rbenv/shims to PATH.");
  console.error("If it still fails: ensure rbenv has " + want + " (rbenv install " + want + ").");
  console.error("");
  console.error("macOS (recommended: Homebrew + rbenv), run in Terminal:");
  console.error("  brew install rbenv ruby-build");
  console.error('  echo \'eval "$(rbenv init - zsh)"\' >> ~/.zshrc && source ~/.zshrc');
  console.error("  brew upgrade ruby-build   # if install fails, get latest Ruby definitions");
  console.error(`  rbenv install ${want}`);
  console.error(`  cd Etohcoach-Backend && rbenv local ${want}`);
  console.error("  ruby -v   # must show " + want);
  console.error("  gem install bundler -v 2.4.22");
  console.error("  cd .. && yarn install:backend");
  console.error("");
  console.error("Other options: asdf (`asdf install ruby " + want + "`), or mise.");
  console.error("If multiple Rubies are installed, ensure the correct one is first on PATH (which ruby).");
  console.error("");
  console.error("Do not use Ruby 3.2+ for this repo: gem `builder_base` requires Ruby < 3.1.");
  console.error("");
  process.exit(1);
}

let bundlerLine;
try {
  bundlerLine = execSync("bundle -v", rubyEnv).trim();
} catch {
  console.error("bundler not found. Run: gem install bundler:2.4.22");
  process.exit(1);
}

const bm = bundlerLine.match(/Bundler version (\d+\.\d+\.\d+)/);
const bundlerMajor = bm ? parseInt(bm[1].split(".")[0], 10) : 0;
if (bundlerMajor < 2) {
  console.error(`Need Bundler 2.x (Gemfile.lock wants 2.4.22). Got: ${bundlerLine}`);
  console.error("Run: gem install bundler:2.4.22");
  process.exit(1);
}

console.log(`OK: ${rubyLine} | ${bundlerLine}`);
