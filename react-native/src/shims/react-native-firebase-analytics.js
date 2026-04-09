/** Stub — `@react-native-firebase/analytics` default export must be callable: `analytics().logEvent(...)`. */

function analytics() {
  return {
    logEvent: async () => {},
    logScreenView: async () => {},
    setAnalyticsCollectionEnabled: async () => {},
    setUserId: async () => {},
    setUserProperties: async () => {},
    setDefaultEventParameters: async () => {},
    resetAnalyticsData: async () => {},
  };
}

module.exports = analytics;
module.exports.default = analytics;
