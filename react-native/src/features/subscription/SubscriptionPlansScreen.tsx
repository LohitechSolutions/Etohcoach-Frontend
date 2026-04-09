import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";
import {
  fetchSubscriptionPricingList,
  postUserSubscription,
  type UserSubscriptionPostBody
} from "../../services/api/features";
import { getTokenForApi } from "../../services/sessionMode";
import { InfoBanner } from "../common/InfoBanner";
import { normalizeSubscriptionList, subscriptionRowSubtitle, subscriptionRowTitle } from "./subscriptionUtils";

type Nav = {
  navigate: (name: string, params?: object) => void;
};

type Props = { navigation: Nav };

export function SubscriptionPlansScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [banner, setBanner] = useState<string | null>(null);
  const [postingId, setPostingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getTokenForApi();
      if (!token) {
        setBanner("Nav-only dev session: sign in with real auth to load plans from the API.");
        setItems([]);
        return;
      }
      setBanner(null);
      const res = await fetchSubscriptionPricingList(token);
      setItems(normalizeSubscriptionList(res));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load subscriptions list");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const subscribeToItem = async (item: any) => {
    const token = await getTokenForApi();
    if (!token) {
      navigation.navigate("SubcriptionSuccsess", { demo: true });
      return;
    }
    const attrs = item?.attributes ?? item;
    const id =
      attrs?.id?.toString?.() ??
      attrs?.subscription_id?.toString?.() ??
      item?.id?.toString?.() ??
      "unknown";
    const body: UserSubscriptionPostBody = {
      subscription_id: id,
      subscription_date: new Date().toISOString().slice(0, 19),
      duration: "1.month"
    };
    setPostingId(id);
    try {
      await postUserSubscription(token, body);
      navigation.navigate("SubcriptionSuccsess", { demo: false });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Subscription request failed");
    } finally {
      setPostingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Subscription plans</Text>
      <InfoBanner message={banner} />
      {loading ? <ActivityIndicator /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={items}
        keyExtractor={(item, index) =>
          String(item?.id ?? item?.attributes?.id ?? index)
        }
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.muted}>
              {banner ? "Use real auth to see plans, or open the success screen below to test navigation." : "No plans returned."}
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{subscriptionRowTitle(item)}</Text>
            {subscriptionRowSubtitle(item) ? (
              <Text style={styles.cardSub}>{subscriptionRowSubtitle(item)}</Text>
            ) : null}
            <Pressable
              style={styles.button}
              disabled={postingId != null}
              onPress={() => void subscribeToItem(item)}
            >
              <Text style={styles.buttonText}>
                {postingId != null ? "Working…" : "Subscribe"}
              </Text>
            </Pressable>
          </View>
        )}
      />

      <Pressable style={styles.secondary} onPress={() => navigation.navigate("SubcriptionSuccsess", { demo: true })}>
        <Text style={styles.secondaryText}>Open success screen (dev)</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 8 },
  error: { color: "#DC2626", marginBottom: 8 },
  muted: { color: "#6B7280", marginTop: 8 },
  card: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    gap: 8
  },
  cardTitle: { fontSize: 17, fontWeight: "600", color: "#111827" },
  cardSub: { color: "#4B5563" },
  button: {
    alignSelf: "flex-start",
    backgroundColor: "#111827",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  secondary: { marginTop: 12, padding: 12, alignItems: "center" },
  secondaryText: { color: "#2563EB", fontWeight: "600" }
});
