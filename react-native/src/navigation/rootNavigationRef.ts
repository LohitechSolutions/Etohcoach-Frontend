import { CommonActions, createNavigationContainerRef } from "@react-navigation/native";

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
