// Customizable Area Start
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createRef } from "react";
import DeviceInfo from "react-native-device-info";
import Orientation from 'react-native-orientation';
import { BlockComponent } from "../../../framework/src/BlockComponent";
import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import MessageEnum, { getName } from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";
import { getAsyncDataKeys } from "../../../mobile/src/utils/AsyncKeysStorage";
import { readFile } from "../../../mobile/src/utils/downloadingFiles";
import { isConnected } from "../../../mobile/src/utils/internetConnection";

export const configJSON = require("./config");

var Sound = require('react-native-sound');

interface DeltaOperation {
  insert?: string | { [key: string]:{} };
  attributes?: DeltaAttributes;
}

interface DeltaAttributes {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  color?: string;
  background?: string;
  font?: string;
  size?: string;
  align?: string;
  link?: string;
  header?: number;
  list?: 'bullet' | 'ordered';
  blockquote?: boolean;
  indent?: number;
}

interface Delta {
  ops: DeltaOperation[];
}


export interface Props {
  
  navigation: any;
  id: string;
  offlineState: any;
  subscriptionState: any;
  addOfflineData: (val: any) => void;
  updateOfflineStatus: (val: any) => void;
  addOfflineAPis: (val: any) => void;
  
  updateOfflineData: (val: any) => void;
  loadingOfflineData: (val: any) => void
  
}
interface S {
  
  user_token: any;
  theme_type: any;
  theme_id: any;
  lesson_details: any;
  lession_details_notes: any;
  lessonId: any;
  lessonType: any;
  card_count: any;
  selectedIndex: any;
  lessionList: any;
  themeIndex: any;
  themeName: any;
  lessonIndex: any
  clickItem: any;
  nextButtonTitle: any;
  buttonShow: boolean;
  isLoading: boolean;
  isItOffline: boolean;
  data: any;
  defaultHighlightText: any;
  wordData: any;
  showLoader: boolean;
  newNoteArray: any;
  DefaultColorArray: any;
  annotionsData: any
  selectedImage: any;
  imageZoomed: boolean;
  subscriptionModal: boolean;
  arrayForOfflineapi: any;
  imagezoomCount: number;
  audiostore: any;
  audiocurrentDuration: any;
  audioLoading: boolean;
  isvideopaused: boolean;
  keyforvideo: any;
  myOrientation: any;
  isFullScreen: boolean;
  islessomunmounted: boolean;
  saveImage: any;
  deviceModel: any;
  shouldDescriptionvisible: boolean;
  
}

interface SS {
  id: any;
}

export default class CatalogueStudyController extends BlockComponent<Props, S, SS> {
  
