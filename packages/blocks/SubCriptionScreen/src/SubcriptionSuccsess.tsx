import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
} from "react-native";
import { colors } from "react-native-elements";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import SubcriptionController, { Props } from "./SubcriptionController";
import { FONTS } from "../../../framework/src/Fonts";
import Context from "../../../components/src/context/context";
import { withTranslation } from "react-i18next";

//@ts-ignore
// import stripe from "tipsi-stripe";
import ToastMassage from "../../../mobile/src/component/ToastMassage";
import { COLORS } from "../../../framework/src/Globals";
import Loader from "../../../components/src/Loader";
// stripe.setOptions({
//   publishableKey:
//     "pk_test_51Lf04WSEuc3YcaSbBJop0WoeUCKQXmF0iMkA3bipZVnhiXB38jeFlLOLk1cwxGHRYwKiEhEBkaPXz3I9ryglfsAv00u2JlMDtu",

//   // publishableKey: 'pk_test_51Lf04WSEuc3YcaSbBJop0WoeUCKQXmF0iMkA3bipZVnhiXB38jeFlLOLk1cwxGHRYwKiEhEBkaPXz3I9ryglfsAv00u2JlMDtu',
//   merchantId: "MERCHANT_ID", // Optional
//   androidPayMode: "test", // Android only
// });

class SubcriptionSuccsess extends SubcriptionController {
  priceapi: any;
  static contextType = Context;
  constructor(Props: Props) {
    super(Props);
  }

  async componentWillMount() {
    this.getPricingDetails();
    this.priceapi = this.props.navigation.addListener("willFocus", () => {
      this.getPricingDetails();
      console.log( this.props.navigation?.state?.params,"back to props game")
     
    });
  }
  async componentWillUnmount() {
    this.priceapi.remove();
  }

  render() {
    const {t}:any = this.props;
    return (
      <>
        <ImageBackground
          resizeMode="cover"
          style={{
            width: "100%",
            height: "60%",
            flex: 1,
            alignItems: "center",
            justifyContent: "space-around",
            backgroundColor: "white",
            opacity: 0.9,
          }}
          source={require("../assets/redwine.png")}
        >
          <LinearGradient
            colors={[
              "transparent",
              "transparent",
              "transparent",
              "#FFFFFF",
              "white",
              "white",
            ]}
            style={{ height: "80%", width: "100%", position: "absolute" }}
          />

          <Image
            source={require("../assets/a2fceb79e4fda1e2aaed65127c7dc7f1f68faec0.png")}
            style={{ width: hp("30%"), height: hp("6%"), marginTop: hp("15%") }}
          />

          <View
            style={{
              backgroundColor: "#fff",
              width: wp("55%"),
              height: hp("16%"),
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#d9d9d9",
              alignItems: "center",
              justifyContent: "center",
              marginTop: hp(10),
            }}
          >
            {this.state.isSubscriptionScreenLoading ? (
              <View
                style={{
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingBottom: "30%",
                  paddingRight: "10%",
                }}
              >
                {/* <Loader loading={this.state.isSubscriptionScreenLoading} /> */}
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.success,
                    borderRadius: 9,
                    width: hp("10%"),
                    marginBottom: 5,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.Roboto_Bold,
                      color: "#ffffff",
                      marginLeft: 4,
                      marginRight: 4,
                      padding: 3,
                      fontSize: hp("1.8%"),
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {t("Active")}
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: hp("1.8%"),
                    textAlign: "center",
                    color: "#2B2B2B",
                  }}
                >
                  {`${this.state.priceingListapi_price}/${t("Month")}`}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 15,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.Roboto_Regular,
                      color: "#777185",
                      fontSize: hp("1.6%"),
                    }}
                  >
                    {t("NextRenewal")}
                  </Text>
                  <View
                    style={{
                      backgroundColor: "transparent",
                      borderRadius: 10,
                      overflow: "hidden",
                      paddingHorizontal: 5,
                      borderColor: "#d9d9d9",
                      borderWidth: 1,
                      paddingVertical: 1,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: FONTS.Roboto_Bold,
                        fontSize: hp("1.6%"),
                      }}
                    >
                      {this.state.courseExpiryMonthAndate}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>

