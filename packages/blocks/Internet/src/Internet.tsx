import React from 'react';

// Customizable Area Start
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS } from '../../../framework/src/Globals';

import { withTranslation } from "react-i18next";
import { RFValue as rf } from 'react-native-responsive-fontsize';
import HeaderComponent from '../../../components/src/HeaderComponent';
import NotificationModal from '../../../components/src/NotificationModal';
import Scale from '../../../components/src/Scale';
import { FONTS } from '../../../framework/src/Fonts';
import BottemButton from "../../../mobile/src/component/BottemButtonComponent";

// Customizable Area End

interface props {
  showHeader: boolean;
}
class NoInternet extends React.Component {

  constructor(props: any) {
    super(props)
    // Customizable Area Start
    this.state = {
      isConnected: false,
      notificationBt: false,

    };
    // Customizable Area End
  }
  // Customizable Area Start
  renderHeader = () => {
    return (
      <View>
        <HeaderComponent
          onPress={() => this.setState({ notificationBt: true })}
        />
      </View>
    )
  }

  renderNoInternet = () => {
    const { t }: any = this.props;
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: 'center' }}>
        <Image source={require('../assets/no-internet.png')} resizeMode={'stretch'} style={styles.internetImg} />
        <Text style={styles.offlineText}>{t("OhNoYoureOffline")}</Text>

        <Text style={{ fontSize: Scale(14), color: "#777185", fontWeight: "400", textAlign: "center", letterSpacing: Scale(0.4), lineHeight: Scale(16), marginTop: Scale(10) }}>
          {
          this.props?.navigation?.state.params?.from == 'subscription' || this.props?.navigation?.state.params?.from == 'contactus' ?
            t('You must be connected to internet to view this page') 
            :
            this.props?.navigation?.state.params?.from == 'editprofile' || this.props?.navigation?.state.params?.from == 'language' ?
              t('You must be connected to internet to edit your profile') 
              :
              t("YouMustBeConnectedToTheInternet")
              }
        </Text>
      </View>
    )
  }

  //You must be connected to internet to edit your profile
  // Customizable Area End
  render() {
    // Customizable Area Start
    return <SafeAreaView style={styles.offlineContainer}>
      {this.props.showHeader == true || this.props?.navigation?.state.params?.showHeader !== undefined ? this.renderHeader() : null}
      {this.renderNoInternet()}
      {this.props.showHeader || this.props?.navigation?.state.params?.showHeader !== undefined ? <BottemButton back={true} leftOnPress={() => this.props.navigation.goBack()} /> : null}
      {
        this.state.notificationBt == true && (
          <NotificationModal
            notificationBtn={this.state.notificationBt}
            CloseModal={() => { this.setState({ notificationBt: false }); }}
            BackBtnCloseModal={() => this.setState({ notificationBt: false })}
            navigation={this.props.navigation}
            getDashboardData={this.getDashboardData}
            mystring="aaaaaa"
          />
        )
      }
    </SafeAreaView>
  }
  // Customizable Area End
}



const styles = StyleSheet.create({
  // Customizable Area Start
  offlineContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  offlineText: {
    color: COLORS.black,
    fontSize: rf(20),
    marginTop: Scale(30),
    fontWeight: "700",
    fontFamily: FONTS.Roboto_Regular,
  },
  internetImg: {
    height: Scale(97),
    resizeMode: "cover",
    width: Scale(70),

  },
  button: {
    height: hp(6),
    width: '25%',
    borderRadius: hp(1),
    backgroundColor: COLORS.grey,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: hp(3)
  }
  // Customizable Area End
})



export default withTranslation()(NoInternet);
