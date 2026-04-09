import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";
import {
  GoogleSignin,
  statusCodes
} from "@react-native-community/google-signin";
import { appleAuth, } from '@invertase/react-native-apple-authentication';
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsynchStoragekey, STRINGS, VALIDATION_TIMER } from "../../../mobile/src/utils";
import { StackActions, NavigationActions } from 'react-navigation';
import Context from "../../../components/src/context/context";
import { BackHandler } from 'react-native';

export interface Props {
  navigation: any;
  id: string;
  subscriptionState:any;
  addSubscription:(val:any)=>void;
  cancelSubscription:()=>void;
}

interface S {
  txtInputValue: string;
  error: string;
  showLoader: boolean;
  visible: boolean;
  language: string;
}

interface SS {
  id: any;
}

export default class LandingController extends BlockComponent<
  Props,
  S,
  SS
>
{

  ApiCallId: any;
  appleApiCallId: any;
  backHandler:any

  static contextType = Context;
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);
    this.subScribedMessages = [
      // getName(MessageEnum.AccoutLoginSuccess),
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.CountryCodeMessage)
    ];

this.state = {
  txtInputValue: "",
  error: "",
  showLoader: false,
  visible: false,
  language: "English 🇬🇧"
};
runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

// Customizable Area Start
// Customizable Area End
  }

  async componentDidMount(): Promise<void> {
    const {initLanguage} = this.context;
    await initLanguage();
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.displaylanguage());
    const langue = await AsyncStorage.getItem("appLanguage");
    console.log(langue, "appLanguage from controller");
    if(langue == "English"){
      this.setState({language : "English 🇬🇧"})
      // await AsyncStorage.setItem("LangaugeDisplay", langue);
    }else if(langue == "Français"){
      this.setState({language : "Français 🇫🇷"})
      await AsyncStorage.setItem("LangaugeDisplay",langue);
    }
    try {
      if (Platform.OS == "android") {
        GoogleSignin.configure();
      } else {
        GoogleSignin.configure({
          webClientId:
            Platform.OS === "ios"
              ? "1097363110035-l6tqg6t332vhovlar0ukl8u7i36v1s2q.apps.googleusercontent.com"
              : "445080135670-usn9tepn8re2n7l9kkmum0tgv45eqf9o.apps.googleusercontent.com",
          offlineAccess: true,
          iosClientId:
            "1097363110035-l6tqg6t332vhovlar0ukl8u7i36v1s2q.apps.googleusercontent.com",
        });
      }
    } catch (err) {
      console.warn("Landing: GoogleSignin.configure failed", err);
    }
  }

  async componentWillUnmount() {
    this.backHandler.remove();
  }

  async receive(from: string, message: Message) {

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
  if (apiRequestCallId && responseJson) {
    if (apiRequestCallId === this.ApiCallId) {
      this.setState({ showLoader: true })
      console.log("reponse---", responseJson);
      if (!responseJson?.errors) {
        let usrObj = responseJson?.data?.attributes;
        usrObj['type'] = responseJson?.data?.type
        await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN, responseJson?.meta?.token);
        await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.LOGIN_ID, `${responseJson?.data?.id}`);
        await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.USER_INFO, JSON.stringify(usrObj));
        // await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.USER_SUBSCRIPTION, `${responseJson?.data?.attributes?.is_subscribed?"subscribed":"unsubscribed"}`);
        // await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_TRANSACTION_RECEIPT,responseJson?.data?.attributes?.subscription_id??'');
        // await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_TRANSACTION_DATE,responseJson?.data?.attributes?.subscription_id??'');
        // await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_EXPIRY_DATE,responseJson?.data?.attributes?.expired_at);
            console.log('set locale to subscribed')
        // await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.USER_SUBSCRIPTION,"subscribed");
        this.props.addSubscription({
          subscriptionId: responseJson?.data?.attributes?.subscription_id,
          transactionDate: responseJson?.data?.attributes?.subscription_date,
          status: responseJson?.data?.attributes?.is_subscribed,
          expiryDate: responseJson?.data?.attributes?.expired_at,
          userSubscription: responseJson?.data?.attributes?.is_subscribed?"subscribed" :"unsubscribed"
        })

        if (responseJson?.meta?.message) {
          // Login User 
          this.props.navigation.dispatch(
            StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: 'Authenticated' })],
              key: null
            })
          )
        }
        else {
          // SignUp User 
          this.props.navigation.replace('SubCriptionScreen')
        }
      }
      else {
        this.setState({ showLoader: false, error: !!responseJson?.errors && responseJson?.errors?.length > 0 ? Object.values(responseJson?.errors[0]) : STRINGS.MESSAGE.LOGIN_FAIL })
        setTimeout(() => {
          this.setState({ error: '' })
        }, 1500);
      }
    }
    else if (apiRequestCallId === this.appleApiCallId) {
      this.setState({ showLoader: true })
      console.log("reponse---", responseJson);
      if (!responseJson?.errors) {
        let usrObj = responseJson?.data?.attributes;
        usrObj['type'] = responseJson?.data?.type
        await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN, responseJson?.meta?.token);
        await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.LOGIN_ID, `${responseJson?.data?.id}`);
        await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.USER_INFO, JSON.stringify(usrObj));
        if (responseJson?.meta?.message) {
          // Login User 
          this.props.navigation.dispatch(
            StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: 'Authenticated' })],
              key: null
            })
          )
        }
        else {
          // SignUp User 
          this.props.navigation.replace('SubCriptionScreen')
        }
      }
      else {
        this.setState({ showLoader: false, error: !!responseJson?.errors && responseJson?.errors?.length > 0 ? Object.values(responseJson?.errors[0]) : STRINGS.MESSAGE.LOGIN_FAIL })
        setTimeout(() => {
          this.setState({ error: '' })
        }, 1500);
      }
    }
    else {

    }
   
  }
  runEngine.debugLog("Message Recived", message);
}
  
  }

  txtInputWebProps = {
    onChangeText: (text: string) => {
      this.setState({ txtInputValue: text });
    },
    secureTextEntry: false,
  };

  doButtonPressed() {
    let msg = new Message(getName(MessageEnum.AccoutLoginSuccess));
    msg.addData(
      getName(MessageEnum.AuthTokenDataMessage),
      this.state.txtInputValue
    );
    this.send(msg);
  }

  displaylanguage = async () => {
    const langue = await AsyncStorage.getItem("appLanguage");
    console.log(langue, "appLanguage from landing controller");
    if (langue == "English") {
      this.setState({ language: "English 🇬🇧" });
    } else if (langue == "Français") {
      this.setState({ language: "Français 🇫🇷" });
    }
  }

  signOut = async () => {
    if (await GoogleSignin.isSignedIn()) {
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      } catch (error) {
        console.error(error);
      }
    }
  };

  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      this.signOut().then(async _ => {
        const userInfo = await GoogleSignin.signIn();
        if (userInfo) {
          await this.googleLogin(userInfo)
        }
        // this.setState({ userInfo });
      })
    } catch (error: any) {
      console.log('---------', error);
      this.setState({ error: error.toString(), showLoader: false })
      setTimeout(() => {
        this.setState({ error: '' })
      }, VALIDATION_TIMER);
      if (error.code === statusCodes?.SIGN_IN_CANCELLED) {

  } else if (error.code === statusCodes?.IN_PROGRESS) {

  } else if (error.code === statusCodes?.PLAY_SERVICES_NOT_AVAILABLE) {

  } else {
    // some other error happened
  }
}
  };

  onAppleButtonPress = async () => {
    // performs login request
    if (appleAuth.isSupported) {
      await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        // Note: it appears putting FULL_NAME first is important, see issue #293
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      }).then(appleAuthRequestResponse => {
        console.log('apple=======', appleAuthRequestResponse);
        if (appleAuthRequestResponse?.email != null) {
          AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.APPLE_CRED_DATA, JSON.stringify(appleAuthRequestResponse))
        }
        if (appleAuthRequestResponse) {
          this.appleLogin(appleAuthRequestResponse)
        }
        else {
          this.setState({ showLoader: false, error: STRINGS.MESSAGE.APPLE_LOGIN_FAIL })
          setTimeout(() => {
            this.setState({ error: '' })
          }, 1500);
        }
      });
    }
    else {
      this.setState({ showLoader: false, error: STRINGS.MESSAGE.APPLE_LOGIN_NOT_SUPPORTED })
      setTimeout(() => {
        this.setState({ error: '' })
      }, VALIDATION_TIMER);
    }

  }

  async googleLogin(userInfo: any) {
    this.setState({ showLoader: true })
    const langue = await AsyncStorage.getItem("appLanguage");
   
    const header = {
      "Content-Type": "application/json"
    };

    const attrs = {
      first_name: userInfo?.user?.givenName,
      last_name: userInfo?.user?.familyName,
      email: userInfo?.user?.email,
      unique_auth_id: userInfo?.user?.id,
      language : langue
    };

    console.log("googleloginsocial111", attrs);
    const data = {
      type: "google",
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
  'account_block/accounts'
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
  'POST'
);

runEngine.sendMessage(requestMessage.id, requestMessage);

return true;
  }

  async appleLogin(userInfo: any) {
    const langue = await AsyncStorage.getItem("appLanguage");
    let appleId = userInfo.user ?? '';
    let appleToken = userInfo.identityToken ?? '';
    let appleEmail = userInfo.email ?? '';
    let firstName = userInfo.fullName?.givenName ?? "";
    let lastName = userInfo.fullName?.familyName ?? "";
    if (appleEmail == '') {
      let storedAppleData = await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.APPLE_CRED_DATA)
      if (storedAppleData) {
        let jsonAppleData = JSON.parse(storedAppleData);
        if (jsonAppleData?.user == appleId) {
          appleEmail = jsonAppleData.email ?? '';
          firstName = jsonAppleData.fullName?.givenName ?? "";
          lastName = jsonAppleData.fullName?.familyName ?? "";
        }
      }
    }

this.setState({ showLoader: true })
const header = {
  "Content-Type": "application/json"
};
const attrs = {
  first_name: firstName,
  last_name: lastName,
  email: appleEmail,
  unique_auth_id: appleId,
  language : langue
};
const data = {
  type: "apple",
  attributes: attrs
};
const httpBody = {
  data: data
};
console.log('========-----===', httpBody);


const requestMessage = new Message(
  getName(MessageEnum.RestAPIRequestMessage)
);

this.appleApiCallId = requestMessage.messageId;
requestMessage.addData(
  getName(MessageEnum.RestAPIResponceEndPointMessage),
  'account_block/accounts'
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
  'POST'
);

runEngine.sendMessage(requestMessage.id, requestMessage);

return true;
  }
}

