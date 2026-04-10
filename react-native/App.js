import "./src/linking-rn2-polyfill";
import "./src/dimensions-rn-polyfill";
import React from "react";
import { AppShell } from "./src/bootstrap/AppShell";

/** Same UI as the original app: legacy is the default. Set EXPO_PUBLIC_USE_EXPO_SHELL=true for the RN6 placeholder scaffold. */
const useExpoShell = process.env.EXPO_PUBLIC_USE_EXPO_SHELL === "true";

export default function App() {
  if (useExpoShell) {
    return <AppShell />;
  }
  const LegacyMobileApp = require("../packages/mobile/App").default;
  return <LegacyMobileApp />;
}
