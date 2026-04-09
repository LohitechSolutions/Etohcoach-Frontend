import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue as rf } from "react-native-responsive-fontsize";
import { FONTS } from "../../../framework/src/Fonts";
import { COLORS } from "../../../framework/src/Globals";
import ButttonComponent from "../../../mobile/src/component/ButtonComponent";
import LandingController, { Props } from "./LandingController";
import ToastMassage from "../../../mobile/src/component/ToastMassage";
import Loader from "../../../components/src/Loader";
import LanguageOptionsModal from "../../LanguageOptions/src/LanguageOptionsModal";
import Context from "../../../components/src/context/context";
import {connect} from 'react-redux';
import {addUserProfile,removeUserProfile} from '../../../mobile/src/store/actions/UserProfile';
import Scale from "../../../components/src/Scale";
import { withTranslation } from "react-i18next";
import { addSubscription, removeSubscription,cancelSubscription, updateSubscription } from "../../../mobile/src/store/actions/Subscription";

class Landing extends LandingController {
  constructor(Props: Props) {
    super(Props);
    // Customizable Area Start
    // Customizable Area End
  }

  static contextType = Context;

  render() {
    const { t }: any = this.props;
    return (
      <View style={styles.container}>
        <Loader loading={this.state.showLoader} />
        <View>
          <TouchableOpacity
            style={styles.languageBtn}
            onPress={() => {
              this.setState({ visible: true });
              this.displaylanguage();
            }}
          >

            <View style={{flexDirection:'row',alignItems:'center'}}>
            <Image
              source={require("../assets/Vector.png")}
              style={styles.dropdownIcon}
            /> 
            <Text style={styles.languageText}>
{ this.state.language=="English 🇬🇧"?"English":"Français"}
</Text>
<Image  style={{height:18,width:18,marginLeft:4}} source={this.state.language=="English 🇬🇧"?require("../assets/English.png"):require("../assets/French.png")}  />
            </View>
          </TouchableOpacity>
          <LanguageOptionsModal
            visible={this.state.visible}
            closeModal={() => this.setState({ visible: false })}
            languageState = {(states: any) => this.setState({language : states})}
          />
          <Image
            source={require("../assets/appicon.png")}
            style={styles.appicon}
            resizeMode={"stretch"}
          />
        </View>
        <Text style={styles.learnText}>{t("Learn, Train, Remember")}</Text>
        <Text style={styles.subContainText}>{t("EtOH Coach is your partner to pass wines, beers and spirits certifications with success!")}</Text>
        <View style={styles.btnView}>
          <ButttonComponent
            BtnText={t("CREATE ACCOUNT")}
            onpress={() =>
              this.props.navigation.navigate("EmailAccountRegistration")
            }
          />
        </View>
        <View style={styles.seprateImgView}>
          <Image
            source = {this.state.language == "English 🇬🇧"? require("../assets/seprate.png") : require("../assets/seperateFrench.png")}
            style={styles.seprateLine}
          />
        </View>
        <View style={styles.socialLoginView}>
          <TouchableOpacity onPress={this.signIn}>
            <Image
              source={require("../assets/google.png")}
              style={styles.socialImg}
            />
          </TouchableOpacity>
          {Platform.OS === "ios" && (
            <TouchableOpacity onPress={() => this.onAppleButtonPress()}>
              <Image
                source={require("../assets/apple.png")}
                style={styles.socialImg}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.bottemView}>
          <Text style={styles.alredyLogin}>{t("Already have an account? ")}</Text>
          <TouchableOpacity
            onPress={() =>{
              this.props.navigation.navigate("EmailAccountLoginBlock");
              this.displaylanguage();
            }
            }
          >
            <Text style={styles.loginText}>{t("Login")}</Text>
          </TouchableOpacity>
        </View>
        {this.state.error !== "" ? (
          <ToastMassage
            isSuccess={false}
            toastMassage={this.state.error}
            containerStyle={{}}
          />
        ) : null}
      </View>
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  appicon: {
    height: hp(50),
    width: "100%",
  },
  seprateLine: {
    width: wp(80),
    height: hp(1.7),
  },
  learnText: {
    fontSize: rf(24),
    fontFamily: FONTS.Explet_SemiBold,
    textAlign: "center",
    marginTop: hp(3),
    marginHorizontal: wp(3),
  },
  subContainText: {
    textAlign: "center",
    marginTop: hp(1.8),
    color: COLORS.grey,
    fontSize: rf(14),
    fontFamily: FONTS.Roboto_Regular,
    lineHeight: hp(2.3),
    marginHorizontal: Scale(30),
  },
  btnView: {
    marginTop: Platform.OS === "android" ? hp(3) : hp(3.5),
  },
  seprateImgView: {
    alignItems: "center",
    marginTop: hp(3.5),
  },
  socialImg: {
    height: hp(6.5),
    width: hp(6.5),
    margin: hp(0.5),
  },
  socialLoginView: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: hp(2.5),
  },
  bottemView: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: hp(2),
  },
  loginText: {
    color: COLORS.lightRed,
    fontSize: rf(14),
    fontFamily: FONTS.Roboto_Bold,
  },
  alredyLogin: {
    fontFamily: FONTS.Roboto_Regular,
    fontSize: rf(14),
    color: COLORS.grey,
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
const mapDispatchToProps = (dispatch:any)=>{
  return{
    addUserProfile:(params:any)=>{
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
}

export default withTranslation()(connect(mapStateToProps,mapDispatchToProps)(Landing));
