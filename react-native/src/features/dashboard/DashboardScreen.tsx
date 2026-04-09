import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text } from "react-native";
import { InfoBanner } from "../common/InfoBanner";
import { fetchDashboard } from "../../services/api/features";
import { getTokenForApi } from "../../services/sessionMode";
import { clearSessionToken, getSessionToken } from "../../services/storage/sessionStorage";

type Props = {
  navigation: {
    replace: (routeName: string) => void;
  };
};

export function DashboardScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [title, setTitle] = useState("Dashboard");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const session = await getSessionToken();
      if (!session) {
        navigation.replace("Landing");
        return;
      }
      const token = await getTokenForApi();
      if (!token) {
        setBanner(
          "Nav-only dev session: dashboard API is skipped. Set EXPO_PUBLIC_USE_REAL_AUTH=true and sign in to load live data."
        );
        setTitle("Dashboard");
        return;
      }
      setBanner(null);
      const data = await fetchDashboard(token);
      setTitle(data?.message || data?.data?.title || "Dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load dashboard");
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <InfoBanner message={banner} />
      {loading ? <ActivityIndicator /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.button} onPress={() => void load()}>
        <Text style={styles.buttonText}>Reload</Text>
      </Pressable>
      <Pressable
        style={[styles.button, styles.logout]}
        onPress={async () => {
          await clearSessionToken();
          navigation.replace("Landing");
        }}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", gap: 10 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827" },
  error: { color: "#DC2626" },
  button: {
    marginTop: 8,
    backgroundColor: "#111827",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center"
  },
  logout: { backgroundColor: "#374151" },
  buttonText: { color: "#fff", fontWeight: "600" }
});
