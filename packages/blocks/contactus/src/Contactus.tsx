import React from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  Modal,
  Platform,
  Image,
  Linking
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { RFPercentage as rf } from "react-native-responsive-fontsize";
import { Chat, EmailLogo, Open } from "./assets";
import ContactusController, { Props } from "./ContactusController";
import { COLORS } from "../../../framework/src/Globals";
import ProfileButttonComponent from "../../../mobile/src/component/ProfileButtonComponent";
import { BackBtn } from "../../user-profile-basic/src/assets";
import { WebView } from 'react-native-webview';
import { FONTS } from "../../../framework/src/Fonts";
import BottemButton from "../../../mobile/src/component/BottemButtonComponent";
import { colors } from "react-native-elements";
import Context from "../../../components/src/context/context";

import Loader from "../../../components/src/Loader";
import { withTranslation } from "react-i18next";

class Contactus extends ContactusController {
  constructor(props: Props) {
    super(props);
  }

  static contextType = Context;
  render() {
    const {t}:any = this.props;
    console.log('constact us dataa ',JSON.stringify(this.state.contactUsList?.page_link))
    let url  = this.state.contactUsList?.page_link

    const langaugeDatafromapi = this.context.langaugeData?.meta?.translations;
    return (
      <View style={{flex:1, backgroundColor:'white'}}>
      <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
        <View style={styles.emailIcon}>
          <Image source={EmailLogo} style={styles.emailLogo} />
          <Text style={styles.contactUs}>{t("ContactUsText")}</Text>
          <Text style={styles.subtxt}>{ t("LeaveYourFeedBack")}
          </Text>
          <View style={styles.seprateline} />
          <Text style={styles.commonlyTxt}>
            { t("ForCommonlyAskedQuestions")}
          </Text>
          <View style={{ marginTop: hp(3) }} >
            <ProfileButttonComponent 
              onPress={() => this.props.navigation.navigate('WebviewComponent', {
                Data: {
                  page: "View knowledge base",
                  url: this.state.contactUsUrl?.page_link
                }
              })}
              buttonName={ t("ViewKnowledgeBase")} 
              btnIcon={Open} borderTouchableBtn={true} 
              tintcolor={COLORS.grey} 
              shaddow={true}
              />
            </View>
            <View style={styles.seprateline} />
          <Text style={styles.commonlyTxt}>{t("AlternativelyIfYouPrefer")}</Text>
          <View style={{ marginTop: hp(3) }} >
          <ProfileButttonComponent onPress={() => this.props.navigation.navigate('WebviewComponent', {
            Data: {
              page: "Open chat",
              url: this.state.contactUsUrl?.chat_link
            }
          })}
          buttonName={ t("OpenChat")}
          btnIcon={Chat}
           borderTouchableBtn={true} 
           tintcolor={COLORS.grey}
           shaddow={true} />
            </View>
          </View>
        </ScrollView>
        <BottemButton leftOnPress={() => this.props.navigation.goBack()} back={true} />
        {/* <Loader loading={this.state.isLoading} />  */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff"
  },
  webContaner: {
    flex: 1,
    width: '100%',
    borderWidth: 1,
    position: 'absolute',
    height: hp('100%')
  },
  emailLogo: {
    height: hp(14),
    width: hp(14),
    tintColor: COLORS.lightRed
  },
  emailIcon: {
    marginTop: hp(6),
    alignItems: 'center'
  },
  contactUs: {
    fontSize: rf(3.7),
    marginTop: hp(2),
    fontFamily: FONTS.Explet_Bold
  },
  subtxt: {
    textAlign: 'center',
    fontSize: rf(2.1),
    color: COLORS.grey,
    lineHeight: hp(2.4),
    marginTop: hp(1),
    fontFamily: FONTS.Roboto_Regular
  },
  seprateline: {
    borderWidth: hp(0.12),
    borderColor: COLORS.borderColor,
    opacity: 0.7,
    width: '90%',
    marginTop: hp(3)
    // textAlign: "left"
  },
  commonlyTxt: {
    marginTop: hp(3),
    fontSize: rf(1.8),
    marginHorizontal: wp(4),
    color: COLORS.grey,
    fontFamily: FONTS.Roboto_Regular
  },
});

export default withTranslation()(Contactus);