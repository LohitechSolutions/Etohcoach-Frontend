import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Linking,
} from "react-native";
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
import { withTranslation } from "react-i18next";
import LanguageOptionsModal from "../../LanguageOptions/src/LanguageOptionsModal";
import { connect } from 'react-redux';
import { addUserProfile, removeUserProfile } from "../../../mobile/src/store/actions/UserProfile";
import { addSubscription, removeSubscription,cancelSubscription, updateSubscription } from "../../../mobile/src/store/actions/Subscription";
// Customizable Area End

import EmailAccountRegistrationController, {
  Props,
} from "./EmailAccountRegistrationController";
import { COLORS } from "../../../framework/src/Globals";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { appIcon, email, password, right, user, dropdownIcon,englishicon,frenchicon } from "./assets";
import ToastMassge from "../../../mobile/src/component/ToastMassage";
import { FONTS } from "../../../framework/src/Fonts";
import { STRINGS } from "../../../mobile/src/utils";
import { passward } from "../../email-account-login/src/assets";
// Customizable Area Start
// Customizable Area End

class EmailAccountRegistration extends EmailAccountRegistrationController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }
  static contextType = Context;

  render() {
    const { t }: any = this.props;
    const { languageDisplay } = this.context;
    console.log(this.state,"this.state")
    return (
      <KeyboardAvoidingView
        behavior={this.isPlatformiOS() ? "padding" : undefined}
        style={styles.keyboardPadding}
      >
        <ScrollView
          keyboardShouldPersistTaps="always"
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
                         <View style={{flexDirection:'row',alignItems:'center'}}>
            <Image source={dropdownIcon} style={styles.dropdownIcon} />
            <Text style={styles.languageText}>
{ this.state.language=="English 🇬🇧"?"English":"Français"}
</Text>
<Image  style={{height:18,width:18,marginLeft:4}} source={this.state.language=="English 🇬🇧"?englishicon:frenchicon}  />
            </View>
            </TouchableOpacity>
            <LanguageOptionsModal
              visible={this.state.visible}
              closeModal={() => this.setState({ visible: false })}
              languageState={(states: any) =>
                this.setState({ language: states })
              }
            />
            <Image source={appIcon} style={styles.appicon} />
          </View>
          <TouchableWithoutFeedback
            testID={"Background"}
            onPress={() => {
              this.hideKeyboard();
            }}
          >
            {/* Customizable Area Start */}
            <View>
              <View style={styles.headline}>
                {this.isPlatformWeb() ? (
                  <Text style={styles.signUpText} testID={"SignUp"}>
                    {t("Signup")}
                  </Text>
                ) : null}
                <Text style={styles.titleSignUp}>{t("Signup")}</Text>
              </View>
              <View style={styles.firstTxtFeild}>
                <TextField
                  testID={"FirstName"}
                  placeHolderName={t("FirstName")}
                  Image={user}
                  Value={this.state.firstName}
                  onChangeText={(text: string) =>
                    this.setState({ firstName: text })
                  }
                  label={this.state.firstName}
                  borderwidth={this.state.firstNameError !== "" ? hp(0.2) : 0}
                  borderColor={
                    this.state.firstNameError !== "" ? COLORS.lightRed : null
                  }
                  fWeight={this.state.firstName !== '' ? "400" : null}
                />
              </View>

              {this.state.firstNameError !== "" && (
                <Text testID={"FirstNameErrorLabel"} style={styles.errorLabel}>
                  {i18next.t(this.state.firstNameError)}
                </Text>
              )}

              <View style={styles.lastNameContain}>
                <TextField
                  testID={"LastName"}
                  placeHolderName={t("LastName")}
                  Image={user}
                  Value={this.state.lastName}
                  onChangeText={(text) => this.setState({ lastName: text })}
                  label={this.state.lastName}
                  borderwidth={this.state.lastNameError !== "" ? hp(0.2) : 0}
                  borderColor={
                    this.state.lastNameError !== "" ? COLORS.lightRed : null
                  }
                  fWeight={this.state.lastName !== '' ? "400" : null}
                />
                {this.state.lastNameError !== "" && (
                  <Text style={styles.errorLabel} testID={"LastNameErrorLabel"}>
                    {i18next.t(this.state.lastNameError)}
                  </Text>
                )}
              </View>

              <View style={styles.lastNameContain}>
                <TextField
                  testID={"Email"}
                  placeHolderName={t("Email")}
                  Image={email}
                  Value={this.state.email}
                  onChangeText={(text) =>
                    this.setState({ email: text.toLowerCase() })
                  }
                  label={this.state.email}
                  borderwidth={this.state.emailError !== "" ? hp(0.2) : 0}
                  borderColor={
                    this.state.emailError !== "" ? COLORS.lightRed : null
                  }
                  textFieldColor={
                    this.state.emailError !== "" ? COLORS.lightRed : COLORS.black
                  }
                  labalColor={
                    this.state.emailError !== "" ? COLORS.lightRed : null
                  }
                  fWeight={this.state.email !== '' ? "400" : null}
                />
                {this.state.emailError !== "" && (
                  <Text testID={"EmailErrorLabel"} style={styles.errorLabel}>
                    {i18next.t(this.state.emailError)}
                  </Text>
                )}
              </View>

              <View style={styles.lastNameContain}>
                <TextField
                  testID={"Passward"}
                  placeHolderName={t("Password")}
                  Image={password}
                  showButton={true}
                  borderwidth={this.state.passwordError !== "" ? hp(0.2) : 0}
                  borderColor={
                    this.state.passwordError !== "" && COLORS.lightRed
                  }
                  Value={this.state.password}
                  label={this.state.password}
                  onChangeText={(text) => this.setState({ password: text })}
                  secureTextEntry={
                    this.state.secreEntry === true ? false : true
                  }
                  onPress={() =>
                    this.setState({ secreEntry: !this.state.secreEntry })
                  }
                  passwardImage={
                    this.state.secreEntry === true
                      ? this.imgPasswordInVisible
                      : this.imgPasswordVisible
                  }
                  textFieldColor={
                    this.state.passwordError !== "" ? COLORS.lightRed : COLORS.black
                  }
                  labalColor={
                    this.state.passwordError !== "" ? COLORS.lightRed : null
                  }
                  fWeight={this.state.password !== '' ? "400" : null}
                />
                {this.state.passwordError !== "" && (
                  <Text testID={"Incorrect Passward"} style={styles.errorLabel}>
                    {i18next.t(this.state.passwordError)}
                  </Text>
                )}
              </View>

              <View style={styles.tandcContain}>
                <TouchableOpacity
                  style={[
                    styles.checkBox,
                    {
                      backgroundColor: this.state.select
                        ? COLORS.success
                        : COLORS.white,
                    },
                  ]}
                  onPress={() => this.setState({ select: !this.state.select })}
                >
                  <Image
                    source={right}
                    style={{
                      height: hp(2),
                      width: hp(2),
                      resizeMode: "contain",
                      tintColor: Colors.white,
                      display: this.state.select ? "flex" : "none",
                    }}
                  />
                </TouchableOpacity>
                <View style={styles.tandcTextConatin}>
                  <Text
                    testID={"read and agree desc"}
                    style={styles.readAndAgreeText}
                  >
                    {t("IReadAndAgreeToThe")}
                    <Text
                      testID={"terms & condtions"}
                      style={styles.highlightText}
                      onPress={() => {
                        this.props.navigation.navigate("TermsAndConditions", {
                          TermsAndConditions: true,
                        });
                      }}
                    >
                      {t("Terms&&Conditions")}
                    </Text>
                    {t("AndThe")}
                    <Text
                      testID={"privacy Policy"}
                      style={styles.highlightText}
                      onPress={() => {
                        this.props.navigation.navigate("TermsAndConditions", {
                          TermsAndConditions: false,
                        });
                      }}
                    >
                      {t("PrivacyPolicySpace")}
                    </Text>
                  </Text>
                </View>
              </View>

              <View style={styles.btnView}>
                <ButtonComponent
                  showLoader={this.state.showLoader}
                  testID={"Create Account"}
                  BtnText={t("CREATEACCOUNT")}
                  onpress={() => this.submit()}
                />
              </View>

              <View style={styles.bottemView}>
                <Text style={styles.alredyLogin}>
                {t("Already have an account? ")}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("EmailAccountLoginBlock");
                    this.displaylanguage();
                  }}
                >
                  <Text testID={"Login"} style={styles.loginText}>
                    {t("Login")}
                  </Text>
                </TouchableOpacity>
              </View>
              {this.state.error != "" ? (
                <ToastMassge
                  toastMassage={i18next.t(this.state.error, {
                    defaultValue: this.state.error
                  })}
                  isSuccess={false}
                />
              ) : null}
            </View>
            {/* Customizable Area End */}
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // async componentDidMount() {
  //   // Customizable Area Start
  //   this.getValidations();
  //   // Customizable Area End
  // }
}

