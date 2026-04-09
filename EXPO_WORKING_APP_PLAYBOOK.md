# Expo Working App Playbook

This is the execution document to produce a **working Expo app** from the current project in a **new folder** (`react-native/`), while keeping `packages/mobile` as fallback until parity is approved.

It is intentionally practical: copy/paste commands, file targets, decision points, and "done" checks.

---

## 0) Target Outcome

By the end of this playbook:
- `react-native/` boots on iOS + Android with Expo.
- Core journeys work end-to-end:
  - launch
  - auth
  - dashboard tab
  - catalogue tab
  - profile tab
  - API calls
  - persisted session
- build is repeatable in CI.

---

## 1) Scope and Rules

### In scope (must work first)
- App shell and navigation
- Auth + session restore
- Dashboard/Catalogue/Profile primary flows
- API integration with environment-based base URL
- Basic notifications plumbing (if required for MVP)

### Out of scope (phase later)
- Non-critical advanced/admin screens
- Optional native-heavy modules without immediate user impact

### Rules
- Keep old app in `packages/mobile` untouched for fallback.
- All new migration work lands in `react-native/`.
- No direct dependence on `packages/blocks/core/node_modules` in new app.

---

## 2) Current Repository Inputs

Use these as migration sources:
- Legacy mobile app: `packages/mobile/`
- Shared features: `packages/blocks/`
- Shared framework + API engine: `packages/framework/`
- Existing Expo scaffold: `react-native/`
- Route parity tracker: `EXPO_SCREEN_PARITY_CHECKLIST.md`
- Milestone tracker: `EXPO_MIGRATION_MILESTONES.md`

---

## 3) Folder and Architecture Target

Target structure under `react-native/`:

```text
react-native/
  src/
    app/                # providers, app bootstrap, navigation root
    navigation/         # stack/tab navigators, route constants
    features/           # per-feature screens and UI
    services/
      api/              # API client adapters to framework/runEngine
      storage/          # async storage/session wrappers
      notifications/    # push permission/token logic
    shared/             # reusable components/hooks/types
    config/             # env + runtime config
  assets/
  app.json
  babel.config.js
  tsconfig.json
  metro.config.js
```

---

## 4) Execution Plan (Order Matters)

## Step 1 - Stabilize Expo app as monorepo package

### Required actions
1. Ensure `react-native/package.json` has deterministic install and scripts:
   - `start`, `ios`, `android`, `typecheck`, `lint`
2. Add/verify `metro.config.js` to resolve monorepo packages:
   - allow imports from `packages/blocks`, `packages/framework`, `packages/components`
3. Add a clean environment strategy:
   - `.env.example` with API URL key
   - runtime config loader under `react-native/src/config`

### Done check
- `cd react-native && npm install && npx expo start` works on all machines.
- Typecheck runs clean.

---

## Step 2 - Build compatibility adapters first (before screen migration)

Create wrappers so old logic ports cleanly:
- `src/services/storage/sessionStorage.ts`
- `src/services/api/runEngineAdapter.ts`
- `src/services/notifications/notificationsAdapter.ts`
- `src/shared/platform/device.ts`

Adapter purpose:
- isolate platform/module changes
- keep old controllers readable during migration
- reduce rewrite scope

### Done check
- Auth token read/write works from adapter.
- One sample API call succeeds through adapter.

---

## Step 3 - Migrate navigation contract

1. Keep legacy route keys for compatibility where possible.
2. Introduce alias mapping for known mismatches:
   - `SPLASH -> Splashscreen`
   - `UserProfileBasicBlock -> Profile` (or add legacy alias route)
3. Split navigation into files:
   - `navigation/rootNavigator.tsx`
   - `navigation/authNavigator.tsx`
   - `navigation/appTabs.tsx`

### Done check
- All priority routes in checklist are reachable.
- Deep links and back behavior are stable for core paths.

---

## Step 4 - Vertical slice migration (working app fast)

Migrate in this order:
1. Auth slice
2. Dashboard slice
3. Catalogue slice
4. Profile slice

Per slice:
- move screen UI
- connect state/API
- wire navigation
- verify loading/error/empty states

### Done check
- User can log in, sees main tabs, opens core screens, and session persists after app restart.

---

## Step 5 - Native dependency decisions (keep/replace/defer)

