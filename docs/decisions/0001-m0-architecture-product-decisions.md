# ADR 0001 — M0 architecture & product decisions (EtOH Coach + admin CMS)

**Status:** Accepted  
**Date:** 2026-04-15  
**Owner:** Engineering (EtOH Coach)  
**Context:** [MILESTONE_M0_IMPLEMENTATION.md](../MILESTONE_M0_IMPLEMENTATION.md), [CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md](../CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md)

---

## Decision summary

| Topic | Decision |
|-------|----------|
| **Lesson vs chapter (Firestore)** | Single entity: collection id **`lessons`**. UX may label rows “Chapter N” in the consumer app; do not add a separate `chapters` collection for the same entity. |
| **Theme vs category** | **Single source of truth:** field **`category`** on each **course** document, enum **`attract` \| `convince` \| `convert`** (matches client course fields and import column `category`). A separate **`themes`** collection is **out of scope for MVP**; the §4.5 “Theme → Course” hub can be expressed as grouping/filtering by `category` (and course cover imagery) until product requests a distinct theme entity. |
| **Rails → Firestore cutover** | **`parallel`** strategy: app keeps reading **REST (Railway)** by default; opt-in **Firestore** reads via env flag until parity QA. Implemented as **`EXPO_PUBLIC_CONTENT_SOURCE`** (`rest` \| `firestore`) in [`react-native/src/config/expoFrameworkConfig.js`](../../react-native/src/config/expoFrameworkConfig.js). Other clients (web) should use the same convention when added. |
| **Auth split** | **Admin:** Firebase Auth + **`admin` custom claim** for CMS writes. **Consumer app (MVP):** stays on **Rails accounts + JWT** (`account_block/accounts`); no consumer migration to Firebase Auth in this phase. **Future:** optional Firebase Auth for consumers may be revisited if product requires it; not required for Firestore read-only catalogue path. |

---

## Consequences

- Types and collection names are frozen in [`firebase/content-schema.ts`](../../firebase/content-schema.ts).
- Security rules use the same collection ids and **`lesson_status`** denormalization on child docs — see [`firebase/firestore.rules`](../../firebase/firestore.rules).
- Import pipelines and admin UI should use **`category`** on courses, not a parallel theme id, unless ADR is superseded.

---

## Supersedes

N/A (initial M0 record)
