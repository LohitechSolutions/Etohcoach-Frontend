// Customizable Area Start
import { BlockComponent } from "../../../framework/src/BlockComponent";
import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

import AsyncStorage from "@react-native-async-storage/async-storage";


import { createRef } from "react";
import { COLORS } from "../../../framework/src/Globals";
import { setAsyncData } from "../../../mobile/src/utils/AsyncKeysStorage";

import { isConnected } from "../../../mobile/src/utils/internetConnection";
import { CONTENT_SOURCE } from "../../../framework/src/config";
import { loadQuizExamRailsData } from "./content/firestoreRepository";

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  offlineState: any;
  addOfflineAPis:(val:any)=>void;
  subscriptionState:any;
  addOfflineData:(val:any)=>void;
  updateOfflineStatus:(val:any)=>void;
  updateOfflineData : (val : any) => void;
  loadingOfflineData : (val : any ) => void;
  
  
}

interface S {
  
  txtInputValue: string;
  txtSavedValue: string;
  enableField: boolean;
  page_index: any;
  user_token: any;
  qustionList: any;
  rating: any;
  flashCardQuestionAnswer: any;
  course_id: any;
  courseId: any;
  cardId: any;
  ThemeItemList: any;
  condition: boolean;
  checked: string;
  quizeAndMoc_id: any;
  quizeType: any;
  mockexamdata: any;
  multiple_choice_answer: any;
  radio_button_answer: any;
  pair_answer: any;
  short_text_and_schema_answer: any;
  data: any;
  isConfirmButtonPressed: boolean;
  trialPairanswers: any;
  trialCopyBoard: any;
  pairextracteddata: any;
  componentRerenderkey: number;
  mockexamName: any;
  quizThemeId: any;
  quiz_page_index: number;
  rearrange_order_answer: any;
  shouldComfirmationButtonBeVisible: any;
  courseName: any;
  myMockexamId: any;
  myQuizexamId: any;
  quizzesStatusCheck: number;
  resultModalVisible: boolean;
  Circularprogresswidth: number;
  CircularprogressfillColor: string;
  CircularprogressprogressColor: string;
  CircularprogresstrackBorderColor: string;
  Circularprogresspointscolor: string;
  CircularprogresstextColor: string;
  Circularprogresspointstext: any;
  Circularprogresstotlatext: string;
  ResultModalPointsText: string;
  ResultModalPointsSubtest: string;
  Progresspercentage: any
  writeAnswerCount: any,
  WrongAnsercount: any,
  quizexamRightanssObject: any,
  travelledpath: any,
  equilibriumcount: any,
  isItontheEdge: any,
  amIinresultopage: any,
  isitinthehorizontalresultopage: boolean,
  modalShowforquizzes: boolean,
  isItthepeak: boolean,
  isoFFline: boolean,
  offlineState:boolean,
  pairBackgroundColor: string,
  saveImage: any,
  isItOffline:boolean,
  
}

interface SS {
  
  id: any;

  
}

var TheFinalQuizArrayforAnswers = [] as any
export default class MocExamInitController extends BlockComponent<
  Props,
  S,
  SS
