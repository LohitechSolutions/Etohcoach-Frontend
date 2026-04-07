import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";
// import { AsyncStorage } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Customizable Area Start
import { imgPasswordInVisible, imgPasswordVisible } from "./assets";
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
  page_index:any;
  user_token:any;
  qustionList:any;
  rating:any;
  // Customizable Area Start
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class CfFlashcards2Controller extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  // Customizable Area End
  getThemlistApiCallid:any;
  getUpdateRatingCallapi:any;
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
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
      page_index:0,
      user_token:'',
      qustionList:[],
      rating:''
      // Customizable Area Start
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
    // Customizable Area Start
    // Customizable Area End
  }
  async componentDidMount() {
    this.getToken()
}
  async getToken () {
    let token:any = await AsyncStorage.getItem('LOGIN_TOKEN')
    this.setState({user_token:token},()=>{this.getFlashCardsThemList({theme_id:1})})
    //this.send(msg);
};

  async receive(from: string, message: Message) {
    runEngine.debugLog("Message Recived", message);

    var responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
);
console.log('Responce data ',responseJson)
if(responseJson?.errors){
 if(responseJson?.errors[0]?.token)
 {
   console.log('Token Error',responseJson?.errors[0]?.token)
   this.props.navigation.navigate('EmailAccountLoginBlock')
 }
 else{
   console.log('show Error ',)
 }
 
}
else{
if(this.getThemlistApiCallid == message?.properties?.RestAPIResponceDataMessage){
     console.log('Course Reveal  data ',responseJson?.data)
     this.setState({qustionList:responseJson?.data})
}
if(this.getUpdateRatingCallapi == message?.properties?.RestAPIResponceDataMessage){
  // this.setState({page_index:this.state.page_index+1},()=>this.slider?.goToSlide(this.state.page_index, true))
  if(this.state.page_index == this.state.qustionList.length-1){
    console.log('',this.state.page_index)
  }
  else{
    this.setState({page_index:this.state.page_index+1},()=>this.slider?.goToSlide(this.state.page_index, true))
  }
  console.log('update Rating ',responseJson)
}

}
}

    // Customizable Area Start
    // Customizable Area End
  
  async getFlashCardsThemList(theme_id:any){
    //console.log('yess function call',theme_id)
    const header = {
      "Content-Type": configJSON.productApiContentType,
      token: this.state.user_token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.getThemlistApiCallid = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.GetFlash_cardslist+"?theme_id=1"
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.exampleAPiMethod
    );
    
    runEngine.sendMessage(requestMessage.id, requestMessage);
  }

  async UpdateRating(id:any){
    console.log('checkkkkk ',id, this.state.rating)
    const body ={
      id:id,
      rating:this.state.rating
    }
    const header = {
      "Content-Type": configJSON.validationApiContentType,
      token: this.state.user_token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.getUpdateRatingCallapi = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.UpdateRating
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.exampleAPiMethod
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(body)
    )
    console.log('api responce data ',requestMessage)
    
    runEngine.sendMessage(requestMessage.id, requestMessage);
  }

  

  // Customizable Area Start
  // Customizable Area End
}
