// Customizable Area Start
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";


import { isConnected } from "../../../mobile/src/utils/internetConnection";
import { CONTENT_SOURCE } from "../../../framework/src/config";
import { loadFlashcardsRevealList } from "./content/firestoreRepository";

export const configJSON = require("./config");

export interface Props {
  
  navigation: any;
  id: string;
  offlineState: any;
  subscriptionState: any;
  addOfflineData: (val: any) => void;
  updateOfflineStatus: (val: any) => void;
  addOfflineAPis: (val: any) => void;
  updateOfflineData: (val: any) => void;
  loadingOfflineData: (val: any) => void;

  
}

interface S {
  

  user_token: any;
  cardId: any;
  flashCardID: any
  flashdata: any;
  flashCardData: any;
  swiperIndex: any;
  isSelect: boolean;
  userFlashCardId: any,
  isLoading: boolean;
  userFlashCardIdForreward: any;
  typeOfselectedFlashcard: any;
  currentRating: any,
  flashCardseelctedCount: any;
  previousStack: any
  previousindex: any,
  nextActive: any,
  backupFlascardData: any,
  mounted: boolean,
  nextIndex: any,
  previousActive: any,
  topData: any,
  infomodalVisible: any,
  isAllflashcardcompleted: boolean,
  allhavefiverating: any,
  nonratedflasharray: any
  
}

interface SS {
  
  id: any;

  
}

export default class CfFlashCardOneController extends BlockComponent<
  Props,
  S,
  SS
