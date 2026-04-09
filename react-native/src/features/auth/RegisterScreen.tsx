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
import { registerWithEmail } from "../../services/api/account";

type Props = {
  navigation: {
    replace: (routeName: string) => void;
    goBack: () => void;
  };
};

export function RegisterScreen({ navigation }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onRegister = async () => {
    try {
      setLoading(true);
      setError(null);
      await registerWithEmail({ firstName, lastName, email, password });
      navigation.replace("Landing");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <View style={styles.form}>
        <TextInput value={firstName} onChangeText={setFirstName} placeholder="First name" style={styles.input} />
        <TextInput value={lastName} onChangeText={setLastName} placeholder="Last name" style={styles.input} />
        <TextInput value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" style={styles.input} />
        <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry style={styles.input} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable style={styles.button} onPress={onRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
        </Pressable>
        <Pressable onPress={navigation.goBack}>
          <Text style={styles.link}>Back to login</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827" },
  form: { marginTop: 20, gap: 10 },
  input: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, padding: 12 },
  button: { backgroundColor: "#111827", borderRadius: 12, padding: 12, alignItems: "center", marginTop: 8 },
  buttonText: { color: "#fff", fontWeight: "600" },
  link: { color: "#2563EB", marginTop: 8 },
  error: { color: "#DC2626" }
});
