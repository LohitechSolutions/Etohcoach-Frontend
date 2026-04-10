# Expo Screen Parity Checklist

This checklist is the execution companion to `EXPO_MIGRATION_MILESTONES.md`.

Use it to track screen-by-screen migration from `packages/mobile/App.tsx` to `react-native/App.tsx` (and subsequent modular navigation files).

## Usage Rules

- Set one owner per screen.
- Keep statuses current: `Not Started`, `In Progress`, `Blocked`, `QA Ready`, `Done`, `Deferred`.
- Link implementation PR/commit in `Notes`.
- Mark `Critical Flow` as `Yes` for login, session, dashboard, catalogue, profile, notifications.
- Do not mark `Done` until QA evidence is captured (device + scenario + result).

---

## First-Pass Scaffold Audit (Prefilled)

Audit basis: compared legacy routes in `packages/mobile/App.tsx` with placeholder routes currently declared in `react-native/App.tsx`.

### Snapshot
- **Default Expo entry:** `react-native/App.js` mounts **legacy** `packages/mobile` (full original UI). Set **`EXPO_PUBLIC_USE_EXPO_SHELL=true`** to run the **`AppNavigator`** (RN6) scaffold while migrating.
- Placeholder scaffold coverage: **41 routes + tab shell + splash/landing entrypoints** are already declared in Expo.
- Legacy routes missing from Expo scaffold: **`NonAuthenticated`, `Authenticated`, `EmailNotifications`, `BulkUploading`, `LanguageOptions`, `Annotations`, `WebviewComponent`, `settings`, `OverViews`, `CfFlashCardOne`**.
- Naming/alias differences: **`SPLASH` vs `Splashscreen`** both wired to the same splash screen; **`UserProfileBasicBlock`** now maps to **`ProfileScreen`** in `AppNavigator` (legacy route key preserved).

### Status interpretation applied
- `In Progress`: route exists as Expo placeholder scaffold.
- `Not Started`: route has no placeholder in current Expo scaffold.
- `Deferred`: intentionally postponed route group.

---

## 1) Tracking Columns Definition

| Column | Meaning |
|---|---|
| Route Name | Existing route key from old app |
| Source Screen | Old implementation source |
| Expo Target | New location in `react-native/` |
| Feature Area | Functional domain |
| Critical Flow | Yes/No |
| Owner | Engineer responsible |
| Status | Migration state |
| Dependency Risk | `Low`, `Medium`, `High` |
| QA Scenarios | Minimum manual checks |
| Notes | Blockers, PR links, plugin decisions |

---

## 2) Foundation and Navigation

| Route Name | Source Screen | Expo Target | Feature Area | Critical Flow | Owner | Status | Dependency Risk | QA Scenarios | Notes |
|---|---|---|---|---|---|---|---|---|---|
| SPLASH | `../blocks/splashscreen/src/Splashscreen` | `react-native` stack root (`Splashscreen`) | App bootstrap | Yes |  | In Progress | Medium | Cold start, deep link entry, auth branch | Placeholder exists in Expo; route name alias needed (`SPLASH` -> `Splashscreen`) |
| NonAuthenticated | `NonAuthStack` | Expo auth stack group | Navigation architecture | Yes |  | Not Started | Medium | Route guards, back behavior |  |
| Authenticated | `AuthStack` | Expo app stack group | Navigation architecture | Yes |  | Not Started | Medium | Session resume, logout reset |  |
| DashboardTabs | `BottemStack` | Expo bottom tabs | Navigation architecture | Yes |  | In Progress | Low | Tab switch state retention | Exists as placeholder |
| OverView (course tab shell) | `BottemCourse` | Nested tab/stack under catalogue | Catalogue | No |  | Not Started | Medium | Nested navigation + header behavior |  |

---

## 3) Auth and Onboarding Screens

