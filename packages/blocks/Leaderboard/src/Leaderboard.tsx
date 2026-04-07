import React from "react";

import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback,
  SectionList,
  // Customizable Area Start
  // Customizable Area End
} from "react-native";
import { RFValue as rf } from "react-native-responsive-fontsize";
import LeaderboardController, {
  Props,
  configJSON,
} from "./LeaderboardController";

import HeaderComponent from '../../../components/src/HeaderComponent';
import DaysScorList from '../Components/DaysScorLIst.tsx';
import ScoreList from '../Components/ScoreList'
import OverlayView from '../Components/OverlayView'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { COLORS } from "../../../framework/src/Globals";
import { FONTS } from "../../../framework/src/Fonts";
import Loader from "../../../components/src/Loader";
import ToastMassage from "../../../mobile/src/component/ToastMassage";
import NotificationModal from "../../../components/src/NotificationModal";
import Context from "../../../components/src/context/context";

import NoInternet from "../../Internet/src/Internet";
import { withTranslation } from "react-i18next";

class Leaderboard extends LeaderboardController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start

    // Customizable Area End
  }
  static contextType = Context;
  
  render() {
    const {t}:any = this.props;
    
    let data = [ { name: t("Daily") },{ name: t("Weekly") }, { name: t("AllTime") }]
console.log("leaderboarddddd",this.state)
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <HeaderComponent
            onPress={() =>
              this.setState({ notificationBt: true })
            }
            count={this.state.notificationUnreadCount}
          />
        </View>
        {
          this.state.isConnectionStatus ? (
            <>
              <View style={{ backgroundColor: 'white' }}>
                <DaysScorList data={this.state.leaderBoardData} />
                <View style={styles.subContainer}>
                  {data.map((item, index) => 
                  <TouchableOpacity style={{ borderBottomWidth: this.state.selectButton === index ? hp(0.5) : null, borderColor: COLORS.lightRed}} onPress={() => this.setState({ selectButton: index })}>
                    <Text style={styles.scrollView}>{item.name}</Text>
                  </TouchableOpacity>)}

                </View>
                <ScoreList
                  data={this.state.selectButton === 0 ? this.state.leaderBoardData?. daily : this.state.selectButton === 1? this.state.leaderBoardData?.weekly : this.state.leaderBoardData?.all_time
                  }
                />
              </View>

              {/* <OverlayView
          RewardPoint={this.props.navigation?.state?.params?.rewardPoint}
          overlay={this.state.overlay_bt}
          onPress={() => this.setState({ overlay_bt: !this.state.overlay_bt })}
          onRequestclose={() => this.setState({ overlay_bt: !this.state.overlay_bt })}
        /> */}
               {this.state.error != "" ? (
                <ToastMassage isSuccess={false} toastMassage={String(this.state.error)} />
              ) : null} 

            </>) : (
            <NoInternet />
          )
        }
        <Loader loading={this.state.showLoader} />
        {
            this.state.notificationBt == true && (
              <NotificationModal
                notificationBtn={this.state.notificationBt}
                CloseModal={() => {this.setState({ notificationBt: false });this.getDashboardDataaa()}}
                BackBtnCloseModal={() => this.setState({ notificationBt: false })}
                navigation={this.props.navigation} />
            )}
      </SafeAreaView>
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightRed
  },
  header: {
    justifyContent: 'center'
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '85%',
    alignSelf: 'center',
    marginTop: hp(2),
    borderBottomWidth: hp(0.1),
    borderColor: '#F0F0F2',
  },
  scrollView: {
    padding: hp(1.8),
    fontSize: rf(13),
    fontFamily: FONTS.Roboto_Medium,
    justifyContent:'space-evenly'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',

  },
  modalView: {
    backgroundColor: "white",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    height: hp('85%'),
    borderRadius: 20,
    justifyContent: 'center',
  },
});

export default withTranslation()(Leaderboard)
// Customizable Area End
