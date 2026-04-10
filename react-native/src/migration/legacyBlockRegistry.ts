import type { ComponentType } from "react";

/**
 * Lazy legacy block loader — same modules as `packages/mobile/App.tsx`.
 * Do not use a static registry object: eager `require()` of every block pulls in
 * native-linked deps and crashes release APKs before the splash renders.
 */
const cache = new Map<string, ComponentType<Record<string, unknown>>>();

/** Normalize route aliases to one require/cache key (e.g. SPLASH → Splashscreen). */
function canonicalLegacyBlockName(name: string): string {
  switch (name) {
    case "SPLASH":
      return "Splashscreen";
    case "OverViews":
      return "OverView";
    case "ProductCategory":
      return "CatalogueFive";
    case "ThemesScreen":
      return "Themes";
    case "CatalogueStudies":
      return "CatalogueStudy";
    default:
      return name;
  }
}

export function getLegacyBlock(name: string): ComponentType<Record<string, unknown>> | undefined {
  const key = canonicalLegacyBlockName(name);
  if (cache.has(key)) {
    return cache.get(key);
  }
  let C: ComponentType<Record<string, unknown>> | undefined;
  switch (key) {
    case "Landing":
      C = require("../../../packages/blocks/LandingScreen/src/Landing").default;
      break;
    case "Home":
      C = require("../../../packages/components/src/HomeScreen").default;
      break;
    case "InfoPage":
      C = require("../../../packages/blocks/info-page/src/InfoPageBlock").default;
      break;
    case "EmailNotifications":
      C = require("../../../packages/blocks/EmailNotifications/src/EmailNotifications").default;
      break;
    case "CfAppleLogin17":
      C = require("../../../packages/blocks/CfAppleLogin17/src/CfAppleLogin17").default;
      break;
    case "BulkUploading":
      C = require("../../../packages/blocks/BulkUploading/src/BulkUploading").default;
      break;
    case "SocialMediaAccountLoginScreen":
      C = require("../../../packages/blocks/social-media-account-login/src/SocialMediaAccountLoginScreen")
        .default;
      break;
    case "CfFlashcards2":
      C = require("../../../packages/blocks/CfFlashcards2/src/CfFlashcards2").default;
      break;
    case "AssessmentTest":
      C = require("../../../packages/blocks/AssessmentTest/src/AssessmentTest").default;
      break;
    case "LanguageOptions":
      C = require("../../../packages/blocks/LanguageOptions/src/LanguageOptions").default;
      break;
    case "LanguageOptionModal":
      C = require("../../../packages/blocks/LanguageOptions/src/LanguageOptionsModal").default;
      break;
    case "Polling":
      C = require("../../../packages/blocks/Polling/src/Polling").default;
      break;
    case "Customisableusersubscriptions":
      C = require("../../../packages/blocks/customisableusersubscriptions/src/Customisableusersubscriptions")
        .default;
      break;
    case "SubscriptionDetails":
      C = require("../../../packages/blocks/customisableusersubscriptions/src/SubscriptionDetails").default;
      break;
    case "SubscriptionBilling":
      C = require("../../../packages/blocks/SubscriptionBilling/src/SubscriptionBilling").default;
      break;
    case "Search":
      C = require("../../../packages/blocks/search/src/Search").default;
      break;
    case "Leaderboard":
      C = require("../../../packages/blocks/Leaderboard/src/Leaderboard").default;
      break;
    case "ForgotPassword":
      C = require("../../../packages/blocks/forgot-password/src/ForgotPassword").default;
      break;
    case "ForgotPasswordOTP":
      C = require("../../../packages/blocks/forgot-password/src/ForgotPasswordOTP").default;
      break;
    case "NewPassword":
      C = require("../../../packages/blocks/forgot-password/src/NewPassword").default;
      break;
    case "Sorting":
      C = require("../../../packages/blocks/sorting/src/Sorting").default;
      break;
    case "Library2":
      C = require("../../../packages/blocks/Library2/src/Library2").default;
      break;
    case "Contactus":
      C = require("../../../packages/blocks/contactus/src/Contactus").default;
      break;
    case "AddContactus":
      C = require("../../../packages/blocks/contactus/src/AddContactus").default;
      break;
    case "CountryCodeSelector":
      C = require("../../../packages/blocks/country-code-selector/src/CountryCodeSelector").default;
      break;
    case "CountryCodeSelectorTable":
      C = require("../../../packages/blocks/country-code-selector/src/CountryCodeSelectorTable").default;
      break;
    case "StripeIntegration":
      C = require("../../../packages/blocks/StripeIntegration/src/StripeIntegration").default;
      break;
    case "Gamification":
      C = require("../../../packages/blocks/Gamification/src/Gamification").default;
      break;
    case "AdminConsole3":
      C = require("../../../packages/blocks/AdminConsole3/src/AdminConsole3").default;
      break;
    case "OTPInputAuth":
      C = require("../../../packages/blocks/otp-input-confirmation/src/OTPInputAuth").default;
      break;
    case "Notes":
      C = require("../../../packages/blocks/Notes/src/Notes").default;
      break;
    case "EditProfile":
      C = require("../../../packages/blocks/user-profile-basic/src/EditProfile").default;
      break;
    case "ChangePassword":
      C = require("../../../packages/blocks/user-profile-basic/src/ChangePassword").default;
      break;
    case "ChangeEmail":
      C = require("../../../packages/blocks/user-profile-basic/src/ChangeEmail").default;
      break;
    case "EmailAccountLoginBlock":
      C = require("../../../packages/blocks/email-account-login/src/EmailAccountLoginBlock").default;
      break;
    case "TermsAndConditions":
      C = require("../../../packages/blocks/TermsAndConditions/src/TermsAndConditions").default;
      break;
    case "Pushnotifications":
      C = require("../../../packages/blocks/pushnotifications/src/Pushnotifications").default;
      break;
    case "DataImportexportcsv":
      C = require("../../../packages/blocks/DataImportexportcsv/src/DataImportexportcsv").default;
      break;
    case "Annotations":
      C = require("../../../packages/blocks/Annotations/src/Annotations").default;
      break;
    case "Scoring":
      C = require("../../../packages/blocks/Scoring/src/Scoring").default;
      break;
    case "PaymentAdmin2":
      C = require("../../../packages/blocks/PaymentAdmin2/src/PaymentAdmin2").default;
      break;
    case "EmailAccountRegistration":
      C = require("../../../packages/blocks/email-account-registration/src/EmailAccountRegistration").default;
      break;
    case "ContentManagement":
      C = require("../../../packages/blocks/ContentManagement/src/ContentManagement").default;
      break;
    case "Splashscreen":
      C = require("../../../packages/blocks/splashscreen/src/Splashscreen").default;
      break;
    case "QuestionBank":
      C = require("../../../packages/blocks/QuestionBank/src/QuestionBank").default;
      break;
    case "Categoriessubcategories":
      C = require("../../../packages/blocks/categoriessubcategories/src/Categoriessubcategories").default;
      break;
    case "Settings5":
      C = require("../../../packages/blocks/Settings5/src/Settings5").default;
      break;
    case "UserProfileBasicBlock":
      C = require("../../../packages/blocks/user-profile-basic/src/UserProfileBasicBlock").default;
      break;
    case "Dashboard":
      C = require("../../../packages/blocks/dashboard/src/Dashboard").default;
      break;
    case "Filteritems":
      C = require("../../../packages/blocks/filteritems/src/Filteritems").default;
      break;
    case "Filteroptions":
      C = require("../../../packages/blocks/filteritems/src/Filteroptions").default;
      break;
    case "SocialMediaAccountRegistrationScreen":
      C = require("../../../packages/blocks/social-media-account-registration/src/SocialMediaAccountRegistrationScreen")
        .default;
      break;
    case "Notifications":
      C = require("../../../packages/blocks/notifications/src/Notifications").default;
      break;
    case "Catalogue":
      C = require("../../../packages/blocks/catalogue/src/Catalogue").default;
      break;
    case "ManageNotifications":
      C = require("../../../packages/blocks/user-profile-basic/src/ManageNotifications").default;
      break;
    case "SubCriptionScreen":
      C = require("../../../packages/blocks/SubCriptionScreen/src/Subcription").default;
      break;
    case "SubcriptionSuccsess":
      C = require("../../../packages/blocks/SubCriptionScreen/src/SubcriptionSuccsess").default;
      break;
    case "OverView":
      C = require("../../../packages/blocks/catalogue/src/OverView").default;
      break;
    case "FilterModal":
      C = require("../../../packages/blocks/catalogue/src/FilterModal").default;
      break;
    case "StartCourceModal":
      C = require("../../../packages/blocks/catalogue/src/StartCourceModal").default;
      break;
    case "TakeQuizeModal":
      C = require("../../../packages/blocks/catalogue/src/TakeQuizeModal").default;
      break;
    case "MockExamModal":
      C = require("../../../packages/blocks/catalogue/src/MockExamModal").default;
      break;
    case "ReviewModal":
      C = require("../../../packages/blocks/catalogue/src/ReviewModal").default;
      break;
    case "CatalogueFive":
      C = require("../../../packages/blocks/catalogue/src/CatalogueFIve").default;
      break;
    case "settings":
      C = require("../../../packages/blocks/user-profile-basic/src/settings").default;
      break;
    case "Themes":
      C = require("../../../packages/blocks/catalogue/src/ThemesScr").default;
      break;
    case "CatalogueStudy":
      C = require("../../../packages/blocks/catalogue/src/CatalogueStudy").default;
      break;
    case "PollingScr":
      C = require("../../../packages/blocks/CfFlashcards2/src/PollingScr").default;
      break;
    case "WebviewComponent":
      C = require("../../../packages/blocks/contactus/Component/WebviewComponent").default;
      break;
    case "PasswordChanged":
      C = require("../../../packages/blocks/forgot-password/src/passwordChanged").default;
      break;
    case "NoInternet":
      C = require("../../../packages/blocks/Internet/src/Internet").default;
      break;
    case "CfFlashCardOne":
      C = require("../../../packages/blocks/catalogue/src/CfFlashCardOne").default;
      break;
    case "RevealAnswer":
      C = require("../../../packages/blocks/catalogue/src/RevealAnswer").default;
      break;
    case "Congratulation":
      C = require("../../../packages/blocks/catalogue/src/Congratulation").default;
      break;
    case "moxExamQuestionOne":
      C = require("../../../packages/blocks/catalogue/src/moxExamQuestionOne").default;
      break;
    case "ReArrangeOrder":
      C = require("../../../packages/blocks/catalogue/src/ReArrangeOrder").default;
      break;
    case "MocExamInit":
      C = require("../../../packages/blocks/catalogue/src/MocExamInit").default;
      break;
    case "QuizzesExamInit":
      C = require("../../../packages/blocks/catalogue/src/QuizzesExamInit").default;
      break;
    default:
      return undefined;
  }
  if (!C) {
    return undefined;
  }
  cache.set(key, C);
  return C;
}
