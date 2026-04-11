import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

//@ts-ignore

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue as rf } from "react-native-responsive-fontsize";
import TextField from "../../../mobile/src/component/TextField";
import ButtonComponent from "../../../mobile/src/component/ButtonComponent";
import Context from "../../../components/src/context/context";
import i18next from "i18next";
import Scale from "../../../components/src/Scale";
import LanguageOptionsModal from "../../LanguageOptions/src/LanguageOptionsModal";
import { connect } from 'react-redux';
import { addUserProfile, removeUserProfile } from "../../../mobile/src/store/actions/UserProfile";
import { addSubscription, removeSubscription,cancelSubscription, updateSubscription } from "../../../mobile/src/store/actions/Subscription";
// Customizable Area End

import EmailAccountLoginController, {
  configJSON,
  Props,
} from "./EmailAccountLoginController";
import { COLORS } from "../../../framework/src/Globals";
import {
  email,
  passward,
  imgPasswordInVisible,
  imgPasswordVisible,
  dropdownIcon
} from "./assets";
import { FONTS } from "../../../framework/src/Fonts";
import ToastMassge from "../../../mobile/src/component/ToastMassage";
import { withTranslation } from "react-i18next";

class EmailAccountLoginBlock extends EmailAccountLoginController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }
  static contextType = Context;
  render() {
    const { t }: any = this.props;
    const { languageDisplay} = this.context;
    return (
      // Required for all blocks
      <KeyboardAvoidingView
        behavior={this.isPlatformiOS() ? "padding" : undefined}
        style={styles.keyboardPadding}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imgContain}>
            <TouchableOpacity
              style={styles.languageBtn}
              onPress={() => {
                this.setState({ visible: true });
                this.displaylanguage();
              }}
            >
              <Text style={styles.languageText}><Image
                source={dropdownIcon}
                style={styles.dropdownIcon}
              />{this.state.language}</Text>
            </TouchableOpacity>
            <LanguageOptionsModal
              visible={this.state.visible}
              closeModal={() => this.setState({ visible: false })}
              languageState = {(states: any) => this.setState({language : states})}
            />
            <Image source={configJSON.appIcon} style={styles.appicon} />
          </View>
          {/* Required for all blocks */}
          <TouchableWithoutFeedback
            testID={"Background"}
            onPress={() => {
              this.hideKeyboard();
            }}
          >
            {/* Customizable Area Start */}
            {/* Merge Engine UI Engine Code */}
            <View style={styles.subContain}>
              {this.isPlatformWeb() ? (
                <Text style={styles.labelTitle}>{t("LogIn")}</Text>
              ) : null}
              <Text style={styles.titleWhySignUp}>{t("Login")}</Text>
              <TextField
                testID={"Email"}
                borderwidth={this.state.emailError !== "" ? hp(0.2) : 0}
                borderColor={
                  this.state.emailError !== "" ? COLORS.lightRed : null
                }
                placeHolderName={t("Email")}
                Image={email}
                Value={this.state.email}
                onChangeText={(text: string) =>
                  this.setState({ email: text.toLowerCase() })
                }
                label={this.state.email}
                textFieldColor={
                  this.state.emailError !== "" ? COLORS.lightRed : COLORS.black
                }
                labalColor={
                  this.state.emailError !== "" ? COLORS.lightRed : COLORS.grey
                }
                fWeight={this.state.email !== '' ? "400" : '0'}
              />
              {this.state.emailError !== "" && (
                <Text testID={"Incorrect Email"} style={styles.errorLabel}>
                  {i18next.t(this.state.emailError)}
                </Text>
              )}

              {/* </View> */}

              <View style={styles.passwordConatin}>
                <TextField
                  testID={"Passward"}
                  borderwidth={this.state.passwordError !== "" ? hp(0.2) : 0}
                  borderColor={
                    this.state.passwordError !== "" ? COLORS.lightRed : null
                  }
                  showButton={true}
                  placeHolderName={t("Password")}
                  Image={passward}
                  Value={this.state.password}
                  label={this.state.password}
                  onChangeText={(text: string) =>
                    this.setState({ password: text })
                  }
                  secureTextEntry={
                    this.state.secureEntry === true ? false : true
                  }
                  onPress={() =>
                    this.setState({ secureEntry: !this.state.secureEntry })
                  }
                  passwardImage={
                    this.state.secureEntry === true
                      ? imgPasswordInVisible
                      : imgPasswordVisible
                  }
                  textFieldColor={
                    this.state.passwordError !== "" ? COLORS.lightRed : COLORS.black
                  }
                  labalColor={
                    this.state.passwordError !== ""
                      ? COLORS.lightRed
                      : COLORS.grey
                  }
                  fWeight={this.state.password !== '' ? "400" : '0'}
                />
                {this.state.passwordError !== "" && (
                  <Text testID={"Incorrect Passward"} style={styles.errorLabel}>
                    {i18next.t(this.state.passwordError)}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("ForgotPassword")}
              >
                <Text
                  testID={"btnForgotPassword"} //Merge Engine::From BDS
                  style={styles.forgotPassword} //UI Engine::From Sketch
                >
                  {t("Forgotpassword")}?
                </Text>
              </TouchableOpacity>

              <View style={styles.buttonConatin}>
                <ButtonComponent
                  showLoader={this.state.showLoader}
                  BtnText={t("LOGIN")}
                  onpress={() => this.onLoginSubmit()}
                  testID={"Login"}
                />
              </View>

              <View style={styles.bottemView}>
                <Text style={styles.accountText}>
                  {t("DontHaveAnAccount")}?
                </Text>
                <TouchableOpacity
                  onPress={() =>{
                    this.props.navigation.navigate("EmailAccountRegistration");
                    this.displaylanguage(); 
                  }
                  }
                >
                  <Text style={styles.signUpText}> {t("Signup")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
          {this.state.error !== "" ? (
            <ToastMassge
              toastMassage={i18next.t(this.state.error, {
                defaultValue: this.state.error
              })}
              isSuccess={false}
            />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardPadding: { flex: 1 },
  subContain: {
    paddingHorizontal: wp(0.1),
  },
  imgContain: {
    flex: 0.5,
  },
  appicon: {
    height: hp(49),
    width: "100%",
    resizeMode: "stretch",
  },
  passwordConatin: {
    marginTop: hp(2.5),
  },
  buttonConatin: {
    marginTop: hp(2),
  },
  bottemView: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: hp(3),
  },
  signUpText: {
    color: COLORS.lightRed,
    paddingTop: hp(0.2),
    fontFamily: FONTS.Roboto_Bold,
    fontSize: rf(14),
  },
  accountText: {
    fontSize: rf(14),
    color: "grey",
    fontFamily: FONTS.Roboto_Regular,
  },
  titleWhySignUp: {
    marginTop: hp(2),
    fontSize: RFPercentage(4.5),
    fontFamily: FONTS.Explet_Bold,
    textAlign: "center",
    marginBottom: hp(2.5),
    lineHeight:hp(5)
  },
  titleOtpInfo: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
  },

  bgOtherLoginButton: {
    flexDirection: "row",
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "#00000000",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    includeFontPadding: true,
    padding: 10,
    color: "#6200EE",
    fontWeight: "bold",
  },

  bgMobileInput: {
    flexDirection: "row",
    fontSize: 16,
    textAlign: "left",
    backgroundColor: "#00000000",
    borderWidth: Platform.OS === "web" ? 0 : 1,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    includeFontPadding: true,
    padding: 10,
  },

  bgPasswordInput: {
    flex: 1,
    fontSize: 16,
    textAlign: "left",
    backgroundColor: "#00000000",
    minHeight: 40,
    includeFontPadding: true,
  },
  passwordShowHide: {
    alignSelf: "center",
  },

  bgPasswordContainer: {
    flexDirection: "row",
    backgroundColor: "#00000000",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    paddingLeft: 5,
    borderWidth: Platform.OS === "web" ? 0 : 1,
  },

  bgRectBorder: {
    borderWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    marginBottom: 10,
    padding: 10,
  },

  labelTitle: {
    marginTop: 24,
    marginBottom: 32,
    fontSize: 32,
    textAlign: "left",
    marginVertical: 8,
    color: "#6200EE",
  },
  imgPasswordShowhide: Platform.OS === "web" ? { height: 30, width: 30 } : {},

  forgotPassword: {
    color: COLORS.grey,
    alignSelf: "center",
    marginTop: hp(2),
    fontFamily: FONTS.Roboto_Regular,
    color: COLORS.grey,
    fontSize: rf(14),
    // zIndex: -1
  },
  checkBoxContainerView: {
    flexDirection: "row",
    marginBottom: 10,
    marginLeft: -7,
    zIndex: -1,
  },
  rememberMe: {
    color: "#6200EE",
    fontWeight: "bold",
    alignSelf: "center",
    zIndex: -1,
  },
  orLabel: {
    color: "#00000000",
    fontWeight: "bold",
    alignSelf: "center",
    margin: 20,
  },
  errorLabel: {
    alignSelf: "flex-end",
    marginRight: wp(4),
    color: COLORS.lightRed,
  },
  languageBtn: {
    width: Scale(120),
    height: Scale(40),
    borderRadius: Scale(12),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: Scale(1),
    backgroundColor: "white",
    borderColor: "lightgrey",
    margin: 5,
    position: "absolute",
    top: 45,
    right: 10,
    zIndex: 5,
  },
  languageText: {
    fontSize: Scale(16),
    fontWeight: "700",
  },
  dropdownIcon: {
    width: Scale(25),
    height: Scale(12),
    fontWeight: "900",
  },
});
const mapStateToProps = (state: any) => {
  const r = state?.rootReducer ?? {};
  return {
    userProfileState: r.userProfileReducer,
    subscriptionState: r.subscriptionReducer,
  };
};

const mapDispatchToProps = (dispatch : any) => {
  return {
    addUserProfile : (params:any) => {
      dispatch(addUserProfile(params))
    }, 
    removeUserProfile:()=>{
      dispatch(removeUserProfile())
    },
    cancelSubscription:()=>{
      dispatch(cancelSubscription())
    },
    addSubscription:(params:any)=>{
      dispatch(addSubscription(params))
    },
  }
};
// Customizable Area End
export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(EmailAccountLoginBlock));
