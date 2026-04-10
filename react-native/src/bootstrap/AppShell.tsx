import React, { useEffect, type ComponentType, type ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { langaugeFunction } from "../../../packages/blocks/LanguageOptions/src/component/i18n/i18n.config";
import { StateProvider } from "../../../packages/components/src/context/AppStateContext";
import { AppNavigator } from "../navigation/AppNavigator";

import "../../../packages/blocks/LanguageOptions/src/component/i18n/i18n.config";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { configStore } = require("../../../packages/mobile/src/store/index.js") as {
  configStore: () => { store: import("redux").Store; persistor: object };
};
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PersistGate } = require("../shims/redux-persist-integration-react.js") as {
  PersistGate: ComponentType<{ loading: ReactNode; children?: ReactNode; persistor: object }>;
};

const { store, persistor } = configStore();

const AppStateProvider = StateProvider as ComponentType<{ children?: ReactNode }>;

/**
 * Full legacy blocks + Redux + RN6. API calls respect `EXPO_PUBLIC_OFFLINE_MODE`
 * (see `src/config/env.ts`); default avoids hitting a real backend.
 */
export function AppShell() {
  useEffect(() => {
    void langaugeFunction();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppStateProvider>
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
        </AppStateProvider>
      </PersistGate>
    </Provider>
  );
}
