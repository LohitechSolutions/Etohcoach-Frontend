import React from "react";
import { View } from "react-native";
import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";
// import { AsyncStorage } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { runEngine } from "../../../framework/src/RunEngine";


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
  name: string;
  email: string;
  phoneNumber: string;
  comments: string;
  enableField: boolean;
  token: string;
  contactUsList: any;
  activeId: number;
  activeName: string;
  activeEmail: string;
  activePhoneNumber: string;
  activeDescription: string;
  activeCreatedAt: string;
  isVisible: boolean;
  user_token: any;
  contactUsUrl: any;
  isLoading: boolean;
  // Customizable Area End
}

interface SS {
  id: any;
}

export default class ContactusController extends BlockComponent<Props, S, SS> {
  // Customizable Area Start
  contactUsApiCallId: any = "";
  deleteContactApiCallId: any = "";
  addContactApiCallId: any = "";
  getUrlContactUsApiCallId: any = ""
  // Customizable Area End
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.SessionResponseMessage),
      getName(MessageEnum.RestAPIResponceMessage)
    ];

    this.state = {
      name: "",
      email: "",
      phoneNumber: "",
      comments: "",
      enableField: false,
      token: "",
      contactUsList: '',
      activeId: 0,
      activeName: "",
      activeEmail: "",
      activePhoneNumber: "",
      activeDescription: "",
      activeCreatedAt: "",
      isVisible: false,
      user_token: '',
      contactUsUrl: '',
      isLoading: false
    };

    // Customizable Area End
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  async componentDidMount() {
    this.getToken();
    this.ContactUsApiCall()

    // if (this.isPlatformWeb() === false) {
    //   this.props.navigation.addListener("willFocus", () => {
    //     this.getToken();
    //   });
    // }

    // Customizable Area Start
    // Customizable Area End
  }




  async getToken() {
    // const msg: Message = new Message(
    //   getName(MessageEnum.SessionRequestMessage)
    // );
    let token = await AsyncStorage.getItem('LOGIN_TOKEN')
    this.setState({ user_token: token }, () => this.getContactApiFun())
    console.log('checkkkk dtaaaa ', token)
    //this.send(msg);
  };

  async ContactUsApiCall() {
    this.setState({ isLoading: true })
    const header = {
      "Content-Type": configJSON.contactUsApiContentType,
      token: await AsyncStorage.getItem('LOGIN_TOKEN')
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getUrlContactUsApiCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getContactUsAPiEndPoint
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
    return true;

  }

  getContactApiFun() {
    this.setState({ isLoading: true })
    const header = {
      "Content-Type": configJSON.contactUsApiContentType,
      token: this.state.user_token
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.addContactApiCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getContactUsAPiEndPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    // requestMessage.addData(
    //   getName(MessageEnum.RestAPIRequestBodyMessage),

    // );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  async receive(from: string, message: Message) {

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

      if (apiRequestCallId === this.getUrlContactUsApiCallId) {

        this.setState({ isLoading: false })
        this.setState({ contactUsUrl: responseJson })


      }
    }



    if (this.addContactApiCallId == apiRequestCallId) {

      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      this.setState({ contactUsList: responseJson })
      console.log('responce dataaaa ', responseJson)

      var errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );
    }
  }
  // Customizable Area End
}

  // Customizable Area Start
    // Customizable Area End

