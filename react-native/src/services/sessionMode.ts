import { DEV_NAV_ONLY_TOKEN } from "../config/env";
import { getSessionToken } from "./storage/sessionStorage";

/** Real backend JWT/session — not the nav-only dev placeholder. */
export async function getTokenForApi(): Promise<string | null> {
  const t = await getSessionToken();
  if (!t || t === DEV_NAV_ONLY_TOKEN) return null;
  return t;
}

export async function isDevNavOnlySession(): Promise<boolean> {
  const t = await getSessionToken();
  return t === DEV_NAV_ONLY_TOKEN;
}
