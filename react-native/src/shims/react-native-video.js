const React = require("react");
const { View } = require("react-native");

const Video = React.forwardRef(function VideoShim(props, ref) {
  return React.createElement(View, {
    ref,
    style: props.style,
    collapsable: true,
  });
});

module.exports = Video;
module.exports.default = Video;
