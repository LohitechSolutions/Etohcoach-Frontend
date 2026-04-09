import React from "react";
import { View } from "react-native";

/**
 * RN shim for web `react-progress-label` (SVG). Renders a simple ring placeholder so Metro bundles.
 */
export default function ProgressLabel({
  size = 200,
  progress: _progress,
  fillColor = "#fff",
  trackColor = "#ccc",
  progressColor: _progressColor,
  progressWidth,
  trackWidth,
  trackBorderWidth,
  trackBorderColor,
  cornersWidth: _cornersWidth,
  children,
  style,
  ...rest
}) {
  const tw = trackWidth ?? progressWidth ?? 8;
  const bw = trackBorderWidth ?? 0;
  const bc = trackBorderColor ?? trackColor;
  return (
    <View
      style={[{ width: size, height: size, justifyContent: "center", alignItems: "center" }, style]}
      {...rest}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: tw + bw,
          borderColor: bc,
          backgroundColor: fillColor,
        }}
      />
      {children}
    </View>
  );
}
