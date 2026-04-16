// Customizable Area Start
import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
// import {AsyncStorage} from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { runEngine } from "../../../framework/src/RunEngine";
import { isConnected } from "../../../mobile/src/utils/internetConnection";
import { AsynchStoragekey } from "../../../mobile/src/utils";
import { image_spirits, image_beer, image_wine, image_filter, noData } from "./assets";
import { COLORS } from "../../../framework/src/Globals";
import { Alert } from "react-native";
import i18n from "../../LanguageOptions/src/component/i18n/i18n.config";
import { CONTENT_SOURCE } from "../../../framework/src/config";
import { loadProfileCoursesShape } from "./content/firestoreRepository";

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  
}


interface S {  
  
  isVisible: boolean;
  courseVisible: any;
  user_token: any;
  catlogue_data: any;
  search_key: any;
  filter_key: any;
  course_Details: any;
  totalReward: any;
  notificationBt: boolean;
  drinks_types: any;
  difficulty: string[];
  certificate: string[];
  completion: string[];
  notificationUnreadCount:any;
  // isloading:boolean
  isLoading: boolean;
  content_availability: any;
  filterId: any;
  selectedHeaderOption: any;
  subscription: any;
  isConnectionStatus:any;

  filteredArray:any;
  isFilterSelected:boolean;
  drinks_typesbeta:string[];
  dynamicCertificate:any,
  dynamicDrinktype:any,
  headerIconList:any
  
  
}

interface SS {
  id: any;
}

export default class CatalogueController extends BlockComponent<Props, S, SS> {
  
  getProductApiCallId: any;
  getCourseDetailsCallApiId: any;
  GetFilterListApiId: any;
  CatalogueControllerthis: any
  focusListener: any;
  notificationUnreadCount:any
  getSearchDetails: any
  userInfoApiCallId: any
  apiDashboardItemCallId:any
  getCertificatesapiId:any
    
