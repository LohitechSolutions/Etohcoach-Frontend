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
  languageSelect: number;
  currentLanguage: any;
  // Customizable Area Start
  showLoader: boolean;
  token: any;
  totalLanguages: any;
  langaugeDatafromapi: any;
  num: number;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class LanguageOptionsModalController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  getLanguageAPICall: any;
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
        {
          language: "Português",
          flag: "https://flagcdn.com/w80/pt.png",
        },
        {
          language: "Italiano",
          flag: "https://flagcdn.com/w80/it.png",
        },
      ],
      token: "",
      langaugeDatafromapi: "",
      num: 1,
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
    // Customizable Area Start
    // Customizable Area End
  }

  async componentDidMount() {
    const { initLanguage, language } = this.context;
    initLanguage();
    super.componentDidMount();
    this.getLanguagesModal();
    const langue = await AsyncStorage.getItem("appLanguage");
    console.log(langue, "appLanguage from controller");
    const index = this.state.totalLanguages.findIndex(
      (item: any) => (item.language || item.name) === langue
    );
    this.setState({ languageSelect: index !== -1 ? index : 0 });
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
          const apiLangs = responseJson?.languages || [];
          const formattedApiLangs = apiLangs.map((item: any) => ({
            language: item.language || item.name,
            flag: item.flag,
            id: item.id
          }));
          
          const defaultLangs = [
            { language: "English", flag: "https://flagcdn.com/w80/gb.png" },
            { language: "Français", flag: "https://flagcdn.com/w80/fr.png" },
            { language: "Português", flag: "https://flagcdn.com/w80/pt.png" },
            { language: "Italiano", flag: "https://flagcdn.com/w80/it.png" },
          ];
          
          const mergedList = [...defaultLangs];
          formattedApiLangs.forEach((apiItem: any) => {
            const index = mergedList.findIndex(
              (mItem) => mItem.language.toLowerCase() === apiItem.language.toLowerCase()
            );
            if (index !== -1) {
              if (apiItem.flag) {
                mergedList[index].flag = apiItem.flag;
              }
            } else {
              mergedList.push(apiItem);
            }
          });
          
          this.setState({ totalLanguages: mergedList });
          this.setState({ showLoader: false });
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
        this.setLoader(false);
        await langaugeFunction();
      }
    }
    // Customizable Area End
  }

  // Customizable Area Start

  // web events
  setLanguageSelect = (index: number) => {
    this.setState({ languageSelect: index });
  };

  setLoader = (load: boolean) => {
    this.setState({ showLoader: load });
  };

  loadDisplayLanguage = async () => {
    const langues = await AsyncStorage.getItem("appLanguage");
    console.log(langues, "appLanguage from controller");
    const index = this.state.totalLanguages.findIndex(
      (item: any) => (item.language || item.name) === langues
    );
    this.setState({ languageSelect: index !== -1 ? index : 0 });
  };

  setLanguageModal = async () => {
    const { i18n }: any = this.props;
    const { language, setLanguageToAsyncStorage } = this.context;
    this.setLoader(true);
    setLanguageToAsyncStorage(language);
    await this.getLanguageresultsModal();
    if (language == "English") {
      console.log("English Language");
      i18n.changeLanguage("en");
    } else if (language == "Français") {
      console.log("Français Language");
      i18n.changeLanguage("fr");
    } else if (language == "Português" || language == "Portuguese") {
      console.log("Português Language");
      i18n.changeLanguage("pt");
    } else if (language == "Italiano" || language == "Italian") {
      console.log("Italiano Language");
      i18n.changeLanguage("it");
    }
  };

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

  getLanguagesModal = async () => {
    console.log("getLanguages");
    this.setState({ showLoader: true });
    this.getLanguageAPICall = await this.apiCall({
      contentType: configJSON.validationApiContentType,
      method: configJSON.validationApiMethodType,
      endPoint: configJSON.apiEndPointGetLanguage,
    });
  };

  getLanguageresultsModal = async () => {
    console.log("getLanguageResults Function");
    const applanguage = await AsyncStorage.getItem("appLanguage");
    const header = {
      "Content-Type": configJSON.validationApiContentType,
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