For each native-heavy legacy module, choose exactly one:
- Keep via Expo dev build + plugin
- Replace with Expo-supported alternative
- Defer behind feature flag

High-priority modules to decide first:
- Firebase messaging
- In-app purchases
- Facebook/Apple login
- File/document handling
- Media playback
- Permissions

### Done check
- No unresolved native blockers in MVP flows.
- `expo run:ios` and `expo run:android` succeed when plugins are required.

---

## Step 6 - Quality gate and CI

Add CI workflow for `react-native/`:
- install
- typecheck
- lint
- smoke run (or scripted sanity checks)

### Done check
- CI green on default branch for Expo app.

---

## 5) Commands Checklist

Run from repo root unless noted.

```bash
# 1) Install root deps (if needed by shared packages)
npm install

# 2) Install Expo app deps
cd react-native
npm install

# 3) Start Expo dev server
npx expo start

# 4) Create native dev builds when required by plugins/native modules
npx expo run:ios
npx expo run:android

# 5) Quality checks (add scripts if missing)
npm run typecheck
npm run lint
```

---

## 6) Minimal MVP Acceptance Test (Must Pass)

Execute on iOS and Android:

1. Launch app from cold start.
2. Open login and authenticate with test account.
3. Kill and reopen app; verify session restore.
4. Open `Dashboard`, verify data render.
5. Open `Catalogue`, verify list/content render.
6. Open `Profile`, verify profile data and edit entrypoint.
7. Trigger one API error path and verify error handling.
8. Confirm no crash during 10-minute exploratory use.

If any fail, app is not considered "working MVP".

---

## 7) Required Documentation Artifacts During Execution

Keep these files updated while migrating:
- `EXPO_MIGRATION_MILESTONES.md` (phase status)
- `EXPO_SCREEN_PARITY_CHECKLIST.md` (route-level status)
- `EXPO_WORKING_APP_PLAYBOOK.md` (this file; update decisions)

---

## 8) Blocker Handling Protocol

When blocked:
1. Record blocker in parity checklist Notes with date/owner.
2. Label as one of:
   - Architecture
   - Dependency
   - API contract
   - UI parity
   - Performance
3. Add workaround or fallback path.
4. Re-scope to keep MVP path moving.

---

## 9) Final Cutover Criteria

Cut over from `packages/mobile` to `react-native` only when:
- MVP acceptance test passes on both platforms.
- No P0/P1 open issues in core flows.
- CI quality gate is stable.
- Release build/distribution pipeline is validated.

Then:
- mark legacy mobile app as maintenance-only
- plan archive/deletion separately (not in same release)

---

## 10) First Week Task Board (Recommended)

Day 1-2:
- monorepo + Metro + env stabilization
- navigation contract cleanup (aliases)

Day 3:
- auth/session vertical slice

Day 4:
- dashboard + catalogue slices

Day 5:
- profile slice + MVP acceptance run + blocker triage

---

## 11) Detailed Testing Guide

Use this guide every time you deliver a migration slice.

### A. Local pre-checks

From `react-native/`:

```bash
npm install
npm run typecheck
npx expo start --clear
```

Pass criteria:
- No TypeScript errors.
- Expo dev server starts without fatal Metro errors.

### B. Environment validation

1. Create local env file from template:
   - copy `.env.example` -> `.env`
2. Confirm `EXPO_PUBLIC_API_BASE_URL` points to reachable backend.
3. In app login screen, attempt sign-in with known QA credentials.

Pass criteria:
- Login request is sent to `${EXPO_PUBLIC_API_BASE_URL}/bx_block_login/logins`.
- Successful login navigates to tabs and persists session.

### C. Functional smoke matrix (core MVP)

| Test ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| SMK-01 | Cold start route | Launch app fresh | Splash shows, then `Landing` if no session |
| SMK-02 | Login success | Enter valid creds, tap Sign In | Navigates to `DashboardTabs` |
| SMK-03 | Session restore | Kill app, relaunch | Returns to tabs without re-login |
| SMK-04 | Dashboard API | Open Dashboard tab | Data loads (or graceful error text) |
| SMK-05 | Catalogue API | Open Catalogue tab | List loads (or graceful empty/error) |
| SMK-06 | Profile API | Open Profile tab | Profile details appear (or graceful error) |
| SMK-07 | Logout | Tap Logout on Dashboard | Session cleared, returns to `Landing` |
| SMK-08 | Offline behavior | Disable network, reload app | No crash, meaningful error display |
| SMK-09 | Terms / privacy | From login: Terms + Privacy links | Correct document loads (HTML stripped to text) |
| SMK-10 | Contact | Navigate `Contactus` (from route list when logged in) | GET returns links or empty state; Add form submits or shows API error clearly |
| SMK-11 | Search | `Search` route, run query | `search/users?query=` returns list or error |
| SMK-12 | Sorting | `Sorting` route, tap each chip | Sorted catalogue rows or API error |
| SMK-13 | Filter | `Filteritems` → `Filteroptions` | Lists load or graceful error |

