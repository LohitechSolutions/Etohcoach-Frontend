 // Customizable Area Start
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, { getName } from "../../../framework/src/Messages/MessageEnum";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { runEngine } from "../../../framework/src/RunEngine";
import { IBlock } from "../../../framework/src/IBlock";
import { isConnected } from "../../../mobile/src/utils/internetConnection";
import ContactusController from "../../contactus/src/ContactusController";
import { AsynchStoragekey } from "../../../mobile/src/utils";
import { getAsyncDataKeys } from "../../../mobile/src/utils/AsyncKeysStorage";
import { getModel, getManufacturer } from 'react-native-device-info';
import { boolean } from "yup";







  
export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  offlineState : any;
  onDropDown: () => void;
  onPressSelect: (val: any) => void;

}
interface S {
  course_Details: any;
  user_token: '',
  courseVisible: any;
  course_id: any;
  mockTesVisible: any;
  quizTestVisible: any;
  reviewModalVisible: any;
  course_start: any;
  mock_and_quize: any;
  isVisible: boolean;
  disabled: boolean;
  unEnrollCourse: boolean;
  courseId: any;
  courseThemeListData: any;
  onPressQuizze: any;
  flashCardVisible: boolean;
  theme_id: any;
  dropDown: boolean,
  flashCardTitle: any,
  flashcardName: any;
  quzziesModal: boolean;
  mocExam: boolean;
  flashcardCount: any;
  flashCardID: any;
  themeGetid: any
  quizeAndMoc_id: any;
  type: any
  quizeName: any,
  quizeTitle: any,
  quizeType: any;
  mocExam_data: any
  mocExamName: any,
  mocExamTitle: any,
  mocExamType: any;
  course_name: any;
  coures_id: any;
  flashVisible: boolean;
  isLoading: any;
  lessonFlashcard: any;
  theme_type: any,
  testing: any;
  courseImage: any;
  isItOffline : any;
  flashCardItemFromThemesScreen: any;
  flashCardcountFromtheThemescreen: any;
  unenrollSuccess: boolean;
  shouldDisplayunenrollToastmessage: boolean;
  quizzExamData: any;
  course_reward_point: any;
  status: any,
  mockExamflashcardSelectedItem: any
  quizzesExamCardSelectedItem: any,
  quizThemeId: any,
  flashcardUserCompletedCount:any,
  typeOfselectedFlashcard:any,
  iamImounted:any,
  counterFlash:any,
  isConnect: any,
  goingTocongo:boolean,
  isquizzloading:boolean,
  isflahscardloading:boolean,
  ismockexmloading:boolean,
  deviceModel:any,
  subscriptionModal:boolean,
  product_type_flashcard:any
}
interface SS {
  id: any;
}

export default class OverViewController extends BlockComponent<Props, S, SS>{
  getCourseDetailsCallApiId: any;
  getCourseStartCallApiId: any;
  createFlashcardApiCallId: any;
  createQuizzeApiCallId: any;
  getThemlistApiCallid: any;
  getMockQuizApiCallid: any;
  courseUpdateApiCallId: any;
  _unsubscribe: any;
  focusListener: any; 
  unEnrollFromCourse: any;
  restartCourseId: any;
  getMockexamDropdownListId: any;
  getQuizexamDropdownListId: any;
  getQuizConfirmApiCallId:any;
  ApicallforMockExamUpdateId:any;


