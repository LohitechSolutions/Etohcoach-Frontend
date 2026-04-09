/**
 * Shim: real module is in root workspace; native Sign in with Apple is not wired in the Expo app.
 * Exposes the same surface the blocks use so Metro can bundle; Apple login shows "not supported".
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
