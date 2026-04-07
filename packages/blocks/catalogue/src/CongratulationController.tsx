// Customizable Area Start
import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { imgPasswordInVisible, imgPasswordVisible } from "./assets";


export const configJSON = require("./config");

export interface Props {
   
  navigation: any;
  id: string;
 
  
}

interface S {
    
  txtInputValue: string;
  txtSavedValue: string;
  enableField: boolean;
  page_index: any;
  user_token: any;
  qustionList: any;
  rating: any;
  congratulations: any,
  course_id: any;
  courseId: any;
  cardId: any
  isLoading: boolean;
  reward_point:any

  
}

interface SS {
    
  id: any;

  
}

export default class CongratulationController extends BlockComponent<
  Props,
  S,
  SS
> {
  

  congratulationsApiCallId: any;
  getUpdateRatingCallapi: any;
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);
  

    this.subScribedMessages = [
        
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionSaveMessage),
      getName(MessageEnum.SessionResponseMessage),
 
      
    ];

    this.state = {
         
      txtInputValue: "",
      txtSavedValue: "A",
      enableField: false,
      page_index: 0,
      user_token: '',
      qustionList: [],
      rating: '',
      congratulations: [],
      course_id: '',
      courseId: '',
      cardId: '',
      isLoading: false,
      reward_point:0
      
    };
    
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
    
    
  }
    
  async componentDidMount() {
    console.log('@@@ user completed =====', this.props?.navigation?.state?.params?.course_id)
    this.getToken()
  }
  async getToken() {
    let token: any = await AsyncStorage.getItem('LOGIN_TOKEN')
    this.congratulationsData()
    this.setState({
      user_token: token,
      courseId: this.props?.navigation?.state?.params?.course_id,
      cardId: this.props?.navigation?.state?.params?.cardId
    },
    )
  };

  async receive(from: string, message: Message) {

    console.log('@@@ API MESSAGE LOGIN VIEW =================', message)
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      )

      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      )
      console.log('responseJson0000000', responseJson)
      var errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      )

      if (responseJson && !responseJson.errors) {
        if (apiRequestCallId === this.congratulationsApiCallId) {
          this.congratulationsSuccessCallBack(responseJson)
        }
      } else if (responseJson && responseJson.errors) {
        if (apiRequestCallId === this.congratulationsApiCallId) {
          this.congratulationsFailureCallBack(responseJson)
        }
      } else if (errorReponse) {
        console.log('errorReponse', errorReponse)
      }
    }
  }

  congratulationsSuccessCallBack = (responseJson: any) => {
   
    console.log('@@@ congratulations Success CallBack =================', responseJson)
    this.setState({ congratulations: responseJson?.data, courseId: responseJson?.data?.course?.id ,reward_point:responseJson?.data?.point_earned},()=>{
      this.setState({ isLoading: false })
    })
  };

  congratulationsFailureCallBack = (responseJson: any) => {
    this.setState({ isLoading: false })
    console.log('@@@ congratulations failure callBack =================', responseJson)
    // this.setState({ isLoading: false, })
  };

  apiCall = async (data: any) => {
    let token = await AsyncStorage.getItem('@token');
    const { contentType, method, endPoint, body, type } = data
    const header = {
      'Content-Type': contentType,
      token: this.state.user_token,
    }
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    )
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    )
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endPoint
    )
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      method
    )
    body && type != 'formData' ?
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(body)
      )

      : requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        body
      );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    // console.log('@@@ requestMessage ========', requestMessage)
    return requestMessage.messageId;
  }

  // congratulationsData = async () => {
  //   this.setState({ isLoading: true })
    
  //   this.congratulationsApiCallId = await this.apiCall({
  //     contentType: "application/json",
  //     method: "GET",
  //     endPoint: "/dashboard",
  //   })
  // }

  congratulationsData = async () => {
    console.log("start course detail --",this.state.course_id)
    this.setState({ isLoading: true })
    this.congratulationsApiCallId = await this.apiCall({
      contentType: configJSON.productApiContentType,
      method: configJSON.apiMethodTypeGet,
      endPoint: configJSON.getCourseDetialsApiEndPoint +  this.props?.navigation?.state?.params?.course_id
    });
  }



  
}
// Customizable Area End