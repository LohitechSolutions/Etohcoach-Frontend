/** Expo / dev — native Google Sign-In not linked. */
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

const statusCodes = {
  SIGN_IN_CANCELLED: "SIGN_IN_CANCELLED",
  IN_PROGRESS: "IN_PROGRESS",
  PLAY_SERVICES_NOT_AVAILABLE: "PLAY_SERVICES_NOT_AVAILABLE",
  SIGN_IN_REQUIRED: "SIGN_IN_REQUIRED",
};

const GoogleSignin = {
  configure: () => {},
  hasPlayServices: async () => {},
  signIn: async () => null,
  signOut: async () => {},
  revokeAccess: async () => {},
  isSignedIn: async () => false,
  getCurrentUser: async () => null,
};

exports.GoogleSignin = GoogleSignin;
exports.statusCodes = statusCodes;
exports.default = GoogleSignin;
