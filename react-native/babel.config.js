module.exports = function(api) {
  api.cache(true);
  const plugins = [];

  try {
    require.resolve("react-native-reanimated/plugin");
    plugins.push("react-native-reanimated/plugin");
  } catch (error) {
    // Reanimated is optional during migration until deps are fully aligned.
  }

  return {
    presets: ['babel-preset-expo'],
    plugins
  };
};
