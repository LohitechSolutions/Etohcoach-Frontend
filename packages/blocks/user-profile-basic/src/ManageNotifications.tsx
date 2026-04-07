import React, { Props } from "react";

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
import { back, email, emailImage, notificationImage } from "./assets";
import ModalComponent from "../../../mobile/src/component/ModalComponent";
import UserProfileBasicController from "./UserProfileBasicController";
import ToastMassge from "../../../mobile/src/component/ToastMassage";
import TextField from "../../../mobile/src/component/TextField";
import { FONTS } from "../../../framework/src/Fonts";
import BottemButton from "../../../mobile/src/component/BottemButtonComponent";
import { Switch } from 'react-native-switch';
import Context from "../../../components/src/context/context";

import Loader from "../../../components/src/Loader";
import ToastMassage from "../../../mobile/src/component/ToastMassage";
import { withTranslation } from "react-i18next";
import Scale from "../../../components/src/Scale";
import i18n from "../../../components/src/ClientGlobals";
// Customizable Area End

class ManageNotification extends UserProfileBasicController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }
  static contextType = Context;

  render() {
    const {t}:any = this.props;
    // let apiRes = this.props.navigation.state.params?.apiSucess

    return (
      /* Customizable Area Start */
      <SafeAreaView style={styles.container}>
        <View style={styles.imgConatiner}>
          <Image source={notificationImage} style={styles.userImage} />
        </View>
        <View style={styles.usernameContainer}>
          <Text style={styles.userTextContain}>{t("Notifications")}</Text>
        </View>
        <View style={styles.displayedContainer}>
          <Text style={styles.desplayTextContain}>
            {t("SelectHowYouWouldLikeToRecieveNotifications")}
          </Text>
        </View>
        <View  style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:Scale(15),marginTop:Scale(40)}}>

          <View>
          <Text style={styles.darkText}>{t("PushNotifications")}</Text> 
          </View>
          <Switch
            value={this.state.switchBtnPush}
            // onValueChange={(val) => this.handleSwitch(val, 'push')}
            onValueChange={(switchBtnPush) => this.setState({ 
              switchBtnPush: switchBtnPush,
              isSwitchWithout:true
            })}
            disabled={false}
            activeText={'On'}
            inActiveText={'Off'}
            circleSize={25}
            // barHeight={1}
            // circleBorderWidth={1}
            backgroundActive={COLORS.success}
            backgroundInactive={COLORS.lightGray}
            circleActiveColor={COLORS.white}
            circleInActiveColor={COLORS.white}
            // renderInsideCircle={() => <CustomComponent />} // custom component to render inside the Switch circle (Text, Image, etc.)
            changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
            innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
            outerCircleStyle={{}} // style for outer animated circle
            renderActiveText={false}
            renderInActiveText={false}
            switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
            switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
            switchWidthMultiplier={1.8} // multiplied by the `circleSize` prop to calculate total width of the Switch
            switchBorderRadius={30}
          />
          {/* <Text style={[styles.desplayTextContain, { ...styles.textStyle }]}>{t("PushNotifications")}</Text> */}
        </View>
        <View style={{marginBottom:Scale(60)}}>
          <Text  style={[styles.desplayTextContain, { ...styles.textStyle,textAlign:"left" }]}>
          {t("We will remind you of the progress of your courses")}
          </Text>
          <Text  style={[styles.desplayTextContain, { ...styles.textStyle ,textAlign:"left"}]} >
          {t("and the addition of new exams and quizes")}
          </Text>
        </View>
        <View  style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:Scale(15)}}>
          <View>
          <Text style={styles.darkText}>{t("EmailNotifications")}</Text>
          </View>
          <Switch
            value={this.state.switchBtnMail}
            // onValueChange={(val) => this.handleSwitch(val, 'mail')}
            onValueChange={(switchBtnMail) => this.setState({ 
              switchBtnMail:switchBtnMail,
              isSwitchWithout:true
            })}
            disabled={false}
            activeText={'On'}
            inActiveText={'Off'}
            circleSize={25}
            // barHeight={1}
            // circleBorderWidth={1}
            backgroundActive={COLORS.success}
            backgroundInactive={COLORS.lightGray}
            circleActiveColor={COLORS.white}
            circleInActiveColor={COLORS.white}
            // renderInsideCircle={() => <CustomComponent />} // custom component to render inside the Switch circle (Text, Image, etc.)
            changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
            innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
            outerCircleStyle={{}} // style for outer animated circle
            renderActiveText={false}
            renderInActiveText={false}
            switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
            switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
            switchWidthMultiplier={1.8} // multiplied by the `circleSize` prop to calculate total width of the Switch
            switchBorderRadius={30}
          />
          
        </View>
        <View>
            <Text style={[styles.desplayTextContain, { ...styles.textStyle,textAlign:"left" }]}>{t("For important announcements and changes only")}</Text>

        </View>
        {
          this.state.error != '' ? <ToastMassage isSuccess={false} toastMassage={this.state.error} /> : null
        }
        {
          this.state.success != '' ? <ToastMassage isSuccess={true} toastMassage={this.state.success} /> : null
        }
        <BottemButton 
          back={true} 
          leftOnPress={() => this.props.navigation.goBack()} 
          rightOnPress={() => this.submitSaveNotification(this.state.switchBtnPush, this.state.switchBtnMail)}  
          save={this.state.isSwitchWithout} 
        />
        <Loader loading={this.state.isnotificationloading} />
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
    fontSize: rf(12),
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
  pushNotificationContent: {
    display: "flex",
    flexDirection: "row",
    marginLeft: wp(10),
    paddingVertical: wp(8),
    // borderWidth:1,
    alignItems: "center"
  },
  emailNotificationContent: {
    paddingVertical: wp(0)
  },
  textStyle: {
    paddingLeft: wp(4)
  },
  darkText:{
    fontSize:Scale(18),fontFamily:FONTS.Roboto_Regular,fontWeight:'700',color:COLORS.black
  }
  // Customizable Area End
});
export default withTranslation()(ManageNotification);