  constructor(props: Props) {
     
    super(props);
    this.receive = this.receive.bind(this);

    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionSaveMessage),
      getName(MessageEnum.SessionResponseMessage),
    ];
     
    this.state = {
      isVisible: false,
      drinks_types: [''],
      difficulty: [''],
      certificate: [''],
      completion: [''],
      courseVisible: false,
      catlogue_data: [],
      search_key: '',
      filter_key: '',
      course_Details: [],
      totalReward: "",
      notificationUnreadCount:'0',
      notificationBt: false,
      isLoading: false,
      content_availability: [''],
      user_token: '',
      filterId: 0,
      subscription: '',
      isConnectionStatus:true,
      filteredArray: [],
      isFilterSelected:false,
      drinks_typesbeta:[],
      dynamicCertificate:[],
  dynamicDrinktype:[],
  headerIconList:[]
  
    };

    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  
    
  }

        
  AddremoveFilteronPress = (title: string, abc: string, array: any,callit:boolean) => {
    var index = this.state[abc].indexOf('')
    var newArray = this.state[abc]
    var itemsArray = this.state[abc]
    let isTitleInsideArray = false
    for (let i = 0; i < this.state[abc].length; i++) {
      if (this.state[abc][i] === title) {
        isTitleInsideArray = true;
        break
      }
    }

    // if (isTitleInsideArray) {
    //   let filteredArray = this.state[abc].filter((e: any) => {
    //     return e !== title
    //   })
    //   this.setState({ ...this.state, [abc]: [...filteredArray] })
    if (title == '') {
      this.state[abc].includes('') ? (newArray.splice(index, 1), this.setState({ [abc]: [...newArray] })) : this.setState({ ...this.state, [abc]: [''] })
    }
    else {

      this.state[abc].includes('') ? (newArray.splice(index, 1), this.setState({ [abc]: [...newArray] })) : this.setState({ ...this.state, [abc]: [''] })
      this.state[abc].includes(title) ?
        (itemsArray.splice(this.state[abc].indexOf(title), 1), this.setState({ [abc]: [...itemsArray] })) :
        this.setState({ ...this.state, [abc]: [...this.state[abc], title] })
    }
    console.log('abcArray', this.state[abc]);
  }

  async componentDidMount() {

    // super.componentDidMount();
    const { navigation } = this.props;
    this.setState({ isLoading: true })
    this.focusListener = navigation.addListener("didFocus", async () => {
    this.functionTogetnotifications()

      this.setState({drinks_types: [''] })
      let connectionStatus = await isConnected().then(response => response).catch(err => console.log(err))
      if (connectionStatus !== undefined) {
        console.log("load.....")
        this.getToken();

        let Subscription = await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.USER_SUBSCRIPTION)
        this.setState({ 
          subscription: Subscription=='subscribed'?true:false,
          isConnectionStatus:true 
        })
      }else{
        this.setState({
          isConnectionStatus:false 
        })
      }
      this.setState({ search_key: '' })

      // console.log('==========subsciption', subscription);

    })


  }
 async  componentWillUnmount(){
  this.setState({ search_key: '', drinks_types: [''] })
this.focusListener.remove()
    
  }

  async loadCatalogueFromFirestore() {
    try {
      const rows = await loadProfileCoursesShape();
      this.setState({ catlogue_data: rows, isLoading: false });
    } catch (e) {
      console.warn('Firestore catalogue', e);
      this.setState({ catlogue_data: [], isLoading: false });
    }
  }

  async getToken() {
  
    const msg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage)
    );
    let token: any = await AsyncStorage.getItem('LOGIN_TOKEN')
    // let unseenNotify : any = await AsyncStorage.getItem('NOTIFICATION_UNREAD')
    
    // this.setState({ notificationUnreadCount: unseenNotify})
    if (CONTENT_SOURCE === 'firestore') {
      this.setState({ user_token: token }, () => this.loadCatalogueFromFirestore());
    } else {
      this.setState({ user_token: token }, () => this.getListRequest());
    }

    console.log('checking the state in did mount', this)
    this.getDashboardData()
    this.getCertificates()
    this.send(msg);
  };


  // filterDataFromLocal = () => {
  //   const { catlogue_data, selectedHeaderOption } = this.state      
  //     let filterArray = catlogue_data?.filter((i:any) => i?.drink_type?.toLowerCase() == selectedHeaderOption?.value.toLowerCase() )
  //     this.setState({filteredArray: filterArray})
  // }
  


  getListRequest = async () => {
    // this.setState({ isLoading: true })
    console.log(this, "inside not mine request")
    console.log('api calll', this.state.filter_key)
    const header = {
      "Content-Type": configJSON.productApiContentType,
      token: await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN)
    };
    const Body = {
      // filter: item,
      // keyword: ""
    }
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.getProductApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.corseListApiEndPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(Body)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.apiPostMethod
    );

    console.log("request mesage @@@@ ",requestMessage )
    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  GetFilterList = async () => {
  if (CONTENT_SOURCE === 'firestore') {
    this.setState({ isLoading: true });
    await this.loadCatalogueFromFirestore();
    return;
  }
  this.setState({ isLoading: true })
    const header = {
      "Content-Type": configJSON.productApiContentType,
      token: await AsyncStorage.getItem('LOGIN_TOKEN'),
    };
this.setState({search_key:''})
    const { content_availability } = this.state

    const Body = {
      // content_availability: this.state.content_availability.includes("") ? "" : this.state.content_availability,
      content_availability: content_availability != '' ? (typeof (content_availability) == 'object' && content_availability.length > 0) ? content_availability[0] : '' : '',
      drink_type: this.state.drinks_types.includes("") ? [""] : this.state.drinks_types,
      difficulty: this.state.difficulty.includes("") ? [""] : this.state.difficulty,
      certificate: this.state.certificate.includes("") ? [""] : this.state.certificate,
      completion: this.state.completion.includes("") ? [""] : this.state.completion
    }

    console.log('Catalouge payload', Body);
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.GetFilterListApiId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      'filter'
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(Body)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      "Post"
    );
    console.log(requestMessage, 'myrequesttttttt')
    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  async getCourseDetailsFun(course_id: any) {
    console.log('checkkk id', course_id)
    const header = {
      "Content-Type": configJSON.productApiContentType,
      token: this.state.user_token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.getCourseDetailsCallApiId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getCourseDetialsApiEndPoint + course_id
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
  }

  // clearFilter = () => {
  //   this.setState({ catlogue_data: [] })
  // }


  getSearchresults = async () => {
    if (CONTENT_SOURCE === 'firestore') {
      this.setState({ isLoading: true });
      try {
        const all = await loadProfileCoursesShape();
        const kw = String(this.state.search_key || '').toLowerCase();
        const filtered = kw
          ? all.filter((row: any) => String(row?.course_name || '').toLowerCase().includes(kw))
          : all;
        this.setState({ catlogue_data: filtered, isLoading: false });
      } catch (e) {
        console.warn(e);
        this.setState({ catlogue_data: [], isLoading: false });
      }
      return;
    }
    this.setState({isLoading:true})
    const header = {
      "Content-Type": configJSON.productApiContentType,
      token: await AsyncStorage.getItem('LOGIN_TOKEN'),
    };

   this.setState({ drinks_types: ['']})

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    const body = {
      keyword: this.state.search_key
    }
    console.log(header,requestMessage.messageId ,"checking my header")

    this.getSearchDetails = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      'profile/courses'
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.apiPostMethod
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(body)
    );

    console.log(requestMessage, 'myrequesttttttt')
    runEngine.sendMessage(requestMessage.id, requestMessage);
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
console.log(this.getSearchDetails,"+++++556565656", apiRequestCallId, responseJson, errorReponse)
      if (apiRequestCallId && responseJson) {
        console.log("+++++556565656 +++11")
        if (apiRequestCallId === this.GetFilterListApiId) {
          console.log("+++++556565656 +++22")
          console.log('===++++======', responseJson);
          if (responseJson?.data) {
              
              this.setState({ catlogue_data: responseJson?.data })        
              
          }
          else {
            console.log("")
          }
        }
        else{
          console.log("+++++556565656 +++22")
        }
      }
      else{
          console.log("")
      }
    }

    
    runEngine.debugLog("Message Recived inn catalogue", message);


    if (this.getProductApiCallId == message?.properties?.RestAPIResponceDataMessage) {
  
      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      console.log('Responce data09876 ====== catalogue', responseJson)
      if(responseJson?.meta?.message=="Record not found." )
{
console.log("i ma heree")
  this.setState({ catlogue_data: [], totalReward: responseJson },()=>{
    setTimeout(()=>{
                this.setState({ isLoading: false })

    },1000)
  })
}
      if (responseJson?.data) {
       
if(responseJson?.meta?.message=="Record not found." )
{
console.log("i ma heree")
  this.setState({ catlogue_data: responseJson?.data, totalReward: responseJson },()=>{
    setTimeout(()=>{
                this.setState({ isLoading: false })

    },1000)
  })
}
else{

  this.setState({ catlogue_data: responseJson?.data, totalReward: responseJson },()=>{
    setTimeout(()=>{
                this.setState({ isLoading: false })

    },1000)
  })
}


   
      }
      else if (responseJson?.meta?.status!==200) {
       console.log("here i debugg")
        // this.setState({ catlogue_data: [], totalReward: responseJson })
      }
      else {
        if (responseJson?.errors[0]?.token) {
          console.log('Token Error', responseJson?.errors[0]?.token)
          this.props.navigation.navigate('EmailAccountLoginBlock')
        }

        else {
          console.log('show Error ',)
        }
      }
     
    }

    if (this.getCourseDetailsCallApiId == message?.properties?.RestAPIResponceDataMessage) {
      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      console.log('Responce data ', responseJson)
      if (responseJson.errors) {
        if (responseJson?.errors[0]?.token) {
          console.log('Token Error', responseJson?.errors[0]?.token)
          this.props.navigation.navigate('EmailAccountLoginBlock')
        }
        else {
          console.log('show Error ',)
        }

      }
      else {
        console.log('Course Details data ', responseJson?.data)
        this.setState({ course_Details: responseJson?.data }, () => this.props.navigation.navigate('OverView'))
      }
    }

    if (message?.properties?.RestAPIResponceDataMessage === this.apiDashboardItemCallId) {
      console.log(responseJson, "checking dashboard data in catalogue")
      let unseenNotify = responseJson.unseen_notification.toString();
      AsyncStorage.setItem("notificationCalculation",JSON.stringify (responseJson?.unseen_notification) )

      // await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.NOTIFICATION_UNREAD, unseenNotify);
      //  this.setState({ notificationUnreadCount: unseenNotify }) AsyncStorage.setItem("notificationCalculation","0")
      this.setState({ notificationUnreadCount: responseJson?.unseen_notification })
      
    }

    if(message?.properties?.RestAPIResponceDataMessage==this.getCertificatesapiId)
    {
      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
console.log(responseJson,"checking the catalogue wsert scurses") 
  let drinks=responseJson?.drink_types
let headerIconList=[]
let t=i18n.t

for(let i=0;i<drinks.length;i++)
{
  if(drinks[i].title==="")
  {
    headerIconList.push({ id: 0, name: image_filter, iconName: t("Filters"), value: 'Filters' })
  }
  else if(drinks[i].title=="Wine")
  {
    headerIconList.push( { id: drinks[i].id , name: image_wine, iconName:  t("Wine"), value: 'wine' },)
  }
  else if(drinks[i].title=="Beer")
  {
    headerIconList.push(  { id:  drinks[i].id, name: image_beer, iconName:  t("Beer"), value: 'Beer' })
  }
  else if(drinks[i].title=="Spirits")
  {
    headerIconList.push(  { id:  drinks[i].id, name: image_spirits, iconName:  t("Spirits"), value: 'Spirits' })
  }
  else{
    headerIconList.push( { id: drinks[i].id, name: image_spirits, iconName: drinks[i] .title , value: drinks[i] .title})
  }
}


this.setState({dynamicCertificate:responseJson?.certificate,dynamicDrinktype:responseJson?.drink_types,headerIconList:headerIconList})
    }

    if (this.GetFilterListApiId == message?.properties?.RestAPIResponceDataMessage) {
     
      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      if (responseJson.errors) {
        console.log("eroor in filter list")
    
      }
      else {
        // console.log('Responce data  course data______',responseJson)
        console.log('Course Details data walson ', responseJson?.data)
        console.log(this.CatalogueControllerthis, "my final this")
       
        this.setState({ catlogue_data: responseJson?.data },()=>{
          
          setTimeout(()=>{
            this.setState({ isLoading: false },()=>{
            })
            
          },4000)
        })
        console.log(this.state, 'yo i am')
       

        //  this.setState({course_Details:responseJson?.data},()=>this.props.navigation.navigate('OverView'))        
      }
      setTimeout(()=>{
       // this.setState({ isLoading: false })

      },4000)
    }

    // 

    if (this.getSearchDetails == message?.properties?.RestAPIResponceDataMessage) {
      console.log("search m,esage french")
      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      if (responseJson?.errors) {
        console.log("eroor in search list")
   
      }
      else {
  
        // console.log('Responce data  course data______',responseJson)
        console.log('Course Details data walson ', responseJson?.data)
        console.log(this.CatalogueControllerthis, "my final this")
        if (responseJson?.data) {
          
          this.setState({ catlogue_data: responseJson?.data })
          console.log(this.state, 'yo i am')
          this.setState({isLoading:false})
        }
        else {
          console.log('Course Details data walson elseeee')
          
          this.setState({ catlogue_data: [],isLoading:false })
        }
      }

    }



    
  }













   functionConnectingfiltersRemove=(item:string)=>{
 let newarr= this.state.drinks_types.filter((elem:any)=>{
    return elem.toLowerCase()!==item.toLowerCase()
  })
this.setState({drinks_types:newarr })
   }

   functionFilterAdd=(item:string)=>{

let theItem
if(item=='Wine')
{
theItem="wine"
}
else if(item=='Beer')
{
theItem="beer"
}
else if(item=='Spirits')
{
theItem="Spirits"
}
    let thearray=this.state.drinks_types
    thearray.push(theItem)
   }


   functionToreturnTintcolor=(item:any)=>{
   
   if(item?.id==0)
   {
  if(this.state.isFilterSelected)
  {
    return COLORS.black 
  }
  else{
    return 'none'
  }
   }
   else{

if(this.state?.drinks_types.includes(item?.value))
{
  return COLORS.black
}
else{
return  "#777185" 
}
   }
   }


   functionToreturnBackgroundcolor=(item:any)=>{
   
    if(item?.id==0)
    {
   if(this.state.isFilterSelected)
   {
     return "#f0eff5"
   }
    }
    else{
 
 if(this.state?.drinks_types.includes(item?.value))
 {
   return "#f0eff5"
 }
 else{
 return  null
 }
    }
    }


    getDashboardData = async () => {
     // this.setState({ isLoading: true })
      this.apiDashboardItemCallId = await this.apiCall({
        contentType: configJSON.dashboarContentType,
        method: configJSON.dashboarApiMethodType,
        endPoint: configJSON.dashboardGetUrl,
      });
    };


    apiCall = async (data: any) => {

      // this.setState({ isLoading: true })
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
      
       console.log("@@@ requestMessage ========", requestMessage);
      
      return requestMessage.messageId;
    };

    cancelsearchkey=()=>{
      this.setState({search_key:""},()=>{
        console.log(this.state,"hello this iscatstate")
      })
    }

    functionTogetnotifications=async()=>{
   let unseen=  await AsyncStorage.getItem("notificationCalculation" )
     this.setState({notificationUnreadCount:unseen})
    }

    getCertificates = async () => {
      // this.setState({ isLoading: true })
       this.getCertificatesapiId = await this.apiCall({
         contentType: configJSON.dashboarContentType,
         method: configJSON.dashboarApiMethodType,
         endPoint: 'get_drink_types_and_certificate',
       });
     };


}

// Customizable Area End
