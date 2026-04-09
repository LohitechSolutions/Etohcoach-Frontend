import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text } from "react-native";

type Nav = {
  navigate: (name: string) => void;
  goBack: () => void;
};

type Props = {
  navigation: Nav;
  route?: { params?: { demo?: boolean } };
};

export function SubscriptionSuccessScreen({ navigation, route }: Props) {
  const demo = route?.params?.demo === true;
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Subscription updated</Text>
      <Text style={styles.help}>
        {demo
          ? "Dev preview: this screen is reachable without a backend purchase."
          : "Your subscription was recorded with the backend (if the API accepted the request)."}
      </Text>
      <Pressable style={styles.button} onPress={() => navigation.navigate("Customisableusersubscriptions")}>
        <Text style={styles.buttonText}>View my subscriptions</Text>
      </Pressable>
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
  button: {
    marginTop: 8,
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 14,
    alignItems: "center"
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  secondary: { padding: 12, alignItems: "center" },
  secondaryText: { color: "#2563EB", fontWeight: "600" }
});
