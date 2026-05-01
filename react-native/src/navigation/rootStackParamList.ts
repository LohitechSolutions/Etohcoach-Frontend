export type RootStackParamList = {
  SPLASH: undefined;
  Splashscreen: undefined;
  Authenticated: undefined;
  NonAuthenticated: undefined;
  ComplianceOnboarding: { step?: "age" | "legal" } | undefined;
  LegalDocument: { kind: "terms" | "privacy" };
};
