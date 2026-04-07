// Customizable Area Start
import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { runEngine } from "../../../framework/src/RunEngine";
import { isConnected } from "../../../mobile/src/utils/internetConnection";
import { AsynchStoragekey } from "../../../mobile/src/utils";
import { getAsyncDataKeys } from '../../../mobile/src/utils/AsyncKeysStorage'
import { COLORS } from "../../../framework/src/Globals";
import {readFile} from "../../../mobile/src/utils/downloadingFiles";
import DeviceInfo from "react-native-device-info";
import { CommonActions } from "@react-navigation/native";




export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  offlineState:any;
  subscriptionState:any;
  addOfflineData:(val:any)=>void;
  updateOfflineData : (val : any) => void;
  loadingOfflineData : (val : any ) => void;
  addSubscription:(val:any)=>void;
}

interface S {
    
  // data:any;
  user_token: any;
  themes_data: any;
  theme_data_point: any;
  coures_id: any;
  course_name: any;
  isLoading: boolean;
  mockExamdata: any;
  subscription: any;
  isItOffline: boolean;
  saveImage: any;
  deviceModel:any;
  subscriptionModal:boolean;
  
}

interface SS {
  id: any;
}

export default class ThemesController extends BlockComponent<Props, S, SS> {
  getThemesApiCallId: any;
  focusListener: any;
  themePointUpdateApiCallId: any;
  getQuizConfirmApiCallId:any;
  ApicallforMockExamUpdateId:any
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionSaveMessage),
      getName(MessageEnum.SessionResponseMessage),
      
      
    ];

    this.state = {
         
      themes_data: [],
      user_token: '',
      coures_id: '',
      course_name: "",
      isLoading: false,
      subscription: '',
      theme_data_point: "",
      mockExamdata: [],
      isItOffline: false,
      saveImage: [],
      deviceModel:"",
      subscriptionModal:false
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
 
    
  }
 

 async componentWillMount() {
  let model=await DeviceInfo.getModel()
  this.setState({deviceModel:model})
}


  async componentDidMount() {
    console.log("innnnside theme scr", this.state.course_name);
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("willFocus", async () => {
      // this.getToken()
      console.log("in themes remove loader",this.props.navigation?.state?.params?.course_id)
      let connectionStatus = await isConnected().then(response => response).catch(err => console.log(err))
      if (connectionStatus !== undefined) {
        let model=await DeviceInfo.getModel()
       this.setState({deviceModel:model})
        console.log(model,"my model mymod")
        this.getQuizExamStatus()
        console.log(this.state.coures_id==this.props.navigation?.state?.params?.course_id,"in themes remove loader")
        console.log("mounteddd in controller",this.props.navigation

        )
        
        console.log("load.....")
        this.getToken()

        if(this.state.coures_id==this.props.navigation?.state?.params?.course_id)
        {
this.setState({isLoading:false})
        }
        else{
          this.setState({isLoading:true})
        }

      } else {

        let Subscribe =this.props.subscriptionState?.subscriptionInfo?.userSubscription;
        

        this.setState({isItOffline: true,subscription: Subscribe});
        this.getLessonOfflineData()
      }
    })
  }

  async componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }



  

  async getToken() {
    let token: any = await AsyncStorage.getItem('LOGIN_TOKEN')
    console.log('overview theme id ===== props', this.props.navigation?.state?.params)
    this.setState({ user_token: token, coures_id: this.props.navigation?.state?.params?.course_id }, () => this.getLessonCourseData())
    this.setState({ user_token: token},()=>this.getQuizExamStatus())
    this.setState({ user_token: token}, ()=>this.ApicallforRightAnswerUpdate())
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
      console.log('@@@@@ response course theme list =====', responseJson)
      var errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      )
      // console.log("@@@@@@ errror ==", errorReponse)
      if (responseJson && !responseJson.errors) {

        console.log("getQuizConfirmApiCallId start", apiRequestCallId === this.getQuizConfirmApiCallId)
        if(apiRequestCallId === this.getQuizConfirmApiCallId){
          // this.setState({ isLoading: false })
          console.log("response of getQuizConfirmApiCallId @", responseJson)
        }
        if(apiRequestCallId === this.ApicallforMockExamUpdateId){
          console.log("response of ApicallforMockExamUpdateId @", responseJson)
        }
        if (apiRequestCallId === this.getThemesApiCallId) {
         
          console.log(responseJson, "response in themessss")
          this.courseThemeListSuccessCallBack(responseJson)
          
        }
        else if (apiRequestCallId === this.themePointUpdateApiCallId) {
          console.log(responseJson, "response in reward point")
          this.themePointUpdateSuccessCallBack(responseJson)
          // this.setState({ isLoading: false })
        }

      } else if (responseJson && responseJson.errors) {
        if (apiRequestCallId === this.getThemesApiCallId) {
          this.courseThemeListFailureCallBack(responseJson)
        }
        else if (apiRequestCallId === this.themePointUpdateApiCallId) {
          this.themePointUpdateFailureCallBack(responseJson)
        }
      } else if (errorReponse) {
        console.log('errorReponse', errorReponse)
      }
    }
  }

  courseThemeListSuccessCallBack = async (responseJson: any) => {
    console.log('@@@ theme list success CallBack =================', responseJson)
    const api_sresponce = responseJson?.data
    function compare( a:any, b:any ) {
      if ( a.id < b.id ){
        return -1;
      }
      if ( a.id > b.id ){
        return 1;
      }
      return 0;
    }
    api_sresponce.sort( compare );
    this.setState({ themes_data: api_sresponce });
    this.setState({
      //themes_data: responseJson?.data,
      course_name: responseJson?.course_name,
      mockExamdata: responseJson?.quiz_and_mock_exams?.data
  });
   
    // =================================add user info=============================================//
    // let Subscribe = await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.USER_SUBSCRIPTION)
    let Subscribe =this.props.subscriptionState?.subscriptionInfo?.userSubscription;
    console.log("checking the subsciption",Subscribe)
    this.setState({ subscription: Subscribe})
    // ==============================================================================//
    this.getQuizExamStatus()
    this.setState({ themes_data: responseJson?.data, course_name: responseJson?.course_name, mockExamdata: responseJson?.mock_exams }),
      () =>{ this.getRewardPoint()}
      this.setState({isLoading:false})
  };

  courseThemeListFailureCallBack = (responseJson: any) => {
    // this.setState({ isLoading: false })
    console.log('@@@ theme list failure callBack =================', responseJson)
    this.setState({ themes_data: [] })
  };

  themePointUpdateSuccessCallBack = (responseJson: any) => {
    // this.setState({ isLoading: false })
    console.log('@@@ theme reward point success CallBack =================', responseJson)
    this.setState({ theme_data_point: responseJson?.data })
  };

  themePointUpdateFailureCallBack = (responseJson: any) => {
    // this.setState({ isLoading: false })
    console.log('@@@ theme reward point failure callBack =================', responseJson)
  };

  apiCall = async (data: any) => {
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


  getLessonOfflineData = async () => {
    let responseJson = {} as any
    let allOfflineData = this.props.offlineState?.offlineData;
    console.log('offline data theme',allOfflineData?.all_themes)
    responseJson['themeObj'] = allOfflineData.all_themes.filter((xdata: any, i: any) => {
      console.log("themes offline obj",this.props.navigation.state.params.course_id)
      if (xdata.course_id == this.props.navigation.state.params.course_id) return xdata
    })
    console.log('theme object',JSON.stringify(responseJson))
    responseJson['mockObj'] = allOfflineData.mock_exams.filter((xdata: any) => xdata.mock_exams.some((x: any) => x.attributes.course_id == this.props.navigation.state.params.course_id))
    this.setState({
      themes_data: responseJson.themeObj,
      mockExamdata: responseJson.mockObj,
      course_name: this.props.navigation.state.params.course_name,
      coures_id: this.props.navigation?.state?.params?.course_id
    }, () => console.log(this.state.themes_data , "themesdattafrnn"));
    this.getTheFileLocation();
  }

  getTheFilesFromAsync = async (id: any) => {
    try{
      console.log(id, "getidTheme");
      const datafile = await getAsyncDataKeys(`theme_${id}`);
      console.log("datafilefrtyuiTheme", datafile);
      const datapath = await readFile(datafile);
      console.log("datapathTheme", datapath);
      if(datapath !== null){
        console.log("setStateinfileTheme");
        this.setState({saveImage: [...this.state.saveImage, datapath]}, () => {console.log(this.state.saveImage, "dadsgsgsjhgjgTheme")});
      }
    }catch(error){
      console.log("Error in retriving datta Theme", error);
    }
   }
  
   
   getTheFileLocation = async () => {
    console.log("get the file location Theme");
    this.state.themes_data?.map((elem: any) => {
      this.getTheFilesFromAsync(elem.id);
    });
   }

  getLessonCourseData = async () => {
    // this.setState({ isLoading: true })
    console.log("course theme id ======== ", this.props.navigation.state.params.course_id)
    this.getThemesApiCallId = await this.apiCall({
      contentType: "application/json",
      method: "GET",
      endPoint: `themes/list?course_id=${this.props.navigation.state.params.course_id}&status=complete`,
    })
  }

  themeUpdateRewardPoint = async () => {
    let body = {
      leader_board: {
        reward_point: 5
      }
    }
    this.themePointUpdateApiCallId = await this.apiCall({
      contentType: "application/json",
      method: "POST",
      endPoint: "bx_block_profile/leader_boards",
      body: body
    })
  }

  getRewardPoint = () => {
    if (this.state.theme_data_point.attributes.status == "complete") {
      () => this.themeUpdateRewardPoint()
    }
  }


  functionCircularpogresscalculation=(total_count:any,user_count:any)=>
  {
    // total_count
    // user_count

    let totalpercentage=(user_count/total_count)*100

let progressColor=COLORS.lightRed
let pointsText=""

console.log(totalpercentage,"checking this thing out")

 if(totalpercentage<70)
 {
  progressColor=COLORS.lightRed
  pointsText=COLORS.lightRed

 }
 else if(totalpercentage>70 && totalpercentage<100 ){
  progressColor=COLORS.success

  pointsText=COLORS.success

 }
 else if(totalpercentage==100 ){
  progressColor=COLORS.success
  pointsText=COLORS.white

 }

            {/* <CircularProgresss progressColor={this.props.myState.CircularprogressprogressColor} progress={this.props.myState.Progresspercentage} fillColor={this.props.myState.CircularprogressfillColor} pointscolor={this.props.myState.Circularprogresspointscolor} textColor={this.props.myState.CircularprogresstextColor} pointsText={this.props.myState.Circularprogresspointstext} totlatext={this.props.myState.Circularprogresstotlatext} /> */}

return {
  progressColor,
  progress:totalpercentage,
  fillColor:total_count===user_count?'rgb(109,197,150)':COLORS.white,
  pointscolor:pointsText,
  pointsText:user_count,
  totlatext:total_count,
  textColor:total_count===user_count?COLORS.white:COLORS.lightGray,
  
}

  }
  
}
// Customizable Area End