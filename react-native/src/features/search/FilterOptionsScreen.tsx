import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { fetchFilterItems } from "../../services/api/features";
import { getSessionToken } from "../../services/storage/sessionStorage";

export function FilterOptionsScreen() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getSessionToken();
        if (!token) throw new Error("Sign in required.");
        const data = await fetchFilterItems(token);
        setItems(Array.isArray(data?.data) ? data.data : []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load filter results");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Filter options</Text>
      <Text style={styles.hint}>GET filter_items/filtering (add query params in a later phase).</Text>
      {loading ? <ActivityIndicator /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={items}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{JSON.stringify(item?.attributes ?? item).slice(0, 120)}…</Text>
          </View>
        )}
        ListEmptyComponent={!loading ? <Text style={styles.empty}>No rows.</Text> : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 8 },
  hint: { color: "#6B7280", marginBottom: 12, fontSize: 13 },
  error: { color: "#DC2626", marginBottom: 8 },
  card: { backgroundColor: "#F3F4F6", borderRadius: 10, padding: 12, marginBottom: 8 },
  cardTitle: { color: "#111827", fontSize: 13 },
  empty: { color: "#6B7280" }
});
