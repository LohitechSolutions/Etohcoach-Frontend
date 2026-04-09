// Customizable Area Start
import React from 'react';
import { BlockComponent } from "../../../framework/src/BlockComponent";
import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from '@react-native-firebase/messaging';
import { Platform } from "react-native";
import RNFS from "react-native-fs";
import Context from "../../../components/src/context/context";
import { AsynchStoragekey } from "../../../mobile/src/utils";
import { getAsyncDataKeys, setAsyncData } from "../../../mobile/src/utils/AsyncKeysStorage";
import { downloadFiles, readFile } from "../../../mobile/src/utils/downloadingFiles";
import { isConnected } from '../../../mobile/src/utils/internetConnection';
// import RNFetchBlob from 'react-native-fetch-blob'
import {
  getAvailablePurchases,
  initConnection,
  purchaseUpdatedListener,
  requestSubscription,
  type ProductPurchase
} from 'react-native-iap';

import * as RNIap from 'react-native-iap';


export const configJSON = require("./config.js");

export interface Props {
  
  navigation: any;
  id: string;
  offlineState: any;
  subscriptionState:any;
  userProfileState:any;
  addOfflineData: (val: any) => void;
  
  updateOfflineData: (val: any) => void;
  loadingOfflineData: (val: any) => void;
  addSubscription:(val:any)=>void;
  removeSubscription:()=>void;
  updateSubscription:(val:any)=>void;
  removeOfflineAPIS:()=>void;
  addUserProfile:(val:any)=>void;
  removeUserProfile:()=>void;
  removeOfflineData:()=>void;
  cancelSubscription:()=>void;
  
  
}
interface S {
  
  token: any;
  isLoading: boolean;
  dashboardData: any | null;
  notificationData: any;
  notificationBt: boolean;
  overlay_bt: boolean;
  notificationUnreadCount: any;
  isItOffline: boolean;
  subscription: any;
  userProfileScroreCount: any;
  isSubscribed:boolean;
  reward_point: any,
  hideComplete:boolean,
  seeAllContinue:boolean,
  seeAllcompleted:boolean,
  tempcount:any,
  saveImage: any,
  isGranted: boolean,
  subscription_id:string,
  subscription_reciept:string,
  subscriptionInfo:undefined,
  
}
interface SS {
  id: any;
  onPress: (val: any) => void;
  notificationData: any;
}
// Test Subscriptions
// const itemSubs: any = Platform.select({
//   android: ['test_month'],
//   ios: ["test_month"]
// })

// Prod Subscriptions
const itemSubs: any = Platform.select({
  android:['etoh_prod'],
  ios:['etoh_prod']
})

export default class DashboardController extends BlockComponent<Props, S, SS> {
  
  apiDashboardItemCallId: string = "";
  userInfoApiCallId: any;
  notificationApiCallId: any;
  cancelSubscriptionApiId:any;
  subscriptionSuccessID:any;
  apiOfflineItemCallId: any;
  offlineArrayAPicallID:any;
  apiAnnotationItemCallId:any;
  onlineSyncAPI:any;
  dailyUsageTimeID:any;
  
