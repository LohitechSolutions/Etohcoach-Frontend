const fallbackBaseUrl =
  "https://etohcoachfinal-159129-ruby.b159129.dev.eastus.az.svc.builder.cafe";

export const env = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? fallbackBaseUrl,
  /** When false (default), Sign In stores a dev token and navigates without calling the login API. Set `EXPO_PUBLIC_USE_REAL_AUTH=true` to restore real authentication. */
  useRealAuth: process.env.EXPO_PUBLIC_USE_REAL_AUTH === "true",
  /** True when `App.js` runs `AppShell` (RN6 + legacy blocks). Inverse of `EXPO_PUBLIC_USE_LEGACY_APP`. */
  useExpoShell: process.env.EXPO_PUBLIC_USE_LEGACY_APP !== "true",
  /**
   * When true (default), `apiRequest` returns local mocks instead of calling `apiBaseUrl`.
   * Set `EXPO_PUBLIC_OFFLINE_MODE=false` to use the real backend.
   */
  useOfflineMode: process.env.EXPO_PUBLIC_OFFLINE_MODE !== "false"
};

/** Stored when `useRealAuth` is false so tab screens and splash still see a session. */
export const DEV_NAV_ONLY_TOKEN = "expo-dev-nav-only";
