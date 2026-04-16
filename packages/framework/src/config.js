'use strict';

/**
 * API base URL for packages/mobile, web, and other non-Expo bundles.
 *
 * The Expo app in `react-native/` does NOT use this file: Metro redirects
 * `packages/framework/src/config` → `react-native/src/config/expoFrameworkConfig.js`.
 *
 * Local Rails (this file): default http://127.0.0.1:3000 when USE_LOCAL_ROOT_BACKEND.
 * Optional: set MANUAL_BASE_URL for a fixed remote API (Builder, staging, etc.).
 */

const EXPO_PUBLIC_API_URL_RAW =
  typeof process !== 'undefined' &&
  process.env &&
  typeof process.env.EXPO_PUBLIC_API_URL === 'string'
    ? process.env.EXPO_PUBLIC_API_URL.trim()
    : '';

const EXPO_PUBLIC_CONTENT_SOURCE_RAW = (() => {
  const env = typeof process !== 'undefined' && process.env ? process.env : undefined;
  const a =
    env && typeof env.EXPO_PUBLIC_CONTENT_SOURCE === 'string'
      ? env.EXPO_PUBLIC_CONTENT_SOURCE.trim().toLowerCase()
      : '';
  const b = env && typeof env.CONTENT_SOURCE === 'string' ? env.CONTENT_SOURCE.trim().toLowerCase() : '';
  const v = a || b;
  return v === 'firestore' ? 'firestore' : 'rest';
})();

const USE_LOCAL_ROOT_BACKEND = true;

const LOCAL_API_HOST = '127.0.0.1';

/** Must match Etohcoach-Backend (config/puma.rb default PORT=3000) */
const LOCAL_API_PORT = 3000;

/**
 * Non-Expo remote override. Example (legacy hosted API):
 *   'https://etohcoachfinal-159129-ruby.b159129.dev.eastus.az.svc.builder.cafe'
 */
const MANUAL_BASE_URL = '';

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

/** Absolute URL for a path under the API host (no leading slash on `path`). */
function apiUrl(path) {
  const p = String(path || "").replace(/^\/+/, "");
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