  static contextType = Context;

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);
    
    this.subScribedMessages = [
      getName(MessageEnum.AccoutLoginSuccess),
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionSaveMessage),
      getName(MessageEnum.SessionResponseMessage),
    ];


    this.state = {
      token: "",
      isLoading: false,
      dashboardData: "",
      notificationData: "",
      notificationBt: false,
      overlay_bt: false,
      notificationUnreadCount:'0',
      isItOffline: false,
      subscription: '',
      isSubscribed:false,
      userProfileScroreCount: 0,
      reward_point: 0,
      hideComplete:false,
      seeAllContinue:false,
      seeAllcompleted:false,
      tempcount:0,
      saveImage: [],
      isGranted: false,
      subscription_id:'',
      subscription_reciept:'',
      subscriptionInfo:undefined
    };
    
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  // async componentWillMount() {
  //   let subStatus = await this.getSubscriptionStatus();
  //   console.log( typeof(subStatus) , "before");
  //   if (subStatus) {
  //     console.log(subStatus, "now");
  //     this.props.navigation.navigate("SubCriptionScreen");
  //   }
  //   console.log(subStatus, "after");
  // }
    
  async componentDidMount() {
    
    // super.componentDidMount();
   this.setState({ isLoading: true })
   
    // this.props.removeOfflineData();
    
    // this.listFolders();
    // let token = await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN)
    // console.log("@@@@@ token get ",token)
    // super.componentDidMount();
    console.log('subscription Reducer state',this.props.subscriptionState)
    this.props.navigation.addListener("willFocus", async () => {
      let connectionStatus = await isConnected().then(response => response).catch(err => console.log(err))
      if (connectionStatus !== undefined){
        this.userInfoApi();
        this.getToken();
        this.iapConnection();
        this.notificationListener()  
        this.messageListener()
        this.functionToremoveSlash("https://www.freecodecamp.org/news/javascript-replaceall-replace-all-instances-of-a-string-in-js/")
        this.functionForCreatingAsyncStorageApiArray();
        this.setState({isItOffline: false,isLoading:false});
        // this.requestStoragePermission();
        console.log("I am runnning montfunction");
      } else {
        this.setState({isItOffline: true,isLoading:false});
        let dashboardOfflineData = await this.props.offlineState?.offlineData;
        let subscriptionState = this.props.subscriptionState?.subscriptionInfo?.userSubscription;
        let subscriptionId = this.props.subscriptionState?.subscriptionInfo?.subscriptionId;
       
        this.setState({ dashboardData: dashboardOfflineData != null ? dashboardOfflineData : null,subscription:subscriptionState,subscription_reciept:subscriptionId })
        this.setState({saveImage: []}, () => {  this.getTheFileLocation() })
        console.log("offline dashboard ka data haiiiii");
      }
    });

    //this.getToken();
    // if (this.isPlatformWeb() === false) {
    //   this.props.navigation.addListener("didFocus", () => {
    //     this.getToken();
    //     this.getDashboardData()
    //   });
    // }

    
    
    
  }
  async componentWillUnmount() {
    this.setState({ isLoading: false })
  }

  messageListener = async () => {
    messaging().onMessage(async remoteMessage => {
      if (remoteMessage?.data?.notify_type == "New course is released"
        || remoteMessage?.data?.notify_type == "top 3 in the Leaderboard") {
        // Alert.alert(
        //   `${remoteMessage?.data?.notify_type}`,
        //   `${remoteMessage?.data?.message}`,
        //   [          { text: "OK",onPress: () => this.props.navigation.navigate("Catalogue") },
        //   ],
        // );
      }

      // if(remoteMessage?.data?.notify_type == "Course finished" 
      // || remoteMessage?.data?.notify_type == "New course is released" 
      // || remoteMessage?.data?.notify_type == "top 3 in the Leaderboard"){
      //   console.log("remoteMessage?.data?.notify_type :::::::::", remoteMessage?.data?.notify_type)
      //   Alert.alert(
      //     `${remoteMessage?.data?.notify_type}`,
      //     `${remoteMessage?.data?.message}`,
      //     [          { text: "OK",onPress: () => this.props.navigation.navigate("Catalogue") },
      //     ],
      //   );
      // }
      // console.log(this)
      // alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
  }

  notificationListener = async () => {
    const notifyData:any = await AsyncStorage.getItem("MANAGE_NOTIFICATION")
    if (JSON.parse(notifyData) == true) {
      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log("@listner :::", remoteMessage)
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage.notification,
        );
        if (remoteMessage?.data?.notify_type == "Course finished" ||
          remoteMessage?.data?.notify_type == "New course is released" ||
          remoteMessage?.data?.notify_type == "Course is downloaded to the phone" ||
          remoteMessage?.data?.notify_type == "offering new course" ||
          remoteMessage?.data?.notify_type == 'download course'
        ) {
          return this.props.navigation.navigate("Catalogue")
        }

        if (remoteMessage?.data?.notify_type == "top 3 in the Leaderboard") {
          return this.props.navigation.navigate("Leaderboard")
        }

        if (remoteMessage?.data?.notify_type == "Subscription expires soon") {
          return this.props.navigation.navigate("Subcription")
        }

        if (remoteMessage?.data?.notify_type == "Flashcards left unseen") {
          return this.props.navigation.navigate("CfFlashcards2")
        }
        // navigation.navigate(remoteMessage.data.type);
      });

      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            console.log(
              'Notification caused app to open from quit state:',
              remoteMessage.notification,
            );
            // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
          }
          // setLoading(false);
        });
    }
  }
  

  // functionForCreatingAsyncStorageApiArray=async ()=>{
  //   let dashboardOfflineData = await AsyncStorage.getItem('API_ARRAY_FOR_OFFLINE')
  //   if(!dashboardOfflineData){
  //       await setAsyncData("API_ARRAY_FOR_OFFLINE", [])
  //   }else{
  //     dashboardOfflineData=JSON.parse(dashboardOfflineData)  
  //     console.log("checking-----offline",dashboardOfflineData);
  //     if(dashboardOfflineData&& dashboardOfflineData.length>0){
  //       for(let i=0;i<dashboardOfflineData.length;i++){     
  //           console.log("checking-----offline---feature",i,dashboardOfflineData)
  //           this.offlineArrayAPicallID = await this.apiCall(dashboardOfflineData[i]);
  //       }
  //     }     
  //   }
  // }

  offlineDataSync = () => {
    this.onlineSyncAPI = this.apiCall({
      contentType: configJSON.onlineSyncContentType,
      method: configJSON.onlineSyncMethodType,
      endPoint: configJSON.onlineSyncUrl,
      body:{
        "offline_task": this.props.offlineState?.offlineAPIs
      }
    });
    this.props.removeOfflineAPIS();
  }

  functionForCreatingAsyncStorageApiArray = async () => {
    if (this.props.offlineState?.offlineAPIs) {
      setTimeout(this.offlineDataSync, 5000)
    }
  }

    async getToken() {
      // this.setState({ isLoading: false })
      const msg: Message = new Message(getName(MessageEnum.SessionRequestMessage));
      let token: any = await AsyncStorage.getItem('LOGIN_TOKEN')
      console.log('workinggggggggggggggg', token)
      this.setState({ token: token }, () => this.getDashboardData())
      this.setState({ token: token }, () => this.getOfflineData())
      // this.getProfileSuccessCallBack()
      // this.setState({ token: token })
    }

  async receive(from: string, message: Message) {
    //  console.log("@@@ API MESSAGE DSHHH VIEW =================", message);
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );

      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      // console.log("responseJson", responseJson);

      var errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );
      if(apiRequestCallId == this.onlineSyncAPI){
        if(!responseJson){
          console.log('err respone of online data sync',errorReponse)
        }else{
          this.props.removeOfflineAPIS();
        console.log('response of online data sync',responseJson)
      }
    }
      
      if(apiRequestCallId == this.offlineArrayAPicallID)
      {
        console.log(responseJson,"check000000000000000")
      }

      if (apiRequestCallId === this.userInfoApiCallId) {
        console.log('userInfo=========', responseJson)
        
        // await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_EXPIRY_DATE,JSON.stringify(responseJson?.data?.attributes?.expired_at??''))
        // await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.USER_SUBSCRIPTION, responseJson?.data?.attributes?.is_subscribed?'subscribed':'unsubscribed')
        // await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_TRANSACTION_RECEIPT,responseJson?.data?.attributes?.subscription_id??'');
        this.props.addSubscription({
          subscriptionId: responseJson?.data?.attributes?.subscription_id ?? "",
          transactionDate: '',
          status: responseJson?.data?.attributes?.is_subscribed,
          expiryDate: responseJson?.data?.attributes?.expired_at,
          userSubscription: responseJson?.data?.attributes?.is_subscribed?"subscribed" :"unsubscribed"
      })
        // this.props.addUserProfile(responseJson?.data?.attributes);
        this.setState({ 
          subscription: responseJson?.data?.attributes?.is_subscribed?'subscribed':'unsubscribed',
          subscription_reciept:responseJson?.data?.attributes?.subscription_id
      })
      }

      if (apiRequestCallId == this.subscriptionSuccessID) {
        if (!responseJson) {
          console.log('error response', errorReponse)
          
        } else {
          var dataSet = responseJson?.data?.attributes;
          
          // await AsyncStorage.setItem(
          //   AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_TRANSACTION_RECEIPT,
          //   dataSet?.subscription_id??''
          // );
          // await AsyncStorage.setItem(
          //   AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_TRANSACTION_DATE,
          //   JSON.stringify(dataSet?.subscription_date)
          // );
          // await AsyncStorage.setItem(
          //   AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_STATUS,
          //   JSON.stringify(true)
          // );
          // await AsyncStorage.setItem(
          //   AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_EXPIRY_DATE,
          //   dataSet?.expired_at??''
          // );
          // await AsyncStorage.setItem(
            //   AsynchStoragekey.AsynchStoragekey.USER_SUBSCRIPTION,
            //   "subscribed"
            // );
            console.log('set locale to subscribed')
          this.props.addSubscription({
            subscriptionId: dataSet?.subscription_id,
            transactionDate: dataSet?.subscription_date,
            status: dataSet?.is_subscribed,
            expiryDate: dataSet?.expired_at,
            userSubscription: dataSet?.is_subscribed?"subscribed" :"unsubscribed"
        })
        }

      }

      if (responseJson && !responseJson.errors) {
         //AnnotationData Start
        //  console.log("responseJsonannotation", responseJson);
        //  console.log("error from annotation", responseJson.errors);
       
        // if (apiRequestCallId === this.apiAnnotationItemCallId) {
        //   console.log(responseJson, "responsefromAnnotation");
        // }

        //AnnotationData End


        if (apiRequestCallId === this.apiDashboardItemCallId) {
          console.log(responseJson, "walsonnnnnnnn")
          this.setState({ isLoading: false })
          // let unseenNotify = responseJson.unseen_notification.toString();
          // await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.NOTIFICATION_UNREAD, unseenNotify);
           this.setState({ notificationUnreadCount:responseJson?.unseen_notification})
          // console.log(responseJson, "walsonnnnnnnn")

          this.handleLocalstorageFor(responseJson)


          this.getProfileSuccessCallBack(responseJson);
        }

        if (apiRequestCallId === this.apiOfflineItemCallId) {
          console.log("i am in offline checking stage")
          this.setState({ isLoading: false })
          if(!responseJson){
            console.log('offline data error',errorReponse)
          }else{
          console.log("offline data call async", JSON.stringify(responseJson));
          this.getOfflineSuccessCallBack(responseJson);
        }
          // console.log(responseJson.unseen_notification, "==========================walsonnnnnnnn====================================")
          // let unseenNotify = responseJson.unseen_notification.toString();
          // await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.NOTIFICATION_UNREAD, unseenNotify);
          // this.setState({ notificationUnreadCount: unseenNotify })
          // this.getProfileSuccessCallBack(responseJson);
        }
        if (apiRequestCallId === this.cancelSubscriptionApiId) {
          console.log('subscription cancellation response',responseJson)
          if (!responseJson) {
            console.log('error response', errorReponse)
          } else {
            var dataSet = responseJson?.data?.attributes;
            // await AsyncStorage.setItem(
            //   AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_TRANSACTION_RECEIPT,
            //   ''
            // );
            // await AsyncStorage.setItem(
            //   AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_TRANSACTION_DATE,
            //   ''
            // );
            // await AsyncStorage.setItem(
            //   AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_STATUS,
            //   JSON.stringify(false)
            // );
            // console.log('set locale to unsubscribed')
            // await AsyncStorage.setItem(
            //   AsynchStoragekey.AsynchStoragekey.USER_SUBSCRIPTION,
            //   "unsubscribed"
            // );
            this.props.cancelSubscription();
            this.setState({
              subscription:'unsubscribed',
              isSubscribed:false,
            })

          }
        }

        if(apiRequestCallId==this.offlineArrayAPicallID)
        {
          console.log(responseJson,"---Iam checking resposeapi for offline function call")
        }

        // else if (apiRequestCallId === this.profileUpdateAPICallId) {
        //   this.profileUpdateSuccessCallBack(responseJson)
        // }
      } else if (responseJson && responseJson.errors) {
        this.setState({ isLoading: false })
        if (apiRequestCallId === this.apiDashboardItemCallId) {
          this.getProfileFailureCallBack(responseJson);
        }
        if (apiRequestCallId === this.apiOfflineItemCallId) {
          this.getOfflineFailureCallBack(responseJson);
        }
        if(apiRequestCallId==this.offlineArrayAPicallID)
        {
          console.log(responseJson,"---Iam checking resposeapi for offline function call")
        }
        if(apiRequestCallId==this.dailyUsageTimeID)
        {
          console.log("---Iam checking resposeapi for daily failure time")
        }
        // else if (apiRequestCallId === this.profileUpdateAPICallId) {
        //   this.profileUpdateFailureCallBack(responseJson)
        // }
      } else if (errorReponse) {
        this.setState({ isLoading: false })
        // console.log("errorReponse", errorReponse);
      }

    }
  }
  cancelSubscription = async()=>{
    const header = {
      "Content-Type": configJSON.subscriptionContentType,
      token: await AsyncStorage.getItem(
        AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN
      ),
    };
   
     
   
    
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    console.log('subscription cancel body', configJSON.subscriptionApiData, configJSON.subscriptionUrl, configJSON.subscriptionApiMethodType, requestMessage)

    this.cancelSubscriptionApiId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.subscriptionCancelUrl
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      null
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.subscriptionCancelApiMethodType
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
    
    return true;
  }

  async userInfoApi() {
    let token = await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN);
    let id = await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.LOGIN_ID);
    const header = {
      "Content-Type": configJSON.dashboarContentType,
      "token": token
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
      configJSON.dashboarApiMethodType
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;

  }

  getProfileSuccessCallBack = async (responseJson: any) => {
    this.setState({ isLoading: false })
    // let sub = JSON.parse(Subscribe)
    // console.log('=========userInfo', sub);

    // this.setState({ subscription: sub?.subscription, isLoading: false })

    console.log(
      "@@@ get dashboard success callBack =================",
      responseJson
    );
    // await setAsyncData("OFFLINE_DATA", responseJson)
    this.setState({ dashboardData: responseJson, isLoading: false });

    let count = 0;
    let completedArray = responseJson?.user_completed_courses
    let progressArray = responseJson?.user_in_progress_courses
    for (let i = 0; i < completedArray.length; i++) {
      count = count + completedArray[i].user_completed_point
    }
    for (let i = 0; i < progressArray.length; i++) {
      count = count + progressArray[i].user_completed_point
    }
    this.setState({ userProfileScroreCount: count })
    // this.getOfflineData()
    this.setState({ dashboardData: responseJson,isLoading:false });
  };

  getProfileFailureCallBack = (responseJson: any) => {
    this.setState({ isLoading: false })
    this.setState({ isLoading: false, })
  };

  getOfflineSuccessCallBack = async (responseJson: any) => {
    // this.setState({ isLoading: false })
    console.log("this is offline data",JSON.stringify(responseJson));
    // this.downloadFilesFromResponse(responseJson);
    // await setAsyncData("OFFLINE_DATA", responseJson)
    this.setState({ isLoading: false })
    if(this.props.offlineState?.offlineData==undefined||this.props.offlineState?.offlineData.length==0){
    this.props.addOfflineData(responseJson);
  }else{
    // console.log('completed course data check',JSON.stringify(responseJson))
    this.updatedOfflineData(responseJson)
  }
  };
  updatedOfflineData(responseJson : any ) {
    let updatedResponse = JSON.parse(JSON.stringify(responseJson));
    let offlineUserInProgress = this.props?.offlineState?.offlineData?.user_in_progress_courses;
    let offlineUserCompletedCourses = this.props?.offlineState?.offlineData?.user_completed_courses??[];
    let onlineUserInProgress = responseJson.user_in_progress_courses;
    let completedUserCourse = responseJson?.user_completed_courses??[];
    // console.log('offlineUserInprogress',this.props.offlineState.offlineData)

    updatedResponse["user_completed_courses"]  = completedUserCourse.map((onlineProgress  : any) => {
      let offlineProgress = offlineUserCompletedCourses.filter((offlineProg : any) => offlineProg.id == onlineProgress.id);
      if(offlineProgress.length === 0) {
        return onlineProgress;
      }else {
        let prev = {...onlineProgress};
        prev["downloadedPath"] = offlineProgress[0].downloadedPath;
        return prev;
      }
    })

    updatedResponse["user_in_progress_courses"]  = onlineUserInProgress.map((onlineProgress  : any) => {
      let offlineProgress = offlineUserInProgress.filter((offlineProg : any) => offlineProg.id == onlineProgress.id);
      if(offlineProgress.length === 0) {
        return onlineProgress;
      }else {
        let prev = {...onlineProgress};
        prev["downloadedPath"] = offlineProgress[0].downloadedPath;
        return prev;
      }
    })

    let offlineAllThemes = this.props?.offlineState?.offlineData.all_themes;
    let onlineAllThemes = responseJson.all_themes;

    updatedResponse["all_themes"] = onlineAllThemes.map((onlineProgress  : any) => {
      let offlineProgress = offlineAllThemes.filter((offlineProg : any) => offlineProg.id == onlineProgress.id);
      if(offlineProgress.length === 0) {
        return onlineProgress;
      }else {
        let prev = {...onlineProgress};
        prev["downloadedPath"] = offlineProgress[0].downloadedPath;
        return prev;
      }
    })

    let offlineAllLessons = this.props?.offlineState?.offlineData.all_lessons?.data;
    let onlineAllLessons = responseJson.all_lessons?.data;

    updatedResponse["all_lessons"].data = onlineAllLessons.map((onlineProgress  : any) => {
      let offlineProgress = offlineAllLessons.filter((offlineProg : any) => offlineProg.id == onlineProgress.id);
      if(offlineProgress.length === 0) {
        return onlineProgress;
      }else {
        let prev = {...onlineProgress};
        prev.attributes["downloadedPath"] = offlineProgress[0].attributes.downloadedPath;
        return prev;
      }
    })

    let offlineAllQuizData = this.props?.offlineState?.offlineData.quiz_exams?.data;
    let onlineAllQuizData = responseJson.quiz_exams?.data;

    updatedResponse["quiz_exams"].data = onlineAllQuizData.map((onlineProgress  : any) => {
      let offlineProgress = offlineAllQuizData.filter((offlineProg : any) => offlineProg.id == onlineProgress.id);
      if(offlineProgress.length === 0) {
        return onlineProgress;
      }else {
        let prev = {...onlineProgress};
        prev.attributes["downloadedPath"] = offlineProgress[0].attributes.downloadedPath;
        return prev;
      }
    })

    let offlineAllMockData = this.props?.offlineState?.offlineData.mock_exams;
    let onlineAllMockData = responseJson.mock_exams;

    updatedResponse["mock_exams"] = onlineAllMockData.map((onlineMockTop : any) =>  {
        const filteredUpperOfflineMock = offlineAllMockData.filter((offlineUppperMock : any ) => offlineUppperMock.id == onlineMockTop.id);
        // console.log("offline mock", JSON.stringify(filteredUpperOfflineMock))
        if(filteredUpperOfflineMock.length === 0) {
          return onlineMockTop;
        }else {
          let prev = JSON.parse(JSON.stringify(onlineMockTop));
          prev["mock_exams"] = prev.mock_exams.map((onlineProg : any) => {
            const filteredInnermock = filteredUpperOfflineMock[0].mock_exams.filter((offInnerMock : any) => offInnerMock.id  == onlineProg.id);
            // console.log("filtered inner mock", filteredInnermock)
            if(filteredInnermock.length === 0) {
              return onlineProg;
            }else {
              let innerPrev = {...onlineProg};
              innerPrev.attributes["downloadedPath"] = filteredInnermock[0].attributes.downloadedPath;
              return innerPrev;
            }
          })
          return prev;
        }
    })
     this.props.addOfflineData(updatedResponse);

    // console.log("updated online response", JSON.stringify(updatedResponse.mock_exams))
  }
  downloadFilesFromResponse = async (Offlinedata: any) => {
    const path = RNFS.ExternalDirectoryPath; // for making directory
    const allCourses = Offlinedata.user_in_progress_courses;
    const allThemes = Offlinedata.all_themes;
    const allLessons = Offlinedata?.all_lessons?.data;
    const allMockExams = Offlinedata.mock_exams;
    const allQuizExams = Offlinedata.quiz_exams.data;
    // const allFlashcards = Offlinedata.flash_cards.data;

    //Done
    if (!this.state.isItOffline) {
      // Courses Media Download
      console.log('entered courses map', allCourses.length)
      allCourses.map(async (it: any, ind: any) => {
        if (it.course_attachment != "null" && it.course_attachment != "" && it.course_attachment != null) {
          const fileName = `course_${it.id}`;
          console.log(fileName, "filenameadsfas");
          try {
            console.log('download file resoponse', fileName, it.course_attachment, path)
            const filePath = await downloadFiles(it.course_attachment, path, fileName);
            console.log("filepathtoalbum", filePath);
            // this.props.updateOfflineData({filePath : filePath, index :  it.id})
            await setAsyncData(fileName, filePath);

          } catch (error) {
            console.log(`Failed to download file: ${fileName}`, error);
          }
        }
      })
      //Themes Media Download
      console.log('entered themes map', allThemes.length)
      allThemes.map(async (it: any, ind: any) => {
        if (it.theme_attachment != "null" && it.theme_attachment != "" && it.theme_attachment != null) {
          const fileName = `theme_${it.id}`;
          console.log(fileName, "filenameadsfas");
          try {
            const filePath = await downloadFiles(it.theme_attachment, path, fileName);
            console.log("filepathtoalbum", filePath);
            await setAsyncData(fileName, filePath);
          } catch (error) {
            console.log(`Failed to download file: ${fileName}`, error);
          }
        }
      })

      //Lessons Media Download
      console.log('entered lessons map', allLessons.length)
      allLessons.map(async (it: any, ind: any) => {
        if (it.attributes.image != "null" && it.attributes.image != "" && it.attributes.image != null) {
          const fileName = `lesson_image_${it.id}`;
          console.log(fileName, "filenameadsfas");
          try {
            const filePath = await downloadFiles(it.attributes.image, path, fileName);
            console.log("filepathtoalbum", filePath);
            await setAsyncData(fileName, filePath);
          } catch (error) {
            console.log(`Failed to download file: ${fileName}`, error);
          }
        }
        if (it.attributes.video_file !== "" && it.attributes.video_file !== null && it.attributes.video_file !== "null") {
          const fileName = `lesson_video_${it.id}`
          console.log(fileName, "filenameadsfas");
          try {
            const filePath = await downloadFiles(it.attributes.video_file, path, fileName);
            console.log("filepathtoalbum", filePath);
            await setAsyncData(fileName, filePath);
          } catch (error) {
            console.log(`Failed to download file: ${fileName}`, error);
          }
        }
        if (it.attributes.audio_file !== "" && it.attributes.audio_file !== null && it.attributes.audio_file !== "null") {
          const fileName = `lesson_audio_${it.id}`
          console.log(fileName, it.attributes.audio_file, "filenameadsfas");
          try {
            const filePath = await downloadFiles(it.attributes.audio_file, path, fileName);
            console.log("filepathtoalbum", filePath);
            await setAsyncData(fileName, filePath);
          } catch (error) {
            console.log(`Failed to download file: ${fileName}`, error);
          }
        }
      })
      //Mock Exams Media Download
      console.log('entered mock map', allMockExams.length)
      allMockExams.map(async (it: any, ind: any) => {
        it.mock_exams.map(async (item: any, index: any) => {
          if (item.attributes.image !== null && item.attributes.image !== "" && item.attributes.image !== "null") {
            const fileName = `mock_exam_${item.id}`
            console.log(fileName, "filenameadsfas");
            try {
              const filePath = await downloadFiles(item.attributes.image, path, fileName);
              console.log("filepathtoalbum", filePath);
              await setAsyncData(fileName, filePath);
            } catch (error) {
              console.log(`Failed to download file: ${fileName}`, error);

            }
          }
        })
      })

      //Quiz Media Download
      console.log('entered quiz map', allQuizExams.length)
      allQuizExams.map(async (it: any, ind: any) => {
        if (it.theme_attachment != "null" && it.theme_attachment != "" && it.theme_attachment != null) {
          const fileName = `quiz_exam_${it.id}`;
          console.log(fileName, "filenameadsfas");
          try {
            const filePath = await downloadFiles(it.theme_attachment, path, fileName);
            console.log("filepathtoalbum", filePath);
            await setAsyncData(fileName, filePath);
          } catch (error) {
            console.log(`Failed to download file: ${fileName}`, error);
          }
        }
      })
    }
    console.log('function executed')
  }

 getTheFilesFromAsync = async (id: any) => {
  try{
    console.log(id, "getidDashboard");
    const datafile = await getAsyncDataKeys(`course_${id}`);
    console.log("datafilefrtyuiDashboard", id,datafile);
    const datapath = await readFile(datafile);
    console.log("datapathdatafilefrtyuiDashboard", datapath);
    if(datapath !== null){
      console.log("setStateinfiledatafilefrtyuiDashboard");
      this.setState({saveImage: [...this.state.saveImage, datapath]}, () => {console.log(this.state.saveImage, "dadsgsgsDashboard")});
    }
  }catch(error){
    console.log("Error in retriving datta Dashboard", error);
  }
 }

 
 getTheFileLocation = async () => {
  console.log("get the file location Dashboard");
  this.state.dashboardData?.user_in_progress_courses.map((elem: any) => {
    this.getTheFilesFromAsync(elem.id);
  });
 }

  getOfflineFailureCallBack = (responseJson: any) => {
    this.setState({ isLoading: false })
    console.log(
      "@@@ get dashboard failure callBack =================",
      responseJson
    );
    this.setState({ isLoading: false, })
  };

  apiCall = async (data: any) => {
    // this.setState({ isLoading: true })
    // let token: any = await AsyncStorage.getItem("@token");
    
    const { contentType, method, endPoint, body, type } = data;
    
    const header = {
      "Content-Type": contentType,
      token: await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN),
    };
    
    console.log('token requirement', await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN))
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endPoint
    );
    
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      method
    );
    
    body && type != "formData"
      ? requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(body)
      )
      : requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        body
        );

    runEngine.sendMessage(requestMessage.id, requestMessage);
    
    //  console.log("@@@ requestMessage ========", requestMessage);
    
    return requestMessage.messageId;
  };

  getDashboardData = async () => {
    this.setState({ isLoading: true })
    console.log('dashboard data called')
    this.apiDashboardItemCallId = await this.apiCall({
      contentType: configJSON.dashboarContentType,
      method: configJSON.dashboarApiMethodType,
      endPoint: configJSON.dashboardGetUrl,
    });
  };

  getOfflineData = async () => {
    this.setState({ isLoading: true })
    this.apiOfflineItemCallId = await this.apiCall({
      contentType: configJSON.offlineContentType,
      method: configJSON.offlineApiMethodType,
      endPoint: configJSON.offlineGetUrl,
    });
    console.log( this.apiOfflineItemCallId ,"online data call 2 --------->>>>");

  }

  CourceNavigate = async (item: any, idx: number) => {
    const data = this.state.saveImage[idx];
    // console.log("imagefromdashob", data);
    // await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.COURCE_NAME, item?.course_name);

  //   this.props.navigation.navigate('AuthStack', {
  //     screen: 'OverViews', params: {
  //       course_id: item?.id, courseImage: this.state.isItOffline ? `data:image/jpg;base64,${data}` : item?.course_attachment
  //     }
  // });
  const course_item_offline = this.props.offlineState.offlineData.user_in_progress_courses.filter((singleitem:any) => singleitem?.id == item.id);

    console.log("SINGLE COURSE ITEM", course_item_offline)

    this.props.navigation.navigate('OverViews', { course_id: item?.id,course_name:item?.course_name, courseImage: this.state.isItOffline ? course_item_offline[0]?.downloadedPath : item?.course_attachment, isItOffline: this.state.isItOffline })

    //  this.props.navigation.navigate('OverViews', { course_id: item?.id, courseImage: this.state.isItOffline ? `data:image/jpg;base64,${data}` : item?.course_attachment })
  }


  handleLocalstorageFor= async (item:any)=>{
    let array=item?.user_in_progress_courses
  // console.log(item?.user_in_progress_courses,"heckinggggggggg")
    let obj={}
    for(let i=0;i<array.length;i++)
    {
      let courseID=array[i]?.id
      obj[courseID]="progress"
    }
    await AsyncStorage.setItem("CONGRATULATIONS", JSON.stringify(obj))
  }



  functionToremoveSlash=(string:string)=>{
    let newstring=""
    for(let i=0;i<string.length;i++){
      if(string[i]=="/"){
        newstring= newstring+""
      }else{
        newstring = newstring+string[i]
      }
    }
    console.log(newstring,"checking all the stringgggg")
  }
 


