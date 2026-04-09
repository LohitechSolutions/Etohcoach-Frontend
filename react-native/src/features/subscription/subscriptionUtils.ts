/** Normalize JSON:API-ish list responses to an array for FlatList. */
export function normalizeSubscriptionList(res: any): any[] {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data)) return d.data;
  return [];
}

export function subscriptionRowTitle(item: any): string {
  const attrs = item?.attributes ?? item;
  return (
    attrs?.name ??
    attrs?.title ??
    attrs?.plan_name ??
    attrs?.id?.toString?.() ??
    "Subscription"
  );
}

export function subscriptionRowSubtitle(item: any): string {
  const attrs = item?.attributes ?? item;
  const price = attrs?.price ?? attrs?.amount;
  const currency = attrs?.currency ?? "";
  if (price != null) return `${currency ? `${currency} ` : ""}${price}`.trim();
  return attrs?.description ?? "";
}
