import { useRoute } from "@react-navigation/native";
import React from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text
} from "react-native";
import { allRoutes } from "../../navigation/routes";

type Props = {
  navigation: {
    navigate: (routeName: string) => void;
  };
};

export function PlaceholderScreen({ navigation }: Props) {
  const route = useRoute();
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>{route.name}</Text>
      <Text style={styles.subtitle}>
        Expo migration in progress. This route is scaffolded and wired.
      </Text>

      <FlatList
        contentContainerStyle={styles.list}
        data={allRoutes}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => navigation.navigate(item)}>
            <Text style={styles.itemText}>{item}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
    color: "#111827"
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 6
  },
  list: {
    paddingVertical: 20,
    gap: 10
  },
  item: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12
  },
  itemText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600"
  }
});