iapConnection = async () => {
  try{
  initConnection().then(async (res) => {
    let receipt: string = '';
    if (receipt == '') {
     this.getAvailableSubsFromStore();
    }
    await this.checkAvailableSubscription();
  }).catch((err) => {
    console.log('err',err)
  }) 
}catch(e){
console.log('err @ init connection',e)
} 
}


//Get Available subscription from respective stores
getAvailableSubsFromStore = async()=>{
  try{
  const products = await RNIap.getSubscriptions({skus:itemSubs});
        console.log(itemSubs,"itemSubs")

  console.log("getting_products>>>", products)
  this.setState({subscription_id: products[0]?.productId });
  }
catch(err)
{
  console.log("itemSubs",err)
}
}


//Subscribe to a new subscription
subscribe = async () => {
  try {
    await this.iapConnection();
    const reqSubs = await requestSubscription(this.state.subscription_id)

    console.log('reqSubs', reqSubs)
    if (reqSubs) {
      await this.checkAvailableSubscription();
      // this.updatePurchase();
    }
  } catch (err) {
    console.warn("subscription request error gggg", err, itemSubs);
    // this.iapConnection();
  }
};

//Check for available purchased subscription
checkAvailableSubscription = async () => {
  await getAvailablePurchases().then(async (res) => {
    console.log('available purchases',res)
    if (res.length > 0) {
      const subscriptionTransactionId = await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_TRANSACTION_RECEIPT);
      let subDetail = await res.some((x)=>{
        if(x.transactionId == subscriptionTransactionId){
          return x;
        }
      });
      console.log("subDetail",subDetail,subscriptionTransactionId)
      if(subDetail!==undefined){
      await this.updatePurchase();
      // let subscribed = await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.USER_SUBSCRIPTION)??'unsubscribed';
      // let isSubscribed = await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_STATUS)??false;
      let subscribed = this.props.subscriptionState?.subscriptionInfo?.userSubscription??'unsubscribed';
      let isSubscribed = this.props.subscriptionState?.subscriptionInfo?.status??false;
      
      this.setState({
        subscriptionInfo: subDetail,
        subscription:subscribed,
        isSubscribed:isSubscribed,
        subscribed: true, 
        subscribedDate: subDetail?.transactionDate
      },()=>{
        console.log("checking subscription is dashboard",this.state)
      })
      
    }else{
      this.cancelSubscription();
    }
      
    } else {
      this.cancelSubscription();
      // await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.USER_SUBSCRIPTION,"unsubscribed");
      this.props.cancelSubscription();
      this.setState({
        subscribed: false,
        subscribedDate: undefined
      })
    }
  }).catch((err) => {
    console.log('purchased error', err)
  })
}

