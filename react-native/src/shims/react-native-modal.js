import React from "react";
import { Modal, TouchableWithoutFeedback, View } from "react-native";

export default function ReactNativeModal(props) {
  const {
    isVisible,
    visible,
    children,
    backdropOpacity,
    onBackdropPress,
    onBackButtonPress,
    style,
    ...rest
  } = props;

  const shown = typeof isVisible === "boolean" ? isVisible : !!visible;

  return (
    <Modal
      visible={shown}
      transparent
      animationType="fade"
      onRequestClose={onBackButtonPress || onBackdropPress}
      {...rest}
    >
      <TouchableWithoutFeedback onPress={onBackdropPress}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: `rgba(0,0,0,${typeof backdropOpacity === "number" ? backdropOpacity : 0.5})`
          }}
        >
          <TouchableWithoutFeedback>
            <View style={style}>{children}</View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
