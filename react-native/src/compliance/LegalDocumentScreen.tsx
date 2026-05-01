import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View, Pressable } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { WebView } from "react-native-webview";
import type { RootStackParamList } from "../navigation/rootStackParamList";
import {
  type LegalPolicyPick,
  fetchPrivacyPolicy,
  fetchTermsPolicy,
} from "./legalDocumentsApi";

type Props = NativeStackScreenProps<RootStackParamList, "LegalDocument">;

function wrapHtmlFragment(body: string): string {
  const safe = body.trim() || "<p>No content has been published yet.</p>";
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/><link href="https://fonts.googleapis.com/css2?family=Expletus+Sans:wght@400;600;700&family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet"/><style>
body { font-family: 'Roboto', system-ui, sans-serif; padding: 16px; font-size: 16px; line-height: 1.5; color: #222; }
h1, h2, h3, h4, h5, h6 { font-family: 'Expletus Sans', serif; font-weight: 600; }
img { max-width: 100%; height: auto; }
</style></head><body>${safe}</body></html>`;
}

export function LegalDocumentScreen({ navigation, route }: Props) {
  const { kind } = route.params;
  const [policy, setPolicy] = useState<LegalPolicyPick | null>(null);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: kind === "terms" ? "Terms of Service" : "Privacy Policy",
      headerBackTitle: "Back",
    });
  }, [navigation, kind]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setError(null);
      setPolicy(null);
      try {
        const p = kind === "terms" ? await fetchTermsPolicy() : await fetchPrivacyPolicy();
        if (!cancelled) setPolicy(p);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Could not load this document.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [kind]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errText}>{error}</Text>
        <Pressable style={styles.retry} onPress={() => navigation.goBack()}>
          <Text style={styles.retryText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  if (!policy) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#c44d5c" />
      </View>
    );
  }

  if (policy.pageType === "link" && policy.pageLink) {
    return (
      <WebView
        style={styles.web}
        source={{ uri: policy.pageLink }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#c44d5c" />
          </View>
        )}
      />
    );
  }

  return (
    <WebView
      style={styles.web}
      originWhitelist={["*"]}
      source={{ html: wrapHtmlFragment(policy.html || "") }}
    />
  );
}

const styles = StyleSheet.create({
  web: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 24 },
  errText: { fontSize: 15, color: "#444", textAlign: "center", marginBottom: 16 },
  retry: { paddingVertical: 12, paddingHorizontal: 20, backgroundColor: "#c44d5c", borderRadius: 10 },
  retryText: { color: "#fff", fontWeight: "600" },
});
