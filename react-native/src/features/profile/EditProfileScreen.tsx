import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";

export function EditProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Edit profile</Text>
      <Text style={styles.help}>Profile editing migration is the next step for this route.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, gap: 10 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827" },
  help: { color: "#6B7280" }
});
