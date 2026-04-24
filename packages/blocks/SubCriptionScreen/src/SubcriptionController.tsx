// Customizable Area Start
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { Alert, Linking, Platform } from "react-native";
import  {
  ProductPurchase,
  flushFailedPurchasesCachedAsPendingAndroid,
  getAvailablePurchases, initConnection,
  purchaseUpdatedListener
} from 'react-native-iap';
import Purchases, { PURCHASES_ERROR_CODE, type CustomerInfo } from "react-native-purchases";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsynchStoragekey } from "../../../mobile/src/utils";

import * as RNIap from 'react-native-iap';
// Customizable Area End

// export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  subscriptionState:any;
  addSubscription:(val:any)=>void;
  cancelSubscription:()=>void;
  // Customizable Area Start

  // Customizable Area End
}

interface S {
  txtInputValue: string;
  txtSavedValue: string;
  enableField: boolean;
  modalVisible: boolean;
  activeBt: any;
  highlightedcardindex: string;
  paymentError: boolean;
  cancelSubscriptionError: boolean;
  isLoading: boolean;
  isCancelbuttonLoading: boolean;
  priceingListapi_price: string;
  pricingListapi_expiryDate: string;
  courseDurationMonth: string;
  courseExpiryMonthAndate: string;
  isSubscriptionScreenLoading: boolean;
  userToken: any;
  isloading: boolean;
  subscribed: boolean;
  subscribedDate: any;
  productList: undefined;
  isVisible: boolean;
  subscription_id: string;
  subscriptionInfo: undefined;
  subscription: any;
  checkForSubscription:boolean;
  /** Localized price string from RevenueCat offerings (preferred for Subscribe UI when set). */
  revenueCatPriceString: string;
  // Customizable Area Start
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}
//Item Subscription on the basis of platforms
// // Test Subscriptions
// const itemSubs: any = Platform.select({
//   android: ['test_month'],
//   ios: ["test_month"]
// })

// // Prod Subscriptions
const itemSubs: any = Platform.select({
  android:['etoh_prod'],
  ios:['etoh_prod']
})

export const configJSON = require("./config.js");

let revenueCatSdkConfigured = false;
/** Dedupe parallel syncs; backoff after configuration errors (empty offerings) to avoid log spam. */
let revenueCatOfferingsSyncInFlight: Promise<void> | null = null;
let revenueCatOfferingsLastFailureAt = 0;
const REVENUECAT_OFFERINGS_RETRY_MS = 60_000;

function revenueCatPublicKeyIos(): string {
  const fromEnv =
    typeof process !== "undefined" && process.env?.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
  return (typeof fromEnv === "string" && fromEnv.length > 0
    ? fromEnv
    : configJSON.revenueCatIosApiKey) || "";
}

function revenueCatPublicKeyAndroid(): string {
  const fromEnv =
    typeof process !== "undefined" && process.env?.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;
  return (typeof fromEnv === "string" && fromEnv.length > 0
    ? fromEnv
    : configJSON.revenueCatAndroidApiKey) || "";
}

async function ensureRevenueCatConfigured(): Promise<boolean> {
  const iosKey = revenueCatPublicKeyIos();
  const androidKey = revenueCatPublicKeyAndroid();
  const apiKey = Platform.OS === "ios" ? iosKey : androidKey;
  if (!apiKey) {
    return false;
  }
  if (!revenueCatSdkConfigured) {
    Purchases.configure({ apiKey });
    revenueCatSdkConfigured = true;
  }
  return true;
}

/**
 * Map RevenueCat result to the shape `sendSubscriptionSuccess` expects (legacy RNIap receipt fields).
 * `react-native-iap` is stubbed in the Expo app; real purchases go through RevenueCat + StoreKit.
 */
