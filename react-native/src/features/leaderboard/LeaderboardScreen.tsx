import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { InfoBanner } from "../common/InfoBanner";
import { fetchLeaderboard } from "../../services/api/features";
import { getTokenForApi } from "../../services/sessionMode";

export function LeaderboardScreen() {
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
        setBanner(
          "Nav-only dev session: leaderboard API is skipped. Use real auth to load rankings."
        );
        setItems([]);
        return;
      }
      setBanner(null);
      const data = await fetchLeaderboard(token);
      setItems(Array.isArray(data?.data) ? data.data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load leaderboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <InfoBanner message={banner} />
      {loading ? <ActivityIndicator /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={items}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        ListEmptyComponent={
          !loading && !error ? (
            <Text style={styles.empty}>
              {banner ? "No preview data in nav-only mode." : "No leaderboard rows yet."}
            </Text>
          ) : null
        }
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.name}>
              {item?.attributes?.full_name ?? item?.attributes?.name ?? "User"}
            </Text>
            <Text style={styles.score}>{item?.attributes?.score ?? "-"}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 10 },
  error: { color: "#DC2626", marginBottom: 10 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8
  },
  rank: { width: 28, fontWeight: "700", color: "#111827" },
  name: { flex: 1, color: "#111827" },
  score: { color: "#111827", fontWeight: "600" },
  empty: { color: "#6B7280", marginTop: 8 }
});
