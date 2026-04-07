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
  // Customizable Area Start
  txtInputValue: string;
  txtSavedValue: string;
  enableField: boolean;
  page_index: any;
  user_token: any;
  qustionList: any;
  rating: any;
  flashCardQuestionAnswer: any,
  one: boolean;
  two: boolean;
  three: boolean;
  four: boolean;
  five: boolean;
  revealAnswer: boolean;
  courseId:any;
  reveal : any
  
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class RevealAnswerController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start

  flashcardReavealAnswerApiCallId: any;
  getUpdateRatingCallapi: any;
    // Customizable Area End
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
          // Customizable Area Start
      txtInputValue: "",
      txtSavedValue: "A",
      enableField: false,
      page_index: 0,
      user_token: '',
      qustionList: [],
      rating: '',
      courseId:"",
      flashCardQuestionAnswer: [
        // {
        //   id: 1,
        //   userFlashcard: "1",
        //   totalFlashcard: "12",
        //   source: require("../assets/natureImage.jpeg"),
        //   questionTitle: 'Question title?',
        //   questionText: "Question text."
        // },
        // {
        //   id: 2,
        //   userFlashcard: "2",
        //   totalFlashcard: "12",
        //   source: require("../assets/natureImage.jpeg"),
        //   questionTitle: 'Question title?',
        //   questionText: "Question text."
        // },
        // {
        //   id: 3,
        //   userFlashcard: "3",
        //   totalFlashcard: "12",
        //   source: require("../assets/natureImage.jpeg"),
        //   questionTitle: 'Question title?',
        //   questionText: "Question text."
        // },
        // {
        //   id: 4,
        //   userFlashcard: "4",
        //   totalFlashcard: "12",
        //   source: require("../assets/natureImage.jpeg"),
        //   questionTitle: 'Question title?',
        //   questionText: "Question text."
        // },
      ],
      one: false,
      two: false,
      three: false,
      four: false,
      five: false,
      revealAnswer: false,
      reveal :''

      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
    // Customizable Area Start
    // Customizable Area End
  }
   // Customizable Area Start
  async componentDidMount() {
    this.getToken()
  }
  async getToken() {
    let token: any = await AsyncStorage.getItem('LOGIN_TOKEN')

    console.log('@@@  answerReveal =====', this.props?.navigation?.state?.params.id)
    this.setState({ user_token: token , reveal:this.props.navigation?.state?.params.id }, () => { this.getRevealAnswer() })
    //this.send(msg);
  };

  // async receive(from: string, message: Message) {
  //   runEngine.debugLog("Message Recived", message);

  //   var responseJson = message.getData(
  //     getName(MessageEnum.RestAPIResponceSuccessMessage)
  //   );
  //   console.log('Responce data reveal', responseJson)
  //   if (responseJson?.errors) {
  //     if (responseJson?.errors[0]?.token) {
  //       console.log('Token Error', responseJson?.errors[0]?.token)
  //       this.props.navigation.navigate('EmailAccountLoginBlock')
  //     }
  //     else {
  //       console.log('show Error ',)
  //     }

  //   }
  //   else {
  //     if (this.flashcardReavealAnswerApiCallId == message?.properties?.RestAPIResponceDataMessage) {
  //       console.log('Course Reveal  data ', responseJson)
  //       this.setState({ qustionList: responseJson?.data })
  //     }
  //     if (this.getUpdateRatingCallapi == message?.properties?.RestAPIResponceDataMessage) {
  //       // this.setState({page_index:this.state.page_index+1},()=>this.slider?.goToSlide(this.state.page_index, true))
  //       if (this.state.page_index == this.state.qustionList.length - 1) {
  //         console.log('', this.state.page_index)
  //       }
  //       else {
  //         this.setState({ page_index: this.state.page_index + 1 }, () => this.slider?.goToSlide(this.state.page_index, true))
  //       }
  //       console.log('update Rating ', responseJson)
  //     }

  //   }
  // }

  async receive(from: string, message: Message) {
    console.log('@@@ API MESSAGE LOGIN VIEW =================', message)
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      )

      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      )
      console.log('responseJson', responseJson)
      var errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      )

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
    console.log('@@@ course details Success CallBack =================', responseJson)
    this.setState({ flashCardQuestionAnswer: responseJson?.data, courseId: responseJson?.data?.course?.id })
  };

  flashcardReavealAnswerFailureCallBack = (responseJson: any) => {
    console.log('@@@ course details failure callBack =================', responseJson)
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
  // Customizable Area Start
  // Customizable Area End

  // async getFlashCardsThemList(theme_id: any) {
  //   // console.log('yess function call',theme_id)
  //   const header = {
  //     "Content-Type": configJSON.productApiContentType,
  //     token: this.state.user_token,
  //   };
  //   const requestMessage = new Message(
  //     getName(MessageEnum.RestAPIRequestMessage)
  //   );
  //   this.flashcardReavealAnswerApiCallId = requestMessage.messageId;
  //   requestMessage.addData(
  //     getName(MessageEnum.RestAPIResponceEndPointMessage),
  //     configJSON.GetFlash_cardslist + "?theme_id=1"
  //   );
  //   requestMessage.addData(
  //     getName(MessageEnum.RestAPIRequestHeaderMessage),
  //     JSON.stringify(header)
  //   );
  //   requestMessage.addData(
  //     getName(MessageEnum.RestAPIRequestMethodMessage),
  //     configJSON.exampleAPiMethod
  //   );

  //   runEngine.sendMessage(requestMessage.id, requestMessage);
  // }

  async UpdateRating(id: any) {
    console.log('checkkkkk ', id, this.state.rating)
    const body = {
      id: id,
      rating: this.state.rating
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
    console.log('api responce data reveal', requestMessage)

    runEngine.sendMessage(requestMessage.id, requestMessage);
  }

  getRevealAnswer = async () => {
    console.log("@@@ id =====",this.state.courseId)
    let body = {
      course_id: this.state.courseId
    }
    this.flashcardReavealAnswerApiCallId = await  this.apiCall ({
      contentType: configJSON.productApiContentType,
      method: configJSON.apiPostMethod,
      endPoint: configJSON.flashcardRevealAnswerEndPoint,
      body: body
    })
  }

  // Customizable Area End
}
