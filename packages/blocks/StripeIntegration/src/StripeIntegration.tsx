import React from "react";

import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Button,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  SafeAreaView,
  // Customizable Area Start
  // Customizable Area End
} from "react-native";


import { COLORS } from "../../../framework/src/Globals";
//import { PaymentCardTextField } from "tipsi-stripe";
import ButtonComponent from "../../../mobile/src/component/ButtonComponent";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import StripeIntegrationController, {
  Props,
  configJSON,
} from "./StripeIntegrationController";
import ToastMassage from "../../../mobile/src/component/ToastMassage";
import HeaderComponent from "../../../components/src/HeaderComponent";
import { AsynchStoragekey } from "../../../mobile/src/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Context from "../../../components/src/context/context";
import Scale from "../../../components/src/Scale";



export default class StripeIntegration extends StripeIntegrationController {
  paymentCardInput = React.createRef();
  static contextType = Context;
  constructor(props: Props) {
    super(props);
    this.paymentCardInput = React.createRef()
  }


  async componentWillMount() {
    // Asy
    console.log(await AsyncStorage.getItem(
      AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN
    ))

  }
  handleFieldParamsChange = (valid, params) => {

    console.log(params, 'my params')

    this.setState({ ...this.state, ...params })


  };

  // isPaymentCardTextFieldFocused = () => this.paymentCardInput.isFocused();

  // focusPaymentCardTextField = () => this.paymentCardInput.focus();

  // blurPaymentCardTextField = () => this.paymentCardInput.blur();
  // resetPaymentCardTextField = (ppp) => this?.paymentCardInput?.current?.setParams(ppp);
  // console.log(setParams, "inn stripe form");
  // Customizable Area Start
  // Customizable Area End

  render() {
    console.log(this.state, "integration state");
    return (
      <>
        {/* <SafeAreaView> */}
        <HeaderComponent
          onPress={() => this.props.navigation.navigate('Notifications')}
          count={this.state.notificationUnreadCount}
        />
        <KeyboardAvoidingView
          behavior={this.isPlatformiOS() ? "padding" : undefined}
          style={{
            height: "100%",
            width: "100%", backgroundColor: 'white'
          }}
        >

          <ScrollView
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            style={{
              height: "100%",
              width: "100%"
            }}
          >
            <View style={{ marginTop: -48, justifyContent: 'center' }}>

            </View>
            <TouchableWithoutFeedback
              // testID={"Background"}
              onPress={() => {
                console.log("preddedd")
                this.hideKeyboard();
              }}
            >

              <View >

                <View style={{ paddingTop: '30%', alignItems: 'center' }}>



                  {/* <PaymentCardTextField
                    style={styles.field}
                    numberPlaceholder="1234 1234 1234"
                    // ref={this.paymentCardInput}
                    // disabled={true}
                    number={this.state.number}
                    // cvc={this.state.cvc}
                    securityCode={this.state.cvc}
                    // onChange={(e)=>{console.log(e,"valkueuuue")}}
                    onParamsChange={this.handleFieldParamsChange} /> */}

                     <TextInput placeholder="4242424242424242" value={this.state.number}  keyboardType="number-pad"  onChangeText={(e)=>{console.log("9090909099----",e);this.setState({number:e})}} style={{borderStartColor:"black",paddingLeft:Scale(10),borderWidth:1,height:Scale(40),borderColor:'black',width:"90%",borderRadius:Scale(7)}}  />
                     <View style={{flexDirection:'row',justifyContent:'space-evenly',width:'90%',marginTop:Scale(10)}}>
                     <TextInput placeholder="exp month" value={this.state.expMonth}  keyboardType="number-pad"  onChangeText={(e)=>{console.log("9090909099----",e);this.setState({expMonth:e})}} style={{borderStartColor:"black",paddingLeft:Scale(10),borderWidth:1,height:Scale(40),borderColor:'black',width:"49%",borderRadius:Scale(7)}}  />
                     <TextInput placeholder="exp year"  value={this.state.expYear}  keyboardType="number-pad"  onChangeText={(e)=>{console.log("9090909099----",e);this.setState({expYear:e})}} style={{borderStartColor:"black",paddingLeft:Scale(10),borderWidth:1,height:Scale(40),borderColor:'black',width:"49%",borderRadius:Scale(7)}}  />
                     </View>
                     <TextInput placeholder="cvc" value={this.state.cvc}  keyboardType="number-pad"  onChangeText={(e)=>{console.log("9090909099----",e);this.setState({cvc:e})}} style={{borderStartColor:"black",paddingLeft:Scale(10),borderWidth:1,height:Scale(40),borderColor:'black',width:"90%",borderRadius:Scale(7),marginTop:Scale(10)}}  />



                  <View style={styles.btnView}>
                    <ButtonComponent
                      showLoader={this.state.isLoading}
                      BtnText={"ADD CARD"}

                      extraStyle={this.state.cvc.length < 3 ? styles.container : styles.disable}
                      onpress={() => {
                        if (this.state.cvc.length < 3) {
                          return;
                        }
                        //  this.setState({...this.state, number: "",
                        //  expMonth: "",
                        //  expYear: "",
                        //  cvc: ""})
                        console.log("inside button")
                        this.createTokenfromstripe();
                      }}
                    />
                  </View>

                </View>
              </View>


            </TouchableWithoutFeedback>

          </ScrollView>

        </KeyboardAvoidingView>
        {/* </SafeAreaView> */}

        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            alignSelf: "flex-start",
            alignItems: "center",
            justifyContent: "space-around",
            position: 'absolute',
            zIndex: 20,
            bottom: 50,
            left: 15
          }}
          onPress={() => {
            this.setState({
              number: "",
              expMonth: "",
              expYear: "",
              cvc: ""
            }); this.props.navigation.navigate('SubCriptionScreen')
          }}
        >
          <Image
            style={{
              width: 40,
              height: 10,
              transform: [{ rotate: "180deg" }],
            }}
            source={require("../assets/6b6b104cf16da1d46383af0a7bcfd6dc96eaddeb.png")}
          />
          <Text style={{ fontSize: hp("1.5%"), color: "grey" }}>Back</Text>
        </TouchableOpacity>


        {this.state.iserror ? (
          <ToastMassage toastMassage={this.state.error} isSuccess={false} />
        ) : null}


      </>



    );
  }
}

// Customizable Area Start

const styles = StyleSheet.create({
  field: {
    width: "90%",
    borderColor: "#000",
    color: "#449aeb",
    borderWidth: 1,
    borderRadius: 5,
  },
  Container: {

    alignItems: "center",
    justifyContent: "center",
    paddingVertical: '30%'
  },
  btnView: {
    marginTop: Platform.OS === "android" ? hp(2) : hp(2.5),
    width: "100%",
  },
  container: {
    height: hp(6.5),
    width: "92%",
    borderRadius: hp(1.3),
    justifyContent: "center",
    backgroundColor: "#E2DFD2",
    alignItems: "center",
    alignSelf: "center",
  },
  disable: {
    height: hp(6.5),
    width: "92%",
    borderRadius: hp(1.3),
    justifyContent: "center",
    backgroundColor: COLORS.lightRed,
    alignItems: "center",
    alignSelf: "center",
  },
});
