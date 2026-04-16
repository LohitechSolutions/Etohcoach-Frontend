// Customizable Area Start
import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import { runEngine } from "../../../framework/src/RunEngine";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";


import { imgPasswordInVisible, imgPasswordVisible } from "./assets";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AsynchStoragekey from '../../../mobile/src/utils/asynchKeys';
import { STRINGS, VALIDATION_TIMER } from "../../../mobile/src/utils";
import DeviceInfo from 'react-native-device-info';
import { Platform } from "react-native";
import { resetNavigationAfterLogin } from "../../../../react-native/src/navigation/rootNavigationRef";





export const configJSON = require("./config");
const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)([\.-]?\w+)$/;

function formatSignupApiError(responseJson: any): string | null {
  if (!responseJson || typeof responseJson !== "object") {
    return null;
  }
  const errs = responseJson.errors;
  if (Array.isArray(errs) && errs.length > 0) {
    const e0 = errs[0];
    if (typeof e0 === "string") {
      return e0;
    }
    if (e0 && typeof e0 === "object") {
      if (typeof e0.detail === "string") {
        return e0.detail;
      }
      if (typeof e0.title === "string") {
        return e0.title;
      }
      const flat = Object.values(e0).flat(Infinity) as unknown[];
      const firstStr = flat.find((v) => typeof v === "string" && String(v).length > 0);
      if (firstStr) {
        return String(firstStr);
      }
    }
  }
  if (typeof responseJson.message === "string") {
    return responseJson.message;
  }
  if (typeof responseJson.error === "string") {
    return responseJson.error;
  }
  return null;
}

export interface Props {
  navigation: any;
  id: string;
  addUserProfile:(val:any)=>void;
  removeUserProfile:()=>void;
  userProfileState:any;
  subscriptionState:any;
  addSubscription:(val:any)=>void;
  cancelSubscription:()=>void;
}

export interface S {
  
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  firstNameError: string,
  lastNameError: string,
  emailError: string,
  passwordError: string,
  error: string,
  secreEntry: boolean
  otpAuthToken: string;
  reTypePassword: string;
  data: any[];
  passwordHelperText: string;
  enablePasswordField: boolean;
  enableReTypePasswordField: boolean;
  countryCodeSelected: string;
  select: boolean,
  phone: string;
  showLoader: boolean;
  errorMsg: string;
  visible: boolean;
  language: any;
  
}

export interface SS {
  
  id: any;
  
}

export default class EmailAccountRegistrationController extends BlockComponent<
  Props,
  S,
  SS
