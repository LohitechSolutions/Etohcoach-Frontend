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
import { fetchCustomisableUserSubscriptions } from "../../services/api/features";
import { getTokenForApi } from "../../services/sessionMode";
import { InfoBanner } from "../common/InfoBanner";
import { normalizeSubscriptionList, subscriptionRowSubtitle, subscriptionRowTitle } from "./subscriptionUtils";

type Nav = {
  navigate: (name: string, params?: { item?: any }) => void;
};

type Props = { navigation: Nav };

export function CustomisableUserSubscriptionsScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [banner, setBanner] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getTokenForApi();
      if (!token) {
        setBanner("Nav-only dev session: no API list. Use real auth to load subscriptions.");
        setItems([]);
        return;
      }
      setBanner(null);
      const res = await fetchCustomisableUserSubscriptions(token);
      setItems(normalizeSubscriptionList(res));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load subscriptions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My subscriptions</Text>
      <InfoBanner message={banner} />
      {loading ? <ActivityIndicator /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={items}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.muted}>
              {banner ? "Nothing to show without a real session token." : "No subscription rows returned."}
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate("SubscriptionDetails", { item })}
          >
            <Text style={styles.cardTitle}>{subscriptionRowTitle(item)}</Text>
            {subscriptionRowSubtitle(item) ? (
              <Text style={styles.cardSub}>{subscriptionRowSubtitle(item)}</Text>
            ) : null}
            <Text style={styles.link}>Details →</Text>
          </Pressable>
        )}
      />

      <Pressable style={styles.secondary} onPress={() => void load()}>
        <Text style={styles.secondaryText}>Reload</Text>
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
    gap: 4
  },
  cardTitle: { fontSize: 17, fontWeight: "600", color: "#111827" },
  cardSub: { color: "#4B5563" },
  link: { color: "#2563EB", fontWeight: "600", marginTop: 4 },
  secondary: { padding: 12, alignItems: "center" },
  secondaryText: { color: "#2563EB", fontWeight: "600" }
});
