
// Customizable Area Start
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlockComponent } from "../../../framework/src/BlockComponent";
import { Message } from "../../../framework/src/Message";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

import {
  GoogleSignin
} from "../../../../react-native/src/shims/@react-native-community-google-signin";
import { CommonActions } from "@react-navigation/native";
import {
  navigationRef,
  resetNavigationToEmailLogin
} from "../../../../react-native/src/navigation/rootNavigationRef";
import { DeviceEventEmitter, Platform } from "react-native";
import { STRINGS, VALIDATION_TIMER } from "../../../mobile/src/utils";
import AsynchStoragekey from '../../../mobile/src/utils/asynchKeys';
import { isConnected } from "../../../mobile/src/utils/internetConnection";
import i18n from '../../LanguageOptions/src/component/i18n/i18n.config';

export const configJSON = require("./config");
const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)([\.-]?\w+)$/;

/** RN6 root stack: reset must run on root — tab/stack nesting has no `NonAuthenticated` route. */
function getRootNavigation(navigation: {
  getParent?: () => typeof navigation;
  dispatch: (action: unknown) => void;
}) {
  let nav = navigation;
  let parent = navigation.getParent?.();
  while (parent) {
    nav = parent;
    parent = parent.getParent?.();
  }
  return nav;
}

const nonAuthLoginResetAction = CommonActions.reset({
  index: 0,
  routes: [
    {
      name: "NonAuthenticated",
      state: {
        routes: [{ name: "EmailAccountLoginBlock" }],
        index: 0
      }
    }
  ]
});

function resetToNonAuthLogin(navigation: { getParent?: () => unknown; dispatch: (action: unknown) => void }) {
  getRootNavigation(navigation as Parameters<typeof getRootNavigation>[0]).dispatch(nonAuthLoginResetAction);
}

/** Prefer container ref (root); defer one frame so modal close does not race the reset. */
function navigateToLoginAfterLogout(navigation: { getParent?: () => unknown; dispatch: (action: unknown) => void }) {
  const run = () => {
    if (navigationRef.isReady()) {
      resetNavigationToEmailLogin();
    } else {
      resetToNonAuthLogin(navigation);
    }
  };
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(run);
  } else {
    setTimeout(run, 0);
  }
}

// Customizable Area End
// let apiRes = this.props.navigation.state.params?.apiSucess

export interface Props {
  navigation: any;
  id: string;
  addUserProfile: (val: any) => void;
  removeUserProfile: () => void;
  removeSubscription:()=>void;
  userProfileState: any;
  subscriptionState: any;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  firstName: any;
  isVisible: boolean;
  linkVerifyModal: boolean;
  deleteModalVisible: boolean;
  lastName: any;
  email: any;
  password: any;
  phoneNumber: any;
  currentCountryCode: any;
  data: any[];
  passwordHelperText: String;
  enablePasswordField: boolean;
  enableReTypePasswordField: boolean;
  enableNewPasswordField: boolean;

  edtEmailEnabled: boolean;
  llDoChangePwdContainerVisible: boolean;
  llChangePwdDummyShowContainerVisible: boolean;

  currentPasswordText: any;
  newPasswordText: any;
  reTypePasswordText: any;

  edtMobileNoEnabled: boolean;
  countryCodeEnabled: boolean;

  saveButtonDisable: boolean;
  firstNameError: string;
  lastNameError: string;
  error: string;
  success: string;
  CurrentPassword: any;
  CurrentPasswordError: string;
  secreEntry: boolean;
  newPassword: any;
  newPasswordError: string;
  newSecreEntry: boolean;
  ConfirmPassword: any;
  confirmPasswordError: string;
  confirmSecureEntry: boolean;
  emailError: string;
  newEmailError: string;
  changepasswordToast: string;
  changeEmail: string;
  passwordErrorMassage: string;
  showLoader: boolean;
  CurrentEmail: string;
  NewEmail: string;

  updateMailError: string;
  userInfo: any;
  accountType: any;
  type: any;
  emailApiText: any;
  notificationBt: boolean;


  // price details
  priceingListapi_price: any;
  pricingListapi_expiryDate: any;
  courseDurationMonth: any;
  courseExpiryMonthAndate: any;
  issubscribed: boolean,
  notificationUnreadCount: any
  switchBtnPush: boolean;
  switchBtnMail: boolean;
  typeNotification: any;
  isSwitchWithout: boolean;
  isConnectionStatus: boolean;
  isloading: boolean;
  subscribed:boolean;
  subscriptionDate:any;
  isnotificationloading:any
  // Customizable Area End
}

interface SS {
  // Customizable Area Start
  id: any;
  // Customizable Area End
}

export default class UserProfileBasicController extends BlockComponent<
  Props,
  S,
  SS