| Route Name | Source Screen | Expo Target | Feature Area | Critical Flow | Owner | Status | Dependency Risk | QA Scenarios | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Landing | `../blocks/LandingScreen/src/Landing` | `react-native/src/features/auth/LandingScreen.tsx` | Onboarding | Yes |  | In Progress | Low | First app open, CTA routing | Placeholder exists |
| EmailAccountLoginBlock | `../blocks/email-account-login/src/EmailAccountLoginBlock` | `react-native/src/features/auth/LoginScreen.tsx` | Auth | Yes |  | In Progress | Medium | Login success/failure, validation, token persist | Stack route key `EmailAccountLoginBlock` registered alongside `Landing` |
| EmailAccountRegistration | `../blocks/email-account-registration/src/EmailAccountRegistration` | `react-native/src/features/auth/RegisterScreen.tsx` | Auth | Yes |  | Not Started | Medium | Registration happy path + duplicate email |  |
| ForgotPassword | `../blocks/forgot-password/src/ForgotPassword` | `react-native/src/features/auth/ForgotPasswordScreen.tsx` | Auth recovery | Yes |  | Not Started | Medium | Request OTP/email link |  |
| ForgotPasswordOTP | `../blocks/forgot-password/src/ForgotPasswordOTP` | `react-native/src/features/auth/ForgotPasswordOtpScreen.tsx` | Auth recovery | Yes |  | Not Started | Medium | OTP invalid/expired/resend |  |
| NewPassword | `../blocks/forgot-password/src/NewPassword` | `react-native/src/features/auth/NewPasswordScreen.tsx` | Auth recovery | Yes |  | Not Started | Low | Password policy + submit |  |
| PasswordChanged | `../blocks/forgot-password/src/passwordChanged` | `react-native/src/features/auth/PasswordChangedScreen.tsx` | Auth recovery | No |  | Not Started | Low | Confirmation route behavior |  |
| SocialMediaAccountLoginScreen | `../blocks/social-media-account-login/src/SocialMediaAccountLoginScreen` | `react-native/src/features/auth/SocialLoginScreen.tsx` | Social auth | No |  | Not Started | High | Provider login + cancel flow | FB/Apple dependencies |
| SocialMediaAccountRegistrationScreen | `../blocks/social-media-account-registration/src/SocialMediaAccountRegistrationScreen` | `react-native/src/features/auth/SocialRegisterScreen.tsx` | Social auth | No |  | Not Started | High | Social account new-user path |  |
| OTPInputAuth | `../blocks/otp-input-confirmation/src/OTPInputAuth` | `react-native/src/features/auth/OtpInputScreen.tsx` | Auth | No |  | Not Started | Medium | OTP submit/resend/timeout |  |
| CountryCodeSelector | `../blocks/country-code-selector/src/CountryCodeSelector` | `react-native/src/features/auth/CountryCodeSelectorScreen.tsx` | Auth helper | No |  | Not Started | Low | Search + selection |  |
| CountryCodeSelectorTable | `../blocks/country-code-selector/src/CountryCodeSelectorTable` | `react-native/src/features/auth/CountryCodeSelectorTableScreen.tsx` | Auth helper | No |  | Not Started | Low | Scroll + select + back |  |
| CfAppleLogin17 | `../blocks/CfAppleLogin17/src/CfAppleLogin17` | `react-native/src/features/auth/AppleLoginScreen.tsx` | Social auth | No |  | Not Started | High | Apple login on iOS | Expo plugin decision |

---

## 4) Core Product Screens (Dashboard, Catalogue, Profile)

