'use strict';

/**
 * API base URL for packages/mobile, web, and all bundles that `require` this module.
 *
 * The Expo app tries to use `react-native/src/config/expoFrameworkConfig.js` (Metro), but
 * `require('../config')` is often resolved to **this** file, so it must use the same URL
 * rules as the Expo app: `EXPO_PUBLIC_API_URL` first, then hosted Railway, then optional local.
 *
 * Local Rails: set `EXPO_PUBLIC_API_URL=http://127.0.0.1:3000` in `react-native/.env`, or
 * set `USE_LOCAL_ROOT_BACKEND` to true and `MANUAL_BASE_URL` to ''.
 */

const DEFAULT_HOSTED_API = 'https://etohcoach-backend-production.up.railway.app';

const EXPO_PUBLIC_API_URL_RAW = (() => {
  if (typeof process === 'undefined' || !process.env) {
    return '';
  }
  const a =
    typeof process.env.EXPO_PUBLIC_API_URL === 'string' ? process.env.EXPO_PUBLIC_API_URL.trim() : '';
  const b =
    typeof process.env.EXPO_PUBLIC_API_BASE_URL === 'string'
      ? process.env.EXPO_PUBLIC_API_BASE_URL.trim()
      : '';
  return a || b;
})();

const EXPO_PUBLIC_CONTENT_SOURCE_RAW = (() => {
  if (typeof process === 'undefined' || !process.env) {
    return 'rest';
  }
  const a =
    typeof process.env.EXPO_PUBLIC_CONTENT_SOURCE === 'string'
      ? process.env.EXPO_PUBLIC_CONTENT_SOURCE.trim().toLowerCase()
      : '';
  const b =
    typeof process.env.CONTENT_SOURCE === 'string' ? process.env.CONTENT_SOURCE.trim().toLowerCase() : '';
  const v = a || b;
  return v === 'firestore' ? 'firestore' : 'rest';
})();

/**
 * Set `true` only for local backend without `EXPO_PUBLIC_API_URL` / `MANUAL_BASE_URL`.
 * Default `false` so the hosted API is used (matches Expo).
 */
const USE_LOCAL_ROOT_BACKEND = false;

const LOCAL_API_HOST = '127.0.0.1';
const LOCAL_API_PORT = 3000;

/** Staging/legacy override, or set to `''` when forcing local only via USE_LOCAL_ROOT_BACKEND. */
const MANUAL_BASE_URL = DEFAULT_HOSTED_API;

function normalizeBase(url) {
  const u = String(url || '').trim();
  if (!u) return '';
  return u.replace(/\/$/, '');
}

let baseURL = '';
if (EXPO_PUBLIC_API_URL_RAW) {
  baseURL = normalizeBase(EXPO_PUBLIC_API_URL_RAW);
} else if (MANUAL_BASE_URL) {
  baseURL = normalizeBase(MANUAL_BASE_URL);
} else if (USE_LOCAL_ROOT_BACKEND) {
  baseURL = normalizeBase(`http://${LOCAL_API_HOST}:${LOCAL_API_PORT}`);
}

function apiUrl(path) {
  const p = String(path || '').replace(/^\/+/, '');
  return p ? `${baseURL}/${p}` : baseURL;
}

Object.defineProperty(exports, '__esModule', {
  value: true,
});

exports.baseURL = baseURL;
exports.apiUrl = apiUrl;
exports.USE_LOCAL_ROOT_BACKEND = USE_LOCAL_ROOT_BACKEND;
exports.LOCAL_API_HOST = LOCAL_API_HOST;
exports.LOCAL_API_PORT = LOCAL_API_PORT;
exports.CONTENT_SOURCE = EXPO_PUBLIC_CONTENT_SOURCE_RAW;