> {
  

  flashcardReavealAnswerApiCallId: any;
  nextFlashCardQuestionApiCallId: any;
  userRatingApiCallId: any;
  ratingRewardApiId: any;
  focusListener: any;
  topflashref: any = null;
  swiperRef: any = null;

  
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
      cardId: '',
      flashCardID: "",
      flashdata: [],
      flashCardData: "",
      swiperIndex: 0,
      isSelect: false,
      userFlashCardId: '',
      isLoading: false,
      userFlashCardIdForreward: '',
      typeOfselectedFlashcard: "theme",
      currentRating: '',
      flashCardseelctedCount: 0,
      previousStack: [],
      previousindex: 0,
      nextActive: false,
      backupFlascardData: [],
      mounted: false,
      nextIndex: 0,
      topData: [],
      infomodalVisible: false,
      isAllflashcardcompleted: false,
      allhavefiverating: false,
      nonratedflasharray: []
      
    };
    
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
    

  }

  
  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener("willFocus", async () => {

      let connectionStatus = await isConnected().then(response => response).catch(err => console.log(err))

      if (connectionStatus !== undefined) {
        console.log('@@@  rsvii =====@@@', this.props?.navigation?.state?.params)
        this.setState({ flashCardseelctedCount: this.props?.navigation?.state?.params?.flashCardseelctedCount }, () => {
          console.log("flash card newwee", this.state.flashCardseelctedCount)
        })
        this.getToken()
      }
      else {
        this.setState({ flashCardseelctedCount: this.props?.navigation?.state?.params?.flashCardseelctedCount }, () => {
          this.functionResposibleForOfflinedata()
        });
      }
    })

  }



  async getToken() {
    let token: any = await AsyncStorage.getItem('LOGIN_TOKEN')
    console.log("flashcard token check", token)
    this.setState({ user_token: token, flashCardID: this.props?.navigation?.state?.params?.flashCardID, cardId: this.props?.navigation?.state?.params?.cardId, typeOfselectedFlashcard: this.props?.navigation?.state?.params?.typeOfselectedFlashcard || "theme_id" }, () =>
      this.getFlashCard())
    console.log('@@@ isselect ======@@@', this.state, this.props)
    //this.send(msg);
  };

  functionResponsibleForMoveNext() {
    if (this.state.swiperIndex == this.state.flashdata?.length - 1) {
      this.setState({ swiperIndex: 0 })
    } else {
      this.setState({ swiperIndex: this.state.swiperIndex + 1 }, () => {
        if (this.state.swiperIndex === 0) {
          this.swiperRef.scrollBy(this.state.flashdata.length * -1);
        } else {
          this.swiperRef.scrollTo(this.state.swiperIndex);
        }
        this.state.flashdata?.map((_item: any, index: any) => {
          if (this.state.swiperIndex == index)
            return
        })
      })
    }
  }

  functionResposibleForOfflinedata = async () => {
    let allOfflineData = this.props.offlineState?.offlineData
    let params = this.props?.navigation?.state?.params
    let themeID = params.flashCardID
    let flashcardDatafiltered = []
    if (params?.typeOfselectedFlashcard == "theme_id") {
      flashcardDatafiltered = allOfflineData?.flash_cards?.data?.filter((elem: any) => {
        return elem?.attributes?.theme_id == themeID
      })

    }
    else if (params?.typeOfselectedFlashcard == "course_id") {
      flashcardDatafiltered = allOfflineData?.flash_cards?.data?.filter((elem: any) => {
        return elem?.attributes?.course_id == themeID
      })
    }

    this.flashcardReavealAnswerSuccessCallBack({data: flashcardDatafiltered})
  }


  async receive(from: string, message: Message) {
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
      // console.log("@@@@@@ errror ==", errorReponse)
      if (responseJson && !responseJson.errors) {
        if (apiRequestCallId === this.flashcardReavealAnswerApiCallId) {
          this.flashcardReavealAnswerSuccessCallBack(responseJson)
        }
        else if (apiRequestCallId === this.nextFlashCardQuestionApiCallId) {
          this.nextFlashCardQuestionSuccessCallBack(responseJson)
        }
        else if (apiRequestCallId === this.userRatingApiCallId) {
          this.userRatingSuccessCallBack(responseJson)
        }
        else if (apiRequestCallId === this.ratingRewardApiId) {
          this.rewardPointssuccesscallback(responseJson)
        }

      } else if (responseJson && responseJson.errors) {
        if (apiRequestCallId === this.flashcardReavealAnswerApiCallId) {
          this.flashcardReavealAnswerFailureCallBack(responseJson)
        }
        else if (apiRequestCallId === this.nextFlashCardQuestionApiCallId) {
          this.nextFlashCardQuestionFailureCallBack(responseJson)
        }
        else if (apiRequestCallId === this.userRatingApiCallId) {
          this.userRatingFailureCallBack(responseJson)
        }
        else if (apiRequestCallId === this.ratingRewardApiId) {
          this.rewardPointFailureCallback(responseJson)
        }
      } else if (errorReponse) {
        console.log('errorReponse', errorReponse)
      }
    }
  }

  checkflashcomplete = (data: any) => {


    for (let i = 0; i < data.length; i++) {
      if (data[i].attributes.rating == 0) {
        return false
      }
    }

    return true
  }


  checkifAllofthemhavefullrating = (data: any) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].attributes.rating != 5) {
        return false
      }
    }

    return true
  }

  findthenonratedones = (data: any) => {
    let myarr = []
    let realarray = []
    for (let i = 0; i < data.length; i++) {
      if (data[i].attributes.rating == 0) {
        myarr.push(data[i].id)
        realarray.push(data[i])
      }
    }
    return { myarr: myarr, realarray: realarray }
  }


  flashcardReavealAnswerSuccessCallBack = (responseJson: any) => {
    this.setState({ isLoading: false })
    console.log('@@@ flashcard Success CallBack =================', responseJson?.data)

    let mydata = responseJson?.data?.slice(0, this.state.flashCardseelctedCount)
    let topdata = responseJson?.data?.slice(0, this.state.flashCardseelctedCount)
    console.log(mydata, this.state.flashCardseelctedCount, "checking my logic")

    if (!this.state.nonratedflasharray[0] && !this.state.isAllflashcardcompleted) {
      let obj = this.findthenonratedones(mydata)
      this.setState({ nonratedflasharray: obj.myarr }, () => {
        let newdata = mydata.filter((e: any, index: any) => !obj.myarr.includes(e.id))
        mydata = [...obj.realarray, ...newdata]
      })

      //  console.log(mydata,"in the condition---")
    }

    if (this.checkflashcomplete(mydata)) {
      this.setState({ isAllflashcardcompleted: true },)
    }
    if (this.checkifAllofthemhavefullrating(mydata)) {
      this.setState({ allhavefiverating: true },)
    }

    this.setState({ topData: topdata, isLoading: false, flashdata: mydata }, () => {
      this.state.isAllflashcardcompleted && this.Rearrangetheflashcards()
    })
    // code to write falsh new feature



    // code to write falsh new feature


    // 
    //  this. functionTohandleComgo(responseJson)
    // this.nextFlashCardQuestion(responseJson?.data?.[0]?.id)
  };

  flashcardReavealAnswerFailureCallBack = (responseJson: any) => {
    this.setState({ isLoading: false })
    console.log('@@@ flashcard failure callBack =================', responseJson)
  };

  nextFlashCardQuestionSuccessCallBack = (responseJson: any) => {
    this.setState({ isLoading: false })
    console.log('@@@ nextFlashCardQuestion success CallBack =================', responseJson)
  };

  nextFlashCardQuestionFailureCallBack = (responseJson: any) => {
    this.setState({ isLoading: false })
    console.log('@@@ nextFlashCardQuestion failure callBack =================', responseJson)
  };

  userRatingSuccessCallBack = (responseJson: any) => {
    this.setState({ isLoading: false })
    console.log('@@@ userRating success CallBack =================', responseJson)
    this.setState({ isSelect: false, })
    !this.state.isAllflashcardcompleted && this.functionResponsibleForMoveNext()
    this.state.allhavefiverating && this.functionResponsibleForMoveNext()
    this.getFlashCard()

  };

  userRatingFailureCallBack = (responseJson: any) => {
    this.setState({ isLoading: false })
    console.log('@@@ userRating failure callBack =================', responseJson)
  };

  rewardPointssuccesscallback = (responseJson: any) => {
    console.log('@@@ userRating success callBack =================', responseJson)
  }

  rewardPointFailureCallback = (responseJson: any) => {
    console.log('@@@ userRating failure callBack =================', responseJson)
  }
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

  getFlashCard = async () => {
    if (CONTENT_SOURCE === 'firestore') {
      this.setState({ isLoading: true });
      try {
        const cid = String(this.state.flashCardID || '');
        const res = await loadFlashcardsRevealList(cid);
        this.flashcardReavealAnswerSuccessCallBack(res);
      } catch (e) {
        console.warn(e);
        this.setState({ isLoading: false });
      }
      return;
    }
    this.setState({ isLoading: true })
    this.flashcardReavealAnswerApiCallId = await this.apiCall({
      contentType: "application/json",
      method: "GET",
      endPoint: `bx_block_flash_cards/flash_cards/get_list?${this.state.typeOfselectedFlashcard}=${this.state.flashCardID}`,
    })

    // console.log("checking flash card list in flash", this.state.typeOfselectedFlashcard, this.state.flashCardID)
  }

  nextFlashCardQuestion = async (id: any) => {
    let connectionStatus = await isConnected().then(response => response).catch(err => console.log(err))

    this.setState({ isLoading: true })
    this.nextFlashCardQuestionApiCallId = await this.apiCall({
      contentType: "application/json",
      method: "GET",
      endPoint: `bx_block_flash_cards/flash_cards/next_flash_card?id=${id}`,
    })

    if (!connectionStatus) {
      this.setState({ isLoading: false })
      let myarg = {
        contentType: "application/json",
        method: "GET",
        endPoint: `bx_block_flash_cards/flash_cards/next_flash_card?id=${id}`,
      }
      let allOfflineData = this.props.offlineState?.offlineAPIs;
      allOfflineData.push(myarg);
      this.props.addOfflineAPis(allOfflineData);
      console.log(allOfflineData, 'checking the offline data in me')
      // let allOfflineData = await getAsyncDataKeys('API_ARRAY_FOR_OFFLINE')

      // allOfflineData.push(myarg)
      // console.log(allOfflineData, 'checking the offline data in me')
      // await setAsyncData("API_ARRAY_FOR_OFFLINE", allOfflineData)
    }
  }

  userRating = async (userFlashCardId: any, rating: any) => {
    if (CONTENT_SOURCE === 'firestore') {
      this.setState({ previousindex: 0, nextIndex: 0, isSelect: false });
      const updated = (this.state.flashdata || []).map((c: any) =>
        c.id === userFlashCardId
          ? { ...c, attributes: { ...c.attributes, rating } }
          : c,
      );
      this.setState({ flashdata: updated, isLoading: false }, () => {
        this.functionResponsibleForMoveNext();
      });
      return;
    }
    let connectionStatus = await isConnected().then(response => response).catch(err => console.log(err))
    this.setState({ previousindex: 0, nextIndex: 0 })
    let body = {
      id: userFlashCardId,
      rating: rating
    }

    if (!connectionStatus) {
      let myarg = {
        contentType: "application/json",
        method: "POST",
        endPoint: `bx_block_flash_cards/flash_cards/update_rating`,
        body: body
      }
      let allOfflineData = this.props.offlineState?.offlineAPIs;
      allOfflineData.push(myarg);
      this.props.addOfflineAPis(allOfflineData);
      this.setState({ isSelect: false })
      this.functionResponsibleForMoveNext()
    } else {
      this.setState({ isLoading: true })
      this.userRatingApiCallId = await this.apiCall({
        contentType: "application/json",
        method: "POST",
        endPoint: `bx_block_flash_cards/flash_cards/update_rating`,
        body: body
      })
    }

  }

  functionTohandleComgo = async (respose: any) => {

    let stringifiedCongo = await AsyncStorage.getItem("CONGRATULATIONS")
    let congo = JSON.parse(stringifiedCongo)

    let courseID = respose?.data[0]?.attributes?.course_id

    console.log(respose, "00000011111122222")

    if (congo[courseID]) {
      // delete congo[courseID]
      if (respose.course_status == "complete") {

        delete congo[courseID]

        await AsyncStorage.setItem("CONGRATULATIONS", JSON.stringify(congo))

        this.props.navigation.navigate("Congratulation", { course_id: courseID })


      }
    }
  }

  functionTowritepreviousStack = (userFlashCardId: any, flashData: any) => {

    let previousStack = this.state.previousStack
    let ratedobj = this.state.flashdata.filter((ele: any) => {
      return ele?.id == userFlashCardId
    })
    let checking
    let checkIndex: any

    let flashdata = this.state.flashdata
    for (let i = 0; i < previousStack.length; i++) {
      if (previousStack[i]?.id == userFlashCardId) {
        //checking=previousStack[i]
        checkIndex = i
        break
      }
    }

    // for(let i=0;i<flashdata.length;i++)
    // {
    //   if(flashdata[i]?.id==userFlashCardId)
    //   {
    //     checking=flashdata[i]
    //     break
    //   }
    // }
    checking = flashData

    if (checking.id) {
      previousStack = previousStack.filter((ele, index) => {
        return checkIndex !== index
      })
    }



    previousStack.push(checking)
    this.setState({ previousStack: previousStack })


  }



  Rearrangetheflashcards = async () => {

    let data = this.state.flashdata
    // this.setState({ backupFlascardData: data})


    let fiverStarArray = data.filter((ele) => {
      return ele.attributes.rating != 5
    })

    let sortedData = data.sort((a, b) => {
      return a?.attributes?.rating - b?.attributes?.rating
    })

    console.log(sortedData, "rearrange data in flash")

    if (fiverStarArray[0]) {
      console.log(sortedData, "flash card data- for feature")
      this.state.isAllflashcardcompleted && this.setState({ flashdata: sortedData, backupFlascardData: data, swiperIndex: 0 }, () => {
        if(this.state.swiperIndex === 0) {
          this.swiperRef.scrollBy(this.state.flashdata.length * -1);
      } else {
          this.swiperRef.scrollTo(this.state.swiperIndex);
      }
      })
    }
  }

  autoScrollTopcompo = () => {

    if (this.topflashref.current) {
      if (this.state.swiperIndex <= 11) return
      //   const { width } = scrollViewRef.current.contentSize;
      //   const scrollToOffset = width * 0.7;
      let multiply = (this.state.swiperIndex * this.topflashref.current.props.style[0].width) / 12
      console.log(multiply, this.state.swiperIndex, this.topflashref, "jjjjjjj----oooo")
      const boxSize = this.topflashref.current.props.style[0].width + multiply

      this.topflashref.current.scrollTo({ x: 300, animated: true });

    }
  };


  informodalHideShow = (infomodal: any) => {

    this.setState({ infomodalVisible: !infomodal })

  }

  
}
// Customizable Area End