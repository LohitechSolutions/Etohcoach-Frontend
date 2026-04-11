import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";
// Customizable Area Start
import AsyncStorage from "@react-native-async-storage/async-storage";
import Context from "../../../components/src/context/context";
import { langaugeFunction } from "./component/i18n/i18n.config";
import { imgPasswordVisible, imgPasswordInVisible } from "./assets";
import { isConnected } from "../../../mobile/src/utils/internetConnection";
import { apiUrl } from "../../../framework/src/config";
// Customizable Area End

export const configJSON = require("./config");

const LANG_FLAG_EN =
  "rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBQdz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--21ba7c04c955b68db7c021ecfd5687a770f967d0/English.png";
const LANG_FLAG_FR =
  "rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBRQT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--4602d9c5f70fea6d1260496fe97e03a7e5a63f5e/France.png";

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  txtInputValue: string;
  txtSavedValue: string;
  enableField: boolean;
  languageSelect: number;
  currentLanguage: any;
  value: any;
  // Customizable Area Start
  showLoader: boolean;
  token: any;
  totalLanguages: any;
  langaugeDatafromapi: any;
  num: number;
  isItOffline:boolean;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class LanguageOptionsController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  getLanguageAPICall: any;
  focusListener: any;
  getSearchDetailsLanguage: any;
  showLoader: boolean;
  // Customizable Area End

  static contextType = Context;

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.AccoutLoginSuccess),
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionSaveMessage),
      getName(MessageEnum.SessionResponseMessage),
      // Customizable Area Start
      // Customizable Area End
    ];

    this.state = {
      txtInputValue: "",
      txtSavedValue: "A",
      enableField: false,
      showLoader: false,
      // Customizable Area Start
      languageSelect: 0,
      currentLanguage: "English",
      totalLanguages: [
        {
          language: "English",
          flag: apiUrl(LANG_FLAG_EN),
        },
        {
          language: "Français",
          flag: apiUrl(LANG_FLAG_FR),
        },
      ],
      token: "",
      langaugeDatafromapi: "",
      num: 1,
      isItOffline:false
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
    // Customizable Area Start
    // Customizable Area End
  }

  async componentDidMount() {
    const { initLanguage, language } = this.context;
    let connectionStatus = await isConnected().then(response => response).catch(err => console.log(err))
     
    if (connectionStatus !== undefined) {
      this.setState({showLoader:true})
    initLanguage();
    super.componentDidMount();
    this.getLanguages();
    this.getToken();
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener("didFocus", () => {
        this.getToken();
      });
    }
    this.setState({isItOffline:false})
   
  }else{
    this.setState({isItOffline:true,totalLanguages:[
      {
        language: "English",
        flag: apiUrl(LANG_FLAG_EN),
      },
      {
        language: "Français",
        flag: apiUrl(LANG_FLAG_FR),
      },
    ]})
  }
  const langue = await AsyncStorage.getItem("appLanguage");
  if (langue == "English") {
    this.setState({ languageSelect: 0 });
  } else if (langue == "Français"){
    this.setState({ languageSelect: 1 });
  }else{
    this.setState({ languageSelect: 0 });
  }
  }

  async receive(from: string, message: Message) {
    console.log("@@@ API MESSAGE LANGUAGE VIEW =================", message);
    // Customizable Area Start
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

      if (responseJson && !responseJson.errors) {
        if (apiRequestCallId === this.getLanguageAPICall) {
          console.log('language API hit response')
          this.setState({ totalLanguages: responseJson?.languages,showLoader:false });
          console.log("languages from block", responseJson);
          console.log("languages from block state", this.state.totalLanguages);
        }
      }
    }

    if (
      this.getSearchDetailsLanguage ==
      message?.properties?.RestAPIResponceDataMessage
    ) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );

      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      if (responseJson.errors) {
        console.log("error in updating language");
      } else {
        console.log("async receive from language data");
        const data = JSON.stringify(responseJson.meta.translations);
        await AsyncStorage.setItem("langDataController", data);
        const newData = await AsyncStorage.getItem("langDataController");
        this.setState({ showLoader: false });
        
        await langaugeFunction();
      }
    }
    // Customizable Area End
  }

  // Customizable Area Start
  txtInputWebProps = {
    onChangeText: (text: string) => {
      this.setState({ txtInputValue: text });
    },
    secureTextEntry: false,
  };

  txtInputMobileProps = {
    ...this.txtInputWebProps,
    autoCompleteType: "email",
    keyboardType: "email-address",
  };

  txtInputProps = this.isPlatformWeb()
    ? this.txtInputWebProps
    : this.txtInputMobileProps;

  btnShowHideProps = {
    onPress: () => {
      this.setState({ enableField: !this.state.enableField });
      this.txtInputProps.secureTextEntry = !this.state.enableField;
      this.btnShowHideImageProps.source = this.txtInputProps.secureTextEntry
        ? imgPasswordVisible
        : imgPasswordInVisible;
    },
  };

  btnShowHideImageProps = {
    source: this.txtInputProps.secureTextEntry
      ? imgPasswordVisible
      : imgPasswordInVisible,
  };

  btnExampleProps = {
    onPress: () => this.doButtonPressed(),
  };

  doButtonPressed() {
    let msg = new Message(getName(MessageEnum.AccoutLoginSuccess));
    msg.addData(
      getName(MessageEnum.AuthTokenDataMessage),
      this.state.txtInputValue
    );
    this.send(msg);
  }

  // web events
  setInputValue = (text: string) => {
    this.setState({ txtInputValue: text });
  };

  setEnableField = () => {
    this.setState({ enableField: !this.state.enableField });
  };

  setLanguageSelect = (index: number) => {
    this.setState({ languageSelect: index });
  };

  setLoader = (load: boolean) => {
    this.setState({ showLoader: load });
  };

  setLanguageModal = () => {
    const { i18n }: any = this.props;
    const { language, setLanguageToAsyncStorage } = this.context;
    this.setLoader(true);
    setLanguageToAsyncStorage(language);
    this.getLanguageresults();
    console.log(language, "languagefromModal");
    if (language == "English") {
      i18n.changeLanguage("en");
    } else if (language == "Français") {
      i18n.changeLanguage("fr");
    }
  };

  async getToken() {
    let token: any = await AsyncStorage.getItem("LOGIN_TOKEN");
    console.log("workinggggggggggggggg", token);
    this.setState({ token: token }, () => this.getLanguages());
  }

  apiCall = async (data: any) => {
    const { contentType, method, endPoint } = data;

    const header = {
      "Content-Type": contentType,
      token: this.state.token,
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
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return requestMessage.messageId;
  };

  getLanguages = async () => {
    console.log('language API hit')
    this.getLanguageAPICall = await this.apiCall({
      contentType: configJSON.validationApiContentType,
      method: configJSON.validationApiMethodType,
      endPoint: configJSON.apiEndPointGetLanguage,
    });
  };

  getLanguageresults = async () => {
    this.setState({ showLoader: true });
    const applanguage = await AsyncStorage.getItem("appLanguage");
    const header = {
      "Content-Type": configJSON.validationApiContentType,
      token: this.state.token,
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
      configJSON.postAPiMethod
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(body)
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
  };
  // Customizable Area End
}
