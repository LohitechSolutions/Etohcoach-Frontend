/**
 * react-navigation 2.x calls Linking.removeEventListener on unmount.
 * React Native 0.65+ only exposes subscription.remove() from addEventListener.
 */
import { Linking } from "react-native";

if (typeof Linking.removeEventListener !== "function") {
  const origAdd = Linking.addEventListener.bind(Linking);
  const urlSubs = new Map();
  Linking.addEventListener = function (eventType, listener) {
    const sub = origAdd(eventType, listener);
    if (eventType === "url") {
      urlSubs.set(listener, sub);
    }
    return sub;
  };
  Linking.removeEventListener = function (eventType, listener) {
    if (eventType === "url") {
      const sub = urlSubs.get(listener);
      if (sub && typeof sub.remove === "function") {
        sub.remove();
      }
      urlSubs.delete(listener);
    }
  };
}
