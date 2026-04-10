'use strict';

/**
 * API base URL for the mobile/web app.
 *
 * Local Rails API (repo root `Etohcoach-Backend/`, same paths as hosted Builder API):
 *   1. `yarn dev:backend` or `yarn dev:expo-and-api` (starts Rails on port 3000, bound 0.0.0.0).
 *   2. Prefer `react-native/.env` with EXPO_PUBLIC_API_URL=http://127.0.0.1:3000 (see .env.example).
 *   3. iOS Simulator: 127.0.0.1 works. Physical device: use your machine LAN IP in EXPO_PUBLIC_API_URL.
 *   4. Android Emulator: `adb reverse tcp:3000 tcp:3000` plus 127.0.0.1,
 *      OR set LOCAL_API_HOST to 10.0.2.2 (Rails already binds 0.0.0.0).
 *
 * Remote / staging: set MANUAL_BASE_URL, or run:
 *   node node-runners/setup-environment.js https://your-api-host/
 *
 * Archived remote presets (uncomment into MANUAL_BASE_URL or use setup-environment):
 *   - Dev:  https://etohcoachfinal-159129-ruby.b159129.dev.eastus.az.svc.builder.cafe/
 *   - Ngrok example: https://414c-20-244-58-182.ngrok-free.app
 *   - Stage / prod / UAT URLs were previously listed here — see git history.
 */

/**
 * Expo / Metro: set in react-native/.env as EXPO_PUBLIC_API_URL=http://127.0.0.1:3000
 * (see react-native/.env.example). Takes precedence over flags below.
 */
const EXPO_PUBLIC_API_URL =
  typeof process !== 'undefined' &&
  process.env &&
  typeof process.env.EXPO_PUBLIC_API_URL === 'string'
    ? process.env.EXPO_PUBLIC_API_URL
    : '';

const USE_LOCAL_ROOT_BACKEND = true;

/** Host for LOCAL_API_PORT when USE_LOCAL_ROOT_BACKEND is true */
const LOCAL_API_HOST = '127.0.0.1';

/** Must match Etohcoach-Backend (config/puma.rb default PORT=3000) */
const LOCAL_API_PORT = 3000;

/**
 * When non-empty, this is the API root (overrides local toggle, but not EXPO_PUBLIC_API_URL).
 * No trailing slash. Example: 'https://api.example.com'
 */
const MANUAL_BASE_URL = '';

function normalizeBase(url) {
  const u = String(url || '').trim();
  if (!u) return '';
  return u.replace(/\/$/, '');
}

let baseURL = '';
if (EXPO_PUBLIC_API_URL) {
  baseURL = normalizeBase(EXPO_PUBLIC_API_URL);
} else if (MANUAL_BASE_URL) {
  baseURL = normalizeBase(MANUAL_BASE_URL);
} else if (USE_LOCAL_ROOT_BACKEND) {
  baseURL = normalizeBase(`http://${LOCAL_API_HOST}:${LOCAL_API_PORT}`);
}

Object.defineProperty(exports, '__esModule', {
  value: true,
});

exports.baseURL = baseURL;
exports.USE_LOCAL_ROOT_BACKEND = USE_LOCAL_ROOT_BACKEND;
exports.LOCAL_API_HOST = LOCAL_API_HOST;
exports.LOCAL_API_PORT = LOCAL_API_PORT;