### D. API contract checks

For each migrated endpoint, verify:
- Request method and path match legacy app:
  - `POST bx_block_login/logins`
  - `GET dashboard`
  - `GET catalogue/catalogues`
  - `GET profile/profile`
- Token header sent as `token`.
- Error payloads do not crash UI and surface readable message.
- Additional routes in this phase:
  - `GET terms_and_conditions` / `GET privacy_policy` (no auth header in legacy)
  - `GET contact_us`, optional `POST contact_us` (verify body with backend)
  - `GET search/users?query=`
  - `GET sorting/sorting` (with sort query variants)
  - `GET filter_items/filtering`

### E. iOS and Android parity checks

Run on both:
- iOS simulator/device
- Android emulator/device

Minimum parity checks:
- Same route transitions for login -> tabs.
- No platform-specific crash on navigation or API load.
- Tab icons and labels render correctly.

### F. Regression checklist per PR

- [ ] `npm run typecheck` passes
- [ ] app launches with `npx expo start --clear`
- [ ] smoke matrix SMK-01 to SMK-08 executed
- [ ] errors captured in checklist doc if any test fails
- [ ] `EXPO_SCREEN_PARITY_CHECKLIST.md` statuses updated

### G. Known current limitations (as of this phase)

- Login is now wired to real endpoint but not yet integrated with full legacy Redux/runEngine flows.
- Many secondary routes are still scaffold placeholders; high-traffic flows are prioritized first.
- Notifications/IAP/social login native-heavy flows are not yet production-ready in Expo and require dedicated migration tasks.
- Contact form POST uses a JSON:API-style body; confirm against your backend and adjust `submitContactMessage` if validation fails.
- Legal content is shown as plain text (HTML stripped); rich HTML rendering comes with the UI parity phase.

---

## 12) What you should do (owner / team checklist)

These items are not fully automatable from code alone. Completing them materially improves reliability and release readiness.

| Item | Why it matters | Action |
|---|---|---|
| **API base URL** | All requests fail or hit the wrong environment | Set `EXPO_PUBLIC_API_BASE_URL` in `.env` (from `.env.example`) for dev/stage/prod as needed. |
| **Auth mode** | Need to click through the app without a working API | Default: `EXPO_PUBLIC_USE_REAL_AUTH` unset or `false` → Sign In skips the login API and only navigates (dev token `expo-dev-nav-only`). Set `EXPO_PUBLIC_USE_REAL_AUTH=true` when the backend is ready for real login. |
| **QA test accounts** | Unblocks login, registration, and password flows | Provide at least one stable email/password pair per environment; note any 2FA or IP restrictions. |
| **Backend CORS / mobile** | Rare for native, but web builds need it | If you use `expo start --web`, ensure the API allows your dev origin if applicable. |
| **Verify contact POST contract** | Add Contact may 422 if payload shape differs | Capture a successful request from the legacy app (proxy/Charles) and align `submitContactMessage` if needed. |
| **Push notifications** | Requires keys and native project config | Later phase: Apple push key, FCM, Expo project IDs; not required for current function-first slices. |
| **Store signing** | Required for real device distribution outside Expo Go | Apple Team ID, certificates, Android keystore or Play App Signing; plan before first TestFlight/Play internal. |
| **Secrets** | Never commit production secrets | Keep tokens and private URLs in env or CI secrets only. |
| **Branding assets** | Tab icons and splash match prod | When UI parity starts, supply PNG/SVG sources or approve emoji placeholders until then. |
| **Regression time** | Catches API drift | After each phase, run Section 11 smoke matrix plus new routes you care about (Terms, Contact, Search, Sort, Filter). |

If you share QA credentials and confirm the contact POST payload from the live API, the next iteration can lock those flows to 100% parity with the legacy app.

