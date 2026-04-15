# Milestone M5 — Compliance onboarding (consumer app)

Independent implementation plan extracted from [ROADMAP_IMPLEMENTATION_MILESTONES.md](./ROADMAP_IMPLEMENTATION_MILESTONES.md). Scope: **EtOH Coach consumer app** (not geoVINUM). Product context: [CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md](./CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md) (§4.3–4.4).

**Companion docs:** Expo work: [`EXPO_MIGRATION_MILESTONES.md`](../EXPO_MIGRATION_MILESTONES.md), [`EXPO_SCREEN_PARITY_CHECKLIST.md`](../EXPO_SCREEN_PARITY_CHECKLIST.md). **Prerequisite:** None strict; often run **in parallel with [M4](./MILESTONE_M4_IMPLEMENTATION.md)** if store submission is time-critical.

---

## Goal

Store-required flow: **age → account → TOS & privacy → analytics consent → optional marketing consent**; persist flags and versions.

---

## What to implement

- Screens and persistence for: `age_verified`, `tos_accepted`, `privacy_accepted`, document versions, `consent_timestamp`, `analytics_consent`, `marketing_consent` (per CLIENT_SPEC §4.3).
- Block analytics events until `analytics_consent` is true (wire [`AnalyticsController`](../packages/blocks/analytics/src/AnalyticsController.tsx) / Firebase Analytics accordingly).
- Legal: host Privacy + T&Cs with versioning; link from checkboxes.

---

## How to implement

1. **Storage:** Prefer backend user profile fields (Rails) for auditability; if offline-first needed, sync to server after login.
2. **Gating:** Central `canUseApp` / navigation guard that checks consent state before main tabs.
3. **Analytics:** Wrap `logEvent` in a consent check (single module so nothing bypasses).

---

## Exit criteria

- Full flow testable on fresh install; consent changes reflected in stored profile.
- Analytics does not fire when consent denied (verify in debug view or logging).

---

## After M5

Proceed to [Milestone M6 — Polish & store readiness](./MILESTONE_M6_IMPLEMENTATION.md). Full sequence: [ROADMAP_IMPLEMENTATION_MILESTONES.md](./ROADMAP_IMPLEMENTATION_MILESTONES.md).

---

## Reference paths (repo)

| Area | Path |
|------|------|
| Analytics | [`packages/blocks/analytics/src/AnalyticsController.tsx`](../packages/blocks/analytics/src/AnalyticsController.tsx) |
| Terms (existing) | [`packages/blocks/TermsAndConditions/`](../packages/blocks/TermsAndConditions/) |
| Client spec (compliance) | [docs/CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md](./CLIENT_SPEC_AND_IMPLEMENTATION_ROADMAP.md) §4.3 |
