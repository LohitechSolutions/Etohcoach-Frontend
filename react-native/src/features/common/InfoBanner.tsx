import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function InfoBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FCD34D"
  },
  text: { color: "#92400E", fontSize: 13 }
});
