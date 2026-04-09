/**
 * Stub: native Sign in with Apple is not wired in the Expo app.
 * Metro maps this package via extraNodeModules (must be a directory with package.json).
 */
const Operation = {
  LOGIN: 1,
  REFRESH: 2,
  LOGOUT: 3,
};

const Scope = {
  EMAIL: 0,
  FULL_NAME: 1,
};

export const appleAuth = {
  isSupported: false,
  Operation,
  Scope,
  performRequest: async () => {
    throw new Error(
      "Sign in with Apple is not available in this Expo build (stub module)."
    );
  },
};

export const AppleButton = () => null;
