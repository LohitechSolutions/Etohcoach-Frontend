import React from "react";
import { Pressable, View } from "react-native";

/**
 * Stub for `react-native-soundcloud-waveform` (native deps). Renders a simple scrub bar.
 */
export default function SoundCloudWaveform({
  percentPlayed = 0,
  setTime,
  width = 250,
  height = 10,
  active = "#333",
  inactive = "#ccc",
  activeInverse: _a,
  inactiveInverse: _b,
  waveformUrl: _w,
}) {
  const pct = Math.min(1, Math.max(0, Number(percentPlayed) || 0));
  return (
    <Pressable
      style={{ width, height }}
      onPressIn={(e) => {
        if (typeof setTime !== "function") return;
        const x = e.nativeEvent.locationX;
        const t = (x / width) * 56;
        setTime(t);
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: inactive,
          borderRadius: 2,
          overflow: "hidden",
          flexDirection: "row",
        }}
      >
        <View style={{ flex: pct, backgroundColor: active }} />
        <View style={{ flex: 1 - pct, backgroundColor: "transparent" }} />
      </View>
    </Pressable>
  );
}
