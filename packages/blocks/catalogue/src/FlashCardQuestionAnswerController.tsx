// Customizable Area Start

import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";
// import { AsyncStorage } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  data:any;
  user_token:any;
  theme_type:any;
  theme_id:any;
  lesson_details:any;
  lession_detail_notes: any;

  // Customizable Area End
}

interface SS {
  id: any;
}

export default class FlashCardQuestionAnswerController extends BlockComponent<Props, S, SS> {
  getLessonApiCallId: any;
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionSaveMessage),
      getName(MessageEnum.SessionResponseMessage),
      // Customizable Area Start
      // Customizable Area End
    ];

    this.state = {
     data:[1,2,3,4,5],
     user_token:'',
     theme_type:'',
     theme_id:'',
     lesson_details:'',
     lession_detail_notes: null
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area End
  }

  // async componentDidMount() {
  //   super.componentDidMount();
  //   this.getToken();
  //   if (this.isPlatformWeb() === false) {
  //     this.props.navigation.addListener("willFocus", () => {
  //       this.getToken();
  //     });
  //   }
  // }

  // getToken = () => {
  //   const msg: Message = new Message(
  //     getName(MessageEnum.SessionRequestMessage)
  //   );
  //   this.send(msg);
  // };
    // Customizable Area Start
  async componentDidMount() {
    console.log('props dataaa ',this.props.navigation?.state?.params?.theme_id)
    this.getToken()
}
async getToken () {
    let token:any = await AsyncStorage.getItem('LOGIN_TOKEN')
    console.log('props data ',this.props?.navigation?.state?.params?.theme_id)
    this.setState({
      user_token:token,
      theme_type:this.props?.navigation?.state?.params?.theme_type,
      theme_id:this.props?.navigation?.state?.params?.theme_id},
      ()=>{this.getLessonDetails(token)})
};

  getLessonDetails = (token: any) => {
    const header = {
      "Content-Type": configJSON.productApiContentType,
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.getLessonApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getLessonDetails+'?id='+this.state.theme_id+'type='+this.state.theme_type
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.apiMethodTypeGet
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  async receive(from: string, message: Message) {
    // Customizable Area Start
    runEngine.debugLog("Message Recived", message);
    var responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
);
console.log('Responce data ',responseJson)
if(responseJson.errors){
 if(responseJson?.errors[0]?.token)
 {
   console.log('Token Error',responseJson?.errors[0]?.token)
   this.props.navigation.navigate('EmailAccountLoginBlock')
 }
 else{
  // console.log('show Error ',)
 }
 
}
else{
 console.log('Themes api data ',responseJson?.data)
 //this.setState({themes_data:[1,2,3]})
 if(this.getLessonApiCallId ==message?.properties?.RestAPIResponceDataMessage){
  this.setState({lesson_details:responseJson?.data, lession_detail_notes: responseJson?.lesson_notes})
 }
}

  }

  // Customizable Area End
}
