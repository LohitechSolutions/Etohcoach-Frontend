# Expo React Native Migration Milestones

This document defines a complete, auditable plan to convert the project into an Expo React Native app in a new folder (`react-native/`) while preserving product behavior and reducing native maintenance burden.

## 1) Current-State Audit (What Exists Today)

### Repository and architecture
- Monorepo with Yarn workspaces (`packages/*`) and shared feature blocks in `packages/blocks`.
- Existing production mobile app is a **bare React Native** app in `packages/mobile` (native iOS/Android folders, Podfile, Gradle config).
- Web app exists in `packages/web` (CRA/re-wired).
- New Expo app scaffold already exists in `react-native/` and is currently navigation-only.

### Runtime and app composition
- Feature modules are mostly implemented in `packages/blocks/*`, with controllers and UI split by platform in many places (`.tsx`, `.web.tsx`).
- API integration is message-driven through framework blocks (`packages/framework`) and `runEngine`.
- Existing mobile navigation is legacy (`react-navigation` v2 style APIs); Expo scaffold uses modern React Navigation v6.

### Tooling and dependency reality
- Existing repo uses many `file:` dependencies pointing into `packages/blocks/core/node_modules`.
- Existing mobile stack includes several native-only modules (Firebase, IAP, FBSDK, document/file handling, permissions, media, etc.).
- Patch-based and native-project customizations exist in old app (`patch-package`, iOS Podfile custom post-install behavior).

### Conclusion
- The conversion is feasible but should be treated as a **controlled migration**, not a drop-in copy.
- `react-native/` should become the target app; old `packages/mobile` remains as fallback until parity is signed off.

---

## 2) Migration Strategy

### Recommended approach
- Build parity incrementally inside `react-native/`.
- Reuse domain/business logic from `packages/blocks` and `packages/framework` where possible.
- Replace or adapt native libraries to Expo-compatible equivalents.
- Use Expo **development builds** (not Expo Go only) when native modules/plugins are required.

### Deployment target decision
- Primary target: Expo-managed app with config plugins where needed.
- Fallback for blocked features: temporary compatibility wrappers and phased feature toggles.

---

## 3) Milestones and Exit Criteria

## Milestone 0 - Governance and Baseline
**Goal:** Lock migration scope, success metrics, and governance.

### Tasks
- Confirm source-of-truth app behavior from `packages/mobile`.
- Define parity scope: mandatory screens, optional screens, and deferred items.
- Define non-functional targets (startup time, crash-free rate, performance baseline).
- Create migration tracking board (owner, status, blockers, ETA).

### Exit criteria
- Approved scope and parity list.
- Signed-off migration KPIs.
- Owners assigned for each milestone.

---

## Milestone 1 - Workspace and Build Foundation
**Goal:** Make `react-native/` a stable Expo app in this monorepo.

### Tasks
- Standardize package manager strategy for `react-native/` (prefer one lockfile strategy and deterministic installs).
- Configure Metro/watchFolders and path aliasing for shared packages used from monorepo.
- Add environment/config loading strategy (API base URL, secrets, build-time vars).
- Validate local dev flow on iOS and Android using `expo start` and dev builds.

### Exit criteria
- Clean install and boot on iOS/Android for all team members.
- CI job can install and typecheck Expo app.
- Environment configuration documented and repeatable.

---

## Milestone 2 - Shared Core Extraction and Compatibility Layer
**Goal:** Reuse existing shared logic from `packages/blocks`/`packages/framework` in Expo with minimal breakage.

### Tasks
- Inventory reusable modules vs mobile-coupled modules.
- Introduce compatibility layer for platform-specific APIs (storage, device info, permissions, deep links, notifications).
- Resolve imports that assume old mobile paths or old translation locations.
- Add thin adapter wrappers where old interfaces must be preserved.

### Exit criteria
- Core app state/session/API flows run inside Expo without native project edits.
- Shared modules compile with Expo TypeScript/Babel settings.
- No unresolved import/path mismatches in migrated scope.

---

## Milestone 3 - Navigation and Screen Shell Parity
**Goal:** Reach route-level parity in Expo navigation.

### Tasks
- Map legacy route names (`packages/mobile/App.tsx`) to React Navigation v6 structure in `react-native/`.
- Preserve deep-link behavior and route params contract.
- Replace route guards and auth redirects with modern navigation patterns.
- Add placeholder-to-real-screen migration checklist per route.

### Exit criteria
- All in-scope routes are reachable in Expo.
- Authenticated/unauthenticated navigation flow matches old behavior.
- Route contract tests pass (basic navigation integration tests).

---

## Milestone 4 - Feature Migration (Vertical Slices)
**Goal:** Move user-facing features in priority order.

### Priority order
1. Authentication and session
2. Dashboard
3. Catalogue/content
4. Profile/settings
5. Notifications
6. Remaining blocks

### Tasks per feature
- Port UI and controller wiring.
- Verify API request/response handling.
- Validate loading/empty/error states.
- Validate offline/resume behavior if applicable.

