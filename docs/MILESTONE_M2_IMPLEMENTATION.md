# Milestone M2 — Admin dashboard MVP (web)

Independent implementation plan extracted from [ROADMAP_IMPLEMENTATION_MILESTONES.md](./ROADMAP_IMPLEMENTATION_MILESTONES.md). Scope: **EtOH Coach consumer app + admin CMS** (not geoVINUM). Product context: [CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md](./CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md) (§2.1–2.4, §2.6–2.7).

**Companion docs:** Expo work: [`EXPO_MIGRATION_MILESTONES.md`](../EXPO_MIGRATION_MILESTONES.md), [`EXPO_SCREEN_PARITY_CHECKLIST.md`](../EXPO_SCREEN_PARITY_CHECKLIST.md). **Prerequisite:** [Milestone M1](./MILESTONE_M1_IMPLEMENTATION.md).

---

## Goal

Operators can create and publish **courses → lessons → flashcards → quiz** via **`Etohcoach-Backend`** (Rails + ActiveAdmin / admin API), not a separate Vite admin in this repo.

---

## What to implement

- **CRUD** for: courses, lessons, flashcards, quiz questions (fields per client spec in CLIENT_SPEC §2.1–2.4).
- **Media:** upload to **Firebase Storage**; store `image_url` / `video_url` (or Storage paths + download URL pattern) on documents.
- **Reorder:** `order` field + UI to change order; batch writes or transactions for consistency.
- **Draft / publish:** `status` on course and lesson; on publish/update lesson, **sync `lesson_status`** on all child flashcards and quiz docs (Cloud Function `onWrite` on `lessons/{id}` is the most reliable way to avoid drift).
- **Validation:** enforce minimum **1 flashcard** and **1 quiz question** per lesson before allowing **published** state (client-side + rules or Function as safety net).

---

## How to implement

1. **Stack (current):** Operator CMS lives in **`Etohcoach-Backend`** — Rails API, **ActiveAdmin** (`config/routes.rb`), and `namespace :admin` JSON endpoints — not a separate Vite app in this repo.
2. **Firebase path (if you return to it later):** `firebase` JS modular SDK — Auth, Firestore, Storage — can power a future admin SPA; rules and `grantAdmin` in `firebase/` remain available.
3. **Auth:** Rails/ActiveAdmin sessions for back office; Firebase **admin** custom claim only applies if you ship a Firebase-backed admin UI again.
4. **Import (MVP+):** Defer to [M2b](./MILESTONE_M2B_IMPLEMENTATION.md) if needed; parser for CSV/XLSX with **all-or-nothing** validation (see M2b).

---

## Exit criteria

- End-to-end: create draft course → add lesson → add flashcards/quiz → publish → data persisted via **Rails** (DB / API) as the source of truth for the live app path you use.
- If you also use **Firestore** for CMS: non-admin cannot write CMS collections (verify with rules); children stay in sync with `lesson_status` as designed.

---

## After M2

- Optional next: [Milestone M2b — Bulk import](./MILESTONE_M2B_IMPLEMENTATION.md), then [M3](./MILESTONE_M3_IMPLEMENTATION.md). Full sequence: [ROADMAP_IMPLEMENTATION_MILESTONES.md](./ROADMAP_IMPLEMENTATION_MILESTONES.md).

---

## Reference paths (repo)

| Area | Path |
|------|------|
| Client spec (CMS fields) | [docs/CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md](./CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md) |
| Firestore types | [`firebase/content-schema.ts`](../firebase/content-schema.ts) |
| **Operator CMS (Rails)** | [`Etohcoach-Backend`](../Etohcoach-Backend) — ActiveAdmin + admin API routes (`config/routes.rb`) |
| Admin placeholder (legacy) | [`packages/blocks/ContentManagement/`](../packages/blocks/ContentManagement/) |
| Bulk import detail | [MILESTONE_M2B_IMPLEMENTATION.md](./MILESTONE_M2B_IMPLEMENTATION.md) |
