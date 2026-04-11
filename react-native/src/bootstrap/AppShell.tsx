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
// eslint-disable-next-line @typescript-eslint/no-require-imports
const SingletonFactory = require("../../../packages/framework/src/SingletonFactory").default as {
  getRestBlockInstance: () => unknown;
};

const { store, persistor } = configStore();

const AppStateProvider = StateProvider as ComponentType<{ children?: ReactNode }>;

/** Legacy block screens + Redux + RN6 (same modules as packages/mobile). */
export function AppShell() {
  useEffect(() => {
    void langaugeFunction();
    /** Without this, no screen imports HomeScreen → RestApiClient never attaches → all API calls (signup, splash, …) are no-ops. */
    SingletonFactory.getRestBlockInstance();
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
