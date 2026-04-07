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
  page_index: any;
  user_token: any;
  qustionList: any;
  rating: any;
  flashCardQuestionAnswer: any,
  course_id: any;
  courseId: any;
  cardId: any;
  questionList:any
  // Customizable Area Start
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class CfFlashCardOneController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  // Customizable Area End
  flashcardReavealAnswerApiCallId: any;
  getUpdateRatingCallapi: any;
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
      page_index: 0,
      user_token: '',
      qustionList: [],
      rating: '',
      flashCardQuestionAnswer: [],
      course_id: '',
      courseId: '',
      cardId: '',
      questionList:[
        {
          id:1,
          quetionNo:'1',
          quetionTxt:"Leaf"
        },
        {
          id:2,
          quetionNo:'2',
          quetionTxt:"rgh"
        },
        {
          id:3,
          quetionNo:'3',
          quetionTxt:"vjk"
        },
      ]
      // Customizable Area Start
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
    // Customizable Area Start
    // Customizable Area End
  }
  async componentDidMount() {
    console.log('@@@  rsvii =====',  this.props?.navigation?.state?.params?.cardId)
    this.getToken()
  }
  async getToken() {
    let token: any = await AsyncStorage.getItem('LOGIN_TOKEN')
    this.setState({ user_token: token, course_id: this.props?.navigation?.state?.params?.cardId, cardId: this.props?.navigation?.state?.params?.cardId }, () => { this.getRevealAnswer() })
    //this.send(msg);
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
      console.log('responseJson api', responseJson)
      var errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      )
      console.log("@@@@@@ errror ==", errorReponse)
      if (responseJson && !responseJson.errors) {
        if (apiRequestCallId === this.flashcardReavealAnswerApiCallId) {
          this.flashcardReavealAnswerSuccessCallBack(responseJson)
        }
      } else if (responseJson && responseJson.errors) {
        if (apiRequestCallId === this.flashcardReavealAnswerApiCallId) {
          this.flashcardReavealAnswerFailureCallBack(responseJson)
        }
      } else if (errorReponse) {
        console.log('errorReponse', errorReponse)
      }
    }
  }

  flashcardReavealAnswerSuccessCallBack = (responseJson: any) => {
    console.log('@@@ DATA Success CallBack =================', responseJson)
    this.setState({ flashCardQuestionAnswer: responseJson?.data, courseId: responseJson?.data?.id })
  };

  flashcardReavealAnswerFailureCallBack = (responseJson: any) => {
    console.log('@@@ flashcard failure callBack =================', responseJson)
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

  getRevealAnswer = async () => {
    console.log("@@@@ courseID === ", this.state.courseId)
    let body = {
      course_id: this.state.courseId
    }
    this.flashcardReavealAnswerApiCallId = await this.apiCall({
      contentType: "application/json",
      method: "POST",
      endPoint: "bx_block_flash_cards/flash_cards/reveal_answer",
      body: body
    })
  }

  // Customizable Area Start
  // Customizable Area End
}
