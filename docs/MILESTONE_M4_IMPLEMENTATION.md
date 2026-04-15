# Milestone M4 — Consumer app: Firestore read path

Independent implementation plan extracted from [ROADMAP_IMPLEMENTATION_MILESTONES.md](./ROADMAP_IMPLEMENTATION_MILESTONES.md). Scope: **EtOH Coach consumer app** (not geoVINUM). Product context: [CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md](./CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md).

**Companion docs:** Expo work: [`EXPO_MIGRATION_MILESTONES.md`](../EXPO_MIGRATION_MILESTONES.md), [`EXPO_SCREEN_PARITY_CHECKLIST.md`](../EXPO_SCREEN_PARITY_CHECKLIST.md). **Prerequisite:** [M1](./MILESTONE_M1_IMPLEMENTATION.md) deployed rules; published content available ([M2](./MILESTONE_M2_IMPLEMENTATION.md) / [M3](./MILESTONE_M3_IMPLEMENTATION.md) as applicable).

---

## Goal

App loads catalogue, lessons, flashcards, and quiz from **Firestore** for published content only.

---

## What to implement

- Add `@react-native-firebase/firestore` or **Firebase JS SDK** (Expo: use recommended approach for your runtime — dev build if native module required).
- Replace or branch logic currently hitting REST (`packages/blocks/catalogue/src/config.js` and controllers) to **query Firestore**:
  - `courses` where `status == "published"` (and language filter as needed).
  - `lessons` by `course_id`, ordered by `order`.
  - `flashcards` / `quiz_questions` by `lesson_id`, ordered by `order`.
- **Keep** IAP, profile, and **account creation** on current stack unless Milestone M5+ auth migration is scoped (today: Rails JWT — see CLIENT_SPEC §Backend services).

---

## How to implement

1. Introduce a thin **content repository** module (e.g. `getPublishedCourses()`, `getLessonDetail()`) so UI blocks do not scatter raw Firestore calls.
2. Mirror existing controller state shape where possible to limit UI churn.
3. Branch on **`CONTENT_SOURCE`** / `EXPO_PUBLIC_CONTENT_SOURCE` (`rest` | `firestore`) until parity QA.
4. **Offline:** decide if you need persistence/cache (Firestore offline persistence) — enable if product requires.

---

## Exit criteria

- QA passes on themed navigation, lesson playback, flashcards, quiz using Firestore-only reads on staging.
- No draft content visible in app (spot-check rules + client queries).

---

## After M4

Proceed to [Milestone M5 — Compliance onboarding](./MILESTONE_M5_IMPLEMENTATION.md) (can overlap with M4 if store deadline is tight). Full sequence: [ROADMAP_IMPLEMENTATION_MILESTONES.md](./ROADMAP_IMPLEMENTATION_MILESTONES.md).

---

## Reference paths (repo)

| Area | Path |
|------|------|
| Catalogue REST config (today) | [`packages/blocks/catalogue/src/config.js`](../packages/blocks/catalogue/src/config.js) |
| Firestore types | [`firebase/content-schema.ts`](../firebase/content-schema.ts) |
| Expo API / flags | [`react-native/src/config/expoFrameworkConfig.js`](../react-native/src/config/expoFrameworkConfig.js) |
| Framework config | [`packages/framework/src/config.js`](../packages/framework/src/config.js) |
