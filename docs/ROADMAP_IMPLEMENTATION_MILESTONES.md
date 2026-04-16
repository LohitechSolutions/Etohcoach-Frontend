# EtOH Coach — Roadmap Implementation Milestones

This document turns [CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md](./CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md) into **sequenced milestones** with **what to build**, **how to implement it** (approach and order), and **exit criteria**. Scope: **EtOH Coach consumer app + admin CMS** only (not geoVINUM).

**Companion docs:** Expo app work remains tracked in [`EXPO_MIGRATION_MILESTONES.md`](../EXPO_MIGRATION_MILESTONES.md) and [`EXPO_SCREEN_PARITY_CHECKLIST.md`](../EXPO_SCREEN_PARITY_CHECKLIST.md).

**Per-milestone implementation guides (detailed plans):** [M0](./MILESTONE_M0_IMPLEMENTATION.md) · [M1](./MILESTONE_M1_IMPLEMENTATION.md) · [M2](./MILESTONE_M2_IMPLEMENTATION.md) · [M2b](./MILESTONE_M2B_IMPLEMENTATION.md) · [M3](./MILESTONE_M3_IMPLEMENTATION.md) · [M4](./MILESTONE_M4_IMPLEMENTATION.md) · [M5](./MILESTONE_M5_IMPLEMENTATION.md) · [M6](./MILESTONE_M6_IMPLEMENTATION.md) · [Cross-cutting (testing & ops)](./MILESTONE_CROSS_CUTTING_TESTING_OPS.md)

---

## How to use this file

1. Complete milestones **in order** unless you explicitly parallelize (e.g. admin UI while Firebase rules are reviewed).
2. For each milestone, satisfy **exit criteria** before calling it done.
3. **Phase 0 decisions** block correct Firestore rules, admin forms, and app queries — do not skip.

---

## Milestone M0 — Architecture & product decisions

**Goal:** Remove ambiguity so engineering can implement without rework.

### What to implement

| Decision | Options / notes |
|----------|-----------------|
| **Lesson vs chapter** | Single Firestore entity; app label can stay “Chapter N”. Pick collection name: `lessons` (recommended, matches `firebase/content-schema.ts`) or rename consistently everywhere. |
| **Theme vs category** | One source of truth: e.g. `category` on course only, or `theme_id` + themes collection — not both drifting. |
| **Rails → Firestore cutover** | Choose: **parallel run** (app reads REST + optional feature flag for Firestore) vs **big bang** (higher risk). Recommended: parallel + flag until parity QA. |
| **Auth split** | Today: **accounts + JWT via Rails** (`account_block/accounts`). Target admin: **Firebase Auth + admin custom claim**. Document whether consumer app migrates to Firebase Auth later or stays on Rails indefinitely. |

### How to implement

1. Run a short **decision log** (wiki or ADR): record chosen options, owner, date.
2. Update [`firebase/content-schema.ts`](../firebase/content-schema.ts) if you rename collections or add `themes`.
3. Align [`firebase/firestore.rules`](../firebase/firestore.rules) drafts with those names before M1 sign-off.

### Exit criteria

- Written answers for every row in the table above.
- Collection list and field names frozen for MVP admin + app reads.

---

## Milestone M1 — Firebase foundation (project, rules, indexes)

**Goal:** A real Firebase project ready for **secure** admin writes and **read-only** app access to published content.

### What to implement

- Firebase project (or use existing EtOH project) with **Authentication**, **Firestore**, **Storage**.
- **Custom claims** for admin users (`admin: true` or role string).
- Deploy **Firestore security rules** and **composite indexes** from repo (`firebase/`).
- **Denormalization rule:** flashcards and `quiz_questions` carry **`lesson_status`** (see schema comments) so rules can hide draft children.

### How to implement

1. **CLI:** Install Firebase CLI; `firebase login`; `firebase use <projectId>`.
2. **Rules:** Start from [`firebase/firestore.rules`](../firebase/firestore.rules). Ensure:
   - Authenticated **admin** (custom claim) can create/update/delete CMS collections.
   - Unauthenticated or app users can **read only** documents where parent lesson/course `status == "published"` and child `lesson_status` matches (no draft leakage).
3. **Indexes:** Deploy [`firebase/firestore.indexes.json`](../firebase/firestore.indexes.json); add any new composite indexes required by admin lists (e.g. `course_id` + `order`).
4. **Storage rules:** Restrict writes to admin; reads as needed for public media (often public read for published assets, or signed URLs from admin).
5. **Admin claim:** Cloud Function or secure backend endpoint callable only by super-admins to set `admin` custom claim — avoid doing this manually in production long term.

