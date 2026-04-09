import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { fetchContactUs } from "../../services/api/features";
import { getSessionToken } from "../../services/storage/sessionStorage";

type Props = {
  navigation: {
    navigate: (name: string) => void;
  };
};

export function ContactUsScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageLink, setPageLink] = useState<string | null>(null);
  const [chatLink, setChatLink] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getSessionToken();
        if (!token) {
          setError("Sign in required to load contact configuration.");
          return;
        }
        const res = await fetchContactUs(token);
        setPageLink(res?.page_link ?? res?.data?.page_link ?? null);
        setChatLink(res?.chat_link ?? res?.data?.chat_link ?? null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load contact_us");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Contact us</Text>
      {loading ? <ActivityIndicator /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {pageLink ? (
        <Pressable style={styles.button} onPress={() => void Linking.openURL(pageLink)}>
          <Text style={styles.buttonText}>Open support page</Text>
        </Pressable>
      ) : null}
      {chatLink ? (
        <Pressable style={styles.button} onPress={() => void Linking.openURL(chatLink)}>
          <Text style={styles.buttonText}>Open chat link</Text>
        </Pressable>
      ) : null}

      {!loading && !pageLink && !chatLink && !error ? (
        <Text style={styles.muted}>No links returned from API. Use add message below.</Text>
      ) : null}

      <View style={styles.footer}>
        <Pressable style={styles.secondary} onPress={() => navigation.navigate("AddContactus")}>
          <Text style={styles.secondaryText}>Add contact message</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827" },
  error: { color: "#DC2626" },
  muted: { color: "#6B7280" },
  button: { backgroundColor: "#111827", borderRadius: 12, padding: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600" },
  footer: { marginTop: "auto", paddingTop: 24 },
  secondary: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, padding: 12, alignItems: "center" },
  secondaryText: { color: "#111827", fontWeight: "600" }
});
