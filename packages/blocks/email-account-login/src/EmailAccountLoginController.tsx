import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine"
import AsyncStorage from '@react-native-async-storage/async-storage';
// Customizable Area Start
import { imgPasswordInVisible, imgPasswordVisible } from "./assets";
import { AsynchStoragekey, STRINGS, VALIDATION_TIMER } from '../../../mobile/src/utils/index'
import { StackActions, NavigationActions } from 'react-navigation';
import { setAsyncData } from "../../../mobile/src/utils/AsyncKeysStorage";
// Customizable Area End

export const configJSON = require("./config");
const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)([\.-]?\w+)$/;
export interface Props {
  navigation: any;
  id: string;
  subscriptionState:any;
  addUserProfile:(val:any)=>void;
  removeUserProfile:()=>void;
  addSubscription:(val:any)=>void;
  cancelSubscription:()=>void;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  password: string;
  email: string;
  enablePasswordField: boolean;
  checkedRememberMe: boolean;
  placeHolderEmail: string;
  placeHolderPassword: string;
  imgPasswordVisible: any;
  imgPasswordInVisible: any;
  labelHeader: string;
  btnTxtLogin: string;
  labelRememberMe: string;
  btnTxtSocialLogin: string;
  btnTxtSocialSignUp: string;
  labelOr: string;
  forgotPassward: string;
  emailError: string;
  passwordError: string;
  error: string;
  secureEntry: boolean;
  showLoader: boolean;
  visible: boolean;
  language: any;
  // Customizable Area End
}

interface SS {
  // Customizable Area Start
  id: any;
  // Customizable Area End
}

export default class EmailAccountLoginController extends BlockComponent<
  Props,
  S,
  SS
