'use strict';

/**
 * API base URL for the Expo / react-native app only (Metro resolves * packages/framework/src/config imports to this file — see metro.config.js).
 *
 * Default below when EXPO_PUBLIC_API_URL is unset. For Render, set in react-native/.env:
 *   EXPO_PUBLIC_API_URL=https://your-service.onrender.com
 */

const DEFAULT_HOSTED_API = "https://etohcoach-backend-production.up.railway.app";

const EXPO_PUBLIC_API_URL_RAW =
  typeof process !== 'undefined' &&
  process.env &&
  typeof process.env.EXPO_PUBLIC_API_URL === 'string'
    ? process.env.EXPO_PUBLIC_API_URL.trim()
    : '';

/** Expo app defaults to hosted API; set EXPO_PUBLIC_API_URL for local Rails only. */
const USE_LOCAL_ROOT_BACKEND = false;

const LOCAL_API_HOST = '127.0.0.1';
const LOCAL_API_PORT = 3000;

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
