const React = require("react");
const { View } = require("react-native");

const LottieView = React.forwardRef(function LottieShim(props, ref) {
  return React.createElement(View, {
    ref,
    style: props.style,
    collapsable: true,
  });
});

module.exports = LottieView;
module.exports.default = LottieView;
