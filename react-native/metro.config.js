const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
  path.resolve(workspaceRoot, "packages/blocks/core/node_modules")
];
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  "react-redux": path.resolve(projectRoot, "src/shims/react-redux.js"),
  "react-i18next": path.resolve(projectRoot, "src/shims/react-i18next.js"),
  i18next: path.resolve(projectRoot, "src/shims/i18next.js"),
  "react-native-device-info": path.resolve(projectRoot, "src/shims/react-native-device-info.js"),
  "react-native-responsive-fontsize": path.resolve(projectRoot, "src/shims/react-native-responsive-fontsize.js"),
  "react-native-responsive-screen": path.resolve(projectRoot, "src/shims/react-native-responsive-screen.js"),
  "react-native-responsive-dimensions": path.resolve(projectRoot, "src/shims/react-native-responsive-dimensions.js"),
  "react-native-app-intro-slider": path.resolve(projectRoot, "src/shims/react-native-app-intro-slider.js")
};
config.resolver.unstable_enableSymlinks = true;

module.exports = config;