          <View
            style={{ alignItems: "center", width: "90%", alignSelf: "center" }}
          >
            <Text
              style={{
                fontFamily: FONTS.Explet_SemiBold,
                fontSize: hp("3.2%"),
                color: "#381D2A",
                fontWeight: "600",
              }}
            >
             {t("SubscriptionStatus")}
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: hp("1.8%"),
                color: "grey",
                marginTop: 3,
              }}
            >
             {t("ManageYourSubscriptionPlan")}
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: hp("1.8%"),
                color: "grey",
              }}
            >
              {t("YouCanCancelYourPlanAnytime")}
            </Text>
            <TouchableOpacity
              onPress={() => {
                this.setState({ modalVisible: true });
              }}
              style={{
                backgroundColor: COLORS.lightRed,
                width: "100%",
                height: hp("7%"),
                marginTop: 30,
                borderRadius: 12,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.Roboto_Bold,
                  color: "#fff",
                  textAlign: "center",
                  fontSize: hp("2.1%"),
                }}
              >
                 {t("CANCELSUBSCRIPTION")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                alignSelf: "flex-start",
                marginTop: 45,
                alignItems: "center",
                justifyContent: "space-around",
              }}
              onPress={() =>
               {
                if(this.props.navigation?.state?.params?.isItfromlessonOrtheme)
                {
                  // this.props.navigation.pop(2)
                  // return
                  this.props.navigation.navigate("")
                }

                this.props.navigation.navigate("UserProfileBasicBlock")
              }
              }
            >
              <Image
                style={{
                  width: 40,
                  height: 10,
                  transform: [{ rotate: "180deg" }],
                }}
                source={require("../assets/6b6b104cf16da1d46383af0a7bcfd6dc96eaddeb.png")}
              />
              <Text style={{ fontSize: hp("1.5%"), color: "grey" }}>{t("Back")}</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              this.setState({ modalVisible: false });
            }}
            style={{ backgroundColor: "red", height: "50%", width: "100%" }}
          >
            <View style={styles.centeredView}>
              <TouchableWithoutFeedback
                onPress={() => {
                  return;
                }}
                style={{ backgroundColor: "red", height: "50%", width: "100%" }}
              >
                <View style={[styles.modalView]}>
                  <View
                    style={{
                      height: 5,
                      backgroundColor: "#ECF1F4",
                      width: "20%",
                      borderRadius: 5,
                    }}
                  />
                  <Image
                    source={require("../assets/Subscription.png")}
                    style={{
                      width: hp("13%"),
                      height: hp("13%"),
                      marginTop: "10%",
                      tintColor: COLORS.lightRed
                    }}
                  />
                  <Text
                    style={{
                      fontSize: hp("3.2%"),
                      color: "#000",
                      fontFamily: FONTS.Explet_SemiBold,
                      marginTop: "10%",
                    }}
                  >
                    {t("CancelSubscription")}
                  </Text>
                  <Text
                    style={{
                      fontSize: hp("2%"),
                      marginTop: 10,
                      fontFamily: FONTS.Roboto_Regular,
                      color: "#777185",
                    }}
                  >
                    {t("AreYouSureYouWantto")}
                  </Text>
                  <Text
                    style={{
                      fontSize: hp("2%"),
                      fontFamily: FONTS.Roboto_Regular,
                      color: "#777185",
                    }}
                  >
                    {t("CancelYourSubscription")}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                      marginTop: "13%",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        borderWidth: 0.5,
                        width: "47%",
                        height: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 15,
                        backgroundColor:
                          this.state.activeBt == "BACK" ? "white" : "white",
                        borderColor: "#ECF1F4",
                      }}
                      onPress={() =>
                      // this.setState({modalVisible:false})
                      {
                        this.setState({ activeBt: "BACK" });
                        setTimeout(() => {
                          this.setState({
                            modalVisible: false,
                            activeBt: "",
                          });
                        });
                      }
                      }
                    >
                      <Text
                        style={{
                          fontSize: hp("2%"),
                          fontFamily: FONTS.Roboto_Bold,
                          color:
                            this.state.activeBt == "BACK" ? "white" : "back",
                        }}
                      >
                        {t("BACK")}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={this.state.isCancelbuttonLoading}
                      style={{
                        backgroundColor:
                          this.state.activeBt == "CANCEL"
                            ? COLORS.lightRed
                            : COLORS.lightRed,
                        width: "47%",
                        height: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 15,
                      }}
                      onPress={() => {
                        this.setState({
                          ...this.state,
                          activeBt: "CANCEL",
                          isCancelbuttonLoading: true,
                        });

                        this.cancelSubscription();
                      }}
                    >
                      {this.state.isCancelbuttonLoading ? (
                        <ActivityIndicator
                          size={"small"}
                          color={COLORS.white}
                        />
                      ) : (
                        <Text
                          style={{
                            color: "#fff",
                            textAlign: "center",
                            fontSize: hp("2.0%"),
                            fontFamily: FONTS.Roboto_Bold,
                          }}
                        >
                          {t("CANCEL")}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {this.state.cancelSubscriptionError ? (
          <ToastMassage
            toastMassage={t("AnErroOccured")}
            isSuccess={false}
          />
        ) : null}
      </>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    borderRadius: 10,
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    padding: 20,
    paddingTop: 15,
    paddingBottom: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: "50%",
    width: "100%",
  },
});

export default withTranslation()(SubcriptionSuccsess)