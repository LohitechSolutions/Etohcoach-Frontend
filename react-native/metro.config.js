const fs = require("fs");
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

const appleAuthPackageRoot = path.resolve(
  projectRoot,
  "src/shims/npm/@invertase/react-native-apple-authentication"
);
const appleAuthEntry = path.join(appleAuthPackageRoot, "index.js");

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

const splashScreenShim = path.resolve(
  projectRoot,
  "src/shims/react-native-splash-screen.js"
);

const googleSigninShim = path.resolve(
  projectRoot,
  "src/shims/@react-native-community-google-signin.js"
);

const firebaseMessagingShim = path.resolve(
  projectRoot,
  "src/shims/react-native-firebase-messaging.js"
);

const rnFsShim = path.resolve(projectRoot, "src/shims/react-native-fs.js");

const rnIapShim = path.resolve(projectRoot, "src/shims/react-native-iap.js");

const lottieShim = path.resolve(projectRoot, "src/shims/lottie-react-native.js");

const rnVideoShim = path.resolve(projectRoot, "src/shims/react-native-video.js");

const firebaseAnalyticsShim = path.resolve(
  projectRoot,
  "src/shims/react-native-firebase-analytics.js"
);

const originalResolveRequest = config.resolver.resolveRequest;

/** Lock React Native + React to this app's native binary (0.74.x). Root workspace hoists legacy 0.65.3. */
const expoNodeModules = path.resolve(projectRoot, "node_modules");
const expoReactNativeRoot = path.join(expoNodeModules, "react-native");
const expoReactRoot = path.join(expoNodeModules, "react");

function bareModuleName(name) {
  const s = String(name);
  const q = s.indexOf("?");
  return (q === -1 ? s : s.slice(0, q)).trim();
}

