import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { fetchCatalogue } from "../../services/api/features";
import { getSessionToken } from "../../services/storage/sessionStorage";

type Props = {
  navigation: {
    push: (name: string, params?: Record<string, unknown>) => void;
  };
};

/** Mirrors legacy Filteritems initial load: full catalogue list (filter options use derived min/max later). */
export function FilterItemsScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getSessionToken();
        if (!token) throw new Error("Sign in required.");
        const data = await fetchCatalogue(token);
        setItems(Array.isArray(data?.data) ? data.data : []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load items");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Filter (catalogue)</Text>
      {loading ? <ActivityIndicator /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable onPress={() => navigation.push("Filteroptions")}>
        <Text style={styles.link}>Open filter options →</Text>
      </Pressable>
      <FlatList
        data={items}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item?.attributes?.name ?? "Item"}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 8 },
  link: { color: "#2563EB", marginBottom: 12, fontWeight: "600" },
  error: { color: "#DC2626", marginBottom: 8 },
  card: { backgroundColor: "#F3F4F6", borderRadius: 10, padding: 12, marginBottom: 8 },
  cardTitle: { fontWeight: "600", color: "#111827" }
});