function mapCustomerInfoToSubscriptionReceipt(
  customerInfo: CustomerInfo,
  productIdentifier: string
) {
  const sku = productIdentifier || itemSubs[0];
  const sub = customerInfo.subscriptionsByProductIdentifier?.[sku];
  const ent = Object.values(customerInfo.entitlements?.active || {})[0];
  const transactionId = sub?.storeTransactionId || sku;
  const purchaseDateIso =
    sub?.purchaseDate || sub?.originalPurchaseDate || ent?.latestPurchaseDate || new Date().toISOString();
  const transactionDate = new Date(purchaseDateIso).getTime();
  return { transactionId, orderId: transactionId, transactionDate };
}

export default class SubcriptionController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  // Customizable Area End
  focusListener: any;
  subscriptionSuccessID: string = "";
  apiStripeTokensendId: string = "";
  cancelSubscriptionApiId: string = "";
  makePaymentApiId: string = "";
  pricingListApiId: string = "";



  Customer_creditcard_id: any;
  constructor(props: Props) {
    super(props);

    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.RestAPIResponceErrorMessage),
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    ];

    this.receive = this.receive.bind(this);

    // Customizable Area Start

    this.state = {
      txtInputValue: "",
      txtSavedValue: "A",
      enableField: false,
      modalVisible: false,
      activeBt: "",
      highlightedcardindex: "0",
      paymentError: false,
      cancelSubscriptionError: false,
      isLoading: false,
      isCancelbuttonLoading: false,
      courseDurationMonth: '',
      courseExpiryMonthAndate: '',
      priceingListapi_price: '0',
      pricingListapi_expiryDate: '',
      isSubscriptionScreenLoading: true,
      userToken: "",
      isloading: false,
      subscribed: false,
      subscribedDate: undefined,
      productList: undefined,
      subscription_id: '',
      isVisible: false,
      subscriptionInfo: undefined,
      subscription: undefined,
      checkForSubscription:false,
      revenueCatPriceString: "",
      // Customizable Area Start
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  // async componentWillMount() {
  //   this.justmountedFunction()
  // }

  async justmountedFunction() {
    // this.Customer_creditcard_id = await AsyncStorage.getItem(
    //   AsynchStoragekey.AsynchStoragekey.USER_CREDITCARDID
    // );

    this.setState({
      userToken: await AsyncStorage.getItem(
        AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN
      ),
      isloading:true
    })
    // const subsStatus = await AsyncStorage.getItem(
    //   AsynchStoragekey.AsynchStoragekey.USER_SUBSCRIPTION
    // );
    const subsStatus = this.props.subscriptionState?.subscriptionInfo?.userSubscription;
    this.setState({
      subscribed:subsStatus=='subscribed'?true:false,
      subscription:subsStatus
    })
    // const subscription_id = await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_TRANSACTION_RECEIPT);
    const subscription_id = this.props.subscriptionState?.subscriptionInfo?.subscriptionId;
    
    console.log('subbbb',subscription_id,subsStatus)
    if(subsStatus =="subscribed" && (subscription_id!=='null'||subscription_id!==null)){
      // console.log('check for subscription')
      // const expiry_date = await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_EXPIRY_DATE);
      const expiry_date = this.props.subscriptionState?.subscriptionInfo?.expiryDate;

      // const subscription_id = await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_TRANSACTION_RECEIPT);
      // console.log('subscription Info',expiry_date,subscription_id)
      this.checkAvailableSubscription(subscription_id);
    }else{
      console.log('new connection')
      this.iapConnection(true);
      void this.syncRevenueCatOfferings();
      /** Expo stubs IAP — backend list is the reliable fallback when StoreKit/RevenueCat products are unavailable. */
      void this.getPricingDetails();
    }

    // console.log(await AsyncStorage.getItem(
    //   AsynchStoragekey.AsynchStoragekey.USER_CREDITCARDID
    // ), typeof (await AsyncStorage.getItem(
    //   AsynchStoragekey.AsynchStoragekey.USER_CREDITCARDID
    // )), "____________________________________kkk")

  }
  /**
   * Binds RevenueCat `current` offering price after login (uses LOGIN_ID for Purchases.logIn).
   * Falls back to react-native-iap product prices in the UI when this returns nothing.
   */
  syncRevenueCatOfferings = async () => {
    if (revenueCatOfferingsSyncInFlight) {
      return revenueCatOfferingsSyncInFlight;
    }
    const now = Date.now();
    if (
      revenueCatOfferingsLastFailureAt > 0 &&
      now - revenueCatOfferingsLastFailureAt < REVENUECAT_OFFERINGS_RETRY_MS &&
      !this.state.revenueCatPriceString
    ) {
      return;
    }

    revenueCatOfferingsSyncInFlight = (async () => {
      try {
        const ready = await ensureRevenueCatConfigured();
        if (!ready) {
          return;
        }
        const loginId = await AsyncStorage.getItem(
          AsynchStoragekey.AsynchStoragekey.LOGIN_ID
        );
        if (loginId) {
          await Purchases.logIn(loginId);
        }
        /**
         * If this throws "offerings empty" / OfferingsManager error 1, Apple returned no products.
         * Fix outside the app: bundle ID + product IDs in App Store Connect must match RevenueCat,
         * agreements signed, and (simulator) a StoreKit Configuration file. See:
         * https://rev.cat/why-are-offerings-empty
         */
        const offerings = await Purchases.getOfferings();
        const current = offerings?.current;
        const packages = current?.availablePackages ?? [];
        const sku = itemSubs[0];
        const matched =
          packages.find((p: { product?: { identifier?: string } }) => p?.product?.identifier === sku) ??
          packages[0];
        const priceStr = matched?.product?.priceString;
        if (priceStr) {
          revenueCatOfferingsLastFailureAt = 0;
          this.setState({ revenueCatPriceString: priceStr });
        }
      } catch (e) {
        revenueCatOfferingsLastFailureAt = Date.now();
        console.warn("[RevenueCat] syncRevenueCatOfferings", e);
      } finally {
        revenueCatOfferingsSyncInFlight = null;
      }
    })();

    return revenueCatOfferingsSyncInFlight;
  };

  getSubscribeNowPriceForDisplay(): string | number {
    if (this.state.revenueCatPriceString) {
      return this.state.revenueCatPriceString;
    }
    const apiPrice = this.state.priceingListapi_price;
    if (
      apiPrice !== undefined &&
      apiPrice !== null &&
      String(apiPrice).trim() !== "" &&
      String(apiPrice) !== "0"
    ) {
      return apiPrice;
    }
    if (this.state.isloading) {
      return "-";
    }
    if (Platform.OS === "android") {
      return (
        this.state.subscription?.subscriptionOfferDetails?.[0]?.pricingPhases
          ?.pricingPhaseList?.[0]?.formattedPrice ?? 0
      );
    }
    return this.state.subscription?.localizedPrice ?? 0;
  }

  async getPricingDetails() {
    console.log("PRICING LIST API IS RUNNING")
    const header = {
      "Content-Type": "application/json",
      token: await AsyncStorage.getItem(
        AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN)
      ,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.pricingListApiId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.pricingListUrl
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.pricingListApiMethodType
    );

    console.log("SENT DATA FOR PRICING LIST", requestMessage)


    runEngine.sendMessage(requestMessage.id, requestMessage);
    // Customizable Area End
    return true;
  }

  async componentDidMount() {
    // await RNIap.clearTransactionIOS();
    // this.justmountedFunction();
    // this.cancelSubscription();
    // await this.iapConnection(true);
    // this.getPricingDetails();
    
    this.focusListener = this.props.navigation.addListener("didFocus", () => {

      this.justmountedFunction();
      // this.iapConnection(true);
      // this.updatePurchase();
    })
    // await this.iappurcase();
  }
  async componentWillUnmount(): Promise<void> {

    this.props.navigation.setParams({ itisfromloginOrSignUp: null, isItfromlessonOrtheme: null });

  }

  async receive(from: string, message: Message) {
    runEngine.debugLog("Message Recived", message);

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
      var successResponse = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      

      if (apiRequestCallId === this.cancelSubscriptionApiId) {
        console.log('subscription cancellation response', successResponse)
        if (!successResponse) {
          console.log('error response', errorReponse)
        } else {
          var dataSet = successResponse?.data?.attributes;
          // await AsyncStorage.setItem(
          //   AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_TRANSACTION_RECEIPT,
          //   ""
          // );
          // await AsyncStorage.setItem(
          //   AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_TRANSACTION_DATE,
          //   ""
          // );
          // await AsyncStorage.setItem(
          //   AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_EXPIRY_DATE,
          //   ""
          // );
          // await AsyncStorage.setItem(
          //   AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_STATUS,
          //   JSON.stringify(false)
          // );
          console.log('set locale to unsubscribed')
          this.props.cancelSubscription();
          // await AsyncStorage.setItem(
          //   AsynchStoragekey.AsynchStoragekey.USER_SUBSCRIPTION,
          //   "unsubscribed"
          // );
        }
      }
      // Customizable Area Start
      // Customizable Area End
      if (apiRequestCallId === this.pricingListApiId) {
        this.setState({ isloading: false })
        if (!successResponse) {


        } else {
          let myData = successResponse?.data[0]?.attributes
          console.log("mydata of price list", myData)
          if (!myData.subscribed) {
            this.props.navigation.navigate("SubCriptionScreen")
          }

          let courseDurationMonth = new Date(myData.valid_up_to).getMonth() - new Date().getMonth()

          const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
          let courseExpiryMonth = month_names[new Date(myData.valid_up_to).getMonth()]
          let courseExpiryDate = new Date(myData.valid_up_to).getDate()

          this.setState({
            ...this.state,
            priceingListapi_price: myData.price,
            pricingListapi_expiryDate: myData.valid_up_to,
            courseDurationMonth: String(courseDurationMonth),
            courseExpiryMonthAndate: courseExpiryMonth + " " + courseExpiryDate,
            isSubscriptionScreenLoading: false
          })
          await AsyncStorage.setItem(
            AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_RENEWAL_DATE,
            courseExpiryMonth + " " + courseExpiryDate
          );
        }
      }
      if (apiRequestCallId == this.subscriptionSuccessID) {
        if (!successResponse) {
          console.log('error response', errorReponse)
          // _____________

        
          // ____________
          this.setState({isloading:false})
        } else {
          var dataSet = successResponse?.data?.attributes;
          console.log('subscription success data', dataSet,)
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
          //   dataSet?.expired_at
          // );
          
          this.props.addSubscription({
            subscriptionId: dataSet?.subscription_id,
            transactionDate: dataSet?.subscription_date,
            status: true,
            expiryDate: dataSet?.expired_at,
            userSubscription: 'subscribed',
          })
          // await AsyncStorage.setItem(
          //   AsynchStoragekey.AsynchStoragekey.USER_SUBSCRIPTION,
          //   "subscribed"
          // );
          this.setState({isloading:false})
        }
      }
    }
  }

  async getToken() {
    const msg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage)
    );
    let token: any = await AsyncStorage.getItem("LOGIN_TOKEN");
    // this.setState({token:token},()=>this.getDashboardData())
    // console.log('values ',token)
    // this.send(msg);
  }
  setCancelModal() {
    this.setState({ isVisible: !this.state.isVisible })
  }


  async sendSubscriptionSuccess(subscriptionInfo: any) {
    const header = {
      "Content-Type": configJSON.subscriptionContentType,
      token: await AsyncStorage.getItem(
        AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN
      ),
    };
    console.log('subscription object', subscriptionInfo)

    configJSON.subscriptionApiData.subscription_id = subscriptionInfo?.orderId ?? subscriptionInfo?.transactionId;
    configJSON.subscriptionApiData.subscription_date = moment(subscriptionInfo?.transactionDate).format('YYYY-MM-DDTHH:mm:ss');
    configJSON.subscriptionApiData.duration = "1.month";


    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    console.log('subscription success body', configJSON.subscriptionApiData, configJSON.subscriptionUrl, configJSON.subscriptionApiMethodType, requestMessage)

    this.subscriptionSuccessID = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.subscriptionUrl
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(configJSON.subscriptionApiData)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.subscriptionApiMethodType
    );



    runEngine.sendMessage(requestMessage.id, requestMessage);
    // Customizable Area End
    return true;
  }
  cancelSubscription = async () => {
    const header = {
      "Content-Type": configJSON.subscriptionContentType,
      token: await AsyncStorage.getItem(
        AsynchStoragekey.AsynchStoragekey.LOGIN_TOKEN
      ),
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    console.log('subscription cancel body at subscription controller', configJSON.subscriptionApiData, configJSON.subscriptionUrl, configJSON.subscriptionApiMethodType, requestMessage)

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
    // Customizable Area End
    return true;
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

  // Customizable Area Start
  // Customizable Area End

  //Create IAP Connection, Get available subscription, Update if already have any
  iapConnection = async (load:boolean) => {
    this.setState({ isloading: true })
    initConnection().catch((err) => {
      this.setState({ isloading: false })
    }).then(async (res) => {
      // if (Platform.OS === 'ios') {
      //   console.log('[Subscription]','Will clear transaction ios');
      //   await RNIap.clearTransactionIOS();
      //   console.log('[Subscription]','Did clear transaction ios');
      // }
      console.log('iap rconnection response', JSON.stringify(res))
      console.log('iap rconnection product',RNIap.getSubscriptions)

      const products = await RNIap.getSubscriptions({skus:itemSubs})

      console.log('subscription products',products)
      this.setState({ subscription: products[0], subscription_id: products[0]?.productId,  },()=>{
        console.log("iap rconnection response state",this.state)
      });
      if(load){
        this.setState({isloading: false})
      }
      if (Platform.OS == 'android') {
        console.log("here in the android")
        await flushFailedPurchasesCachedAsPendingAndroid();
    } else {
        // await clearTransactionIOS();
    }
    })
  }

  //Get Available subscription from respective stores
  getAvailableSubsFromStore = async () => {
    const products = await RNIap.getSubscriptions(itemSubs);
    console.log("getting_products>>>", products)
    this.setState({subscription_id: products[0]?.productId });
  }


  //Subscribe to a new subscription

  consumeAllSkus = async()=>{
    const availablePurchases = await RNIap.getAvailablePurchases();
    availablePurchases.forEach((purchase) => {
        RNIap.finishTransaction(purchase, true).then((res)=>{
          // console.log('consumption finished',res)
        }).catch((err)=>{
          console.log('err @ transaction consume',err)
        });
      });
     
  }

  /**
   * In-app purchase via RevenueCat (StoreKit on iOS). `react-native-iap` is stubbed in Metro and never shows a sheet.
   */
  purchaseSubscriptionThroughRevenueCat = async () => {
    const loginId = await AsyncStorage.getItem(
      AsynchStoragekey.AsynchStoragekey.LOGIN_ID
    );
    if (loginId) {
      await Purchases.logIn(loginId);
    }
    const offerings = await Purchases.getOfferings();
    const current = offerings?.current;
    const packages = current?.availablePackages ?? [];
    const sku = itemSubs[0];
    const matched =
      packages.find((p) => p?.product?.identifier === sku) ?? packages[0];
    if (!matched) {
      this.setState({ isloading: false });
      Alert.alert(
        "Subscription unavailable",
        "No subscription products were returned. In RevenueCat, link product ID \"" +
          sku +
          "\" to the current offering. For simulator testing, set the scheme’s StoreKit Configuration to Storekit.storekit."
      );
      return;
    }
    const { customerInfo, productIdentifier } = await Purchases.purchasePackage(matched);
    const legacy = mapCustomerInfoToSubscriptionReceipt(customerInfo, productIdentifier);
    await this.updateSubscription(legacy);
  };

  subscribe = async () => {
    try {
      this.setState({ isloading: true });
      if (!(await ensureRevenueCatConfigured())) {
        this.setState({ isloading: false });
        Alert.alert(
          "Subscription unavailable",
          "Add the RevenueCat public API key (e.g. EXPO_PUBLIC_REVENUECAT_IOS_API_KEY or configJSON.revenueCatIosApiKey)."
        );
        return;
      }
      try {
        await this.purchaseSubscriptionThroughRevenueCat();
      } catch (e: unknown) {
        const pe = e as { code?: string; userCancelled?: boolean | null; message?: string };
        this.setState({ isloading: false });
        if (pe?.userCancelled || pe?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
          return;
        }
        console.warn("[RevenueCat] purchase failed", e);
        Alert.alert(
          "Subscription could not be purchased",
          pe?.message && String(pe.message).length > 0 ? String(pe.message) : "Please try again later."
        );
      }
    } catch (err) {
      this.setState({ isloading: false });
      console.warn("subscribe", err, this.state);
    }
  };
  updateSubscription = async (subDetail: any) => {
console.log('updating purchase',subDetail)
    await this.updatePurchase();
if(Platform.OS=='android')
{
  let changeddetails=JSON.parse (subDetail[0]?.transactionReceipt)
  console.log(changeddetails,"changeddetails")
  this.sendSubscriptionSuccess(changeddetails);
  
  this.setState({ subscribed: true, subscribedDate: changeddetails?.transactionDate,isloading:false })
}
else{
  this.sendSubscriptionSuccess(subDetail);
    this.setState({ subscribed: true, subscribedDate: subDetail?.transactionDate,isloading:false })

}

  }


  
  //Check for available purchased subscription
  checkAvailableSubscription = async (subscriptionId:any) => {
    await this.iapConnection(true);
    await getAvailablePurchases().then(async (res) => {
      if(Platform.OS=='ios'){
        await RNIap.clearTransactionIOS();
      }
      // console.log('purchased subs length',res.length)
      if (res.length > 0 && subscriptionId!==undefined) {
        // console.log('subscription infor r',res[0])
        let subDetail = await res.find((x)=>{
          // console.log('subscription info',x.transactionId,x.originalTransactionIdentifierIOS,subscriptionId,x.productId)
          if(x.productId==itemSubs[0] && (String(x.transactionId) === subscriptionId||String(x?.originalTransactionIdentifierIOS) == subscriptionId)){
            // console.log('found subscription info',x.transactionId,x.originalTransactionIdentifierIOS,subscriptionId,x)
            return x;
          }
        });
        // console.log('subss Detail',JSON.stringify(subDetail),subscriptionId);
        if(subDetail!==undefined){
        await this.updatePurchase();
        this.setState({
          subscriptionInfo: subDetail,
          isloading:false,
        })
        this.setState({ subscribed: true, subscribedDate: subDetail?.transactionDate })
      }else{
        await this.cancelSubscription();
        this.setState({
          subscribed:false,subscriptionInfo:undefined,isloading:false
        })
      }
      } else {
        this.cancelSubscription();
        // await AsyncStorage.setItem(
        //   AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_TRANSACTION_RECEIPT,
        //   ""
        // );
        // await AsyncStorage.setItem(
        //   AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_TRANSACTION_DATE,
        //   ""
        // );
        // await AsyncStorage.setItem(
        //   AsynchStoragekey.AsynchStoragekey.SUBSCRIPTION_STATUS,
        //   JSON.stringify(false)
        // );
        // await AsyncStorage.setItem(
        //   AsynchStoragekey.AsynchStoragekey.USER_SUBSCRIPTION,
        //   "unsubscribed"
        // );
        this.props.cancelSubscription();
        this.setState({
          subscribed: false,
          isloading:false,
          subscribedDate: undefined
        })
      }
    }).catch((err) => {
      console.log('purchased error', err)
    })
  }

  //Updating purchase of subscription
  updatePurchase =  () => {
    console.log('update purchzase function')
    {
      if(Platform.OS=='android'){
    flushFailedPurchasesCachedAsPendingAndroid().then((res)=>{console.log('flushed transaction',res)}).catch((err)=>{console.log('flushed transaction',err)})
  }
    else{
      RNIap.clearTransactionIOS();
    }

  }
     purchaseUpdatedListener(
      async (purchase: ProductPurchase) => {
        // console.log('purchaseUpdatedListener', purchase);
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          try {
            if (Platform.OS == 'ios') {

              await RNIap.finishTransaction(purchase,false).then((res) => {
                console.log('transaction finish', purchase,res)
              });
            }
            if (Platform.OS == 'android') {
              // RNIap.acknowledgePurchaseAndroid(purchase?.purchaseToken).then((res) => {
              //   console.log('acknowledged subscription',res)
                await RNIap.finishTransaction(purchase,true).catch((err) => {
                  console.log(err.code, err.message)
                }).then((res)=>{
                  console.log('transaction finish android',res)
                });
              // })
            }
            
          } catch (ackErr) {
            this.setState({isloading:false})
            console.warn('ackErr', ackErr);
          }
          console.log('Purchase subscription transaction finished')
        } else {
          console.log('no reciept for transaction', receipt)
          this.setState({isloading:false})
          // Retry / conclude the purchase is fraudulent, etc...
        }
        this.setState({isloading:false})
      },
    );
  }

  // Restoring Subscription
  restoreSubscription = async () => {
    this.setState({ isloading: true });
    try {
      if (await ensureRevenueCatConfigured()) {
        const loginId = await AsyncStorage.getItem(
          AsynchStoragekey.AsynchStoragekey.LOGIN_ID
        );
        if (loginId) {
          await Purchases.logIn(loginId);
        }
        const info = await Purchases.restorePurchases();
        const activeEnts = Object.keys(info.entitlements?.active ?? {});
        const hasSku = info.activeSubscriptions?.includes?.(itemSubs[0]) ?? false;
        this.setState({ isloading: false });
        if (activeEnts.length > 0 || hasSku) {
          Alert.alert("Restore successful", "Your EtOH Coach subscription was restored on this device.");
        } else {
          Alert.alert("", "You do not have an active subscription to restore.");
        }
        return;
      }
      const activeSubscription =
        this.props.subscriptionState?.subscriptionInfo?.userSubscription;
      const purchases = await RNIap.getAvailablePurchases();
      const newState = { premium: false, ads: true };
      const restoredTitles: string[] = [];
      if (purchases.length > 0 && activeSubscription === "subscribed") {
        purchases.forEach(async (purchase) => {
          this.setState({ subscriptionInfo: purchase });
          switch (purchase.productId) {
            case itemSubs[0]:
              newState.premium = true;
              restoredTitles.push("Premium Version");
              break;
            default:
              break;
          }
        });
        this.setState({ isloading: false });
        Alert.alert("Restore successful", "You successfully restored the EtOH Coach subscription");
      } else {
        this.setState({ isloading: false });
        Alert.alert("", "You do not have any active subscription currently");
      }
    } catch (err) {
      this.setState({ isloading: false });
      console.warn(err);
      Alert.alert("", "You do not have any active subscription currently");
    }
  };

  //Cancel Subscription Linking
  cancelSubs = () => {
    if (Platform.OS == 'ios') {
      Linking.openURL('https://apps.apple.com/account/subscriptions');
      // Linking.openURL('https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/manageSubscriptions')
    } else {
      Linking.openURL(`https://play.google.com/store/account/subscriptions?package=com.EtOHFinal&sku=${itemSubs[0]}`)
    }
    this.setCancelModal();
  }
  // Customizable Area End
}