### Exit criteria
- Feature parity checklist complete for each migrated vertical slice.
- Product owner sign-off for each slice.

---

## Milestone 5 - Native Module and Plugin Migration Matrix
**Goal:** Eliminate blockers caused by old native dependencies.

### Required action categories
- **Keep with Expo plugin/dev build:** module has stable Expo plugin path.
- **Replace:** migrate to Expo-supported alternative.
- **Defer/feature-flag:** temporarily disable non-critical feature until replacement exists.

### Known high-risk modules to resolve early
- Firebase app/messaging
- In-app purchase
- Facebook SDK login
- File/document picker and file viewer
- Media playback/recording edge cases
- Advanced permissions and background behaviors
- Splash and startup customization

### Exit criteria
- Every native dependency in old mobile app has one of: keep/replace/defer decision.
- No unresolved native module in critical user flows.
- Dev build succeeds with required config plugins.

---

## Milestone 6 - Data, i18n, and Asset Parity
**Goal:** Ensure correctness of app content and localization in Expo.

### Tasks
- Consolidate translation source location and remove broken path assumptions.
- Migrate/verify static assets (icons, images, fonts, sounds).
- Validate cache/storage migration strategy from old app to Expo app (if needed).
- Confirm locale switching and fallback language behavior.

### Exit criteria
- No missing assets in migrated screens.
- i18n works on all supported locales.
- Storage/session continuity approach documented and tested.

---

## Milestone 7 - Testing and Quality Gate
**Goal:** Establish confidence with automated and manual quality checks.

### Tasks
- Set up Expo-focused lint/typecheck/test scripts.
- Migrate critical tests from legacy setup (or rewrite where architecture changed).
- Add smoke E2E plan for critical flows (login, dashboard, catalogue, profile).
- Add release-candidate checklist (crash, performance, API failures, offline).

### Exit criteria
- CI quality gate for Expo app passes consistently.
- Manual QA regression checklist passes on both iOS and Android.
- No P0/P1 issues open for in-scope features.

---

## Milestone 8 - Release Readiness and Cutover
**Goal:** Safely transition from old bare app to Expo app.

### Tasks
- Finalize bundle identifiers/package names, build profiles, signing, and release channels.
- Verify push notification credentials and store compliance requirements.
- Run staged rollout plan and monitor crash/performance analytics.
- Create rollback and hotfix playbook.

### Exit criteria
- Expo app accepted in target stores/internal distribution.
- Observability dashboards active and monitored.
- `packages/mobile` retirement decision approved (archive or maintenance mode).

---

## 4) Dependency Migration Matrix Template

Use this table as a live tracker. A machine-readable starter list lives at `react-native/native-module-matrix.json` (keep in sync with the table below as owners update status).

### Bootstrap status (2026-04)

- **Default Expo entry** is **legacy** `packages/mobile/App.tsx` (same UI as the old app). Opt into the RN6 scaffold with **`EXPO_PUBLIC_USE_EXPO_SHELL=true`**.
- **Typecheck** for the Expo shell is scoped to `react-native/src/**/*.ts(x)` so CI validates the migrated code path without pulling the whole legacy graph (see `react-native/tsconfig.json`).

| Dependency | Current Location | Expo Strategy (Keep/Replace/Defer) | Owner | Status | Notes |
|---|---|---|---|---|---|
| `@react-native-firebase/messaging` | old mobile |  |  |  |  |
| `react-native-iap` | old mobile |  |  |  |  |
| `react-native-fbsdk` | old mobile |  |  |  |  |
| `react-native-document-picker` | old mobile |  |  |  |  |
| `react-native-file-viewer` | old mobile |  |  |  |  |
| `react-native-video` | old mobile |  |  |  |  |
| `react-native-permissions` | old mobile |  |  |  |  |
| `react-native-splash-screen` | old mobile |  |  |  |  |

---

## 5) Definition of Done (Project-Level)

Project is considered successfully converted when all items below are true:

- Expo app in `react-native/` is the primary, releasable mobile app.
- In-scope user journeys have verified parity with old app behavior.
- Native dependency decisions are complete, documented, and implemented.
- CI/CD, environment config, and release process are operational for Expo app.
- Operational metrics after rollout meet agreed targets (stability/performance).
- Legacy `packages/mobile` has a documented retirement/maintenance policy.

---

## 6) Suggested Execution Cadence

- Weekly: architecture + blockers review.
- Daily: migration standup with dependency blocker triage.
- End of each milestone: demo + parity checklist sign-off + risk re-baselining.

---

## 7) Immediate Next Actions (Week 1)

1. Approve parity scope and feature order.
2. Finalize monorepo integration decisions for `react-native/` (imports, Metro, env).
3. Build dependency migration matrix and assign owners.
4. Migrate auth/session as first vertical slice and validate on both platforms.
5. Stand up Expo CI quality gate (lint + typecheck + smoke run).
