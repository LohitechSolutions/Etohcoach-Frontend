import { CommonActions, createNavigationContainerRef } from "@react-navigation/native";
import {
  needsPostAuthComplianceAsync,
  setPendingAuthenticatedDestination,
  type PendingAuthDestination,
} from "../compliance/consentStorage";

/** Single ref for imperative resets (e.g. logout) — avoids getParent() chains that can miss the root. */
export const navigationRef = createNavigationContainerRef();

/** Reset root stack to non-auth email login (matches post-splash flow when logged out). */
export function resetNavigationToEmailLogin(): void {
  if (!navigationRef.isReady()) {
    return;
  }
  navigationRef.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: "NonAuthenticated",
          state: {
            routes: [{ name: "EmailAccountLoginBlock" }],
            index: 0
          }
        }
      ]
    })
  );
}

export type AuthenticatedInitialRoute = "Dashboard" | "SubCriptionScreen";

function dispatchAuthenticatedReset(
  initialRouteName: AuthenticatedInitialRoute,
  params?: Record<string, unknown>
): void {
  const initial =
    params && Object.keys(params).length > 0
      ? { name: initialRouteName, params }
      : { name: initialRouteName };
  navigationRef.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: "Authenticated",
          state: {
            routes: [initial],
            index: 0
          }
        }
      ]
    })
  );
}

/** Root reset into Authenticated stack (NonAuth navigator cannot reset to Authenticated). */
export function resetNavigationToAuthenticated(
  initialRouteName: AuthenticatedInitialRoute = "Dashboard",
  params?: Record<string, unknown>,
  attemptsLeft: number = 12
): void {
  if (navigationRef.isReady()) {
    dispatchAuthenticatedReset(initialRouteName, params);
    return;
  }
  if (attemptsLeft <= 0) {
    return;
  }
  const schedule =
    typeof requestAnimationFrame === "function"
      ? (cb: () => void) => requestAnimationFrame(cb)
      : (cb: () => void) => setTimeout(cb, 16);
  schedule(() => resetNavigationToAuthenticated(initialRouteName, params, attemptsLeft - 1));
}

/** M5 — legal & consent before main app (logged-in user). */
export function resetNavigationToCompliancePostAuth(attemptsLeft: number = 12): void {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "ComplianceOnboarding", params: { step: "legal" } }]
      })
    );
    return;
  }
  if (attemptsLeft <= 0) {
    return;
  }
  const schedule =
    typeof requestAnimationFrame === "function"
      ? (cb: () => void) => requestAnimationFrame(cb)
      : (cb: () => void) => setTimeout(cb, 16);
  schedule(() => resetNavigationToCompliancePostAuth(attemptsLeft - 1));
}

/**
 * After email login/registration: show compliance when required, else go to the authenticated stack.
 * Pending destination is applied when the user finishes the legal step.
 */
export async function resetNavigationAfterLogin(
  initialRouteName: AuthenticatedInitialRoute = "Dashboard",
  params?: Record<string, unknown>
): Promise<void> {
  if (await needsPostAuthComplianceAsync()) {
    const dest: PendingAuthDestination =
      params && Object.keys(params).length > 0
        ? { name: initialRouteName, params }
        : { name: initialRouteName };
    await setPendingAuthenticatedDestination(dest);
    resetNavigationToCompliancePostAuth();
    return;
  }
  resetNavigationToAuthenticated(initialRouteName, params);
}