| Route Name | Source Screen | Expo Target | Feature Area | Critical Flow | Owner | Status | Dependency Risk | QA Scenarios | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Dashboard | `../blocks/dashboard/src/Dashboard` | `react-native/src/features/dashboard/DashboardScreen.tsx` | Dashboard | Yes |  | In Progress | Medium | Data load, pull to refresh, errors | Tab placeholder exists |
| Catalogue | `../blocks/catalogue/src/Catalogue` | `react-native/src/features/catalogue/CatalogueScreen.tsx` | Catalogue | Yes |  | In Progress | Medium | List load/filter/sort/search | Tab placeholder exists |
| Leaderboard | `../blocks/Leaderboard/src/Leaderboard` | `react-native/src/features/leaderboard/LeaderboardScreen.tsx` | Leaderboard | Yes |  | In Progress | Medium | Rankings load + pagination | Tab placeholder exists |
| UserProfileBasicBlock (Profile) | `../blocks/user-profile-basic/src/UserProfileBasicBlock` | `react-native/src/features/profile/ProfileScreen.tsx` | Profile | Yes |  | In Progress | Medium | Profile load/edit routing | Stack route `UserProfileBasicBlock` → `ProfileScreen`; tab remains `Profile` |
| EditProfile | `../blocks/user-profile-basic/src/EditProfile` | `react-native/src/features/profile/EditProfileScreen.tsx` | Profile | Yes |  | Not Started | Low | Edit + save + validation |  |
| ChangePassword | `../blocks/user-profile-basic/src/ChangePassword` | `react-native/src/features/profile/ChangePasswordScreen.tsx` | Profile | Yes |  | Not Started | Low | Current/new password validation |  |
| ChangeEmail | `../blocks/user-profile-basic/src/ChangeEmail` | `react-native/src/features/profile/ChangeEmailScreen.tsx` | Profile | No |  | Not Started | Low | Email update and verification |  |
| ManageNotifications | `../blocks/user-profile-basic/src/ManageNotifications` | `react-native/src/features/profile/ManageNotificationsScreen.tsx` | Profile settings | No |  | Not Started | Medium | Toggle persistence + API save |  |
| Settings5 | `../blocks/Settings5/src/Settings5` | `react-native/src/features/settings/SettingsScreen.tsx` | Settings | No |  | Not Started | Medium | Account/device/preferences |  |
| Notifications | `../blocks/notifications/src/Notifications` | `react-native/src/features/notifications/NotificationsScreen.tsx` | Notifications | Yes |  | In Progress | Medium | Inbox load, read/unread | Placeholder route exists |
| Pushnotifications | `../blocks/pushnotifications/src/Pushnotifications` | `react-native/src/features/notifications/PushNotificationsScreen.tsx` | Push notifications | Yes |  | Not Started | High | Permission request + token registration | Firebase/Expo notifications |

---

## 5) Catalogue Learning Flow Screens

| Route Name | Source Screen | Expo Target | Feature Area | Critical Flow | Owner | Status | Dependency Risk | QA Scenarios | Notes |
|---|---|---|---|---|---|---|---|---|---|
| OverView | `../blocks/catalogue/src/OverView` | `react-native/src/features/catalogue/OverViewScreen.tsx` | Catalogue journey | Yes |  | In Progress | Medium | Navigation from catalogue item | Placeholder route exists |
| CatalogueFive | `../blocks/catalogue/src/CatalogueFIve` | `react-native/src/features/catalogue/CatalogueFiveScreen.tsx` | Catalogue journey | No |  | In Progress | Medium | Category details | Placeholder route exists |
| CatalogueStudy | `../blocks/catalogue/src/CatalogueStudy` | `react-native/src/features/catalogue/CatalogueStudyScreen.tsx` | Learning content | Yes |  | In Progress | Medium | Study content rendering | Placeholder route exists |
| Themes | `../blocks/catalogue/src/ThemesScr` | `react-native/src/features/catalogue/ThemesScreen.tsx` | Learning content | No |  | In Progress | Low | Themes navigation | Placeholder route exists |
| Notes | `../blocks/Notes/src/Notes` | `react-native/src/features/catalogue/NotesScreen.tsx` | Learning content | No |  | In Progress | Medium | Note create/edit/delete | Placeholder route exists |
| FilterModal | `../blocks/catalogue/src/FilterModal` | `react-native/src/features/catalogue/FilterModal.tsx` | Catalogue filters | No |  | In Progress | Low | Modal open/apply/reset | Placeholder route exists |
| StartCourceModal | `../blocks/catalogue/src/StartCourceModal` | `react-native/src/features/catalogue/StartCourseModal.tsx` | Learning flow | No |  | In Progress | Low | Start flow and dismiss behavior | Placeholder route exists; typo retained in legacy route key |
| TakeQuizeModal | `../blocks/catalogue/src/TakeQuizeModal` | `react-native/src/features/catalogue/TakeQuizModal.tsx` | Quiz flow | No |  | In Progress | Low | Start quiz from module | Placeholder route exists; typo retained in legacy route key |
| MockExamModal | `../blocks/catalogue/src/MockExamModal` | `react-native/src/features/catalogue/MockExamModal.tsx` | Exam flow | No |  | In Progress | Low | Launch mock exam path | Placeholder route exists |
| ReviewModal | `../blocks/catalogue/src/ReviewModal` | `react-native/src/features/catalogue/ReviewModal.tsx` | Review flow | No |  | In Progress | Low | Review action from completed item | Placeholder route exists |
| MocExamInit | `../blocks/catalogue/src/MocExamInit` | `react-native/src/features/catalogue/MocExamInitScreen.tsx` | Exam flow | No |  | In Progress | Medium | Init payload + first question | Placeholder route exists; typo retained in legacy route key |
| QuizzesExamInit | `../blocks/catalogue/src/QuizzesExamInit` | `react-native/src/features/catalogue/QuizzesExamInitScreen.tsx` | Quiz flow | No |  | In Progress | Medium | Init + data load | Placeholder route exists |
| moxExamQuestionOne | `../blocks/catalogue/src/moxExamQuestionOne` | `react-native/src/features/catalogue/MoxExamQuestionOneScreen.tsx` | Exam flow | No |  | In Progress | Medium | Answer save + next | Placeholder route exists; typo retained in legacy route key |
| ReArrangeOrder | `../blocks/catalogue/src/ReArrangeOrder` | `react-native/src/features/catalogue/ReArrangeOrderScreen.tsx` | Quiz interaction | No |  | In Progress | Medium | Drag/drop interactions | Placeholder route exists |
| RevealAnswer | `../blocks/catalogue/src/RevealAnswer` | `react-native/src/features/catalogue/RevealAnswerScreen.tsx` | Quiz interaction | No |  | In Progress | Low | Reveal logic and navigation | Placeholder route exists |
| Congratulation | `../blocks/catalogue/src/Congratulation` | `react-native/src/features/catalogue/CongratulationScreen.tsx` | Completion | No |  | In Progress | Low | Completion summary + next action | Placeholder route exists |
| CfFlashCardOne | `../blocks/catalogue/src/CfFlashCardOne` | `react-native/src/features/catalogue/CfFlashCardOneScreen.tsx` | Flashcards | No |  | Not Started | Medium | Flip flow + progress |  |
| PollingScr | `../blocks/CfFlashcards2/src/PollingScr` | `react-native/src/features/catalogue/PollingScrScreen.tsx` | Flashcards/polling | No |  | In Progress | Medium | Polling question interaction | Placeholder route exists |