function resolveExistingFile(basePath) {
  const candidates = [
    basePath,
    `${basePath}.js`,
    `${basePath}.jsx`,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.json`,
    path.join(basePath, "index.js"),
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p) && fs.statSync(p).isFile()) {
        return p;
      }
    } catch (_) {
      // ignore
    }
  }
  return null;
}

function resolvePackageEntry(packageRoot) {
  try {
    const pkgPath = path.join(packageRoot, "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    const main = pkg.main || "index.js";
    const entry = path.join(packageRoot, main);
    if (fs.existsSync(entry) && fs.statSync(entry).isFile()) {
      return entry;
    }
  } catch (_) {
    // ignore
  }
  return resolveExistingFile(path.join(packageRoot, "index"));
}

function resolveExpoReactNativeTree(bare) {
  if (bare === "react-native") {
    const entry =
      resolveExistingFile(path.join(expoReactNativeRoot, "index")) ||
      path.join(expoReactNativeRoot, "index.js");
    if (fs.existsSync(entry)) {
      return { filePath: path.normalize(entry), type: "sourceFile" };
    }
  }
  if (bare.startsWith("react-native/")) {
    const rel = bare.slice("react-native/".length);
    const resolved = resolveExistingFile(path.join(expoReactNativeRoot, rel));
    if (resolved) {
      return { filePath: path.normalize(resolved), type: "sourceFile" };
    }
  }
  if (bare === "react") {
    const entry = resolvePackageEntry(expoReactRoot);
    if (entry) {
      return { filePath: path.normalize(entry), type: "sourceFile" };
    }
  }
  if (bare.startsWith("react/")) {
    const rel = bare.slice("react/".length);
    const resolved = resolveExistingFile(path.join(expoReactRoot, rel));
    if (resolved) {
      return { filePath: path.normalize(resolved), type: "sourceFile" };
    }
  }
  if (bare.startsWith("@react-native/")) {
    const parts = bare.split("/");
    const scopePkg = `${parts[0]}/${parts[1]}`;
    const subPath = parts.slice(2).join("/");
    const pkgRoot = path.join(expoNodeModules, scopePkg);
    if (!subPath) {
      const entry = resolvePackageEntry(pkgRoot);
      if (entry) {
        return { filePath: path.normalize(entry), type: "sourceFile" };
      }
    } else {
      const resolved = resolveExistingFile(path.join(pkgRoot, subPath));
      if (resolved) {
        return { filePath: path.normalize(resolved), type: "sourceFile" };
      }
    }
  }
  if (bare === "scheduler" || bare.startsWith("scheduler/")) {
    const pkgRoot = path.join(expoNodeModules, "scheduler");
    const rel = bare === "scheduler" ? "" : bare.slice("scheduler/".length);
    if (!rel) {
      const entry = resolvePackageEntry(pkgRoot);
      if (entry) {
        return { filePath: path.normalize(entry), type: "sourceFile" };
      }
    } else {
      const resolved = resolveExistingFile(path.join(pkgRoot, rel));
      if (resolved) {
        return { filePath: path.normalize(resolved), type: "sourceFile" };
      }
    }
  }
  return null;
}

/** Real @react-native-community/google-signin loads native code; Expo must always use the shim. */
function shouldUseGoogleSigninShim(moduleName) {
  const bare = bareModuleName(moduleName);
  if (
    bare === "@react-native-community/google-signin" ||
    bare.startsWith("@react-native-community/google-signin/")
  ) {
    return true;
  }
  const norm = String(moduleName).replace(/\\/g, "/");
  return (
    norm.includes("@react-native-community/google-signin/") ||
    norm.endsWith("@react-native-community/google-signin")
  );
}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (shouldUseGoogleSigninShim(moduleName)) {
    return { filePath: googleSigninShim, type: "sourceFile" };
  }
  const bare = bareModuleName(moduleName);
  const forcedRn = resolveExpoReactNativeTree(bare);
  if (forcedRn) {
    return forcedRn;
  }
  if (bare === "redux") {
    return { filePath: reduxShim, type: "sourceFile" };
  }
  if (bare === "redux-thunk") {
    return { filePath: reduxThunkShim, type: "sourceFile" };
  }
  if (bare === "redux-persist") {
    return { filePath: reduxPersistShim, type: "sourceFile" };
  }
  if (bare === "redux-persist/integration/react") {
    return { filePath: reduxPersistReactShim, type: "sourceFile" };
  }
  if (bare === "redux-saga") {
    return { filePath: reduxSagaShim, type: "sourceFile" };
  }
  if (bare === "redux-saga/effects") {
    return { filePath: reduxSagaEffectsShim, type: "sourceFile" };
  }
  if (bare === "@ptomasroos/react-native-multi-slider") {
    return {
      filePath: multiSliderShim,
      type: "sourceFile"
    };
  }
  if (bare === "react-native-draggable-grid") {
    return {
      filePath: draggableGridShim,
      type: "sourceFile"
    };
  }
  if (
    bare === "@invertase/react-native-apple-authentication" ||
    bare.startsWith("@invertase/react-native-apple-authentication/")
  ) {
    return { filePath: appleAuthEntry, type: "sourceFile" };
  }
  if (bare === "react-progress-label") {
    return { filePath: reactProgressLabelShim, type: "sourceFile" };
  }
  if (bare === "react-native-soundcloud-waveform") {
    return { filePath: soundcloudWaveformShim, type: "sourceFile" };
  }
  if (bare === "react-native-media-controls") {
    return { filePath: mediaControlsShim, type: "sourceFile" };
  }
  if (bare === "react-native-orientation") {
    return { filePath: orientationShim, type: "sourceFile" };
  }
  if (bare === "react-native-sound") {
    return { filePath: rnSoundShim, type: "sourceFile" };
  }
  if (bare === "react-native-splash-screen") {
    return { filePath: splashScreenShim, type: "sourceFile" };
  }
  if (bare === "@react-native-firebase/messaging") {
    return { filePath: firebaseMessagingShim, type: "sourceFile" };
  }
  if (bare === "@react-native-firebase/analytics") {
    return { filePath: firebaseAnalyticsShim, type: "sourceFile" };
  }
  if (bare === "lottie-react-native") {
    return { filePath: lottieShim, type: "sourceFile" };
  }
  if (bare === "react-native-video") {
    return { filePath: rnVideoShim, type: "sourceFile" };
  }
  if (bare === "react-native-fs") {
    return { filePath: rnFsShim, type: "sourceFile" };
  }
  if (bare === "react-native-iap") {
    return { filePath: rnIapShim, type: "sourceFile" };
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
  path.resolve(workspaceRoot, "packages/blocks/core/node_modules"),
];
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  react: expoReactRoot,
  "react-native": expoReactNativeRoot,
  scheduler: path.join(expoNodeModules, "scheduler"),
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
  "@invertase/react-native-apple-authentication": appleAuthPackageRoot,
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
  "react-native-splash-screen": path.resolve(
    projectRoot,
    "src/shims/react-native-splash-screen.js"
  ),
  "@react-native-community/google-signin": path.resolve(
    projectRoot,
    "src/shims/@react-native-community-google-signin.js"
  ),
  "@react-native-firebase/messaging": path.resolve(
    projectRoot,
    "src/shims/react-native-firebase-messaging.js"
  ),
  "@react-native-firebase/analytics": path.resolve(
    projectRoot,
    "src/shims/react-native-firebase-analytics.js"
  ),
  "lottie-react-native": path.resolve(projectRoot, "src/shims/lottie-react-native.js"),
  "react-native-video": path.resolve(projectRoot, "src/shims/react-native-video.js"),
  "react-native-fs": path.resolve(projectRoot, "src/shims/react-native-fs.js"),
  "react-native-iap": path.resolve(projectRoot, "src/shims/react-native-iap.js"),
};
config.resolver.unstable_enableSymlinks = true;

module.exports = config;
