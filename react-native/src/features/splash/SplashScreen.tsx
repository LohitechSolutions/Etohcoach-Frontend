import React, { useEffect } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text } from "react-native";
import { getSessionToken } from "../../services/storage/sessionStorage";

type Props = {
  navigation: {
    replace: (routeName: string) => void;
  };
};

export function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const bootstrap = async () => {
      const token = await getSessionToken();
      navigation.replace(token ? "DashboardTabs" : "Landing");
    };
    void bootstrap();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>EtOH Coach</Text>
      <Text style={styles.subtitle}>Loading session...</Text>
      <ActivityIndicator style={styles.loader} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF"
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827"
  },
  subtitle: {
    marginTop: 8,
    color: "#6B7280"
  },
  loader: {
    marginTop: 16
  }
});
