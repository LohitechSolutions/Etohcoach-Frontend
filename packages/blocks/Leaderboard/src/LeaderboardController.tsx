import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { imgPasswordInVisible, imgPasswordVisible } from "./assets";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsynchStoragekey, STRINGS } from "../../../mobile/src/utils";
import { isConnected } from "../../../mobile/src/utils/internetConnection";
// Customizable Area End

export const configJSON = require("./config");

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
  active_bt: any,
  overlay_bt: any,
  selectButton: number;
  leaderBoardData: any;
  showLoader: boolean;
  error: any;
  notificationBt: boolean;
  notificationUnreadCount: any;
  isConnectionStatus: any
  // Customizable Area Start
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class LeaderboardController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  // Customizable Area End
  focusListener: any
  leaderBoardCallId: any;
  notificationUnreadCount: any
  apiDashboardItemCallId: any
  constructor(props: Props) {
    super(props);
    // this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.CountryCodeMessage),
      getName(MessageEnum.AccoutLoginSuccess),
      // Customizable Area Start
      // Customizable Area End
    ];

    this.state = {
      txtInputValue: "",
      txtSavedValue: "A",
      enableField: false,
      active_bt: 'Weekly',
      overlay_bt: false,
      selectButton: 0,
      leaderBoardData: '',
      showLoader: false,
      error: '',
      notificationBt: false,
      notificationUnreadCount: '0',
      isConnectionStatus: false
      // Customizable Area Start
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }
  async componentDidMount() {
    this.setState({ showLoader: true })
    this.focusListener = this.props.navigation.addListener("didFocus", async () => {
      let connectionStatus = await isConnected().then((response: any) => response).catch(err => console.log(err))
      if (connectionStatus !== undefined) {
        this.functionTogetnotifications()
        this.getDashboardData()
        this.getDashboardDataaa()
        this.setState({
          isConnectionStatus: true
        })
      } else {
        this.setState({
          showLoader:false,
          isConnectionStatus: false
        })
      }
      // this.setState({ overlay_bt: true })
      // The screen is focused
      // Call any action
    });
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
        if (apiRequestCallId === this.leaderBoardCallId) {
          console.log("respoens==== LeaderBoard", JSON.stringify(responseJson));

          if (!responseJson?.errors) {
            this.setState({ showLoader: false })
            this.setState({ leaderBoardData: responseJson?.data })
          }
          else {
            this.setState({ showLoader: false })
            this.setState({ error: responseJson?.errors && responseJson?.errors?.length > 0 ? responseJson?.errors[0] : '' })
          }


        }
        if (apiRequestCallId === this.apiDashboardItemCallId) {
          console.log("respoens==== dashleader", responseJson);

          if (!responseJson?.errors) {
            AsyncStorage.setItem("notificationCalculation",JSON.stringify (responseJson?.unseen_notification) )
            this.setState({ notificationUnreadCount: responseJson?.unseen_notification })
          }
          else {
            console.log(responseJson)

          }


        }



      }


      runEngine.debugLog("Message Recived", message);
    }
  }

  getDashboardData = async () => {
    // let unseenNotify: any = await AsyncStorage.getItem('NOTIFICATION_UNREAD')
    // this.setState({ notificationUnreadCount: unseenNotify })
    // this.setState({ showLoader: true })
    // Customizable Area Start
    const header = {
      "Content-Type": configJSON.dashboarContentType,
      token: await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN)
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.leaderBoardCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.leaderBoardEndPoint
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
    // Customizable Area End
    return true;
  }

  getDashboardDataaa = async () => {
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


  functionTogetnotifications=async()=>{
    let unseen=  await AsyncStorage.getItem("notificationCalculation" )
      this.setState({notificationUnreadCount:unseen})
     }


}

