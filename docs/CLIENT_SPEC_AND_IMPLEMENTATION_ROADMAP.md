# EtOH Coach — Client Specification & Implementation Roadmap

**Scope (current):** **EtOH Coach** (mobile/web app experience) and the **admin dashboard** (content management).

**Out of scope:** **geoVINUM** and any other white-label products — do not implement or plan for them here.

This document consolidates client requirements that apply to EtOH Coach + admin, notes internal contradictions to resolve (content model, backend), summarizes what the repo already does, and suggests implementation phases.

---

## Backend services — verified in this repo

| Layer | What is used today | Evidence |
|--------|-------------------|----------|
| **Main API (catalogue, themes, lessons, flashcards, quiz, dashboard, accounts)** | **HTTP REST** to a **Ruby on Rails**-style backend hosted on **Railway** | Default base URL `https://etohcoach-backend-production.up.railway.app` in `react-native/src/config/expoFrameworkConfig.js`; endpoints in `packages/blocks/catalogue/src/config.js` (`catalogue/catalogues`, `themes/list`, `lessons/list`, etc.). Root `package.json` scripts (`dev:backend`, `db:prepare:backend`) assume a Rails app in `backend`. |
| **Firebase — Firestore** | **Not used** in application code for content | No `getFirestore` / Firestore SDK usage in `.ts`/`.tsx`/`.js` sources. Only starter rules/types under `firebase/` for a **planned** CMS. |
| **Firebase — Cloud Messaging (push)** | **Used** on mobile | `@react-native-firebase/messaging` in `packages/mobile`, `DashboardController`, `App.tsx` (with Expo shims when native FCM is unavailable). |
| **Firebase — Analytics** | **Used** (where native module exists) | `@react-native-firebase/analytics` in `AnalyticsController`; Metro may shim analytics in some Expo builds. |
| **Firebase — Web bundle** | **Legacy / template project** | `packages/web/src/App.js` initializes Firebase with project **`rnmasterapp-c11e9`** (Real Time Database URL, analytics) — appears to be **Builder/template**, not an EtOH-specific Firestore CMS. |

**Summary for the client:** The **live app content path** is **REST → Railway-hosted backend**, not Firebase Firestore. The client’s **Firebase (Firestore + Auth + Storage)** description is the **target architecture** for the admin dashboard and eventual direct app reads; it is **not** what powers catalogue data in the codebase today.

---

## 1. What is EtOH Coach?

The codebase (`EtOHCoachFinal`, bundle IDs, backend URL) is **EtOH Coach**.

**Intended positioning:**

- **Title:** EtOH Coach  
- **Tagline:** Train your team from message to sale.  
- **Audience:** Wine professionals — sales, tasting rooms, shops, hospitality, reps.  
- **Format:** Micro-learning — short video, real-life **scenario**, actionable steps, quick quiz.  
- **Framework:** **Attract → Convince → Convert** (moments that map to navigation, filters, and content grouping).

**Legacy copy:** Some strings still describe certification prep (“pass wines, beers and spirits certifications”). Plan an i18n pass to align with the sales-moments story.

---

## 2. Admin dashboard — client requirements (in scope)

The client expects a **back office** to manage all learning content and media, aligned with the Firebase-oriented spec (Firestore + Storage + Auth with admin claim). Summary:

### 2.1 Courses

- Fields: title, short description, full description, category (attract / convince / convert), language, cover image upload, status (draft / published), reorder.

### 2.2 Lessons (or “chapters” in UX — see §3)

- Fields: title, short description, scenario, language, video (upload or URL), image upload, status, reorder.  
- A lesson may have video only, image only, or both.

### 2.3 Flashcards

- CRUD, text content, optional image, reorder. Unlimited per lesson.

### 2.4 Quiz

- CRUD, question, optional image, multiple answers (minimum 2), single correct answer, reorder. Unlimited per lesson.

### 2.5 Import

- Formats: `.csv`, `.xlsx`.  
- Suggested columns: e.g. `course_title`, `category`, `language`, `lesson_title`, `short_description`, `scenario`, `video_url`, `image_url`, `flashcard_1`, `flashcard_2`, `question_1`, `option_a`, `option_b`, `correct_answer`.  
- Rules: create course if missing; attach/update lesson; validate required fields; **reject invalid rows with clear errors**; **no partial import** (all rows succeed or none).

### 2.6 Business rules

- Minimum **1 flashcard** and **1 quiz question** per lesson.  
- Quiz: ≥2 options, exactly one correct answer.  
- **Draft** = hidden from the consumer app; **published** = visible immediately.

### 2.7 Technical stack (client target)

- **Firestore** (flat collections), **Firebase Auth**, **Firebase Storage**.  
- **No custom REST API** for content delivery — app reads Firestore directly; admin uses privileged writes (e.g. `admin` custom claim).

**Repo today:** `packages/blocks/ContentManagement` is a **placeholder**; `packages/blocks/AdminConsole3` exists but is not the described CMS. Real admin work is **greenfield** or replace-and-build on web.

---

## 3. Contradictions to resolve (EtOH + admin only)

| Topic | Situation | Recommendation |
|--------|-----------|----------------|
| **UX “Chapter” vs Firestore “lesson”** | Client UX doc uses **Chapter**; CMS spec uses **lessons** collection | Treat as **one entity**: same record, label “Chapter N” in app, `lessons` (or rename to `chapters`) in Firestore. |
| **Theme vs category** | Visual **themes** (e.g. Attract) vs `category` on course | Decide single source of truth: **theme_id** on course, or **category** only, or both synced in admin. |
| **Backend today vs target** | App uses **Rails API** for catalogue | **Migration:** introduce Firestore reads in app + admin writes; retire or parallel-run Rails until cutover. |
| **Child doc security** | Naive rules (`read: true` on flashcards/quiz) leak draft content | Denormalize **`lesson_status`** on flashcards/quiz; rules in `firebase/firestore.rules`. |
| **Legal addresses** | Privacy (Dijon) vs T&Cs (Paris) in client text | Legal review before publish. |
| **i18n** | EN default + FR, ES, PT, IT for shell/onboarding | Translate admin UI as needed; course language is per-document in CMS. |

