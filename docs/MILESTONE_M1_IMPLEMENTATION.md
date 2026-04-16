# Milestone M1 — Firebase foundation (project, rules, indexes)

Independent implementation plan extracted from [ROADMAP_IMPLEMENTATION_MILESTONES.md](./ROADMAP_IMPLEMENTATION_MILESTONES.md). Scope: **EtOH Coach consumer app + admin CMS** (not geoVINUM). Product context: [CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md](./CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md).

**Companion docs:** Expo work: [`EXPO_MIGRATION_MILESTONES.md`](../EXPO_MIGRATION_MILESTONES.md), [`EXPO_SCREEN_PARITY_CHECKLIST.md`](../EXPO_SCREEN_PARITY_CHECKLIST.md). **Prerequisite:** [Milestone M0](./MILESTONE_M0_IMPLEMENTATION.md) complete ([ADR 0001](./decisions/0001-m0-architecture-product-decisions.md)).

**Prerequisite context:** Firestore rules and indexes were started in M0. M1 extends the repo with Storage rules, CLI layout, emulators, `grantAdmin`, and root scripts — see **Implementation status** below for what is already in the repo versus what you still do in Firebase Console and deploy.

---

## Implementation status

Use this section when you return to M1: **done** items are already in the repository; **pending** items are for you to run or verify later.

### Done (in repo — no action required to “have” these files)

- **Firestore:** [`firebase/firestore.rules`](../firebase/firestore.rules), [`firebase/firestore.indexes.json`](../firebase/firestore.indexes.json)
- **Storage:** [`firebase/storage.rules`](../firebase/storage.rules)
- **Firebase CLI / emulators:** [`firebase/firebase.json`](../firebase/firebase.json) (Firestore, Storage, Functions, Auth/Firestore/Storage emulator ports + UI), [`firebase/package.json`](../firebase/package.json), [`firebase/.firebaserc.example`](../firebase/.firebaserc.example)
- **Schema reference:** [`firebase/content-schema.ts`](../firebase/content-schema.ts) (incl. `lesson_status` denormalization notes for rules)
- **Admin custom claim:** Cloud Function **`grantAdmin`** — [`firebase/functions/`](../firebase/functions/) (callable; build via `firebase/functions` `package.json`)
- **Root scripts:** `yarn firebase:install`, `yarn firebase:emulators`, `yarn firebase:deploy:rules`, `yarn firebase:deploy:functions` in root [`package.json`](../package.json)

### Pending (for you to implement / run later)

- **Firebase project:** Create or select the EtOH project in [Firebase Console](https://console.firebase.google.com); enable **Authentication**, **Firestore**, **Storage**, and **Functions** (Blaze if required for Functions).
- **Link CLI:** Copy `firebase/.firebaserc.example` → `firebase/.firebaserc` and set the real **project id**; `firebase use <projectId>` from `firebase/`.
- **Install & deploy:** `yarn firebase:install` (or per-directory `npm install` as in the runbook); deploy rules/indexes with `yarn firebase:deploy:rules`; set `superadmin.emails`, then `yarn firebase:deploy:functions`.
- **Bootstrap admins:** After first deploy, call **`grantAdmin`** for real UIDs (including your own) per the runbook below; tighten allowlist afterward if desired.
- **Rules / indexes validation:** Confirm rules match product intent (admin CRUD, non-admin read-only for `published` + matching `lesson_status`); add composite indexes if new admin queries need them.
- **Exit criteria / QA:** Emulator or staging — non-admin cannot read drafts or write Storage/Firestore; admin can CRUD and upload under `etoh_cms/`; representative queries succeed.

---

## Goal

A real Firebase project ready for **secure** admin writes and **read-only** app access to published content.

---

## What to implement

*(See **[Implementation status](#implementation-status)** above: bullets here are the full M1 scope; **Done** vs **Pending** is spelled out there.)*

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
