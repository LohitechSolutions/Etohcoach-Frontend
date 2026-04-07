import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { RFValue as rf } from "react-native-responsive-fontsize";
import ButtonComponent from '../../../mobile/src/component/ButtonComponent';
import { resetPasswordScreen, rightPassword } from './assets';
import { COLORS } from "../../../framework/src/Globals";
import Context from "../../../components/src/context/context";

import { withTranslation } from "react-i18next";
// Customizable Area End

import { FONTS } from "../../../framework/src/Fonts";
import ForgotPasswordController, { Props } from "./ForgotPasswordController";
import { platform } from "os";
import Scale from "../../../components/src/Scale";

//Customizable Area Start
//Customizable Area End


class PasswordChanged extends ForgotPasswordController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }
  static contextType = Context;

  render() {
    const {t}:any = this.props;

    const langaugeDatafromapi = this.context.langaugeData?.meta?.translations;
    return (
    <SafeAreaView style={{flex:1,backgroundColor:'white'}}>
 
          <Image source={resetPasswordScreen} style={styles.forgotPasswordScreenImg} resizeMode={'stretch'} />
          <View style={styles.subInnerContainer}>
            <Text style={styles.ressetText} testID={'Reset Passward'}>{t("PasswordChanged")}</Text>
            <Text style={styles.descriptionPasswordText} testID={'Description'}>
            {t("YourPasswordChangedSuccesfully")}!
            </Text>
            <View style={styles.midImg}>
            <Image source={rightPassword} style={styles.rightimg}/>
            </View>     
    <View style={styles.btnBackConatiner}>
              <ButtonComponent BtnText={t("BACKTOLOGIN")} extraStyle={styles.innerBackContain} Style={styles.backText} testID={'BackToLogin'} onpress={() => this.props.navigation.navigate('EmailAccountLoginBlock')} />
            </View>
        </View>

      </SafeAreaView>


    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    width: Platform.OS === "web" ? "75%" : "100%",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 650,
    backgroundColor: "#fff"
  },
  subContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  forgotPasswordScreenImg: {
    height: hp(50),
    width: '100%',
  },
  subInnerContainer: {
    flex: 1,
    paddingHorizontal: wp(2),
    marginTop: hp(1)
  },
  ressetText: {
    fontFamily: FONTS.Explet_Bold,
    fontSize: rf(28),
    textAlign: 'center',
    marginTop: hp(3),
    lineHeight:hp(5)
  },
  descriptionPasswordText: {
    textAlign: 'center',
    marginTop: hp(1.8),
    color: COLORS.grey,
    fontSize: Platform.OS === 'ios' ? rf(12) : rf(14),
    fontFamily: FONTS.Roboto_Regular,
    marginHorizontal: Scale(15)
  },
  btnBackConatiner: {
    position: 'absolute',
    width: '100%',
    alignSelf: 'center',
    bottom: hp(2)
  },
  innerBackContain: {
    height: hp(6.5),
    width: '95%',
    borderRadius: hp(1.3),
    backgroundColor: COLORS.white,
    borderWidth: Platform.OS === 'android' ? wp(0.3) : wp(0.1),
    borderColor: COLORS.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  backText: {
    color: COLORS.black,
    fontWeight: 'bold',
    fontSize: rf(15)
  },
  rightimg: {
    height: hp(13),
    width: hp(13)
  },
  midImg: {
    alignItems: 'center',
    marginTop: hp(6)
  }
});

export default withTranslation()(PasswordChanged);
// Customizable Area End