> {
  
  arrayholder: any[];
  passwordReg: RegExp;
  emailReg: RegExp;
  createAccountApiCallId: any;
  ApiCallId: any;
  validationApiCallId: string = "";

  imgPasswordVisible: any;
  imgPasswordInVisible: any;

  labelHeader: any;
  labelFirstName: string;
  lastName: string;
  labelEmail: string;
  labelPassword: string;
  labelRePassword: string;
  labelLegalText: string;
  labelLegalTermCondition: string;
  labelLegalPrivacyPolicy: string;
  btnTextSignUp: string;
  

  currentCountryCode: any;
  

  constructor(props: Props) {
    super(props);
    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.CountryCodeMessage)
    ];
    // this.receive = this.receive.bind(this);
    // this.isStringNullOrBlank = this.isStringNullOrBlank.bind(this);

    runEngine.attachBuildingBlock(this, this.subScribedMessages);

    this.state = {
      
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      firstNameError: '',
      lastNameError: '',
      emailError: '',
      passwordError: '',
      error: '',
      secreEntry: false,
      reTypePassword: "",
      otpAuthToken: "",
      data: [],
      passwordHelperText: "",
      enablePasswordField: true,
      enableReTypePasswordField: true,
      countryCodeSelected: "",
      phone: "",
      select: false,
      showLoader: false,
      errorMsg: '',
      visible: false,
      language: "English 🇬🇧"
      
    };

    
    this.arrayholder = [];
    this.passwordReg = new RegExp("\\w+");
    this.emailReg = new RegExp("\\w+");

    this.imgPasswordVisible = imgPasswordVisible;
    this.imgPasswordInVisible = imgPasswordInVisible;

    this.labelHeader = configJSON.labelHeader;
    this.labelFirstName = configJSON.labelFirstName;
    this.lastName = configJSON.lastName;
    this.labelEmail = configJSON.labelEmail;
    this.labelPassword = configJSON.labelPassword;
    this.labelRePassword = configJSON.labelRePassword;
    this.labelLegalText = configJSON.labelLegalText;
    this.labelLegalTermCondition = configJSON.labelLegalTermCondition;
    this.labelLegalPrivacyPolicy = configJSON.labelLegalPrivacyPolicy;
    this.btnTextSignUp = configJSON.btnTextSignUp;
    
  }

  async componentDidMount() {
    // this.callGetValidationApi();
    this.send(new Message(getName(MessageEnum.RequestUserCredentials)));
    
    const langue = await AsyncStorage.getItem("appLanguage");
    console.log(langue, "appLanguage from controller");
    if(langue == "English"){
      this.setState({language : "English 🇬🇧"})
    }else if(langue == "Français"){
      this.setState({language : "Français 🇫🇷"})
      await AsyncStorage.setItem("LangaugeDisplay",langue);
    }
    
  }


  async receive(from: string, message: Message) {
    if (getName(MessageEnum.RestAPIResponceMessage) !== message.id) {
      return;
    }
    const apiRequestCallId = message.getData(
      getName(MessageEnum.RestAPIResponceDataMessage)
    );
    if (apiRequestCallId !== this.ApiCallId) {
      return;
    }

    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );
    const errorReponse = message.getData(
      getName(MessageEnum.RestAPIResponceErrorMessage)
    );

    this.setState({ showLoader: false });

    if (errorReponse != null && errorReponse !== "") {
      this.setState({
        error:
          typeof errorReponse === "string"
            ? errorReponse
            : STRINGS.MESSAGE.SINGUP_FAIL,
      });
      this.clearValidation();
      return;
    }

    if (responseJson == null || responseJson === undefined) {
      this.setState({ error: STRINGS.MESSAGE.SINGUP_FAIL });
      this.clearValidation();
      return;
    }

    console.log("reponse--------in registration", responseJson);
    if (responseJson.errors) {
      const detail = formatSignupApiError(responseJson);
      this.setState({
        error: detail || STRINGS.MESSAGE.SINGUP_FAIL,
      });
      this.clearValidation();
      return;
    }

    const usrObj = responseJson?.data?.attributes;
    if (!usrObj) {
      const detail = formatSignupApiError(responseJson);
      if (__DEV__) {
        console.warn(
          "[Signup] Missing data.attributes; response:",
          JSON.stringify(responseJson).slice(0, 500)
        );
      }
      this.setState({ error: detail || STRINGS.MESSAGE.SINGUP_FAIL });
      this.clearValidation();
      return;
    }
    usrObj["type"] = "EmailAccount";
    await AsyncStorage.setItem(
      AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN,
      responseJson?.meta?.token
    );
    await AsyncStorage.setItem(
      AsynchStoragekey.AsynchStoragekey.LOGIN_ID,
      `${responseJson?.data?.id}`
    );
    await AsyncStorage.setItem(
      AsynchStoragekey.AsynchStoragekey.USER_INFO,
      JSON.stringify(usrObj)
    );
    await AsyncStorage.setItem(
      AsynchStoragekey.AsynchStoragekey.REGISTER_ACC_TYPE,
      responseJson?.data?.type
    );
    this.props.addUserProfile(usrObj);
    this.props.cancelSubscription();
    const goSubscribe = () =>
      void resetNavigationAfterLogin("SubCriptionScreen", {
        itisfromloginOrSignUp: true,
      });
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(goSubscribe);
    } else {
      setTimeout(goSubscribe, 0);
    }
  }


  displaylanguage = async () => {
    const langue = await AsyncStorage.getItem("appLanguage");
    console.log(langue, "appLanguage from controller");
    if (langue == "English") {
      this.setState({ language: "English 🇬🇧" });
    } else if (langue == "Français") {
      this.setState({ language: "Français 🇫🇷" });
    }
  }

  submit() {
    if (this.state.firstName.length == 0) {
      this.setState({ firstNameError: STRINGS.MESSAGE.EMPTY_FNAME })
      this.clearValidation()
    }
    else if (this.state.lastName.length == 0) {
      this.setState({ lastNameError: STRINGS.MESSAGE.EMPTY_LNAME })
      this.clearValidation()
    }
    else if (this.state.email.length == 0) {
      this.setState({ emailError: STRINGS.MESSAGE.EMPTY_EMAIL })
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
    else if (this.state.select == false) {
      this.setState({ error: STRINGS.MESSAGE.TERMS_POLICY })
      this.clearValidation()
    }
    else {
      this.setState({ showLoader: true });
      void this.api().catch(() => {
        this.setState({ showLoader: false, error: STRINGS.MESSAGE.SINGUP_FAIL });
      });
    }

  }

  clearValidation() {
    setTimeout(() => {
      this.setState({ emailError: '', firstNameError: '', lastNameError: '', passwordError: '', error: '' })
    }, 23000);
  }
  
  // --- api call registration --------------------------------------------------------------
  async api() {
    let fcmtoken: any = await AsyncStorage.getItem('FCM_TOKEN');
    const langue = await AsyncStorage.getItem("appLanguage");
    console.log(langue, "appLanguage from Login");
    let Devices = "unknown";
    let version = "unknown";
    try {
      Devices = DeviceInfo.getModel();
      version = DeviceInfo.getSystemVersion();
    } catch {
      /* Expo shim / missing native module */
    }
    let date= new Date()
    let user_time=date.toLocaleDateString()+" "+date.toLocaleTimeString("en-GB")
   
// checkkk

function getTimeOffset() {
  var date = new Date();
  var offset = date.getTimezoneOffset();
  var sign = offset < 0 ? '+' : '-';
  var hours = Math.floor(Math.abs(offset) / 60);
  var minutes = Math.abs(offset) % 60;

  var offsetString = 'GMT' + sign + addZero(hours) + ':' + addZero(minutes);
  return offsetString;
}

function addZero(number) {
  return (number < 10 ? '0' : '') + number;
}

// Example usage
var timeOffset = getTimeOffset();
console.log(timeOffset,"checking what is it gmt gmt");




// check


    // console.log("checking the usertime",new Date().getTimezoneOffset(),offest)
    const header = {
      "Content-Type": configJSON.contentTypeApiAddDetail
    };
    const attrs = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
      activated: true,
      device_id: fcmtoken ?? "",
      language: langue,
      devices_type:Devices,
      ios_version:version,
      user_time:user_time,
      user_time_zone:timeOffset,
      // operating_system:Platform.OS
    };
    console.log(attrs, "registrationafdsdf");

    const data = {
      type: "email_account",
      attributes: attrs
    };

    const httpBody = {
      data: data,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );






console.log(requestMessage,"checking what is it")


    this.ApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.apiEndPoint
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
      configJSON.apiMethodTypeAddDetail
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  //--------------------------------------------------------------
 
}
// Customizable Area End