//Updating purchase of subscription
updatePurchase = async () => {
  await purchaseUpdatedListener(
    async (purchase: SubscriptionPurchase | ProductPurchase) => {
      console.log('purchaseUpdatedListener', purchase);
      const receipt = purchase.transactionReceipt;
      if (receipt) {
        try {
          if(Platform.OS=='ios'){
            await RNIap.finishTransaction(purchase);
          }
          if(Platform.OS=='android'){
            console.log('purchaseUpdatedListener android', receipt);

            RNIap.acknowledgePurchaseAndroid({token:purchase.purchaseToken}).then(()=>{
              RNIap.finishTransaction(purchase,true).catch((err)=>{
                console.log("the error the eoor in iap",err.code,err.message)
              });
            })
          }
        } catch (ackErr) {
          console.warn('ackErr', ackErr);
        }
        console.log('Purchase subscription transaction finished')
      } else {
        console.log('purchaseUpdatedListener else', receipt);
        this.cancelSubscription();
        // Retry / conclude the purchase is fraudulent, etc...
      }
    },
  );
}

  functionToReturnContinueCourses = () => {
    const thedata: any[] = [];
    const mydata = this.state.dashboardData?.user_in_progress_courses;
    if (!mydata?.length) {
      return thedata;
    }
    if (mydata.length == 1) {
      return [mydata[0]];
    }
    if (mydata.length >= 2) {
      return [mydata[0], mydata[1]];
    }
    return thedata;
  };

  seeAllCompletedCourses = () => {
    const theData = this.state.dashboardData?.user_completed_courses;
    if (!theData?.length) {
      return [];
    }
    if (theData.length <= 2) {
      return theData;
    }
    if (this.state.seeAllcompleted) {
      return theData;
    }
    return [theData[0], theData[1]];
  };
  sendAppTimeapicall=async ()=>{
    let timeValuestring=await AsyncStorage.getItem("APPtime")
let prevdate=await AsyncStorage.getItem("APPdate")
console.log("daydaydaydreamTime",timeValuestring)
    const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1; // Months are 0-indexed, so add 1 to get the correct month.
const day = today.getDate();

console.log(`${year}-${month}-${day}`);
  let  finalday=`${day}/${month}/${year}`
let timeinSeconds

  if(timeValuestring)
  {
     timeinSeconds=this.minutesToHms(JSON.parse (timeValuestring))

  }



let endpoint='/save/daily/time/activity'
    let body={
      time:timeinSeconds,
      date:finalday
    }

if(prevdate !==finalday)
{
  console.log("daydaydaydreamBody",body)
   this.dailyUsageTimeID=await this.apiCall({
      contentType: configJSON.offlineContentType,
      method: "post",
      endPoint:endpoint,
      body:body,
    })


}

   

  }
   minutesToHms=(minutes:any)=> {
 
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
  
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(remainingMinutes).padStart(2, '0');
    const formattedSeconds = '00';
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
}
// Customizable Area End