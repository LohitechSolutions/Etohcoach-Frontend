import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  DeviceEventEmitter
} from "react-native";
import HeaderComponent from "../../../components/src/HeaderComponent";
import ProfileButttonComponent from "../../../mobile/src/component/ProfileButtonComponent"
import Context from "../../../components/src/context/context";
// Customizable Area End
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import UserProfileBasicController, {
  Props
} from "./UserProfileBasicController";
import { COLORS } from "../../../framework/src/Globals";
import { RFPercentage as rf } from "react-native-responsive-fontsize";
import { email, flag, Logout, Wallet,Restore, userAdmin, editIcon, tAndcIcon, Privacypolicy } from "./assets";
import ModalComponent from "../../../mobile/src/component/ModalComponent";
import { FONTS } from "../../../framework/src/Fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationModal from "../../../components/src/NotificationModal";
import Loader from "../../../components/src/Loader";

import NoInternet from "../../Internet/src/Internet";
import { withTranslation } from "react-i18next";
import { isConnected } from "../../../mobile/src/utils/internetConnection";
import { connect } from 'react-redux';
import { addUserProfile, removeUserProfile } from "../../../mobile/src/store/actions/UserProfile";
import { removeSubscription } from "../../../mobile/src/store/actions/Subscription";

class UserProfileBasicBlock extends UserProfileBasicController {

