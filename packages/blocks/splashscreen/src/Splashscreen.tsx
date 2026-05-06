import React from "react";
// Customizable Area Start
import { StyleSheet, View } from "react-native";
// Customizable Area End

import SplashscreenController, { Props } from "./SplashscreenController";

import "../../LanguageOptions/src/component/i18n/i18n.config";
import AppUpdateScreen from "../../../components/src/AppUpdateScreen";

/** Matches react-native/app.json splash.backgroundColor — no extra PNG layer over Expo splash. */
const SPLASH_BG = "#1a1210";

export default class Splashscreen extends SplashscreenController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  render() {
    console.log("Splashscreen - render called, state:", this.state);
    return (
      <View style={styles.mainContainer}>
        <AppUpdateScreen homefunction={this.goingHome} type={this.state.appstatusNumber} visible={this.state.ModalVisible} link={this.state.link} />
      </View>
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: SPLASH_BG,
  },
});
// Customizable Area End