---

## 6) Search, Filter, Sorting, Contact, and Utility Screens

| Route Name | Source Screen | Expo Target | Feature Area | Critical Flow | Owner | Status | Dependency Risk | QA Scenarios | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Search | `../blocks/search/src/Search` | `react-native/src/features/search/SearchScreen.tsx` | Discovery | No |  | In Progress | Low | Query + result navigation | Placeholder route exists |
| Sorting | `../blocks/sorting/src/Sorting` | `react-native/src/features/search/SortingScreen.tsx` | Discovery | No |  | In Progress | Low | Sort options apply/cancel | Placeholder route exists |
| Filteritems | `../blocks/filteritems/src/Filteritems` | `react-native/src/features/search/FilterItemsScreen.tsx` | Discovery | No |  | In Progress | Low | Multi-select filter | Placeholder route exists |
| Filteroptions | `../blocks/filteritems/src/Filteroptions` | `react-native/src/features/search/FilterOptionsScreen.tsx` | Discovery | No |  | In Progress | Low | Option selection + persistence | Placeholder route exists |
| Contactus | `../blocks/contactus/src/Contactus` | `react-native/src/features/support/ContactUsScreen.tsx` | Support | No |  | In Progress | Medium | Contact submit flow | Placeholder route exists |
| AddContactus | `../blocks/contactus/src/AddContactus` | `react-native/src/features/support/AddContactUsScreen.tsx` | Support | No |  | In Progress | Medium | Form submit + validation | Placeholder route exists |
| InfoPage | `../blocks/info-page/src/InfoPageBlock` | `react-native/src/features/info/InfoPageScreen.tsx` | Info | No |  | In Progress | Low | Static content rendering | Placeholder route exists |
| NoInternet | `../blocks/Internet/src/Internet` | `react-native/src/features/system/NoInternetScreen.tsx` | Resilience | Yes |  | In Progress | Medium | Offline detection + retry | Placeholder route exists |

