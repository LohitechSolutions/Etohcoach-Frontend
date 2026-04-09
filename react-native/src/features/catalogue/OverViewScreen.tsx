import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { InfoBanner } from "../common/InfoBanner";

export function OverViewScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const item = route.params?.item as any | undefined;

  const title = item?.attributes?.name ?? "Course overview";
  const courseId = item?.id ?? item?.attributes?.id;

  useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>{title}</Text>
        {courseId != null ? (
          <Text style={styles.meta}>Course id: {String(courseId)}</Text>
        ) : null}

        {!item ? (
          <InfoBanner message="No catalogue item in route params. Open this screen from the catalogue list." />
        ) : null}

        <Text style={styles.help}>
          This is the course hub shell. Deeper learning routes (study, quizzes, exams) stay as scaffolded
          screens until those vertical slices are migrated.
        </Text>

        <View style={styles.actions}>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate("CatalogueStudy", { item })}
          >
            <Text style={styles.buttonText}>Study (shell)</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate("Themes", { item })}
          >
            <Text style={styles.buttonText}>Themes (shell)</Text>
          </Pressable>
          <Pressable
            style={styles.buttonSecondary}
            onPress={() => navigation.navigate("QuizzesExamInit", { item })}
          >
            <Text style={styles.buttonSecondaryText}>Quizzes / exams (shell)</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Pressable style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back to catalogue</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { padding: 20, paddingBottom: 32, gap: 10 },
  heading: { fontSize: 24, fontWeight: "700", color: "#111827" },
  meta: { fontSize: 14, color: "#6B7280" },
  help: { color: "#4B5563", lineHeight: 22, marginTop: 4 },
  actions: { marginTop: 16, gap: 10 },
  button: {
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center"
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center"
  },
  buttonSecondaryText: { color: "#111827", fontWeight: "600" },
  back: { padding: 16, alignItems: "center" },
  backText: { color: "#2563EB", fontWeight: "600" }
});
