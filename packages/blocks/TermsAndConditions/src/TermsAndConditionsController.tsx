import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { isConnected } from "../../../mobile/src/utils/internetConnection";
import { imgPasswordInVisible, imgPasswordVisible } from "./assets";
import { AsynchStoragekey } from "../../../mobile/src/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  userLoginWatcher:any;
  userTermsWatcher:any;
  legalState:any;
  addPrivacy:(val:any)=>void;
  addTerms:(val:any)=>void;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  txtInputValue: string;
  txtSavedValue: string;
  enableField: boolean;
  showLoader: boolean; 
  termsCondition: string;
  privacyPolicy: string;
  error: string;
  // =========
  Terms : string;
  privacy:string;
 // =========
  // Customizable Area Start
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class TermsAndConditionsController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  tearmAndConditionApiCallId: any;
  privacyPolicyApiCallId: any;
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
    ];
    // Customizable Area End

    this.state = {
      txtInputValue: "",
      txtSavedValue: "A",
      enableField: false,
      // Customizable Area Start
      showLoader: false,
      termsCondition: " ",
      privacyPolicy: "",
      error: "",
      Terms:'',
      privacy:'',
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // this.componentDidMount = () => {
  
      
    //   this.setState({showLoader:true})
    //   this.tearmAndConditionApi()
    //   this.privacyPolicyApi()

      
    // }
    // Customizable Area End
  }
  async componentDidMount() {
    this.setState({ showLoader: true })
    // this._loginApiCall(),
    let connectionStatus = await isConnected().then(response => response).catch(err => console.log(err))
    if (connectionStatus !== undefined) {
    if(this.props.navigation?.state?.params?.TermsAndConditions){
      this.tearmAndConditionApi()
    }else{
      this.privacyPolicyApi();
    }
  }else{
    let privacy = this.props.legalState?.policy;
    let terms = this.props.legalState?.terms;
    console.log('info data',terms,privacy)
    this.setState({
      termsCondition:terms,privacyPolicy:privacy,showLoader:false
    })
  }
  }
  
  // ------------------call Api tearmAndCondition---------------------//
  async tearmAndConditionApi() {

    const header = {
      "Content-Type": configJSON.contentTypeApiTermsAndConditions,
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.tearmAndConditionApiCallId = requestMessage.messageId;
    
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.apiEndPointTermsAndConditions
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.apiTermsAndConditionsType
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);

    return true;

  }
  // ------------------call Api privacyPolicy---------------------//
  async privacyPolicyApi() {

    const header = {
      "Content-Type": configJSON.contentTypeApiTermsAndConditions,
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.privacyPolicyApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.apiEndPointprivacyPolicy
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.apiprivacyPolicyType
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
      // ---------------- tearmAndCondition Response---------------- //

      if (apiRequestCallId && responseJson) {

        if (apiRequestCallId === this.tearmAndConditionApiCallId) {

          if (!responseJson?.errors) {
            var index = responseJson?.data?.length-1 ;     
            this.setState({ termsCondition: responseJson.data[index]?.attributes?.content, showLoader:false })
            this.props.addTerms(responseJson.data[index]?.attributes?.content);
            
          }
          else {
            this.setState({ error: (!!responseJson?.errors && responseJson?.errors?.length > 0) ? Object.values(responseJson?.errors[0]) : '' ,showLoader:false})
          }
        }
      }
      // ---------------- privacyPolicy Response---------------- //

      if (apiRequestCallId && responseJson) {

        if (apiRequestCallId === this.privacyPolicyApiCallId) {


          if (!responseJson?.errors) {
            console.log('privacy policy url',responseJson?.data[0]?.attributes?.content)
            this.setState({ privacyPolicy: responseJson?.data[0]?.attributes?.content ,showLoader:false})
            this.props.addPrivacy(responseJson.data[0]?.attributes?.content);
          }
          else {
            this.setState({ error: (!!responseJson?.errors && responseJson?.errors?.length > 0) ? Object.values(responseJson?.errors[0]) : '' ,showLoader:false})
          }
        }
      }
    }
  }
}


  // async receive(from: string, message: Message) {
  //   runEngine.debugLog("Message Recived", message);

  //   if (message.id === getName(MessageEnum.AccoutLoginSuccess)) {
  //     let value = message.getData(getName(MessageEnum.AuthTokenDataMessage));

  //     this.showAlert(
  //       "Change Value",
  //       "From: " + this.state.txtSavedValue + " To: " + value
  //     );

  //     this.setState({ txtSavedValue: value });
  //   }

  // Customizable Area Start
  // Customizable Area End

  // txtInputWebProps = {
  //   onChangeText: (text: string) => {
  //     this.setState({ txtInputValue: text });
  //   },
  //   secureTextEntry: false,
  // };

  // txtInputMobileProps = {
  //   ...this.txtInputWebProps,
  //   autoCompleteType: "email",
  //   keyboardType: "email-address",
  // };

  // txtInputProps = this.isPlatformWeb()
  //   ? this.txtInputWebProps
  //   : this.txtInputMobileProps;

  // btnShowHideProps = {
  //   onPress: () => {
  //     this.setState({ enableField: !this.state.enableField });
  //     this.txtInputProps.secureTextEntry = !this.state.enableField;
  //     this.btnShowHideImageProps.source = this.txtInputProps.secureTextEntry
  //       ? imgPasswordVisible
  //       : imgPasswordInVisible;
  //   },
  // };

  // btnShowHideImageProps = {
  //   source: this.txtInputProps.secureTextEntry
  //     ? imgPasswordVisible
  //     : imgPasswordInVisible,
  // };

  // btnExampleProps = {
  //   onPress: () => this.doButtonPressed(),
  // };

  // doButtonPressed() {
  //   let msg = new Message(getName(MessageEnum.AccoutLoginSuccess));
  //   msg.addData(
  //     getName(MessageEnum.AuthTokenDataMessage),
  //     this.state.txtInputValue
  //   );
  //   this.send(msg);
  // }

  // // web events
  // setInputValue = (text: string) => {
  //   this.setState({ txtInputValue: text });
  // };

  // setEnableField = () => {
  //   this.setState({ enableField: !this.state.enableField });
  // };

  // Customizable Area Start
  // Customizable Area End
  // }

