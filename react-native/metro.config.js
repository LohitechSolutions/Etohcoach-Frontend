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

const reduxShim = path.resolve(projectRoot, "src/shims/redux.js");
const reduxThunkShim = path.resolve(projectRoot, "src/shims/redux-thunk.js");
const reduxPersistShim = path.resolve(projectRoot, "src/shims/redux-persist.js");
const reduxPersistReactShim = path.resolve(
  projectRoot,
  "src/shims/redux-persist-integration-react.js"
);

const reduxSagaShim = path.resolve(projectRoot, "src/shims/redux-saga.js");
const reduxSagaEffectsShim = path.resolve(
  projectRoot,
  "src/shims/redux-saga-effects.js"
);

const appleAuthShim = path.resolve(
  projectRoot,
  "src/shims/@invertase/react-native-apple-authentication.js"
);

const reactProgressLabelShim = path.resolve(
  projectRoot,
  "src/shims/react-progress-label.js"
);

const soundcloudWaveformShim = path.resolve(
  projectRoot,
  "src/shims/react-native-soundcloud-waveform.js"
);

const mediaControlsShim = path.resolve(
  projectRoot,
  "src/shims/react-native-media-controls.js"
);

const orientationShim = path.resolve(
  projectRoot,
  "src/shims/react-native-orientation.js"
);

const rnSoundShim = path.resolve(projectRoot, "src/shims/react-native-sound.js");

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "redux") {
    return { filePath: reduxShim, type: "sourceFile" };
  }
  if (moduleName === "redux-thunk") {
    return { filePath: reduxThunkShim, type: "sourceFile" };
  }
  if (moduleName === "redux-persist") {
    return { filePath: reduxPersistShim, type: "sourceFile" };
  }
  if (moduleName === "redux-persist/integration/react") {
    return { filePath: reduxPersistReactShim, type: "sourceFile" };
  }
  if (moduleName === "redux-saga") {
    return { filePath: reduxSagaShim, type: "sourceFile" };
  }
  if (moduleName === "redux-saga/effects") {
    return { filePath: reduxSagaEffectsShim, type: "sourceFile" };
  }
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
  if (moduleName === "@invertase/react-native-apple-authentication") {
    return { filePath: appleAuthShim, type: "sourceFile" };
  }
  if (moduleName === "react-progress-label") {
    return { filePath: reactProgressLabelShim, type: "sourceFile" };
  }
  if (moduleName === "react-native-soundcloud-waveform") {
    return { filePath: soundcloudWaveformShim, type: "sourceFile" };
  }
  if (moduleName === "react-native-media-controls") {
    return { filePath: mediaControlsShim, type: "sourceFile" };
  }
  if (moduleName === "react-native-orientation") {
    return { filePath: orientationShim, type: "sourceFile" };
  }
  if (moduleName === "react-native-sound") {
    return { filePath: rnSoundShim, type: "sourceFile" };
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
  ),
  redux: path.resolve(projectRoot, "src/shims/redux.js"),
  "redux-thunk": path.resolve(projectRoot, "src/shims/redux-thunk.js"),
  "redux-persist": path.resolve(projectRoot, "src/shims/redux-persist.js"),
  "redux-persist/integration/react": path.resolve(
    projectRoot,
    "src/shims/redux-persist-integration-react.js"
  ),
  "redux-saga": path.resolve(projectRoot, "src/shims/redux-saga.js"),
  "redux-saga/effects": path.resolve(projectRoot, "src/shims/redux-saga-effects.js"),
  "@invertase/react-native-apple-authentication": path.resolve(
    projectRoot,
    "src/shims/@invertase/react-native-apple-authentication.js"
  ),
  "react-progress-label": path.resolve(projectRoot, "src/shims/react-progress-label.js"),
  "react-native-soundcloud-waveform": path.resolve(
    projectRoot,
    "src/shims/react-native-soundcloud-waveform.js"
  ),
  "react-native-media-controls": path.resolve(
    projectRoot,
    "src/shims/react-native-media-controls.js"
  ),
  "react-native-orientation": path.resolve(
    projectRoot,
    "src/shims/react-native-orientation.js"
  ),
  "react-native-sound": path.resolve(projectRoot, "src/shims/react-native-sound.js"),
};
config.resolver.unstable_enableSymlinks = true;

module.exports = config;