  static contextType = Context;
  priceapi: any
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    DeviceEventEmitter.addListener('profilechange', data => {
      this.setState({ firstName: data?.data?.first_name, lastName: data?.data?.last_name, userInfo: data?.data })
    })
    // Customizable Area End
  }

  shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<S>, nextContext: any): boolean {
    if (this.state !== nextState || this.props !== nextProps) {
      return true
    }
    return false
  }
  async componentWillMount() {

    this.priceapi = this.props.navigation.addListener("willFocus", () => {
      this.getPricingDetails();
    });

    dataLanguage = await AsyncStorage.getItem('@LanguageData');
    // console.log(dataLanguage,"languageDataHarshal");
  }
  async componentWillUnmount() {
    this.priceapi.remove()
  }

  render() {
    // Customizable Area Start
    const { navigation, t }: any = this.props;
    // console.log('user profile state',this.props.userProfileState)
    return (
      //Required for all blocks
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightRed }}>
        <View style={{ justifyContent: "center" }}>
          <HeaderComponent
            onPress={() => this.setState({ notificationBt: true })
            }
            count={this.state.notificationUnreadCount}
          />
        </View>
        {
          // this.state.isConnectionStatus ? (
            <View style={styles.container}>
              <View style={styles.container1}>
                <Image
                  style={styles.userImg}
                  source={userAdmin}
                  resizeMode={'contain'}
                />
                <Text style={styles.userName}>{`${ this.state.firstName} ${this.state.lastName}`}</Text>
                <View style={styles.btnView}>
                  <ProfileButttonComponent
                    buttonName={t("EditProfile")}
                    btnIcon={editIcon}
                    borderwidth={hp(0.1)}
                    textColor={COLORS.black}
                    tintcolor={COLORS.grey}
                    onPress={() => this.props.navigation.navigate("settings")}
                  />
                  <ProfileButttonComponent
                    buttonName={t("LanguageSettings")}
                    btnIcon={flag}
                    borderwidth={hp(0.1)}
                    textColor={COLORS.black}
                    tintcolor={COLORS.grey}
                    onPress={() =>
                      // this.state.isConnectionStatus?
                      this.props.navigation.navigate("LanguageOptions")
                      // :this.props.navigation.navigate('NoInternet',{showHeader:true,from:'language'})
                    }
                  />
                  <ProfileButttonComponent
                    buttonName={t("SubscriptionPlan")}
                    btnIcon={Wallet}
                    borderwidth={hp(0.1)}
                    textColor={COLORS.black}
                    tintcolor={COLORS.grey}
                    onPress={() => this.state.isConnectionStatus ? this.props.navigation.navigate("SubCriptionScreen",{isitfromSettings:true}):this.props.navigation.navigate('NoInternet',{showHeader:true,from:'subscription'})}
                  />
                    
                  <ProfileButttonComponent
                    buttonName={t("TermsandConditions")}
                    btnIcon={tAndcIcon}
                    borderwidth={hp(0.1)}
                    tintcolor={COLORS.grey}
                    textColor={COLORS.black}
                    onPress={() =>
                       this.state.isConnectionStatus?
                       this.props.navigation.navigate("TermsAndConditions",{TermsAndConditions:true})
                       :this.props.navigation.navigate('NoInternet',{showHeader:true,from:'contactus'})
                      
                      
                    }
                  />
                   <ProfileButttonComponent
                    buttonName={t("PrivacyPolicy")}
                    btnIcon={Privacypolicy}
                    borderwidth={hp(0.1)}
                    tintcolor={COLORS.grey}
                    textColor={COLORS.black}
                    isprivacy={true}
                    onPress={() =>this.state.isConnectionStatus?
                      this.props.navigation.navigate("TermsAndConditions",{TermsAndConditions:false})
                      :this.props.navigation.navigate('NoInternet',{showHeader:true,from:'contactus'})}
                  />
                  <ProfileButttonComponent
                    buttonName={t("ContactUsText")}
                    btnIcon={email}
                    textColor={COLORS.black}
                    tintcolor={COLORS.grey}
                    onPress={() => this.state.isConnectionStatus? this.props.navigation.navigate("Contactus"):this.props.navigation.navigate('NoInternet',{showHeader:true,from:'contactus'})}
                  />
                </View>
                <View style={{ width: "100%", marginTop: hp(3) }}>
                  <ProfileButttonComponent
                    buttonName={t("LogOut")}
                    btnIcon={Logout}
                    borderTouchableBtn={true}
                    textColor={COLORS.lightRed}
                    tintcolor={COLORS.lightRed}
                    onPress={() => this.setState({ isVisible: true })}
                  />
                </View>
                {this.state.isVisible ? (
                  <ModalComponent
                    visible={this.state.isVisible}
                    closeModal={() => this.setState({ isVisible: false })}
                    cancel={t("CANCEL")}
                    logout={t("LOGOUT")}
                    heding={t("LogOut")}
                    discription={
                      t("AreYouSureLogOut")
                    }
                    height={hp(35)}
                    confirmBtn={() => {
                      this.setState({ isVisible: false });
                      void this.sendAppTimeapicall();
                      void this.logout();
                    }}
                  />
                ) : null}
              </View>
            </View>
          // ) : (
          //   <NoInternet />
          // )
        }
        {
          this.state.notificationBt == true && (
            <NotificationModal
              notificationBtn={this.state.notificationBt}
              CloseModal={() => {this.setState({ notificationBt: false });this.getDashboardData()}}
              BackBtnCloseModal={() => this.setState({ notificationBt: false })}
              navigation={this.props.navigation} />
          )}
      </SafeAreaView>
    );
    // Customizable Area End
  }

  // Customizable Area Start
  // Customizable Area End

}
// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    // height: hp('78%'),
    justifyContent: 'center',
    backgroundColor: 'white',
    flex: 1
  },
  container1: {
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    // height: hp('78%'),
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  userImg: {
    width: wp('8.5%'),
    height: hp('4.5%'),

  },
  userName: {
    fontSize: rf(2.8),
    fontFamily: FONTS.Roboto_Bold,
    marginTop: hp(1.5)
  },
  btnView: {
    width: '100%',
    borderWidth: hp(0.1),
    borderRadius: 20,
    marginTop: hp(7),
    borderColor: COLORS.lightBlueGrey
  }
});

const mapStateToProps = (state : any) => {
  return {
    userProfileState: state.rootReducer.userProfileReducer,
    subscriptionState: state.rootReducer.subscriptionReducer,
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
    removeSubscription:()=>{
      dispatch(removeSubscription())
    }
  }
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(UserProfileBasicBlock));
// Customizable Area End