> {

  // Customizable Area Start
  labelFirstName: string;

  lastName: string;
  labelArea: string;
  labelMobile: string;
  labelEmail: string;
  labelCurrentPassword: string;
  labelNewPassword: string;
  labelRePassword: string;
  btnTextCancelPasswordChange: string;
  btnTextSaveChanges: string;
  labelHeader: any;
  btnTextChangePassword: string;

  arrayholder: any[];
  passwordReg: RegExp;
  emailReg: RegExp;
  apiCallMessageUpdateProfileRequestId: any;
  validationApiCallId: string = "";
  apiChangePhoneValidation: any;
  registrationAndLoginType: string = "";
  authToken: any;
  uniqueSessionRequesterId: any;
  userProfileGetApiCallId: any;
  userAttr: any;
  ApiCallId: any;
  PasswordApiCallId: any;
  EditProfileApiCallId: any;
  DeleteAccountCallId: any;
  EmailChangeApiCallId: any;
  userInfoApiCallId: any;
  pricingListApiId: any;
  issubscribed: false;
  notificationUnreadCount: any;
  notificationStatusListApiId: any;
  focusListener: any;
  showLoader: boolean;
  pushSwitchValue: boolean;
  isSwitchWithout: boolean;
  apiDashboardItemCallId: any;
  dailyUsageTimeID: any;
  notificationloader:any
  // Customizable Area End

  constructor(props: Props) {

    super(props);
    this.receive = this.receive.bind(this);
    // Customizable Area Start
    // this.subScribedMessages = [
    //   getName(MessageEnum.RestAPIResponceMessage),
    //   getName(MessageEnum.SessionResponseMessage),
    //   getName(MessageEnum.CountryCodeMessage),
    // ];
    // Customizable Area End

    this.subScribedMessages = [
      // Customizable Area Start

      getName(MessageEnum.AccoutLoginSuccess),
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionSaveMessage),
      getName(MessageEnum.SessionResponseMessage),
      // Customizable Area End
    ];

    this.state = {
      // Customizable Area Start
      firstName: "",
      CurrentEmail: "",
      NewEmail: "",
      firstNameError: '',
      lastNameError: '',
      error: '',
      success: '',
      secreEntry: false,
      lastName: "",
      email: "",
      password: '',
      phoneNumber: "",
      CurrentPassword: "",
      newPassword: "",
      newPasswordError: '',
      newSecreEntry: false,
      CurrentPasswordError: '',
      ConfirmPassword: "",
      confirmPasswordError: '',
      confirmSecureEntry: false,
      emailError: '',
      newEmailError: '',
      currentCountryCode: configJSON.hintCountryCode,
      data: [],
      passwordHelperText: "",
      enablePasswordField: true,
      enableReTypePasswordField: true,
      enableNewPasswordField: true,
      isVisible: false,
      deleteModalVisible: false,
      edtEmailEnabled: true,
      llDoChangePwdContainerVisible: false,
      llChangePwdDummyShowContainerVisible: false,

      currentPasswordText: "",
      newPasswordText: "",
      reTypePasswordText: "",

      edtMobileNoEnabled: true,
      countryCodeEnabled: true,
      saveButtonDisable: false,
      changepasswordToast: "",
      changeEmail: "",
      passwordErrorMassage: "",
      showLoader: false,
      updateMailError: "",
      userInfo: null,
      linkVerifyModal: false,
      accountType: '',
      type: "",
      emailApiText: "",
      notificationBt: false,
      priceingListapi_price: "",
      pricingListapi_expiryDate: "",
      courseDurationMonth: "",
      courseExpiryMonthAndate: "",
      issubscribed: false,
      notificationUnreadCount: '0',
      typeNotification: '',
      switchBtnPush: false,
      switchBtnMail: false,
      isSwitchWithout: false,
      isConnectionStatus: false,
      isloading: false,
      subscribed:false,
      subscriptionDate:null,
      isnotificationloading:false
      // notifyData:
      // Customizable Area End

    };
    // Customizable Area Start

    this.arrayholder = [];
    this.passwordReg = new RegExp("\\w+");
    this.emailReg = new RegExp("\\w+");

    this.labelFirstName = configJSON.labelFirstName;
    this.lastName = configJSON.lastName;
    this.labelArea = configJSON.labelArea;
    this.labelMobile = configJSON.labelMobile;
    this.labelEmail = configJSON.labelEmail;
    this.labelCurrentPassword = configJSON.labelCurrentPassword;
    this.labelNewPassword = configJSON.labelNewPassword;
    this.labelRePassword = configJSON.labelRePassword;
    this.btnTextCancelPasswordChange = configJSON.btnTextCancelPasswordChange;
    this.btnTextSaveChanges = configJSON.btnTextSaveChanges;
    this.labelHeader = configJSON.labelHeader;
    this.btnTextChangePassword = configJSON.btnTextChangePassword;
    // Customizable Area End
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
    // Customizable Area End

  }

  // Customizable Area Start


  logout = async () => {
    try {
      await AsyncStorage.removeItem(AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN);
      await AsyncStorage.removeItem(AsynchStoragekey.AsynchStoragekey.USER_CREDITCARDID);
    } catch (e) {
      console.warn("logout: async storage", e);
    }
    try {
      this.props.removeSubscription();
      this.props.removeUserProfile();
    } catch (e) {
      console.warn("logout: redux", e);
    }
    void this.googleSignOut();
    if (Platform.OS == "ios") {
      // await appleAuth.performRequest({requestedOperation: AppleRequestOperation.LOGOUT})
    }
    navigateToLoginAfterLogout(this.props.navigation);
  }

  googleSignOut = async () => {
    if (await GoogleSignin.isSignedIn()) {
      console.log("google===============");
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      } catch (error) {
        console.error(error);
      }
    }
  };





  saveProfile() {
    if (this.state.firstName.length == 0 || this.state.firstName.trim()=='') {
      this.setState({ firstNameError:i18n.t ( STRINGS.MESSAGE.EMPTY_FNAME) })
      this.clearValidation()
    }
    else if (this.state.lastName.length == 0 || this.state.lastName.trim()=='') {
      this.setState({ lastNameError:i18n.t (STRINGS.MESSAGE.EMPTY_LNAME) })
      this.clearValidation()
    }
    else {
      if(this.state.isConnectionStatus){

        this.setState({ showLoader: true })
        this.callEditProfileApi()
      }else{
        this.props.navigation.navigate('NoInternet',{showHeader:true,from:"editprofile"})
      }
    }
  }

  clearValidation() {
    setTimeout(() => {
      this.setState({
        firstNameError: '',
        lastNameError: '',
        CurrentPasswordError: '',
        newPasswordError: '',
        confirmPasswordError: '',
        emailError: '',
        newEmailError: '',
        success: '',
        error: ''
      })
    }, VALIDATION_TIMER);
  }

  onsaveProfile() {

    if (this.state.firstName === "") {
      this.setState({ firstNameError: false })
    }
    else if (this.state.lastName === "") {
      this.setState({ lastNameError: false })
    }
  }

  submitSaveProfile() {
    this.saveProfile()
    setTimeout(() => {
      this.onsaveProfile()
    }, 4000);
  }

  async submitSaveNotification(switchBtnPush: any, switchBtnMail: any) {
    let endpoint = ''
    console.log("switchBtnPush @@@@", switchBtnPush)
    console.log("switchBtnMail @@@@", switchBtnMail)

    endpoint = `type_push=${switchBtnPush}&type_mail=${switchBtnMail}`
    

    if(this.state.isConnectionStatus){
      this.setState({ isSwitchWithout: true }, () => this.callPushNotificationEnable(endpoint))
    }else{
        this.props.navigation.navigate('NoInternet',{showHeader:true,from:"editprofile"})
    }


    
  }

  async changeEmail() {
    if (this.state.email.length == 0) {
      this.setState({ emailError:i18n.t( STRINGS.MESSAGE.EMPTY_EMAIL) })
      this.clearValidation()
    }
    else if (this.state.email != '' && reg.test(this.state.email) === false) {
      this.setState({ emailError: i18n.t( STRINGS.MESSAGE.INVALID_EMAIL) })
      this.clearValidation()
    }
    else if (this.state.NewEmail.length == 0) {
      this.setState({ newEmailError:i18n.t (STRINGS.MESSAGE.EMPTY_EMAIL) })
      this.clearValidation()
    }
    else if (this.state.NewEmail != '' && reg.test(this.state.NewEmail) === false) {
      this.setState({ newEmailError:i18n.t( STRINGS.MESSAGE.INVALID_EMAIL) })
      this.clearValidation()
    }
    else if (this.state.email.toLowerCase() == this.state.NewEmail.toLowerCase()) {
      this.setState({ newEmailError:i18n.t(STRINGS.MESSAGE.EMAIL_SAME) })
      this.clearValidation()
    }
    else {

      if(this.state.isConnectionStatus){
        this.setState({ showLoader: true })
        this.callUpadateEmailApi()
      }else{
          this.props.navigation.navigate('NoInternet',{showHeader:true,from:"editprofile"})
      }
    
    }
  }

  onChangeEmail() {
    if (reg.test(this.state.email) === false) {
      this.setState({ emailError: false })
    }
  }

  changePassword() {
    if (this.state.CurrentPassword.length == 0) {
      this.setState({ CurrentPasswordError:i18n.t (STRINGS.MESSAGE.EMPTY_PASS )})
      this.clearValidation()
    }
    else if (this.state.newPassword.length == 0) {
      this.setState({ newPasswordError:i18n.t (STRINGS.MESSAGE.EMPTY_PASS )})
      this.clearValidation()
    }
    else if (this.state.CurrentPassword === this.state.newPassword) {
      this.setState({ newPasswordError:i18n.t( STRINGS.MESSAGE.PASSWORD_SAME) })
      this.clearValidation()
    }
    else if (this.state.ConfirmPassword.length == 0) {
      this.setState({ confirmPasswordError:i18n.t( STRINGS.MESSAGE.EMPTY_PASS )})
      this.clearValidation()
    }
    else if (this.state.newPassword !== this.state.ConfirmPassword) {
      this.setState({ confirmPasswordError:i18n.t( STRINGS.MESSAGE.PASSWORD_CONFIRM_NOT_MATCH) })
      this.clearValidation()
    }
    else {
      if(this.state.isConnectionStatus){
      this.setState({ showLoader: true })
      this.changePasswordApi()
    }else{
        this.props.navigation.navigate('NoInternet',{showHeader:true,from:"editprofile"})
    }
    }
  }

  deleteAccount() {
    if(this.state.isConnectionStatus){
      
      this.deleteAccountCallApi()
    }else{
      this.setState({deleteModalVisible:false})
      this.props.navigation.navigate('NoInternet',{showHeader:true,from:"editprofile"})
    }
    
  }

  async componentDidMount(): Promise<void> {

    this.focusListener = this.props.navigation.addListener("didFocus", async () => {
      this.setState({isnotificationloading:true})
      let myown=await AsyncStorage.getItem("USER_INFO") ||""
      myown=JSON.parse(myown)

      console.log( myown ,"changing the goog")
      let connectionStatus = await isConnected().then(response => response).catch(err => console.log(err))
      let userInfo = this.props.userProfileState?.data;
      this.setState({ userInfo: userInfo, firstName: myown?.first_name, lastName: myown?.last_name, email: userInfo?.email, accountType: userInfo?.type },()=>{console.log('user profile controller',this.state.userInfo,this.state.firstName)})
      const subsDate = this.props.subscriptionState?.subscriptionInfo?.expiryDate;
      const subsStatus = this.props.subscriptionState?.subscriptionInfo?.status;
      console.log('subs info @ profile',this.props.subscriptionState)
      this.setState({
        subscriptionDate: subsDate,
        subscribed: subsStatus
      })
      if (connectionStatus !== undefined) {
        let registerInfo = await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.REGISTER_ACC_TYPE)
        this.callPushNotificationEnable();
        this.getDashboardData();
        this.functionTogetnotifications()
        // console.log("notifyObj @@@@@", notifyObj)
        // let notifyPushData = await AsyncStorage.getItem('PUSH')
        // let notifyPushObj = JSON.parse(notifyPushData || '{}');

        // let notifyMailData = await AsyncStorage.getItem('MAIL')
        // let notifyMailObj = JSON.parse(notifyMailData || '{}');
        // let registerjsonObj = JSON.parse(registerInfo);
        // let unseenNotify: any = await AsyncStorage.getItem('NOTIFICATION_UNREAD')
        this.setState({
          isConnectionStatus: true
        })
        // this.setState({switchBtnPush:notifyPushObj})
        // this.setState({switchBtnMail:notifyMailObj})
        // this.setState({ userInfo: userInfo, firstName: userInfo?.first_name, lastName: userInfo?.last_name, email: userInfo?.email, accountType: userInfo?.type })
        if (this.props.navigation.state.params?.apiSucess) {
          this.setState({ linkVerifyModal: true, emailApiText: this.props.navigation.state.params?.apiReponse?.message })
        }
        this.setState({ showLoader: true })
        // this.setState({ overlay_bt: true })
        // The screen is focused
        // Call any action
        setTimeout(() => {
          this.setState({ showLoader: false })
        }, 2000);
      } else {
        this.setState({
          isConnectionStatus: false
        })
      }
    });

  }

  shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<S>, nextContext: any): boolean {
    if (this.state !== nextState || this.props !== nextProps) {
      if (this.props.navigation.state.params !== nextProps.navigation.state.params) {
        if (nextProps.navigation.state.params?.apiSucess) {

          this.setState({ linkVerifyModal: true })
        }
        else {
          this.setState({ error: nextProps.navigation.state.params?.error })
        }
      }
      if (this.state.linkVerifyModal !== nextState.linkVerifyModal) {
        if (nextState.linkVerifyModal == true) {
          this.userInfoApi()
        }
      }
      return true
    }
    return false
  }

  // ------------------callApiEditProfile---------------------//
  async callEditProfileApi() {
    const id = await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.LOGIN_ID)

    const header = {
      "Content-Type": configJSON.contentTypeApiUpdateUser,
      "Token": await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN)
    };
    const data = {
      first_name: this.state.firstName.trim(),
      last_name: this.state.lastName.trim()
    };
    const httpBody = {
      data: data
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.EditProfileApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.apiEndPointUpdateUser}${id}`
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
      configJSON.apiUpdateUserType
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);

    return true;

  }
  // --------------------   changePasswordApi -------------------//
  async changePasswordApi() {
    let userId = await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.LOGIN_ID)
    const header = {
      "Content-Type": configJSON.contentTypeApiUpdateUser,
      "token": await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN)
    };

    const data = {
      current_password: this.state.CurrentPassword,
      new_password: this.state.newPassword
    };
    const httpBody = {
      data: data
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.PasswordApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.apiEndPointUpdatePassword}${userId}`
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
      configJSON.apiUpdateUserType
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);

    return true;

  }

  async getPricingDetails() {
    const header = {
      "Content-Type": "application/json",
      token: await AsyncStorage.getItem(
        AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN
      ),
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.pricingListApiId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      "subscriptions/list"
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      "GET"
    );


    runEngine.sendMessage(requestMessage.id, requestMessage);
    // Customizable Area End
    return true;
  }



  // --------------------   deleteaccountApi -------------------//
  async deleteAccountCallApi() {
    this.setState({ showLoader: true })
    let userId = await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.LOGIN_ID)
    const header = {
      "Content-Type": configJSON.contentTypeApiUpdateUser,
      "token": await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN)
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.DeleteAccountCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.apiEndPointUpdateUser}${userId}`
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.deleteApiMethodType
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);

    return true;

  }

  // ------------------call user info Api---------------------//
  async userInfoApi() {
    let userId = await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.LOGIN_ID)
    const header = {
      "Content-Type": configJSON.loginApiContentType,
      "token": await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN)
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.userInfoApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.apiEndPointUpdateUser}${userId}`
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

  // ------------------call change Email Api---------------------//
  async callUpadateEmailApi() {

    const header = {
      "Content-Type": configJSON.contentTypeApiUpdateUser,
      "token": await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN)
    };


    const data = {
      current_email: this.state.email,
      new_email: this.state.NewEmail
    };


    const httpBody = {
      data: data
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.EmailChangeApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.apiEndPointUpdateEmail
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
      configJSON.apiUpdateUserType
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);

    return true;

  }
  // ======================================================//
  async receive(from: String, message: Message) {
    // console.log("message @@@@@@@@@@", message)
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );

      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      // console.log("responseJson ## @@@@@", responseJson, apiRequestCallId)
      var errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );
      var successResponse = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      // ----------------Edit ProfileApi Response---------------- //
      if (apiRequestCallId && responseJson) {

        if (apiRequestCallId === this.EditProfileApiCallId) {
          this.setState({ showLoader: false })
          if (!responseJson?.errors) {
            console.log("user data  hecking from dta",responseJson?.data?.attributes)
            let data = responseJson?.data?.attributes;
            this.setState({ success: STRINGS.MESSAGE.PROFILE_CHANGE, userInfo: data, firstName: data?.first_name, lastName: data?.last_name })
            this.props.addUserProfile(data);
            await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.USER_INFO, JSON.stringify(data));
            DeviceEventEmitter.emit('profilechange', { data: data })
            setTimeout(() => {
              this.props.navigation.goBack()
            }, VALIDATION_TIMER);
          }
          else {
            this.setState({ error: responseJson.errors?.length > 0 ? Object.values(responseJson?.errors[0]) : STRINGS.MESSAGE.PROFILE_CHANGE_FAIL })
          }
          this.clearValidation()
        }
      }
      // ----------------Password Api Response---------------- //
      if (apiRequestCallId && responseJson) {
        if (apiRequestCallId === this.PasswordApiCallId) {
          this.setState({ showLoader: false })
          if (responseJson?.message) {
            this.setState({ error: responseJson?.message })
          }
          else if (responseJson?.errors) {
            this.setState({ error: (!!responseJson?.errors && responseJson?.errors?.length > 0) ? Object.values(responseJson?.errors[0]) : '' })
          }
          else {
            this.setState({ success: STRINGS.MESSAGE.PASSWORD_CHANGE })
            setTimeout(() => {
              this.props.navigation.goBack()
            }, VALIDATION_TIMER);

          }
          this.clearValidation()
        }

        if (apiRequestCallId == this.dailyUsageTimeID) {
          console.log("iam in the ddaily time sent-->", responseJson);
          AsyncStorage.setItem("APPtime", "0");
          AsyncStorage.setItem("APPdate", "0");
        }

      }

      // ----------------Delete Api Response---------------- //
      if (apiRequestCallId && responseJson) {

        if (apiRequestCallId === this.DeleteAccountCallId) {
          if (!responseJson?.errors) {
            this.props.removeUserProfile();
            await AsyncStorage.removeItem(AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN);
            await AsyncStorage.removeItem(AsynchStoragekey.AsynchStoragekey.USER_CREDITCARDID);
            await AsyncStorage.removeItem(AsynchStoragekey.AsynchStoragekey.USER_SUBSCRIPTION);
            await AsyncStorage.removeItem(AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_EXPIRY_DATE);
            await AsyncStorage.removeItem(AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_STATUS);
            await AsyncStorage.removeItem(AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_TRANSACTION_DATE);
            await AsyncStorage.removeItem(AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_TRANSACTION_RECEIPT);

            this.setState({ showLoader: false });
            // await AsyncStorage.removeItem(AsynchStoragekey.AsynchStoragekey.USER_INFO);
            navigateToLoginAfterLogout(this.props.navigation);
          }
          else {

          }
        }
      }

      // ----------------ChangeEmailResponse---------------- //

      if (apiRequestCallId && responseJson) {
        if (apiRequestCallId === this.EmailChangeApiCallId) {

          this.setState({ showLoader: false })
          if (!responseJson?.error) {
            this.setState({ success: STRINGS.MESSAGE.EMAIL_CHANGE })
            this.setState({ isVisible: !this.state.isVisible })

          }
          else {
            this.setState({ error: responseJson?.error && responseJson?.error?.length > 0 ? responseJson?.error[0] : STRINGS.MESSAGE.EMAIL_VERIFY_FAIL })
          }
          this.clearValidation()
        }
      }
      //  user price details


      if (apiRequestCallId === this.pricingListApiId) {

        if (!successResponse) {


        } else {
          let myData = successResponse.data[0].attributes
          // console.log("mydata of price list", myData)
          if (!myData.subscribed) {

          }

          let courseDurationMonth = new Date(myData.valid_up_to).getMonth() - new Date().getMonth()

          const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
          let courseExpiryMonth = month_names[new Date(myData.valid_up_to).getMonth()]
          let courseExpiryDate = new Date(myData.valid_up_to).getDate()

          this.setState({
            ...this.state,
            priceingListapi_price: myData.price,
            pricingListapi_expiryDate: myData.valid_up_to,
            courseDurationMonth: String(courseDurationMonth),
            courseExpiryMonthAndate: courseExpiryMonth + " " + courseExpiryDate,
            issubscribed: myData.subscribed
          })
        }
      }


      if (apiRequestCallId && responseJson) {
        if (apiRequestCallId === this.notificationStatusListApiId) {
          console.log("data of notifyy @@@@@@@@@@@")
          console.log(responseJson, successResponse)
          if (!successResponse) {
            // this.setState({})
          } else {
            if (!this.state.isSwitchWithout) {
              this.setState({
                switchBtnPush: responseJson.meta.push_notificable,
                switchBtnMail: responseJson.meta.mail_notificable
              })
            } else {
              this.setState({
                switchBtnPush: responseJson.meta.push_notificable,
                switchBtnMail: responseJson.meta.mail_notificable,
                success: "changes successfully saved",
                isSwitchWithout: false,
              })
            }


          }
          this.setState({isnotificationloading:false})
        }
      }




      // ---------------- User Info Response---------------- //

      if (apiRequestCallId && responseJson) {
        if (apiRequestCallId === this.userInfoApiCallId) {

          if (!responseJson?.error) {

            console.log('user profile info', JSON.stringify(responseJson))
            this.props.addUserProfile(responseJson?.data?.attributes);
            await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.USER_INFO, JSON.stringify(responseJson?.data?.attributes));
            this.setState({ NewEmail: '', email: responseJson?.data?.attributes?.email })
          }
        }
        this.clearValidation()
      }


      if (apiRequestCallId && responseJson) {
        if (apiRequestCallId === this.apiDashboardItemCallId) {
          console.log("this is the data of dash in setting", responseJson)
          AsyncStorage.setItem("notificationCalculation", JSON.stringify(responseJson?.unseen_notification))
          this.setState({ notificationUnreadCount: responseJson?.unseen_notification })
        }
        else {

        }
      }


      if (apiRequestCallId == this.dailyUsageTimeID) {
        console.log("iam in the ddaily time sent", responseJson);
        AsyncStorage.setItem("APPtime", "0");
        AsyncStorage.setItem("APPdate", "0");
      }



    }





    // Customizable Area Start
    // runEngine.debugLog("on recieive==>" + JSON.stringify(message));

    // if (getName(MessageEnum.CountryCodeMessage) === message.id) {
    //   var selectedCode = message.getData(
    //     getName(MessageEnum.CountyCodeDataMessage)
    //   );

    //   if (selectedCode !== undefined) {
    //     this.setState({
    //       currentCountryCode:
    //         selectedCode.indexOf("+") > 0
    //           ? selectedCode.split("+")[1]
    //           : selectedCode
    //     });
    //   }
    // }

    // else if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
    //   const apiRequestCallId = message.getData(
    //     getName(MessageEnum.RestAPIResponceDataMessage)
    //   );

    //   var responseJson = message.getData(
    //     getName(MessageEnum.RestAPIResponceSuccessMessage)
    //   );

    //   var errorReponse = message.getData(
    //     getName(MessageEnum.RestAPIResponceErrorMessage)
    //   );
    // }
  }

  // call push notification enable api
  async callPushNotificationEnable(endpoint: string) {
    const header = {
      "Content-Type": "application/json",
      token: await AsyncStorage.getItem(
        AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN
      ),
    };

    const attrs = {
      type: this.state.typeNotification
    }

    // const data = {
    //   data: attrs
    // }
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.notificationStatusListApiId = requestMessage.messageId;

    {
      this.state.isSwitchWithout == true ? (
        requestMessage.addData(
          getName(MessageEnum.RestAPIResponceEndPointMessage),
          `status/push/notificable?${endpoint}`
        )) : (
        requestMessage.addData(
          getName(MessageEnum.RestAPIResponceEndPointMessage),
          `status/push/notificable`
        )
      )
    }

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      "POST"
    );
    console.log("request msg @@@@@@@@@@@")
    console.log(requestMessage)

    runEngine.sendMessage(requestMessage.id, requestMessage);
    // Customizable Area End
    return true;
  }


  getDashboardData = async () => {
    // this.setState({ isLoading: true })
    this.apiDashboardItemCallId = await this.apiCall({
      contentType: configJSON.dashboarContentType,
      method: configJSON.dashboarApiMethodType,
      endPoint: configJSON.dashboardGetUrl,
    });
  };





  apiCall = async (data: any) => {

    // this.setState({ isLoading: true })
    // let token: any = await AsyncStorage.getItem("@token");


    const { contentType, method, endPoint, body, type } = data;

    const header = {
      "Content-Type": contentType,
      token: await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN),
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endPoint
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      method
    );

    body && type != "formData"
      ? requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(body)
      )
      : requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        body
      );

    runEngine.sendMessage(requestMessage.id, requestMessage);

    // console.log("@@@ requestMessage ========", requestMessage);

    return requestMessage.messageId;
  };


  functionTogetnotifications = async () => {
    let unseen = await AsyncStorage.getItem("notificationCalculation")
    this.setState({ notificationUnreadCount: unseen })
  }

  // async saveNotification(){
  //   console.log("save Notification ***")
  // }

  // async handleSwitch(val:any,data:string){

  //   console.log("data and val **", data ,"and", val)
  //   // return 
  //   if(data === "push"){
  //     await AsyncStorage.setItem('PUSH',JSON.stringify(val))
  //      this.setState({switchBtnPush : val})
  //      this.setState({typeNotification:'push'})
  //      this.callPushNotificationEnable()
  //   }else{
  //     await AsyncStorage.setItem('MAIL',JSON.stringify(val))
  //     this.setState({switchBtnMail : val})
  //     this.setState({typeNotification:'mail'})
  //     this.callPushNotificationEnable()
  //   }
  // }
  // if (apiRequestCallId && responseJson) {

  //   if (apiRequestCallId === this.validationApiCallId && responseJson) {
  //     this.arrayholder = responseJson.data;

  //     if (this.arrayholder && this.arrayholder.length !== 0) {
  //       let regexData = this.arrayholder[0];

  //       if (regexData) {
  //         if (regexData.password_validation_regexp) {
  //           this.passwordReg = new RegExp(
  //             regexData.password_validation_regexp
  //           );
  //         }

  //         if (regexData.email_validation_regexp) {
  //           this.emailReg = new RegExp(regexData.email_validation_regexp);
  //         }

  //         if (regexData.email_validation_regexp) {
  //           this.setState({
  //             passwordHelperText: regexData.password_validation_rules
  //           });
  //         }
  //       }
  //     }
  //   } else if (apiRequestCallId === this.userProfileGetApiCallId) {
  //     if (
  //       responseJson &&
  //       !responseJson.errors &&
  //       responseJson.data &&
  //       responseJson.data.attributes
  //     ) {
  //       //On User Profile Success

  //       this.userAttr = responseJson.data.attributes;

  //       if (this.userAttr !== null && this.userAttr !== undefined) {
  //         let email = this.userAttr.email;
  //         let firstName = this.userAttr.first_name;
  //         let lastName = this.userAttr.last_name;
  //         let currentCountryCode = this.userAttr.country_code;
  //         let phoneNumber = this.userAttr.phone_number
  //           ? this.userAttr.phone_number
  //           : "";

  //         this.setState({
  //           email: email,
  //           firstName: firstName,
  //           lastName: lastName,
  //           phoneNumber: phoneNumber
  //         });

  //         //@ts-ignore
  //         this.txtInputFirstNameProps.value = firstName;

  //         //@ts-ignore
  //         this.txtInputLastNameProps.value = lastName;

  //         //@ts-ignore
  //         this.txtInputEmailProps.value = email;

  //         //@ts-ignore
  //         this.txtInputPhoneNumberProps.value = phoneNumber;

  //         this.registrationAndLoginType = this.userAttr.type;

  //         if (this.userAttr.country_code) {
  //           this.setState({ currentCountryCode: currentCountryCode });
  //         }

  //         if (
  //           configJSON.ACCOUNT_TYPE_EMAIL === this.registrationAndLoginType
  //         ) {
  //           this.setState({
  //             edtEmailEnabled: false,
  //             llChangePwdDummyShowContainerVisible: true
  //           });
  //           this.txtInputEmailProps.editable = false;
  //         } else if (
  //           configJSON.ACCOUNT_TYPE_SOCIAL === this.registrationAndLoginType
  //         ) {
  //           this.setState({
  //             edtEmailEnabled: false,
  //             llChangePwdDummyShowContainerVisible: false,
  //             llDoChangePwdContainerVisible: false
  //           });
  //           this.txtInputEmailProps.editable = false;
  //         } else if (
  //           configJSON.ACCOUNT_TYPE_PHONE === this.registrationAndLoginType
  //         ) {
  //           this.setState({
  //             llChangePwdDummyShowContainerVisible: true,
  //             edtMobileNoEnabled: false,
  //             countryCodeEnabled: false
  //           });
  //           this.txtInputPhoneNumberProps.editable = false;
  //         }
  //       }
  //     } else {
  //       //Check Error Response
  //       if (
  //         responseJson.errors &&
  //         responseJson.errors.length > 0 &&
  //         responseJson.errors[0].token
  //       ) {
  //         // this.showAlert("Session Expired", "Please Log in again.");
  //       } else {
  //         this.parseApiErrorResponse(responseJson);
  //       }
  //     }

  //     this.parseApiCatchErrorResponse(errorReponse);
  //   } else if (apiRequestCallId === this.apiChangePhoneValidation) {
  //     if (responseJson != null && responseJson.errors === undefined) {
  //       //On Change Phone Validation Success
  //       this.validateAndUpdateProfile();
  //     } else {
  //       this.parseApiErrorResponse(responseJson);
  //     }

  //     this.parseApiCatchErrorResponse(errorReponse);
  //   } else if (
  //     apiRequestCallId === this.apiCallMessageUpdateProfileRequestId
  //   ) {
  //     if (responseJson != null && responseJson.errors === undefined) {
  //       //On Change Phone Validation Success

  //       this.showAlert("Success", "Profile updated successfully.");
  //       this.enableDisableEditPassword(false);
  //       this.getUserProfile();
  //     } else {
  //       this.parseApiErrorResponse(responseJson);
  //     }
  //   }
  // }
  // else if (getName(MessageEnum.SessionResponseMessage) === message.id) {
  //   let requesterId = message.getData(
  //     getName(MessageEnum.SessionRequestedBy)
  //   );

  //   if (requesterId === this.uniqueSessionRequesterId) {
  //     const sessionToken = message.getData(
  //       getName(MessageEnum.SessionResponseToken)
  //     );
  //     this.authToken = sessionToken;

  //     this.getUserProfile();
  //   }
  // }
  // Customizable Area End
  // validateMobileAndThenUpdateUserProfile() {
  //   let countryCode: any = this.state.currentCountryCode;
  //   let mobileNo: any = this.state.phoneNumber;

  //   let error: any = "";

  //   error = this.validateCountryCodeAndPhoneNumber(countryCode, mobileNo);

  //   if (error) {
  //     this.showAlert(configJSON.errorTitle, error);

  //     return;
  //   }

  //   if (this.userAttr) {
  //     const countryCodeOld = this.userAttr.country_code;
  //     const mobileNoOld = this.userAttr.phone_number;

  //     if (
  //       Number.parseInt(countryCode) === Number.parseInt(countryCodeOld) ||
  //       countryCode === configJSON.hintCountryCode
  //     ) {
  //       countryCode = null;
  //     }

  //     if (
  //       Number.parseInt(this.state.phoneNumber) === Number.parseInt(mobileNoOld)
  //     ) {
  //       mobileNo = null;
  //     }
  //   }

  //   if (mobileNo && countryCode) {
  //     this.validateMobileOnServer(
  //       this.state.currentCountryCode,
  //       this.state.phoneNumber
  //     );
  //   } else {
  //     this.validateAndUpdateProfile();
  //   }
  // }

  // validateEmail(email: string) {
  //   let error = null;

  //   if (!this.isValidEmail(email)) {
  //     error = configJSON.errorEmailNotValid;
  //   }

  //   return error;
  // }

  // validateLastName(lastName: String) {
  //   return !this.isNonNullAndEmpty(lastName)
  //     ? "Last name " + configJSON.errorBlankField
  //     : null;
  // }

  // validateFirstName(firstName: String) {
  //   return !this.isNonNullAndEmpty(firstName)
  //     ? "First name " + configJSON.errorBlankField
  //     : null;
  // }

  // validateCountryCodeAndPhoneNumber(countryCode: string, phoneNumber: string) {
  //   let error = null;

  //   if (this.isNonNullAndEmpty(phoneNumber)) {
  //     if (
  //       !this.isNonNullAndEmpty(String(countryCode)) ||
  //       configJSON.hintCountryCode === countryCode
  //     ) {
  //       error = configJSON.errorCountryCodeNotSelected;
  //     }
  //   } else if (
  //     this.isNonNullAndEmpty(countryCode) &&
  //     configJSON.hintCountryCode !== countryCode
  //   ) {
  //     if (!this.isNonNullAndEmpty(phoneNumber)) {
  //       error = "Phone " + configJSON.errorBlankField;
  //     }
  //   }

  //   return error;
  // }

  // validateAndUpdateProfile() {
  //   let firstName = this.state.firstName;
  //   let lastName = this.state.lastName;
  //   let countryCode: any = this.state.currentCountryCode;

  //   let mobileNo = this.state.phoneNumber;
  //   let email = this.state.email;

  //   let currentPwd = this.state.currentPasswordText;
  //   let newPwd = this.state.newPasswordText;
  //   let reTypePwd = this.state.reTypePasswordText;

  //   const errorFirstName = this.validateFirstName(firstName);
  //   const errorLastName = this.validateLastName(lastName);

  //   const errorMobileNo = this.validateCountryCodeAndPhoneNumber(
  //     countryCode,
  //     mobileNo
  //   );
  //   const errorEmail = this.validateEmail(email);

  //   const errorCurrentPwd = this.validateCurrentPwd(currentPwd);
  //   const errorNewPwd = this.validatePassword(newPwd);
  //   const errorRetypePwd = this.validateRePassword(reTypePwd);

  //   let isValidForSignUp: boolean = true;

  //   if (errorFirstName != null) {
  //     this.showAlert(configJSON.errorTitle, errorFirstName);
  //     return false;
  //   } else if (errorLastName != null) {
  //     this.showAlert(configJSON.errorTitle, errorLastName);
  //     return false;
  //   }

  //   if (configJSON.ACCOUNT_TYPE_EMAIL === this.registrationAndLoginType) {
  //     if (errorMobileNo !== null) {
  //       this.showAlert(configJSON.errorTitle, errorMobileNo);
  //       return false;
  //     }
  //   } else if (
  //     configJSON.ACCOUNT_TYPE_SOCIAL === this.registrationAndLoginType
  //   ) {
  //     if (errorMobileNo != null) {
  //       this.showAlert(configJSON.errorTitle, errorMobileNo);
  //       return false;
  //     }
  //   } else if (
  //     configJSON.ACCOUNT_TYPE_PHONE === this.registrationAndLoginType
  //   ) {
  //     if (errorEmail != null) {
  //       this.showAlert(configJSON.errorTitle, errorEmail);

  //       return false;
  //     }
  //   } else {
  //     if (errorMobileNo != null) {
  //       this.showAlert(configJSON.errorTitle, errorMobileNo);

  //       return false;
  //     } else if (errorEmail != null) {
  //       this.showAlert(configJSON.errorTitle, errorEmail);

  //       return false;
  //     }
  //   }

  //   if (
  //     configJSON.ACCOUNT_TYPE_SOCIAL !== this.registrationAndLoginType &&
  //     this.state.llDoChangePwdContainerVisible
  //   ) {
  //     if (errorCurrentPwd != null) {
  //       this.showAlert(configJSON.errorTitle, errorCurrentPwd);
  //       return false;
  //     } else if (errorNewPwd != null) {
  //       this.showAlert(configJSON.errorTitle, errorNewPwd);
  //       return false;
  //     } else if (errorRetypePwd != null) {
  //       this.showAlert(configJSON.errorTitle, errorRetypePwd);
  //       return false;
  //     } else if (newPwd !== reTypePwd) {
  //       this.showAlert(
  //         configJSON.errorTitle,
  //         configJSON.errorBothPasswordsNotSame
  //       );
  //       return false;
  //     } else if (currentPwd === newPwd) {
  //       this.showAlert(
  //         configJSON.errorTitle,
  //         configJSON.errorCurrentNewPasswordMatch
  //       );
  //       return false;
  //     }
  //   }

  //   //Call update API
  //   if (this.userAttr) {
  //     let firstNameOld = this.userAttr.first_name;
  //     let lastNameOld = this.userAttr.last_name;
  //     let countryCodeOld = this.userAttr.country_code + "";
  //     let mobileNoOld = this.userAttr.phone_number + "";
  //     let emailOld = this.userAttr.email;
  //     this.registrationAndLoginType = this.userAttr.type;

  //     if (this.isNonNullAndEmpty(firstName) && firstName === firstNameOld) {
  //       firstName = null;
  //     }

  //     if (this.isNonNullAndEmpty(lastName) && lastName === lastNameOld) {
  //       lastName = null;
  //     }

  //     if (
  //       this.isNonNullAndEmpty(countryCode) &&
  //       countryCode === countryCodeOld
  //     ) {
  //       countryCode = null;
  //     }

  //     if (this.isNonNullAndEmpty(mobileNo) && mobileNo === mobileNoOld) {
  //       mobileNo = null;
  //     }

  //     if (countryCode != null || mobileNo != null) {
  //       if (countryCode == null) {
  //         countryCode = countryCodeOld;
  //       }

  //       if (mobileNo == null) {
  //         mobileNo = mobileNoOld;
  //       }
  //     }

  //     if (this.isNonNullAndEmpty(email) && email === emailOld) {
  //       email = null;
  //     }
  //   }

  //   if (
  //     this.isNonNullAndEmpty(firstName) ||
  //     this.isNonNullAndEmpty(lastName) ||
  //     this.isNonNullAndEmpty(countryCode) ||
  //     this.isNonNullAndEmpty(mobileNo) ||
  //     this.isNonNullAndEmpty(email) ||
  //     (this.isNonNullAndEmpty(currentPwd) && this.isNonNullAndEmpty(newPwd))
  //   ) {
  //     const header = {
  //       "Content-Type": configJSON.contentTypeApiUpdateUser,
  //       token: this.authToken
  //     };

  //     let data: any = {
  //       first_name: this.state.firstName,
  //       last_name: this.state.lastName
  //     };

  //     if (this.state.edtMobileNoEnabled) {
  //       if (
  //         configJSON.hintCountryCode !== countryCode &&
  //         this.isNonNullAndEmpty(String(countryCode)) &&
  //         this.isNonNullAndEmpty(String(mobileNo))
  //       ) {
  //         data = {
  //           ...data,
  //           ...{ new_phone_number: String(countryCode) + String(mobileNo) }
  //         };
  //       }
  //     }

  //     if (this.isNonNullAndEmpty(email)) {
  //       data = { ...data, ...{ new_email: email } };
  //     }

  //     if (
  //       this.isNonNullAndEmpty(currentPwd) &&
  //       this.isNonNullAndEmpty(newPwd)
  //     ) {
  //       data = {
  //         ...data,
  //         ...{ current_password: currentPwd, new_password: newPwd }
  //       };
  //     }

  //     const httpBody = {
  //       data: data
  //     };

  //     const requestMessage = new Message(
  //       getName(MessageEnum.RestAPIRequestMessage)
  //     );
  //     this.apiCallMessageUpdateProfileRequestId = requestMessage.messageId;
  //     requestMessage.addData(
  //       getName(MessageEnum.RestAPIResponceEndPointMessage),
  //       configJSON.apiEndPointUpdateUser
  //     );

  //     requestMessage.addData(
  //       getName(MessageEnum.RestAPIRequestHeaderMessage),
  //       JSON.stringify(header)
  //     );

  //     requestMessage.addData(
  //       getName(MessageEnum.RestAPIRequestBodyMessage),
  //       JSON.stringify(httpBody)
  //     );

  //     requestMessage.addData(
  //       getName(MessageEnum.RestAPIRequestMethodMessage),
  //       configJSON.apiUpdateUserType
  //     );

  //     runEngine.sendMessage(requestMessage.id, requestMessage);
  //   }
  // }

  // validateCurrentPwd(currentPwd: any) {
  //   if (!this.isNonNullAndEmpty(currentPwd)) {
  //     return configJSON.errorCurrentPasswordNotValid;
  //   } else {
  //     return null;
  //   }
  // }

  // validatePassword(newPwd: any) {
  //   if (!this.passwordReg.test(newPwd)) {
  //     return configJSON.errorNewPasswordNotValid;
  //   } else {
  //     return null;
  //   }
  // }

  // validateRePassword(reTypePwd: any) {
  //   if (!this.passwordReg.test(reTypePwd)) {
  //     return configJSON.errorReTypePasswordNotValid;
  //   } else {
  //     return null;
  //   }
  // }

  // isNonNullAndEmpty(value: String) {
  //   return (
  //     value !== undefined &&
  //     value !== null &&
  //     value !== "null" &&
  //     value.trim().length > 0
  //   );
  // }

  // validateMobileOnServer(countryCode: any, mobileNo: any) {
  //   const header = {
  //     "Content-Type": configJSON.contenttypeApiValidateMobileNo,
  //     token: this.authToken
  //   };

  //   const data = {
  //     new_phone_number: countryCode + mobileNo
  //   };

  //   const httpBody = {
  //     data: data
  //   };

  //   const requestMessage = new Message(
  //     getName(MessageEnum.RestAPIRequestMessage)
  //   );

  //   this.apiChangePhoneValidation = requestMessage.messageId;
  //   requestMessage.addData(
  //     getName(MessageEnum.RestAPIResponceEndPointMessage),
  //     configJSON.endPointApiValidateMobileNo
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
  //     configJSON.callTypeApiValidateMobileNo
  //   );

  //   runEngine.sendMessage(requestMessage.id, requestMessage);
  // }

  // enableDisableEditPassword(isEditable: boolean) {
  //   if (configJSON.ACCOUNT_TYPE_SOCIAL === this.registrationAndLoginType) {
  //     this.setState({
  //       edtEmailEnabled: false,
  //       llDoChangePwdContainerVisible: false,
  //       llChangePwdDummyShowContainerVisible: false
  //     });
  //   } else {
  //     if (isEditable) {
  //       this.setState({
  //         llDoChangePwdContainerVisible: true,
  //         llChangePwdDummyShowContainerVisible: false
  //       });
  //     } else {
  //       this.setState({
  //         llDoChangePwdContainerVisible: false,
  //         llChangePwdDummyShowContainerVisible: true,
  //         currentPasswordText: "",
  //         newPasswordText: "",
  //         reTypePasswordText: ""
  //       });
  //     }
  //   }
  // }

  // goToPrivacyPolicy() {
  //   const msg: Message = new Message(
  //     getName(MessageEnum.NavigationPrivacyPolicyMessage)
  //   );
  //   msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
  //   this.send(msg);
  // }

  // goToTermsAndCondition() {
  //   const msg: Message = new Message(
  //     getName(MessageEnum.NavigationTermAndConditionMessage)
  //   );
  //   msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
  //   this.send(msg);
  // }

  // isStringNullOrBlank(str: string) {
  //   return str === null || str.length === 0;
  // }

  // isValidEmail(email: string) {
  //   return this.emailReg.test(email);
  // }

  // requestSessionData() {
  //   const msg: Message = new Message(
  //     getName(MessageEnum.SessionRequestMessage)
  //   );
  //   this.uniqueSessionRequesterId = msg.messageId;
  //   this.send(msg);
  // }

  // getUserProfile() {
  //   const requestMessage = new Message(
  //     getName(MessageEnum.RestAPIRequestMessage)
  //   );

  //   this.userProfileGetApiCallId = requestMessage.messageId;

  //   requestMessage.addData(
  //     getName(MessageEnum.RestAPIResponceEndPointMessage),
  //     configJSON.endPointApiGetUserProfile
  //   );

  //   const header = {
  //     "Content-Type": configJSON.contentTypeApiGetUserProfile,
  //     token: this.authToken
  //   };

  //   requestMessage.addData(
  //     getName(MessageEnum.RestAPIRequestHeaderMessage),
  //     JSON.stringify(header)
  //   );

  //   requestMessage.addData(
  //     getName(MessageEnum.RestAPIRequestMethodMessage),
  //     configJSON.methodTypeApiGetUserProfile
  //   );

  //   runEngine.sendMessage(requestMessage.id, requestMessage);
  // }

  // getValidations() {
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

  // // Customizable Area Start
  // txtInputFirstNameProps = {
  //   onChangeText: (text: string) => {
  //     this.setState({ firstName: text });

  //     //@ts-ignore
  //     this.txtInputFirstNameProps.value = text;
  //   }

  // };

  // txtInputLastNameProps = {
  //   onChangeText: (text: string) => {
  //     this.setState({ lastName: text });

  //     //@ts-ignore
  //     this.txtInputLastNameProps.value = text;
  //   }
  // };

  // txtInputPhoneNumberlWebProps = {
  //   onChangeText: (text: string) => {
  //     if (this.txtInputPhoneNumberlWebProps.editable) {
  //       this.setState({ phoneNumber: text })

  //       //@ts-ignore
  //       this.txtInputPhoneNumberProps.value = text;
  //     }
  //   },
  //   editable: true
  // };

  // txtInputPhoneNumberlMobileProps = {
  //   ...this.txtInputPhoneNumberlWebProps,
  //   autoCompleteType: "tel",
  //   keyboardType: "phone-pad",
  // };

  // txtInputPhoneNumberProps = this.isPlatformWeb()
  //   ? this.txtInputPhoneNumberlWebProps
  //   : this.txtInputPhoneNumberlMobileProps;

  // txtInputEmailWebProps = {
  //   value: "",
  //   editable: true,
  //   onChangeText: (text: string) => {
  //     if (this.txtInputEmailProps.editable) {
  //       this.setState({ email: text })
  //       this.txtInputEmailProps.value = text
  //     }
  //   }
  // }

  // txtInputEmailMobileProps = {
  //   ...this.txtInputEmailWebProps,
  //   keyboardType: "email-address",
  // }

  // txtInputEmailProps = this.isPlatformWeb()
  //   ? this.txtInputEmailWebProps
  //   : this.txtInputEmailMobileProps;

  // btnEnableEditPasswordProps = {
  //   onPress: () => this.enableDisableEditPassword(true)
  // }

  // txtInputCurrentPasswordProps = {
  //   onChangeText: (text: string) => {
  //     this.setState({ currentPasswordText: text })
  //     this.txtInputCurrentPasswordProps.value = text
  //   },
  //   value: "",
  //   secureTextEntry: true
  // }

  // btnPasswordShowHideButtonProps = {
  //   onPress: () => {
  //     this.setState({ enablePasswordField: !this.txtInputCurrentPasswordProps.secureTextEntry });
  //     this.txtInputCurrentPasswordProps.secureTextEntry = !this.txtInputCurrentPasswordProps.secureTextEntry
  //     this.imgPasswordShowhideProps.source = this.txtInputCurrentPasswordProps.secureTextEntry ? imgPasswordVisible : imgPasswordInVisible
  //   }
  // }

  // imgPasswordShowhideProps = {
  //   source: imgPasswordVisible
  // }

  // txtInputNewPasswordProps = {
  //   onChangeText: (text: string) => {
  //     this.setState({ newPasswordText: text })
  //     this.txtInputNewPasswordProps.value = text
  //   },
  //   value: "",
  //   secureTextEntry: true
  // }

  // btnNewPasswordShowHideButtonProps = {
  //   onPress: () => {
  //     this.setState({
  //       enableNewPasswordField: !this.txtInputNewPasswordProps.secureTextEntry
  //     });
  //     this.txtInputNewPasswordProps.secureTextEntry = !this.txtInputNewPasswordProps.secureTextEntry
  //     this.imgNewPasswordShowhideProps.source = this.txtInputNewPasswordProps.secureTextEntry ? imgPasswordVisible : imgPasswordInVisible
  //   }
  // }

  // imgNewPasswordShowhideProps = {
  //   source: imgPasswordVisible
  // }

  // txtInputReTypePasswordProps = {
  //   onChangeText: (text: string) => {
  //     this.setState({ reTypePasswordText: text })
  //     this.txtInputReTypePasswordProps.value = text
  //   },
  //   secureTextEntry: true,
  //   value: ""
  // }

  // imgReTypePasswordShowhideProps = {
  //   source: imgPasswordVisible
  // }

  // btnReTypePasswordShowHideProps = {
  //   onPress: () => {
  //     this.setState({
  //       enableReTypePasswordField: !this.txtInputReTypePasswordProps.secureTextEntry
  //     });
  //     this.txtInputReTypePasswordProps.secureTextEntry = !this.txtInputReTypePasswordProps.secureTextEntry
  //     this.imgReTypePasswordShowhideProps.source = this.txtInputNewPasswordProps.secureTextEntry ? imgPasswordVisible : imgPasswordInVisible
  //   }
  // }

  // btnDisableEditPasswordProps = {
  //   onPress: () => this.enableDisableEditPassword(false)
  // }

  // Customizable Area End

  sendAppTimeapicall = async () => {
    let timeValuestring = await AsyncStorage.getItem("APPtime")
    let prevdate = await AsyncStorage.getItem("APPdate")
    console.log("daydaydaydreamTime", timeValuestring)
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Months are 0-indexed, so add 1 to get the correct month.
    const day = today.getDate();

    console.log(`${year}-${month}-${day}`);
    let finalday = `${day}/${month}/${year}`
    let timeinSeconds

    if (timeValuestring) {
      timeinSeconds = this.minutesToHms(JSON.parse(timeValuestring))

    }
    let endpoint = '/save/daily/time/activity'
    let body = {
      time: timeinSeconds,
      date: finalday
    }


    console.log("daydaydaydreamBody", body)
    this.dailyUsageTimeID = await this.apiCall({
      contentType: configJSON.offlineContentType,
      method: "post",
      endPoint: endpoint,
      body: body,
    })
  }
  minutesToHms = (minutes: any) => {

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(remainingMinutes).padStart(2, '0');
    const formattedSeconds = '00';

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

}
