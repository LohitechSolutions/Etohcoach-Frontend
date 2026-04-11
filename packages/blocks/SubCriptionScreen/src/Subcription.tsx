import moment from "moment";
import React from "react";
import { withTranslation } from "react-i18next";
import {Image, ImageBackground, Modal, Platform,
  StyleSheet, Text,
  TouchableOpacity, TouchableWithoutFeedback, View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  heightPercentageToDP as hp, widthPercentageToDP as wp
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/FontAwesome";
import { NavigationActions, StackActions } from "react-navigation";
import Loader from "../../../components/src/Loader";
import Scale from "../../../components/src/Scale";
import Context from "../../../components/src/context/context";
import { FONTS } from "../../../framework/src/Fonts";
import { COLORS } from "../../../framework/src/Globals";
import BottemButton from "../../../mobile/src/component/BottemButtonComponent";
import ToastMassage from "../../../mobile/src/component/ToastMassage";
import { AsynchStoragekey } from "../../../mobile/src/utils";
import SubcriptionController, { Props } from "./SubcriptionController";
import { connect } from 'react-redux';
// import { addUserProfile, removeUserProfile } from "../../../mobile/src/store/actions/UserProfile";
import { addSubscription, removeSubscription,cancelSubscription, updateSubscription } from "../../../mobile/src/store/actions/Subscription";
import AsyncStorage from "@react-native-async-storage/async-storage";

class Subcription extends SubcriptionController {
  sub: any;
  mypricingdetail: any;

  static contextType = Context;

  constructor(Props: Props) {
    super(Props);
    // Customizable Area Start
    // Customizable Area End
  }
  async componentWillMount() {
    // this.justmountedFunction();
    this.sub = this.props.navigation.addListener("didFocus", () => {
      this.iapConnection(false);
    });
    this.mypricingdetail = this.props.navigation.addListener(
      "willFocus",
      () => {
        this.iapConnection(false);
        this.setState({ isloading: true })
      }
    );
  }

  async componentWillUnmount() {
    this.sub.remove();
    this.mypricingdetail.remove();
    this.setState({ isloading: false })
  }

  renderCancelSubscriptioModal = () => {
    const {t}:any = this.props;
    return (
        <View>
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.state.isVisible}
            >
                <TouchableWithoutFeedback onPress={() => this.setState({ isVisible: false })}>
                    <View style={styles.modalConatiner}>
                        <View style={styles.innerModalConatin}>
                            <View style={styles.dragButton} />
                            <Image source={require("../assets/Subscription.png")} style={styles.courceImage} />
                            <Text style={styles.greatTextContain}>{ t("Cancelsubscription")}</Text>
                            <Text style={[styles.browseTextContain,{}]}>
                            {t("AreYouSureYouWantToCancelYourSubscription")}?
                            </Text>
                            <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
                            <TouchableOpacity style={[styles.buttonStyle,{width:'45%',backgroundColor:'#FFF',borderWidth:1,borderColor:'#ECF1F4'}]} onPress={() => this.setCancelModal()}>
                                <Text style={styles.cancelTxt}>{t("BACK")}</Text>
                            </TouchableOpacity>  
                            <TouchableOpacity style={[styles.buttonStyle,{width:'45%'}]} onPress={() => this.cancelSubs()}>
                                <Text style={styles.continueTxt}>{t("CANCEL")}</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    )
}

handleBackNavigation = async()=>{
  if (this.props.navigation?.state?.params?.isItfromlessonOrtheme) {
    this.props.navigation.goBack()
  }
  else if (this.props.navigation?.state?.params?.isitfromSettings) {
    this.props.navigation.navigate("UserProfileBasicBlock")
  }
  else {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: "Authenticated" }),
        ],
        key: null,
      })
    );
  }
}

  render() {
    const { t }: any = this.props;
    // console.log(';subscription info',this.state.subscription)
    let expiryDate =  AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_EXPIRY_DATE);
    return (
      <ImageBackground
        resizeMode="cover"
        style={{
          width: "100%",
          height: "65%",
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: COLORS.white
        }}
        source={this.state.subscribed? require("../assets/redwine.png"):require('../assets/redwine1.jpg')}
      >
       {this.state.subscribed?null: 
       <View
          style={{
            width: "90%",
            alignSelf: "center",
            alignItems: "flex-end",
            marginTop: 60,
          }}
        >
          <TouchableOpacity
            style={{
              width: hp("4%"),
              height: hp("4%"),
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              backgroundColor: "#0000004D",
            }}
            onPress={() => this.handleBackNavigation()}
          >
            <Text style={{ fontSize: hp("3%"), color: "white" }}>X</Text>
          </TouchableOpacity>
        </View>}
        {this.state.subscribed ?
          <View style={{
            width: "100%",
            alignContent: 'center',
            justifyContent: 'center',
            flex: 1,
            paddingHorizontal: "2%",
          }}>
            <Image
              resizeMode={"contain"}
              style={{ width: hp('25%'), height: hp('10%'), marginBottom: 5, alignSelf: 'center' }}
              source={require("../assets/a2fceb79e4fda1e2aaed65127c7dc7f1f68faec0.png")}
            />
  <View style={{marginTop:Scale(20)}}>
              <Text style={styles.subscriptionTitle}>{t("Subscription status")}</Text>
            </View>
            <View style={styles.subscriptionCard}>
              <View style={{ justifyContent: 'center' }}>
                <View style={styles.statusContainer}>
                  <Text style={styles.statusTextContainer}>{t("Active")}</Text>
                </View>

                <Text style={styles.subscriptionValueContainer}>{Platform.OS=='android'? this.state.subscription?.originalPriceAndroid??0:this.state.subscription?.localizedPrice??0}/{t("Month")}</Text>
                <View style={{flexDirection:"row",alignItems:"center",marginTop:Scale(10)}}>
                <Text style={[styles.subscriptionValueContainer, { color: '#777185', fontSize: RFValue(10),includeFontPadding:false }]}>{t("Next renewal")}</Text>
                <View style={styles.expiryContainer}>
                <Text style={[styles.subscriptionValueContainer, { fontSize: RFValue(10) ,includeFontPadding:false}]}>{expiryDate ?moment(expiryDate).format('MMM DD'):''}</Text>
                </View>
                </View>
                
              </View>
            </View>
            
          <View>
          <Text style={styles.subscriptionSubTitle}> {t("You can cancel your plan any time.")}</Text>
<TouchableOpacity style={{marginTop:Scale(10)}} onPress={()=>{this.setCancelModal()}}>
  <Text style={{fontFamily:FONTS.Roboto_Regular,color:'blue',textAlign:'center'}}>
    {t("CancelSubscription")}
  </Text>
</TouchableOpacity>
          </View>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => {
                // Catalogue lives on the authenticated root stack / main tabs; from NonAuth
                // stack a plain navigate("Catalogue") is not handled — use root navigator.
                const nav = this.props.navigation;
                const root = typeof nav.getParent === "function" ? nav.getParent() : undefined;
                if (root && typeof (root as { navigate?: (a: string, b?: object) => void }).navigate === "function") {
                  (root as { navigate: (a: string, b?: object) => void }).navigate("Authenticated", {
                    screen: "Catalogue"
                  });
                } else {
                  nav.navigate("Catalogue");
                }
              }}
            >
              <Text
                style={{
                  fontSize: hp("2%"),
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {t("GO TO CATALOGUE")}
              </Text>
            </TouchableOpacity>
          </View>
          : <View
            style={{
              width: "100%",
              // alignSelf: "center",
              alignContent: 'flex-end',
              justifyContent: 'flex-end',
              flex: 1,
              paddingHorizontal: "2%",
            }}
          >
            <Image
              resizeMode={"contain"}
              style={{ width: this.state.subscribed ? hp('25%') : hp("20%"), height: this.state.subscribed ? hp('10%') : hp("5%"), marginBottom: 5, alignSelf: this.state.subscribed ? 'center' : 'flex-start' }}
              source={require("../assets/a2fceb79e4fda1e2aaed65127c7dc7f1f68faec0.png")}
            />
            <Text
              style={{
                fontSize: hp("5%"),
                fontWeight: "600",
                fontFamily: FONTS.Explet_SemiBold,
              }}
            >
              {t("LearnTrain")}
            </Text>
            <Text
              style={{
                fontSize: hp("5%"),
                fontWeight: "600",
                fontFamily: FONTS.Explet_SemiBold,
              }}
            >
              {t("Remember")}
            </Text>
            <Text style={{ fontSize: hp("1.8%"), color: "#7A7586", marginTop: 7 }}>
              {t("EtoHCoachPartner")}
            </Text>
            <Text style={{ fontSize: hp("1.8%"), color: "#7A7586", marginTop: 1 }}>
              {t("BeersCertification")}
            </Text>
            <Text style={{ fontSize: hp("1.8%"), marginTop: 10, color: "#7A7586" }}>
              {t("ThanksToItsAdaptive")}
            </Text>
            <Text style={{ fontSize: hp("1.8%"), color: "#7A7586", marginTop: 1 }}>
              {t("SpeedWillIncreased")}
            </Text>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 12,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: hp("3%"),
                    height: hp("3%"),
                    backgroundColor: "#EAD8DC",
                    borderRadius: hp("0.6%"),
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    resizeMode="cover"
                    style={{
                      width: hp("2.3%"),
                      height: hp("2.3%"),
                      tintColor: COLORS.lightRed,
                    }}
                    source={require("../assets/e6066c453c43ee7202fad7d7346c3b552c647dfd.png")}
                  />
                </View>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: hp("2%"),
                    marginLeft: 10,
                    color: "#7A7586",
                    fontFamily: FONTS.Roboto_Regular
                  }}
                >
                  {t("UnlocksAllCourseThemes")}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 12,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: hp("3%"),
                    height: hp("3%"),
                    backgroundColor: "#EAD8DC",
                    borderRadius: hp("0.6%"),
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    resizeMode="cover"
                    style={{
                      width: hp("2.3%"),
                      height: hp("2.3%"),
                      tintColor: COLORS.lightRed,
                    }}
                    source={require("../assets/e6066c453c43ee7202fad7d7346c3b552c647dfd.png")}
                  />
                </View>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: hp("2%"),
                    marginLeft: 10,
                    color: "#7A7586",
                    lineHeight: hp(2),
                    fontFamily: FONTS.Roboto_Regular

                  }}
                >
                  {t("GetAccessToQuizzes")}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 12,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: hp("3%"),
                    height: hp("3%"),
                    backgroundColor: "#EAD8DC",
                    borderRadius: hp("0.6%"),
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    resizeMode="cover"
                    style={{
                      width: hp("2.3%"),
                      height: hp("2.3%"),
                      tintColor: COLORS.lightRed,
                    }}
                    source={require("../assets/e6066c453c43ee7202fad7d7346c3b552c647dfd.png")}
                  />
                </View>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: hp("2%"),
                    marginLeft: 10,
                    color: "#7A7586",
                    fontFamily: FONTS.Roboto_Regular
                  }}
                >{t("CancelAnytime")}
                </Text>
              </View>
            </View>
            <View>
            
                   <TouchableOpacity
                  style={{
                    width: "100%",
                    height: hp("7%"),
                    backgroundColor: COLORS.lightRed,
                    borderRadius: hp("2%"),
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 30,
                  }}
                  onPress={() => {
                    this.subscribe();
                  }}
                >

                 
                    <Text
                      style={{
                        fontSize: hp("2%"),
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {t("SUBSCRIBENOW")}
                    </Text>
                    <Text style={{ fontSize: hp("1.5%"), color: "#DD96A1" }}>
                      {`${t("ForA")} ${this.state.isloading?'-': Platform.OS=='android'? this.state.subscription?.subscriptionOfferDetails[0]?.pricingPhases?.pricingPhaseList[0]?.formattedPrice??0:this.state.subscription?.localizedPrice??0}/${t("Month")} `}
                    </Text>
                
                </TouchableOpacity>

            </View>



            <View
              style={[styles.bottomLinks, {width: this.state.language == 'English' ? '70%' : '85%'}]}
            >
              <TouchableOpacity onPress={() =>this.props.navigation.navigate("TermsAndConditions", { TermsAndConditions: true })}>
                <Text
                  style={{
                    fontSize:Platform.OS=="ios"?hp("1%"): hp("1.2%"),
                    fontWeight: "bold",
                    color: "#7A7586",
                  }}
                >
                  {t("Terms&Conditions")}
                </Text>
              </TouchableOpacity>

              <Icon name={'square'}
                size={2}
                color={COLORS.grey}
                style={{ marginHorizontal: wp(1) }}
              />
              <TouchableOpacity onPress={() =>this.props.navigation.navigate("TermsAndConditions", { TermsAndConditions: false })}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={{
                      fontSize:Platform.OS=="ios"?hp("1%"): hp("1.2%"),
                      fontWeight: "bold",
                      color: "#7A7586",
                    }}
                  >
                    {t("PrivacyPolicySpace")}
                  </Text>
                </View>
              </TouchableOpacity>

              <Icon name={'square'}
                size={2}
                color={COLORS.grey}
                style={{ marginHorizontal: wp(1) }}
              />
              <TouchableOpacity onPress={() =>this.restoreSubscription()}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={{
                      fontSize:Platform.OS=="ios"?hp("1%"): hp("1.2%"),
                      fontWeight: "bold",
                      color: "#7A7586",
                    }}
                  >
                    {t("Restore Purchase")}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

          </View>}

        {this.state.paymentError ? (
          <ToastMassage
            toastMassage={t("PaymentFailedPleaseTryAgain")}
            isSuccess={false}
          />
        ) : null}
        {this.state.subscribed?
        <BottemButton back={true}  leftOnPress={() => this.handleBackNavigation()} />:null}
      <Loader loading={this.state?.isLoading||this.state.isloading} />
        {this.renderCancelSubscriptioModal()}
      </ImageBackground>
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginRight: "auto",
    marginLeft: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    maxWidth: 650,
    backgroundColor: "#ffffffff",

  },
  title: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
  },
  body: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
  },
  bgPasswordContainer: {
    flexDirection: "row",
    backgroundColor: "#00000000",

    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    padding: 10,
    borderWidth: Platform.OS === "web" ? 0 : 1,
  },
  bgMobileInput: {
    flex: 1,
  },
  showHide: {
    alignSelf: "center",
  },
  imgShowhide: Platform.OS === "web" ? { height: 30, width: 30 } : {},
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  insde: {
    flex: 1,
  },
  modalView: {
    borderRadius: 10,
    borderBottomStartRadius: 0,
    borderBottomEndRadius: 0,

    marginTop: 70,
    backgroundColor: "white",
    paddingVertical: 30,
    paddingHorizontal: 20,
    shadowColor: "#000",
    alignItems: "center",
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: "55%",
    width: "100%",
  },
  subscriptionCard: {
    borderRadius: Scale(16),
    padding: Scale(16),
    paddingHorizontal:Scale(30),
    backgroundColor: '#FAFCFE',
    // borderWidth: 0.5,
    justifyContent: 'center',
    // alignContent:'center',
    // width:'70%',
    // height:Scale(120),
    // width:Scale(209),
    
    // flexGrow:1,
    // flexShrink:0,
    alignSelf:'center',
    alignItems: 'center',
    marginTop:hp('3%'),
    marginBottom:Scale(40)
  },
  statusContainer: { alignSelf: 'center', justifyContent: 'center', paddingVertical: Scale(6), paddingHorizontal: Scale(12), backgroundColor: 'rgba(115, 209, 159, 1)', borderRadius: Scale(8),marginBottom:Scale(8) },
  statusTextContainer: {
    fontFamily: FONTS.Roboto_Medium, color: '#FFFFFF', fontSize: RFValue(16), textAlign: 'center'
  },
  subscriptionValueContainer: {
    fontSize: RFValue(14), fontFamily: FONTS.Roboto_Medium, color: '#2B2B2B',textAlign:'center'
  },
  buttonStyle:{
    width: "90%",
    height: hp("7%"),
    backgroundColor: COLORS.lightRed,
    borderRadius: hp("2%"),
    alignItems: "center",
    alignSelf: 'center',
    justifyContent: "center",
    marginTop: 30,
  },
  modalConatiner: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#00000090",
  },

  innerModalConatin: {
    height: Scale(460),
    borderRadius: Scale(12),
    backgroundColor: "#FFF",
    justifyContent: "space-around",
  },

  dragButton: {
    width: Scale(60),
    height: Scale(6),
    borderRadius: Scale(12),
    backgroundColor: "lightgrey",
    alignSelf: "center",
    marginTop: Scale(5),
  },

  drageButtonFQM: {
    width: Scale(60),
    height: Scale(6),
    borderRadius: Scale(12),
    backgroundColor: "lightgrey",
    alignSelf: "center",
  },
  courceImage: {
    alignSelf: "center",
    height: Scale(110),
    width: Scale(110),
    tintColor: COLORS.lightRed
  },

  greatTextContain: {
    fontSize: Scale(28),
    fontWeight: "600",
    textAlign: "center",
    color:"#381D2A",
    alignSelf: "center",
    fontFamily: FONTS.Explet_Bold,
    lineHeight: Scale(30),
  },

  unenrollTxt: {
    fontWeight: "600",
    fontSize: Scale(28),
    alignSelf: "center",
    fontFamily: FONTS.Explet_Bold,
  },

  confirmTxtContain: {
    fontSize: Scale(14),
    fontWeight: "400",
    textAlign: "center",
    alignSelf: "center",
    color: COLORS.grey,
    lineHeight: Scale(20),
    bottom: Scale(24),
  },
  cancelButton: {
    width: Scale(170),
    height: Scale(56),
    borderRadius: Scale(12),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: Scale(1),
    borderColor: "lightgrey",
  },

  ContinueButton: {
    width: Scale(170),
    height: Scale(56),
    borderRadius: Scale(12),
    backgroundColor: COLORS.lightRed,
    alignItems: "center",
    justifyContent: "center",
  },

  continueTxt: {
    fontSize: Scale(16),
    fontWeight: "700",
    color: "#fff",
  },

  cancelTxt: {
    fontSize: Scale(16),
    fontWeight: "700",
  },
  buttonContain: {
    backgroundColor: COLORS.lightRed,
    height: Scale(60),
    width: Scale(360),
    borderRadius: Scale(14),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    bottom: Scale(20),
  },
  
  browseTextContain: {
    fontSize: Scale(16),
    width:'50%',
    color: COLORS.grey,
    textAlign: "center",
    alignSelf: "center",
    bottom: Scale(20),
    lineHeight: Scale(22),
  },
  subscriptionTitle:{
    fontFamily: FONTS.Explet_SemiBold, fontSize: RFValue(24), textAlign: 'center',color:'#381D2A' 
  },
  subscriptionSubTitle:{
    fontFamily: FONTS.Roboto_Regular,marginTop:Scale(8), fontSize: RFValue(14), textAlign: 'center', color: '#777185'
  },
  expiryContainer:{
    backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#ECF1F4',paddingHorizontal:hp(1),paddingVertical:Scale(2),borderRadius:Scale(4),elevation:2,display:"flex"
  },
  bottomLinks:{
    flexDirection: "row",
    justifyContent:"space-evenly",
    marginTop: 10,
    alignItems: 'center',
    alignSelf: "center",
    marginBottom: 20,
  }
});

const mapStateToProps = (state : any) => {
  return {
    subscriptionState:state.rootReducer.subscriptionReducer
  }
}

const mapDispatchToProps = (dispatch : any) => {
  return {
    cancelSubscription:()=>{
      dispatch(cancelSubscription())
    },
    addSubscription:(params:any)=>{
      dispatch(addSubscription(params))
    },
  }
};

export default withTranslation()(connect(mapStateToProps,mapDispatchToProps)(Subcription));
// Customizable Area End