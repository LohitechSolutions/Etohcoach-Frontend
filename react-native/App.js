import "react-native-get-random-values";
import "./src/polyfills/patchReactNativeAsyncStorage";
import "./src/linking-rn2-polyfill";
import "./src/dimensions-rn-polyfill";
import React from "react";
import { AppShell } from "./src/bootstrap/AppShell";

/**
 * Default: migrated legacy blocks inside RN6 (`AppShell`).
 * Set EXPO_PUBLIC_USE_LEGACY_APP=true to use packages/mobile/App (react-navigation v2 container).
 */
const useLegacyMobileApp = process.env.EXPO_PUBLIC_USE_LEGACY_APP === "true";

export default function App() {
  if (useLegacyMobileApp) {
    const LegacyMobileApp = require("../packages/mobile/App").default;
    return <LegacyMobileApp />;
  }
  return <AppShell />;
}
