import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text } from "react-native";
import { fetchPrivacyPolicy, fetchTermsAndConditions } from "../../services/api/features";
import { stripHtml } from "../../utils/stripHtml";

type Props = {
  route: {
    params?: {
      /** Legacy: when truthy, loads terms; otherwise loads privacy policy. */
      TermsAndConditions?: boolean;
    };
  };
};

export function TermsScreen({ route }: Props) {
  const loadTerms = route.params?.TermsAndConditions === true;
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = loadTerms ? await fetchTermsAndConditions() : await fetchPrivacyPolicy();
        const list = res?.data;
        if (Array.isArray(list) && list.length > 0) {
          const idx = loadTerms ? list.length - 1 : 0;
          const html = list[idx]?.attributes?.content ?? "";
          setBody(stripHtml(html));
        } else {
          setBody("No content returned.");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load legal text");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [loadTerms]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      <Text style={styles.title}>{loadTerms ? "Terms and conditions" : "Privacy policy"}</Text>
      {loading ? <ActivityIndicator /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && !error ? <Text style={styles.body}>{body}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: "700", color: "#111827", marginBottom: 12 },
  body: { fontSize: 15, color: "#374151", lineHeight: 22 },
  error: { color: "#DC2626" }
});
