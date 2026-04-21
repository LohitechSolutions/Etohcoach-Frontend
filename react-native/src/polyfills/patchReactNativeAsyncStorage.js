/**
 * RN 0.74+ removes `AsyncStorage` from `react-native` (accessing it throws).
 * Some legacy or transitive code still reads `react-native.AsyncStorage`.
 * Map it to `@react-native-async-storage/async-storage` before the rest of the bundle runs.
 *
 * Must load before other app modules (import first in App.js).
 */
"use strict";

const ReactNative = require("react-native");
const RNAsyncStorage = require("@react-native-async-storage/async-storage");
const impl = RNAsyncStorage.default || RNAsyncStorage;

try {
  Object.defineProperty(ReactNative, "AsyncStorage", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: impl,
  });
} catch (_) {
  try {
    ReactNative.AsyncStorage = impl;
  } catch (_2) {
    /* ignore */
  }
}
