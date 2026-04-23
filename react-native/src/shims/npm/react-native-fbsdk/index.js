/** Expo / dev — native Facebook SDK not linked. */
"use strict";

const LoginManager = {
  logInWithPermissions: async () => {
    throw new Error("Facebook Login is not available in this Expo/dev build.");
  },
  logOut: () => {},
};

const AccessToken = {
  getCurrentAccessToken: () => Promise.resolve(null),
};

exports.LoginManager = LoginManager;
exports.AccessToken = AccessToken;
