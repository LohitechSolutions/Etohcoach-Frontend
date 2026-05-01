function fallbackTosVersion(): string {
  return String(process.env.EXPO_PUBLIC_LEGAL_TOS_VERSION || "1").trim();
}

function fallbackPrivacyVersion(): string {
  return String(process.env.EXPO_PUBLIC_LEGAL_PRIVACY_VERSION || "1").trim();
}

function getApiBase(): string {
  const a =
    typeof process !== "undefined" && typeof process.env.EXPO_PUBLIC_API_URL === "string"
      ? process.env.EXPO_PUBLIC_API_URL.trim()
      : "";
  const b =
    typeof process !== "undefined" && typeof process.env.EXPO_PUBLIC_API_BASE_URL === "string"
      ? process.env.EXPO_PUBLIC_API_BASE_URL.trim()
      : "";
  const fallback = "https://etohcoach-backend-production.up.railway.app";
  return (a || b || fallback).replace(/\/$/, "");
}

type JsonApiRow = {
  id: string;
  attributes: {
    title?: string | null;
    page_type?: string | number | null;
    page_link?: string | null;
    content?: string | null;
    language?: string | null;
    updated_at?: string | null;
  };
};

export type LegalPolicyPick = {
  version: string;
  pageType: "link" | "content";
  pageLink: string | null;
  html: string | null;
  title: string | null;
};

function normalizeLangPref(): string[] {
  const raw =
    (typeof process !== "undefined" && process.env.EXPO_PUBLIC_CONTENT_LANGUAGE?.trim()) || "en";
  const lower = raw.toLowerCase();
  if (lower.startsWith("fr")) return ["Français", "English"];
  return ["English", "Français"];
}

function pickRow(rows: JsonApiRow[], langs: string[]): JsonApiRow | null {
  if (!rows.length) return null;
  for (const lang of langs) {
    const hit = rows.find((r) => (r.attributes.language || "").trim() === lang);
    if (hit) return hit;
  }
  return rows[rows.length - 1] ?? null;
}

function isLinkType(pageType: string | number | null | undefined): boolean {
  if (pageType === "link" || pageType === 0 || pageType === "0") return true;
  if (pageType === "content" || pageType === 1 || pageType === "1") return false;
  if (typeof pageType === "string" && pageType.toLowerCase() === "link") return true;
  return false;
}

function rowToPolicy(row: JsonApiRow | null): LegalPolicyPick | null {
  if (!row) return null;
  const a = row.attributes;
  const version = String(a.updated_at || row.id || "").trim() || "1";
  const link = a.page_link?.trim() || null;
  const html = a.content?.trim() || null;
  const useLink = isLinkType(a.page_type) && !!link;
  return {
    version,
    pageType: useLink ? "link" : "content",
    pageLink: link,
    html: html || null,
    title: a.title?.trim() || null,
  };
}

function parseRows(body: unknown): JsonApiRow[] {
  const o = body as { data?: unknown };
  if (!Array.isArray(o.data)) return [];
  return o.data as JsonApiRow[];
}

const EMPTY_POLICY_HTML =
  "<p>No content has been published yet. Add it in the EtOH Coach admin under Terms and Conditions or Privacy Policy.</p>";

function emptyPolicyFallback(which: "terms" | "privacy"): LegalPolicyPick {
  return {
    version: which === "terms" ? fallbackTosVersion() : fallbackPrivacyVersion(),
    pageType: "content",
    pageLink: null,
    html: EMPTY_POLICY_HTML,
    title: which === "terms" ? "Terms of Service" : "Privacy Policy",
  };
}

export async function fetchTermsPolicy(): Promise<LegalPolicyPick> {
  const res = await fetch(`${getApiBase()}/terms_and_conditions`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`terms_and_conditions HTTP ${res.status}`);
  const body = await res.json();
  return rowToPolicy(pickRow(parseRows(body), normalizeLangPref())) ?? emptyPolicyFallback("terms");
}

export async function fetchPrivacyPolicy(): Promise<LegalPolicyPick> {
  const res = await fetch(`${getApiBase()}/privacy_policy`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`privacy_policy HTTP ${res.status}`);
  const body = await res.json();
  return rowToPolicy(pickRow(parseRows(body), normalizeLangPref())) ?? emptyPolicyFallback("privacy");
}

let versionCache: { at: number; value: { tos: string; privacy: string } } | null = null;
const VERSION_CACHE_MS = 45_000;

/** Versions for compliance checks (admin `updated_at`, or env fallback). */
export async function fetchLegalVersionsForCompliance(): Promise<{
  tos: string;
  privacy: string;
}> {
  if (versionCache && Date.now() - versionCache.at < VERSION_CACHE_MS) {
    return versionCache.value;
  }
  try {
    const [t, p] = await Promise.all([fetchTermsPolicy(), fetchPrivacyPolicy()]);
    const value = {
      tos: t.version || fallbackTosVersion(),
      privacy: p.version || fallbackPrivacyVersion(),
    };
    versionCache = { at: Date.now(), value };
    return value;
  } catch {
    return {
      tos: fallbackTosVersion(),
      privacy: fallbackPrivacyVersion(),
    };
  }
}

export function invalidateLegalVersionCache(): void {
  versionCache = null;
}