---

## 7) Subscription, Billing, and Payment Screens

| Route Name | Source Screen | Expo Target | Feature Area | Critical Flow | Owner | Status | Dependency Risk | QA Scenarios | Notes |
|---|---|---|---|---|---|---|---|---|---|
| SubCriptionScreen | `../blocks/SubCriptionScreen/src/Subcription` | `react-native/src/features/subscription/SubscriptionScreen.tsx` | Subscription | Yes |  | In Progress | High | Purchase plan flow | Placeholder route exists; typo retained in legacy route key |
| SubcriptionSuccsess | `../blocks/SubCriptionScreen/src/SubcriptionSuccsess` | `react-native/src/features/subscription/SubscriptionSuccessScreen.tsx` | Subscription | Yes |  | In Progress | Medium | Post-purchase confirmation | Placeholder route exists; typo retained in legacy route key |
| Customisableusersubscriptions | `../blocks/customisableusersubscriptions/src/Customisableusersubscriptions` | `react-native/src/features/subscription/CustomSubscriptionsScreen.tsx` | Subscription | No |  | In Progress | High | Plan customization | Placeholder route exists |
| SubscriptionDetails | `../blocks/customisableusersubscriptions/src/SubscriptionDetails` | `react-native/src/features/subscription/SubscriptionDetailsScreen.tsx` | Subscription | No |  | In Progress | Medium | Plan detail correctness | Placeholder route exists |
| SubscriptionBilling | `../blocks/SubscriptionBilling/src/SubscriptionBilling` | `react-native/src/features/subscription/SubscriptionBillingScreen.tsx` | Subscription billing | Yes |  | In Progress | High | Billing update + error states | Placeholder route exists |
| StripeIntegration | `../blocks/StripeIntegration/src/StripeIntegration` | `react-native/src/features/payment/StripeIntegrationScreen.tsx` | Payments | Yes |  | In Progress | High | Card/payment intent flow | Placeholder route exists; native SDK strategy still required |
| PaymentAdmin2 | `../blocks/PaymentAdmin2/src/PaymentAdmin2` | `react-native/src/features/payment/PaymentAdminScreen.tsx` | Payments admin | No |  | In Progress | Medium | Payment history/admin actions | Placeholder route exists |

---

## 8) Advanced/Optional Blocks (Lower Priority)

