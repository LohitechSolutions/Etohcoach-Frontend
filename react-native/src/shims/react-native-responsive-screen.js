import { Dimensions } from "react-native";

function toNumber(value) {
  if (typeof value === "string") {
    return parseFloat(value.replace("%", ""));
  }
  return value;
}

export function widthPercentageToDP(percentage) {
  const { width } = Dimensions.get("window");
  return (width * toNumber(percentage)) / 100;
}

export function heightPercentageToDP(percentage) {
  const { height } = Dimensions.get("window");
  return (height * toNumber(percentage)) / 100;
}

export default {
  widthPercentageToDP,
  heightPercentageToDP
};
