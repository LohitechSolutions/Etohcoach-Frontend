import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { requestPasswordOtp } from "../../services/api/account";

type Props = {
  navigation: {
    navigate: (routeName: string, params?: Record<string, string>) => void;
  };
};

export function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onRequestOtp = async () => {
    try {
      setLoading(true);
      setError(null);
      const resetToken = await requestPasswordOtp(email.trim());
      navigation.navigate("ForgotPasswordOTP", { email, resetToken });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.help}>Enter your account email to request OTP.</Text>
      <View style={styles.form}>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="Email"
          style={styles.input}
          value={email}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable style={styles.button} onPress={onRequestOtp} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Request OTP</Text>}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827" },
  help: { marginTop: 6, color: "#6B7280" },
  form: { marginTop: 16, gap: 10 },
  input: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, padding: 12 },
  button: { backgroundColor: "#111827", borderRadius: 12, padding: 12, alignItems: "center", marginTop: 6 },
  buttonText: { color: "#fff", fontWeight: "600" },
  error: { color: "#DC2626" }
});