  courseLessonApiCallId: any;
  getLessonApiCallId: any;
  focusListener: any;
  lessonPointUpdateApiCallId: any;
  getCurrentTimeInterval: any;
  player: any
  newRef: any
  scrollViewRef = createRef()
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);
    

    this.subScribedMessages = [

      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionSaveMessage),
      getName(MessageEnum.SessionResponseMessage),

      
    ];

    this.state = {
      
      user_token: '',
      theme_type: '',
      theme_id: '',
      lesson_details: '',
      lessonId: '',
      lessonType: "",
      card_count: "",
      selectedIndex: null,
      lessionList: [],
      themeIndex: "",
      themeName: "",
      lessonIndex: "",
      clickItem: '',
      nextButtonTitle: 'NEXTLESSON',
      buttonShow: false,
      isLoading: false,
      data: "",
      lession_details_notes: null,
      wordData: [],
      defaultHighlightText: [],
      showLoader: false,
      newNoteArray: [],
      DefaultColorArray: [],
      annotionsData: [],
      selectedImage: null,
      imageZoomed: false,
      subscriptionModal: false,
      imagezoomCount: 1,
      audiostore: null,
      audiocurrentDuration: 0,
      audioLoading: false,
      isvideopaused: false,
      keyforvideo: 0,
      myOrientation: "POTRAIT",
      saveImage: [],
      isItOffline: false,
      isFullScreen: false,
      islessomunmounted: false,
      deviceModel: "",
      shouldDescriptionvisible: true
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    
  }
  

  async componentWillMount() {
    let model = DeviceInfo.getModel()
    this.setState({ deviceModel: model })
  }


  async componentDidMount() {
    const { navigation } = this.props;
    // this.getToken()
    let connectionStatus = await isConnected().then(response => response).catch(err => console.log(err))
    if (connectionStatus !== undefined) {
      console.log("mounteddd in controller");
      console.log("load.....");
     
    } else {
      let list = this.props.navigation.state?.params?.list;
      let clicklist = this.props.navigation.state?.params?.clickitem
      let selectedIndex = this.props.navigation.state?.params?.selectedIndex;
      console.log('clicklist item', JSON.stringify(this.props.navigation.state.params))
      this.setState({
        isItOffline: true,
        lesson_details: this.props.navigation?.state?.params?.clickitem,
        clickItem: clicklist,
        lessonId: list[selectedIndex],
        lessionList: list,
        selectedIndex: selectedIndex,
        lessonType: this.props.navigation?.state?.type,
        lessonIndex: this.props.navigation?.state?.params?.selectedIndex,
        showLoader: false,
        isLoading: false,
      },()=>{
        this.getLessonCourseData()
        if(this.state.isItOffline)
        {
          if(list.length-1>selectedIndex)
          {
            console.log("indexindexindex")
            this.setState({nextButtonTitle:"NEXTLESSON" })
          }
          else{
            let flashcard_data = this.props?.navigation?.state?.params?.flashcard_data[0]
            if (!flashcard_data) {
              this.setState({ nextButtonTitle: "CONTINUE" })
            }
            else {
              this.setState({ nextButtonTitle: "REVIEWFLASHCARDS" })
            }


            // this.setState({nextButtonTitle:"CONTINUE" })
          }
        }
      
      });
      this.getTheFileLocation();
      this.offlineGetComments()
    }
    this.focusListener = navigation.addListener("didFocus", async () => {
      let model = await DeviceInfo.getModel()
      this.setState({ deviceModel: model })
      console.log('mounting for audios')
      this.functionFOrsoundInMounting()
      if (connectionStatus !== undefined) {
        this.getToken()
        this.setState({ annotionsData: this.props.navigation?.state?.params?.data?.item, islessomunmounted: false })
        this.courseLessonSuccessCallBack(this.props.navigation?.state?.params?.data?.item)
        if (this.props?.navigation?.state?.params?.selectedIndex == this.props?.navigation?.state?.params?.list?.length - 1) {
          let flashcard_data = this.props?.navigation?.state?.params?.flashcard_data[0]
          if (!flashcard_data) {
            this.setState({ nextButtonTitle: "CONTINUE" })
          }
          else {
            this.setState({ nextButtonTitle: "REVIEWFLASHCARDS" })
          }
        }
      }
    })
  }


  componentWillUnmount = async () => {

    this.state?.audiostore?.release();

    Orientation.lockToPortrait();
  }


  async getToken() {
    this.setState({ showLoader: true, isLoading: true })
    let token: any = await AsyncStorage.getItem('LOGIN_TOKEN')
    let list = this.props.navigation.state?.params?.list;
    let clicklist = this.props.navigation.state?.params?.clickitem
    let selectedIndex = this.props.navigation.state?.params?.selectedIndex;
    this.setState({
      clickItem: clicklist,
      user_token: token,
      lessonId: list[selectedIndex],
      lessionList: list,
      selectedIndex: selectedIndex,
      lessonType: this.props.navigation?.state?.type,
      lessonIndex: this.props.navigation?.state?.params?.selectedIndex,
    },
      () => { this.getLessonCourseData(), console.log("LessonList", this.state.lessionList) })
    // let userSubscription = await AsyncStorage.getItem("USER_SUBSCRIPTION");
    let userSubscription = this.props.subscriptionState?.subscriptionInfo?.userSubscription;

    console.log("I am checking the subscription in study", userSubscription)

  };


  getTheFilesFromAsync = async (id: any) => {
    try {
      console.log(id, "getidLesson");
      const datafile = await getAsyncDataKeys(`lesson_image_${id}`);
      console.log("datafilefrtyuiLesson", datafile);
      const datapath = await readFile(datafile);
      console.log("datapathLesson", datapath);
      if (datapath !== null) {
        console.log("setStateinfileLesson");
        this.setState({ saveImage: [...this.state.saveImage, datapath] }, () => { console.log(this.state.saveImage, "dadsgsgscourseLesson") });
      }
    } catch (error) {
      console.log("Error in retriving datta Lesson", error);
    }
  }

  getTheFileLocation = async () => {
    console.log("get the file location Lesson");
    this.state.lessionList?.map((elem: any) => {
      console.log(elem, "GetThelessonsfromoffline");
      this.getTheFilesFromAsync(elem.id);
    });
  }

  functionFOrsoundInMounting = () => {
    // let audioFile=this.props.navigation.state?.params?.clickitem?.attributes?.audio_file;
    let audioFile = this.state.isItOffline ? this.props.navigation.state?.params?.clickitem?.attributes?.downloadedPath : this.props.navigation.state?.params?.clickitem?.attributes?.audio_file
    console.log('audio file mounting ===', audioFile, '========', this.props.navigation.state.params?.clickItem?.attributes)
    if (!audioFile) {
      return
    }
    this.setState({ audioLoading: true })
    var audio = new Sound(
      audioFile
      ,
      null,
      error => {
        if (error) {
          console.log('failed to load the sound', error);
          this.setState({ audioLoading: false })
          return;
        }
        // if loaded successfully
        console.log(
          'duration in seconds: ' +
          audio.getDuration() +
          'number of channels: ' +
          audio.getNumberOfChannels(),
        );

        this.setState({ audiostore: audio, audioLoading: false }, () => this.functiongettingCurrentTime())
      },
    );

  }
  audioFetchFunctionWhenGoingnext = (index: any) => {
    this.setState({ audioLoading: true })

    let audioFile = this.state.isItOffline ? this?.state?.lessionList[index]?.attributes?.downloadedPath : this?.state?.lessionList[index]?.attributes?.audio_file;
    if (!audioFile) {
      return
    }

    var audio = new Sound(
      audioFile
      ,
      null,
      error => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        // if loaded successfully
        console.log(
          'duration in seconds: ' +
          audio.getDuration() +
          'number of channels: ' +
          audio.getNumberOfChannels(),
        );

        this.setState({ audiostore: audio, audioLoading: false }, () => {
          console.log('audio files store', audio)
          this.functiongettingCurrentTime()
        })
      },
    );

  }


  async receive(from: string, message: Message) {
    // console.log('@@@ API MESSAGE LOGIN VIEW =================', message)
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      )


      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      )
      // console.log('@@@@@ lesson data responseJson =====', responseJson)
      var errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      )
      // console.log("@@@@@@ errror ==", errorReponse)
      if (responseJson && !responseJson.errors) {
        if (apiRequestCallId === this.courseLessonApiCallId) {
          this.setState({ showLoader: false })
          this.courseLessonSuccessCallBack(responseJson);
        }
        else if (apiRequestCallId === this.lessonPointUpdateApiCallId) {
          this.setState({ showLoader: false })
          this.lessonPointUpdateSuccessCallBack(responseJson)
        }

      } else if (responseJson && responseJson.errors) {
        if (apiRequestCallId === this.courseLessonApiCallId) {
          this.setState({ showLoader: false })
          this.courseLessonFailureCallBack(responseJson)
        }
        else if (apiRequestCallId === this.lessonPointUpdateApiCallId) {
          this.setState({ showLoader: false })
          this.lessonPointUpdateFailureCallBack(responseJson)
        }
      } else if (errorReponse) {
        this.setState({ showLoader: false })
        console.log('errorReponseeeeeeer', errorReponse)
      }
    }
  }



  courseLessonSuccessCallBack = async (responseJson: any) => {


    let notes_arr = this.state.annotionsData === undefined ? responseJson?.lesson_notes?.note_array : responseJson?.attributes?.note_array;

    let new_note_arr: any = []
    notes_arr && notes_arr.map(i => {
      let str = ''
      str = i.split('=>').join(':');
      new_note_arr.push(JSON.parse(str))
    })
    console.log('============data7898=========', responseJson);
    await this.setState({ DefaultColorArray: new_note_arr })

    // console.log('@@@ lesson data Success CallBack =================', responseJson)
    // console.log("@@@@@@@@@@@@ theme index =====", this?.props?.navigation?.state?.params)
    this.setState({ lesson_details: responseJson?.data, lession_details_notes: responseJson?.lesson_notes, themeIndex: this?.props?.navigation?.state?.params?.themeIndex, themeName: responseJson?.course, })
    // console.log("theme name  ", responseJson?.course)
    // console.log("conditiommmm", this.state.selectedIndex, this.props?.navigation?.state?.params?.list?.length)
    if (this.state.selectedIndex == this.props?.navigation?.state?.params?.list?.length - 1) {
      console.log("conditiommmm")
      console.log(this.props?.navigation?.state?.params, "checkingg")

      if (!this.props?.navigation?.state?.params?.flashcard_data || !this.props?.navigation?.state?.params?.flashcard_data[0]) {
        this.setState({ nextButtonTitle: "CONTINUE" })
        return
      }

      this.setState({ nextButtonTitle: "REVIEWFLASHCARDS" })
    }

    this.setState({ showLoader: false, isLoading: false })


    this.functionTohandleComgo(responseJson)

  };

  courseLessonFailureCallBack = (responseJson: any) => {
    console.log('@@@  lesson data failure callBack =================', responseJson)
    this.setState({ showLoader: false })
  };
  lessonPointUpdateSuccessCallBack = (responseJson: any) => {
    console.log("@@@ reward point update success callBack ==========", responseJson)
    this.setState({ showLoader: false })
  }

  lessonPointUpdateFailureCallBack = (responseJson: any) => {
    console.log('@@@  reward point update failure callBack ===============', responseJson)
    this.setState({ showLoader: false })
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
    // console.log('@@@ requestMessage ======== lesson', requestMessage)
    return requestMessage.messageId;
  }

  getLessonCourseData = async () => {
    let connectionStatus = await isConnected().then(response => response).catch(err => console.log(err))
    console.log("iamindattata")
    this.state.lessionList.map(async (item: any) => {
      if (item?.id == this.state.clickItem?.id) {
        console.log("checking for next")
        if (!connectionStatus) {
    let body={
          contentType: "application/json",
          method: "Post",
          endPoint: `lesson/show?id=${item.id}&type=${item.type}`
        }
        let allOfflineData = this.props.offlineState?.offlineAPIs;
        allOfflineData.push(body)
        this.props.addOfflineAPis(allOfflineData);

        }
    
        this.courseLessonApiCallId = await this.apiCall({
          contentType: "application/json",
          method: "Post",
          endPoint: `lesson/show?id=${item.id}&type=${item.type}`
        })
      }
    })
  }

 
  getLessonCourseDataNext = async (item: any) => {
    let connectionStatus = await isConnected().then(response => response).catch(err => console.log(err))
    if (item?.attributes?.status != "complete") {
      this.courseLessonApiCallId = await this.apiCall({
        contentType: "application/json",
        method: "Post",
        endPoint: `lesson/show?id=${item?.id}&type=${item?.type}&status=complete`,
      })
      
      // offline
      if (!connectionStatus) {
        console.log('offline data update', item)
        // this.props.updateOfflineStatus(item);
        this.setState({ isLoading: false })
        let myarg = {
          contentType: "application/json",
          method: "Post",
          endPoint: `lesson/show?id=${item?.id}&type=${item?.type}&status=complete`,
        }
        console.log(myarg, "thisdatalesson");

        let allOfflineData = this.props.offlineState?.offlineAPIs;
        console.log('allofflinedata', allOfflineData)
        allOfflineData.push(myarg);
        console.log('updated offline course study data', allOfflineData)
        this.props.addOfflineAPis(allOfflineData);
        // await setAsyncData("API_ARRAY_FOR_OFFLINE", allOfflineData);
      }
      // offline
    }

  }


  getLessonCourseDataNextAltered = async (item: any, nextIndex: any) => {
    let connectionStatus = await isConnected().then(response => response).catch(err => console.log(err))

    console.log("@@@ item in catalogue 5===", item)
    if (item?.attributes?.status != "complete") {
      let myCourseId = this.state.lessionList[nextIndex]?.id

      if (!myCourseId) {
        return
      }

      this.courseLessonApiCallId = await this.apiCall({
        contentType: "application/json",
        method: "Post",
        endPoint: `lesson/show?id=${myCourseId}&type=${item?.type}&status=current`,
      })
      //offline starts
      if (!connectionStatus) {
        this.setState({ isLoading: false })

        let myarg = {
          contentType: "application/json",
          method: "Post",
          endPoint: `lesson/show?id=${myCourseId}&type=${item?.type}&status=current`,
        }
        let allOfflineData = this.props.offlineState?.offlineAPIs;
        console.log('allofflinedata', allOfflineData)
        allOfflineData.push(myarg);
        console.log('updated offline course study data', allOfflineData)
        await this.props.addOfflineAPis(allOfflineData);
      }
      //offline ends

    }
  }

  updateRewardPoint = async () => {
    let body = {
      leader_board: {
        reward_point: 1
      }
    }
    this.lessonPointUpdateApiCallId = await this.apiCall({
      contentType: "application/json",
      method: "POST",
      endPoint: "bx_block_profile/leader_boards",
      body: body
    })
  }

  functionRenderingButtontext = async () => {
    console.log("I am runninggggg88888")
    if (this.props?.navigation?.state?.params?.list?.length - 1 == this.state.selectedIndex) {
      this.setState({ nextButtonTitle: "REVIEWFLASHCARDS" })

    }
  }



  zoomingTheImageIn = async () => {
    if (this.state.imagezoomCount == 5) {
      return
    }
    this.setState({ imagezoomCount: this.state.imagezoomCount + 1 })
  }

  zoomingTheImageOut = () => {
    if (this.state.imagezoomCount == 1) {
      return
    }
    this.setState({ imagezoomCount: this.state.imagezoomCount - 1 })

  }

  functionResponsibleforPausingPlay = async () => {
    let audio = this.state.audiostore
    if (audio.isPlaying()) {
      audio.pause()
    }
    else {
      audio.play()
    }
  }

  functiongettingCurrentTime = () => {
    this.getCurrentTimeInterval = setInterval(() => {
      this.state.audiostore.getCurrentTime((minutes) => {
        this.setState({ audiocurrentDuration: minutes })
      })

    }, 500)
  }

  AssigningRef = (ref: any) => {
    this.player = ref
  }

  AssigningnewREf = (ref: any) => {
    this.newRef = ref
  }

  functionTohandleComgo = async (respose: any) => {

    let stringifiedCongo = await AsyncStorage.getItem("CONGRATULATIONS")
    let congo = JSON.parse(stringifiedCongo)

    let courseID = this.props?.navigation?.state?.params?.course_id


    console.log(courseID, congo, respose.course_status, "00000011111122222")


    if (congo[courseID]) {
      console.log(courseID, respose.course_status, "00000011111122222")
      // delete congo[courseID]
      if (respose.course_status == "complete") {

        delete congo[courseID]

        await AsyncStorage.setItem("CONGRATULATIONS", JSON.stringify(congo))

        this.props.navigation.navigate("Congratulation", { course_id: courseID })


      }
    }
  }




  functionTogetOrientation = () => {

    Orientation.getOrientation((err, orientation) => {
      console.log(`Current Device Orientation: ${orientation}`);
    });
  }

  functionForLanscapemode = () => {
    this.setState({ myOrientation: "LANDSCAPE", shouldDescriptionvisible: false })
    console.log("lllll llll llll", this.state)
  }

  functionForpotrait = () => {
    this.setState({ myOrientation: "POTRAIT" })
    setTimeout(() => {
      this.setState({ shouldDescriptionvisible: true })
    }, 1000)
  }


  offlineGetComments=()=>{
    let offlineData=   this.props?.offlineState?.offlineData
    let notesData=offlineData["all_notes"]?.data
    notesData=notesData.filter((e)=>{
     return e.attributes.lesson_id==this.state.lesson_details?.id
    })
    console.log("offlineGetComments",notesData,this.state.lesson_details?.id)
    this.setState({lession_details_notes:notesData[0]?.attributes})
   
     }



  // functionOfNextFunction=async()=>{

  //   let nextIndex = this.state.selectedIndex + 1;


  //   if(this.state?.lesson_details?.attributes?.audio_file){
  //     clearInterval(this.getCurrentTimeInterval)
  //     this.state?.audiostore?.release();
  //    }
  //    if(this.state?.lesson_details?.attributes?.video_file){

  //     this.setState({keyforvideo:this.state.keyforvideo+1})

  //    }

  //   //  this.getLessonCourseDataNext( this.state.lessionList[nextIndex-1] )
  //   //  this.getLessonCourseDataNextAltered(this.state.clickItem, nextIndex)


  //   if ((this.state.lessionList[nextIndex]?.type == 'lesson')) {
  //     if(this.state.lessionList[nextIndex]?.attributes?.lesson_type==="Paid" && await AsyncStorage.getItem("USER_SUBSCRIPTION")=="unsubscribed" )
  //     {
  //         this.setState({ subscriptionModal: true })
  //         return
  //     }
  //     else{
  //           this.setState({ selectedIndex: nextIndex, lessonId: this.state.lessionList[nextIndex], lessonIndex: this.state.lessonIndex+1 , clickItem: this.state.lessionList[nextIndex-1] })
  //     }


  //     this.getLessonCourseDataNext( this.state.lessionList[nextIndex-1] )
  //     this.getLessonCourseDataNextAltered(this.state.clickItem, nextIndex)

  // }

  // else {
  //   let flashcard_data = this.props?.navigation?.state?.params?.flashcard_data[0]
  //   if (!flashcard_data) {
  //       this.props.navigation.goBack()
  //       return
  //   }
  //   else{
  //       this.props.navigation.navigate('OverView', { theme_id: this.props?.navigation?.state?.params?.flashcard_data[0]?.theme_id, isItfromThemesLessonList: true, course_id: this.props?.navigation?.state?.params?.course_id, fromCatalogueFiveToOverview: true, flashCardTitle: this.props?.navigation?.state?.params?.flashcard_data[0]?.title, totalCardCountFromThemes: flashcard_data?.total_count, totalUserCardCountFromThemes: flashcard_data?.user_count })
  //   }
  // }

  // this.setState({lesson_details:this.state?.lessionList[nextIndex] ?? []},()=>this.audioFetchFunctionWhenGoingnext(nextIndex))


  // }

  

