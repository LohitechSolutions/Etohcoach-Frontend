import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text } from "react-native";

type Props = {
  navigation: {
    navigate: (routeName: string) => void;
  };
};

export function PasswordChangedScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Password Changed</Text>
      <Text style={styles.help}>Your password has been updated successfully.</Text>
      <Pressable style={styles.button} onPress={() => navigation.navigate("Landing")}>
        <Text style={styles.buttonText}>Back to Login</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827" },
  help: { color: "#6B7280" },
  button: { backgroundColor: "#111827", borderRadius: 12, padding: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600" }
});
