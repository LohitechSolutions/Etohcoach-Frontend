const fallbackBaseUrl =
  "https://etohcoachfinal-159129-ruby.b159129.dev.eastus.az.svc.builder.cafe";

export const env = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? fallbackBaseUrl,
  /** When false (default), Sign In stores a dev token and navigates without calling the login API. Set `EXPO_PUBLIC_USE_REAL_AUTH=true` to restore real authentication. */
  useRealAuth: process.env.EXPO_PUBLIC_USE_REAL_AUTH === "true",
  /**
   * When true, `App.js` mounts `AppNavigator` (RN6 migration scaffold).
   * Default is false: full legacy UI from `packages/mobile` (matches production app).
   */
  useExpoShell: process.env.EXPO_PUBLIC_USE_EXPO_SHELL === "true"
};

/** Stored when `useRealAuth` is false so tab screens and splash still see a session. */
export const DEV_NAV_ONLY_TOKEN = "expo-dev-nav-only";
