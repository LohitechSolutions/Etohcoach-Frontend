import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue as rf } from "react-native-responsive-fontsize";
import ButtonComponent from "../../../mobile/src/component/ButtonComponent";
import { COLORS } from "../../../framework/src/Globals";
import { back, email, emailImage } from "./assets";
import ModalComponent from "../../../mobile/src/component/ModalComponent";
import UserProfileBasicController from "./UserProfileBasicController";
import ToastMassge from "../../../mobile/src/component/ToastMassage";
import TextField from "../../../mobile/src/component/TextField";
import { FONTS } from "../../../framework/src/Fonts";
import BottemButton from "../../../mobile/src/component/BottemButtonComponent";
import Context from "../../../components/src/context/context";

import { withTranslation } from "react-i18next";
import { connect } from 'react-redux';
import { addUserProfile, removeUserProfile } from "../../../mobile/src/store/actions/UserProfile";

// Customizable Area End

class ChangeEmail extends UserProfileBasicController {

  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }
  static contextType = Context;
  render() {
    const {t}:any = this.props;
    console.log('email info',this.state.email)
    return (
      /* Customizable Area Start */
      <SafeAreaView style={styles.container}>
        <View style={styles.imgConatiner}>
          <Image source={emailImage} style={styles.userImage} />
        </View>
        <View style={styles.usernameContainer}>
          <Text style={styles.userTextContain}>{t("ChangeEmail")}</Text>
        </View>
        <View style={styles.displayedContainer}>
          <Text style={styles.desplayTextContain}>
            {t("EnterTheNewEmailAddress")}
          </Text>
        </View>
        <View style={styles.firstNameContain}>
          <TextField
            testID={"Email"}
            borderwidth={this.state.emailError !== "" ? hp(0.2) : 0}
            borderColor={this.state.emailError !== "" ? COLORS.lightRed : COLORS.black}
            placeHolderName={t("CurrentEmail")}
            Image={email}
            Value={this.state.email}
            onChangeText={(text) => this.setState({ email: text })}
            label={this.state.email}
            textFieldColor={
              this.state.emailError !== "" ? COLORS.lightRed : COLORS.black
            }
            labalColor={this.state.emailError !== "" ? COLORS.lightRed : COLORS.black}
            fWeight={this.state?.email !== '' ? "400" : null}
            editable={false}
          />
          {this.state.emailError !== "" && (
            <Text testID={"Incorrect Email"} style={styles.errorLabel}>
              {this.state.emailError}
            </Text>
          )}
        </View>
        <View style={styles.firstNameContain}>
          <TextField
            testID={"Email"}
            borderwidth={this.state.newEmailError !== "" ? hp(0.2) : 0}
            borderColor={this.state.newEmailError !== "" ? COLORS.lightRed : null}
            placeHolderName={t("NewEmail")}
            Image={email}
            Value={this.state.NewEmail}
            onChangeText={(text) => this.setState({ NewEmail: text.toLowerCase() })}
            label={this.state.NewEmail}
            textFieldColor={
              this.state.newEmailError !== "" ? COLORS.lightRed : COLORS.black
            }
            labalColor={this.state.newEmailError !== "" ? COLORS.lightRed : COLORS.black}
            fWeight={this.state.NewEmail !== '' ? "400" : null}
            editable={this.state.isConnectionStatus}
          />
          {this.state.newEmailError !== "" && (
            <Text testID={"Incorrect Email"} style={styles.errorLabel}>
              {this.state.newEmailError}
            </Text>
          )}
        </View>
        <View style={styles.buttonConatin}>
          <ButtonComponent
            BtnText={t("CHANGEEMAIL")}
            testID={"Change email"}
            extraStyle={styles.button}
            onpress={() => {
              this.changeEmail();
            }}
          />
        </View>

        <ModalComponent
          visible={this.state.isVisible}
          closeModal={() => this.setState({ isVisible: !this.state.isVisible })}
          heding={t("VerificationLinkSent")}
          discription={
            t("WeSentALinkToConfirmEmail") }
          height={hp(55)}
          imageIcon={true}
          image={emailImage}
          tintcolor={COLORS.success}
          modalType="VER"
        />
        <ModalComponent
          visible={this.state.linkVerifyModal}
          closeModal={() => this.setState({linkVerifyModal:false})}
          heding={t("LinkVerified")}
          discription={
            this.state.emailApiText !== "" ? this.state.emailApiText : ''
          }
          height={hp(55)}
          imageIcon={true}
          image={emailImage}
          tintcolor={COLORS.success}
          modalType="VER"
        />

        {this.state.success != "" ? (
          <ToastMassge
            isSuccess={true}
            toastMassage={this.state.success}
          // containerStyle={{padding: hp(1), height: hp(5.8)}}
          />
        ) : null}

        {this.state.error != "" ? (
          <ToastMassge
            isSuccess={false}
            toastMassage={this.state.error}
          // containerStyle={{padding: hp(1), height: hp(5.8)}}
          />
        ) : null}
        <BottemButton back={true} leftOnPress={() => this.props.navigation.goBack()} />
      </SafeAreaView>
      /* Customizable Area End */
    );
  }
}

const styles = StyleSheet.create({
  // Customizable Area Start
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  imgConatiner: {
    alignSelf: "center",
    marginTop: hp(2),
  },
  userImage: {
    height: hp(12),
    width: hp(12),
    tintColor: COLORS.lightRed
  },
  usernameContainer: {
    alignSelf: "center",
    paddingTop: hp(2),
  },
  displayedContainer: {},
  userTextContain: {
    fontSize: rf(25),
    fontWeight: "600",
    textAlign: "center",
    fontFamily: FONTS.Explet_Bold,
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
  buttonConatin: {
    marginTop: hp(2),
  },
  errorLabel: {
    alignSelf: "flex-end",
    marginRight: wp(5),
    color: COLORS.lightRed,
  },
  button: {
    height: hp(6.5),
    width: "93%",
    borderRadius: hp(1.3),
    backgroundColor: COLORS.lightRed,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  // Customizable Area End
});


const mapStateToProps = (state : any) => {
  return {
    userProfileState: state.rootReducer.userProfileReducer,
  }
}

const mapDispatchToProps = (dispatch : any) => {
  return {
    addUserProfile : (params:any) => {
      dispatch(addUserProfile(params))
    }, 
   
   
    removeUserProfile:()=>{
      dispatch(removeUserProfile())
    }
  }
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ChangeEmail));
