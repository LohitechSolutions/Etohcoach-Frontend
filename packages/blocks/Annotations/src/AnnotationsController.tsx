import React from "react";
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
import { isConnected } from '../../../mobile/src/utils/internetConnection';
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  offlineState: any;
  addOfflineData: (val: any) => void;
  addOfflineAPis: (val: any) => void;
  updateOfflineData: (val: any) => void;
  // Customizable Area End
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  txtInputValue: string;
  txtSavedValue: string;
  enableField: boolean;
  user_token: any;
  data: any;
  showLoader: boolean;
  highlightArray: any;
  defaultHighlightArray: any;
  selection: any;
  text: any;
  color: any;
  colorArray: any;
  themeIndex: any;
  lessonIndex: any;
  lessonDesc: any;
  annotionData: any;
  hideKeyboard: boolean;
  DOM: any,
  lessonDatafromapi: any,
  isItOffline: boolean;
  // Customizable Area Start
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class AnnotationsController extends BlockComponent<
  Props,
  S,
  SS
> {
  focusListener: any;
  CreateNoteApiCallId: any;
  EditNoteApiCallId: any;
  UpdateNoteApiCallId: any;
  highlighToserverID: any
  getLessondetailsbyID: any
  myrefannotation = React.createRef()
  // Customizable Area Start
  // Customizable Area End

  constructor(props: Props) {
    super(props);

    this.receive = this.receive.bind(this);
    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionResponseMessage),
      getName(MessageEnum.CountryCodeMessage),
      // Customizable Area Start
      // Customizable Area End
    ];



    this.state = {
      txtInputValue: "",
      txtSavedValue: "A",
      enableField: false,
      user_token: '',
      data: '',
      showLoader: false,
      highlightArray: [],
      defaultHighlightArray: [],
      selection: {
        start: 0,
        end: 0
      },
      text: this.props.navigation.state?.params?.data?.annotionsData !== undefined ? this.props.navigation.state?.params?.data && this.props.navigation.state?.params?.data?.annotionsData && this.props.navigation.state?.params?.data?.annotionsData?.attributes?.lesson?.data?.attributes?.description : this.props?.navigation?.state?.params?.data?.lesson_details?.attributes?.description,
      color: '',
      colorArray: [],
      themeIndex: 0,
      lessonIndex: 0,
      lessonDesc: '',
      annotionData: '',
      hideKeyboard: true,
      DOM: "",
      lessonDatafromapi: "",
      isItOffline: false,

      // Customizable Area Start
      // Customizable Area End
    };

    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async componentDidMount() {

    const { navigation } = this.props

    this.setState({
      themeIndex: this.props.navigation?.state?.params?.data?.themeIndex
    })
    this.setState({ lessonIndex: this.props.navigation?.state?.params?.data?.lessonIndex })
    this.setState({ color: this.state.color })
    this.setState({ lessonDesc: this.props.navigation.state?.params?.data?.annotionsData?.attributes?.lesson?.data?.attributes?.description })
    this.setState({ annotionData: this.props.navigation && this.props.navigation.state && this.props.navigation.state?.params?.data?.annotionsData, DOM: this.props.navigation.state?.params?.data?.annotionsData?.attributes?.lesson?.data?.attributes?.description })
    this.send(new Message(getName(MessageEnum.RequestUserCredentials)));

    this.focusListener = navigation.addListener("didFocus", async () => {
      let connectionStatus = await isConnected().then(response => response).catch(err => console.log(err))
      if (connectionStatus !== undefined) {
        this.setState({ data: this.props.navigation?.state?.params?.data?.lession_details_notes?.comment ?? "" })
        this.setState({ showLoader: true, isItOffline: false })
        this.getToken()
        this.getLessonData()
      } else {
        this.setState({ isItOffline: true })
        this.getOfflineNotes(this.props.navigation.state.params.data)
      }
      // this.getDefaultHighlightedArray()1
    });


  // Customizable Area Start
    // Customizable Area End
  }

  async componentWillUnmount() {
    this.setState({ showLoader: false })
  }
  getOfflineNotes = (lessonData: any) => {
    const data = this.props.offlineState.offlineData?.all_notes.data;
    data.map((it: any, ind: any) => {
      if (lessonData.lessonId.id == it.attributes.lesson_id) {
        this.setState({
          lessonDatafromapi: it.attributes.description,
          DOM: it.attributes.lesson.data.attributes.highlight_description == 'N/A' ? it.attributes.lesson.data.attributes.description : it.attributes.lesson.data.attributes.highlight_description,
          showLoader: false,
          data: it.attributes.comment
        })
      } else {
        this.setState({
          DOM: lessonData?.lesson_details?.attributes?.description ?? ''
        })
      }
    })
      // Customizable Area Start
    // Customizable Area End
  }


  async getDefaultHighlightedArray() {


    let notes_arr = this.props.navigation?.state?.params?.data?.annotionsData !== undefined ? this.props.navigation && this.props.navigation?.state?.params && this.props.navigation?.state?.params?.data?.annotionsData && this.props.navigation?.state?.params?.data?.annotionsData?.attributes?.note_array
      : this.props.navigation.state.params.data?.lession_details_notes?.note_array

    let notes_comment = this.state.annotionData !== undefined ? this.state.annotionData?.attributes?.comment : this.props.navigation.state.params.data?.lession_details_notes?.comment
    let new_note_arr: any = []
    notes_arr && notes_arr.map(i => {
      let str = ''
      str = i.split("\\").join("").split("=>").join(":")
      new_note_arr.push(JSON.parse(str))
    })
    await this.setState({ colorArray: new_note_arr })
    await this.setState({ defaultHighlightArray: new_note_arr, data: notes_comment })

  }

  async getToken() {

    let token: any = await AsyncStorage.getItem('LOGIN_TOKEN')
    this.setState({ user_token: token })
  };

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
        if (apiRequestCallId === this.CreateNoteApiCallId) {
          if (responseJson && !responseJson?.errors) {
            setTimeout(() => {
              this.setState({ showLoader: false })
              console.log("createNoteResponse========", responseJson);
              this.props.navigation.goBack()

            }, 3000);
          }
          else {
            alert('errorrr')
          }

        }

        if (apiRequestCallId === this.EditNoteApiCallId) {
          if (responseJson && !responseJson?.errors) {
            setTimeout(() => {
              console.log("editResponse========", responseJson);
              this.setState({ showLoader: false })

              this.props.navigation.goBack()

            }, 3000);
          }
          else {
            alert('error')
          }
        }

        if (apiRequestCallId == this.highlighToserverID) {
          console.log(responseJson, "all rthe response highlight")
          if (responseJson && !responseJson?.errors) {
            console.log(responseJson, "hehehhehehe")
          }

        }
  // Customizable Area Start
    // Customizable Area End

        if (apiRequestCallId == this.getLessondetailsbyID) {
          if (responseJson && !responseJson?.errors) {
            console.log(responseJson, "get lesson data in annotation")
            // logic to update DOM state
            this.setState({ lessonDatafromapi: responseJson?.data?.attributes?.description })
            if (responseJson?.data?.attributes?.highlight_description == "N/A") {
              this.setState({ DOM: responseJson?.data?.attributes?.description })
            }
            else {
              this.setState({ DOM: responseJson?.data?.attributes?.highlight_description })
            }
          }
          this.setState({ showLoader: false })
        }

      }
    }


    runEngine.debugLog("Message Recived", message);
  }




  txtInputWebProps = {
    onChangeText: (text: string) => {
      this.setState({ txtInputValue: text });
    },
    secureTextEntry: false,
  };

  txtInputMobileProps = {
    ...this.txtInputWebProps,
    autoCompleteType: "email",
    keyboardType: "email-address",
  };

  txtInputProps = this.isPlatformWeb()
    ? this.txtInputWebProps
    : this.txtInputMobileProps;

  btnShowHideProps = {
    onPress: () => {
      this.setState({ enableField: !this.state.enableField });
      this.txtInputProps.secureTextEntry = !this.state.enableField;
      this.btnShowHideImageProps.source = this.txtInputProps.secureTextEntry
        ? imgPasswordVisible
        : imgPasswordInVisible;
    },
  };

  btnShowHideImageProps = {
    source: this.txtInputProps.secureTextEntry
      ? imgPasswordVisible
      : imgPasswordInVisible,
  };

  btnExampleProps = {
    onPress: () => this.doButtonPressed(),
  };

  doButtonPressed() {
    let msg = new Message(getName(MessageEnum.AccoutLoginSuccess));
    msg.addData(
      getName(MessageEnum.AuthTokenDataMessage),
      this.state.txtInputValue
    );
    this.send(msg);
  }

  // web events
  setInputValue = (text: string) => {
    this.setState({ txtInputValue: text });
  };

  setEnableField = () => {
    this.setState({ enableField: !this.state.enableField });
  };

  async createNoteApicall() {
    
    const { navigation } = this.props
    const header = {
      "token": await AsyncStorage.getItem('LOGIN_TOKEN')
    };

    var formData = new FormData();
    formData.append("comment", this.state.data)
    formData.append("lesson_id", (navigation.state.params && navigation.state.params.data && navigation.state.params.data.lesson_details && navigation.state.params.data.lesson_details.id) ? navigation.state.params.data.lesson_details.id : '')
    formData.append("course_id", navigation?.state?.params?.course_id)

    this.state.colorArray?.map((i: any) => {
      formData.append("note_array[][color]", i.color)
      formData.append("note_array[][id]", "")
      formData.append("note_array[][end]", i.end)
      formData.append("note_array[][name]", "")
      formData.append("note_array[][start]", i.start)
    })
    if(this.state.isItOffline){


      let myargs = {
        contentType: "application/json",
        method: configJSON.exampleAPiMethod,
        endPoint: configJSON.createNoteEndPoint,
        body:{
          comment:this.state.data,
          lesson_id:navigation?.state?.params?.data?.lesson_details?.id,
          course_id:navigation?.state?.params?.course_id
        }
      };
      let allOfflineData = this.props.offlineState?.offlineAPIs;
      allOfflineData.push(myargs);
      this.props.addOfflineAPis(allOfflineData);
      let allOfflineDataSet = this.props.offlineState?.offlineData;
      let offlineNotes = allOfflineDataSet.all_notes.data;
      offlineNotes.map((it:any,ind:any)=>{
        if(it.attributes.lesson_id == navigation.state?.prams?.data?.lesson_details?.id){
          it.attributes = this.state.data;
        }
      })
      this.props.addOfflineData(allOfflineDataSet)
      this.props.navigation.goBack();
    }
else{
  this.setState({ showLoader: true })
    console.log(formData, 'checking the form data create note api')
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.CreateNoteApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.createNoteEndPoint
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      formData);

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.exampleAPiMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);

    return true;
  }

  }

  async editNoteApicall() {
    const { navigation } = this.props
    var formData = new FormData();
    formData.append("comment", this.state.data)
    formData.append("lesson_id", (navigation.state.params && navigation.state.params.data && navigation.state.params.data.lesson_details && navigation.state.params.data.lesson_details.id) ? navigation.state.params.data.lesson_details.id : '')
    formData.append("course_id", navigation?.state?.params?.course_id)
    this.state.colorArray?.map((i: any) => {
      formData.append("note_array[][color]", i.color)
      formData.append("note_array[][id]", "")
      formData.append("note_array[][end]", i.end)
      formData.append("note_array[][name]", "")
      formData.append("note_array[][start]", i.start)
    })
    console.log('edit notes and comment info',this.state.data)
    this.setState({ showLoader: true })
    const header = {
      "token": await AsyncStorage.getItem('LOGIN_TOKEN')
    };
   
    console.log("formData", formData);
    
    if(this.state.isItOffline){
      let myargs = {
        contentType: "application/json",
        method: configJSON.updateAPiMethod,
        endPoint: configJSON.editNoteEndPoint + navigation.state.params.data.lession_details_notes?.id,
        body:{
          comment:this.state.data,
          lesson_id:navigation?.state?.params?.data?.lesson_details?.id,
          course_id:navigation?.state?.params?.course_id
        }
      };
      let allOfflineData = this.props.offlineState?.offlineAPIs;
      allOfflineData.push(myargs);
      this.props.addOfflineAPis(allOfflineData);
      this.setState({ showLoader: false })
      this.props.navigation.goBack();
    }else{
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.EditNoteApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage), configJSON.editNoteEndPoint + navigation.state.params.data.lession_details_notes?.id
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      formData);

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.updateAPiMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);

    return true;
    }
  }


  saveDomInstate = (DOM: any) => {

    this.setState({ DOM: DOM })

  }

  sendDomtoserver = async () => {
    let apiBody = {
      id: this.props.navigation?.state?.params?.data?.lessonId?.id,
      highlight_description: this.state.DOM
    }
    
    let body = {
      contentType: "application/json",
      method: "POST",
      endPoint: "highlight/description",
      body: apiBody
    };
    console.log(body,"annotation body-----")
    if (this.state.isItOffline) {
      let allOfflineData = this.props.offlineState?.offlineAPIs;
      allOfflineData.push(body);
      this.props.addOfflineAPis(allOfflineData);
    } else {
      this.setState({ showLoader: true })
      this.highlighToserverID = await this.apiCall(body)
    }

  }


  getLessonData = async () => {

    let endpoint = `lesson/show?id=${this.props.navigation?.state?.params.data.lessonId.id}&type=${"lesson"}`


    let body = {
      contentType: "application/json",
      method: "Post",
      endPoint: endpoint,

    }

    this.getLessondetailsbyID = await this.apiCall(body)

  }


  // api template
  apiCall = async (data: any) => {
    let token = await AsyncStorage.getItem('LOGIN_TOKEN');
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
    console.log('@@@ requestMessage ======== lesson', requestMessage)
    return requestMessage.messageId;
  }


  ClearAll = () => {

    this.setState({ DOM: this.state.lessonDatafromapi })

  }



  // Customizable Area Start
  // Customizable Area End
}
