import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { InfoBanner } from "../common/InfoBanner";
import { fetchProfile } from "../../services/api/features";
import { getTokenForApi } from "../../services/sessionMode";

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getTokenForApi();
        if (!token) {
          setBanner(
            "Nav-only dev session: profile API is skipped. Use real auth to see your details here."
          );
          return;
        }
        setBanner(null);
        const data = await fetchProfile(token);
        setProfile(data?.data?.attributes ?? null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load profile");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <InfoBanner message={banner} />
      {loading ? <ActivityIndicator /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {profile ? (
        <View style={styles.card}>
          <Text style={styles.row}>Name: {profile.first_name ?? "-"} {profile.last_name ?? ""}</Text>
          <Text style={styles.row}>Email: {profile.email ?? "-"}</Text>
          <Text style={styles.row}>Mobile: {profile.full_phone_number ?? "-"}</Text>
        </View>
      ) : null}

      <Text style={styles.section}>Subscription & billing</Text>
      <Pressable style={styles.navBtn} onPress={() => navigation.navigate("SubCriptionScreen")}>
        <Text style={styles.navBtnText}>Plans & pricing</Text>
      </Pressable>
      <Pressable
        style={styles.navBtn}
        onPress={() => navigation.navigate("Customisableusersubscriptions")}
      >
        <Text style={styles.navBtnText}>My subscriptions</Text>
      </Pressable>
      <Pressable style={styles.navBtn} onPress={() => navigation.navigate("SubscriptionBilling")}>
        <Text style={styles.navBtnText}>Billing & Stripe</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 12 },
  error: { color: "#DC2626", marginBottom: 10 },
  card: { backgroundColor: "#F3F4F6", borderRadius: 10, padding: 12, gap: 8 },
  row: { color: "#111827" },
  section: { marginTop: 20, marginBottom: 8, fontSize: 16, fontWeight: "600", color: "#111827" },
  navBtn: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8
  },
  navBtnText: { color: "#111827", fontWeight: "600" }
});
