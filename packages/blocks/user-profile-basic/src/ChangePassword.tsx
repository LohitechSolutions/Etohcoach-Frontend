import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue as rf } from "react-native-responsive-fontsize";
import TextField from "../../../mobile/src/component/TextField";
import { COLORS } from "../../../framework/src/Globals";
import {
  back,
  save,
  password,
  passwordImage,
  imgPasswordVisible,
  imgPasswordInVisible,
} from "./assets";
import UserProfileBasicController from "./UserProfileBasicController";
import ToastMassage from "../../../mobile/src/component/ToastMassage";
import Loader from "../../../components/src/Loader";
import { FONTS } from "../../../framework/src/Fonts";
import BottemButton from "../../../mobile/src/component/BottemButtonComponent";
import Context from "../../../components/src/context/context";

import { withTranslation } from "react-i18next";
// Customizable Area End

class ChangePassword extends UserProfileBasicController {
  constructor(props: Props) {
    super(props);
    // // Customizable Area Start
    // Customizable Area End
  }
  static contextType = Context;

  render() {
    const { t }: any = this.props;
    return (
      /* Customizable Area Start */
      <SafeAreaView style={styles.container} >
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
          >
            {/* <Loader loading={this.state.showLoader} /> */}
            <View style={styles.imgConatiner}>
              <Image source={passwordImage} style={styles.userImage} />
            </View>
            <View style={styles.usernameContainer}>
              <Text style={styles.userTextContain}>{t("ChangePassword")}</Text>
            </View>
            <View style={styles.displayedContainer}>
              <Text style={styles.desplayTextContain}>
                {t("EnterConfirmText")}
              </Text>
            </View>
            <View style={styles.firstNameContain}>
              <TextField
                testID={"Passward"}
                borderwidth={this.state.CurrentPasswordError !== "" ? hp(0.2) : 0}
                borderColor={
                  this.state.CurrentPasswordError !== "" ? COLORS.lightRed : COLORS.black
                }
                showButton={true}
                placeHolderName={t("CurrentPassword")}
                Image={password}
                Value={this.state.CurrentPassword}
                label={this.state.CurrentPassword}
                onChangeText={(text: string) =>
                  this.setState({ CurrentPassword: text })
                }
                secureTextEntry={this.state.secreEntry === true ? false : true}
                onPress={() =>
                  this.setState({ secreEntry: !this.state.secreEntry })
                }
                passwardImage={
                  this.state.secreEntry === true
                    ? imgPasswordInVisible
                    : imgPasswordVisible
                }
                textFieldColor={
                  this.state.CurrentPasswordError !== "" ? COLORS.lightRed :  COLORS.black
                }
                labalColor={
                  this.state.CurrentPasswordError !== "" ? COLORS.lightRed :  COLORS.black
                }
                fWeight={this.state.CurrentPassword !== '' ? "400" : null}
                editable={this.state.isConnectionStatus}
              />
              {this.state.CurrentPasswordError !== "" && (
                <Text testID={"Inccorect Passward"} style={styles.errorLabel}>
                  {this.state.CurrentPasswordError}
                </Text>
              )}
            </View>
            <View style={styles.lastNameContain}>
              <TextField
                testID={"Passward"}
                borderwidth={this.state.newPasswordError !== "" ? hp(0.2) : 0}
                borderColor={
                  this.state.newPasswordError !== "" ? COLORS.lightRed :  COLORS.black
                }
                showButton={true}
                placeHolderName={t("Newpassword")}
                Image={password}
                Value={this.state.newPassword}
                label={this.state.newPassword}
                onChangeText={(text: string) =>
                  this.setState({ newPassword: text })
                }
                secureTextEntry={this.state.newSecreEntry === true ? false : true}
                onPress={() =>
                  this.setState({ newSecreEntry: !this.state.newSecreEntry })
                }
                passwardImage={
                  this.state.newSecreEntry === true
                    ? imgPasswordInVisible
                    : imgPasswordVisible
                }
                textFieldColor={
                  this.state.newPasswordError !== "" ? COLORS.lightRed :  COLORS.black
                }
                labalColor={
                  this.state.newPasswordError !== "" ? COLORS.lightRed :  COLORS.black
                }
                fWeight={this.state.newPassword !== '' ? "400" : null}
                editable={this.state.isConnectionStatus}
              />
              {this.state.newPasswordError !== "" && (
                <Text testID={"Inccorect Passward"} style={styles.errorLabel}>
                  {this.state.newPasswordError}
                </Text>
              )}
            </View>

            <View style={styles.lastNameContain}>
              <TextField
                testID={"Passward"}
                borderwidth={this.state.confirmPasswordError !== "" ? hp(0.2) : 0}
                borderColor={
                  this.state.confirmPasswordError !== "" ? COLORS.lightRed :  COLORS.black
                }
                showButton={true}
                placeHolderName={t("ConfirmPassword")}
                Image={password}
                Value={this.state.ConfirmPassword}
                label={this.state.ConfirmPassword}
                onChangeText={(text: string) =>
                  this.setState({ ConfirmPassword: text })
                }
                secureTextEntry={
                  this.state.confirmSecureEntry === true ? false : true
                }
                onPress={() =>
                  this.setState({
                    confirmSecureEntry: !this.state.confirmSecureEntry,
                  })
                }
                passwardImage={
                  this.state.confirmSecureEntry === true
                    ? imgPasswordInVisible
                    : imgPasswordVisible
                }
                textFieldColor={
                  this.state.confirmPasswordError !== "" ? COLORS.lightRed :  COLORS.black
                }
                labalColor={
                  this.state.confirmPasswordError !== "" ? COLORS.lightRed :  COLORS.black
                }
                fWeight={this.state.ConfirmPassword !== '' ? "400" : null}
                editable={this.state.isConnectionStatus}
              />
              {this.state.confirmPasswordError !== "" && (
                <Text testID={"Inccorect Passward"} style={styles.errorLabel}>
                  {this.state.confirmPasswordError}
                </Text>
              )}
            </View>
            {this.state.error != "" ? (
              <ToastMassage isSuccess={false} toastMassage={this.state.error} />
            ) : null}
            {this.state.success != "" ? (
              <ToastMassage isSuccess={true} toastMassage={this.state.success} />
            ) : null}

            {/* <BottemButton leftOnPress={() => this.props.navigation.goBack()} rightOnPress={() => this.changePassword()} save={true} back={true} /> */}
          </KeyboardAvoidingView>
        </ScrollView>
        <BottemButton leftOnPress={() => this.props.navigation.goBack()} rightOnPress={() => this.changePassword()} save={true} back={true} />
      </SafeAreaView>
      /* Customizable Area End */
    );
  }
}

const styles = StyleSheet.create({
  // Customizable Area Start
  container: {
    flex: 1,
    // paddingHorizontal:hp(2),
    backgroundColor: 'white',
  },
  imgConatiner: {
    alignSelf: "center",
    marginTop: hp(2),
  },
  userImage: {
    height: hp(12),
    width: hp(12),
  },
  usernameContainer: {
    alignSelf: "center",
    paddingTop: hp(2),
  },
  displayedContainer: {
    // paddingTop: hp(1),
  },
  userTextContain: {
    fontSize: rf(25),
    // fontWeight: '600',
    textAlign: "center",
    fontFamily: FONTS.Explet_Bold,
    lineHeight:hp(5)
  },
  desplayTextContain: {
    fontSize: rf(13),
    color: COLORS.grey,
    textAlign: "center",
    fontFamily: FONTS.Roboto_Regular,
  },
  firstNameContain: {
    marginTop: hp(2),
  },
  errorLabel: {
    alignSelf: "flex-end",
    marginRight: wp(4),
    color: COLORS.lightRed,
    fontSize: hp(1.5)
  },
  lastNameContain: {
    marginTop: hp(2),
  },

  // Customizable Area End
});
export default withTranslation()(ChangePassword);
