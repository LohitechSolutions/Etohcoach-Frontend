import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  Image,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
// Customizable Area End

import SplashscreenController, { Props } from "./SplashscreenController";

import { splashText, splashImage } from "./assets";
import { COLORS } from "../../../framework/src/Globals";
import SplashScreen from 'react-native-splash-screen'
import "../../LanguageOptions/src/component/i18n/i18n.config";
import AppUpdateScreen from "../../../components/src/AppUpdateScreen";

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
        <View style={styles.splashTextConatin}>
          <Image source={splashText} style={styles.splashTextImg} resizeMode={'stretch'} />
        </View>
        <View style={styles.splashImgConatin}>
          <Image source={splashImage} style={styles.splashImg} resizeMode={"stretch"} />
        </View>
        <AppUpdateScreen homefunction={this.goingHome}  type={this.state.appstatusNumber} visible={this.state.ModalVisible} link={this.state.link} />
      </View>
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  splashTextConatin: {
    flex: 0.23,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  splashImgConatin: {
    flex: 0.77,
  },
  splashTextImg: {
    height: hp(8),
    width: hp(35),
    tintColor: COLORS.lightRed
  },
  splashImg: {
    height: '100%',
    width: '100%',
  },
});
// Customizable Area End
