/** Mirrors `NonAuthStack` route keys in packages/mobile/App.tsx */
export const nonAuthStackRoutes = [
  "Landing",
  "EmailAccountLoginBlock",
  "EmailAccountRegistration",
  "ForgotPassword",
  "ForgotPasswordOTP",
  "PasswordChanged",
  "NewPassword",
  "SubCriptionScreen",
  "SubcriptionSuccsess",
  "FilterModal",
  "LanguageOptionModal",
  "StartCourceModal",
  "TakeQuizeModal",
  "MockExamModal",
  "TermsAndConditions"
] as const;

export type NonAuthStackRouteName = (typeof nonAuthStackRoutes)[number];
