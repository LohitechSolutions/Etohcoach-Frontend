# Milestone M6 — Polish & store readiness

Independent implementation plan extracted from [ROADMAP_IMPLEMENTATION_MILESTONES.md](./ROADMAP_IMPLEMENTATION_MILESTONES.md). Scope: **EtOH Coach consumer app + admin CMS** (not geoVINUM). Product context: [CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md](./CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md) (§4.1, §4 store copy).

**Companion docs:** Expo work: [`EXPO_MIGRATION_MILESTONES.md`](../EXPO_MIGRATION_MILESTONES.md), [`EXPO_SCREEN_PARITY_CHECKLIST.md`](../EXPO_SCREEN_PARITY_CHECKLIST.md). **Prerequisite:** [M4](./MILESTONE_M4_IMPLEMENTATION.md) (or nearing completion) so catalogue data and filters reflect CMS; [M5](./MILESTONE_M5_IMPLEMENTATION.md) for store compliance as required.

---

## Goal

Align copy, filters, and listings with new CMS fields; reduce legacy “certification prep” strings where inappropriate.

---

## What to implement

- **i18n pass** for EN + FR/ES/PT/IT shell as prioritized (CLIENT_SPEC §4).
- **Catalogue filters:** align with Moment / Situation / Skill when those fields exist on Firestore docs (may require schema extension — revisit [M0 ADR](./decisions/0001-m0-architecture-product-decisions.md) if adding fields).
- **Store assets:** subtitles, descriptions, keywords (track as checklist; often outside this repo).

---

## How to implement

1. Add filter fields to Firestore schema and admin UI first; then update `CatalogueController` query layer.
2. Centralize marketing strings for easy translation.

---

## Exit criteria

- Signed-off copy deck; filter behavior matches CMS data on staging.

---

## After M6

Roadmap core milestones for EtOH Coach + admin are complete for this document set. Ongoing: [Cross-cutting — testing & ops](./MILESTONE_CROSS_CUTTING_TESTING_OPS.md), Expo parity docs, and product backlog. Master index: [ROADMAP_IMPLEMENTATION_MILESTONES.md](./ROADMAP_IMPLEMENTATION_MILESTONES.md).

---

## Reference paths (repo)

| Area | Path |
|------|------|
| Catalogue / filters | [`packages/blocks/catalogue/`](../packages/blocks/catalogue/) |
| Firestore filter helpers | [`packages/blocks/catalogue/src/content/firestoreRepository.ts`](../packages/blocks/catalogue/src/content/firestoreRepository.ts) (`applyCatalogueClientFilters`, `buildCmsTagFlatlistData`) |
| Product copy i18n keys (M6) | [`packages/blocks/catalogue/src/productCopyKeys.ts`](../packages/blocks/catalogue/src/productCopyKeys.ts) |
| i18n | [`packages/blocks/LanguageOptions/`](../packages/blocks/LanguageOptions/) (`en`, `fr`, `enus`, `es`, `pt`, `it` under `src/component/translations/`) |
| CMS schema | [`firebase/content-schema.ts`](../firebase/content-schema.ts) |
| Admin course tags | [`admin/src/pages/CourseDetailPage.tsx`](../admin/src/pages/CourseDetailPage.tsx) |

## Store assets checklist (often outside repo)

Track with product / ASO owner: **subtitle**, **long description**, **short description**, **keywords** (iOS), **Play tags** (Android), promotional text, screenshots, privacy policy URL, support URL. Update store listings when marketing copy in `LanguageOptions` changes materially.
