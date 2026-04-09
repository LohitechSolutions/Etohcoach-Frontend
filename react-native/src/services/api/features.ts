import { apiRequest } from "./client";

export async function fetchDashboard(token: string): Promise<any> {
  return apiRequest("dashboard", "GET", { token });
}

export async function fetchCatalogue(token: string): Promise<any> {
  return apiRequest("catalogue/catalogues", "GET", { token });
}

export async function fetchProfile(token: string): Promise<any> {
  return apiRequest("profile/profile", "GET", { token });
}

export async function fetchNotifications(token: string): Promise<any> {
  return apiRequest("notifications/notifications", "GET", { token });
}

export async function fetchLeaderboard(token: string): Promise<any> {
  return apiRequest("bx_block_profile/leader_boards", "GET", { token });
}

export async function fetchTermsAndConditions(): Promise<any> {
  return apiRequest("terms_and_conditions", "GET");
}

export async function fetchPrivacyPolicy(): Promise<any> {
  return apiRequest("privacy_policy", "GET");
}

export async function fetchContactUs(token: string): Promise<any> {
  return apiRequest("contact_us", "GET", { token });
}

export async function searchUsers(token: string, query: string): Promise<any> {
  const q = encodeURIComponent(query);
  return apiRequest(`search/users?query=${q}`, "GET", { token });
}

/** Path may include query string, e.g. `sorting/sorting?sort[order_by]=price&sort[direction]=asc` */
export async function fetchCatalogueByPath(token: string, path: string): Promise<any> {
  return apiRequest(path.replace(/^\//, ""), "GET", { token });
}

export async function fetchFilterItems(token: string, querySuffix = ""): Promise<any> {
  const path =
    querySuffix.length > 0
      ? `filter_items/filtering${querySuffix.startsWith("?") ? querySuffix : `?${querySuffix}`}`
      : "filter_items/filtering";
  return apiRequest(path, "GET", { token });
}

/** Public pricing / plan list (legacy `subscriptions/list`). */
export async function fetchSubscriptionPricingList(token: string): Promise<any> {
  return apiRequest("subscriptions/list", "GET", { token });
}

/** User’s customisable subscription rows (legacy `customisable_user_subscriptions/subscriptions`). */
export async function fetchCustomisableUserSubscriptions(token: string): Promise<any> {
  return apiRequest("customisable_user_subscriptions/subscriptions", "GET", { token });
}

export type UserSubscriptionPostBody = {
  subscription_id: string;
  subscription_date: string;
  duration: string;
};

/** Register purchase with backend (legacy `user/subscription` POST). */
export async function postUserSubscription(token: string, body: UserSubscriptionPostBody): Promise<any> {
  return apiRequest("user/subscription", "POST", { token, body });
}

/** Cancel subscription (legacy `cancel/user/subscription` GET). */
export async function cancelUserSubscription(token: string): Promise<any> {
  return apiRequest("cancel/user/subscription", "GET", { token });
}
