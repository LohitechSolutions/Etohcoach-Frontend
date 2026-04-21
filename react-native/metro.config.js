const fs = require("fs");
const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "..");

/** Expo app only: blocks import `packages/framework/src/config` — serve Railway-aware config here. */
const expoFrameworkConfigShim = path.join(
  projectRoot,
  "src/config/expoFrameworkConfig.js"
);

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

const rnDeviceInfoShim = path.resolve(
  projectRoot,
  "src/shims/react-native-device-info.js"
);
const rnLocalizeShim = path.resolve(
  projectRoot,
  "src/shims/react-native-localize.js"
);
const rnPermissionsShim = path.resolve(
  projectRoot,
  "src/shims/react-native-permissions.js"
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

/** Force Metro to our shims when hoisted node_modules would load the real native package. */
function resolveStubPackage(moduleName, packageName, shimAbsolutePath) {
  const bare = bareModuleName(moduleName);
  if (bare === packageName || bare.startsWith(`${packageName}/`)) {
    return { filePath: shimAbsolutePath, type: "sourceFile" };
  }
  const norm = String(moduleName).replace(/\\/g, "/");
  if (
    norm.includes(`/node_modules/${packageName}/`) ||
    norm.endsWith(`/node_modules/${packageName}`)
  ) {
    return { filePath: shimAbsolutePath, type: "sourceFile" };
  }
  return null;
}

/**
 * Legacy app: react-navigation 2.18.7 bundles react-navigation-stack@0.7.0 under
 * node_modules/react-navigation/node_modules/. Hoisted react-navigation-stack@2.x
 * imports useTheme from react-navigation, which v2 does not export → runtime crash.
 */
const NESTED_REACT_NAVIGATION_STACK = path.join(
  workspaceRoot,
  "node_modules",
  "react-navigation",
  "node_modules",
  "react-navigation-stack"
);

function resolveNestedReactNavigationStack(moduleName) {
  const pkg = "react-navigation-stack";
  if (!fs.existsSync(path.join(NESTED_REACT_NAVIGATION_STACK, "package.json"))) {
    return null;
  }
  const bare = bareModuleName(moduleName);
  const norm = String(moduleName).replace(/\\/g, "/");

  if (bare === pkg || bare.startsWith(`${pkg}/`)) {
    const sub = bare === pkg ? "" : bare.slice(pkg.length + 1);
    if (!sub) {
      const entry = resolvePackageEntry(NESTED_REACT_NAVIGATION_STACK);
      if (entry) {
        return { filePath: path.normalize(entry), type: "sourceFile" };
      }
    } else {
      const resolved = resolveExistingFile(path.join(NESTED_REACT_NAVIGATION_STACK, sub));
      if (resolved) {
        return { filePath: path.normalize(resolved), type: "sourceFile" };
      }
    }
  }

  const needle = `/node_modules/${pkg}/`;
  const idx = norm.indexOf(needle);
  if (idx !== -1) {
    const rel = norm.slice(idx + needle.length).split("?")[0];
    const resolved = resolveExistingFile(path.join(NESTED_REACT_NAVIGATION_STACK, rel));
    if (resolved) {
      return { filePath: path.normalize(resolved), type: "sourceFile" };
    }
  }

  if (norm.endsWith(`/node_modules/${pkg}`)) {
    const entry = resolvePackageEntry(NESTED_REACT_NAVIGATION_STACK);
    if (entry) {
      return { filePath: path.normalize(entry), type: "sourceFile" };
    }
  }

  return null;
}

/** Legacy app lives under blocks/core; Metro was resolving react-navigation 2.x from there (unpatched). Pin to repo-root patched copies. */
const REACT_NAVIGATION_PKGS = [
  "react-navigation",
  "react-navigation-drawer",
  "react-navigation-tabs",
  "react-navigation-deprecated-tab-navigator",
];

function resolveReactNavigationFromWorkspace(moduleName) {
  const bare = bareModuleName(moduleName);
  const norm = String(moduleName).replace(/\\/g, "/");

  for (const pkg of REACT_NAVIGATION_PKGS) {
    const pkgRoot = path.join(workspaceRoot, "node_modules", pkg);
    if (!fs.existsSync(path.join(pkgRoot, "package.json"))) {
      continue;
    }

    if (bare === pkg || bare.startsWith(`${pkg}/`)) {
      const sub = bare === pkg ? "" : bare.slice(pkg.length + 1);
      if (!sub) {
        const entry = resolvePackageEntry(pkgRoot);
        if (entry) {
          return { filePath: path.normalize(entry), type: "sourceFile" };
        }
      } else {
        const resolved = resolveExistingFile(path.join(pkgRoot, sub));
        if (resolved) {
          return { filePath: path.normalize(resolved), type: "sourceFile" };
        }
      }
    }

    const needle = `/node_modules/${pkg}/`;
    const idx = norm.indexOf(needle);
    if (idx !== -1) {
      const rel = norm.slice(idx + needle.length).split("?")[0];
      const resolved = resolveExistingFile(path.join(pkgRoot, rel));
      if (resolved) {
        return { filePath: path.normalize(resolved), type: "sourceFile" };
      }
    }

    if (norm.endsWith(`/node_modules/${pkg}`)) {
      const entry = resolvePackageEntry(pkgRoot);
      if (entry) {
        return { filePath: path.normalize(entry), type: "sourceFile" };
      }
    }
  }

  return null;
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

/**
 * `react-native-safe-area-context` must resolve to a single copy (Expo's). A second
 * copy from workspace hoisting registers RNCSafeAreaProvider twice → native crash.
 */
/**
 * Force AsyncStorage to Expo’s install. A second copy from `packages/blocks/core/node_modules`
 * (or other hoisted paths) can interact badly with RN 0.74 and trigger the removed-core
 * AsyncStorage invariant or incomplete module evaluation (`.default` undefined).
 */
function resolveReactNativeAsyncStorage(moduleName) {
  const scope = "@react-native-async-storage";
  const pkg = `${scope}/async-storage`;
  const pkgRoot = path.join(expoNodeModules, scope, "async-storage");
  if (!fs.existsSync(path.join(pkgRoot, "package.json"))) {
    return null;
  }
  const bare = bareModuleName(moduleName);
  const norm = String(moduleName).replace(/\\/g, "/");

  if (bare === pkg || bare.startsWith(`${pkg}/`)) {
    const sub = bare === pkg ? "" : bare.slice(pkg.length + 1);
    if (!sub) {
      const entry = resolvePackageEntry(pkgRoot);
      if (entry) {
        return { filePath: path.normalize(entry), type: "sourceFile" };
      }
    } else {
      const resolved = resolveExistingFile(path.join(pkgRoot, sub));
      if (resolved) {
        return { filePath: path.normalize(resolved), type: "sourceFile" };
      }
    }
  }

  const needle = `/node_modules/${pkg}/`;
  const idx = norm.indexOf(needle);
  if (idx !== -1) {
    const rel = norm.slice(idx + needle.length).split("?")[0];
    const resolved = resolveExistingFile(path.join(pkgRoot, rel));
    if (resolved) {
      return { filePath: path.normalize(resolved), type: "sourceFile" };
    }
  }

  if (norm.endsWith(`/node_modules/${pkg}`)) {
    const entry = resolvePackageEntry(pkgRoot);
    if (entry) {
      return { filePath: path.normalize(entry), type: "sourceFile" };
    }
  }

  return null;
}

/** RevenueCat must use the Expo app’s native module (RN 0.74), not a hoisted legacy copy. */
function resolveReactNativePurchases(moduleName) {
  const pkg = "react-native-purchases";
  const pkgRoot = path.join(expoNodeModules, pkg);
  if (!fs.existsSync(path.join(pkgRoot, "package.json"))) {
    return null;
  }
  const bare = bareModuleName(moduleName);
  const norm = String(moduleName).replace(/\\/g, "/");

  if (bare === pkg || bare.startsWith(`${pkg}/`)) {
    const sub = bare === pkg ? "" : bare.slice(pkg.length + 1);
    if (!sub) {
      const entry = resolvePackageEntry(pkgRoot);
      if (entry) {
        return { filePath: path.normalize(entry), type: "sourceFile" };
      }
    } else {
      const resolved = resolveExistingFile(path.join(pkgRoot, sub));
      if (resolved) {
        return { filePath: path.normalize(resolved), type: "sourceFile" };
      }
    }
  }

  const needle = `/node_modules/${pkg}/`;
  const idx = norm.indexOf(needle);
  if (idx !== -1) {
    const rel = norm.slice(idx + needle.length).split("?")[0];
    const resolved = resolveExistingFile(path.join(pkgRoot, rel));
    if (resolved) {
      return { filePath: path.normalize(resolved), type: "sourceFile" };
    }
  }

  if (norm.endsWith(`/node_modules/${pkg}`)) {
    const entry = resolvePackageEntry(pkgRoot);
    if (entry) {
      return { filePath: path.normalize(entry), type: "sourceFile" };
    }
  }

  return null;
}

function resolveReactNativeSafeAreaContext(moduleName) {
  const pkg = "react-native-safe-area-context";
  const pkgRoot = path.join(expoNodeModules, pkg);
  if (!fs.existsSync(path.join(pkgRoot, "package.json"))) {
    return null;
  }
  const bare = bareModuleName(moduleName);
  const norm = String(moduleName).replace(/\\/g, "/");

  if (bare === pkg || bare.startsWith(`${pkg}/`)) {
    const sub = bare === pkg ? "" : bare.slice(pkg.length + 1);
    if (!sub) {
      const entry = resolvePackageEntry(pkgRoot);
      if (entry) {
        return { filePath: path.normalize(entry), type: "sourceFile" };
      }
    } else {
      const resolved = resolveExistingFile(path.join(pkgRoot, sub));
      if (resolved) {
        return { filePath: path.normalize(resolved), type: "sourceFile" };
      }
    }
  }

  const needle = `/node_modules/${pkg}/`;
  const idx = norm.indexOf(needle);
  if (idx !== -1) {
    const rel = norm.slice(idx + needle.length).split("?")[0];
    const resolved = resolveExistingFile(path.join(pkgRoot, rel));
    if (resolved) {
      return { filePath: path.normalize(resolved), type: "sourceFile" };
    }
  }

  if (norm.endsWith(`/node_modules/${pkg}`)) {
    const entry = resolvePackageEntry(pkgRoot);
    if (entry) {
      return { filePath: path.normalize(entry), type: "sourceFile" };
    }
  }

  return null;
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

/** Expo Go has no react-native-vector-icons native bridge; use @expo/vector-icons instead. */
function resolveVectorIconsToExpo(moduleName) {
  const PREFIX = "react-native-vector-icons/";
  const bare = bareModuleName(moduleName);
  let setName = null;
  if (bare === "react-native-vector-icons") {
    return null;
  }
  if (bare.startsWith(PREFIX)) {
    setName = bare.slice(PREFIX.length).split("/")[0];
  } else {
    const norm = String(moduleName).replace(/\\/g, "/");
    const idx = norm.indexOf(PREFIX);
    if (idx !== -1) {
      const rest = norm.slice(idx + PREFIX.length).split("/")[0];
      if (rest) {
        setName = rest.replace(/\.(js|jsx|ts|tsx)$/, "");
      }
    }
  }
  if (!setName) {
    return null;
  }
  const expoPath = path.join(
    expoNodeModules,
    "@expo",
    "vector-icons",
    "build",
    `${setName}.js`
  );
  if (fs.existsSync(expoPath)) {
    return { filePath: expoPath, type: "sourceFile" };
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
  const normMod = String(moduleName).replace(/\\/g, "/");
  if (
    normMod.includes("framework/src/config") &&
    !normMod.includes("expoFrameworkConfig")
  ) {
    return { filePath: expoFrameworkConfigShim, type: "sourceFile" };
  }
  if (shouldUseGoogleSigninShim(moduleName)) {
    return { filePath: googleSigninShim, type: "sourceFile" };
  }
  const safeAreaRes = resolveReactNativeSafeAreaContext(moduleName);
  if (safeAreaRes) {
    return safeAreaRes;
  }
  const purchasesRes = resolveReactNativePurchases(moduleName);
  if (purchasesRes) {
    return purchasesRes;
  }
  const asyncStorageRes = resolveReactNativeAsyncStorage(moduleName);
  if (asyncStorageRes) {
    return asyncStorageRes;
  }
  const vectorIcons = resolveVectorIconsToExpo(moduleName);
  if (vectorIcons) {
    return vectorIcons;
  }
  const deviceInfoRes = resolveStubPackage(
    moduleName,
    "react-native-device-info",
    rnDeviceInfoShim
  );
  if (deviceInfoRes) {
    return deviceInfoRes;
  }
  const localizeRes = resolveStubPackage(
    moduleName,
    "react-native-localize",
    rnLocalizeShim
  );
  if (localizeRes) {
    return localizeRes;
  }
  const permissionsRes = resolveStubPackage(
    moduleName,
    "react-native-permissions",
    rnPermissionsShim
  );
  if (permissionsRes) {
    return permissionsRes;
  }
  const nestedStackRes = resolveNestedReactNavigationStack(moduleName);
  if (nestedStackRes) {
    return nestedStackRes;
  }
  const reactNavRes = resolveReactNavigationFromWorkspace(moduleName);
  if (reactNavRes) {
    return reactNavRes;
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
  "react-native-localize": path.resolve(projectRoot, "src/shims/react-native-localize.js"),
  "react-native-permissions": path.resolve(projectRoot, "src/shims/react-native-permissions.js"),
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
  "react-native-safe-area-context": path.join(expoNodeModules, "react-native-safe-area-context"),
  "react-native-purchases": path.join(expoNodeModules, "react-native-purchases"),
  "@react-native-async-storage/async-storage": path.join(
    expoNodeModules,
    "@react-native-async-storage",
    "async-storage"
  ),
};
config.resolver.unstable_enableSymlinks = true;

module.exports = config;