  constructor(props: Props) {
    super(props)
    this.receive = this.receive.bind(this);

    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionSaveMessage),
      getName(MessageEnum.SessionResponseMessage),
    ];
    this.state = {
      course_Details: '',
      user_token: '',
      courseVisible: false,
      course_id: '',
      mockTesVisible: false,
      quizTestVisible: false,
      reviewModalVisible: false,
      course_start: false,
      mocExam: false,
      mock_and_quize: [],
      isVisible: false,
      disabled: false,
      unEnrollCourse: false,
      courseId: "",
      courseThemeListData: [],
      onPressQuizze: [],
      flashCardTitle: "",
      flashCardVisible: false,
      theme_id: "",
      dropDown: false,
      flashcardName: '',
      quzziesModal: false,
      flashcardCount: 0,
      flashCardID: '',
      themeGetid: "",
      quizeAndMoc_id: "",
      type: '',
      quizeType: '',
      quizeName: "",
      quizeTitle: "",
      mocExam_data: [],
      mocExamName: "",
      mocExamTitle: "",
      mocExamType: "",
      course_name: "",
      coures_id: "",
      flashVisible: false,
      isLoading: false,
      lessonFlashcard: "",
      theme_type: "",
      testing: '',
      courseImage: "",
      isItOffline : false,
      flashCardItemFromThemesScreen: {},
      flashCardcountFromtheThemescreen: '',
      unenrollSuccess: false,
      shouldDisplayunenrollToastmessage: false,
      quizzExamData: [],
      mockExamflashcardSelectedItem: {},
      quizzesExamCardSelectedItem: {},
      quizThemeId: '',
      flashcardUserCompletedCount:0,
      typeOfselectedFlashcard:'theme_id',
      iamImounted:true,
      counterFlash:0,
      isConnect: false,
      goingTocongo:false,
      isquizzloading:false,
      isflahscardloading:false,
      deviceModel:"",
      subscriptionModal:false,
      product_type_flashcard:""
    }
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  async componentWillMount() {
    let model=await getModel()
    this.setState({deviceModel:model})
  }
  async componentDidMount() {
    // this.setState({ isLoading: true })
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", async () => {
      console.log('course ID data on navigation', this.props?.navigation?.state?.params,this.state.course_id)
      try{
      await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.COURCE_NAME, this.props.navigation.state.params?.course_name);
    }catch(e){
      console.log('course Name error',e)
    }
      if( this.props?.navigation?.state?.params?.course_id==this.state.course_id)
      {
        this.setState({isLoading:false})
      
      }
      else{
        this.setState({isLoading:true})

      }

      let connectionStatus = await isConnected().then(response => response).catch(err => console.log(err))
      this.setState({iamImounted:true, quizzExamData: [],quizzesExamCardSelectedItem:{},quizeName:'',quizeTitle:'',quizeAndMoc_id:'',counterFlash:0,goingTocongo:false})

      if (connectionStatus !== undefined) {
        let model=await getModel()
       
        this.setState({dropDown: false, flashCardID: "", themeGetid: "", flashCardTitle: "", flashcardName: '', flashcardCount: 0,deviceModel:model})
        this.getToken()
        if (this.props.navigation?.state?.params?.isItfromThemesLessonList) {
          this.setState({ flashCardVisible: true, quzziesModal:false})
          this.onPressFlashcardStart()
        } 
      }else {
        this.setState({ isConnect: true,courseImage:this.props.navigation.state?.params?.courseImage,isflahscardloading:false,course_id: this.props?.navigation?.state?.params?.course_id,isLoading:false,isItOffline:true})
        console.log("offline start---")
        this.getCourseDetailsOfflineFun()
      }
      // this.getToken()
      if (this.props?.navigation?.state?.params?.MockexamDetailsFromThemesScreen) {
        this.setState({ 
          mocExam: true, 
          mockExamflashcardSelectedItem: this.props?.navigation?.state?.params?.MockexamDetailsFromThemesScreen 
        })
      }

     if(this.props.navigation?.state?.params?.isItfromThemesLessonList ){
      this.setState({counterFlash:this.props.navigation?.state?.params?.totalCardCountFromThemes,flashcardCount:this.props.navigation?.state?.params?.totalCardCountFromThemes})

     }

      if (this.props?.navigation?.state?.params?.quizexamDetailsFromThemesScreen) {
        this.setState({
          quzziesModal: true,
          quizeTitle: this.props?.navigation?.state?.params?.theme_name,
          quizeName: this.props?.navigation?.state?.params?.theme_name,
          quizzesExamCardSelectedItem: this.props?.navigation?.state?.params?.itemData,
          quizThemeId: this.props?.navigation?.state?.params?.theme_id,
          quizeAndMoc_id:this.props?.navigation?.state?.params?.theme_id,
        })
      }

      

      // The screen is focused
      // Call any action
    });
    // console.log("id ==== course id theme", this.props?.navigation?.state?.params?.course_id)
  }

  async componentWillUnmount() {
    // Remove the event listener
    // console.log("jjjjjjjjjjjj-------")
    this.setState({isLoading:false,})
    this.setState({iamImounted:false})

    this.focusListener.remove();

  }


  async getToken() {
    let token: any = await AsyncStorage.getItem('LOGIN_TOKEN')
    this.setState({ mocExam_data: [] })
    this.setState({
      user_token: token,
      course_id: this.props?.navigation?.state?.params?.course_id,
      theme_id: this.props?.navigation?.state?.params?.item?.attributes?.theme_id,
      lessonFlashcard: this.props?.navigation?.state?.params?.theme_id,
      theme_type: this.props?.navigation?.state?.params?.item?.type,
      testing: this.props?.navigation?.state?.params?.testing,
      courseImage: this.props?.navigation?.state?.params?.courseImage,
      isItOffline : this.props?.navigation?.state?.params?.isItOffline
    },
      () => { this.getCourseDetailsFun()})
    this.getMockexamDropdownListFun("Mock Exam")
   this. getQuizexamDropdownListFun()
  };

  getQuizExamStatus = async() => {
    const quizArrayData = await getAsyncDataKeys('QuizExamArray')
    let quizArrayObj = {
      "ids": quizArrayData,
      "exam_type": "quiz_exam"
  }
    this.getQuizConfirmApiCallId = await this.apiCall({
      contentType: "application/json",
      method: "POST",
      endPoint: `bx_block_quiz_and_mock_exams/quiz_and_mock_exam/confirm_and_reset`,
      body:quizArrayObj
    })
  }

  ApicallforRightAnswerUpdate = async () => {
    const mockArrayData = await getAsyncDataKeys('MockExamArray')
    console.log("mockArrayData $$$$$$", mockArrayData)
    let thebody = {
      "ids": mockArrayData,
      "type": 'confirm'
    }

    console.log("thebody @@@@@", thebody)
    this.ApicallforMockExamUpdateId = await this.apiCall({
      contentType: "application/json",
      method: "Post",
      endPoint: `bx_block_quiz_and_mock_exams/quiz_and_mock_exam/confirm_and_reset`,
      body: thebody
    });
  };

  async getFlashCardsThemList(theme_id: any) {
    console.log('yess flash function call', this.state.theme_id)
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
      configJSON.GetThemlist + "?theme_id=" + theme_id
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.apiPostMethod
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify({ 'id': this.state.course_id })
    )
    runEngine.sendMessage(requestMessage.id, requestMessage);
    console.log('hsvcgsadedqwdqgdgdgewj', requestMessage)
  }

  RestartCourseFunction = () => {
    if (this.state?.course_Details?.user_course_percentage == '100') {
      this.restartCourseApi()
    }
    else {
      this.props.navigation.navigate("Themes", { course_id: this.props?.navigation?.state?.params?.course_id || this.state.courseId, course_name : this.state.isConnect? this.state.course_Details?.course_name: this.state.course_Details?.course?.course_name})
    }
  }

  async restartCourseApi() {
    const header = {
      "Content-Type": configJSON.productApiContentType,
      token: this.state.user_token,
    };
    const body = {
      id: this.state.course_id
    }



    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.restartCourseId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      'restart/course'
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.apiPostMethod
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(body)
    )
    console.log(requestMessage, "my body check")
    this. addDataTocongratualationsonstart()
    runEngine.sendMessage(requestMessage.id, requestMessage);
  }

  async getQuizeAndMock(theme_id: any, mock_exam: any) {
    console.log('yess function call')
    const header = {
      "Content-Type": configJSON.productApiContentType,
      token: this.state.user_token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.getMockQuizApiCallid = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.GetThemlist + "?theme_id=" + theme_id + "exam_type=" + mock_exam
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.apiPostMethod
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify({ 'id': this.state.course_id })
    )
    runEngine.sendMessage(requestMessage.id, requestMessage);
  }

  async receive(from: string, message: Message) {
    console.log('@@@ API MESSAGE LOGIN VIEW =================', message)
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      )

      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      )
      console.log(' @@@@ responseJson data  ==', responseJson)
      var errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      )

      if (responseJson && !responseJson.errors) {

        if(apiRequestCallId === this.getQuizConfirmApiCallId){
          console.log("response of getQuizConfirmApiCallId @", responseJson)
        }

        if(apiRequestCallId === this.ApicallforMockExamUpdateId){
          console.log("response of ApicallforMockExamUpdateId @", responseJson)
        }

        if (apiRequestCallId === this.getCourseDetailsCallApiId) {
          this.courseDetailSuccessCallBack(responseJson)
        }
        else if (apiRequestCallId === this.getCourseStartCallApiId) {
          this.setState({ isLoading: false });
          this.courseStartSuccessCallBack(responseJson)
        }
        else if (apiRequestCallId === this.createFlashcardApiCallId) {
          this.createFlashcardSuccessCallBack(responseJson)
        }
        else if (apiRequestCallId === this.unEnrollFromCourse) {
          this.unEnrollFromCourseSuccessCallBack(responseJson)
        }
        else if (apiRequestCallId === this.restartCourseId) {
          this.RestartSuccessCallBack(responseJson)
        }
        else if (apiRequestCallId === this.getMockexamDropdownListId) {
          this.mockExamListSuccessCallback(responseJson)
        }
        else if (apiRequestCallId === this.getQuizexamDropdownListId) {
          console.log("getQuizexamDropdownListId @@@@@@", responseJson)
          this.quizExamListSuccessCallback(responseJson)
        }

      } else if (responseJson && responseJson.errors) {
        if (apiRequestCallId === this.getCourseDetailsCallApiId) {
          this.courseDetailFailureCallBack(responseJson)
        }
        else if (apiRequestCallId === this.getCourseStartCallApiId) {
          this.setState({ isLoading: false });
          this.courseStartFailureCallBack(responseJson)
        }
        else if (apiRequestCallId === this.createFlashcardApiCallId) {
          this.createFlashcardFailureCallBack(responseJson)
        }
        else if (apiRequestCallId === this.unEnrollFromCourse) {
          this.createFlashcardFailureCallBack(responseJson)
        }
        else if (apiRequestCallId === this.restartCourseId) {
          this.RestartFailureCallback(responseJson)
        }
        else if (apiRequestCallId === this.getMockexamDropdownListId) {
          this.mockExamFailureCallback(responseJson)
        }
        else if (apiRequestCallId === this.getQuizexamDropdownListId) {
          this.setState({isquizzloading:false})
          this.quizExamFailureCallback(responseJson)
        }
      } else if (errorReponse) {
        // this.setState({ isLoading: false })
        console.log('errorReponse', errorReponse)
      }
    }
  }

  courseDetailSuccessCallBack = (responseJson: any) => {
    this.setState({  })
    console.log('@@@ course details Success CallBack =================', responseJson.data)
    this.functionTohandleComgo(responseJson)
    this.setState({
      course_Details: responseJson?.data, 
      courseId: responseJson?.data?.course?.id,
      themeGetid: responseJson?.data?.theme_ids[0] ,
      isLoading: false,
    }

    ) 
    this.getQuizExamStatus()
  };

  mockExamListSuccessCallback(responseJson: any) {
    console.log('@@@ mockexam Success CallBack =================', responseJson)
          this.setState({ mocExam_data: responseJson ,ismockexmloading:false})
  }
  mockExamFailureCallback(responseJson: any) {
    this.setState({ismockexmloading:false})
    console.log('@@@ mockexam Success CallBack =================', responseJson)
  }
  async quizExamListSuccessCallback(responseJson: any) {
    console.log('@@@ quizexam Success CallBack =================', responseJson)
    this.setState({ quizzExamData: responseJson,isquizzloading:false })
  }
  quizExamFailureCallback(responseJson: any) {
    console.log('@@@ quizexam Failure CallBack =================', responseJson)
    this.setState({ isLoading: false })
  }

  unEnrollFromCourseSuccessCallBack = (responseJson: any) => {
    console.log('@@@ unenrolled Success CallBack =================', responseJson)
    this.setState({ unEnrollCourse: false, shouldDisplayunenrollToastmessage: true, unenrollSuccess: true })

    setTimeout(() => {
      this.setState({ shouldDisplayunenrollToastmessage: false })
    }, 2000)

  }

  courseDetailFailureCallBack = (responseJson: any) => {
    console.log('@@@ course details failure callBack =================', responseJson)
    this.setState({ isLoading: false, })
  };
  unEnrollFromCourseFailureCallBack = (responseJson: any) => {
    console.log('@@@ unenrolled failure callBack =================', responseJson)
    this.setState({ unEnrollCourse: false, shouldDisplayunenrollToastmessage: true, unenrollSuccess: false })
    setTimeout(() => {
      this.setState({ shouldDisplayunenrollToastmessage: false })
    }, 2000)
  }

  courseStartSuccessCallBack = (responseJson: any) => {
    this.setState({ isLoading: false, })
    console.log('@@@ course start Success CallBack =================', responseJson)
    this.getCourseDetailsFun()
    // this.setState({ course_start: true })
  };

  courseStartFailureCallBack = (responseJson: any) => {
    this.setState({ isLoading: false, })
    console.log('@@@ course start failure callBack =================', responseJson)

  };
  createFlashcardSuccessCallBack = (responseJson: any) => {
    this.setState({ isLoading: false, })
    console.log('@@@ create flashcard Success CallBack =================', responseJson)
    this.setState({ courseThemeListData: responseJson.drop_down_list ,isflahscardloading:false},()=>{
      if(this.props.subscriptionState?.subscriptionInfo?.userSubscription=="unsubscribed")
      {
        let newdropdown=responseJson.drop_down_list
        newdropdown.shift()
        this.setState({ courseThemeListData:newdropdown},()=>{
          console.log("checking the dropdown in flash")
        })
      }
    })

    console.log(this.props.navigation?.state?.params, "i am runninggggggss")


    if (this.props.navigation?.state?.params?.isItfromThemesLessonList) {
      console.log(this.state.courseThemeListData, "i am runninggggggss")


      let myFilteredData = responseJson.drop_down_list.filter((item: any) => {
        return item?.title === this.props.navigation?.state?.params?.flashCardTitle
      })
      console.log(myFilteredData, "i am runninggggggss")
      this.setState({
        flashCardcountFromtheThemescreen: myFilteredData?.card_count,
        flashCardItemFromThemesScreen: { ...myFilteredData }
      })

    }
  };

  createFlashcardFailureCallBack = (responseJson: any) => {
    console.log('@@@ create flashcard failure callBack =================', responseJson)
    this.setState({ isLoading: false })
  };

  courseUpdateSuccessCallBack = (responseJson: any) => {
    this.setState({ isLoading: false, })
    console.log('@@@ get course reward point Success CallBack =================', responseJson)
    this.setState({ course_reward_point: responseJson?.data })
  };

  courseUpdateFailureCallBack = (responseJson: any) => {
    this.setState({ isLoading: false, })
    console.log('@@@ get course reward point failure callBack =================', responseJson)

  };

  RestartSuccessCallBack = (responseJson: any) => {
    console.log('@@@ create restart success callBack =================', responseJson)
    this.getToken()
  }

  RestartFailureCallback = (responseJson: any) => {
    console.log('@@@ create restart failure callBack =================', responseJson)
  }

  apiCall = async (data: any) => {
    const { contentType, method, endPoint, body, type } = data
    const header = {
      'Content-Type': contentType,
      token: this.state.user_token,
    }
    console.log('user token here----',this.state.user_token)
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

  getCourseDetailsFun = async () => {
    console.log("start course detail --",this.state.course_id)
    // this.setState({ isLoading: true })
    this.getCourseDetailsCallApiId = await this.apiCall({
      contentType: configJSON.productApiContentType,
      method: configJSON.apiMethodTypeGet,
      endPoint: configJSON.getCourseDetialsApiEndPoint + this.state.course_id
    });
  }

  getMockexamDropdownListFun = async (examType: any) => {
    this.setState({ismockexmloading:true})
    this.getMockexamDropdownListId = await this.apiCall({
      contentType: configJSON.productApiContentType,
      method: configJSON.apiMethodTypeGet,
      endPoint: `bx_block_quiz_and_mock_exams/quiz_and_mock_exam/get_answer_list?exam_type=${examType}&course_id=${this.props?.navigation?.state?.params?.course_id}`,
    })
  }
  getQuizexamDropdownListFun = async () => {
    this.setState({isquizzloading:true})
    console.log("this.props?.navigation?.state?.params?.course_id @@@", this.props?.navigation?.state?.params?.course_id)
    let courseID=this.props?.navigation?.state?.params?.course_id||this.state.coures_id;
    let courseUrl = `bx_block_quiz_and_mock_exams/quiz_and_mock_exam/get_answer_list?exam_type=Quiz Exam&course_id=${courseID}`
    this.getQuizexamDropdownListId = await this.apiCall({
      contentType: configJSON.productApiContentType,
      method: configJSON.apiMethodTypeGet,
      endPoint: courseUrl
    })
    console.log("this.getQuizexamDropdownListId :::@@", courseUrl)
  }

  // getQuizExamStatus = async() =>{
  //   const quizArrayData = await getAsyncDataKeys('QuizExamArray')
  //   let quizArrayObj = {
  //     "ids": quizArrayData,
  //     "exam_type": "quiz_exam"
  // }
  //   this.getQuizConfirmApiCallId = await this.apiCall({
  //     contentType: "application/json",
  //     method: "POST",
  //     endPoint: `bx_block_quiz_and_mock_exams/quiz_and_mock_exam/confirm_and_reset`,
  //     body:quizArrayObj
  //   })
  // }

  onPressCourseStart = async () => {
    this.setState({ isLoading: true });
    if (this.state.courseId) {
      let body = {
        id: this.state.courseId
      }
      this.getCourseStartCallApiId = await this.apiCall({
        contentType: configJSON.productApiContentType,
        method: configJSON.apiPostMethod,
        endPoint: `${configJSON.startCourseApiEndPoint}`,
        body: body
      })
      this.setState({ course_start: true, isVisible: false })
    }
    this.addDataTocongratualationsonstart();
  }

  onPressUnenrollCourse = async () => {
    let body = {
      course_id: this.state.courseId
    }
    this.unEnrollFromCourse = await this.apiCall({
      contentType: configJSON.productApiContentType,
      method: configJSON.apiPostMethod,
      endPoint: `unenroll/course`,
      body: body
    })
  }

  onPressFlashcardStart = async () => {
    // this.setState({isflahscardloading:true})
    this.createFlashcardApiCallId = await this.apiCall({
      contentType: configJSON.productApiContentType,
      method: configJSON.apiMethodTypeGet,
      endPoint: `${configJSON.getFlashcardApiEndPoint}?course_id=${this.state.courseId}`,
    })
    if(this.state.isItOffline){
      this.setState({isflahscardloading:false})
    }
  }

  getCourseDetailsOfflineFun = async () => {
    let responseJson = {} as any
    let responseJsonDropDown = {} as any
    let responseJsonMock = {} as any
    let newResponseJson = {} as any
    let allOfflineData = this.props.offlineState.offlineData;
    let params=  this.props?.navigation?.state?.params
console.log('alll courses',JSON.stringify(allOfflineData))
    responseJson = allOfflineData.all_courses.filter((xdata: any, i: any) => {
      console.log('course id',xdata.id,this.props.navigation.state.params?.course_id)
      if (xdata.id == this.props.navigation?.state?.params?.course_id) return xdata
    })

    responseJsonDropDown = allOfflineData?.dropdown_quiz_list?.filter((ydata:any , i:any) => {
      if (ydata.course_id == this.props.navigation?.state?.params?.course_id) return ydata
    })
    console.log("responseJson ++",allOfflineData, responseJsonDropDown)

    responseJsonMock= allOfflineData.mock_exams.filter((ele:any, i:any) => {
      return ele.mock_exams.some((x:any)=>x.attributes.course_id == this.props.navigation?.state?.params?.course_id)
    })

    let offlineFlascardDropDownData=allOfflineData?.flash_cards?.drop_down_list.filter((ele:any)=>{

      console.log('all flash cards',ele)
      return ele.course_id==params?.course_id
    })

    // let cardcount=0
    // let user_count=0
    // for(let i=0;i<offlineFlascardDropDownData.length;i++)
    // {
    //   cardcount=cardcount+  offlineFlascardDropDownData[i].card_count
    //   user_count=user_count+offlineFlascardDropDownData[i].user_count
    // }







    if( offlineFlascardDropDownData.length!==0 && offlineFlascardDropDownData[0].type!=="course")
    {

      let Allflashcards={
        type: "course",
        course_id: params?.course_id,
        title: "All flashcards",
        card_count:allOfflineData?.all_courses?.filter((ele:any)=>ele?.id==params?.course_id)[0]?.course_flashcards,
        user_count:allOfflineData?.all_courses?.filter((ele:any)=>ele?.id==params?.course_id)[0]?.user_course_flashcard
      }
         

     offlineFlascardDropDownData=[Allflashcards,...offlineFlascardDropDownData]
    }

    // console.log(offlineFlascardDropDownData,"checking flashcard dropdownnlist")



    newResponseJson['certificate'] = responseJson[0].certificate
    newResponseJson['certificate_fr'] = responseJson[0].certificate_fr
    newResponseJson['completion_fr'] = responseJson[0].completion_fr
    newResponseJson['course_name'] = responseJson[0].course_name
    newResponseJson['course_name_fr'] = responseJson[0].course_name_fr
    newResponseJson['description'] = responseJson[0].description
    newResponseJson['description_fr'] = responseJson[0].description_fr
    newResponseJson['difficulty'] = responseJson[0].difficulty
    newResponseJson['difficulty_fr'] = responseJson[0].difficulty_fr
    newResponseJson['drink_type_fr'] = responseJson[0].drink_type_fr
    newResponseJson['duration'] = responseJson[0].duration
    newResponseJson['id'] = responseJson[0].id
    newResponseJson['profile_id'] = responseJson[0].profile_id
    newResponseJson['value'] = responseJson[0].value
    newResponseJson['value_fr'] = responseJson[0].value_fr
    newResponseJson['year'] = responseJson[0].year
    responseJson[0]['course'] = newResponseJson
    responseJson[0]['drop_down_list'] = responseJsonDropDown
    responseJson[0]['data'] = responseJsonMock
    console.log("responseJson OFFline mohit",offlineFlascardDropDownData)
    this.setState({
      course_Details: responseJson[0], 
      courseId: this.state?.courseId,
      quizzExamData:responseJson[0],
      mocExam_data:responseJson[0],
      courseThemeListData:offlineFlascardDropDownData
    },()=>{
      console.log('course detail',this.state.course_Details)
    })
  }

  updateRewardPoint = async () => {
    let body = {
      leader_board: {
        reward_point: 10
      }
    }
    this.courseUpdateApiCallId = await this.apiCall({
      contentType: "application/json",
      method: "POST",
      endPoint: "bx_block_profile/leader_boards",
      body: body
    })
  }

functionResposibleforAddingdropodwnlistTostates=(item:any)=>{
console.log("i am going to flashcard beigin",item)
  if(item.type=="course")
  {
    console.log("i am going to flashcard first condition")

    this.setState({ dropDown: false, flashCardID: item?.course_id, themeGetid: item?.theme_id, flashCardTitle: item?.title, flashcardName: 'Theme', flashcardCount: item?.card_count,flashcardUserCompletedCount :item?.user_count,typeOfselectedFlashcard:"course_id",counterFlash:item?.card_count})
  }
  else{
  this.setState({ dropDown: false, flashCardID: item?.id, themeGetid: item?.theme_id, flashCardTitle: item?.title, flashcardName: 'Theme', flashcardCount: item?.card_count,flashcardUserCompletedCount :item?.user_count,typeOfselectedFlashcard:"theme_id",counterFlash:item?.card_count,product_type_flashcard:item?.product_type})
  }

}

  addDataTocongratualationsonstart = async () => {
    let stringifiedCongo = await AsyncStorage.getItem("CONGRATULATIONS")
    let congo = JSON.parse(stringifiedCongo)
    let courseID = this.props?.navigation?.state?.params?.course_id
    congo[courseID] = "progress"
    await AsyncStorage.setItem("CONGRATULATIONS", JSON.stringify(congo))
  }

functionTohandleComgo=async(respose:any)=>{

  let stringifiedCongo= await AsyncStorage.getItem("CONGRATULATIONS")
  let congo=JSON.parse(stringifiedCongo)

let courseID= this.props?.navigation?.state?.params?.course_id

console.log(respose?.data?.course_status,respose?.data?.status
  ,"00000011111122222")

if(congo[courseID])
{
  console.log(respose?.data?.course_status,respose?.data?.course?.id,"00000011111122222333")

  // delete congo[courseID]
  if(respose?.data?.status=="complete")
  {
delete congo[courseID]
 await AsyncStorage.setItem("CONGRATULATIONS",JSON.stringify(congo) )
 this.setState({goingTocongo:true})
 this.props.navigation.navigate("Congratulation", { course_id: courseID })
  }
}
}


  getRewardPoint = () => {
    if (this.state.course_reward_point.attributes.status == "complete") {
      () => this.updateRewardPoint()
    }
  }


  convertDateTotext=()=>{
    if(!this.state.course_Details?.completion_date)
    {
    return
    }
let mydatearray=this.state.course_Details?.completion_date.split("/")

let mydatearrange=mydatearray[1]+"/"+mydatearray[0]+"/"+mydatearray[2]
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var now = new Date(mydatearrange);
    console.log(now,days[now.getDay()] + ' ' + months[now.getMonth()] + ' ' + now.getDate() + ' ' + now.getFullYear(),"daateeeee"); //Tuesday February 12 2013
return  "Completed on "+ now.getDate() + " "+months[now.getMonth()] +" " + now.getFullYear()
  }

quizzesmodalhide=() => {
  if(!this.props?.navigation?.state?.params?.quizexamDetailsFromThemesScreen && this.state.quzziesModal)
  {
   this.setState({ quzziesModal: false, quizzesExamCardSelectedItem: {}, dropDown: false ,quizeAndMoc_id: "", quizeName: "", quizeTitle: ""})
  }
  else{
   return
  }
   }

   navigatefromOverviewtothemesForquiz=() =>{
    if (this.props?.navigation?.state?.params?.quizexamDetailsFromThemesScreen) {
      this.props.navigation.navigate("Themes", { course_id: this.props?.navigation?.state?.params?.course_id || this.state?.courseId || this.state?.course_Details?.id});
      this.setState({ quzziesModal: false, quizzesExamCardSelectedItem: "", isLoading: false });
        this.props.navigation.setParams({ quizexamDetailsFromThemesScreen: null });
    }
    this.setState({ quzziesModal: false, quizeAndMoc_id: "", quizeName: "", quizeTitle: "" })
}


gotoQuizfromquizzesmodal=() => {
  if(this.state.quizeAndMoc_id=="" || this.state.course_Details.course.course_quiz_exams==0)
  {
      return
  }
  if(this.state?.quizzesExamCardSelectedItem?.value=="Payable" && this.props.subscriptionState?.subscriptionInfo?.userSubscription=="unsubscribed")
  {
    this.setState({quzziesModal:false},()=>{
          this.setState({subscriptionModal:true})

    })
    return
  }


  this.setState({ quzziesModal: false }, () => {    this.state.quizeTitle && this.props.navigation.navigate("QuizzesExamInit", {
  quizeAndMoc_id: this.state.quizeAndMoc_id,
  quizeType: this.state.quizeType ,
  quizThemeId:this.state?.quizzesExamCardSelectedItem.id !== undefined ? this.state?.quizzesExamCardSelectedItem.id : this.state?.quizThemeId,
  isItFromQuizExamMOdal:true,
  isItFromMockExamMOdal:false,
  courseName: this.state?.course_Details?.course?.course_name,
  quizExamDatafromOverviewQuizexamModal: [this.state?.quizzesExamCardSelectedItem],
  course_id:this.props?.navigation?.state?.params?.course_id
}) })
if (this.props?.navigation?.state?.params?.quizexamDetailsFromThemesScreen) {
  setTimeout(() => {
      this.setState({ quzziesModal: false, quizeTitle: "",quizzesExamCardSelectedItem:'', isLoading: false });
      this.props.navigation.setParams({ quizexamDetailsFromThemesScreen: null });
  })

}
}

Mockexamtouchablewithoutfeedback=() => {
 if ( !this.props?.navigation?.state?.params?.MockexamDetailsFromThemesScreen && this.state.mocExam )
 {
      this.setState({ mocExam: false, mockExamflashcardSelectedItem: {}, dropDown: false }) 

 }
  
  }

mockexammodalnavigatetothemes=() => {
  if (this.props?.navigation?.state?.params?.MockexamDetailsFromThemesScreen) {
      this.props.navigation.navigate("Themes", { course_id: this.props?.navigation?.state?.params?.course_id || this.state?.courseId })
      this.setState({ mocExam: false, mockExamflashcardSelectedItem: "", isLoading: false });
      this.props.navigation.setParams({ MockexamDetailsFromThemesScreen: null });
  }
  this.setState({ mocExam: false, quizeAndMoc_id: "", mocExamName: "", mocExamTitle: "",mockExamflashcardSelectedItem: {} })
}
mockexammodalstartbutton=() => {

  if(this.state?.mockExamflashcardSelectedItem?.product_type=="Payable" && this.props.subscriptionState?.subscriptionInfo?.userSubscription=="unsubscribed")
  {
    this.setState({mocExam:false},()=>{
          this.setState({subscriptionModal:true})
    })
    return
  }

  this.setState({ mocExam: false }, () => { this.state?.mockExamflashcardSelectedItem?.name && this.props.navigation.navigate("MocExamInit", { mockExamDatafromOverviewMockexamModal: [this.state?.mockExamflashcardSelectedItem], courseName: this.state?.course_Details?.course?.course_name, isItFromMockExamMOdal:true, course_id:this.props?.navigation?.state?.params?.course_id}) })
  if (this.props?.navigation?.state?.params?.MockexamDetailsFromThemesScreen) {
      setTimeout(() => {
          this.setState({ mocExam: false, mockExamflashcardSelectedItem: "", isLoading: false });
          this.props.navigation.setParams({ MockexamDetailsFromThemesScreen: null });
      })

  }
}
isusersubscribed=()=>{
  return this.props.subscriptionState?.subscriptionInfo?.userSubscription
}

}
// Customizable Area End