| Route Name | Source Screen | Expo Target | Feature Area | Critical Flow | Owner | Status | Dependency Risk | QA Scenarios | Notes |
|---|---|---|---|---|---|---|---|---|---|
| EmailNotifications | `../blocks/EmailNotifications/src/EmailNotifications` | `react-native/src/features/notifications/EmailNotificationsScreen.tsx` | Notifications | No |  | Not Started | Medium | Email prefs sync |  |
| BulkUploading | `../blocks/BulkUploading/src/BulkUploading` | `react-native/src/features/tools/BulkUploadingScreen.tsx` | Content tools | No |  | Deferred | High | CSV/media upload | Defer unless required |
| LanguageOptions | `../blocks/LanguageOptions/src/LanguageOptions` | `react-native/src/features/settings/LanguageOptionsScreen.tsx` | i18n | No |  | Not Started | Medium | Locale switch + persistence | Translation path cleanup needed |
| LanguageOptionModal | `../blocks/LanguageOptions/src/LanguageOptionsModal` | `react-native/src/features/settings/LanguageOptionModal.tsx` | i18n | No |  | Not Started | Low | Modal selection behavior |  |
| Polling | `../blocks/Polling/src/Polling` | `react-native/src/features/polling/PollingScreen.tsx` | Engagement | No |  | Deferred | Medium | Poll submit flow |  |
| CfFlashcards2 | `../blocks/CfFlashcards2/src/CfFlashcards2` | `react-native/src/features/flashcards/CfFlashcards2Screen.tsx` | Learning | No |  | Deferred | Medium | Flashcard stack flow |  |
| AssessmentTest | `../blocks/AssessmentTest/src/AssessmentTest` | `react-native/src/features/assessment/AssessmentTestScreen.tsx` | Assessment | No |  | Deferred | Medium | Test start/submit |  |
| Library2 | `../blocks/Library2/src/Library2` | `react-native/src/features/library/LibraryScreen.tsx` | Library | No |  | Deferred | Medium | Content browse |  |
| DataImportexportcsv | `../blocks/DataImportexportcsv/src/DataImportexportcsv` | `react-native/src/features/tools/DataImportExportCsvScreen.tsx` | Data tools | No |  | Deferred | High | File import/export | Native file APIs |
| Gamification | `../blocks/Gamification/src/Gamification` | `react-native/src/features/gamification/GamificationScreen.tsx` | Gamification | No |  | Deferred | Medium | Badge/progress rendering |  |
| ContentManagement | `../blocks/ContentManagement/src/ContentManagement` | `react-native/src/features/admin/ContentManagementScreen.tsx` | Admin | No |  | Deferred | Medium | Content CRUD |  |
| Categoriessubcategories | `../blocks/categoriessubcategories/src/Categoriessubcategories` | `react-native/src/features/admin/CategoriesSubcategoriesScreen.tsx` | Admin | No |  | Deferred | Low | Category hierarchy CRUD |  |
| AdminConsole3 | `../blocks/AdminConsole3/src/AdminConsole3` | `react-native/src/features/admin/AdminConsoleScreen.tsx` | Admin | No |  | Deferred | Medium | Admin actions |  |
| QuestionBank | `../blocks/QuestionBank/src/QuestionBank` | `react-native/src/features/assessment/QuestionBankScreen.tsx` | Assessment | No |  | Deferred | Medium | Question list/edit |  |
| Scoring | `../blocks/Scoring/src/Scoring` | `react-native/src/features/assessment/ScoringScreen.tsx` | Assessment | No |  | Deferred | Medium | Score compute/display |  |
| Annotations | `../blocks/Annotations/src/Annotations` | `react-native/src/features/notes/AnnotationsScreen.tsx` | Notes | No |  | Deferred | Medium | Annotation create/render |  |
| TermsAndConditions | `../blocks/TermsAndConditions/src/TermsAndConditions` | `react-native/src/features/legal/TermsScreen.tsx` | Legal | Yes |  | In Progress | Low | View/accept terms | Placeholder route exists |
| settings | `../blocks/user-profile-basic/src/settings` | `react-native/src/features/profile/LegacySettingsScreen.tsx` | Profile settings | No |  | Deferred | Low | Legacy route compatibility |  |
| OverViews | `../blocks/catalogue/src/OverView` | `react-native/src/features/catalogue/OverViewScreen.tsx` | Legacy alias route | No |  | Deferred | Low | Backward route alias only | Keep alias for deep link compatibility |

---

## 9) Global Cross-Cutting Checklist (Must Pass Before Cutover)

| Item | Owner | Status | Evidence |
|---|---|---|---|
| Auth/session token persistence parity |  | Not Started |  |
| API error handling parity (toast/modals/messages) |  | Not Started |  |
| i18n parity (all production locales) |  | Not Started |  |
| Push notification registration and foreground behavior |  | Not Started |  |
| Deep linking and route param compatibility |  | Not Started |  |
| Offline handling (`NoInternet`) parity |  | Not Started |  |
| Analytics events parity (if in scope) |  | Not Started |  |
| Performance baseline: startup and navigation latency |  | Not Started |  |
| Crash reporting and release observability enabled |  | Not Started |  |
| App store build/release checklist passed |  | Not Started |  |

---

## 10) Suggested Prioritized Sequence (Execution Order)

1. `Landing` + auth flow (`EmailAccountLoginBlock`, registration, forgot-password sequence).
2. `Dashboard` tab and session restore.
3. `Catalogue` + `OverView` + core study screens.
4. `Profile` + settings/edit flows.
5. Notifications and push permissions/tokens.
6. Subscription/payment routes.
7. Deferred/advanced/admin routes.

---

## 11) QA Evidence Template

Copy per screen when moving to `QA Ready`.

| Field | Value |
|---|---|
| Route Name |  |
| Build Type | Expo Go / Dev Build |
| Platform | iOS / Android |
| Device |  |
| Scenario |  |
| Expected |  |
| Actual |  |
| Result | Pass / Fail |
| Logged By |  |
| Date |  |

