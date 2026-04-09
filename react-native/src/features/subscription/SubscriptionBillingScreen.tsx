import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

type Nav = { navigate: (name: string) => void; goBack: () => void };

type Props = { navigation: Nav };

export function SubscriptionBillingScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Subscription billing</Text>
      <Text style={styles.help}>
        Billing UI from the legacy app is not ported yet. Use this route to reach Stripe-related flows when you wire payments.
      </Text>
      <View style={styles.row}>
        <Pressable style={styles.button} onPress={() => navigation.navigate("StripeIntegration")}>
          <Text style={styles.buttonText}>Stripe integration</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => navigation.navigate("PaymentAdmin2")}>
          <Text style={styles.buttonText}>Payment admin</Text>
        </Pressable>
      </View>
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
  row: { gap: 10, marginTop: 8 },
  button: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 14,
    alignItems: "center"
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  secondary: { padding: 12, alignItems: "center" },
  secondaryText: { color: "#2563EB", fontWeight: "600" }
});
