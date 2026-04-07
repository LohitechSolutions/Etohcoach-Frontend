import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";

import { runEngine } from "../../../framework/src/RunEngine";
// Customizable Area Start
import stripe from "tipsi-stripe";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsynchStoragekey } from "../../../mobile/src/utils";

import { imgPasswordInVisible, imgPasswordVisible } from "./assets";
import AsyncStorage from "@react-native-async-storage/async-storage";


// Customizable Area End
export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
    // Customizable Area Start
  number: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  iserror:boolean;
  error:string;
  isLoading:boolean;
  notificationUnreadCount:any

  // Customizable Area End
}

interface SS {
  // id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class StripeIntegrationController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  // Customizable Area End
  apiStripeTokensendId: string = "";
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    this.subScribedMessages = [getName(MessageEnum.RestAPIResponceMessage)];

    this.state = {
       // Customizable Area Start
      number: "",
      expMonth: "",
      expYear: "",
      cvc: "",
      iserror:false,
      error:"",
      isLoading:false,
      notificationUnreadCount:'0',
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

   
    // Customizable Area End
  }
 // Customizable Area Start
  async componentDidMount(): Promise<void> {
    let unseenNotify : any = await AsyncStorage.getItem('NOTIFICATION_UNREAD')
    this.setState({ notificationUnreadCount: unseenNotify})
  }

conditionFordisablingThepayButton()
{

  console.log(this.state,"yesss")
  if(this.state.number.length!==16 || this.state.expYear.length!==2 || this.state.cvc.length<3)
  {
    console.log(String(this.state.cvc).length)
    console.log('iam returning true')

    return true
  }
  else{
    console.log('iam returning false')
    return false
  }
}

returningDisabledstyle(properstyle:any,disabledstyle:any)
{


  if(this.conditionFordisablingThepayButton())
  {
    return disabledstyle
  }
  else{
    return properstyle
  }

}


  async createTokenfromstripe() {


console.log("I am inside stripe card function",'sss')
console.log(await AsyncStorage.getItem(
  AsynchStoragekey?.AsynchStoragekey?.LOGIN_TOKEN
))


   this.setState({...this.state,isLoading:true})

    const card = {
      number: this.state.number,
      exp_month: this.state.expMonth,
      exp_year: this.state.expYear,
      cvc: this.state.cvc,
    };
    const body = {
      card: card,
    };


    const header = {
      "Content-Type":"application/json",
      token: await AsyncStorage.getItem(
        AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN
      ),
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.apiStripeTokensendId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      "stripe_integration/payment_methods/create_customer_card"
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(body)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      "POST"
    );

    console.log(
      requestMessage,
      "checking request message inside subscription controller"
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
    // Customizable Area End
    return true;
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

      if (apiRequestCallId ) {
        if (apiRequestCallId === this.apiStripeTokensendId) {
          this.setState({...this.state,isLoading:false})
          if (!responseJson) {
            console.log("i am getting error in stripeee")

             this.setState({...this.state,iserror:true,error:"Error : Could not add card please try again"})
             setTimeout(()=>{

              this.setState({...this.state,number:'',expMonth:'',expYear:'',cvc:'',iserror:false,error:''})
 
             },4000)
          }
          else {
            console.log(responseJson.meta.card.card,"CREDITCARD----------------------")
                 await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.USER_CREDITCARDID, "something")    
            this.props.navigation.navigate('SubCriptionScreen')
          }
        }
       
      }
    }

    
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

  // Customizable Area End
}
