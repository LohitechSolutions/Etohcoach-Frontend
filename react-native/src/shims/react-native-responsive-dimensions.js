import { Dimensions } from "react-native";

const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812;

function toNumber(value) {
  if (typeof value === "string") {
    return parseFloat(value.replace("%", ""));
  }
  return value;
}

export function responsiveWidth(percentage) {
  const { width } = Dimensions.get("window");
  return (width * toNumber(percentage)) / 100;
}

export function responsiveHeight(percentage) {
  const { height } = Dimensions.get("window");
  return (height * toNumber(percentage)) / 100;
}

export function responsiveFontSize(fontSize) {
  const { width, height } = Dimensions.get("window");
  const widthScale = width / DESIGN_WIDTH;
  const heightScale = height / DESIGN_HEIGHT;
  const scale = Math.min(widthScale, heightScale);
  return fontSize * scale;
}

export default {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize
};
