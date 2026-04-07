// Customizable Area Start
import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";


import { imgPasswordInVisible, imgPasswordVisible } from "./assets";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsynchStoragekey } from "../../../mobile/src/utils";

import DeviceInfo from "react-native-device-info";
import { isConnected } from "../../../mobile/src/utils/internetConnection";
export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  offlineState:any;

  
  
}

interface S {
  noteData: any;
  courceName: any;
  newCourceData: any;
  showLodar: boolean;
  deviceModel:any,
  courseId:any;
  isItOffline:boolean;
  
  
}

interface SS {
  id: any;
  
  
}

export default class NotesController extends BlockComponent<
  Props,
  S,
  SS
> {
  
  getNoteCallId: any;
  focusListener: any;
  courseLessonApiCallId:any
  

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    
    this.subScribedMessages = [
      getName(MessageEnum.AccoutLoginSuccess),
      getName(MessageEnum.CountryCodeMessage),
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.ReciveUserCredentials)
      
      
    ];

    this.state = {
      noteData: [],
      courceName: '',
      courseId:'',
      newCourceData: [],
      showLodar: false,
      deviceModel:'',
      isItOffline:false
      
      
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    
    
  }

  async componentWillMount () {
    let model=  DeviceInfo.getModel()
    this.setState({deviceModel:model})
   let courseId= await this.props.navigation.state.params.course_id;
   this.setState({courseId:courseId})
    }
    

  async componentDidMount() {


    this.focusListener = this.props.navigation.addListener("didFocus", async() => {
      let connectionStatus = await isConnected().then(response => response).catch(err => console.log(err))
      if(connectionStatus!==undefined){
        this.setState({isItOffline:false})
        this.getNoteApiCall()
        this.courceData()
    }else{
      this.setState({isItOffline:true})
        this.getOfflineNotes()
    }

    });
  }
  getOfflineNotes = ()=>{
    let offlineData = this.props.offlineState?.offlineData?.all_notes;
    console.log('notes ',offlineData.data)
    let notes:any=[];
    offlineData?.data.map((it:any)=>{
      if(it.attributes.course_id == this.state.courseId){
        notes.push(it)
      }
    })
    this.setState({noteData:notes})
  }

  async courceData() {
    let data = await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.COURCE_NAME)
    console.log('dataaa',data)
    this.setState({ courceName: data })
  }

  async themeData() {
    let courceName = this.state.courceName;
    let courseId = this.state.courseId;

    let newNoteData = [];
    this.state.noteData.map((item: any) => {
      if (courseId === item?.attributes?.course?.data?.id) {
        console.log('course id in notes',courseId,item?.attributes?.course?.data?.id)
        newNoteData.push(item)
        this.setState({ newCourceData: newNoteData })
      }
    })

  }

  async getNoteApiCall() {
    this.setState({ showLodar: true })
    const header = {
      "Content-Type": configJSON.loginApiContentType,
      token: await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN)
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.getNoteCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getNoteApiCallEndPoint
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

console.log("requestMessageNOTE",requestMessage)
    return true;
  }

  offlineCourseRedirection = (data: any, themeId: any) => {
    let offlineData = this.props.offlineState.offlineData
    let selectedIndex = offlineData.all_lessons.data.filter((e, index) => e.id == this.state.selectedIndex)
    let flashcard = offlineData?.flash_cards.data
    let course_id = data.attributes?.course_id
    let theme_id = themeId
    //  let indexlesson=selectedIndex[0].attributes?.lesson_index-1
    this.setState({ showLodar: false })
    // this.props.navigation.navigate('CatalogueStudy', { list:offlineData.all_lessons.data, selectedIndex: indexlesson, themeIndex: null, clickitem: selectedIndex[0], flashcard_data:flashcard, course_id: course_id, theme_id: theme_id })
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
        if (apiRequestCallId === this.getNoteCallId) {
          this.setState({ showLodar: false })
          let mydata = responseJson?.data
          let filteredData = mydata.filter((e: any) => {
            return e.attributes.course_id == this.state.courseId
          })
          this.setState({ noteData: filteredData }, () => this.themeData())
        }

        if (apiRequestCallId == this.courseLessonApiCallId) {
          let selectedIndex = responseJson.lessons.data.filter((e, index) => e.id == this.state.selectedIndex)
          let flashcard = responseJson?.flash_cards.data
          let course_id = responseJson?.course_id
          let theme_id = responseJson?.theme_id
          let indexlesson = selectedIndex[0].attributes?.lesson_index - 1
          this.setState({ showLodar: false })
          this.props.navigation.navigate('CatalogueStudy', { list: responseJson.lessons.data, selectedIndex: indexlesson, themeIndex: null, clickitem: selectedIndex[0], flashcard_data: flashcard, course_id: course_id, theme_id: theme_id, fromNotes: true })
        }
      }
    }
  }
  getLessonCourseData = async (themeID:any) => {
    // this.setState({ isl: true })
    console.log("this.state.themeId :::::::::::::::::::::::::::::",themeID)
    this.courseLessonApiCallId = await this.apiCall({
      contentType: "application/json",
      method: "GET",
      endPoint: `lessons/list?theme_id=${themeID}`,
    })
  }


  apiCall = async (data: any) => {
    const { contentType, method, endPoint, body, type } = data
    const header = {
      'Content-Type': contentType,
      token: await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN)
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
    console.log('@@@ requestMessage ========', requestMessage)
    return requestMessage.messageId;
  }

  
  
}
// Customizable Area End