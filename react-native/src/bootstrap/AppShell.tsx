import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "../navigation/AppNavigator";

/** React Navigation 6 app shell (default entry when legacy is off). */
export function AppShell() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
