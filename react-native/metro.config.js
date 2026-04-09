const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "..");

const config = getDefaultConfig(projectRoot);

const multiSliderShim = path.resolve(
  projectRoot,
  "src/shims/@ptomasroos/react-native-multi-slider.js"
);

const draggableGridShim = path.resolve(
  projectRoot,
  "src/shims/react-native-draggable-grid.js"
);

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "@ptomasroos/react-native-multi-slider") {
    return {
      filePath: multiSliderShim,
      type: "sourceFile"
    };
  }
  if (moduleName === "react-native-draggable-grid") {
    return {
      filePath: draggableGridShim,
      type: "sourceFile"
    };
  }
  if (typeof originalResolveRequest === "function") {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

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
  "react-native-app-intro-slider": path.resolve(projectRoot, "src/shims/react-native-app-intro-slider.js"),
  "react-native-modal": path.resolve(projectRoot, "src/shims/react-native-modal.js"),
  "react-native-render-html": path.resolve(projectRoot, "src/shims/react-native-render-html.js"),
  "react-native-switch": path.resolve(projectRoot, "src/shims/react-native-switch.js"),
  "@ptomasroos/react-native-multi-slider": path.resolve(
    projectRoot,
    "src/shims/@ptomasroos/react-native-multi-slider.js"
  ),
  "react-native-draggable-grid": path.resolve(
    projectRoot,
    "src/shims/react-native-draggable-grid.js"
  )
};
config.resolver.unstable_enableSymlinks = true;

module.exports = config;