> {
  

  quizzeAndMocExamApiCallId: any;
  getUpdateRatingCallapi: any;
  focusListener: any;
  ApicallforRightAnswerUpdateId: any;
  quizzeExamStatusApiCallId: any;
  quizzeExamCheckConfirmApiCallId: any
  apicallForMakingmockexamcurrentID: any;
  ApicallforRestartID: any;
  scrollViewRef: any;
  isItOffline:boolean;

  
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
      user_token: "",
      qustionList: [],
      rating: "",
      flashCardQuestionAnswer: [],
      course_id: "",
      courseId: "",
      cardId: "",
      isConfirmButtonPressed: false,
      ThemeItemList: [
        // {
        //   id: 1,
        //   multiSelect: 'Question with multiSelect',
        //   answerMultiChoice: "Select one or more answer.",
        //   checkImage: require("../assets/Component.png"),
        //   unCheckImage: require("../assets/unCheck.png"),
        //   answer: "Answer 1",
        //   answer2: "Answer 2",
        //   answer3: "Answer 3",
        //   mocExamTxt: "Moc exam 1",
        //   moxExamAnsTxt: "Answer all the question and click confirm to See results.",
        //   standardTxt: 'Standard question',
        //   correctAnswerTxt:"Select the correct answer.",
        //   radioCheckImage:require("../assets/radio.png"),
        //   radioUnCheckImage:require("../assets/Selected=off.png"),
        //   sampleQeustionTxt:"Sample question",
        //   sampleImageTxt:"What are the names of the image?",
        //   sampleImage :require("../assets/image_question.png"),
        //   sampleAnswerTxt:"Type answers in the appropriate input.",
        //   quetionNo:"1",
        //   quetionTxt:"Leaf",
        //   findPairTxt:"Find the pair",
        //   tapOnWord:"Tap on words you want to pair."
        // },
      ],
      condition: false,
      quizeAndMoc_id: "",
      quizeType: "",

      mockexamdata: [],
      multiple_choice_answer: {},
      radio_button_answer: {},
      rearrange_order_answer: {},
      pair_answer: {},
      short_text_and_schema_answer: {},
      trialPairanswers: ["Sep", "Dec", "Jan", "July", "March"],
      trialCopyBoard: "",
      pairextracteddata: [],
      componentRerenderkey: 1,
      mockexamName: "",
      quizThemeId: "",
      quiz_page_index: 0,
      shouldComfirmationButtonBeVisible: false,
      courseName: "",
      quizzesStatusCheck: 0,
      resultModalVisible: false,
      Progresspercentage: 0,
      CircularprogressfillColor: "",
      CircularprogressprogressColor: "",
      CircularprogresstrackBorderColor: "",
      Circularprogresspointscolor: "",
      CircularprogresstextColor: "",
      Circularprogresspointstext: "",
      Circularprogresstotlatext: "",
      ResultModalPointsText: "",
      ResultModalPointsSubtest: "",
      writeAnswerCount: 0,
      WrongAnsercount: 0,
      quizexamRightanssObject: {},
      travelledpath: [],
      equilibriumcount: 0,
      isItontheEdge: false,
      amIinresultopage: false,
      isitinthehorizontalresultopage: false,
      modalShowforquizzes: false,
      isItthepeak: false,
      isoFFline: false,
      offlineState:false,
      saveImage: [],
      pairBackgroundColor: 'white'
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
    this.scrollViewRef = createRef()
    
  }
  

  async componentDidMount() {
    TheFinalQuizArrayforAnswers = []
    // let index = this?.props?.questionIndex??0
    // let myLength = this.props?.data?.attributes?.is_correct?.length??0;

    
    // this.SchemaBasedMountFunction(index, myLength)
  
   
    this.focusListener = this.props.navigation.addListener("didFocus", async () => {
      let connectionStatus = await isConnected().then(response => response).catch(err => console.log(err))
      console.log('connection status',connectionStatus)
      if (connectionStatus !== undefined) {
        this.getToken();
        this.setState({ isoFFline: false })
      } else {
        this.setState({
          isoFFline:true,
          quizeType: this?.props?.navigation?.state.params?.quizeType,
          quizThemeId: this.props?.navigation?.state?.params?.quizThemeId,
          courseName: this.props?.navigation?.state?.params?.courseName,
        },async()=>{
          console.log("offline state change---",this.state.isoFFline)
          await this.getQuizExamDetailsOfflineFun();
        })
        
        this.setState({ saveImage: [] }, () => { this.getTheFileLocation() })
      }

      if (this.props?.navigation?.state?.params.isItFromMockExamMOdal == true) {
        console.log("mockExamDatafromOverviewMockexamModal", this.props?.navigation?.state?.params?.mockExamDatafromOverviewMockexamModal)
        this.setState({
          mockexamdata: this.props?.navigation?.state?.params
            ?.mockExamDatafromOverviewMockexamModal[0].mock_exams,
          mockexamName: this.props?.navigation?.state?.params
            ?.mockExamDatafromOverviewMockexamModal[0].name,
          courseName: this.props?.navigation?.state?.params?.courseName,
          myMockexamId: this.props?.navigation?.state?.params
            ?.mockExamDatafromOverviewMockexamModal[0]?.id
        });
        this.apicallForMakingmockexamcurrent(this.state?.mockexamdata[0]?.id)

      } else if (this.props?.navigation?.state?.params.isItFromQuizExamMOdal == true) {
        console.log("myQuizexamId @@@@@@", this.props?.navigation?.state?.params?.quizExamDatafromOverviewQuizexamModal[0])
        this.setState({
          quizeAndMoc_id: this?.props?.navigation?.state.params?.quizeAndMoc_id,
          quizeType: this?.props?.navigation?.state.params?.quizeType,
          quizThemeId: this.props?.navigation?.state?.params?.quizThemeId,
          courseName: this.props?.navigation?.state?.params?.courseName,
          // myQuizexamId: this.props?.navigation?.state?.params?.quizExamDatafromOverviewQuizexamModal[0]?.quiz[0].id
        })
        // ()=>this.getQuizzeAndMocExamData()
        this.getQuizzeAndMocExamData()
        // this.apicallForMakingmockexamcurrent(this.state.myQuizexamId)
      }

      this.setState({
        quizThemeId: this.props?.navigation?.state?.params?.quizThemeId
      })
      // this.getToken();
    });
  }
  async componentWillUnmount() {
    // this.props.navigation.setParams({ isItFromQuizExamMOdal: null, isItFromMockExamMOdal: null });
    // this.focusListener.remove();
  }

  async getToken() {
    let token: any = await AsyncStorage.getItem("LOGIN_TOKEN");
    this.setState(
      {
        user_token: token,
        course_id: this.props?.navigation?.state?.params?.cardId,
        cardId: this.props?.navigation?.state?.params?.cardId,
        quizeAndMoc_id: this?.props?.navigation?.params?.quizeAndMoc_id,
        quizeType: this?.props?.navigation?.params?.quizeType,
      },
      // () => { this.getQuizzeAndMocExamData() }
    );
    //this.send(msg);
  }

  async receive(from: string, message: Message) {
    console.log("@@@ API MESSAGE LOGIN VIEW =================", message);

    if (message.id == this.apicallForMakingmockexamcurrentID) {
      console.log("i am checking the response for current", message)
    }


    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );

      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      console.log(
        " @@@@@ responseJson api quizze and moc exam =====",
        JSON.stringify(responseJson), apiRequestCallId, this.quizzeAndMocExamApiCallId
      );
      var errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );
      // console.log("@@@@@@ errror ==", errorReponse);
      if (responseJson && !responseJson.errors) {
        if (apiRequestCallId === this.quizzeAndMocExamApiCallId) {
          this.quizzeAndMocExamSuccessCallBack(responseJson);
        }
        else if (apiRequestCallId === this.ApicallforRightAnswerUpdateId) {
          this.apiCallforRightAnswerSuccessCallback(responseJson)
        }
        else if (apiRequestCallId === this.apicallForMakingmockexamcurrentID) {
          this.apicallForMakingmockexamcurrentIDSuccesscallback(responseJson)
        }
        else if (apiRequestCallId === this.quizzeExamCheckConfirmApiCallId) {
          this.quizzeStatusCheckSuccessCallback(responseJson)
        }
        else if (apiRequestCallId == this.ApicallforRestartID) {
          this.ApicallforRestartSuccesscallBack(responseJson)
        }
      } else if (responseJson && responseJson.errors) {
        if (apiRequestCallId === this.quizzeAndMocExamApiCallId) {
          this.quizzeAndMocExamFailureCallBack(responseJson);
        }
        else if (apiRequestCallId === this.ApicallforRightAnswerUpdateId) {
          this.apiCallforRightAnswerFailureCallback(responseJson)
        }
        else if (apiRequestCallId === this.apicallForMakingmockexamcurrentID) {
          this.apicallForMakingmockexamcurrentIDFailurecallback(responseJson)
        }
        else if (apiRequestCallId === this.ApicallforRestartID) {
          this.ApicallforRestartFailureCallback(responseJson)
        }
      } else if (errorReponse) {
        console.log("errorReponse in mock and quizz", errorReponse);
      }
    }
  }

  quizzeAndMocExamSuccessCallBack = (responseJson: any) => {
    console.log(
      "@@@ DATA Success Quizze And MocExam CallBack =================",
      responseJson?.data
    );
    this.setState({ mockexamdata: responseJson?.data });
    this.apicallForMakingmockexamcurrent(responseJson?.data[0].id)
  };

  ApicallforRestartSuccesscallBack = (responseJson: any) => {
    console.log("Successcallback in restart", responseJson)
  }

  quizzeStatusCheckSuccessCallback = (responseJson: any) => {
    console.log(
      "@@@ DATA Success Quizze Status Check CallBack =================",
      responseJson
    );
  }
  apicallForMakingmockexamcurrentIDSuccesscallback = (responseJson: any) => {
    console.log(
      "@@@ DATA Success And MocExam CallBack current =================",
      responseJson?.data
    );

  }

  apiCallforRightAnswerSuccessCallback = (responseJson: any) => {
    console.log("@@@ Success for points update callback", responseJson)
  }

  quizzeAndMocExamFailureCallBack = (responseJson: any) => {
    console.log(
      "@@@ flashcard Quizze And MocExam failure callBack =================",
      responseJson
    );
    // this.setState({ isLoading: false, })
  };

  apiCallforRightAnswerFailureCallback = (responseJson: any) => {
    console.log("@@@ Failure for points update callback", responseJson)
  }

  apicallForMakingmockexamcurrentIDFailurecallback = (responseJson: any) => {
    console.log("@@@ Failure for points", responseJson)
  }

  ApicallforRestartFailureCallback = (responseJson: any) => {
    console.log("failure call back for Restart", responseJson)
  }

  ApicallforRightAnswerUpdate = async (arr: any, wrongarr: any, isitfromquizz: boolean) => {
    await setAsyncData("MockExamArray", arr)
    let thebody
    if (isitfromquizz) {

      let quizData = this.state.mockexamdata
      let mixarray = Object.values(this.state.quizexamRightanssObject)
      let rightArray = []
      let wrongArray = []
      for (let i = 0; i < mixarray.length; i++) {
        if (mixarray[i]) {
          rightArray.push(mixarray[i])
        }
        else {
          wrongArray.push(quizData[i]?.id)
        }
      }
      console.log('checking the api call for the quizzes point', rightArray, wrongArray)


      thebody = {
        ids: rightArray,
        wrong_ids: wrongArray,
        type: "confirm",
        exam_type: "quiz_exam",
      }
    }
    else {
      thebody = {
        ids: arr,
        wrong_ids: wrongarr,
        type: 'confirm',
        exam_type: "mock_exam"
      }
    }


    this.ApicallforRightAnswerUpdateId = await this.apiCall({
      contentType: "application/json",
      method: "Post",
      endPoint: `bx_block_quiz_and_mock_exams/quiz_and_mock_exam/confirm_and_reset`,
      body: thebody
    });


    if (this.state.isoFFline) {
      let myarg = {
        contentType: "application/json",
        method: "Post",
        endPoint: `bx_block_quiz_and_mock_exams/quiz_and_mock_exam/confirm_and_reset`,
        body: thebody
      }
      // let allOfflineData = await getAsyncDataKeys('API_ARRAY_FOR_OFFLINE')
      // allOfflineData.push(myarg)
      let allOfflineData = this.props.offlineState?.offlineAPIs;
      allOfflineData.push(myarg);
      this.props.addOfflineAPis(allOfflineData);
      console.log("checking the offline data in me", JSON.stringify(allOfflineData))
      // await setAsyncData("API_ARRAY_FOR_OFFLINE", allOfflineData)

    }


    console.log("checking the answers of mock examsss---", thebody)
  };

  apiCall = async (data: any) => {
    console.log("datafromapicallquizz", data)
    let token = await AsyncStorage.getItem("@token");
    const { contentType, method, endPoint, body, type } = data;
    const header = {
      "Content-Type": contentType,
      token: this.state.user_token,
    };
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
    console.log(
      "@@@ requestMessage from mockexaminit ========",
      requestMessage
    );
    return requestMessage.messageId;
  };

  getQuizzeAndMocExamData = async () => {
    if (CONTENT_SOURCE === 'firestore') {
      const tid = String(this.state.quizThemeId || this.props?.navigation?.state?.params?.quizThemeId || '');
      try {
        const data = await loadQuizExamRailsData(tid);
        this.setState({ mockexamdata: data });
      } catch (e) {
        console.warn(e);
        this.setState({ mockexamdata: [] });
      }
      return;
    }

    console.log("this.state @@ &&", this.state.quizThemeId, "hvdhjasvd")
    // return
    this.quizzeAndMocExamApiCallId = await this.apiCall({
      contentType: "application/json",
      method: "GET",
      // endPoint: `bx_block_quiz_and_mock_exams/quiz_and_mock_exam/get_answer_list?exam_type=Quiz Exam&course_id=76`,
      endPoint: `bx_block_quiz_and_mock_exams/quiz_and_mock_exam/get_answer_list?exam_type=Quiz Exam&theme_id=${this.state.quizThemeId}`,

    });
  };

  getQuizExamDetailsOfflineFun = async () => {
    let responseJson = {} as any
    // console.log('quiz offline data', this.props.offlineState)
    let allOfflineData = this.props.offlineState?.offlineData;
    // console.log("QUIZEXAM OFFLINE DETAILS", allOfflineData?.quiz_exams)
    if (this.props?.navigation?.state?.params.isItFromQuizExamMOdal == true) {
      // console.log('quiz exams response', this.state.quizThemeId)
      responseJson = allOfflineData.quiz_exams.data.filter((ele: any, i: any) => {
        // console.log('quiz items', ele, ele.attributes.theme_id, this.state.quizThemeId)
        if (ele.attributes.theme_id == this.state.quizThemeId) return ele
      })
      // console.log('quiz exams response', responseJson)
    }

    if (this.props?.navigation?.state?.params.isItFromMockExamMOdal == true) {
      responseJson = allOfflineData.mock_exams.data.filter((ele: any, i: any) => {
        if (ele.attributes.theme_id == this.state.quizThemeId) return ele
      })
    }

    // console.log("getQuizExamDetailsOfflineFun :::::::@@", responseJson, this.props?.navigation?.state?.params.isItFromMockExamMOdal)
    await this.setState({
      isoFFline: true,
      mockexamdata: responseJson,
    });
    console.log('state change',this.state.offlineState)
  }

  getTheFilesFromAsync = async (id: any,elem:any) => {
    try {
      console.log(id, "getidMockorquiz");
      const datapath = elem?.attributes.downloadedPath;
      console.log("datapatMockorquiz", elem);
      if (datapath !== null) {
        console.log("setStateinfileMockorquiz");
        this.setState({ saveImage: [...this.state.saveImage, datapath] }, () => { console.log(this.state.saveImage, "dadsgsgsjhgjgMockorquiz") });
      }
    } catch (error) {
      console.log("Error in retriving datta Mockorquiz", error);
    }
  }


  getTheFileLocation = async () => {
    console.log("get the file location Theme Mockorquiz");
    this.state.mockexamdata?.map((elem: any) => {
      console.log("dataMockorquiz", elem);
      this.getTheFilesFromAsync(elem.id,elem);
    });
  }


  onStartQuzzieAndMocExam = () => {
    if (this.state.ThemeItemList.attributes.exam_type == "mock_exam") {
    }
  };

  functionResponsibleForRearrange = (
    index: any,
    direction: any,
    QuestionIndex: any
  ) => {
    console.log(this, "asss");
    let myarr = this.state?.rearrange_order_answer[QuestionIndex];
    if (direction == "up" && index == 0) {
      let temp = myarr[index];
      myarr[index] = myarr[myarr.length - 1];
      myarr[myarr.length - 1] = temp;
      this.setState({
        rearrange_order_answer: {
          ...this.state.rearrange_order_answer,
          [QuestionIndex]: myarr,
        },
      });
    } else if (direction == "down" && index == myarr.length - 1) {
      let temp = myarr[myarr.length - 1];
      console.log(myarr.length - 1, index, "checking inside core function");
      myarr[myarr.length - 1] = myarr[0];
      myarr[0] = temp;
      this.setState({
        rearrange_order_answer: {
          ...this.state.rearrange_order_answer,
          [QuestionIndex]: myarr,
        },
      });
    } else {
      console.log("checking inside core function others");

      if (direction == "down") {
        let temp = myarr[index];
        console.log(myarr.length - 1, index, "checking inside core function");
        myarr[index] = myarr[index + 1];
        myarr[index + 1] = temp;
        this.setState({
          rearrange_order_answer: {
            ...this.state.rearrange_order_answer,
            [QuestionIndex]: myarr,
          },
        });
      }
      if (direction == "up") {
        let temp = myarr[index];
        console.log(myarr.length - 1, index, "checking inside core function");
        myarr[index] = myarr[index - 1];
        myarr[index - 1] = temp;
        this.setState({
          rearrange_order_answer: {
            ...this.state.rearrange_order_answer,
            [QuestionIndex]: myarr,
          },
        });
      }
    }

    setTimeout(() => {
      this.conditionforConfirmingFunction()
      // this.conditionforNextFunction()
      if (this.props?.navigation?.state?.params.isItFromQuizExamMOdal == true) {
        this.setState({ shouldComfirmationButtonBeVisible: true });
      }

    })

  };

  functionResponsibleForHandlingMutiplechoiceBoxQuestion = (
    answer: any,
    index: any
  ) => {
    console.log(
      this.state?.multiple_choice_answer?.[index]?.[answer], this.state?.multiple_choice_answer?.[index],
      "i am checking thisss"
    );
    if (this.state?.multiple_choice_answer?.[index]?.[answer]) {
      this.setState({
        multiple_choice_answer: {
          ...this.state.multiple_choice_answer,
          [index]: {
            ...this.state.multiple_choice_answer[index],
            [answer]: null,
          },
        },
      });
    } else {
      this.setState({
        multiple_choice_answer: {
          ...this.state.multiple_choice_answer,
          [index]: {
            ...this.state.multiple_choice_answer[index],
            [answer]: answer,
          },
        },
      });
    }

    setTimeout(() => {
      this.conditionforConfirmingFunction()
      if (this.props?.navigation?.state?.params.isItFromQuizExamMOdal == true) {
        let obj = this.state?.multiple_choice_answer?.[index]
        var length = Object.keys(obj).length;
        let count = 0
        for (let x in obj) {
          if (obj[x]) {
            count++
          }
        }
        if (count >= 1) {
          this.setState({ shouldComfirmationButtonBeVisible: true });

        }
        else {
          this.setState({ shouldComfirmationButtonBeVisible: false });

        }

      }

    })

  };

  functionResponsibleForHandlingRadiobuttonQuestion = (
    answer: any,
    index: any
  ) => {
    this.setState({
      radio_button_answer: {
        ...this.state.radio_button_answer,
        [index]: { answer: answer },
      },
    });

    setTimeout(() => {
      this.conditionforConfirmingFunction()
      if (this.props?.navigation?.state?.params.isItFromQuizExamMOdal == true) {
        this.setState({ shouldComfirmationButtonBeVisible: true });
      }


    })
  };

  extractOptions = (data: any) => {
    let obj = data.attributes;
    let optionsarray = [];
    for (let key in obj) {
      if (key.includes("option_")) {
        optionsarray.push(obj[key]);
      }
    }

    optionsarray = optionsarray.filter((e: any) => {
      return e !== ""
    })

    return optionsarray;
  };

  myFieldConfirmBtn = (myarr: any) => {
    const myFieldArray = myarr.filter((x: any) => x !== "").length
    if (myarr.length == myFieldArray) {
      return this.setState({ shouldComfirmationButtonBeVisible: true });

    }
  }

  functionResposibleforschema = (
    index: any,
    value: any,
    questionindex: any
  ) => {
    let myarr = this.state.short_text_and_schema_answer[questionindex];
    console.log(index, value, "insodeee");
    myarr[index] = value;
    this.setState({
      short_text_and_schema_answer: {
        ...this.state.short_text_and_schema_answer,
        [questionindex]: myarr,
      },
    });
    console.log(
      this.state.short_text_and_schema_answer[questionindex],
      "--------AO"
    );


    setTimeout(() => {
      this.conditionforConfirmingFunction()
      if (this.props?.navigation?.state?.params.isItFromQuizExamMOdal == true) {
        this.myFieldConfirmBtn(myarr)
      }

    })

  };

  getQuizzeExamStatus = async () => {

    console.log("this.state @@ &&", this.state.quizThemeId, "hvdhjasvd")
    // return
    this.quizzeExamStatusApiCallId = await this.apiCall({
      contentType: "application/json",
      method: "GET",
      endPoint: configJSON.getQuizzeExamStatusApiEndPoint,

    });
  };

  functionforCheckingIfboxanswerisCorrect(
    ele: any,
    questionindex: any,
    normalindex: any
  ) {
    let arr = this.state.multiple_choice_answer[questionindex];
    if (arr[normalindex] == "") {
      return "notfound";
    }
    if (arr[normalindex] == ele) {
      return "yes";
    } else {
      return "no";
    }
  }

  SchemaBasedMountFunction = async (index: any, length: any) => {
    if (this.props?.navigation?.state?.params.isItFromQuizExamMOdal == true && this.state.isitinthehorizontalresultopage) {
      return
    }
    setTimeout(() => {
      this.setState({
        short_text_and_schema_answer: {
          ...this.state.short_text_and_schema_answer,
          [index]: Array(length).fill("")
        },
      }, () => {
        // console.log('i am running here and here', this.state.short_text_and_schema_answer, index, length)

      })

    });

  }

  optionsArrrayForreArrange = (data: any, questionIndex: any) => {
    if (this.props?.navigation?.state?.params.isItFromQuizExamMOdal == true && this.state.equilibriumcount !== 0) {
      return
    }
    let optionsarray = this.extractOptions(data);
 this.shuffleArray(optionsarray)
    setTimeout(() => {

      this.setState({
        rearrange_order_answer: {
          ...this.state.rearrange_order_answer,
          [questionIndex]: optionsarray,
        },
      });
    })

  };

  returnborderColorforschema = (
    ele: any,
    index: any,
    questionIndex: any,
    answer: any
  ) => {
    console.log(
      this.state.short_text_and_schema_answer[questionIndex][index],
      "bordercolor function"
    );
    if (
      this.state.short_text_and_schema_answer[questionIndex][
        index
      ].toLowerCase() == answer[index].toLowerCase()
    ) {
      return COLORS.success;
    } else {
      return COLORS.red;
    }
  };
  returnborderColorRearrrange = (
    ele: any,
    index: any,
    questionIndex: any,
    answer: any
  ) => {
    console.log(
      this.state.short_text_and_schema_answer[questionIndex][index],
      "bordercolor function"
    );
    if (
      this.state.rearrange_order_answer[questionIndex][index].toLowerCase() ==
      answer[index].toLowerCase()
    ) {
      return "green";
    } else {
      return "red";
    }
  };

  copyTotrialcopyBoard = (value: string) => {
    console.log(value, "checking trial board value");
    this.setState({ trialCopyBoard: value });
  };

  pairExamdidmountfunction = (questionIndex: any) => {
    if (this.props?.navigation?.state?.params.isItFromQuizExamMOdal == true && this.state.equilibriumcount !== 0) {
      return
    }
    let obj = this.state.mockexamdata[questionIndex];
    console.log(obj, "checking inpair mouting")
    let abc = obj?.attributes?.is_correct
    let myoptions = this.extractOptions(obj);
    this.shuffleArray(myoptions)


    setTimeout(() => {

      this.setState({
        pair_answer: {
          ...this.state.pair_answer,
          [questionIndex]: Array(abc.length).fill(""),
        },
        pairextracteddata: myoptions,
      });
    })

  };

   shuffleArray(array:any) {
    for (let i = array.length - 1; i > 0; i--) {
      // Generate a random index between 0 and i (inclusive)
      const j = Math.floor(Math.random() * (i + 1));
  
      // Swap elements at i and j
      [array[i], array[j]] = [array[j], array[i]];
    }
  }


  functionResponsibleForAddingClipboardDataToSlots = (
    elem: any,
    index: any,
    questionIndex: any
  ) => {
    let myarr = this.state?.pair_answer[questionIndex] || [];

    myarr[index] = this.state?.trialCopyBoard;
    console.log(myarr, "i am inside core clipdata");

    this.setState({
      pair_answer: { ...this.state.pair_answer, [questionIndex]: myarr }, trialCopyBoard: ""
    });



    setTimeout(() => {
      this.conditionforConfirmingFunction()
      if (this.props?.navigation?.state?.params.isItFromQuizExamMOdal == true) {
        this.myFieldConfirmBtn(myarr)
      }


    })

  };

  conditionforConfirmingFunction = () => {

    let multipleChoiceAnswersCount = 0;
    let radioButtonAnswersCount = 0;
    let pairQuestionCount = 0;
    let SchemeBasedquestionCount = 0;
    let rearrangeBasedQuestioncount = 0;

    let multpleChoiceCheckingCount = 0;
    let radioButtonCheckingCount = 0;
    let pairQuestionCheckingCount = 0;
    let schemaBasedCheckingCount = 0;
    let rearrangeBasedCheckingQuestion = 0;

    let mockdata = this.state.mockexamdata


    for (let i = 0; i < mockdata.length; i++) {
      if (mockdata[i]?.attributes?.question_type == "rearrange_order") {
        rearrangeBasedQuestioncount++
      }
      else if (mockdata[i]?.attributes?.question_type == "multiple_choice") {
        multipleChoiceAnswersCount++
      }
      else if (mockdata[i]?.attributes?.question_type == "pair") {
        pairQuestionCount = pairQuestionCount + mockdata[i]?.attributes?.is_correct?.length
      }
      else if (mockdata[i]?.attributes?.question_type == "radio_button") {
        radioButtonAnswersCount++
      }
      else if (mockdata[i]?.attributes?.question_type == "short_text_and_schema") {
        SchemeBasedquestionCount = SchemeBasedquestionCount + mockdata[i]?.attributes?.is_correct?.length
      }
    }

    console.log(multipleChoiceAnswersCount
      , radioButtonAnswersCount,
      pairQuestionCount,
      SchemeBasedquestionCount,
      rearrangeBasedQuestioncount, mockdata, "count of allll")


    let multipleChoice = this.state.multiple_choice_answer;

    for (let x in multipleChoice) {
      let insideMultiple = multipleChoice[x]
      for (let y in insideMultiple) {
        // let isThisquestionAnswered=false
        if (insideMultiple[y]) {
          multpleChoiceCheckingCount++
          break;
        }
      }
    }


    let radioButton = this?.state?.radio_button_answer

    for (let x in radioButton) {
      let innerObj = radioButton[x]
      for (let y in innerObj) {
        if (innerObj[y]) {
          radioButtonCheckingCount++
          break;
        }
      }
    }

    let pairanswer = this.state.pair_answer
    for (let x in pairanswer) {
      let innerArray = pairanswer[x]

      for (let i = 0; i < innerArray.length; i++) {
        if (innerArray[i] !== "") {
          pairQuestionCheckingCount++
        }
      }
      console.log("777777---", pairQuestionCheckingCount)


      console.log("checking the new -----", pairQuestionCheckingCount, mockdata[x].attributes.is_correct, x)

    }

    let shortAnswerSchema = this.state.short_text_and_schema_answer
    for (let x in shortAnswerSchema) {
      let innerArray = shortAnswerSchema[x]

      for (let i = 0; i < innerArray.length; i++) {
        if (innerArray[i] !== "") {
          schemaBasedCheckingCount++

        }
      }
    }



    if (multipleChoiceAnswersCount !== multpleChoiceCheckingCount || radioButtonAnswersCount !== radioButtonCheckingCount || pairQuestionCount !== pairQuestionCheckingCount || SchemeBasedquestionCount !== schemaBasedCheckingCount) {
      console.log("i am returningg", pairQuestionCount, pairQuestionCheckingCount, pairQuestionCheckingCount, schemaBasedCheckingCount)


      this.setState({ shouldComfirmationButtonBeVisible: false })
      return
    }

    console.log(multpleChoiceCheckingCount, radioButtonCheckingCount, pairQuestionCheckingCount, "checking ciunt of mine")

    this.setState({ shouldComfirmationButtonBeVisible: true });
    console.log(this.state, "i am checking inside the commmand");


  };

  restartButtonPressFunction = () => {


    this.ApicallforRestart()

    this.setState({
      componentRerenderkey: this.state.componentRerenderkey + 1,
      isConfirmButtonPressed: false,
      radio_button_answer: {},
      multiple_choice_answer: {},
      shouldComfirmationButtonBeVisible: false
    });
  };

  checkConfirmQuestion = async (id: any) => {
    console.log("checking what is happening in quizzees", id)
    TheFinalQuizArrayforAnswers.push(id)
    await setAsyncData("QuizExamArray", JSON.stringify(TheFinalQuizArrayforAnswers))
    this.quizzeExamCheckConfirmApiCallId = await this.apiCall({
      contentType: "application/json",
      method: "GET",
      endPoint: `bx_block_quiz_and_mock_exams/quiz_and_mock_exam/confirm_question?id=${id}`,

    });
  }


  conditionforNextFunction = async () => {

    if (this.state.equilibriumcount == 0) {
      this.setState({ isItontheEdge: true })
    }
    else {
      this.setState({ isItontheEdge: false })

    }

    if (this.state.mockexamdata.length - 1 == this.state.quiz_page_index) {
      this.setState({ amIinresultopage: true })
    }


    console.log("this.state.mockexamdata @@")
    // console.log("this.state.mockexamdata.length @@", this.state.mockexamdata)

    let multipleChoiceAnswersCount = 0;
    let radioButtonAnswersCount = 0;
    let pairQuestionCount = 0;
    let SchemeBasedquestionCount = 0;
    let rearrangeBasedQuestioncount = 0;

    let multpleChoiceCheckingCount = 0;
    let radioButtonCheckingCount = 0;
    let pairQuestionCheckingCount = 0;
    let schemaBasedCheckingCount = 0;
    let rearrangeBasedCheckingQuestion = 0;

    let mockdata = this.state.mockexamdata

    let quizExamData = this.state?.mockexamdata[this.state.quiz_page_index]
    console.log("quizExamName @", quizExamData)
    if (quizExamData?.attributes?.question_type == "short_text_and_schema") {
      let shortAnswerSchema = this.state.short_text_and_schema_answer
      for (let x in shortAnswerSchema) {
        let innerArray = shortAnswerSchema[x]
        SchemeBasedquestionCount = innerArray.length
        for (let i = 0; i < innerArray.length; i++) {
          if (innerArray[i] !== "") {
            schemaBasedCheckingCount++
          }
        }
      }
    } else if (quizExamData?.attributes?.question_type == "rearrange_order") {
      rearrangeBasedCheckingQuestion++
    } else if (quizExamData?.attributes?.question_type == "pair") {
      let pairanswer = this.state.pair_answer
      for (let x in pairanswer) {
        let innerArray = pairanswer[x]
        pairQuestionCount = innerArray.length
        for (let i = 0; i < innerArray.length; i++) {
          if (innerArray[i] !== "") {
            pairQuestionCheckingCount++
          }
        }
      }
    } else if (quizExamData?.attributes?.question_type == "multiple_choice") {
      multipleChoiceAnswersCount++
      let multipleChoice = this.state.multiple_choice_answer;

      for (let x in multipleChoice) {
        let insideMultiple = multipleChoice[x]
        for (let y in insideMultiple) {
          // let isThisquestionAnswered=false
          if (insideMultiple[y]) {
            multpleChoiceCheckingCount = 1
            break;
          }
        }
      }

    } else if (quizExamData?.attributes?.question_type == "radio_button") {

      console.log("checking the radio issue before", quizExamData?.attributes?.question_type, radioButtonAnswersCount)
      radioButtonAnswersCount = radioButtonAnswersCount + 1
      console.log("checking the radio issue", quizExamData?.attributes?.question_type, radioButtonAnswersCount)
      let radioButton = this?.state?.radio_button_answer

      for (let x in radioButton) {
        let innerObj = radioButton[x]
        for (let y in innerObj) {
          if (innerObj[y]) {
            radioButtonCheckingCount = 1
            break;
          }
        }
      }
    }

    console.log("schemaBasedCheckingCount @", SchemeBasedquestionCount, schemaBasedCheckingCount)

    if (multipleChoiceAnswersCount !== multpleChoiceCheckingCount || radioButtonAnswersCount !== radioButtonCheckingCount || pairQuestionCount !== pairQuestionCheckingCount || SchemeBasedquestionCount !== schemaBasedCheckingCount) {
      this.setState({ shouldComfirmationButtonBeVisible: false })
      return
    }
    //  this.checkConfirmQuestion(quizExamData.id)
    this.functionresposibleforQuizzespoint()
    this.ApicallforRightAnswerUpdate([], [], true)
    // this.setState({ isConfirmButtonPressed: true });
    // this.setState({ shouldComfirmationButtonBeVisible: false });
    this.setState({ resultModalVisible: true, isConfirmButtonPressed: true });
  }

  nextButtonPressFunction = () => {
    if (this.state.quiz_page_index == this.state.mockexamdata.length - 1) {
      this.setState({ isConfirmButtonPressed: true, isItontheEdge: false, amIinresultopage: true })
      this.setState({ shouldComfirmationButtonBeVisible: false })

      if (this.state.amIinresultopage) {
        this.setState({ amIinresultopage: false, isitinthehorizontalresultopage: true, modalShowforquizzes: true, isItthepeak: true })
      }
      return
    }





    let lastIndex = this.state.mockexamdata.length - 1
    if (lastIndex === this.state?.quiz_page_index) {
      // this.props.navigation.goBack()
      return
      this.props.navigation.navigate('OverView', { quizexamDetailsFromThemesScreen: '' })
    } else {
      this.setState({ isConfirmButtonPressed: false, isItontheEdge: false })
      this.setState({ shouldComfirmationButtonBeVisible: false })
      this.setState({ quiz_page_index: this.state?.quiz_page_index + 1 })
      this.setState({
        // componentRerenderkey: this.state.componentRerenderkey + 1,
        isConfirmButtonPressed: false,
        //  radio_button_answer: {},
        // multiple_choice_answer: {},
        // short_text_and_schema_answer: {},
        // pair_answer: {},
      });
    }
  }


  functionresposibleforQuizzespoint() {

    console.log("i am running in points")
    let TheFinalArrayforAnswers = []
    let mockdata = Array(this.state.mockexamdata.length).fill({})
    mockdata[this.state.quiz_page_index] = this.state.mockexamdata[this.state.quiz_page_index]
    for (let i = 0; i < mockdata.length; i++) {
      if (mockdata[i]?.attributes?.question_type == "multiple_choice") {
        let writtenAnswers = this.state.multiple_choice_answer[i]
        let actualAnswers = mockdata[i].attributes?.is_correct
        let myformedArray = []

        for (let x in writtenAnswers) {
          if (writtenAnswers[x]) {
            myformedArray.push(writtenAnswers[x])
          }
        }

        if (actualAnswers.length === myformedArray.length) {
          for (var k = 0; k < actualAnswers.length; k++) {
            if (actualAnswers[k] !== myformedArray[k]) {
              break
            }
          }
          console.log("yes i can codee-----", actualAnswers, myformedArray)

          if (k == actualAnswers.length) {
            TheFinalArrayforAnswers.push(mockdata[i].id)
          }
        }
        // this.conditionforNextFunction()
        if (this.props?.navigation?.state?.params.isItFromQuizExamMOdal == true) {

          break

        }

      }

      if (mockdata[i]?.attributes?.question_type == "radio_button") {
        let writtenAnswers = this.state.radio_button_answer[i]
        let actualAnswers = mockdata[i].attributes?.is_correct
        let myformedArray = []

        for (let x in writtenAnswers) {
          if (writtenAnswers[x]) {
            myformedArray.push(writtenAnswers[x])
          }
        }
        console.log("checking the answers for radio button", actualAnswers, writtenAnswers, myformedArray)

        // for (var k = 0; k < actualAnswers.length; k++) {
        //   if (actualAnswers[k] !== myformedArray[k]) {
        //     break
        //   }
        // }

        // if (k == actualAnswers.length) {
        //   TheFinalArrayforAnswers.push(mockdata[i].id)
        // }

        if (actualAnswers[0] == myformedArray[0]) {
          TheFinalArrayforAnswers.push(mockdata[i].id)
        }

        if (this.props?.navigation?.state?.params.isItFromQuizExamMOdal == true) {

          break

        }

      }

      if (mockdata[i]?.attributes?.question_type == "pair") {
        let writtenAnswers = this.state.pair_answer[i]
        let actualAnswers = mockdata[i].attributes?.is_correct
        let myformedArray = writtenAnswers
        //  console.log("yes i can codee")
        //  for(let x in writtenAnswers)
        //  {
        //   if(writtenAnswers[x])
        //   {
        //     myformedArray.push(writtenAnswers[x])
        //   }
        //  }
        for (var k = 0; k < actualAnswers.length; k++) {
          if (actualAnswers[k] !== myformedArray[k]) {
            break
          }
        }

        if (k == actualAnswers.length) {
          TheFinalArrayforAnswers.push(mockdata[i].id)
        }
        if (this.props?.navigation?.state?.params.isItFromQuizExamMOdal == true) {

          break

        }
      }
      if (mockdata[i]?.attributes?.question_type == "short_text_and_schema") {
        let writtenAnswers = this.state.short_text_and_schema_answer[i]
        let actualAnswers = mockdata[i].attributes?.is_correct
        let myformedArray = writtenAnswers
        //  console.log("yes i can codee")
        //  for(let x in writtenAnswers)
        //  {
        //   if(writtenAnswers[x])
        //   {
        //     myformedArray.push(writtenAnswers[x])
        //   }
        //  }
        for (var k = 0; k < actualAnswers.length; k++) {
          if (actualAnswers[k] !== myformedArray[k]) {
            break
          }
        }

        console.log("yes i can codee", actualAnswers, myformedArray)

        if (k == actualAnswers.length) {
          TheFinalArrayforAnswers.push(mockdata[i].id)
        }
        if (this.props?.navigation?.state?.params.isItFromQuizExamMOdal == true) {

          break

        }
      }

      if (mockdata[i]?.attributes?.question_type == "rearrange_order") {
        let writtenAnswers = this.state.rearrange_order_answer[i]
        let actualAnswers = mockdata[i].attributes?.is_correct
        let myformedArray = writtenAnswers
        //  console.log("yes i can codee")
        //  for(let x in writtenAnswers)
        //  {
        //   if(writtenAnswers[x])
        //   {
        //     myformedArray.push(writtenAnswers[x])
        //   }
        //  }

        console.log('------------------lllll', myformedArray)
        for (var k = 0; k < actualAnswers.length; k++) {
          if (actualAnswers[k] !== myformedArray[k]) {
            break
          }
        }


        if (k == actualAnswers.length) {
          TheFinalArrayforAnswers.push(mockdata[i].id)
        }
        if (this.props?.navigation?.state?.params.isItFromQuizExamMOdal == true) {

          break

        }
      }

    }
    console.log("yes i can codee", TheFinalArrayforAnswers)





    this.setState({ quizexamRightanssObject: { ...this.state.quizexamRightanssObject, [this.state.quiz_page_index]: TheFinalArrayforAnswers[0] } })



    setTimeout(() => {
      let rightAnswerlength = 0
      for (let x in this.state.quizexamRightanssObject) {
        if (this.state.quizexamRightanssObject[x]) {
          rightAnswerlength++
        }
      }


      console.log("i am checking right answers length2", rightAnswerlength, this.state.quizexamRightanssObject)

      let wrongAnswerlength = this.state.mockexamdata.length - rightAnswerlength

      let totalpercentage = (rightAnswerlength / this.state.mockexamdata.length) * 100
      let thecommentString = "";
      let theSubcommentString = ""
      let progressColor = COLORS.lightRed
      let pointsText = ""

      console.log(totalpercentage, "checking this thing out")

      if (totalpercentage < 70) {
        progressColor = COLORS.lightRed
        thecommentString = "NiceTry"
        theSubcommentString = "ImproveYourScoreByReviewingLessonsAndFlashcards"
        pointsText = COLORS.lightRed
      }
      else if (totalpercentage > 70 && totalpercentage < 100) {
        progressColor = COLORS.success
        thecommentString = "GreatJob"
        theSubcommentString = "ReviewYourQuizResultsToSeeWhatCanBeImproved"
        pointsText = COLORS.success

      }
      else if (totalpercentage == 100) {
        progressColor = COLORS.success
        thecommentString = "Perfect!"
        theSubcommentString = "YouveMasteredThisConcept"
        pointsText = COLORS.white
      }

      console.log("i am bout to open the model")

      this.setState({
        resultModalVisible: true,
        Circularprogresswidth: 200,
        CircularprogressfillColor: rightAnswerlength === this.state.mockexamdata.length ? 'rgb(109,197,150)' : COLORS.white,
        Circularprogresspointscolor: pointsText,
        CircularprogresstextColor: rightAnswerlength === this.state.mockexamdata.length ? COLORS.white : COLORS.lightGray,
        Circularprogresspointstext: rightAnswerlength,
        Circularprogresstotlatext: this.state.mockexamdata.length,
        ResultModalPointsText: thecommentString,
        ResultModalPointsSubtest: theSubcommentString,
        CircularprogressprogressColor: progressColor,
        Progresspercentage: totalpercentage,
        writeAnswerCount: rightAnswerlength,
        WrongAnsercount: wrongAnswerlength
      })
    })



  }




  functionResponsibleforMockexamPoints() {
    console.log("i am running in points")
    let TheFinalArrayforAnswers = []
    let mockdata = this.state.mockexamdata
    for (let i = 0; i < mockdata.length; i++) {
      if (mockdata[i]?.attributes?.question_type == "multiple_choice") {
        let writtenAnswers = this.state.multiple_choice_answer[i]
        let actualAnswers = mockdata[i].attributes?.is_correct
        let myformedArray = []

        for (let x in writtenAnswers) {
          if (writtenAnswers[x]) {
            myformedArray.push(writtenAnswers[x])
          }
        }

        if (actualAnswers.length === myformedArray.length) {


          for (var k = 0; k < actualAnswers.length; k++) {
            if (actualAnswers[k] !== myformedArray[k]) {
              break
            }
          }
          console.log("yes i can codee-----", actualAnswers, myformedArray)

          if (k == actualAnswers.length) {
            TheFinalArrayforAnswers.push(mockdata[i].id)
          }
        }
        // this.conditionforNextFunction()
        if (this.props?.navigation?.state?.params.isItFromQuizExamMOdal == true) {

          break

        }

      }

      if (mockdata[i]?.attributes?.question_type == "radio_button") {
        let writtenAnswers = this.state.radio_button_answer[i]
        let actualAnswers = mockdata[i].attributes?.is_correct
        let myformedArray = []

        for (let x in writtenAnswers) {
          if (writtenAnswers[x]) {
            myformedArray.push(writtenAnswers[x])
          }
        }
        console.log("checking the answers for radio button", actualAnswers, writtenAnswers, myformedArray)

        // for (var k = 0; k < actualAnswers.length; k++) {
        //   if (actualAnswers[k] !== myformedArray[k]) {
        //     break
        //   }
        // }

        // if (k == actualAnswers.length) {
        //   TheFinalArrayforAnswers.push(mockdata[i].id)
        // }

        if (actualAnswers[0] == myformedArray[0]) {
          TheFinalArrayforAnswers.push(mockdata[i].id)
        }

        if (this.props?.navigation?.state?.params.isItFromQuizExamMOdal == true) {

          break

        }

      }

      if (mockdata[i]?.attributes?.question_type == "pair") {
        let writtenAnswers = this.state.pair_answer[i]
        let actualAnswers = mockdata[i].attributes?.is_correct
        let myformedArray = writtenAnswers
        //  console.log("yes i can codee")
        //  for(let x in writtenAnswers)
        //  {
        //   if(writtenAnswers[x])
        //   {
        //     myformedArray.push(writtenAnswers[x])
        //   }
        //  }
        for (var k = 0; k < actualAnswers.length; k++) {
          if (actualAnswers[k] !== myformedArray[k]) {
            break
          }
        }

        if (k == actualAnswers.length) {
          TheFinalArrayforAnswers.push(mockdata[i].id)
        }
        if (this.props?.navigation?.state?.params.isItFromQuizExamMOdal == true) {

          break

        }
      }
      if (mockdata[i]?.attributes?.question_type == "short_text_and_schema") {
        let writtenAnswers = this.state.short_text_and_schema_answer[i]
        let actualAnswers = mockdata[i].attributes?.is_correct
        let myformedArray = writtenAnswers
        //  console.log("yes i can codee")
        //  for(let x in writtenAnswers)
        //  {
        //   if(writtenAnswers[x])
        //   {
        //     myformedArray.push(writtenAnswers[x])
        //   }
        //  }
        for (var k = 0; k < actualAnswers.length; k++) {
          if (actualAnswers[k] !== myformedArray[k]) {
            break
          }
        }

        console.log("yes i can codee", actualAnswers, myformedArray)

        if (k == actualAnswers.length) {
          TheFinalArrayforAnswers.push(mockdata[i].id)
        }
        if (this.props?.navigation?.state?.params.isItFromQuizExamMOdal == true) {

          break

        }
      }

      if (mockdata[i]?.attributes?.question_type == "rearrange_order") {
        let writtenAnswers = this.state.rearrange_order_answer[i]
        let actualAnswers = mockdata[i].attributes?.is_correct
        let myformedArray = writtenAnswers
        //  console.log("yes i can codee")
        //  for(let x in writtenAnswers)
        //  {
        //   if(writtenAnswers[x])
        //   {
        //     myformedArray.push(writtenAnswers[x])
        //   }
        //  }
        for (var k = 0; k < actualAnswers.length; k++) {
          if (actualAnswers[k] !== myformedArray[k]) {
            break
          }
        }


        if (k == actualAnswers.length) {
          TheFinalArrayforAnswers.push(mockdata[i].id)
        }
        if (this.props?.navigation?.state?.params.isItFromQuizExamMOdal == true) {

          break

        }
      }
      console.log("yes i can codee", TheFinalArrayforAnswers)

    }
    console.log("yes i can codee", 'end of the lop')


    let wronganswers: any = []
    for (let i = 0; i < this.state.mockexamdata.length; i++) {
      if (!TheFinalArrayforAnswers.includes(this.state.mockexamdata[i]?.id)) {
        wronganswers.push(this.state.mockexamdata[i]?.id)
      }
    }


    let totalpercentage = (TheFinalArrayforAnswers.length / this.state.mockexamdata.length) * 100
    let thecommentString = "";
    let theSubcommentString = ""
    let progressColor = COLORS.lightRed
    let pointsText = ""

    console.log(totalpercentage, "checking this thing out")

    if (totalpercentage < 70) {
      progressColor = COLORS.lightRed
      thecommentString = "NiceTry"
      theSubcommentString = "ImproveYourScoreByReviewingLessonsAndFlashcards"
      pointsText = COLORS.lightRed
    }
    else if (totalpercentage > 70 && totalpercentage < 100) {
      progressColor = COLORS.success
      thecommentString = "GreatJob"
      theSubcommentString = "ReviewYourQuizResultsToSeeWhatCanBeImproved"
      pointsText = COLORS.success

    }
    else if (totalpercentage == 100) {
      progressColor = COLORS.success
      thecommentString = "Perfect!"
      theSubcommentString = "YouveMasteredThisConcept"
      pointsText = COLORS.white

    }

    console.log("i am bout to open the model")

    this.setState({
      resultModalVisible: true,
      Circularprogresswidth: 200,
      CircularprogressfillColor: TheFinalArrayforAnswers.length === this.state.mockexamdata.length ? 'rgb(109,197,150)' : COLORS.white,
      Circularprogresspointscolor: pointsText,
      CircularprogresstextColor: TheFinalArrayforAnswers.length === this.state.mockexamdata.length ? COLORS.white : COLORS.lightGray,
      Circularprogresspointstext: TheFinalArrayforAnswers.length,
      Circularprogresstotlatext: this.state.mockexamdata.length,
      ResultModalPointsText: thecommentString,
      ResultModalPointsSubtest: theSubcommentString,
      CircularprogressprogressColor: progressColor,
      Progresspercentage: totalpercentage,
      writeAnswerCount: TheFinalArrayforAnswers.length,
      WrongAnsercount: wronganswers.length
    }, () => this.setState({ isConfirmButtonPressed: true }))
    this.ApicallforRightAnswerUpdate(TheFinalArrayforAnswers, wronganswers, false)
  }



  theFunctionResponsibleFormakingConfirmationbuttonTrue = () => {
    this.functionResponsibleforMockexamPoints()

  }

  apicallForMakingmockexamcurrent = async (mockexamorquizId: any) => {
    console.log("=========== apicallForMakingmockexamcurrent", mockexamorquizId)
    let thebody = {
      id: mockexamorquizId,
    }

    this.apicallForMakingmockexamcurrentID = await this.apiCall({
      contentType: "application/json",
      method: "Post",
      endPoint: `bx_block_quiz_and_mock_exams/quiz_and_mock_exam/start_quiz_and_mock_exam`,
      body: thebody
    });
    console.log("i am calling-----", thebody)

    // for offline apicall

    if (this.state.isoFFline) {
      let myarg = {
        contentType: "application/json",
        method: "Post",
        endPoint: `bx_block_quiz_and_mock_exams/quiz_and_mock_exam/start_quiz_and_mock_exam`,
        body: thebody
      }
      // let allOfflineData = await getAsyncDataKeys('API_ARRAY_FOR_OFFLINE')

      // allOfflineData.push(myarg)
      let allOfflineData = this.props.offlineState?.offlineAPIs;
      allOfflineData.push(myarg);
      this.props.addOfflineAPis(allOfflineData);
      // await setAsyncData("API_ARRAY_FOR_OFFLINE", allOfflineData)

    }


    // for offline apicall
  }


  ApicallforRestart = async () => {
    let myarr = []
    for (let i = 0; i < this.state.mockexamdata.length; i++) {
      myarr.push(this.state.mockexamdata[i]?.id)
    }

    console.log("checking array of ids in restart", myarr)
    let thebody = {
      ids: myarr,
      type: 'reset'
    }
    this.ApicallforRestartID = await this.apiCall({
      contentType: "application/json",
      method: "Post",
      endPoint: `bx_block_quiz_and_mock_exams/quiz_and_mock_exam/confirm_and_reset`,
      body: thebody
    });
  };



  functionForClosingResultModal = () => {
    this.setState({ resultModalVisible: false, modalShowforquizzes: false })
  }

  functionWhenclickedonReviewMockexam = () => {
    this.setState({ resultModalVisible: false, isConfirmButtonPressed: true })
    this.scrollViewRef.scrollTo({ x: 0, y: 0, animated: true })
  }
  functionForgoingBack = () => {
    this.props.navigation.navigate('OverView', { course_id: this.props?.navigation?.state?.params?.course_id, congoMockQuiz: true })
  }


  nextButtoncoditionForQuizzesForBackAndForth = () => {

    if (this.state.travelledpath.includes(this.state.mockexamdata[this.state.quiz_page_index].id)) {
      this.setState({ isConfirmButtonPressed: true })
    }
    else {



    }

  }


  // functionTohandleComgo=async(respose:any)=>{

  //   let stringifiedCongo= await AsyncStorage.getItem("CONGRATULATIONS")
  //   let congo=JSON.parse(stringifiedCongo)

  // let courseID= this.props?.navigation?.state?.params?.course_id

  // console.log(respose,"00000011111122222")



  // if(congo[courseID])
  // {
  //   // delete congo[courseID]
  //   if(respose.course_status=="complete")
  //   {
  // delete congo[courseID]
  //  await AsyncStorage.setItem("CONGRATULATIONS",JSON.stringify(congo) )

  //  this.props.navigation.navigate("Congratulation", { course_id: courseID })
  //   }
  // }
  // }


  returnBackgroundColorPair = (ele, index) => {


    let pairArray = this.state.pair_answer[index]

    console.log("this.state.trialCopyBoard", this.state.pair_answer, ele, index, this.state.trialCopyBoard)


    if (!pairArray) {
      return
    }

    setTimeout(() => {


      if (pairArray.includes(ele)) {
        console.log("this.state.trialCopyBoard2")
        this.setState({ pairBackgroundColor: "#ECF1F4" })
      }
      if (ele == this.state.trialCopyBoard) {
        console.log("this.state.trialCopyBoard1", this.state.pair_answer, "ele", ele, "index", index, "this.state.trialCopyBoard", this.state.trialCopyBoard)
        this.setState({ pairBackgroundColor: "#485579" })
      }
      else {
        console.log("this.state.trialCopyBoard3")

        this.setState({ pairBackgroundColor: COLORS.white })
        return
      }

    })



  }


  
}
// Customizable Area End