getCousenameoffline=()=>{

 let param= this.props?.navigation?.state?.params?.course_id
 let offlineData=   this.props?.offlineState?.offlineData?.all_courses.filter((e)=>{
 return e.id==param
 })[0]?.course_name


 console.log("offlineDataofflineData",offlineData)

return offlineData


}

 deltaToHtml = (delta:string): string => {
  let html = '';
  if(delta.indexOf("ops") !== -1){
    let formattedData = JSON.parse(delta)
    formattedData.ops.forEach((op: DeltaOperation) => {
    if (op.insert) {
      let text = op.insert;
      if (typeof text === 'string') {
        let style = '';
        let attributes = op.attributes || {};

        if (attributes) {
          if (attributes.bold) style += 'font-weight: bold; ';
          if (attributes.italic) style += 'font-style: italic; ';
          if (attributes.underline) style += 'text-decoration: underline; ';
          if (attributes.strikethrough) style += 'text-decoration: line-through; ';
          if (attributes.color) style += `color: ${attributes.color};`;
          if (attributes.background) style += `background-color: ${attributes.background};` ;
          if (attributes.font) style += `font-family: ${attributes.font};` ;
          if (attributes.size) style += `font-size: ${attributes.size};` ;
          if (attributes.align) style +=` text-align: ${attributes.align};` ;
          
          if (attributes.link) {
            html += `<a href="${attributes.link}" style="${style}">${text}</a>`;
            return;
          }
          if (attributes.header) {
            html += `<h${attributes.header} style="${style}">${text}</h${attributes.header}>`;
            return;
          }
          if (attributes.list) {
            let tag = attributes.list === 'bullet' ? 'ul' : 'ol';
            html += `<${tag} style="${style}"><li>${text}</li></${tag}>`;
            return;
          }
          if (attributes.blockquote) {
            html += `<blockquote style="${style}">${text}</blockquote>`;
            return;
          }
          if (attributes.indent) {
            html += `<div style="margin-left: ${attributes.indent * 20}px; ${style}">${text}</div>`;
            return;
          }
        }

        html += `<span style="${style}">${text}</span>`;
      } else {
        html += typeof text === 'object' ? '' : text;
      }
    }
  })
  return html;}
  else{
    return delta
  }
};

  functionReturningValidHtml() {
    console.log("valid html",this.state?.lesson_details?.attributes)
    if (this.state?.lesson_details?.attributes?.highlight_description == "N/A" ||!this.state?.lesson_details?.attributes?.highlight_description
    ) {
      return this.state?.lesson_details?.attributes?.description
    }
    else {
      return this.state?.lesson_details?.attributes?.highlight_description
    }
  }

  htmlContent = () => {
    const ddd = this.functionReturningValidHtml();
    if (ddd !== undefined) {
        return this.deltaToHtml(ddd);
    } 
}
  commentJsxtrueornot=()=>{
     if(  this.state.annotionsData != undefined && this.state.annotionsData.length!=0&&
  this.state.annotionsData?.attributes?.comment != '')
  {
    return true
  }
  else{
    return false
  }
  
  } 
  lessoonlistjsxtrueornot=()=>{

    if(!!this.state?.lession_details_notes &&
      this.state?.lession_details_notes?.comment != '' )
      {
        return true
      }
      else{
        return false
      }
  }

  returnData=()=>{
    let Data =  !this.state.isItOffline &&  this.state.annotionsData === undefined||this.state.annotionsData.length==0 ? this.state.lesson_details?.attributes?.description : this.state.annotionsData?.attributes?.lesson?.data?.attributes?.description;
return Data
  }
  confirmbtnfunction=() => { 
    this.setState({ subscriptionModal: false });
    if(this.state.isItOffline){
      this.props.navigation.navigate('NoInternet',{showHeader:true,from:'subscription'})
    }else{
 this.props.navigation.navigate('SubCriptionScreen',{isItfromlessonOrtheme:true})}
    
}
functionReturningpotrait=()=>{
 return this.state.myOrientation=="POTRAIT"
}
}
// Customizable Area End