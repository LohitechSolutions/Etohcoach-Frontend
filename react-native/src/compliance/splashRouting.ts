import type { CompliancePersisted } from "./consentStorage";
import { isPostAuthComplianceComplete, loadComplianceState } from "./consentStorage";

export type SplashResetKind =
  | "authenticated"
  | "non_auth"
  | "compliance_age"
  | "compliance_post_auth";

export async function getSplashResetKind(token: string | null): Promise<SplashResetKind> {
  const state: CompliancePersisted = await loadComplianceState();
  /** Spec order: age → account → legal. Age always before post-auth legal. */
  if (!state.age_verified) {
    return "compliance_age";
  }
  if (!token) {
    return "non_auth";
  }
  if (!isPostAuthComplianceComplete(state)) return "compliance_post_auth";
  return "authenticated";
}
