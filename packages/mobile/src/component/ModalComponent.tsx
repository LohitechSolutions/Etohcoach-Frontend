//------- Import Statement -------//
import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Modal,
  Platform
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue as rf} from 'react-native-responsive-fontsize';
import {COLORS} from '../../../framework/src/Globals';
import ButttonComponent from './ButtonComponent';
import { FONTS } from '../../../framework/src/Fonts';
import { withTranslation } from "react-i18next";
import Scale from '../../../components/src/Scale';
//------- Constant Statement -------//
let showpassword = require('../assets/showpassward.png');
//------- Class Declaration -------//
class ModalComponent extends React.Component {
  //------- Class Constructor -------//
  constructor(props) {
    super(props);
    //------- States -------//
  }

  //------- Render -------//
  render() {
    const {t}:any = this.props;
    return (
      (
        <Modal
          animationType={'fade'}
          transparent={true}       
          visible={this.props.visible}>
          <View style={{flex: 1}}>
            <TouchableOpacity
              style={styles.modalConatiner}
              onPress={() => this.props.closeModal()}
            />
            <View
              style={[styles.innerModalConatin]}>
              <View style={styles.dragButtonStyle} />
              {this.props.imageIcon ? (
                <Image
                  source={
                     this.props.image
                  }
                  style={[
                    styles.courceImage,
                    {tintColor: this.props.tintcolor},
                  ]}
                />
              ) : null}
              <View
                style={{
                  height: 5,
                  width: 20,
                  alignSelf: 'center',
                  marginBottom: hp(1),
                }}
              />
              <View style={[styles.quizContainer]}>
                <Text style={styles.quizTextContain}>
                  {this.props.heding}
                  {/* Take quiz */}
                </Text>
              </View>
              <View style={styles.selectContainer}>
                <Text style={[styles.selectTextContain]}>
                  {this.props.discription}
                  {/* Select the quiz {'\n'} you would like to take */}
                </Text>
              </View>

              {this.props?.activeSubscription? <View style={styles.subscriptionBlock}>
                <View style={{flexDirection:"row",justifyContent:"center"}}>
                  <View style={{justifyContent:"center",width:"10%"}}>
        <Image  source={require('../../../blocks/user-profile-basic/assets/walletIcon.png')} style={{height:Scale(24),width:Scale(24), resizeMode:"contain"}}/>
                  </View>
                  <View style={{width:"85%"}}>
                    <Text style={{fontFamily:"Expletus Sans",fontWeight:"700"}}>{t("YOUR SUBSCRIPTION IS STILL ACTIVE")}</Text>
                    <Text style={{color:"rgba(119, 113, 133, 1)",fontFamily:"Roboto",fontWeight:"400",fontSize:Scale(12),lineHeight:16}}>{t("You still have an active subscription until ")} {this.props.subscriptionDate}. {t("Your subscription will not cancel automatically. You need to go to the App Store to cancel it.")}</Text>
                  </View>
                </View>
              </View>:null}
              {this.props.modalType !== 'VER' ? (
                <View style={styles.buttonConatiner}>
                  <ButttonComponent
                    BtnText={this.props.cancel}
                    testID={'back'}
                    extraStyle={styles.backButton}
                    Style={styles.backText}
                    onpress={() => this.props.closeModal()}
                  />
                  <ButttonComponent
                    BtnText={this.props.logout}
                    testID={'start'}
                    extraStyle={styles.startButton}
                    onpress={() => this.props.confirmBtn()}
                  />
                </View>
              ) : (
                <View style={styles.buttonContain}>
                  <ButttonComponent
                    BtnText={t("CONTINUE")}
                    testID={'Continue'}
                    onpress={() => this.props.closeModal()}
                  />
                </View>
              )}
            </View>
          </View>
        </Modal>
      )
    );
  }
}

const styles = StyleSheet.create({
  modalConatiner: {
    flex: 1
},
  innerModalConatin: {
    paddingHorizontal: hp(1),
    // height: hp(65),
    width: '100%',
    // borderRadius: hp(1.5),
    borderTopLeftRadius: hp(1.5),
    borderTopRightRadius: hp(1.5),
    backgroundColor: COLORS.white,
    paddingTop: hp(4),
    paddingBottom: hp(4),
  },
  courceImage: {
    alignSelf: 'center',
    height: hp(15),
    width: hp(15),
  },
  themeConatin: {
    marginTop: hp(4),
  },
  buttonConatiner: {
    flexDirection: 'row',
    paddingTop: hp(5),
    justifyContent: 'space-around',
    paddingHorizontal: hp(2),
  },
  buttonContain: {
    marginTop: hp(6),
  },
  backButton: {
    height: hp(6.5),
    width: '43%',
    borderWidth: wp(0.1),
    borderColor: COLORS.cancelBorder,
    borderRadius: hp(1.3),
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  backText: {
    color: COLORS.black,
    fontSize: rf(15),
    fontWeight: 'bold',
  },
  startButton: {
    height: hp(6.5),
    width: '50%',
    borderRadius: hp(1.3),
    backgroundColor: COLORS.lightRed,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  quizContainer: {
    alignSelf: 'center',
    paddingTop: hp(2),
    paddingHorizontal: hp(5),
    
  },
  selectContainer: {
    paddingTop: hp(1),
    paddingHorizontal: hp(1),
  },
  quizTextContain: {
    fontSize: rf(25),
    // fontWeight: '600',
    textAlign: 'center',
    fontFamily:FONTS.Explet_Bold,
    lineHeight:Scale(60),
  },
  selectTextContain: {
    fontSize: rf(14),
    color: COLORS.grey,
    textAlign: 'center',
    fontFamily:FONTS.Roboto_Regular
  },
  dragButtonStyle: {
    width: 48,
    height: 4,
    backgroundColor: '#ECF1F4',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: hp(2)
  },
  subscriptionBlock:{
    marginTop:Scale(20),
    borderRadius:12,
    padding:Scale(12),
    borderColor:"rgba(95, 104, 122, 0.25)",
    borderWidth:1,
    width:"100%"
  }
});

export default withTranslation()(ModalComponent);
