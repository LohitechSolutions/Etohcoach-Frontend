import AsyncStorage from "@react-native-async-storage/async-storage";

/** Single JSON blob — M5 CLIENT_SPEC §4.3 */
const COMPLIANCE_STATE_KEY = "ETOHC_COMPLIANCE_STATE_V1";

/** After login/signup, where to go once legal + consent steps are done */
export const PENDING_POST_COMPLIANCE_KEY = "ETOHC_PENDING_POST_COMPLIANCE_NAV";

export type AuthenticatedDestinationName = "Dashboard" | "SubCriptionScreen";

export interface CompliancePersisted {
  age_verified: boolean;
  tos_accepted: boolean;
  privacy_accepted: boolean;
  /** Version strings the user accepted (must match current env to stay valid) */
  tos_version_accepted: string;
  privacy_version_accepted: string;
  consent_timestamp: string | null;
  /** `null` = not prompted yet; `true` / `false` = user choice (analytics gated when not true) */
  analytics_consent: boolean | null;
  marketing_consent: boolean;
}

export const emptyComplianceState = (): CompliancePersisted => ({
  age_verified: false,
  tos_accepted: false,
  privacy_accepted: false,
  tos_version_accepted: "",
  privacy_version_accepted: "",
  consent_timestamp: null,
  analytics_consent: null,
  marketing_consent: false,
});

export function getExpectedTosVersion(): string {
  return String(process.env.EXPO_PUBLIC_LEGAL_TOS_VERSION || "1").trim();
}

export function getExpectedPrivacyVersion(): string {
  return String(process.env.EXPO_PUBLIC_LEGAL_PRIVACY_VERSION || "1").trim();
}

export function getLegalTosUrl(): string {
  return String(process.env.EXPO_PUBLIC_LEGAL_TOS_URL || "https://etohcoach.com/terms").trim();
}

export function getLegalPrivacyUrl(): string {
  return String(process.env.EXPO_PUBLIC_LEGAL_PRIVACY_URL || "https://etohcoach.com/privacy").trim();
}

export async function loadComplianceState(): Promise<CompliancePersisted> {
  try {
    const raw = await AsyncStorage.getItem(COMPLIANCE_STATE_KEY);
    if (!raw) return emptyComplianceState();
    const parsed = JSON.parse(raw) as Partial<CompliancePersisted>;
    return { ...emptyComplianceState(), ...parsed };
  } catch {
    return emptyComplianceState();
  }
}

export async function saveComplianceState(state: CompliancePersisted): Promise<void> {
  await AsyncStorage.setItem(COMPLIANCE_STATE_KEY, JSON.stringify(state));
}

/** Legal + analytics prompt complete (marketing optional). */
export function isPostAuthComplianceComplete(state: CompliancePersisted): boolean {
  if (!state.age_verified) return false;
  const tv = getExpectedTosVersion();
  const pv = getExpectedPrivacyVersion();
  if (!state.tos_accepted || state.tos_version_accepted !== tv) return false;
  if (!state.privacy_accepted || state.privacy_version_accepted !== pv) return false;
  if (state.analytics_consent !== true && state.analytics_consent !== false) return false;
  return true;
}

export async function needsPostAuthComplianceAsync(): Promise<boolean> {
  const s = await loadComplianceState();
  return !isPostAuthComplianceComplete(s);
}

/** For analytics shim — only explicit opt-in sends events */
export async function getAnalyticsConsentGranted(): Promise<boolean> {
  const s = await loadComplianceState();
  return s.analytics_consent === true;
}

export type PendingAuthDestination = {
  name: AuthenticatedDestinationName;
  params?: Record<string, unknown>;
};

export async function setPendingAuthenticatedDestination(
  dest: PendingAuthDestination | null
): Promise<void> {
  if (!dest) {
    await AsyncStorage.removeItem(PENDING_POST_COMPLIANCE_KEY);
    return;
  }
  await AsyncStorage.setItem(PENDING_POST_COMPLIANCE_KEY, JSON.stringify(dest));
}

export async function consumePendingAuthenticatedDestination(): Promise<PendingAuthDestination | null> {
  const raw = await AsyncStorage.getItem(PENDING_POST_COMPLIANCE_KEY);
  await AsyncStorage.removeItem(PENDING_POST_COMPLIANCE_KEY);
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as PendingAuthDestination;
    if (o && (o.name === "Dashboard" || o.name === "SubCriptionScreen")) {
      return o;
    }
  } catch {
    /* ignore */
  }
  return null;
}