### Exit criteria

- Rules deployed; **attempted draft read from client role fails** in Firebase emulator or staging.
- Indexes build without error; representative queries used by admin and app succeed.

---

## Milestone M2 — Admin dashboard MVP (web)

**Goal:** Operators can create and publish **courses → lessons → flashcards → quiz** without touching Rails.

### What to implement

- **CRUD** for: courses, lessons, flashcards, quiz questions (fields per client spec in CLIENT_SPEC §2.1–2.4).
- **Media:** upload to **Firebase Storage**; store `image_url` / `video_url` (or Storage paths + download URL pattern) on documents.
- **Reorder:** `order` field + UI to change order; batch writes or transactions for consistency.
- **Draft / publish:** `status` on course and lesson; on publish/update lesson, **sync `lesson_status`** on all child flashcards and quiz docs (Cloud Function `onWrite` on `lessons/{id}` is the most reliable way to avoid drift).
- **Validation:** enforce minimum **1 flashcard** and **1 quiz question** per lesson before allowing **published** state (client-side + rules or Function as safety net).

### How to implement

1. **Stack:** Greenfield **React** (Vite or Next.js) or extend [`packages/web`](../packages/web) — avoid relying on legacy `rnmasterapp-c11e9` Firebase init for CMS; point admin at **EtOH** Firebase config.
2. **SDK:** `firebase` JS modular SDK — Auth (sign-in), Firestore (`getFirestore`), Storage (`getStorage`).
3. **Auth gating:** After login, decode ID token or use `onIdTokenChanged`; redirect if `admin` claim missing.
4. **Import (MVP+):** Defer to M2b if needed; parser for CSV/XLSX with **all-or-nothing** validation (see M2b).

### Exit criteria

- End-to-end: create draft course → add lesson → add flashcards/quiz → publish → documents visible in Firestore console with correct `lesson_status` on children.
- Non-admin user cannot write CMS collections (verify with rules).

---

## Milestone M2b — Bulk import (CSV / XLSX)

**Goal:** One-shot content loads with **atomic success/failure** (no partial import).

### What to implement

- Upload file in admin UI.
- Parse **CSV** and **XLSX** (e.g. `papaparse` + `sheetjs`).
- Validate **every row** first; collect errors with row numbers.
- If any row invalid: return errors, **do not write** any row.
- If all valid: **batch commit** (Firestore batched writes ≤500 ops per batch; chunk if needed).
- Columns aligned with CLIENT_SPEC §2.5; extend mapping table if you add themes.

### How to implement

1. **Pure validation pass:** Build in-memory structure of intended docs; run business rules (course exists or will be created, lesson attach, min flashcards/quiz, option counts).
2. **Transaction or batched writes:** Only after validation passes.
3. **Idempotency:** Define behavior for re-import (reject duplicate titles vs upsert) and document it.

### Exit criteria

- Test fixtures: valid file imports; invalid file rolls back with readable errors.

---

## Milestone M3 — Data migration & parallel run (optional but recommended)

**Goal:** Move or mirror catalogue from **Railway Rails** to Firestore without breaking production app until cutover.

### What to implement

- One-off or repeatable **ETL script** (Node or Ruby): read Rails API or DB export → write Firestore docs matching [`content-schema.ts`](../firebase/content-schema.ts).
- **Feature flag** in app config (e.g. `CONTENT_SOURCE=rest|firestore`) for staged rollout.

### How to implement

1. Map Rails entities to `CourseDoc`, `LessonDoc`, `FlashcardDoc`, `QuizQuestionDoc`.
2. Set `lesson_status` on children to match lesson `status` during migration.
3. Run against **staging** Firebase first; compare counts and spot-check media URLs.

### Exit criteria

- Staging Firestore mirrors production content within agreed tolerance.
- Rollback plan documented (flag back to REST).

---

## Milestone M4 — Consumer app: Firestore read path

**Goal:** App loads catalogue, lessons, flashcards, and quiz from **Firestore** for published content only.

### What to implement

- Add `@react-native-firebase/firestore` or **Firebase JS SDK** (Expo: use recommended approach for your runtime — dev build if native module required).
- Replace or branch logic currently hitting REST (`packages/blocks/catalogue/src/config.js` and controllers) to **query Firestore**:
  - `courses` where `status == "published"` (and language filter as needed).
  - `lessons` by `course_id`, ordered by `order`.
  - `flashcards` / `quiz_questions` by `lesson_id`, ordered by `order`.