---

## 4. EtOH app — other client requirements (reference)

These apply to the **consumer app** but are secondary to “get admin + content pipeline right”:

### 4.1 Store & marketing

Subtitle, long description, keywords, Play tags, optional A/B taglines; filters (Moment, Situation, Skill, Completion, optional Duration).  
*Today’s catalogue filters differ (drink type, difficulty, etc.) — align when CMS fields exist.*

### 4.2 Lifecycle email program (15 templates)

Typically **ESP + backend events**, not the mobile repo. Track as a separate workstream unless the client prioritizes it.

### 4.3 Compliance onboarding (mandatory for store / GDPR)

Order: **Age 18+** → account → **TOS + Privacy** (two unchecked boxes) → **analytics consent** → optional **marketing consent** → app.Persist `age_verified`, `tos_accepted`, `privacy_accepted`, versions, `consent_timestamp`, `analytics_consent`, `marketing_consent`.  
*Not fully implemented today* — see audit below.

### 4.4 Legal content

Host/embed Privacy + T&Cs with versioning.

### 4.5 Consumer content hierarchy (aligned with admin)

**Theme** (image required) → **Course** (image required) → **Lesson/Chapter** (video/image/text, scenario) → **Flashcards** + **Quiz**.

---

## 5. Codebase audit — EtOH app

### 5.1 Already present

| Area | Location / notes |
|------|------------------|
| Rails-backed catalogue | `packages/blocks/catalogue/src/config.js` |
| Themes → courses → lessons | `packages/blocks/catalogue/src/` (e.g. `CatelogueFiveController`) |
| Flashcards & quiz | Rails modules via existing endpoints |
| Filters | `CatalogueController` — needs alignment with Moment/Situation/Skill when data model allows |
| Subscriptions (IAP) | `DashboardController`, `SubCriptionScreen` |
| Terms screen | `TermsAndConditions` — API-backed; not full compliance flow |
| Firebase Messaging / Analytics stubs | `App.tsx`, `AnalyticsController` — analytics not gated by consent |
| i18n | `LanguageOptions`, translation JSONs |
| Expo migration | `EXPO_SCREEN_PARITY_CHECKLIST.md` |
| Firestore starter | `firebase/firestore.rules`, `firebase/firestore.indexes.json`, `firebase/content-schema.ts` |

### 5.2 Gaps (relative to scoped work)

**Consumer app**

- Full **compliance onboarding** sequence + consent storage.  
- **Analytics** (and similar) **after** consent.  
- **Firestore** read path for content (today: REST only).  
- Copy/filters alignment with new CMS fields.

**Admin dashboard**

- **No production CMS**: `ContentManagement` placeholder; build or integrate admin (web) with Firestore + Storage + import + reorder + draft/publish.

---

## 6. Recommended phases (EtOH + admin focus)

### Phase 0 — Decisions (short)

1. Lock **Firestore collection names** and whether UX labels them “lesson” or “chapter”.  
2. **Theme vs category** single source of truth.  
3. **Rails vs Firestore** cutover strategy (parallel run vs big bang).

### Phase 1 — Admin dashboard (MVP)

1. Firebase project: Auth, Firestore, Storage, **admin custom claims**.  
2. Deploy `firebase/firestore.rules` + indexes; extend schema if you add `themes` or `lesson_status` on children.  
3. Web admin: **Courses / Lessons / Flashcards / Quiz** CRUD, media upload, reorder, draft/publish.  
4. **CSV/XLSX import** with validation and atomic failure (no partial import).  
5. Optional: **themes** collection + required images if not folded into courses only.

### Phase 2 — App reads Firestore

1. Add Firestore SDK to mobile (and web if applicable).  
2. Replace catalogue/theme/lesson/flashcard/quiz **reads** with queries (published only, indexed filters).  
3. Keep IAP/auth on current stack until migrated if needed.

### Phase 3 — Compliance & polish

1. Age gate → legal → analytics → marketing flow + persistence.  
2. Gate Firebase Analytics (and other trackers) on consent.  
3. i18n + store copy as prioritized.

### Phase 4 — Deferred (unless client asks)

- Lifecycle **email** automation.  
- **Store listing** production assets.

---

## 7. Quick priority order

1. **Phase 0** sign-off.  
2. **Admin MVP** (Phase 1) so content can be created without Rails dependency.  
3. **App Firestore reads** (Phase 2).  
4. **Compliance** (Phase 3) before or in parallel with store submission, depending on release target.

---

## 8. Reference paths

| Item | Path |
|------|------|
| Catalogue API | `packages/blocks/catalogue/src/config.js` |
| Catalogue / lesson UI | `packages/blocks/catalogue/src/` |
| Admin placeholder | `packages/blocks/ContentManagement/` |
| Firestore rules / types | `firebase/` |
| Backend URL | `react-native/src/config/expoFrameworkConfig.js` |

---

## 9. Document history

- **Updated:** Scope locked to **EtOH Coach + admin dashboard**; **geoVINUM excluded**.  
- **Purpose:** Single roadmap for app + CMS; defer emails/geoVINUM unless scope changes.
