import React, { Component } from "react";
import { View, Image, Text, TouchableOpacity, Modal, StyleSheet, ImageBackground, Platform, TouchableWithoutFeedback } from "react-native";
import { RFValue as rf } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONTS } from "../../../framework/src/Fonts";
import { COLORS } from "../../../framework/src/Globals";
import ButttonComponent from "../../../mobile/src/component/ButtonComponent";
import Context from "../../../components/src/context/context";

import { withTranslation } from "react-i18next";

interface props {
  overlay: any,
  onPress: () => void;
}

interface props {

}

class overlayView extends Component<props>{
  constructor(props: props) {
    super(props)
    this.state = {

    }
  }
  static contextType = Context;
  render() {
    const {t}:any = this.props;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.overlay}
        onRequestClose={this.props.onRequestclose}
      >
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback onPress={this.props.onTapClose}>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}></View>
          </TouchableWithoutFeedback>
          <View style={styles.modalView}>
            <View style={styles.dragButtonStyle} />
            <Image style={styles.imgBackground} source={require('../assets/leaderBoardBg.png')} resizeMode={'contain'} />
            <View style={styles.totalView}>
              <Text style={styles.plusNum}>+ {this.props.RewardPoint}</Text>
              <Image style={styles.rewardImg}
                source={require('../assets/rewardpurple.png')}
              />
            </View>
            <View style={styles.titleView}>
              <Text style={styles.titleTxt}>{t("ThisYourEtoHCoachScore")}</Text>
              <Text style={styles.desc}>{t("CheckTheLeaderboardToKnowYourRanking")}!</Text>
              <View style={{ marginTop: hp(2.2), width: '100%' }}>
                <ButttonComponent BtnText={t("VIEWLEADERBOARD")} Style={styles.btnTxt} onpress={() => this.props.onPress()} />
              </View>
            </View>
          </View>
        </View>
        {/* </TouchableWithoutFeedback> */}
      </Modal>
    )
  }
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalView: {
    backgroundColor: "white",
    width: '100%',
    alignItems: "center",
    height: hp('85%'),
    borderTopLeftRadius: hp(3),
    borderTopRightRadius: hp(3)
    // borderRadius: hp(3),
  },
  imgBackground: {
    marginTop: hp(5.5),
    height: hp(53),
    width: hp(53)
  },
  subContainer: {
    backgroundColor: COLORS.trnsparentWhite,
    position: 'absolute',
    alignSelf: 'flex-end',
    width: '100%',
    height: hp('30%'),
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  totalView: {
    backgroundColor: COLORS.purple,
    height: hp(4.5),
    borderRadius: hp(1),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: hp(27),
    paddingHorizontal: hp(1)
  },
  plusNum: {
    fontSize: rf(18),
    color: 'white',
    fontFamily: FONTS.Roboto_Medium
  },
  rewardImg: {
    width: hp(3.5),
    height: hp(3.5),
    marginLeft: wp(1),
    tintColor: COLORS.white
  },
  titleView: {
    // alignItems:'center',
    width: '100%',
    marginTop: hp(2)
  },
  titleTxt: {
    fontSize: Platform.OS === 'android' ? rf(20) : rf(22),
    marginTop: hp(1),
    fontFamily: FONTS.Explet_Bold,
    alignSelf: 'center'
  },
  desc: {
    fontSize: rf(12),
    color: 'grey',
    marginTop: hp(0.7),
    fontFamily: FONTS.Roboto_Regular,
    alignSelf: 'center'
  },
  btnTxt: {
    color: 'white',
    fontSize: rf(15),
    fontFamily: FONTS.Roboto_Medium,
  },
  dragButtonStyle: {
    width: hp(7),
    height: hp(0.5),
    backgroundColor: '#ECF1F4',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: hp(2)
  },
})

export default withTranslation()(overlayView);