- **Keep** IAP, profile, and **account creation** on current stack unless Milestone M5+ auth migration is scoped (today: Rails JWT — see CLIENT_SPEC §Backend services).

### How to implement

1. Introduce a thin **content repository** module (e.g. `getPublishedCourses()`, `getLessonDetail()`) so UI blocks do not scatter raw Firestore calls.
2. Mirror existing controller state shape where possible to limit UI churn.
3. **Offline:** decide if you need persistence/cache (Firestore offline persistence) — enable if product requires.

### Exit criteria

- QA passes on themed navigation, lesson playback, flashcards, quiz using Firestore-only reads on staging.
- No draft content visible in app (spot-check rules + client queries).

---

## Milestone M5 — Compliance onboarding (consumer app)

**Goal:** Store-required flow: **age → account → TOS & privacy → analytics consent → optional marketing consent**; persist flags and versions.

### What to implement

- Screens and persistence for: `age_verified`, `tos_accepted`, `privacy_accepted`, document versions, `consent_timestamp`, `analytics_consent`, `marketing_consent` (per CLIENT_SPEC §4.3).
- Block analytics events until `analytics_consent` is true (wire [`AnalyticsController`](../packages/blocks/analytics/src/AnalyticsController.tsx) / Firebase Analytics accordingly).
- Legal: host Privacy + T&Cs with versioning; link from checkboxes.

### How to implement

1. **Storage:** Prefer backend user profile fields (Rails) for auditability; if offline-first needed, sync to server after login.
2. **Gating:** Central `canUseApp` / navigation guard that checks consent state before main tabs.
3. **Analytics:** Wrap `logEvent` in a consent check (single module so nothing bypasses).

### Exit criteria

- Full flow testable on fresh install; consent changes reflected in stored profile.
- Analytics does not fire when consent denied (verify in debug view or logging).

---

## Milestone M6 — Polish & store readiness

**Goal:** Align copy, filters, and listings with new CMS fields; reduce legacy “certification prep” strings where inappropriate.

### What to implement

- **i18n pass** for EN + FR/ES/PT/IT shell as prioritized (CLIENT_SPEC §4).
- **Catalogue filters:** align with Moment / Situation / Skill when those fields exist on Firestore docs (may require schema extension in M0).
- **Store assets:** subtitles, descriptions, keywords (track as checklist; often outside this repo).

### How to implement

1. Add filter fields to Firestore schema and admin UI first; then update `CatalogueController` query layer.
2. Centralize marketing strings for easy translation.

### Exit criteria

- Signed-off copy deck; filter behavior matches CMS data on staging.

---

## Cross-cutting: testing & ops

| Area | What to do |
|------|------------|
| **Emulator** | Use Firebase Emulator Suite for rules tests and admin integration tests in CI. |
| **Secrets** | Never commit Firebase keys; use env / EAS secrets for mobile; `.env` for web admin. |
| **Monitoring** | Enable Firebase App Check (optional) before broad public ship; monitor Firestore read/write costs after M4. |

---

## Priority order (summary)

1. **M0** — Decisions (blocks everything).  
2. **M1** — Firebase rules + indexes + admin claims.  
3. **M2** (+ **M2b** import) — Admin MVP.  
4. **M3** — Migration + feature flag (recommended).  
5. **M4** — App Firestore reads.  
6. **M5** — Compliance (parallel with M4 if store deadline tight).  
7. **M6** — Polish and store.

---

## Reference paths (repo)

| Area | Path |
|------|------|
| Client spec & phases | [docs/CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md](./CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md) |
| Firestore types / collections | [`firebase/content-schema.ts`](../firebase/content-schema.ts) |
| Rules / indexes | [`firebase/firestore.rules`](../firebase/firestore.rules), [`firebase/firestore.indexes.json`](../firebase/firestore.indexes.json), [`firebase/storage.rules`](../firebase/storage.rules) |
| Functions (admin claim) | [`firebase/functions/src/index.ts`](../firebase/functions/src/index.ts) |
| Firebase CLI / emulators | [`firebase/firebase.json`](../firebase/firebase.json), [`firebase/package.json`](../firebase/package.json) |
| Catalogue REST config (today) | [`packages/blocks/catalogue/src/config.js`](../packages/blocks/catalogue/src/config.js) |
| Expo API base URL | [`react-native/src/config/expoFrameworkConfig.js`](../react-native/src/config/expoFrameworkConfig.js) |
| Admin placeholder | [`packages/blocks/ContentManagement/`](../packages/blocks/ContentManagement/) |

---

## Document history

- **Created:** Implementation milestones + “how to implement” guidance aligned with client roadmap and current repo layout.
