import React, { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text } from "react-native";
import { cancelUserSubscription } from "../../services/api/features";
import { getTokenForApi } from "../../services/sessionMode";
import { InfoBanner } from "../common/InfoBanner";
import { subscriptionRowTitle } from "./subscriptionUtils";

type Nav = { goBack: () => void };

type Props = {
  navigation: Nav;
  route?: { params?: { item?: any } };
};

export function SubscriptionDetailsScreen({ navigation, route }: Props) {
  const item = route?.params?.item;
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  const raw = item ? JSON.stringify(item, null, 2) : "";

  const onCancel = async () => {
    setError(null);
    const token = await getTokenForApi();
    if (!token) {
      setBanner("Nav-only session: cancel is not sent. Use real auth to call the API.");
      return;
    }
    setBusy(true);
    try {
      await cancelUserSubscription(token);
      navigation.goBack();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cancel failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{item ? subscriptionRowTitle(item) : "Subscription"}</Text>
      <InfoBanner message={banner} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <ScrollView style={styles.scroll}>
        <Text style={styles.mono}>{item ? raw : "No item passed. Open this screen from My subscriptions."}</Text>
      </ScrollView>
      {item ? (
        <Pressable
          style={[styles.button, busy && styles.buttonDisabled]}
          disabled={busy}
          onPress={() => void onCancel()}
        >
          <Text style={styles.buttonText}>{busy ? "Cancelling…" : "Cancel subscription (API)"}</Text>
        </Pressable>
      ) : null}
      <Pressable style={styles.secondary} onPress={() => navigation.goBack()}>
        <Text style={styles.secondaryText}>Back</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#111827", marginBottom: 8 },
  error: { color: "#DC2626", marginBottom: 8 },
  scroll: { flex: 1, marginBottom: 12 },
  mono: { fontSize: 12, color: "#374151", fontFamily: "monospace" },
  button: {
    backgroundColor: "#B91C1C",
    borderRadius: 12,
    padding: 14,
    alignItems: "center"
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontWeight: "600" },
  secondary: { marginTop: 12, padding: 12, alignItems: "center" },
  secondaryText: { color: "#2563EB", fontWeight: "600" }
});
