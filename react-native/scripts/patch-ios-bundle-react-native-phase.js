/**
 * "Bundle React Native code and images" (EtOHCoach) may contain:
 *   `"$NODE_BINARY" --print "...react-native-xcode.sh"` inside backticks
 * That re-invokes the resolved path as a command without quoting; spaces in
 * PROJECT_DIR break the build. Use bash with a quoted $() path instead.
 */
const fs = require("fs");
const path = require("path");

const pbx = path.join(
  __dirname,
  "..",
  "ios",
  "EtOHCoach.xcodeproj",
  "project.pbxproj"
);

if (!fs.existsSync(pbx)) {
  process.exit(0);
}

let s = fs.readFileSync(pbx, "utf8");
const before = s;

const bad = String.raw`\n\n\`\"$NODE_BINARY\" --print \"require('path').dirname(require.resolve('react-native/package.json')) + '/scripts/react-native-xcode.sh'\"\`\n\n`;
const good = String.raw`\n\nbash \"$(\"$NODE_BINARY\" --print \"require('path').dirname(require.resolve('react-native/package.json')) + '/scripts/react-native-xcode.sh'\")\"\n\n`;

if (s.includes(bad)) {
  s = s.replace(bad, good);
  fs.writeFileSync(pbx, s, "utf8");
  console.log(
    "[patch-ios-bundle-react-native-phase] Patched",
    path.relative(path.join(__dirname, ".."), pbx)
  );
}
