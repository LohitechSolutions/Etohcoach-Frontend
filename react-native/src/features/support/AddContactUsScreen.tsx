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
import { submitContactMessage } from "../../services/api/account";
import { getSessionToken } from "../../services/storage/sessionStorage";

export function AddContactUsScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      const token = await getSessionToken();
      if (!token) throw new Error("Please sign in first.");
      await submitContactMessage(token, {
        name,
        email,
        phoneNumber: phone,
        comments
      });
      setMessage("Message submitted. If the API rejects the payload shape, update submitContactMessage in services.");
      setName("");
      setEmail("");
      setPhone("");
      setComments("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Send a message</Text>
      <Text style={styles.hint}>Uses POST contact_us with JSON:API-style body (verify against your backend).</Text>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput style={styles.input} placeholder="Phone" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Comments"
          multiline
          value={comments}
          onChangeText={setComments}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {message ? <Text style={styles.success}>{message}</Text> : null}
        <Pressable style={styles.button} onPress={onSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit</Text>}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 8 },
  hint: { color: "#6B7280", marginBottom: 16, fontSize: 13 },
  form: { gap: 10 },
  input: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, padding: 12 },
  multiline: { minHeight: 100, textAlignVertical: "top" },
  button: { backgroundColor: "#111827", borderRadius: 12, padding: 12, alignItems: "center", marginTop: 8 },
  buttonText: { color: "#fff", fontWeight: "600" },
  error: { color: "#DC2626" },
  success: { color: "#059669" }
});
