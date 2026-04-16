# Milestone M1 — Firebase foundation (project, rules, indexes)

Independent implementation plan extracted from [ROADMAP_IMPLEMENTATION_MILESTONES.md](./ROADMAP_IMPLEMENTATION_MILESTONES.md). Scope: **EtOH Coach consumer app + admin CMS** (not geoVINUM). Product context: [CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md](./CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md).

**Companion docs:** Expo work: [`EXPO_MIGRATION_MILESTONES.md`](../EXPO_MIGRATION_MILESTONES.md), [`EXPO_SCREEN_PARITY_CHECKLIST.md`](../EXPO_SCREEN_PARITY_CHECKLIST.md). **Prerequisite:** [Milestone M0](./MILESTONE_M0_IMPLEMENTATION.md) complete ([ADR 0001](./decisions/0001-m0-architecture-product-decisions.md)).

**Implementation record (repo):** Firestore rules and indexes were started in M0. M1 adds **Storage rules** (`firebase/storage.rules`), **Firebase CLI layout** (`firebase/firebase.json`, `firebase/package.json`), **emulator config**, **Cloud Function `grantAdmin`** (`firebase/functions/`), and root **`yarn firebase:*`** scripts. You still must create/link a **Firebase project** in the console and run deploy (below).

---

## Goal

A real Firebase project ready for **secure** admin writes and **read-only** app access to published content.

---

## What to implement

- Firebase project (or use existing EtOH project) with **Authentication**, **Firestore**, **Storage**.
- **Custom claims** for admin users (`admin: true` or role string).
- Deploy **Firestore security rules** and **composite indexes** from repo (`firebase/`).
- **Denormalization rule:** flashcards and `quiz_questions` carry **`lesson_status`** (see schema comments) so rules can hide draft children.

---

## How to implement

1. **CLI:** Install Firebase CLI; `firebase login`; from the `firebase/` directory (or pass `--config`), `firebase use <projectId>`.
2. **Rules:** Start from [`firebase/firestore.rules`](../firebase/firestore.rules). Ensure:
   - Authenticated **admin** (custom claim) can create/update/delete CMS collections.
   - Unauthenticated or app users can **read only** documents where parent lesson/course `status == "published"` and child `lesson_status` matches (no draft leakage).
3. **Indexes:** Deploy [`firebase/firestore.indexes.json`](../firebase/firestore.indexes.json); add any new composite indexes required by admin lists (e.g. `course_id` + `order`).
4. **Storage rules:** Restrict writes to admin; reads as needed for public media (often public read for published assets, or signed URLs from admin).
5. **Admin claim:** Cloud Function or secure backend endpoint callable only by super-admins to set `admin` custom claim — avoid doing this manually in production long term.

---

## Exit criteria

- Rules deployed; **attempted draft read from client role fails** in Firebase emulator or staging.
- Indexes build without error; representative queries used by admin and app succeed.

---

## After M1

Proceed to [Milestone M2 — Admin dashboard MVP](./MILESTONE_M2_IMPLEMENTATION.md). Full sequence: [ROADMAP_IMPLEMENTATION_MILESTONES.md](./ROADMAP_IMPLEMENTATION_MILESTONES.md).

---

## Deploy & bootstrap runbook

1. In [Firebase Console](https://console.firebase.google.com), create or select the EtOH project; enable **Authentication** (Email/Password or as needed), **Firestore**, **Storage**, and **Functions** (Blaze may be required for Functions).
2. `cd firebase && cp .firebaserc.example .firebaserc` — set `"default"` to your **project id**.
3. `npm install` in `firebase/` (installs `firebase-tools`) and `npm install` in `firebase/functions` (or from repo root: `yarn firebase:install`).
4. Deploy rules and indexes: `yarn firebase:deploy:rules` (or `npm run deploy:rules` from `firebase/`).
5. Set super-admin allowlist for the **first** bootstrap (comma-separated emails matching Firebase Auth):  
   `firebase functions:config:set superadmin.emails="founder@example.com"`  
   then `yarn firebase:deploy:functions`.
6. Sign in to the app/admin as that user, call callable **`grantAdmin`** with `{ uid: "<firebaseAuthUid>" }` — including **`uid` equal to your own** to promote yourself after first deploy (e.g. one-off script or temporary UI). Then grant other operators the same way. Tighten or remove `superadmin.emails` after bootstrap if desired.
7. **Exit criteria / QA:** In emulator or staging (`yarn firebase:emulators`), confirm a **non-admin** client cannot read a **draft** course/lesson and cannot write Storage/Firestore; confirm **admin** can CRUD and upload under `etoh_cms/`.

---

## Reference paths (repo)

| Area | Path |
|------|------|
| Firestore types / collections | [`firebase/content-schema.ts`](../firebase/content-schema.ts) |
| Firestore rules / indexes | [`firebase/firestore.rules`](../firebase/firestore.rules), [`firebase/firestore.indexes.json`](../firebase/firestore.indexes.json) |
| Storage rules | [`firebase/storage.rules`](../firebase/storage.rules) |
| Admin claim callable | [`firebase/functions/src/index.ts`](../firebase/functions/src/index.ts) |
| Firebase CLI config | [`firebase/firebase.json`](../firebase/firebase.json), [`firebase/.firebaserc.example`](../firebase/.firebaserc.example) |
| Testing & ops (emulator, secrets) | [Milestone — Cross-cutting](./MILESTONE_CROSS_CUTTING_TESTING_OPS.md) |
