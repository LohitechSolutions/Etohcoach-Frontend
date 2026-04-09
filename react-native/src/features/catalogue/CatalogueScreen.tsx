import { useNavigation } from "@react-navigation/native";
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
import { InfoBanner } from "../common/InfoBanner";
import { fetchCatalogue } from "../../services/api/features";
import { getTokenForApi } from "../../services/sessionMode";

export function CatalogueScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getTokenForApi();
      if (!token) {
        setBanner("Nav-only dev session: catalogue API is skipped. Use real auth to load courses.");
        setItems([]);
        return;
      }
      setBanner(null);
      const data = await fetchCatalogue(token);
      const list = Array.isArray(data?.data) ? data.data : [];
      setItems(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load catalogue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Catalogue</Text>
      <InfoBanner message={banner} />
      {loading ? <ActivityIndicator /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={items}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate("OverView", { item })}
          >
            <Text style={styles.cardTitle}>{item?.attributes?.name ?? "Untitled course"}</Text>
            <Text style={styles.cardHint}>Open overview →</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.empty}>
              {banner ? "No preview data in nav-only mode." : "No catalogue items yet."}
            </Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 12 },
  error: { color: "#DC2626", marginBottom: 10 },
  card: { backgroundColor: "#F3F4F6", borderRadius: 10, padding: 12, marginBottom: 8 },
  cardTitle: { color: "#111827", fontWeight: "600" },
  cardHint: { color: "#2563EB", fontSize: 13, marginTop: 6, fontWeight: "600" },
  empty: { color: "#6B7280" }
});
