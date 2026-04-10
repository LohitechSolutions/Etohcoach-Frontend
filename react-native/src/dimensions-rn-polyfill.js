/**
 * React Native 0.73+ removed Dimensions.removeEventListener; addEventListener
 * returns a subscription with .remove(). Older navigation code still calls
 * removeEventListener on unmount.
 */
import { Dimensions } from "react-native";

if (typeof Dimensions.removeEventListener !== "function") {
  const origAdd = Dimensions.addEventListener.bind(Dimensions);
  const subs = new Map();
  Dimensions.addEventListener = function (type, handler) {
    const sub = origAdd(type, handler);
    subs.set(handler, sub);
    return sub;
  };
  Dimensions.removeEventListener = function (type, handler) {
    const sub = subs.get(handler);
    if (sub && typeof sub.remove === "function") {
      sub.remove();
    }
    subs.delete(handler);
  };
}
