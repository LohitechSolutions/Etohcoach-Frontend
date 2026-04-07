// Customizable Area Start
import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, { getName } from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isConnected } from "../../../mobile/src/utils/internetConnection";
import { AsynchStoragekey } from "../../../mobile/src/utils";
import { getAsyncDataKeys } from "../../../mobile/src/utils/AsyncKeysStorage";
import { COLORS } from "../../../framework/src/Globals";
import DeviceInfo from "react-native-device-info";



export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  offlineState:any;
  subscriptionState:any;
  addSubscription:(val:any)=>void;
}

interface S {
  data: any;
  user_token: any;
  quizTestVisible: any,
  reviewModalVisible: any,
  course_start: any,
  flashcardsThems: any,
  mock_and_quize: any,
  theme_id: any,
  card_count: any,
  courseLesson: any;
  courseId: any;
  themeId: any;
  course_name: any;
  theme_name: any;
  themeIndex: any;
  continueButtonStatus: boolean;
  flash_cards: any;
  quiz_exams: any;
  course_id: any;
  isLoading: boolean;
  subscription: any;
  subscriptionModal: boolean;
  saveImage: any,
  deviceModel:any;
  isItOffline:boolean;
}

interface SS {
  id: any;
}

export default class CatalogueFiveController extends BlockComponent<Props, S, SS> {
  courseLessonApiCallId: any;
  userInfoApiCallId: any;
  focusListener: any;
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionSaveMessage),
      getName(MessageEnum.SessionResponseMessage),
    ];

    this.state = {
      data: [],
      user_token: '',
      quizTestVisible: false,
      reviewModalVisible: false,
      course_start: false,
      flashcardsThems: [],
      mock_and_quize: [],
      theme_id: '',
      card_count: '',
      courseLesson: [],
      courseId: '',
      themeId: '',
      course_name: "",
      theme_name: '',
      themeIndex: '',
      continueButtonStatus: false,
      flash_cards: [],
      quiz_exams: [],
      course_id: "",
      isLoading: false,
      subscription: '',
      subscriptionModal: false,
      saveImage: [],
      deviceModel:"",
      isItOffline:false,
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

  }

  async componentWillMount() {
    let model=await DeviceInfo.getModel()
    this.setState({deviceModel:model})
  } 
  async componentDidMount() {
    // this.setState({ isLoading: true })
    const { navigation } = this.props;
    // this.getToken()
  

    this.focusListener = navigation.addListener("didFocus", async () => {
      console.log("load.....")
      let subscriptionStatus = this.props.subscriptionState?.subscriptionInfo?.userSubscription;
      this.setState({
        subscription:subscriptionStatus
      })
      let connectionStatus = await isConnected().then(response => response).catch(err => console.log(err))
      if (connectionStatus !== undefined) {
        console.log("mounteddd in controller")
        console.log("load.....")
        // this.getListOfflineRequest()
        this.getToken()
        let model=await DeviceInfo.getModel()
        this.setState({deviceModel:model,isItOffline:false})
console.log("checkthe theme",this.state.themeId,this.props.navigation?.state?.params?.theme_id,this.state)
        if(this.props.navigation?.state?.params?.theme_id==this.state.themeId)
        {

        }

      } else {
        this.setState({isItOffline:true})
        this.getListOfflineRequest();
      }
    })
  }
  async getToken() {
    this.setState({isLoading:true})
    this.userInfoApi()
    let token: any = await AsyncStorage.getItem('LOGIN_TOKEN')
    // this.setState({ continueButtonStatus: true, isLoading: false });
    this.setState({ user_token: token, themeId: this.props.navigation?.state?.params?.theme_id, themeIndex: this.props.navigation?.state?.params?.themeIndex, isLoading: false }, () => { this.getLessonCourseData() })
    console.log("@@@@@@@@@theme_id=======", this.props.navigation?.state?.params?.themeIndex)
    this.props.navigation.addListener('beforeRemove', (e) => {
      e.preventDefault()
      //clear setInterval here and go back
  })
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
      // console.log('@@@@@ responseJson api quizze and moc exam =====', responseJson)
      var errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      )
      // console.log("@@@@@@ errror ==", errorReponse)


      if (apiRequestCallId === this.userInfoApiCallId) {
        console.log("user info id in subsrciptioon screen", responseJson)
        // await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.USER_SUBSCRIPTION, `${responseJson?.data?.attributes?.is_subscribed?"subscribed":"unsubscribed"}`);
        // await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_EXPIRY_DATE, JSON.stringify(responseJson?.data?.attributes?.expired_at))
        // await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_TRANSACTION_RECEIPT, responseJson?.data?.attributes?.subscription_id??'');
        this.props.addSubscription({
          subscriptionId: responseJson?.data?.attributes?.subscription_id??'',
          transactionDate: '',
          status: responseJson?.data?.attributes?.is_subscribed,
          expiryDate: responseJson?.data?.attributes?.expired_at,
          userSubscription: responseJson?.data?.attributes?.is_subscribed?'subscribed':"unsubscribed"
        })
          this.setState({ subscription: responseJson?.data?.attributes?.is_subscribed?"subscribed":"unsubscribed" })
        }

      else if (responseJson && !responseJson.errors) {
        if (apiRequestCallId === this.courseLessonApiCallId) {
          console.log('course lesson update',JSON.stringify(responseJson))
          this.courseLessonSuccessCallBack(responseJson)
        }
      } else if (responseJson && responseJson.errors) {
        if (apiRequestCallId === this.courseLessonApiCallId) {
          this.courseLessonFailureCallBack(responseJson)
        }
      } else if (errorReponse) {
        console.log('errorReponse', errorReponse)
      }
     

    }
  }

  courseLessonSuccessCallBack = (responseJson: any) => {
    // this.setState({isLoading:false})
    console.log('@@@ DATA success course theme list CallBack =================', JSON.stringify(responseJson),)
    this.setState({
      courseLesson: responseJson?.lessons?.data,
      course_name: responseJson?.course,
      theme_name: responseJson?.theme,
      course_id: responseJson?.course_id,
      flash_cards: responseJson?.flash_cards?.data??[],
      quiz_exams: responseJson?.quiz_exams?.data,
      theme_id: responseJson?.theme_id,
      isLoading: false
    }, () => {
      console.log('added flash card data',this.state.flash_cards)
      // courseLessonSuccessCallBack = async (responseJson: any) => {
      //   console.log('@@@ DATA success course theme list CallBack =================', responseJson)
      //   //------------------------------------------------------------------------------//

      //   //------------------------------------------------------------------------------//
      //   this.setState({ courseLesson: responseJson?.lessons?.data, course_name: responseJson?.course, theme_name: responseJson?.theme, courseId: responseJson?.data?.id, flash_cards: responseJson?.flash_cards?.data, quiz_exams: responseJson?.quiz_exams?.data }, () => {
      let courseLessonData = this.state.courseLesson;
      let selectedIncompleteIndex = courseLessonData?.findIndex((item: any) => item?.attributes?.status?.toLowerCase() == 'not started' ||  item?.attributes?.status?.toLowerCase() == 'current');
      let courseFlashcardData = this.state.flash_cards;
      let selectedIncompleteIndexFlashcard = courseFlashcardData?.findIndex((item: any) => item?.status?.toLowerCase() == 'not started' );
      let courseQuizzezData = this.state.quiz_exams;
      let selectedIncompleteIndexquiz_exams = courseQuizzezData?.findIndex((item: any) => item?.status?.toLowerCase() == 'not started'  || item?.status?.toLowerCase()=="current" );

      console.log(selectedIncompleteIndex, "course lessons data and flashcard data inside")

      console.log(selectedIncompleteIndex, selectedIncompleteIndexFlashcard, "checking flashcards in llll")

      if (selectedIncompleteIndex == -1 && selectedIncompleteIndexFlashcard == -1 && selectedIncompleteIndexquiz_exams==-1 ) {
        console.log("i m on sss")
        this.setState({ continueButtonStatus: false, isLoading: false });
      }
      else {
        console.log('show continue button')
        this.setState({ continueButtonStatus: true, isLoading: false });

      }
    })
    // console.log("@@@@@@status======", responseJson?.data)
    // console.log("@@@@@@courselessoncheck======", responseJson?.flash_cards?.data)
  };

  courseLessonFailureCallBack = (responseJson: any) => {
    this.setState({ isLoading: false })
    console.log('@@@ flashcard course theme list failure callBack =================', responseJson)
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

  async userInfoApi() {
    let token = await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN);
    let id = await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.LOGIN_ID);
    const header = {
      "Content-Type": configJSON.productApiContentType,
      "token": this.state.user_token
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.userInfoApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.userInfoEndPoints}${id}`
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

    return true;

  }


  getLessonCourseData = async () => {
    this.setState({ isLoading: true })
    console.log("this.state.themeId :::::::::::::::::::::::::::::",this.state.themeId)
    this.courseLessonApiCallId = await this.apiCall({
      contentType: "application/json",
      method: "GET",
      endPoint: `lessons/list?theme_id=${this.state.themeId}`,
    })
  }


  
  getListOfflineRequest = async () => {
    let quizExamNewJson = [] as any
    let flashCardJSON = [] as any;
    let allOfflineData = this.props.offlineState?.offlineData;
    let takeQuiz = [] as any;
    let flashCards = [] as any;
    console.log("OFFLINE allOfflineObj START---------------", this.props.navigation?.state?.params?.theme_id)
    let courseResponseJson = allOfflineData?.all_lessons?.data.filter((xdata: any, i: any) => {
      console.log('flashcards info',this.props.navigation?.state?.params?.theme_id)
      if (xdata.attributes.theme_id == this.props.navigation?.state?.params?.theme_id) return xdata
    })
    
    if( courseResponseJson[0]?.order_no) {
      courseResponseJson=courseResponseJson.sort((a,b)=>a.order_no-b.order_no)
    } else {   
      courseResponseJson=courseResponseJson.sort((a,b)=>a.lesson_index-b.lesson_index)
    }
    let courseFlashCardJson = allOfflineData.flash_cards.data.filter((xdata: any, i: any) => {
      if (xdata?.attributes?.theme_id == this.props.navigation?.state?.params?.theme_id)  {
        var dataSet ={...xdata.attributes};
        dataSet.type = xdata.type;
        dataSet.id = xdata.id;
      return  flashCardJSON.push(dataSet)
      }
    })

    console.log('course flashcard Response JSON',allOfflineData?.all_lessons)

    let quizExamJson = allOfflineData.quiz_exams.data.filter((xdata: any, i: any) => {
      if (xdata.attributes.theme_id == this.props.navigation?.state?.params?.theme_id) {
        return quizExamNewJson.push(xdata.attributes)
      }
    })
    if(flashCardJSON.length!==0){
      
      flashCards.push(flashCardJSON[0]);
    }
    console.log('flashcard array',flashCards,flashCardJSON)
    takeQuiz.push(quizExamNewJson[0]);
    this.setState({
      // courseLesson: responseJson?.lessons?.data,
      courseLesson: courseResponseJson,
      // course_name: responseJson?.course,
      course_name: this.props.navigation.state.params.course_name,
      theme_name: courseResponseJson[0]?.attributes.theme_name,
      course_id: this.props.navigation.state.params.course_id,
      flash_cards: flashCardJSON,
      quiz_exams: !takeQuiz[0] ? [] : takeQuiz,
      theme_id: this.props.navigation?.state?.params?.theme_id,
      isLoading: false
    }, () => {
      console.log('falsh cards addedin offline request',this.state.flash_cards)
      let courseLessonData = this.state.courseLesson;
      let selectedIncompleteIndex = courseLessonData?.findIndex((item: any) => item?.attributes?.status?.toLowerCase() == 'not started' ||item?.attributes?.status?.toLowerCase() == 'current');
      let courseFlashcardData = this.state.flash_cards;
      let selectedIncompleteIndexFlashcard = courseFlashcardData?.findIndex((item: any) => item?.status?.toLowerCase() == 'not started');
      let courseQuizzezData = this.state.quiz_exams;
       let selectedIncompleteIndexquiz_exams = courseQuizzezData?.findIndex((item: any) => item?.status?.toLowerCase() == 'not started'||item?.attributes?.status?.toLowerCase() == 'current');

      console.log(this.state.courseLesson,"course lessons data and flashcard data inside");

      // console.log(selectedIncompleteIndex, selectedIncompleteIndexFlashcard, "checking flashcards in llll")

      if (selectedIncompleteIndex == -1) {
        console.log("i m on sss")
        this.setState({ continueButtonStatus: false, isLoading: false });
      }
      else {
        this.setState({ continueButtonStatus: true, isLoading: false });

      }
    })
    // this.setState({ themes_data: responseJson})
  }

 


  onPressContinue = () => {
    let courseLessonData = this.state.courseLesson;
    let flashCardData = this.state.flash_cards;
    let quizExams=this?.state?.quiz_exams
    console.log(courseLessonData,flashCardData,quizExams, "@@@@@@@@-------llll")
       for(let i=0;i<courseLessonData.length;i++)
       {
          if(courseLessonData[i]?.attributes?.status?.toLowerCase()=="not started" || courseLessonData[i]?.attributes?.status?.toLowerCase()==  "current" )
          {
            console.log(courseLessonData[i].attributes.lesson_type ,this.state.subscription)
              if(courseLessonData[i].attributes.lesson_type=="Payable" && this.state.subscription!=="subscribed")
              {
                this.setState({subscriptionModal:true})
                return
              }
              // console.log('course Lesson data',courseLessonData[i])
            this.props.navigation.navigate('CatalogueStudy', { list: this.state.courseLesson, selectedIndex: i, themeIndex: this.state.themeIndex, clickitem:courseLessonData[i], flashcard_data: this.state.flash_cards, course_id: this.state?.course_id, theme_id: this.state.themeId })
            return
          }
       }

       if( flashCardData[0]?.product_type=="Payable" && this.state.subscription!=="subscribed")
       {
        this.setState({subscriptionModal:true},()=>{
          console.log("im here in flashhhh inin,",this.state)
         
        })
        return
       }
  
       for(let i=0;i<flashCardData.length;i++)
       {


          if(flashCardData[0]?.status=="not started")
          {
            
            let item=flashCardData[0]
            this.props.navigation.navigate('OverView', { theme_id: item?.theme_id, isItfromThemesLessonList: true, course_id: this.state.course_id, fromCatalogueFiveToOverview: true, flashCardTitle: this.state.theme_name, totalCardCountFromThemes: item?.total_count, totalUserCardCountFromThemes: item?.user_count })
            return
          }


       }

       if( quizExams[0]?.product_type=="Payable" && this.state.subscription!=="subscribed")
       {
        this.setState({subscriptionModal:true},()=>{
          console.log("im here in flashhhh inin,",this.state)
         
        })
        return
       }
  

       for(let i=0;i<quizExams.length;i++)
       {
          if(quizExams[0]?.status=="not started")
          {
            let item=quizExams[0]

            this.props.navigation.navigate('OverView', {
              theme_id: item?.theme_id,
              theme_type: item?.type,
              quizexamDetailsFromThemesScreen: item,
              MockexamDetailsFromThemesScreen: '',
              course_id: this.props.navigation.state.params.course_id,
              theme_name: this.state.theme_name,
              itemData: item,
          })

            return
          }
       }




    // onPress={() => this.props.navigation.navigate('OverView', { theme_id: item?.theme_id, isItfromThemesLessonList: true,course_id:this.state.course_id,fromCatalogueFiveToOverview:true,flashCardTitle:this.state.theme_name,totalCardCountFromThemes:item?.total_count,totalUserCardCountFromThemes:item?.user_count})}

    // let selectedIncompleteIndex = courseLessonData?.findIndex((item: any) => { return item?.attributes?.status?.toLowerCase() === 'not started' || item?.attributes?.status?.toLowerCase() === 'current' });

    // console.log('seelected incomplete lesson index', selectedIncompleteIndex)
    // if (selectedIncompleteIndex !== -1) {
    //   this.props.navigation.navigate('CatalogueStudy', { list: this.state.courseLesson, selectedIndex: selectedIncompleteIndex, themeIndex: selectedIncompleteIndex, clickitem: courseLessonData[selectedIncompleteIndex] })
    //   return
    // }
    // else {
    //   let selectedIncompleteFilterforFlashCard = flashCardData?.filter((item: any) => item?.status?.toLowerCase() == 'not started');

    //   if (selectedIncompleteFilterforFlashCard.length != 0) {
    //     console.log('seelected incomplete flashcard index', selectedIncompleteFilterforFlashCard, selectedIncompleteFilterforFlashCard?.theme_id, selectedIncompleteFilterforFlashCard?.course_id)

    //     this.props.navigation.navigate('OverView', { theme_id: selectedIncompleteFilterforFlashCard[0]?.theme_id, isItfromThemesLessonList: true, course_id: this.state?.course_id, flashCardTitle: this.state.theme_name, totalCardCountFromThemes: selectedIncompleteFilterforFlashCard[0]?.total_count, totalUserCardCountFromThemes: selectedIncompleteFilterforFlashCard[0]?.user_count })
    //     console.log('seelected incomplete flashcard index')
    //   }
    // }



   
  }

  onPress = (item: any, index: any) => {
    console.log('itemmm.....==========', item?.attributes?.lesson_type,this.state.subscription
    );

    if(item?.attributes?.lesson_type === "Free"){
      this.setState({ subscriptionModal: false })
    }

    if (item?.attributes?.lesson_type === "Payable" && this.state.subscription !== 'subscribed') {
      console.log('hellloooo');
      this.setState({ subscriptionModal: true })
    }
    else {
     console.log('navigation screens')
setTimeout(()=>{
        this.props.navigation.navigate('CatalogueStudy', { list: this.state.courseLesson, selectedIndex: index, themeIndex: this.state.themeIndex, clickitem: item, flashcard_data: this.state.flash_cards, course_id: this.state?.course_id, theme_id: this.state.themeId })
})

      //  this.props.navigation.navigate('CatalogueStudy', { list: this.state.courseLesson, selectedIndex: index, themeIndex: index, clickitem: item })
    }
  }

  cardTypeNameSelectingFunction = (name: any) => {
    if (name == "flash_card") {
      return "Flashcards"
    }
    if (name == 'lesson') {
      return 'Lesson'
    }
    if (name == 'quizz_and_mock_exam') {
      return "Quizz and mock exam"
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