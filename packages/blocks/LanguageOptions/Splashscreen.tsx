import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  Text,
  Image,
  View,
  SafeAreaView,
  Platform
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
// Customizable Area End

import SplashscreenController, { Props } from "./SplashscreenController";

import { splashText, splashImage } from "./assets";

export default class Splashscreen extends SplashscreenController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  // Customizable Area End

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        {/* Customizable Area Start */}
        <View style={styles.splashTextConatin}>
          <Image source={splashText} style={styles.splashTextImg} resizeMode={ 'stretch'} />
        </View>
        <View style={styles.splashImgConatin}>
          <Image source={splashImage} style={styles.splashImg} resizeMode={ 'stretch'}/>
        </View>
        {/* Customizable Area End */}
      </SafeAreaView>
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  splashTextConatin: {
    flex: 0.3,
  },
  splashImgConatin: {
    flex: 0.7,
  },
  splashTextImg: {
    height: hp(8),
    width: hp(35),
    resizeMode: 'contain',
    marginTop: hp(5),
  },
  splashImg: {
    height: Platform.OS === 'ios' ? hp(68) : hp(70),
    width:Platform.OS === 'ios' ?  hp(58) : hp(70),
  },
});
// Customizable Area End
