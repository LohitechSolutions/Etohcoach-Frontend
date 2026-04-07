import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { RFValue as rf } from "react-native-responsive-fontsize";
import TextField from '../../../mobile/src/component/TextField';
import ButtonComponent from '../../../mobile/src/component/ButtonComponent';
import { resetPasswordScreen, password, imgPasswordInVisible, imgPasswordVisible } from './assets';
import { COLORS } from "../../../framework/src/Globals";
import Context from "../../../components/src/context/context";


import { withTranslation } from "react-i18next";
// Customizable Area End

import OTPInputAuthController, {
  Props
} from "../../otp-input-confirmation/src/OTPInputAuthController";
import ToastMassage from "../../../mobile/src/component/ToastMassage";
import { FONTS } from "../../../framework/src/Fonts";

//Customizable Area Start
//Customizable Area End


class ForgotPasswordOTP extends OTPInputAuthController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  static contextType = Context;

  render() { 
    const {t}:any = this.props;
    return (
      <KeyboardAvoidingView
        behavior={this.isPlatformiOS() ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.subContainer} showsVerticalScrollIndicator={false}>
          <Image source={resetPasswordScreen} style={styles.forgotPasswordScreenImg} resizeMode={'stretch'} />
          <View style={styles.subInnerContainer}>
            <Text style={styles.ressetText} testID={'Reset Passward'}>{t("Resetpassword")}</Text>
            <Text style={styles.descriptionPasswordText} testID={'Description'}>
            {t("YourNewPasswordMustBeDifferent")}
            </Text>
            <View style={styles.textFieldConatiner}>
              <TextField
                testID={'Passward'}
                borderwidth={this.state.passwordError === true ? hp(0.2) : 0}
                borderColor={this.state.passwordError === true ? COLORS.lightRed : null}
                showButton={true}
                placeHolderName={t("Newpassword")}
                Image={password}
                Value={this.state.password}
                label={this.state.password}
                onChangeText={(text: string) => this.setState({ password: text })}
                secureTextEntry={this.state.secreEntry === true ? false : true}
                onPress={() => this.setState({ secreEntry: !this.state.secreEntry })}
                passwardImage={this.state.secreEntry === true ? imgPasswordInVisible : imgPasswordVisible}
                textFieldColor={this.state.passwordError === true ? COLORS.lightRed : COLORS.black}
                labalColor={this.state.passwordError === true ? COLORS.lightRed : null}
                fWeight={this.state.password !== '' ? '400' : null}
              />
              {this.state.passwordError === true && <Text testID={'Inccorect Passward'} style={styles.errorLabel}> {t("PasswordFieldShouldNotBeBlank")}</Text>}

            </View>
            {!!this.state.changepasswordToast ?
              <ToastMassage bgcolor={COLORS.success} toastMassage={this.state.changepasswordToast} isSuccess={this.state.toast} />
              : null
            }
            {/* {this.state.changepasswordToast === "Success"? <View style={{ position: 'absolute', bottom: hp(10), width: '100%' , elevation: hp(10),zIndex:1000}}>
                    <ToastMassage bgcolor={COLORS.green} toastMassage={'Password changed successfully'} />
                </View> :<View style={{ position: 'absolute', bottom: hp(12), width: '100%',elevation: hp(10),zIndex:1000 }}>
                    <ToastMassage bgcolor={COLORS.lightRed} toastMassage={'Password not sucessfully'} />
                </View>} */}
            <ButtonComponent showLoader={this.state.showLoader} BtnText={this.resetPassward} onpress={() => this.onForgotPasswardSubmit()} testID={'ResetPassward'} />
            <View style={styles.btnBackConatiner}>
              <ButtonComponent BtnText={t("BACKTOLOGIN")} extraStyle={styles.innerBackContain} Style={styles.backText} testID={'BackToLogin'} onpress={() =>
                 this.props.navigation.pop(1)
               
                 } />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      // <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
      //   <TouchableWithoutFeedback
      //     onPress={() => {
      //       this.hideKeyboard();
      //     }}
      //   >
      //     {/* Customizable Area Start */}
      //     <View>
      //       <Text style={styles.titleWhySignUp}>{this.state.labelInfo}</Text>
      //       <TextInput
      //         testID="txtMobilePhoneOTP"
      //         style={
      //           Platform.OS === "web"
      //             ? styles.phoneInputWeb
      //             : styles.phoneInputMobile
      //         }
      //         placeholder={this.placeHolderOtp}
      //         onChangeText={text => this.setState({ otp: text })}
      //         keyboardType="numeric"
      //       />

      //       <Button
      //         testID="btnSubmitOTP"
      //         title={this.btnTxtSubmitOtp}
      //         color={this.submitButtonColor}
      //         onPress={() => this.submitOtp()}
      //       />
      //     </View>
      //     {/* Customizable Area End */}
      //   </TouchableWithoutFeedback>
      // </ScrollView>
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
    marginTop: hp(3)
  },
  descriptionPasswordText: {
    textAlign: 'center',
    marginTop: hp(1.8),
    color: COLORS.grey,
    fontSize: Platform.OS === 'ios' ? rf(14) : rf(14),
    fontFamily: FONTS.Roboto_Regular
  },
  textFieldConatiner: {
    marginTop: hp(3),
    marginBottom: hp(2),
  },
  errorLabel: {
    alignSelf: 'flex-end',
    marginRight: wp(4),
    color: COLORS.lightRed,
    fontSize: hp(2),
    fontFamily: FONTS.Roboto_Regular
  },
  extrastyle: {
    flexDirection: 'row',
    height: hp(8),
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#f0eff5',
    padding: hp(1.2),
    justifyContent: 'space-between',
    borderRadius: hp(1.1),
    alignItems: 'center'
  },
  linkText: {
    textAlign: 'right',
    paddingRight: hp(1.5),
    color: COLORS.success,
    fontSize: rf(10)
  },
  btnSendConatiner: {
    marginTop: hp(1.8),
  },
  btnBackConatiner: {
    marginTop: Platform.OS === 'ios' ? hp(2) : hp(1),
    marginBottom: Platform.OS === 'ios' ? hp(1) : hp(4),
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
  titleWhySignUp: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8
  },
  titleOtpInfo: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8
  },

  phoneInputMobile: {
    flexDirection: "row",
    fontSize: 16,
    textAlign: "left",
    backgroundColor: "#00000000",
    marginBottom: 64,
    borderWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    includeFontPadding: true,
    padding: 10
  },

  phoneInputWeb: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 64,
    fontSize: 18,
    padding: 10,
    borderBottomColor: "#767676",
    borderBottomWidth: 1
  },

  bgRectBorder: {
    borderWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    marginBottom: 10,
    padding: 10
  },
});

export default withTranslation()(ForgotPasswordOTP);
// Customizable Area End
