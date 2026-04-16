/** Stub — `@react-native-firebase/analytics` default export must be callable: `analytics().logEvent(...)`. */
/** M5: no-op events unless user opted in (see `src/compliance/consentStorage`). */

async function hasAnalyticsConsent() {
  try {
    const { getAnalyticsConsentGranted } = require("../compliance/consentStorage");
    return await getAnalyticsConsentGranted();
  } catch {
    return false;
  }
}

function analytics() {
  return {
    logEvent: async (name, params) => {
      if (!(await hasAnalyticsConsent())) {
        return;
      }
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[Analytics gated stub] logEvent", name, params);
      }
    },
    logScreenView: async (params) => {
      if (!(await hasAnalyticsConsent())) {
        return;
      }
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[Analytics gated stub] logScreenView", params);
      }
    },
    setAnalyticsCollectionEnabled: async () => {},
    setUserId: async () => {},
    setUserProperties: async () => {},
    setDefaultEventParameters: async () => {},
    resetAnalyticsData: async () => {},
  };
}

module.exports = analytics;
module.exports.default = analytics;