const styles = StyleSheet.create({
  // Customizable Area Start
  container: {
    flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    maxWidth: 650,
    backgroundColor: "#fff",
  },
  imgContain: {
    flex: 0.5,
  },
  appicon: {
    height: hp(28),
    width: "100%",
    resizeMode: "stretch",
  },
  titleSignUp: {
    fontSize: RFPercentage(4.3),
    fontFamily: FONTS.Explet_SemiBold,
    textAlign: "center",
    marginTop: hp(1),
   lineHeight:Scale(50)
  },
  lastNameContain: {
    marginTop: hp(2.5),
  },
  tandcContain: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingTop: hp(2),
    alignSelf: "center",
    marginLeft: hp(4),
  },
  checkBox: {
    height: hp(3),
    width: hp(3),
    borderWidth: hp(0.1),
    borderColor: COLORS.grey,
    borderRadius: hp(0.6),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  tandcTextConatin: {
    paddingLeft: hp(1.5),
  },
  readAndAgreeText: {
    color: COLORS.grey,
    fontSize: rf(13),
    fontFamily: FONTS.Roboto_Regular,
    lineHeight: hp(3),
    // letterSpacing: 0.1
  },
  highlightText: {
    color: COLORS.lightRed,
    fontSize: rf(13),
    fontFamily: FONTS.Roboto_Bold,
  },
  btnView: {
    marginTop: Platform.OS === "android" ? hp(2) : hp(2.5),
  },
  bottemView: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: hp(2.5),
    marginBottom: hp(1),
  },
  loginText: {
    color: "#c72944",
    fontSize: rf(14),
    fontFamily: FONTS.Roboto_Bold,
  },
  alredyLogin: {
    fontSize: rf(14),
    color: "grey",
    fontFamily: FONTS.Roboto_Regular,
  },
  titleOtpInfo: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
  },
  bgInput: {
    flexDirection: "row",
    fontSize: 16,
    textAlign: "left",
    backgroundColor: "#00000000",
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    includeFontPadding: true,
    padding: 10,
  },

  inputWeb: {
    flex: 1,
    flexDirection: "row",
    marginTop: 24,
    fontSize: 18,
    padding: 10,
    borderBottomColor: "#767676",
    includeFontPadding: true,
    borderBottomWidth: 1,
  },

  bgRectBorder: {
    borderWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    marginBottom: 10,
  },
  bgPasswordInput: {
    flex: 1,
    fontSize: 16,
    textAlign: "left",
    backgroundColor: "#00000000",
    minHeight: 40,
    includeFontPadding: true,
    marginTop: 10,
    paddingLeft: 0,
  },
  passwordShowHide: {
    alignSelf: "center",
  },
  bgPasswordContainer: {
    flexDirection: "row",
    backgroundColor: "#00000000",
    marginBottom: 16,
    borderWidth: Platform.OS === "web" ? 0 : 1,
    borderBottomWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    paddingLeft: 5,
    paddingRight: 5,
    zIndex: -1,
  },
  imgPasswordShowhide: Platform.OS === "web" ? { height: 30, width: 30 } : {},
  keyboardPadding: { flex: 1 },
  btnLegalTermsAndCondition: { color: "#6200EE" },
  btnLegalPrivacyPolicy: { color: "#6200EE", marginLeft: "auto" },
  leagalText: { marginTop: 10 },
  headline: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  signUpText: {
    fontSize: 32,
    color: "#6200EE",
    fontWeight: "bold",
  },
  errorLabel: {
    alignSelf: "flex-end",
    marginRight: wp(4),
    color: COLORS.lightRed,
  },
  firstTxtFeild: {
    marginTop: hp(2.5),
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
  // Customizable Area End
});
const mapStateToProps = (state : any) => {
  return {
    userProfileState: state.rootReducer.userProfileReducer,
    subscriptionState:state.rootReducer.subscriptionReducer
  }
}

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
export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(EmailAccountRegistration));