> {

  // Customizable Area Start
  ApiCallId: any;
  userInfoApiCallId: any;
  apiEmailLoginCallId: string = "";
  validationApiCallId: string = "";
  emailReg: RegExp;
  labelTitle: string = "";
  // Customizable Area End

  constructor(props: Props) {

    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.CountryCodeMessage),
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.ReciveUserCredentials)
    ]

    this.state = {
      email: "",
      password: "",
      enablePasswordField: true,
      checkedRememberMe: false,
      emailError: '',
      passwordError: '',
      error: '',
      secureEntry: false,
      placeHolderEmail: configJSON.placeHolderEmail,
      placeHolderPassword: configJSON.placeHolderPassword,
      imgPasswordVisible: configJSON.imgPasswordVisible,
      imgPasswordInVisible: imgPasswordInVisible,
      labelHeader: configJSON.labelHeader,
      btnTxtLogin: configJSON.btnTxtLogin,
      labelRememberMe: configJSON.labelRememberMe,
      btnTxtSocialLogin: configJSON.btnTxtSocialLogin,
      labelOr: configJSON.labelOr,
      forgotPassward: configJSON.forgotPassward,
      showLoader: false,
      visible: false,
      language: "English 🇬🇧"
    };

    this.emailReg = new RegExp("");
    this.labelTitle = configJSON.labelTitle;
    // Customizable Area End

    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

  }

  async componentDidMount() {
    // this.callGetValidationApi();
    this.send(new Message(getName(MessageEnum.RequestUserCredentials)));
    // Customizable Area Start
    const langue = await AsyncStorage.getItem("appLanguage");
    console.log(langue, "appLanguage from controller");
    if(langue == "English"){
      this.setState({language : "English 🇬🇧"})
      // await AsyncStorage.setItem("LangaugeDisplay", langue);
    }else if(langue == "Fran�ais"){
      this.setState({language : "Fran�ais 🇫🇷"})
      await AsyncStorage.setItem("LangaugeDisplay",langue);
    }
    // Customizable Area End
  }

  // Customizable Area Start
  btnSocialLoginProps = {
    onPress: () => this.goToSocialLogin()
  };

  btnEmailLogInProps = {
    color: "#6200EE",
    onPress: () => this.doEmailLogIn()
  };


  btnPasswordShowHideProps = {
    onPress: () => {
      this.setState({ enablePasswordField: !this.state.enablePasswordField });
      this.txtInputPasswordProps.secureTextEntry = !this.state
        .enablePasswordField;
      this.btnPasswordShowHideImageProps.source = this.txtInputPasswordProps
        .secureTextEntry
        ? imgPasswordVisible
        : imgPasswordInVisible;
    }
  };

  submit() {
    const { email, password } = this.state
    if (email.length == 0) {
      this.setState({ emailError: STRINGS.MESSAGE.EMPTY_EMAIL });
      this.clearValidation()
    }
    else if (reg.test(this.state.email) === false) {
      this.setState({ emailError: STRINGS.MESSAGE.INVALID_EMAIL })
      this.clearValidation()
    }
    else if (this.state.password.length == 0) {
      this.setState({ passwordError: STRINGS.MESSAGE.EMPTY_PASS })
      this.clearValidation()
    }
    else {
      this.setState({ emailError: '', passwordError: '', error: '' })
      this.callLoginApi()
    }
  }

  clearValidation() {
    setTimeout(() => {
      this.setState({ emailError: '', passwordError: '', error: '' })
    }, VALIDATION_TIMER);
  }

  onLoginSubmit() {
    this.submit();
  }

  displaylanguage = async () => {
    const langue = await AsyncStorage.getItem("appLanguage");
    console.log(langue, "appLanguage from controller");
    if (langue == "English") {
      this.setState({ language: "English 🇬🇧" });
    } else if (langue == "Fran�ais") {
      this.setState({ language: "Fran�ais 🇫🇷" });
    }
  }
  
  // Customizable Area Start
  // ------------------callApiLogin---------------------//
  async callLoginApi() {
    this.setState({ showLoader: true })
    const langue = await AsyncStorage.getItem("appLanguage");
    console.log(langue, "appLanguage from Login");
    const header = {
      "Content-Type": configJSON.loginApiContentType
    };
    const attrs = {
      email: this.state.email,
      password: this.state.password
    };
    const data = {
      type: "email_account",
      language: langue,
      attributes: attrs
    };

    const httpBody = {
      data: data
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.ApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.loginApiCallEndPoint
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
      configJSON.loginAPiMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  userInfoApi(id, token) {
    const header = {
      "Content-Type": configJSON.loginApiContentType,
      "token": token
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.userInfoApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.userInfoAPiEndPoint}${id}`
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);

    return true;

  }
  //-----------------callApiLogin----------------------// 
  async receive(from: string, message: Message) {

    // Customizable Area Start

    if (getName(MessageEnum.ReciveUserCredentials) === message.id) {
      const userName = message.getData(getName(MessageEnum.LoginUserName));

      const password = message.getData(getName(MessageEnum.LoginPassword));

      const countryCode = message.getData(
        getName(MessageEnum.LoginCountryCode)
      );

      if (!countryCode && userName && password) {
        this.setState({
          email: userName,
          password: password,
          checkedRememberMe: true
        });

        //@ts-ignore
        this.txtInputEmailProps.value = userName;

        //@ts-ignore
        this.txtInputPasswordProps.value = password;

        this.CustomCheckBoxProps.isChecked = true;
      }
    }
    // else if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
    const apiRequestCallId = message.getData(
      getName(MessageEnum.RestAPIResponceDataMessage)
    );

    var responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );
    console.log('Login Response JSON================',JSON.stringify(responseJson))

    var errorReponse = message.getData(
      getName(MessageEnum.RestAPIResponceErrorMessage)
    );
    if (apiRequestCallId && responseJson) {

      if (apiRequestCallId === this.ApiCallId) {
        console.log("@@@ login reponse ===", responseJson,responseJson?.errors);
         let dataArrtibute = {
            push: responseJson?.meta?.push_notificable,
            mail: responseJson?.meta?.mail_notificable
          }
        // setTimeout(async () => {
        this.setState({ showLoader: false })
        if (!responseJson?.errors) {
         
          await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN, responseJson?.meta?.token);
          await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.LOGIN_ID, `${responseJson?.meta?.id}`);
          await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.USER_CREDITCARDID, `${responseJson?.meta?.stripe_id}`);
          // await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.USER_SUBSCRIPTION, `${responseJson?.meta?.stripe_subscription_id}`);
          
          // await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.USER_SUBSCRIPTION, `${responseJson?.meta?.is_subscribed?"subscribed":"unsubscribed"}`);
          this.props.addSubscription({
            subscriptionId: responseJson?.meta?.subscription_id,
            transactionDate: responseJson?.meta?.subscription_date,
            status: responseJson?.meta?.is_subscribed,
            expiryDate: responseJson?.meta?.expired_at,
            userSubscription: responseJson?.meta?.is_subscribed?"subscribed" :"unsubscribed"
        })
          await setAsyncData("MANAGE_NOTIFY",dataArrtibute)
          this.userInfoApi(responseJson?.meta?.id, responseJson?.meta?.token)

        }
        else {
          console.log('=====error at login toast',responseJson)
          this.setState({ error: !!responseJson?.errors && responseJson?.errors?.length > 0 ? Object.values(responseJson?.errors[0]) : STRINGS.MESSAGE.LOGIN_FAIL })
          this.clearValidation()
        }

      }
      else if (apiRequestCallId === this.userInfoApiCallId) {
        if (!responseJson?.errors) {
          this.props.addUserProfile(responseJson?.data?.attributes)
          await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.USER_INFO, JSON.stringify(responseJson?.data?.attributes));

          // let userSubscription = await AsyncStorage.getItem("USER_SUBSCRIPTION");
          let userSubscription = this.props.subscriptionState?.subscriptionInfo?.userSubscription;

          if (userSubscription == 'null') {
            this.props.navigation.navigate('SubCriptionScreen',{itisfromloginOrSignUp:true})
          }
          else {
            this.props.navigation.dispatch(
              StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Authenticated' })],
                key: null
              })
            )
          }

        }
        else {
          this.setState({ error: !!responseJson?.errors && responseJson?.errors?.length > 0 ? Object.values(responseJson?.errors[0]) : STRINGS.MESSAGE.LOGIN_FAIL })
        }
      }
    }
    // Customizable Area End
    // if (apiRequestCallId != null) {
    //   if (
    //     apiRequestCallId === this.validationApiCallId &&
    //     responseJson !== undefined
    //   ) {
    //     var arrayholder = responseJson.data;

    //     if (arrayholder && arrayholder.length !== 0) {
    //       let regexData = arrayholder[0];

    //       if (regexData && regexData.email_validation_regexp) {
    //         this.emailReg = new RegExp(regexData.email_validation_regexp);
    //       }
    //     }
    //   }

    //   if (apiRequestCallId === this.apiEmailLoginCallId) {
    //     if (responseJson && responseJson.meta && responseJson.meta.token) {
    //       runEngine.unSubscribeFromMessages(this, this.subScribedMessages);
    //       this.saveLoggedInUserData(responseJson);
    //       this.sendLoginSuccessMessage();
    //       this.openInfoPage();
    //     } else {
    //       //Check Error Response
    //       this.parseApiErrorResponse(responseJson);
    //       this.sendLoginFailMessage();
    //     }

    //     this.parseApiCatchErrorResponse(errorReponse);
    //   }
    // }
    // }
    // Customizable Area End
  }

  // sendLoginFailMessage() {
  //   const msg: Message = new Message(getName(MessageEnum.LoginFaliureMessage));
  //   this.send(msg);
  // }

  // sendLoginSuccessMessage() {
  //   const msg: Message = new Message(getName(MessageEnum.LoginSuccessMessage));

  //   msg.addData(getName(MessageEnum.LoginUserName), this.state.email);
  //   msg.addData(getName(MessageEnum.CountyCodeDataMessage), null);
  //   msg.addData(getName(MessageEnum.LoginPassword), this.state.password);
  //   msg.addData(
  //     getName(MessageEnum.LoginIsRememberMe),
  //     this.state.checkedRememberMe
  //   );

  //   this.send(msg);
  // }

  // saveLoggedInUserData(responseJson: any) {
  //   if (responseJson && responseJson.meta && responseJson.meta.token) {
  //     const msg: Message = new Message(getName(MessageEnum.SessionSaveMessage));

  //     msg.addData(
  //       getName(MessageEnum.SessionResponseData),
  //       JSON.stringify(responseJson)
  //     );
  //     msg.addData(
  //       getName(MessageEnum.SessionResponseToken),
  //       responseJson.meta.token
  //     );

  //     this.send(msg);
  //   }
  // }

  // openInfoPage() {
  //   const msg: Message = new Message(getName(MessageEnum.AccoutLoginSuccess));

  //   msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);

  //   this.send(msg);
  // }

  // goToForgotPassword() {
  //   const msg: Message = new Message(
  //     getName(MessageEnum.NavigationForgotPasswordMessage)
  //   );
  //   msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
  //   msg.addData(getName(MessageEnum.NavigationForgotPasswordPageInfo), "email");
  //   this.send(msg);
  // }

  // goToSocialLogin() {
  //   const msg: Message = new Message(
  //     getName(MessageEnum.NavigationSocialLogInMessage)
  //   );
  //   msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
  //   this.send(msg);
  // }

  // doEmailLogIn(): boolean {
  //   if (
  //     this.state.email === null ||
  //     this.state.email.length === 0 ||
  //     !this.emailReg.test(this.state.email)
  //   ) {
  //     this.showAlert("Error", configJSON.errorEmailNotValid);
  //     return false;
  //   }

  //   if (this.state.password === null || this.state.password.length === 0) {
  //     this.showAlert("Error", configJSON.errorPasswordNotValid);
  //     return false;
  //   }

  //   const header = {
  //     "Content-Type": configJSON.loginApiContentType
  //   };

  //   const attrs = {
  //     email: this.state.email,
  //     password: this.state.password
  //   };

  //   const data = {
  //     type: "email_account",
  //     attributes: attrs
  //   };

  //   const httpBody = {
  //     data: data
  //   };

  //   const requestMessage = new Message(
  //     getName(MessageEnum.RestAPIRequestMessage)
  //   );

  //   this.apiEmailLoginCallId = requestMessage.messageId;
  //   requestMessage.addData(
  //     getName(MessageEnum.RestAPIResponceEndPointMessage),
  //     configJSON.loginAPiEndPoint
  //   );

  //   requestMessage.addData(
  //     getName(MessageEnum.RestAPIRequestHeaderMessage),
  //     JSON.stringify(header)
  //   );

  //   requestMessage.addData(
  //     getName(MessageEnum.RestAPIRequestBodyMessage),
  //     JSON.stringify(httpBody)
  //   );

  //   requestMessage.addData(
  //     getName(MessageEnum.RestAPIRequestMethodMessage),
  //     configJSON.loginAPiMethod
  //   );

  //   runEngine.sendMessage(requestMessage.id, requestMessage);

  //   return true;
  // }

  // callGetValidationApi() {

  //   const headers = {
  //     "Content-Type": configJSON.validationApiContentType
  //   };

  //   const getValidationsMsg = new Message(
  //     getName(MessageEnum.RestAPIRequestMessage)
  //   );
  //   this.validationApiCallId = getValidationsMsg.messageId;

  //   getValidationsMsg.addData(
  //     getName(MessageEnum.RestAPIResponceEndPointMessage),
  //     configJSON.urlGetValidations
  //   );

  //   getValidationsMsg.addData(
  //     getName(MessageEnum.RestAPIRequestHeaderMessage),
  //     JSON.stringify(headers)
  //   );
  //   getValidationsMsg.addData(
  //     getName(MessageEnum.RestAPIRequestMethodMessage),
  //     configJSON.validationApiMethodType
  //   );
  //   runEngine.sendMessage(getValidationsMsg.id, getValidationsMsg);
  // }
}