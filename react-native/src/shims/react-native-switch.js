import React from "react";
import { Switch as RNSwitch, View } from "react-native";

function Switch(props) {
  const {
    value,
    onValueChange,
    disabled,
    backgroundActive,
    backgroundInactive,
    circleActiveColor,
    circleInActiveColor,
    style,
    ...rest
  } = props;

  return (
    <View style={style}>
      <RNSwitch
        value={!!value}
        onValueChange={onValueChange}
        disabled={!!disabled}
        trackColor={{
          false: backgroundInactive || "#bdbdbd",
          true: backgroundActive || "#34c759"
        }}
        thumbColor={value ? circleActiveColor || "#ffffff" : circleInActiveColor || "#ffffff"}
        {...rest}
      />
    </View>
  );
}

export { Switch };
export default Switch;
