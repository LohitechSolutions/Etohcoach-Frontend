import React from "react";
import { Text, View } from "react-native";

function stripHtmlTags(input = "") {
  return String(input)
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function useInternalRenderer() {
  return {};
}

export default function RenderHTML(props) {
  const html = props?.source?.html ?? "";
  const text = stripHtmlTags(html);

  return (
    <View style={props?.containerStyle}>
      <Text>{text}</Text>
    </View>
  );
}
