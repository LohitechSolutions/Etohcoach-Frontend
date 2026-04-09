import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text } from "react-native";
import { clearSessionToken } from "../../services/storage/sessionStorage";

type Props = {
  navigation: {
    replace: (routeName: string) => void;
    navigate: (routeName: string) => void;
  };
};

export function SettingsScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.help}>Settings routes are now wired for profile account actions.</Text>

      <Pressable style={styles.secondary} onPress={() => navigation.navigate("EditProfile")}>
        <Text style={styles.secondaryText}>Edit profile</Text>
      </Pressable>
      <Pressable style={styles.secondary} onPress={() => navigation.navigate("ChangePassword")}>
        <Text style={styles.secondaryText}>Change password</Text>
      </Pressable>
      <Pressable style={styles.secondary} onPress={() => navigation.navigate("ChangeEmail")}>
        <Text style={styles.secondaryText}>Change email</Text>
      </Pressable>
      <Pressable style={styles.secondary} onPress={() => navigation.navigate("ManageNotifications")}>
        <Text style={styles.secondaryText}>Manage notifications</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={async () => {
          await clearSessionToken();
          navigation.replace("Landing");
        }}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, gap: 10 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827" },
  help: { color: "#6B7280", marginBottom: 6 },
  secondary: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, padding: 12, alignItems: "center" },
  secondaryText: { color: "#111827", fontWeight: "600" },
  button: { marginTop: 8, backgroundColor: "#111827", borderRadius: 12, padding: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600" }
});
