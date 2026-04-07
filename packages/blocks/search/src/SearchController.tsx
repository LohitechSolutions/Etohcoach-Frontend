import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { URLSearchParams } from "url";
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
  token: string;
  searchText: string;
  searchList: any;
  activeId: number;
  activeFirstName: string;
  activeLastName: string;
  activeUserName: string;
  activeEmail: string;
  activePhoneNumber: string;
  activeCountryCode: string;
  activeType: string;
  activeDeviceId: string;
  activeCreatedAt: string;
  isVisible: boolean;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class SearchController extends BlockComponent<Props, S, SS> {
  // Customizable Area Start
  searchApiCallId: any;
  // Customizable Area End
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);
    this.subScribedMessages = [
      // Customizable Area Start
      getName(MessageEnum.SessionResponseMessage),
      getName(MessageEnum.RestAPIResponceMessage)
      // Customizable Area End
    ];

    this.state = {
      // Customizable Area Start
      token: "",
      searchText: "",
      searchList: [],
      activeId: 0,
      activeFirstName: "",
      activeLastName: "",
      activeUserName: "",
      activeEmail: "",
      activePhoneNumber: "",
      activeCountryCode: "",
      activeType: "",
      activeDeviceId: "",
      activeCreatedAt: "",
      isVisible: false
      // Customizable Area End
    };
    // Customizable Area Start
    // Customizable Area End
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  async componentDidMount() {
    super.componentDidMount();
    this.getToken();
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener("willFocus", () => {
        this.getToken();
      });
    }
    // Customizable Area Start
    // Customizable Area End
  }

  getToken = () => {
    const msg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage)
    );
    this.send(msg);
  };

  async receive(from: string, message: Message) {
    // Customizable Area Start
    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
      let token = message.getData(getName(MessageEnum.SessionResponseToken));
      runEngine.debugLog("TOKEN", token);
      this.setState({ token: token });
      this.getSearchList(token);
    } else if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );

      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      var errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );
      runEngine.debugLog("API Message Recived", message);

      if (responseJson && responseJson.data) {
        if (apiRequestCallId === this.searchApiCallId) {
          this.setState({ searchList: responseJson.data });
        }

        if (responseJson.data.length === 0) {
          this.showAlert("Alert", "No Items", "");
        }
      } else if (responseJson && responseJson.errors) {
        if (responseJson.errors) {
          if (apiRequestCallId === this.searchApiCallId) {
            this.showAlert("Alert", "API Error", "");
          }
        }
      }
    }
    // Customizable Area End
  }

  // Customizable Area Start
  txtInputSearchTextProps = {
    onChangeText: (text: string) => {
      this.setState({ searchText: text });
    }
  };

  setSearchText = (text: string) => {
    this.setState({ searchText: text });
  };

  hideModal = () => {
    this.setState({ isVisible: !this.state.isVisible });
  };

  setModal = (item: any) => {
    this.setState({
      activeId: item.id,
      activeFirstName: item.attributes.first_name,
      activeLastName: item.attributes.last_name,
      activeUserName: item.attributes.user_name,
      activeEmail: item.attributes.email,
      activePhoneNumber: item.attributes.phone_number,
      activeCountryCode: item.attributes.country_code,
      activeType: item.type,
      activeDeviceId: item.attributes.device_id,
      activeCreatedAt: item.attributes.created_at,
      isVisible: !this.state.isVisible
    });
  };

  getSearchList = (token: string) => {
    const header = {
      "Content-Type": configJSON.searchApiContentType,
      token: token
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    const attrs = {
      query: this.state.searchText
    };

    this.searchApiCallId = requestMessage.messageId;
    let urlParams = new URLSearchParams(attrs).toString();

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.getSearchApiEndPoint}?${urlParams}`
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };
  // Customizable Area End
}
