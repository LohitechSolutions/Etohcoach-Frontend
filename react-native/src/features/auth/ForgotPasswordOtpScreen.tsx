import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput
} from "react-native";
import { confirmPasswordOtp } from "../../services/api/account";

type Props = {
  route: {
    params?: {
      resetToken?: string;
      email?: string;
    };
  };
  navigation: {
    navigate: (routeName: string, params?: Record<string, string>) => void;
  };
};

export function ForgotPasswordOtpScreen({ navigation, route }: Props) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resetToken = route.params?.resetToken ?? "";

  const onContinue = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!resetToken) {
        throw new Error("Missing reset token. Please request OTP again.");
      }
      const confirmedToken = await confirmPasswordOtp(resetToken, otp.trim());
      navigation.navigate("NewPassword", {
        resetToken: confirmedToken,
        email: route.params?.email ?? ""
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "OTP confirmation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.help}>Enter the OTP sent to your email.</Text>
      <TextInput
        keyboardType="number-pad"
        onChangeText={setOtp}
        placeholder="OTP code"
        style={styles.input}
        value={otp}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable style={styles.button} onPress={onContinue} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Continue</Text>}
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827" },
  help: { color: "#6B7280" },
  input: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, padding: 12 },
  error: { color: "#DC2626" },
  button: { backgroundColor: "#111827", borderRadius: 12, padding: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600" }
});
