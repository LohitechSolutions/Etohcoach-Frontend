import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

function normalize(size, based = "width") {
  const scale = based === "height" ? height / guidelineBaseHeight : width / guidelineBaseWidth;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export function RFValue(fontSize, standardScreenHeight = guidelineBaseHeight) {
  const heightPercent = (fontSize * height) / standardScreenHeight;
  return Math.round(PixelRatio.roundToNearestPixel(heightPercent));
}

export function RFPercentage(percent) {
  return normalize(percent, "height");
}

export default {
  RFValue,
  RFPercentage
};
