/**
 * Legacy blocks call `react-native-splash-screen`. Under Expo, map hide to expo-splash-screen
 * so the configured splash image stays up until JS explicitly hides it.
 */
let expoSplash = null;
try {
  expoSplash = require("expo-splash-screen");
} catch {
  expoSplash = null;
}

const SplashScreen = {
  show: () => {},
  hide: () => {
    if (expoSplash?.hideAsync) {
      void expoSplash.hideAsync();
    }
  },
};

module.exports = SplashScreen;
module.exports.default = SplashScreen;
