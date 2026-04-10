import { ActivityIndicator, View, StyleSheet } from "react-native";

import React from "react";

/** Brand red aligned with Globals / legacy loader accent */
const LOADER_COLOR = "rgb(199, 38, 62)";

interface myProps {
  loading: boolean;
}

export default function Loader(props: myProps) {
  if (!props.loading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={LOADER_COLOR} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: 99,
    alignItems: "center",
    justifyContent: "center",
  },
});
