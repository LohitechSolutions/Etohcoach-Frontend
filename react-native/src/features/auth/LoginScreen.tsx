import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { DEV_NAV_ONLY_TOKEN, env } from "../../config/env";
import { loginWithEmail } from "../../services/api/auth";
import { setSessionToken } from "../../services/storage/sessionStorage";

type Props = {
  navigation: {
    replace: (routeName: string) => void;
    navigate: (routeName: string, params?: Record<string, unknown>) => void;
  };
};

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disabled = useMemo(() => {
    if (loading) return true;
    if (!env.useRealAuth) return false;
    return email.trim().length < 3 || password.trim().length < 3;
  }, [email, loading, password]);

  const onLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!env.useRealAuth) {
        await setSessionToken(DEV_NAV_ONLY_TOKEN);
        navigation.replace("DashboardTabs");
        return;
      }

      const token = await loginWithEmail(email.trim(), password);
      await setSessionToken(token);
      navigation.replace("DashboardTabs");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>EtOH Coach</Text>
      <Text style={styles.subtitle}>
        {env.useRealAuth
          ? "Expo migration app login"
          : "Dev: Sign In skips API — set EXPO_PUBLIC_USE_REAL_AUTH=true for real auth."}
      </Text>

      <View style={styles.form}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="Email"
          style={styles.input}
          value={email}
        />
        <TextInput
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          disabled={disabled}
          onPress={onLogin}
          style={[styles.button, disabled && styles.buttonDisabled]}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </Pressable>

        <Pressable onPress={() => navigation.navigate("EmailAccountRegistration")}>
          <Text style={styles.link}>Open registration route</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.link}>Forgot password</Text>
        </Pressable>
        <View style={styles.legalRow}>
          <Pressable onPress={() => navigation.navigate("TermsAndConditions", { TermsAndConditions: true })}>
            <Text style={styles.linkSmall}>Terms</Text>
          </Pressable>
          <Text style={styles.legalSep}>·</Text>
          <Pressable onPress={() => navigation.navigate("TermsAndConditions", {})}>
            <Text style={styles.linkSmall}>Privacy</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20
  },
  title: {
    marginTop: 16,
    fontSize: 28,
    fontWeight: "700",
    color: "#111827"
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280"
  },
  form: {
    marginTop: 24,
    gap: 12
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16
  },
  button: {
    marginTop: 8,
    backgroundColor: "#111827",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600"
  },
  link: {
    color: "#2563EB",
    marginTop: 6
  },
  legalRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 16 },
  linkSmall: { color: "#2563EB", fontSize: 13 },
  legalSep: { color: "#9CA3AF", fontSize: 13 },
  error: {
    color: "#DC2626"
  }
});
