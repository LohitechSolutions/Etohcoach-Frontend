import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import { runEngine } from "../../../framework/src/RunEngine";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

export interface S {
  // Customizable Area Start
  otp: string;
  otpAuthToken: string;
  userAccountID: string;
  labelInfo: string;
  toMessage: string;
  isFromForgotPassword: boolean;
  password: string;
  passwordError: boolean;
  secreEntry: boolean;
  showLoader: boolean;
  changepasswordToast: string;
  toast: boolean;
  // Customizable Area End
}

export interface SS {
  // Customizable Area Start
  id: any;
  // Customizable Area End
}

export default class OTPInputAuthController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  otpAuthApiCallId: any;
  ForgotApiCallId: any;
  btnTxtSubmitOtp: string;
  placeHolderOtp: string;
  labelInfo: string;
  submitButtonColor: any = configJSON.submitButtonColor;
  placeholderIsPassword: string = configJSON.placeholderIsPassword;
  resetPassward: string = configJSON.resetPasswardButton;
  backToLogin: string = configJSON.backToLoginButton;
  // Customizable Area End

  constructor(props: Props) {
    super(props);

    this.receive = this.receive.bind(this);

    this.subScribedMessages = [
      // Customizable Area Start
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.ReciveUserCredentials)
      // Customizable Area End
    ];


    runEngine.attachBuildingBlock(this, this.subScribedMessages);

    // Customizable Area Start
    this.state = {
      otp: "",
      otpAuthToken: "",
      userAccountID: "",
      labelInfo: configJSON.labelInfo,
      toMessage: "",
      isFromForgotPassword: false,
      password: "",
      passwordError: false,
      secreEntry: false,
      showLoader: false,
      changepasswordToast: ""
    };

    this.btnTxtSubmitOtp = configJSON.btnTxtSubmitOtp;
    this.placeHolderOtp = configJSON.placeHolderOtp;
    // Customizable Area End
  }


  submit() {

    if (this.state.password.length < 4) {
      this.setState({ passwordError: true })
    }
    else {
      this.setState({ passwordError: false })
      this.setState({ showLoader: true })
      this.forgotPassApiCall()

      // this.props.navigation.navigate('NewPassword')
    }
  }

  onForgotPassward() {
    if (this.state.password.length !== 4) {
      this.setState({ passwordError: false })
    }
    else {
      this.setState({ passwordError: false })
    }
  }

  onForgotPasswardSubmit() {
    this.submit()
    // setTimeout(() => {
    //   this.onForgotPassward()
    // }, 4000);
  }

  // ------------------------ Forgot Passward Api Call ------------------------ //
  async forgotPassApiCall() {
    const header = {
      "Content-Type": configJSON.apiVerifyOtpContentType
    };
    const data = {
      token: this.props.navigation.state.params?.token,
      new_password: this.state.password
    };

    const httpBody = {
      data: data
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.ForgotApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.forgotPasswordEndPoint
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.apiVerifyOtpMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);

    return true

  }

  // ------------------------------------------------------------------ //


  async receive(from: String, message: Message) {
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );

      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      var errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );
      console.log('%%%%%%%%%%%%%%%', responseJson, errorReponse);
      if (apiRequestCallId && responseJson) {
        if (apiRequestCallId === this.ForgotApiCallId) {
          if (responseJson.errors) {
            this.setState({ showLoader: false,toast:false, changepasswordToast: responseJson.errors[0].account })
            setTimeout(() => {
              this.setState({ changepasswordToast: "" })
            }, 1500);
          } else if(responseJson.error){
            this.setState({ showLoader: false,toast:false, changepasswordToast: responseJson.error[0] })
            setTimeout(() => {
              this.setState({ changepasswordToast: "" })
            }, 1500);
          } else if (responseJson?.messages[0]?.password) {
            this.setState({ showLoader: false,toast:true, changepasswordToast: responseJson?.messages[0]?.password })
            this.setState({password:""});
            setTimeout(() => {
              this.setState({ changepasswordToast: "" })
              this.props.navigation.navigate('PasswordChanged')
              // this.props.navigation.pop(1)
            }, 1500);
          }
          else {
            this.setState({ showLoader: false,toast:false, changepasswordToast: "Error" })
            setTimeout(() => {
              this.setState({ changepasswordToast: "" })
            }, 1500);

          }
        }
      }
      else{
        this.setState({ showLoader: false})
      }
    }
    // Customizable Area Start
    if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.otpAuthApiCallId != null &&
      this.otpAuthApiCallId ===
      message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );



      if (
        responseJson &&
        (responseJson.messages ||
          (responseJson.meta && responseJson.meta.token))
      ) {
        if (responseJson.meta && responseJson.meta.token) {
          this.setState({
            otpAuthToken: responseJson.meta.token
          });
        }

        if (this.state.isFromForgotPassword) {
          // runEngine.debugLog("about to send NavigationNewPasswordMessage");
          const msg: Message = new Message(
            getName(MessageEnum.NavigationNewPasswordMessage)
          );
          msg.addData(
            getName(MessageEnum.AuthTokenDataMessage),
            this.state.otpAuthToken
          );

          msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);

          this.send(msg);
        } else {
          const msg: Message = new Message(
            getName(MessageEnum.NavigationMobilePhoneAdditionalDetailsMessage)
          );

          msg.addData(
            getName(MessageEnum.AuthTokenDataMessage),
            this.state.otpAuthToken
          );

          msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);

          this.send(msg);
        }
      } else {
        //Check Error Response
        this.parseApiErrorResponse(responseJson);
      }

      var errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );

      if (errorReponse != null) {
        this.parseApiCatchErrorResponse(errorReponse);
      }
    } else if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      const phoneAuthToken = message.getData(
        getName(MessageEnum.AuthTokenDataMessage)
      );

      const phoneNumber = message.getData(
        getName(MessageEnum.AuthTokenPhoneNumberMessage)
      );

      const forgotPasswordBool = message.getData(
        getName(MessageEnum.EnterOTPAsForgotPasswordMessage)
      );

      const emailValue = message.getData(
        getName(MessageEnum.AuthTokenEmailMessage)
      );

      const userAccountID = phoneNumber ? "" + phoneNumber : "" + emailValue;

      let updatedLabel = this.state.labelInfo;
      if (userAccountID && userAccountID !== "undefined") {
        updatedLabel = updatedLabel.replace("phone", userAccountID);
      }

      this.setState({
        otpAuthToken:
          phoneAuthToken && phoneAuthToken.length > 0
            ? phoneAuthToken
            : this.state.otpAuthToken,
        userAccountID: userAccountID,
        labelInfo: updatedLabel,
        isFromForgotPassword:
          forgotPasswordBool === undefined
            ? this.state.isFromForgotPassword
            : forgotPasswordBool
      });
    }
    // Customizable Area End
  }

  // Customizable Area Start
  async submitOtp() {
    if (!this.state.otp || this.state.otp.length === 0) {
      this.showAlert(configJSON.errorTitle, configJSON.errorOtpNotValid);
      return;
    }

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    if (this.state.isFromForgotPassword) {
      const header = {
        "Content-Type": configJSON.apiVerifyOtpContentType
      };

      //GO TO REQUEST STATE
      this.otpAuthApiCallId = requestMessage.messageId;

      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        configJSON.apiVerifyForgotPasswordOtpEndPoint
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(header)
      );

      const data = {
        token: this.state.otpAuthToken ? this.state.otpAuthToken : "",
        otp_code: this.state.otp ? this.state.otp : ""
      };

      const httpBody = {
        data: data
      };

      //requestMessage.addData(getName(MessageEnum.RestAPIRequestMethodMessage), "POST");

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(httpBody)
      );
    } else {
      const headers = {
        "Content-Type": configJSON.apiVerifyOtpContentType,
        token: this.state.otpAuthToken
      };

      this.otpAuthApiCallId = requestMessage.messageId;

      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        configJSON.apiVerifyOtpEndPoint + this.state.otp
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(headers)
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(JSON.stringify({}))
      );
    }

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.apiVerifyOtpMethod
    );
    // console.log("requestMessage.id is: " + requestMessage.id);
    runEngine.sendMessage(requestMessage.id, requestMessage);
  }

  btnSubmitOTPProps = {
    onPress: () => this.submitOtp()
  };

  txtMobilePhoneOTPWebProps = {
    onChangeText: (text: string) => this.setState({ otp: text })
  };

  txtMobilePhoneOTPMobileProps = {
    ...this.txtMobilePhoneOTPWebProps,
    keyboardType: "numeric"
  };

  txtMobilePhoneOTPProps = this.isPlatformWeb()
    ? this.txtMobilePhoneOTPWebProps
    : this.txtMobilePhoneOTPMobileProps;

  // Customizable Area End
}
