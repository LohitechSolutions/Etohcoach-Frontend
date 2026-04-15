# Milestone M2b — Bulk import (CSV / XLSX)

Independent implementation plan extracted from [ROADMAP_IMPLEMENTATION_MILESTONES.md](./ROADMAP_IMPLEMENTATION_MILESTONES.md). Scope: **EtOH Coach admin CMS** (not geoVINUM). Product context: [CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md](./CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md) (§2.5).

**Companion docs:** Expo work: [`EXPO_MIGRATION_MILESTONES.md`](../EXPO_MIGRATION_MILESTONES.md), [`EXPO_SCREEN_PARITY_CHECKLIST.md`](../EXPO_SCREEN_PARITY_CHECKLIST.md). **Prerequisite:** [Milestone M2](./MILESTONE_M2_IMPLEMENTATION.md) admin MVP (or parallel UI surface for import only if agreed).

---

## Goal

One-shot content loads with **atomic success/failure** (no partial import).

---

## What to implement

- Upload file in admin UI.
- Parse **CSV** and **XLSX** (e.g. `papaparse` + `sheetjs`).
- Validate **every row** first; collect errors with row numbers.
- If any row invalid: return errors, **do not write** any row.
- If all valid: **batch commit** (Firestore batched writes ≤500 ops per batch; chunk if needed).
- Columns aligned with CLIENT_SPEC §2.5; extend mapping table if you add themes or schema fields (see [M0 ADR](./decisions/0001-m0-architecture-product-decisions.md)).

---

## How to implement

1. **Pure validation pass:** Build in-memory structure of intended docs; run business rules (course exists or will be created, lesson attach, min flashcards/quiz, option counts).
2. **Transaction or batched writes:** Only after validation passes.
3. **Idempotency:** Define behavior for re-import (reject duplicate titles vs upsert) and document it.

---

## Exit criteria

- Test fixtures: valid file imports; invalid file rolls back with readable errors.

---

## After M2b

Proceed to [Milestone M3 — Data migration & parallel run](./MILESTONE_M3_IMPLEMENTATION.md) (recommended) or continue the roadmap order in [ROADMAP_IMPLEMENTATION_MILESTONES.md](./ROADMAP_IMPLEMENTATION_MILESTONES.md).

---

## Reference paths (repo)

| Area | Path |
|------|------|
| Import column guidance | [docs/CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md](./CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md) §2.5 |
| Firestore document shapes | [`firebase/content-schema.ts`](../firebase/content-schema.ts) |
| Admin MVP | [MILESTONE_M2_IMPLEMENTATION.md](./MILESTONE_M2_IMPLEMENTATION.md) |
