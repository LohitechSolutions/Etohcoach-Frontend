import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { InfoBanner } from "../common/InfoBanner";
import { fetchNotifications } from "../../services/api/features";
import { getTokenForApi } from "../../services/sessionMode";

export function NotificationsScreen() {
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
        setBanner("Nav-only dev session: notifications API is skipped. Use real auth to load the inbox.");
        setItems([]);
        return;
      }
      setBanner(null);
      const data = await fetchNotifications(token);
      setItems(Array.isArray(data?.data) ? data.data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <InfoBanner message={banner} />
      {loading ? <ActivityIndicator /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={items}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        ListEmptyComponent={
          !loading && !error ? (
            <Text style={styles.empty}>
              {banner ? "No preview data in nav-only mode." : "No notifications yet."}
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item?.attributes?.title ?? "Notification"}</Text>
            <Text style={styles.cardBody}>{item?.attributes?.description ?? ""}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 12 },
  error: { color: "#DC2626", marginBottom: 10 },
  card: { backgroundColor: "#F3F4F6", borderRadius: 10, padding: 12, marginBottom: 8 },
  cardTitle: { color: "#111827", fontWeight: "600", marginBottom: 4 },
  cardBody: { color: "#374151" },
  empty: { color: "#6B7280", marginTop: 8 }
});
