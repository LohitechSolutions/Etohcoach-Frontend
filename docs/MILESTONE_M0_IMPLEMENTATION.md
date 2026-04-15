# Milestone M0 — Architecture & product decisions

This document is the **implementation guide for Milestone M0 only**, extracted from [ROADMAP_IMPLEMENTATION_MILESTONES.md](./ROADMAP_IMPLEMENTATION_MILESTONES.md). Scope: **EtOH Coach consumer app + admin CMS** (not geoVINUM). Product context: [CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md](./CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md).

**Why M0 matters:** These decisions block correct Firestore rules, admin forms, and app queries. Do not skip M0 or start M1 sign-off until the exit criteria below are satisfied.

**Implementation record (repo):** Decisions are captured in [ADR 0001](./decisions/0001-m0-architecture-product-decisions.md). Schema and rules live under [`firebase/`](../firebase/); the app content-source flag is `CONTENT_SOURCE` / `EXPO_PUBLIC_CONTENT_SOURCE` in [`react-native/src/config/expoFrameworkConfig.js`](../react-native/src/config/expoFrameworkConfig.js) and [`packages/framework/src/config.js`](../packages/framework/src/config.js).

---

## Goal

Remove ambiguity so engineering can implement without rework.

---

## What to implement

| Decision | Options / notes |
|----------|-----------------|
| **Lesson vs chapter** | Single Firestore entity; app label can stay “Chapter N”. Pick collection name: `lessons` (recommended, matches `firebase/content-schema.ts`) or rename consistently everywhere. |
| **Theme vs category** | One source of truth: e.g. `category` on course only, or `theme_id` + themes collection — not both drifting. |
| **Rails → Firestore cutover** | Choose: **parallel run** (app reads REST + optional feature flag for Firestore) vs **big bang** (higher risk). Recommended: parallel + flag until parity QA. |
| **Auth split** | Today: **accounts + JWT via Rails** (`account_block/accounts`). Target admin: **Firebase Auth + admin custom claim**. Document whether consumer app migrates to Firebase Auth later or stays on Rails indefinitely. |

---

## How to implement

1. Run a short **decision log** (wiki or ADR): record chosen options, owner, date.
2. Update [`firebase/content-schema.ts`](../firebase/content-schema.ts) if you rename collections or add `themes`.
3. Align [`firebase/firestore.rules`](../firebase/firestore.rules) drafts with those names before M1 sign-off.

---

## Exit criteria

- Written answers for every row in the decision table above.
- Collection list and field names frozen for MVP admin + app reads.

---

## After M0

Continue with **[Milestone M1 — Firebase foundation](./MILESTONE_M1_IMPLEMENTATION.md)** (full sequence: [ROADMAP_IMPLEMENTATION_MILESTONES.md](./ROADMAP_IMPLEMENTATION_MILESTONES.md)).

---

## Reference paths (repo)

| Area | Path |
|------|------|
| Full milestone sequence | [docs/ROADMAP_IMPLEMENTATION_MILESTONES.md](./ROADMAP_IMPLEMENTATION_MILESTONES.md) |
| Client spec & phases | [docs/CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md](./CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md) |
| Firestore types / collections | [`firebase/content-schema.ts`](../firebase/content-schema.ts) |
| Security rules (align names after decisions) | [`firebase/firestore.rules`](../firebase/firestore.rules) |
