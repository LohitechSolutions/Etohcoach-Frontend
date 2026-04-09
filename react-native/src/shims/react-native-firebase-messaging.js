/** Stub FCM — no native Firebase in Expo Go / shim builds. */
const AuthorizationStatus = {
  NOT_DETERMINED: -1,
  DENIED: 0,
  AUTHORIZED: 1,
  PROVISIONAL: 2,
};

function createMessagingApi() {
  return {
    AuthorizationStatus,
    onMessage: () => () => {},
    onNotificationOpenedApp: () => () => {},
    getInitialNotification: async () => null,
    getToken: async () => "",
    requestPermission: async () => AuthorizationStatus.DENIED,
    setBackgroundMessageHandler: (_handler) => {},
    subscribeToTopic: async () => {},
    unsubscribeFromTopic: async () => {},
  };
}

function messaging() {
  return createMessagingApi();
}

module.exports = messaging;
module.exports.default = messaging;
module.exports.messaging = messaging;
