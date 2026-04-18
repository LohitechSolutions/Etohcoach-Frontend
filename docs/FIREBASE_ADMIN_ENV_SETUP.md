# Firebase web config for EtOH Coach Admin (`VITE_FIREBASE_*`)

The admin app (`Etohcoach-Frontend/admin`) needs six environment variables so Vite can initialize the Firebase JS SDK (Auth, Firestore, Storage). If they are missing, the UI shows a configuration screen instead of the login page.

This guide walks through **where to find each value** in the Firebase console and **how to wire them into `admin/.env.local`**.

---

## Prerequisites

- Access to the **Firebase project** used for EtOH Coach (for example `etoh-coach`), with permission to view **Project settings** and to add or view **Web apps**.
- The project should have **Authentication** (Email/Password or your chosen sign-in provider), **Cloud Firestore**, and **Storage** enabled if you use those features in admin. The keys themselves are created as soon as you add a **Web app** to the project; you do not need Firestore created first to copy the config snippet.

---

## Step 1 — Open the Firebase console

1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/).
2. Sign in with the Google account that owns or has access to the project.
3. Click the **EtOH Coach** project (or the project ID your team uses, e.g. `etoh-coach`).

---

## Step 2 — Open Project settings

1. In the left sidebar, click the **gear icon** next to **Project overview**.
2. Click **Project settings**.

You will use this page for both app registration and copying config.

---

## Step 3 — Register a Web app (if you do not have one yet)

Firebase exposes the `apiKey` and related values **per app** (Web, iOS, Android). The admin dashboard uses the **Web** app config.

1. Still on **Project settings**, scroll to **Your apps**.
2. If you already see a **Web** app (icon `</>`), skip to [Step 4](#step-4--copy-the-firebase-config).
3. If there is no Web app:
   - Click **Add app** and choose the **Web** icon (`</>`).
   - You may be asked for an **App nickname** (e.g. `EtOH Admin` or `EtOH Coach Web`).
   - You can skip **Firebase Hosting** for this step unless you plan to host the admin there.
   - Click **Register app**.

---

## Step 4 — Copy the Firebase config

After the Web app exists:

1. In **Project settings** → **Your apps**, select your **Web** app.
2. Under **SDK setup and configuration**, choose **npm** (or the panel that shows the `firebaseConfig` JavaScript object).
3. You will see an object similar to:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
};
```

These values are **not secret** in the sense that they also ship in client-side bundles; security comes from **Firestore rules**, **Storage rules**, and **Authentication** settings. Still, treat your repo hygiene seriously: use `.env.local` for local dev and do not commit it.

---

## Step 5 — Map Firebase fields to `admin/.env.local`

Create **`Etohcoach-Frontend/admin/.env.local`** (same folder as `admin/package.json`).  
Copy from **`admin/env.example`** and fill using this mapping:

| Firebase `firebaseConfig` field | Admin env variable |
|----------------------------------|---------------------|
| `apiKey` | `VITE_FIREBASE_API_KEY` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `VITE_FIREBASE_APP_ID` |

**Example** (fake values — use your console values):

```env
VITE_FIREBASE_API_KEY=AIzaSyExampleKeyReplaceMe
VITE_FIREBASE_AUTH_DOMAIN=etoh-coach.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=etoh-coach
VITE_FIREBASE_STORAGE_BUCKET=etoh-coach.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef
```

Rules of thumb:

- **No spaces** around `=`.
- **No quotes** required unless your tooling needs them; plain values are fine.
- Do **not** commit `.env.local` (it should stay gitignored).

---

## Step 6 — Restart the Vite dev server

Vite reads `VITE_*` variables when the dev server **starts**.

1. Stop the running process (Ctrl+C in the terminal).
2. From `Etohcoach-Frontend/admin` run:

```bash
npm run dev
```

3. Open **http://localhost:5174** — you should see the **Sign in** screen instead of the missing-env message.

---

## If a value still shows as “missing”

- Confirm the file name is exactly **`.env.local`** in the **`admin/`** directory (not the repo root, not `react-native/`).
- Confirm every variable name starts with **`VITE_FIREBASE_`** as in `env.example`.
- Restart **`npm run dev`** after any edit to `.env.local`.
- Ensure no line accidentally uses `export` or shell syntax; use simple `KEY=value` lines.

---

## Related: consumer app (Expo)

The mobile app uses **`EXPO_PUBLIC_FIREBASE_*`** variables. They should target the **same Firebase project** for catalogue reads. See **`react-native/.env.example`** for the list. The values are the same six logical fields; only the prefix differs (`EXPO_PUBLIC_` vs `VITE_`).

---

## Reference paths in this repo

| Item | Path |
|------|------|
| Admin env template | [`admin/env.example`](../admin/env.example) |
| Admin Firebase bootstrap | [`admin/src/firebase.ts`](../admin/src/firebase.ts) |
| Firestore rules | [`firebase/firestore.rules`](../firebase/firestore.rules) |
| Storage rules | [`firebase/storage.rules`](../firebase/storage.rules) |

---

## Document history

- **Added:** Step-by-step guide to obtain Firebase Web SDK config and populate `admin/.env.local` for the EtOH Coach admin portal.
