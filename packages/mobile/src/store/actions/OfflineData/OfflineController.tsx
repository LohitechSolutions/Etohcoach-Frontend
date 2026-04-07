import {BlockComponent} from "../../../../../framework/src/BlockComponent"
import { Message } from "../../../../../framework/src/Message";
import MessageEnum, { getName } from "../../../../../framework/src/Messages/MessageEnum";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { AsynchStoragekey } from "../../../utils";
import { runEngine } from "../../../../../framework/src/RunEngine";
import { IBlock } from "../../../../../framework/src/IBlock";
import {addOfflineData, loadingOfflineData, updateOfflineData,  } from "./index"

import {connect} from "react-redux"

export const configJSON = require("./config.js");

interface Props {
    // addOfflineData:(val:any)=>void;
}
interface S {

}

interface SS {

}

class OfflineController extends BlockComponent<Props, S, SS>{
    apiOfflineItemCallId: any;
    offlineData :  any = {}

    constructor(props : Props) {
        super(props);
        this.receive = this.receive.bind(this)
        this.subScribedMessages = [
          getName(MessageEnum.AccoutLoginSuccess),
          getName(MessageEnum.RestAPIResponceMessage),
          getName(MessageEnum.SessionSaveMessage),
          getName(MessageEnum.SessionResponseMessage),
        ];

        this.state = {
            isLoading : false,
            offlineFetchedData : {}   
        }
        runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
    }

     async componentDidMount(){
        this.setState({isLoading : true})
        // this.getOfflineData()
        // console.log("props did mount ", this.offlineData)
    }

     getOfflineData = async () => {
        console.log("action api call");
        
    const header = {
      "Content-Type": configJSON.offlineContentType,
      token: await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN),
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
      configJSON.offlineGetUrl
    );
    
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.offlineApiMethodType
    );
    
   
    requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
    null
        );

    runEngine.sendMessage(requestMessage.id, requestMessage);
    
    //  console.log("@@@ requestMessage ======== redux", requestMessage);
    
    return requestMessage.messageId;
  };


    async receive(from: string, message: Message) {
        // console.log("@@@ API MESSAGE DSHHH VIEW =================", message);
        console.log("Inside Receive",message.id)
        console.log("rest api response messsage", getName(MessageEnum.RestAPIResponceMessage))
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
    

         if (responseJson && !responseJson.errors) {
            //AnnotationData Start
           //  console.log("responseJsonannotation", responseJson);
           //  console.log("error from annotation", responseJson.errors);
          
           // if (apiRequestCallId === this.apiAnnotationItemCallId) {
           //   console.log(responseJson, "responsefromAnnotation");
           // }
   
           //AnnotationData End
          //  this.offlineData = responseJson;
   
           if (apiRequestCallId === this.apiOfflineItemCallId) {
            //  this.setState({ isLoading: false, offlineFetchedData : responseJson})
             this.offlineData = responseJson;
             return this.offlineData;
            //  this.getOfflineSuccessCallBack(responseJson)
           }
          
         
   
         } else if (responseJson && responseJson.errors) {
           this.setState({ isLoading: false })
          
           if (apiRequestCallId === this.apiOfflineItemCallId) {
             this.getOfflineFailureCallBack(responseJson);
           }
        
         } else if (errorReponse) {
           this.setState({ isLoading: false })
           // console.log("errorReponse", errorReponse);
         }
   
       }
    }


    getOfflineSuccessCallBack = async (responseJson: any) => {
        this.setState({ isLoading: false })
        // console.log("executed completelyoffline", JSON.stringify(responseJson))
    };

    getOfflineFailureCallBack = (responseJson: any) => {
        this.setState({ isLoading: false })
        console.log(
          "@@@ get dashboard failure callBack =================",
          responseJson
        );
        this.setState({ isLoading: false, })
      };   
}


const mapStateToProps = (state : any) => {
    return {
      // offlineData : state.rootReducer.offlineReducer
      offlineState  : state.rootReducer.offlineReducer
    }
  }


const mapDispatchToProps = (dispatch : any) => {
    // bindActionCreators(
    //   {
    //     // offlineDataWatcher
    //     // OfflineActionCreators
    //     addOfflineData
    //   },
    //   dispatch,
    return {
      addOfflineData : (params:any) => {
        dispatch(addOfflineData(params))
      }, 
      updateOfflineData : (params) => {
        dispatch(updateOfflineData(params))
      },
      loadingOfflineData : (params) => {
        dispatch(loadingOfflineData(params))
      }
    }
  };
  

export default OfflineController;