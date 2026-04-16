import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AsynchStoragekey from '../../../mobile/src/utils/asynchKeys';
import { StackActions, NavigationActions } from 'react-navigation';
import SplashScreen from "react-native-splash-screen";
import { Linking, Platform } from "react-native";
import URLParse from 'url-parse';
import Loader from "../../../components/src/Loader";
import { STRINGS } from "../../../mobile/src/utils";
import Context from "../../../components/src/context/context";
import { langaugeFunction } from "../../LanguageOptions/src/component/i18n/i18n.config";
import DeviceInfo from "react-native-device-info";
import { isConnected } from "../../../mobile/src/utils/internetConnection";
import { getSplashResetKind } from "../../../../react-native/src/compliance/splashRouting";


// Customizable Area Start
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;

  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  timeout: any;
  isVisible: boolean;
  showLoader: boolean;
  ModalVisible:boolean;
  link:string;
  appstatusNumber:number
  // Customizable Area End
}

interface SS {
  id: any;


}

export default class SplashscreenController extends BlockComponent<
  Props,
  S,
  SS
> {
  emailVerifiedCallId: any;
  getSearchDetailsLanguage:any;
  showLoader: boolean;
  getSearchresultappId:any
  navigated: boolean = false; // Add flag to prevent double navigation
  static contextType = Context;
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);
    this.subScribedMessages = [
      // Customizable Area Start
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.CountryCodeMessage)
      // Customizable Area End
    ]

    this.state = {
      timeout: 3000,
      isVisible: false,
       ModalVisible:false,
       link:"",
       appstatusNumber:0,
       showLoader: false // Add missing required state property
    }

    // Customizable Area Startg
    // Customizable Area End
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }



  // Customizable Area Start
  async componentDidMount() {
    console.log("Splashscreen - componentDidMount started");
    SplashScreen.hide(); // Re-add missing hide call
    const {initLanguage} = this.context;
    this.send(new Message(getName(MessageEnum.RequestUserCredentials)));
    super.componentDidMount();

    // Safety timeout: navigate after 5 seconds if nothing else triggers it
    setTimeout(() => {
      if (!this.navigated) {
        console.log("Splashscreen - Safety timeout triggered (5s)");
        this.goingHome();
      }
    }, 5000);

    console.log("Splashscreen - Calling getAppdetails");
    await this.getAppdetails()

    console.log("Splashscreen - Initializing language");
    await initLanguage(); 

    this.getSearchresultsSplash();
  }

  async componentWillUnmount() {
    // Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleOpenURL = (event: any) => {
    console.log('----222222 ', event.url)
    this.navigate(event?.url);
  };

  navigate(url: any,) {


    if (url) {
      const parsedUrl = URLParse(url, true);
      // const pathName = parsedUrl.href || '';
      // const splittedPath = pathName.split('/');
      if (parsedUrl.pathname ===
        "/account/accounts/email_confirmation") {
        this.emailVerifiedApi(parsedUrl?.query?.token)

      } else if(parsedUrl.pathname === "/password/reset") {
        SplashScreen.hide()
        let splitedArr = url?.split('token=');
        if(splitedArr.length > 0)
        this.props.navigation.navigate("ForgotPasswordOTP", { token: splitedArr[1] })
      }
      else{}
    }
  };
  // --------------------   EmailVerified Api -------------------//
  async emailVerifiedApi(token:any) {

    const header = {
      "Content-Type": configJSON.contentTypeApiUpdateUser,
      "token": token
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)

    );

    this.emailVerifiedCallId = requestMessage.messageId;
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
      JSON.stringify({})
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.changeEmailMethodType
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);

    return true;

  }

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

      if (apiRequestCallId && responseJson) {
        if (apiRequestCallId === this.emailVerifiedCallId) {

          if (responseJson?.message) {
            this.props.navigation.navigate('ChangeEmail', { apiSucess: true })
          }
          else {
            this.props.navigation.navigate('ChangeEmail', { apiSucess: false, error: (!!responseJson?.errors && responseJson?.errors?.length > 0) ? Object.values(responseJson?.errors[0]) : STRINGS.MESSAGE.EMAIL_VERIFY_ERROR })
          }
        }

        if(apiRequestCallId === this.getSearchDetailsLanguage){
          if (responseJson.errors) {
            console.log("error in updating language", responseJson.error);
          } else {
            console.log("async recieve function from splash",responseJson);
            const data = JSON.stringify(responseJson.meta.translations);
            await AsyncStorage.setItem("langData", data);
            const dataa = await AsyncStorage.getItem("langData");
            console.log("data from splash screen",dataa);
            langaugeFunction();
          }
        }


        if(apiRequestCallId==this.getSearchresultappId)
        {
          console.log("Splashscreen - App details response received", responseJson);
          if (responseJson.errors) {
            console.log("error in updating language", responseJson.error);
            this.goingHome()
          } else {
            console.log("data from app details",responseJson);
            if(responseJson.app_details?.length==1)
            {
              console.log("Splashscreen - Single app detail, going home");
              this.goingHome()
              return
            }
            let iosData=responseJson?.app_details?.filter((e:any)=>e?.update_version_ios)[0]
            let androidData=responseJson?.app_details?.filter((e:any)=>e?.android_app_link)[0]
          let version=await DeviceInfo.getVersion()
          let currentOS=Platform.OS
          console.log(version,"data from app details")
             console.log(currentOS,"data from app details")
          if(currentOS=='ios')
          {
          if (!iosData) {
            this.goingHome()
            return
          }
          let compared=  this.compareVersions(version,iosData?.update_version_ios?.trim())
          console.log(compared,"data from app details")
              //  this.setState({appDetailapistatus:iosData,os:'ios',buildnumber:version})
              if(iosData?.update_status=="force_update")
              {
                if(compared==-1)
                {
                 
                    this.setState({ModalVisible:true,link:iosData?.ios_app_link,appstatusNumber:2})
                    SplashScreen.hide();
                }
                else{
                  this.goingHome()
                }
                return  
              }
               else if(iosData?.update_status=="optional_update")
              { let iosobj=await AsyncStorage.getItem("splashscreenios")
              console.log(iosobj,"data from app detailssssskk")
              let version=iosData?.update_version_ios?.toString()
              if(!iosobj)
              {
                console.log(iosobj,"data from app detailsssss null")
               
                  await AsyncStorage.setItem("splashscreenios",JSON.stringify({[version]:version}))
              }
              else{
                let obj=JSON.parse(iosobj)
                let key=String( iosData?.update_version_ios)
                console.log("here am i in spash",key,obj[key])

                if(obj[key])
                {
                   this.goingHome()
                   return
                }
                await AsyncStorage.setItem("splashscreenios",JSON.stringify({[version]:version}))
              }
                if(compared==-1)
                {
                  
                      this.setState({ModalVisible:true,link:iosData?.ios_app_link,appstatusNumber:3})
                      SplashScreen.hide();
                }
                else{
                  this.goingHome()
                }
                return  
              }
              else if (iosData?.update_status=="maintanance")
              {
                console.log("data from app details i am in maintanance")
                this.setState({ModalVisible:true,link:iosData?.ios_app_link,appstatusNumber:1})
                SplashScreen.hide();
                // this.goingHome()
                return  
              }
              else{
                // this.setState({Mod})
                this.goingHome()
              }
          }
          else{
            if (!androidData) {
              this.goingHome()
              return
            }
            console.log(androidData?.update_version_android,version,"data from app details")
            let compared=  this.compareVersions(version,androidData?.update_version_android?.trim())
              if(androidData?.update_status=="force_update")
              {
                if(compared==-1)
                {
                    this.setState({ModalVisible:true,link:androidData?.android_app_link,appstatusNumber:2})
                
                  }
                  else{
                    this.goingHome()
                  }
                  return
                  
              }
               else if(androidData?.update_status=="optional_update")
              {
                let androidobj=await AsyncStorage.getItem("splashscreenandroid")
                console.log(androidobj,"data from app detailssssskk")
                let version=androidData?.update_version_android?.toString()
                if(!androidobj)
                {
                  console.log(androidobj,"data from app detailsssss null")
                 
                    await AsyncStorage.setItem("splashscreenandroid",JSON.stringify({[version]:version}))
                }
                else{
                  let obj=JSON.parse(androidobj)
                  let key=String( androidData?.update_version_android)
                  console.log("here am i in spash",key,obj[key])

                  if(obj[key])
                  {
                     this.goingHome()
                     return
                  }
                  await AsyncStorage.setItem("splashscreenandroid",JSON.stringify({[version]:version}))
                }

                  if(compared==-1)
                  {
                      this.setState({ModalVisible:true,link:androidData?.android_app_link,appstatusNumber:3})
                     
                    }
                    else{
                      this.goingHome()
                    }
          
               return
              }
              else if (androidData?.update_status=="maintanance")
              {
                this.setState({ModalVisible:true,link:androidData?.android_app_link,appstatusNumber:1})
                return  
              }
              else{
                // this.setState({Mod})
                this.goingHome()
                return 
              }
              
          }
          }
        }
      }
    }
  }
 compareVersions(version1:any, version2:any) {
    if (version1 == null || version2 == null || String(version2).trim() === '') {
      return 0
    }
    const v1Parts = String(version1).split('.').map(Number);
    const v2Parts = String(version2).split('.').map(Number);

    for (let i = 0; i < 3; i++) {
        if (v1Parts[i] < v2Parts[i]) {
            return -1; // version1 is smaller
        } else if (v1Parts[i] > v2Parts[i]) {
            return 1; // version1 is larger
        }
    }

    return 0; // versions are equal
}


  goingHome = () => {
    if (this.navigated) {
      console.log("Splashscreen - already navigating, skipping goingHome");
      return;
    }
    this.navigated = true;
    console.log("Splashscreen - goingHome called");

    const finishToHome = () => {
      setTimeout(() => {
        this.goToHome();
      }, this.state.timeout);
    };

    /* If getInitialURL rejects or returns a URL we do not handle, we must still
     * leave the splash. navigated is already true, so the 5s safety timeout
     * will not run — without catch / fallback the UI stays blank forever. */
    Linking.getInitialURL()
      .then((url) => {
        if (url == null || url === "") {
          console.log(
            "Splashscreen - No deep link, proceeding to goToHome in",
            this.state.timeout,
            "ms"
          );
          finishToHome();
          return;
        }
        console.log("Splashscreen - Deep link detected, navigating to", url);
        this.navigate(url);
        try {
          const parsedUrl = URLParse(url, true);
          const pathname = parsedUrl.pathname || "";
          const handled =
            pathname === "/account/accounts/email_confirmation" ||
            pathname === "/password/reset";
          if (!handled) {
            finishToHome();
          }
        } catch (e) {
          console.warn("Splashscreen - URL parse failed", e);
          finishToHome();
        }
      })
      .catch((err) => {
        console.warn("Splashscreen - getInitialURL failed", err);
        finishToHome();
      });

    Linking.addEventListener("url", this.handleOpenURL);
  };


  async goToHome() {
    console.log("Splashscreen - goToHome starting navigation");
    const {initLanguage } = this.context;
    this.getSearchresultsSplash();
    await initLanguage(); 
    
    console.log("Splashscreen - Hiding native splash and checking token");
    SplashScreen.hide();
    let token = await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN)
    const nav = this.props.navigation;
    const splashKind = await getSplashResetKind(token);
    try {
      if (splashKind === "authenticated") {
        nav.dispatch(
          StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "Authenticated",
                action: NavigationActions.navigate({ routeName: "Dashboard" }),
              }),
            ],
            key: null,
          })
        );
      } else if (splashKind === "non_auth") {
        nav.dispatch(
          StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "NonAuthenticated",
                action: NavigationActions.navigate({
                  routeName: "EmailAccountLoginBlock",
                }),
              }),
            ],
            key: null,
          })
        );
      } else if (splashKind === "compliance_age") {
        nav.dispatch(
          StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "ComplianceOnboarding",
                params: { step: "age" },
              }),
            ],
            key: null,
          })
        );
      } else {
        nav.dispatch(
          StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "ComplianceOnboarding",
                params: { step: "legal" },
              }),
            ],
            key: null,
          })
        );
      }
    } catch (e) {
      console.warn("Splashscreen - StackActions.reset failed, retrying navigate", e);
      if (splashKind === "authenticated") {
        try {
          nav.navigate("Authenticated");
        } catch (_) {}
      } else if (splashKind === "non_auth") {
        try {
          nav.dispatch(
            StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: "NonAuthenticated",
                  action: NavigationActions.navigate({
                    routeName: "EmailAccountLoginBlock",
                  }),
                }),
              ],
              key: null,
            })
          );
        } catch (_) {
          nav.navigate("NonAuthenticated");
        }
      } else {
        try {
          nav.navigate("ComplianceOnboarding", {
            step: splashKind === "compliance_age" ? "age" : "legal",
          });
        } catch (_) {}
      }
    }
  }

  getSearchresultsSplash = async () => {
    const applanguage = await AsyncStorage.getItem("appLanguage");
    console.log(applanguage,"appLanguage from Splashscreen");
    const header = {
      "Content-Type": configJSON.contentTypeApiUpdateUser,
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    const body = {
      language: applanguage,
    };

    this.getSearchDetailsLanguage = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.apiEndPointUpdateLanguge
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.changeEmailMethodType
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(body)
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
  };


  getAppdetails = async () => {
    let connectionStatus = await isConnected().then(response => response).catch(err => console.log(err))

    if(!connectionStatus)
    {
      this.goingHome()
      return
    }

    const header = {
      "Content-Type": configJSON.contentTypeApiUpdateUser,
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getSearchresultappId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.appDetailEndpoint
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.get
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  // Customizable Area End
}

