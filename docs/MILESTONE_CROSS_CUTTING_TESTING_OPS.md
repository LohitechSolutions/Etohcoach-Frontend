# Cross-cutting — Testing & operations (EtOH Coach + admin)

Guidance extracted from [ROADMAP_IMPLEMENTATION_MILESTONES.md](./ROADMAP_IMPLEMENTATION_MILESTONES.md). Applies across [M1](./MILESTONE_M1_IMPLEMENTATION.md)–[M6](./MILESTONE_M6_IMPLEMENTATION.md). Scope: **EtOH Coach consumer app + admin CMS** (not geoVINUM).

**Companion docs:** [CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md](./CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md); Expo: [`EXPO_MIGRATION_MILESTONES.md`](../EXPO_MIGRATION_MILESTONES.md), [`EXPO_SCREEN_PARITY_CHECKLIST.md`](../EXPO_SCREEN_PARITY_CHECKLIST.md).

---

## Goal

Keep Firebase, secrets, and quality gates safe and observable as you ship admin and Firestore-backed app reads.

---

## What to implement

| Area | What to do |
|------|------------|
| **Emulator** | Use Firebase Emulator Suite for rules tests and admin integration tests in CI. |
| **Secrets** | Never commit Firebase keys; use env / EAS secrets for mobile; `.env` for web admin. |
| **Monitoring** | Enable Firebase App Check (optional) before broad public ship; monitor Firestore read/write costs after [M4](./MILESTONE_M4_IMPLEMENTATION.md). |

---

## How to implement

1. **Emulator:** Add scripts to run `firebase emulators:start` with the same `firestore.rules` as production; run rule unit tests or integration tests against emulated Firestore before deploy.
2. **Secrets:** Document required env vars per app (`EXPO_PUBLIC_*` for Expo, admin `.env` for Vite/Next); use team secret manager for CI.
3. **Monitoring:** After enabling Firestore reads in the consumer app, set billing alerts and review hot queries / index usage in Firebase console.

---

## Exit criteria

- Team agrees where emulator runs (local + CI) and that production keys are not in git history.
- Cost and App Check decisions recorded (even if “defer App Check to pre-launch”).

---

## Related milestone plans

| Milestone | Doc |
|-----------|-----|
| M0 | [MILESTONE_M0_IMPLEMENTATION.md](./MILESTONE_M0_IMPLEMENTATION.md) |
| M1 | [MILESTONE_M1_IMPLEMENTATION.md](./MILESTONE_M1_IMPLEMENTATION.md) |
| M2 | [MILESTONE_M2_IMPLEMENTATION.md](./MILESTONE_M2_IMPLEMENTATION.md) |
| M2b | [MILESTONE_M2B_IMPLEMENTATION.md](./MILESTONE_M2B_IMPLEMENTATION.md) |
| M3 | [MILESTONE_M3_IMPLEMENTATION.md](./MILESTONE_M3_IMPLEMENTATION.md) |
| M4 | [MILESTONE_M4_IMPLEMENTATION.md](./MILESTONE_M4_IMPLEMENTATION.md) |
| M5 | [MILESTONE_M5_IMPLEMENTATION.md](./MILESTONE_M5_IMPLEMENTATION.md) |
| M6 | [MILESTONE_M6_IMPLEMENTATION.md](./MILESTONE_M6_IMPLEMENTATION.md) |
| Master roadmap | [ROADMAP_IMPLEMENTATION_MILESTONES.md](./ROADMAP_IMPLEMENTATION_MILESTONES.md) |
