import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput
} from "react-native";
import { changeForgotPassword } from "../../services/api/account";

type Props = {
  route: {
    params?: {
      resetToken?: string;
    };
  };
  navigation: {
    navigate: (routeName: string) => void;
  };
};

export function NewPasswordScreen({ route, navigation }: Props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSave = async () => {
    try {
      setLoading(true);
      setError(null);
      if (password.length < 2) throw new Error("Password must be at least 2 characters");
      if (password !== confirmPassword) throw new Error("Passwords must match");
      const resetToken = route.params?.resetToken;
      if (!resetToken) throw new Error("Missing reset token. Restart forgot password flow.");
      await changeForgotPassword(resetToken, password);
      navigation.navigate("PasswordChanged");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>New Password</Text>
      <Text style={styles.help}>Set and confirm your new password.</Text>
      <TextInput
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="New password"
        style={styles.input}
      />
      <TextInput
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm password"
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable style={styles.button} onPress={onSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Password</Text>}
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, gap: 10 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827" },
  help: { color: "#6B7280" },
  input: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, padding: 12 },
  error: { color: "#DC2626" },
  button: { marginTop: 8, backgroundColor: "#111827", borderRadius: 12, padding: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600" }
});
