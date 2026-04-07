import { Message } from "../../framework/src/Message";
import { BlockComponent } from "../../framework/src/BlockComponent";
import { runEngine } from "../../framework/src/RunEngine";
import MessageEnum,{getName} from "../../framework/src/Messages/MessageEnum";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsynchStoragekey } from "../../mobile/src/utils";
import { getAsyncDataKeys, setAsyncData } from "../../mobile/src/utils/AsyncKeysStorage";
import { isConnected } from "../../mobile/src/utils/internetConnection";
import { configJSON } from "../../blocks/AdminConsole3/src/AdminConsole3Controller";


interface Props {
    notificationBtn:any,
    BackBtnCloseModal:any,
    CloseModal:any,
    navigation:any,
    mystring:string
    notificationState:any;
    addNotification:(val:any)=>void;
    removeNotificaiton:()=>void;
    // notificationVisible:any
}
interface S{
  notificationData: any;
  user_token:any;
  isLoading: boolean;
  // notificationVisible:any

}
interface SS{

}


export default class NotificationController extends BlockComponent<
  Props,
  S,
  SS
> 
 
{
    notificationApiCallId:any
    notificationVisible: any;
 deleteApiCallId:any;
    constructor(props:Props){
        super(props)
        this.receive = this.receive.bind(this);
    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionResponseMessage),
      getName(MessageEnum.CountryCodeMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
    ];
        this.state={
          notificationData:'',
          user_token:'',
          notificationVisible:false,
          isLoading:false,
        }
        runEngine.attachBuildingBlock(this, this.subScribedMessages);
    }
   async componentDidMount() {
    let connectionStatus = await isConnected().then(response => response).catch(err => console.log(err))
    if (connectionStatus !== undefined){  
        this.getToken()
       
    }else{
      // let notificationOfflineData = await getAsyncDataKeys('NOTIFICATION_DATA')??[];
      let notificationOfflineData = this.props.notificationState?.data;
      this.setState({
          notificationData:notificationOfflineData
        })
    }

    }

    async getToken() {
      // let token: any = await AsyncStorage.getItem('LOGIN_TOKEN')
      // console.log('props dtaaaa =====================', token)
      // this.setState({ user_token: token })
      await AsyncStorage.getItem('LOGIN_TOKEN').then(val=>this.setState({user_token:val,isLoading:true},()=>this.NotificationApiFun()))
    };
    

    async receive(from: String, message: Message) {
        // runEngine.debugLog("notification Message Recived", message);


        const responce = message.getData(
          getName(MessageEnum.RestAPIResponceSuccessMessage)
        )
        // console.log("message$$$$$$$$$$$$$$",message)
        if(this.notificationApiCallId == message?.properties?.RestAPIResponceDataMessage){
          this.setState({isLoading:false})
          var responseJson = message.getData(
            getName(MessageEnum.RestAPIResponceSuccessMessage)
          );

          console.log(responseJson,"NOTIFICATION_DATA")
          this.setState({ notificationData: responseJson.Data });
          this.props.addNotification(responseJson.Data)
          // await setAsyncData("NOTIFICATION_DATA", JSON.stringify(responseJson.Data) )
        }


        if(this.deleteApiCallId== message?.properties?.RestAPIResponceDataMessage)
        {
          var responseJson = message.getData(
            getName(MessageEnum.RestAPIResponceSuccessMessage)
          );
          console.log("all the details from data",responseJson,this.state.notificationData)
            this.NotificationApiFun()
        }   

    }

    async NotificationApiFun(){
      
      // const userToken = JSON.stringify(AsyncStorage.getItem('LOGIN_TOKEN')).then((data:any)=>data)
      const header ={
        'content-type' : 'applicagtion/json',
        // token: await JSON.stringify(AsyncStorage.getItem('LOGIN_TOKEN')),
        token: this.state.user_token    
       }
      const requestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage)
      )
      // console.log("REquested message checkkk",requestMessage)
      this.notificationApiCallId = requestMessage.messageId

       requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(header)
       )

       requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        '/push_notifications/push_notifications'
       )
       console.log("REquested message checkkk",requestMessage)

       requestMessage.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        "GET"
       )
       console.log('show dataaa api ',requestMessage)
       runEngine.sendMessage(requestMessage.id,requestMessage)
    }

    apiCall = async (data: any) => {

      this.setState({ isLoading: true })
      // let token: any = await AsyncStorage.getItem("@token");
      
  
      const { contentType, method, endPoint, body, type } = data;
      
      const header = {
        "Content-Type": contentType,
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

  
    deleteThenotification = async (id:any) => {

console.log(id,"delete the notification")
      let body={
        id:id?.id
      }
      // console.log(body,"delete the notification")
      this.deleteApiCallId = await this.apiCall({
        contentType: "application/json",
        method: "POST",
        endPoint: "delete/notification",
        body:body
    })
}

}