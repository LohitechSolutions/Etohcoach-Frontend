import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { fetchCatalogueByPath } from "../../services/api/features";
import { getSessionToken } from "../../services/storage/sessionStorage";

const SORT_OPTIONS: { label: string; path: string }[] = [
  { label: "Price low → high", path: "sorting/sorting?sort[order_by]=price&sort[direction]=asc" },
  { label: "Price high → low", path: "sorting/sorting?sort[order_by]=price&sort[direction]=desc" },
  { label: "Newest", path: "sorting/sorting?sort[order_by]=created_at&sort[direction]=desc" },
  { label: "Popularity", path: "sorting/sorting?sort[order_by]=average_rating&sort[direction]=desc" },
  { label: "Default sorting list", path: "sorting/sorting" }
];

export function SortingScreen() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const load = async (label: string, path: string) => {
    try {
      setLoading(true);
      setError(null);
      setActiveLabel(label);
      const token = await getSessionToken();
      if (!token) throw new Error("Sign in required.");
      const res = await fetchCatalogueByPath(token, path);
      setItems(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load sorted catalogue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sort catalogue</Text>
      <View style={styles.chips}>
        {SORT_OPTIONS.map((opt) => (
          <Pressable
            key={opt.path}
            style={[styles.chip, activeLabel === opt.label && styles.chipActive]}
            onPress={() => void load(opt.label, opt.path)}
          >
            <Text style={[styles.chipText, activeLabel === opt.label && styles.chipTextActive]}>
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>
      {loading ? <ActivityIndicator /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={items}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item?.attributes?.name ?? "Item"}</Text>
          </View>
        )}
        ListEmptyComponent={
          !loading ? <Text style={styles.empty}>Pick a sort option to load results.</Text> : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 12 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  chip: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 20, paddingVertical: 8, paddingHorizontal: 12 },
  chipActive: { backgroundColor: "#111827", borderColor: "#111827" },
  chipText: { color: "#111827", fontSize: 13 },
  chipTextActive: { color: "#fff" },
  error: { color: "#DC2626", marginBottom: 8 },
  card: { backgroundColor: "#F3F4F6", borderRadius: 10, padding: 12, marginBottom: 8 },
  cardTitle: { fontWeight: "600", color: "#111827" },
  empty: { color: "#6B7280" }
});
