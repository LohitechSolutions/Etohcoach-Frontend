import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";

export function ManageNotificationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Manage notifications</Text>
      <Text style={styles.help}>Notification preference controls migration is pending for this route.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, gap: 10 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827" },
  help: { color: "#6B7280" }
});
