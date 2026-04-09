import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text } from "react-native";

type Nav = { goBack: () => void };

type Props = { navigation: Nav };

export function StripeIntegrationScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Stripe integration</Text>
      <Text style={styles.help}>Placeholder for native/Stripe checkout migration.</Text>
      <Pressable style={styles.secondary} onPress={() => navigation.goBack()}>
        <Text style={styles.secondaryText}>Back</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827" },
  help: { color: "#6B7280", lineHeight: 22 },
  secondary: { padding: 12, alignItems: "center" },
  secondaryText: { color: "#2563EB", fontWeight: "600" }
});
