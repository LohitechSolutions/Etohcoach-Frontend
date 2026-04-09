import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { searchUsers } from "../../services/api/features";
import { getSessionToken } from "../../services/storage/sessionStorage";

export function SearchScreen() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const runSearch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getSessionToken();
      if (!token) throw new Error("Sign in required.");
      const res = await searchUsers(token, query.trim());
      setItems(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }, [query]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Search users</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Query"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
        <Pressable style={styles.go} onPress={() => void runSearch()}>
          <Text style={styles.goText}>Search</Text>
        </Pressable>
      </View>
      {loading ? <ActivityIndicator /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={items}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {item?.attributes?.first_name} {item?.attributes?.last_name}
            </Text>
            <Text style={styles.cardSub}>{item?.attributes?.email ?? ""}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 12 },
  row: { flexDirection: "row", gap: 8, marginBottom: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, padding: 10 },
  go: { justifyContent: "center", backgroundColor: "#111827", paddingHorizontal: 16, borderRadius: 12 },
  goText: { color: "#fff", fontWeight: "600" },
  error: { color: "#DC2626", marginBottom: 8 },
  card: { backgroundColor: "#F3F4F6", borderRadius: 10, padding: 12, marginBottom: 8 },
  cardTitle: { fontWeight: "600", color: "#111827" },
  cardSub: { color: "#6B7280", fontSize: 13 }
});
