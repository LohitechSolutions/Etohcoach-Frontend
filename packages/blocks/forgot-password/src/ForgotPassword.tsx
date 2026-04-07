import React from "react";

//Customizable Area Start
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";

import ForgotPasswordController, { Props } from "./ForgotPasswordController";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue as rf } from "react-native-responsive-fontsize";
import TextField from "../../../mobile/src/component/TextField";
import ButtonComponent from "../../../mobile/src/component/ButtonComponent";
import { forgotPasswordScreenImg, email } from "./assets";
import { COLORS } from "../../../framework/src/Globals";
import { FONTS } from "../../../framework/src/Fonts";
import { STRINGS } from "../../../mobile/src/utils";
import ToastMassage from "../../../mobile/src/component/ToastMassage";
import Context from "../../../components/src/context/context";
import i18next from "i18next";
import { withTranslation } from "react-i18next";
//Customizable Area End

//Customizable Area Start
//Customizable Area End

class ForgotPassword extends ForgotPasswordController {
  constructor(props: Props) {
    super(props);
    //Customizable Area Start
    //Customizable Area End
  }
  static contextType = Context;

  render() {
    const {t}:any = this.props;

    const langaugeDatafromapi = this.context.langaugeData?.meta?.translations;
    const { navigation } = this.props;
    return (
      <KeyboardAvoidingView
        behavior={this.isPlatformiOS() ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          style={
            this.isPlatformWeb() ? styles.containerWeb : styles.containerMobile
          }
        >
          <TouchableWithoutFeedback onPress={() => this.hideKeyboard()}>
            {/* Customizable Area Start */}
            {/* <View> */}
            <View style={styles.subContainer}>
              <Image
                source={forgotPasswordScreenImg}
                style={styles.forgotPasswordScreenImg}
                resizeMode={"stretch"}
              />
              <View style={styles.subInnerContainer}>
                <Text style={styles.ressetText} testID={"Heder"}>
                {t("Resetpassword")}
                </Text>
                <Text
                  style={styles.descriptionEmailText}
                  testID={"description"}
                >
                  {/* Enter the email associated with your account and we'll{"\n"}send instructions to reset your password. */}
                  {t("EnterTheEmailToResetPassword")}
                </Text>
                <View style={[styles.textFieldConatiner,{marginTop: Platform.OS === "ios" ? hp(5) : this.state.language == "English" ? hp(3) : hp(1)} ]}>
                  <TextField
                    testID={"Email"}
                    borderwidth={this.state.emailError !== "" ? hp(0.2) : 0}
                    borderColor={
                      this.state.emailError !== "" ? COLORS.lightRed : COLORS.black
                    }
                    placeHolderName={t("Email")}
                    Image={email}
                    Value={this.state.email}
                    onChangeText={(text) => this.setState({ email: text.toLowerCase() })}
                    label={this.state.email}
                    textFieldColor={
                      this.state.emailError !== "" ? COLORS.lightRed : COLORS.black
                    }
                    labalColor={
                      this.state.emailError !== "" ? COLORS.lightRed : COLORS.black
                    }
                    fWeight={this.state.email !== '' ? "400" : null}
                  />
                  {this.state.emailError !== "" && (
                    <Text testID={"Incorrect Email"} style={styles.errorLabel}>
                      {i18next.t(this.state.emailError)}
                    </Text>
                  )}
                  {/* <TextField placeHolderName={"Email"} Image={email} extrastyle={styles.extrastyle}/> */}

                  {this.state.successMsg ? (
                    <Text style={styles.linkText} testID={"Link Sent"}>
                      {i18next.t(STRINGS.MESSAGE.EMAIL_SENT)}
                    </Text>
                  ) : null}
                </View>
                <ButtonComponent
                  testID={"Send Link"}
                  showLoader={this.state.showLoader}
                  BtnText={t("SENDLINK")}
                  Style={[styles.backText,{color: COLORS.white}]}
                  onpress={() => this.onForgotPasswardSubmit()}
                />
                <View style={styles.btnBackConatiner}>
                  <ButtonComponent
                    BtnText={t("BACKTOLOGIN")}
                    extraStyle={styles.innerBackContain}
                    Style={styles.backText}
                    testID={"BackToLogin"}
                    onpress={() => this.props.navigation.goBack()}
                  />
                </View>
              </View>
              {this.state.error != "" ? (
                <ToastMassage
                  isSuccess={false}
                  toastMassage={i18next.t(this.state.error)}
                />
              ) : null}
            </View>
            {/* <View style={styles.imgContainer}>
                <Image source={forgotPasswordScreenImg} style={styles.forgotPasswordScreenImg}/>
              </View> */}
            {/* headline */}
            {/* <View style={styles.headline}>
                <Text style={styles.titleText}>
                  {this.labelTextIsAccountRecovery} */}
            {/* ----------------------------------------------------CHOOSE ACCOUNT TEXT---------------------------------------------------------------------- */}
            {/* </Text> */}
            {/* {this.state.accountStatus === "ChooseAccountType" ? (
                  <Text style={styles.stepText}>{this.secondLabelText}</Text>
                ) : null} */}

            {/* ---------------------------------------------------------EMAIL TEXT-------------------------------------------------------------------------- */}

            {/* EnterEmail status */}
            {/* {this.state.accountStatus === "EnterEmail" ? (
                  <Text style={styles.stepText}>{this.thirdLabelText}</Text>
                ) : null} */}

            {/* EnterOTP status */}
            {/* {this.state.accountStatus === "EnterEmailOTP" ? (
                  <Text style={styles.stepText}>{this.forthLabelText}</Text>
                ) : null} */}
            {/* EnterOTP status */}
            {/* {this.state.accountStatus === "EnterEmailOTP" ? (
                  <Text style={styles.emailText}>{this.state.emailValue}</Text>
                ) : null} */}

            {/* ---------------------------------------------------------PHONE TEXT----------------------------------------------------------------------- */}

            {/* EnterEmail status */}
            {/* {this.state.accountStatus === "EnterPhone" ? (
                  <Text style={styles.stepText}>{this.fifthLabelText}</Text>
                ) : null} */}

            {/* EnterOTP status */}
            {/* {this.state.accountStatus === "EnterPhoneOTP" ? (
                  <Text style={styles.stepText}>{this.sixthLabelText}</Text>
                ) : null} */}
            {/* EnterOTP status */}
            {/* {this.state.accountStatus === "EnterPhoneOTP" ? (
                  <Text style={styles.emailText}>{this.state.phoneValue}</Text>
                ) : null}
              </View> */}

            {/* ---------------------------------------------------------ENTER EMAIL---------------------------------------------------------------------- */}

            {/* {this.state.accountStatus === "EnterEmail" ? (
                <Formik
                  initialValues={{ accountType: "email_account", email: "" }}
                  validationSchema={Yup.object().shape(this.state.emailSchema)}
                  validateOnMount={true}
                  validateOnChange={true}
                  onSubmit={(values, actions) => {
                    this.goToOtpAfterEmailValidation(values);
                    actions.setSubmitting(false);
                  }}
                >
                  {({
                    handleChange,
                    handleSubmit,
                    errors,
                    setFieldTouched,
                    touched
                  }) => (
                    <View>
                      <View
                        style={
                          this.isPlatformWeb()
                            ? styles.webInput
                            : styles.mobileInput
                        }
                      >
                        <Input
                          testID={"txtInputEmail"}
                          autoCompleteType={this.firstInputAutoCompleteType}
                          keyboardType={this.firstInputKeyboardStyle}
                          inputContainerStyle={
                            this.isPlatformWeb()
                              ? styles.webInput
                              : styles.noBorder
                          }
                          placeholder={this.firstInputPlaceholder}
                          onChangeText={handleChange("email")}
                          onBlur={() => setFieldTouched("email")}
                          errorStyle={{ color: this.firstInputErrorColor }}
                        />
                        {touched.email && errors.email ? (
                          <Text style={styles.errorStyle}>{errors.email}</Text>
                        ) : null}
                      </View>

                      <View style={{ zIndex: -1, padding: 15 }}>
                        <Button
                          testID={"btnGetOtpForEmailButton"}
                          title={this.buttonTextIsNext}
                          color={this.buttonColorForNextButton}
                          onPress={() => handleSubmit()}
                        />
                      </View>
                    </View>
                  )}
                </Formik>
              ) : null} */}
            {/* ---------------------------------------------------------ENTER PHONE #---------------------------------------------------------------------- */}

            {/* {this.state.accountStatus === "EnterPhone" ? (
                <Formik
                  initialValues={{ countryCode: "", phone: "" }}
                  validationSchema={Yup.object().shape(this.state.phoneSchema)}
                  validateOnMount={true}
                  validateOnChange={true}
                  onSubmit={(values, actions) => {
                    this.goToOtpAfterPhoneValidation(values);
                    actions.setSubmitting(false);
                  }}
                >
                  {({
                    handleChange,
                    handleSubmit,
                    errors,
                    setFieldTouched,
                    touched
                  }) => (
                    <View>
                      <View
                        style={
                          this.isPlatformWeb()
                            ? styles.bgRectWeb
                            : styles.bgRectBorder
                        }
                      >
                        <CountryCodeSelector
                          style={{}}
                          navigation={this.isPlatformWeb() ? null : navigation}
                          id={"CountryCodeSelector"}
                          placeHolder={this.countryCodeSelectorPlaceholder}
                          disable={false}
                          value={this.state.countryCodeSelected}
                        />
                      </View>

                      <View
                        style={
                          this.isPlatformWeb()
                            ? styles.webInput
                            : styles.mobileInput
                        }
                      >
                        <Input
                          testID={"txtInputPhoneNumber"}
                          autoCompleteType={this.secondInputAutoCompleteType}
                          keyboardType={this.secondInputKeyboardType}
                          inputContainerStyle={
                            this.isPlatformWeb()
                              ? styles.webInput
                              : styles.noBorder
                          }
                          placeholder={this.secondInputPlaceholder}
                          onChangeText={handleChange("phone")}
                          onBlur={() => setFieldTouched("phone")}
                          errorStyle={{ color: this.secondInputErrorColor }}
                        />
                        {this.isPlatformWeb() &&
                        touched.phone &&
                        errors.phone ? (
                          <Text style={styles.errorStyle}>{errors.phone}</Text>
                        ) : null}
                      </View>

                      <View style={{ zIndex: -1, padding: 15 }}>
                        <Button
                          testID={"btnOtpForPhoneNumberButton"}
                          title={this.buttonTextIsNext}
                          color={this.buttonColorForNextButton}
                          onPress={() => handleSubmit()}
                        />
                      </View>
                    </View>
                  )}
                </Formik>
              ) : null} */}
            {/* -------------------------------------------------------ENTER OTP-------------------------------------------------------------------- */}

            {/* {this.state.accountStatus === "EnterPhoneOTP" ||
              this.state.accountStatus === "EnterEmailOTP" ? ( */}
            {/* <Formik
                  initialValues={{ otpCode: "" }}
                  validationSchema={Yup.object().shape(this.state.otpSchema)}
                  validateOnMount={true}
                  validateOnChange={true}
                  onSubmit={(values, actions) => {
                    this.goToChangePasswordAfterOtp(values);
                    actions.setSubmitting(false);
                  }}
                >
                  {({
                    handleChange,
                    handleSubmit,
                    errors,
                    setFieldTouched,
                    touched
                  }) => (
                    <View>
                      <View
                        style={
                          this.isPlatformWeb()
                            ? styles.webInput
                            : styles.mobileInput
                        }
                      >
                        <Input
                          testID={"txtInputOtpCode"}
                          inputContainerStyle={
                            this.isPlatformWeb()
                              ? styles.webInput
                              : styles.noBorder
                          }
                          placeholder={this.thirdInputPlaceholder}
                          onChangeText={handleChange("otpCode")}
                          onBlur={() => setFieldTouched("otpCode")}
                          errorStyle={{ color: this.thirdInputErrorColor }}
                        />
                        {this.isPlatformWeb() &&
                        touched.otpCode &&
                        errors.otpCode ? (
                          <Text style={styles.errorStyle}>
                            {errors.otpCode}
                          </Text>
                        ) : null}
                      </View>

                      <View style={{ zIndex: -1, padding: 15 }}>
                        <Button
                          testID={"handleSubmitButtonForOtpCode"}
                          title={this.buttonTextIsNext}
                          color={this.buttonColorForNextButton}
                          onPress={() => handleSubmit()}
                        />
                      </View>
                    </View>
                  )}
                </Formik> */}
            {/* ) : null} */}
            {/* -----------------------------------------------------CHOOSE ACCOUNT----------------------------------------------------------------------- */}

            {/* {this.state.accountStatus === "ChooseAccountType" ? (
                <View style={{ zIndex: -1, padding: 15 }}>
                  <Button
                    testID={"startForgotPasswordButtonForForgotPasswordSMS"}
                    title={this.buttonTitleIsSMSPhoneAccount}
                    color={this.buttonColorForNextButton}
                    onPress={() => this.startForgotPassword("sms")}
                  />
                  <View style={{ zIndex: -1, padding: 15 }} />
                  <Button
                    testID={"startForgotPasswordButtonForForgotEmail"}
                    title={this.buttonTitleIsEmailAccount}
                    color={this.buttonColorForNextButton}
                    onPress={() => this.startForgotPassword("email")}
                  />
                </View>
              ) : null} */}
            {/* </View> */}
            {/* Customizable Area End */}
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  containerMobile: {
    flex: 1,
    // padding: 16,
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    maxWidth: 650,
    backgroundColor: "#fff",
  },
  subContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  forgotPasswordScreenImg: {
    height: hp(50),
    width: "100%",
  },
  subInnerContainer: {
    flex: 1,
    paddingHorizontal: wp(2),
  },
  ressetText: {
    fontSize: rf(30),
    textAlign: "center",
    marginTop: hp(3),
    fontFamily: FONTS.Explet_Bold,
  },
  descriptionEmailText: {
    textAlign: "center",
    marginTop: hp(1.8),
    color: COLORS.grey,
    fontSize: Platform.OS === "ios" ? rf(12.5) : rf(12),
    paddingHorizontal: wp(2),
    fontFamily: FONTS.Roboto_Regular,
  },
  textFieldConatiner: {
    marginBottom: hp(2),
  },
  errorLabel: {
    alignSelf: "flex-end",
    marginRight: wp(5),
    color: COLORS.lightRed,
  },
  extrastyle: {
    flexDirection: "row",
    height: hp(8),
    width: "95%",
    alignSelf: "center",
    backgroundColor: "#f0eff5",
    padding: hp(1.2),
    justifyContent: "space-between",
    borderRadius: hp(1.1),
    alignItems: "center",
  },
  linkText: {
    textAlign: "right",
    paddingRight: hp(1.5),
    color: COLORS.success,
    marginTop: hp(1),
    marginBottom: hp(1),
    fontSize: Platform.OS === "ios" ? rf(10) : rf(13),
  },
  btnSendConatiner: {
    marginTop: hp(1.8),
  },
  btnBackConatiner: {
    marginTop: Platform.OS === "ios" ? hp(1.8) : hp(1),
    marginBottom: Platform.OS === "ios" ? hp(1) : hp(4),
  },
  innerBackContain: {
    height: hp(6.5),
    width: "95%",
    borderRadius: hp(1.3),
    backgroundColor: COLORS.white,
    borderWidth: Platform.OS === "android" ? wp(0.3) : wp(0.1),
    borderColor: COLORS.borderColor,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  backText: {
    color: COLORS.black,
    fontSize: rf(14),
    fontFamily: FONTS.Roboto_Medium,
    fontWeight: '700'
  },
  containerWeb: {
    padding: 16,
    width: "50%",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 650,
  },
  countryCodeSelector: {
    flex: 3,
    marginTop: 20,
    textAlign: "left",
    textAlignVertical: "center",
  },
  button: {
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    zIndex: -1,
  },

  flexContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    width: "100%",
  },

  headline: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },

  webInput: {
    marginTop: 20,
    width: "100%",
    zIndex: -1,
  },

  inputAfterCountryCode: {
    width: "100%",
    zIndex: -1,
  },

  mobileInput: {
    flexDirection: "column",
    alignItems: "stretch",
    fontSize: 16,
    textAlign: "left",
    backgroundColor: "#00000000",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    includeFontPadding: true,
  },

  codeInput: {
    marginTop: 20,
    width: "30%",
  },

  phoneInput: {
    flex: 3,
    marginTop: 20,
  },

  noBorder: {
    borderBottomWidth: 0,
  },

  titleText: {
    fontSize: 32,
    color: "#6200EE",
    fontWeight: "bold",
  },

  stepText: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
  },

  emailText: {
    marginBottom: 16,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
    fontWeight: "bold",
  },

  bgRectBorder: {
    borderWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    marginTop: 20,
    minHeight: 40,
    fontSize: 18,
    textAlignVertical: "center",
    padding: 10,
  },

  bgRectWeb: {
    marginTop: 40,
  },

  errorStyle: {
    color: "red",
    textAlign: "center",
  },
});
export default withTranslation()(ForgotPassword);
