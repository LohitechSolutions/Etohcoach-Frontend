# Milestone M3 — Data migration & parallel run (optional but recommended)

Independent implementation plan extracted from [ROADMAP_IMPLEMENTATION_MILESTONES.md](./ROADMAP_IMPLEMENTATION_MILESTONES.md). Scope: **EtOH Coach consumer app + admin CMS** (not geoVINUM). Product context: [CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md](./CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md).

**Companion docs:** Expo work: [`EXPO_MIGRATION_MILESTONES.md`](../EXPO_MIGRATION_MILESTONES.md), [`EXPO_SCREEN_PARITY_CHECKLIST.md`](../EXPO_SCREEN_PARITY_CHECKLIST.md). **Prerequisite:** Firestore schema stable ([M0](./MILESTONE_M0_IMPLEMENTATION.md)); admin or import path able to write content ([M2](./MILESTONE_M2_IMPLEMENTATION.md) / [M2b](./MILESTONE_M2B_IMPLEMENTATION.md)) helps but ETL may run standalone.

---

## Goal

Move or mirror catalogue from **Railway Rails** to Firestore without breaking production app until cutover.

---

## What to implement

- One-off or repeatable **ETL script** (Node or Ruby): read Rails API or DB export → write Firestore docs matching [`content-schema.ts`](../firebase/content-schema.ts).
- **Feature flag** in app config (e.g. `CONTENT_SOURCE=rest|firestore`) for staged rollout — already wired as `EXPO_PUBLIC_CONTENT_SOURCE` / `CONTENT_SOURCE` per [ADR 0001](./decisions/0001-m0-architecture-product-decisions.md); extend other clients consistently.

---

## How to implement

1. Map Rails entities to `CourseDoc`, `LessonDoc`, `FlashcardDoc`, `QuizQuestionDoc`.
2. Set `lesson_status` on children to match lesson `status` during migration.
3. Run against **staging** Firebase first; compare counts and spot-check media URLs.

---

## Exit criteria

- Staging Firestore mirrors production content within agreed tolerance.
- Rollback plan documented (flag back to REST).

---

## After M3

Proceed to [Milestone M4 — Consumer app: Firestore read path](./MILESTONE_M4_IMPLEMENTATION.md). Full sequence: [ROADMAP_IMPLEMENTATION_MILESTONES.md](./ROADMAP_IMPLEMENTATION_MILESTONES.md).

---

## Reference paths (repo)

| Area | Path |
|------|------|
| Schema target | [`firebase/content-schema.ts`](../firebase/content-schema.ts) |
| Catalogue REST (source) | [`packages/blocks/catalogue/src/config.js`](../packages/blocks/catalogue/src/config.js) |
| Content source flag | [`react-native/src/config/expoFrameworkConfig.js`](../react-native/src/config/expoFrameworkConfig.js), [`packages/framework/src/config.js`](../packages/framework/src/config.js) |
