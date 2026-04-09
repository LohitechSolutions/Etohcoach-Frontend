console.disableYellowBox = true;
import React from 'react';
import EditProfile from '../blocks/user-profile-basic/src/EditProfile';
import ChangePassword from '../blocks/user-profile-basic/src/ChangePassword';
import ChangeEmail from '../blocks/user-profile-basic/src/ChangeEmail';
import {createStackNavigator, createBottomTabNavigator} from 'react-navigation';
import {StateProvider} from '../components/src/context/AppStateContext';
import '../blocks/LanguageOptions/src/component/i18n/i18n.config';
import {langaugeFunction} from '../blocks/LanguageOptions/src/component/i18n/i18n.config';
import Context from '../components/src/context/context';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Landingscreen from '../blocks/LandingScreen/src/Landing';
import HomeScreen from '../components/src/HomeScreen';
import InfoPage from '../blocks/info-page/src/InfoPageBlock';
import EmailNotifications from '../blocks/EmailNotifications/src/EmailNotifications';
import CfAppleLogin17 from '../blocks/CfAppleLogin17/src/CfAppleLogin17';
import BulkUploading from '../blocks/BulkUploading/src/BulkUploading';
import SocialMediaAccountLoginScreen from '../blocks/social-media-account-login/src/SocialMediaAccountLoginScreen';
import CfFlashcards2 from '../blocks/CfFlashcards2/src/CfFlashcards2';
import AssessmentTest from '../blocks/AssessmentTest/src/AssessmentTest';
import LanguageOptions from '../blocks/LanguageOptions/src/LanguageOptions';
import LanguageOptionModal from "../blocks/LanguageOptions/src/LanguageOptionsModal";
import Polling from '../blocks/Polling/src/Polling';
import Customisableusersubscriptions from '../blocks/customisableusersubscriptions/src/Customisableusersubscriptions';
import SubscriptionDetails from '../blocks/customisableusersubscriptions/src/SubscriptionDetails';
import SubscriptionBilling from '../blocks/SubscriptionBilling/src/SubscriptionBilling';
import Search from '../blocks/search/src/Search';
import Leaderboard from '../blocks/Leaderboard/src/Leaderboard';
import ForgotPassword from '../blocks/forgot-password/src/ForgotPassword';
import ForgotPasswordOTP from '../blocks/forgot-password/src/ForgotPasswordOTP';
import NewPassword from '../blocks/forgot-password/src/NewPassword';
import Sorting from '../blocks/sorting/src/Sorting';
import Library2 from '../blocks/Library2/src/Library2';
import Contactus from '../blocks/contactus/src/Contactus';
import AddContactus from '../blocks/contactus/src/AddContactus';
import CountryCodeSelector from '../blocks/country-code-selector/src/CountryCodeSelector';
import CountryCodeSelectorTable from '../blocks/country-code-selector/src/CountryCodeSelectorTable';
import StripeIntegration from '../blocks/StripeIntegration/src/StripeIntegration';
import Gamification from '../blocks/Gamification/src/Gamification';
import AdminConsole3 from '../blocks/AdminConsole3/src/AdminConsole3';
import OTPInputAuth from '../blocks/otp-input-confirmation/src/OTPInputAuth';
import Notes from '../blocks/Notes/src/Notes';
import EmailAccountLoginBlock from '../blocks/email-account-login/src/EmailAccountLoginBlock';
import TermsAndConditions from '../blocks/TermsAndConditions/src/TermsAndConditions';
// ==================
import ApiCall from '../blocks/TermsAndConditions/src/ApiCall';
// ===================
import Pushnotifications from '../blocks/pushnotifications/src/Pushnotifications';
import DataImportexportcsv from '../blocks/DataImportexportcsv/src/DataImportexportcsv';
import Annotations from '../blocks/Annotations/src/Annotations';
import Scoring from '../blocks/Scoring/src/Scoring';
import PaymentAdmin2 from '../blocks/PaymentAdmin2/src/PaymentAdmin2';
import EmailAccountRegistration from '../blocks/email-account-registration/src/EmailAccountRegistration';
import ContentManagement from '../blocks/ContentManagement/src/ContentManagement';
import Splashscreen from '../blocks/splashscreen/src/Splashscreen';
import QuestionBank from '../blocks/QuestionBank/src/QuestionBank';
// import Analytics from '../blocks/analytics/src/Analytics';
import Categoriessubcategories from '../blocks/categoriessubcategories/src/Categoriessubcategories';
import Settings5 from '../blocks/Settings5/src/Settings5';
import UserProfileBasicBlock from '../blocks/user-profile-basic/src/UserProfileBasicBlock';
import Dashboard from '../blocks/dashboard/src/Dashboard';
import Filteritems from '../blocks/filteritems/src/Filteritems';
import Filteroptions from '../blocks/filteritems/src/Filteroptions';
import SocialMediaAccountRegistrationScreen from '../blocks/social-media-account-registration/src/SocialMediaAccountRegistrationScreen';
import Notifications from '../blocks/notifications/src/Notifications';
import Catalogue from '../blocks/catalogue/src/Catalogue';
import ManageNotifications from '../blocks/user-profile-basic/src/ManageNotifications';
import SubCriptionScreen from '../blocks/SubCriptionScreen/src/Subcription';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import SubcriptionSuccsess from '../blocks/SubCriptionScreen/src/SubcriptionSuccsess';
import OverView from '../blocks/catalogue/src/OverView';
import FilterModal from '../blocks/catalogue/src/FilterModal';
import StartCourceModal from '../blocks/catalogue/src/StartCourceModal';
import TakeQuizeModal from '../blocks/catalogue/src/TakeQuizeModal';
import MockExamModal from '../blocks/catalogue/src/MockExamModal';
import ReviewModal from '../blocks/catalogue/src/ReviewModal';
import CatalogueFive from '../blocks/catalogue/src/CatalogueFIve';
import settings from '../blocks/user-profile-basic/src/settings';
import {url} from 'inspector';
import {DeviceEventEmitter, Linking, Platform,Dimensions} from 'react-native';
//@ts-ignore
import ThemesScr from '../blocks/catalogue/src/ThemesScr';
import CatalogueStudy from '../blocks/catalogue/src/CatalogueStudy';
import PollingScr from '../blocks/CfFlashcards2/src/PollingScr';
import overlayView from '../blocks/Leaderboard/Components/OverlayView';
//@ts-ignore
import WebviewComponent from '../blocks/contactus/Component/WebviewComponent';
import PasswordChanged from '../blocks/forgot-password/src/passwordChanged';
import NoInternet from '../blocks/Internet/src/Internet';
import {Image} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import CfFlashCardOne from '../blocks/catalogue/src/CfFlashCardOne';
import FlashCardQuestionAnswer from '../blocks/catalogue/src/FlashCardQuestionAnswer';
import RevealAnswer from '../blocks/catalogue/src/RevealAnswer';
import Congratulation from '../blocks/catalogue/src/Congratulation';
import moxExamQuestionOne from '../blocks/catalogue/src/moxExamQuestionOne';
import ReArrangeOrder from '../blocks/catalogue/src/ReArrangeOrder';
import MocExamInit from '../blocks/catalogue/src/MocExamInit';
import QuizzesExamInit from '../blocks/catalogue/src/QuizzesExamInit';
import Scale from '../components/src/Scale';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AsynchStoragekey from '../mobile/src/utils/asynchKeys';
import {Provider} from 'react-redux';

import { PersistGate } from 'redux-persist/integration/react'
import {withTranslation} from 'react-i18next';
import i18next from 'i18next';
import { offlineDataCall, offlineDataWatcher } from './src/store/sagas/OfflineData';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../mobile/src/store/sagas';
import { configStore, sagaMiddleware } from './src/store';
import DeviceInfo from 'react-native-device-info';
import { FONTS } from '../framework/src/Fonts';

let messagingInstance: any = null;
try {
  const messagingModule = require('@react-native-firebase/messaging').default;
  if (typeof messagingModule === 'function') {
    messagingInstance = messagingModule();
  }
} catch (error) {
  console.log('Firebase messaging unavailable in current runtime');
}

const {store,persistor} = configStore();
// sagaMiddleware.run(rootSaga);
// Customizable Area Start 
const deviceModel = DeviceInfo.getModel();


console.log("iphonedataredux",deviceModel)

const windowHeight = Dimensions.get('window').height;
console.log("height of this device",windowHeight)
let iphone11={
  paddingBottom:33,
  height:Scale(90)
}
let iphone12={
  paddingBottom:Scale(35),
  height:Scale(90)
}
let iphone14={
  paddingBottom:Scale(35),
  height:Scale(60)
}


let iphone14pro={
  paddingBottom:Scale(35),
  height:Scale(90)
}

let iphoneX={
  paddingBottom:Scale(35),
  height:Scale(90)
}

let iPhone14Plus={
  paddingBottom:Scale(32),
  height:Scale(90)
}
let iPhone14ProMax={
  paddingBottom:Scale(32),
  height:Scale(90)
}
let iPhone13={
  paddingBottom:Scale(35),
  height:Scale(90)
}

let devicepaddingbottom
let deviceheight
if(Platform.OS=='ios')
{
  if(deviceModel=="iPhone X")
{
  devicepaddingbottom=iphoneX.paddingBottom
  deviceheight=iphoneX.height
}
  else if(deviceModel=="iPhone 11")
  {
    devicepaddingbottom=iphone11.paddingBottom
    deviceheight=iphone11.height
  }
  else if(deviceModel=="iPhone 12")
  {
    devicepaddingbottom=iphone12.paddingBottom
    deviceheight=iphone12.height
  }
 else if(deviceModel=="iPhone 13")
  {
    devicepaddingbottom=iPhone13.paddingBottom
    deviceheight=iPhone13.height
  }
  else if(deviceModel=="iPhone 14")
  {
    devicepaddingbottom=iphone14.paddingBottom
    deviceheight=iphone14.height
  }
  else if(deviceModel=="iPhone 14 Pro")
  {
    devicepaddingbottom=iphone14pro.paddingBottom
    deviceheight=iphone14pro.height
  }
  else if(deviceModel=="iPhone 14 Plus")
  {
    devicepaddingbottom=iPhone14Plus.paddingBottom
    deviceheight=iPhone14Plus.height
  }
  else if(deviceModel.includes("iPhone 11 Pro Max"))
  {
    devicepaddingbottom=0
    deviceheight=Scale(60)
  }
  else if(deviceModel.includes("Pro")){
    devicepaddingbottom=iPhone14ProMax.paddingBottom
    deviceheight=iPhone14ProMax.height
  }
  else if(deviceModel.includes("iPhone XS")||deviceModel.includes("iPhone XR"))
  {
    devicepaddingbottom=0
    deviceheight=Scale(60)
  }
  else if(deviceModel.includes("mini"))
{
  devicepaddingbottom=0
  deviceheight=Scale(60)
}
else{
  devicepaddingbottom=iphone11.paddingBottom
  deviceheight=iphone11.height
}
}
else{
  devicepaddingbottom=Scale(15)
  deviceheight=Scale(75)
}

const BottemStack = createBottomTabNavigator(
  {
    Dashboard: {
      screen: Dashboard,
      navigationOptions: {
        title: i18next.t('Dashboard'),
        tabBarIcon: ({focused}) => (
          <Image
            source={require('../mobile/assets/images/dashboard.png')}
            style={{
              height: hp(2.5),
              width: hp(2.5),
              tintColor: focused ? 'black' : 'grey',
            }}
          />
        ),
      },
    },
    Catalogue: {
      screen: Catalogue,
      navigationOptions: {
        title: i18next.t('Catalogue'),
        tabBarIcon: ({focused}) => (
          <Image
            source={require('../mobile/assets/images/catalogue.png')}
            style={{
              height: hp(2.9),
              width: hp(2.9),
              tintColor: focused ? 'black' : 'grey',
            }}
          />
        ),
      },
    },
    Leaderboard: {
      screen: Leaderboard,
      navigationOptions: {
        title: i18next.t('Leaderboard'),
        tabBarIcon: ({focused}) => (
          <Image
            source={require('../mobile/assets/images/leaderBoard.png')}
            style={{
              height: hp(2.8),
              width: hp(2.8),
              tintColor: focused ? 'black' : 'grey',
            }}
          />
        ),
      },
    },
    UserProfileBasicBlock: {
      screen: UserProfileBasicBlock,
      navigationOptions: {
        title: 'Profile',
        tabBarIcon: ({focused}) => (
          <Image
            source={require('../mobile/assets/images/profile.png')}
            style={{
              height: hp(3.5),
              width: hp(3.5),
              tintColor: focused ? 'black' : 'grey',
            }}
          />
        ),
      },
    },
  },
  {
    tabBarOptions:  {
      activeTintColor: 'black',
      inactiveTintColor: 'grey',
      tabStyle: {
        // paddingBottom:Platform.OS=="android"?Scale(20):Scale(20) ,
        // paddingTop: Scale(0.7),
        paddingBottom:devicepaddingbottom
     
      },
       
      labelStyle:{
        fontFamily:FONTS.Roboto_Regular,
        fontSize:Scale(13)
      },
      style: {
        height: deviceheight
        
      },
    },
  },
);
// Customizable Area End
const themesRootStack = createStackNavigator(
  {
    ThemesScreen: {
      screen: ThemesScr,
      navigationOptions: {header: null, gesturesEnabled: false},
    },
    ProductCategory: {
      screen: CatalogueFive,
      navigationOptions: {
        title: 'ProductCategory',
        header: null,
        gesturesEnabled: false,
      },
    },
    CatalogueStudies: {
      screen: CatalogueStudy,
      navigationOptions: {
        title: 'ProductDetails',
        header: null,
        gesturesEnabled: false,
      },
    },
    Congratulation: {
      screen: Congratulation,
      navigationOptions: {
        title: 'Congratulation',
        header: null,
        gesturesEnabled: false,
      },
    },
  },
  {
    initialRouteName: 'ThemesScreen',
  },
);

const BottemCourse = createBottomTabNavigator(
  {
    Catalogue: {
      screen: BottemStack,
      navigationOptions: {
        tabBarVisible: false,
        title: 'Back',
        tabBarIcon: ({focused}) => (
          <Image
            source={require('../blocks/catalogue/assets/leftArrow.png')}
            style={{tintColor: focused ? 'black' : 'grey'}}
          />
        ),
      },
    },
    OverView: {
      screen: OverView,
      navigationOptions: {
        tabBarVisible: false,
        title: 'OverView',
        tabBarIcon: ({focused}) => (
          <Image
            source={require('../blocks/catalogue/assets/overView.png')}
            style={{tintColor: focused ? 'black' : 'grey'}}
          />
        ),
      },
    },

    Leaderboard: {
      screen: themesRootStack,
      navigationOptions: {
        tabBarVisible: false,
        title: 'Themes',
        tabBarIcon: ({focused}) => (
          <Image
            source={require('../blocks/catalogue/assets/leaderBoard.png')}
            style={{tintColor: focused ? 'black' : 'grey'}}
          />
        ),
      },
    },
    UserProfileBasicBlock: {
      screen: Notes,
      navigationOptions: {
        header: null,
        tabBarVisible: false,
        title: 'Notes',
        tabBarIcon: ({focused}) => (
          <Image
            source={require('../blocks/catalogue/assets/notes.png')}
            style={{tintColor: focused ? 'black' : 'grey'}}
          />
        ),
      },
    },
    // initialRouteName: "OverView"
  },

  // tabBarIcon: ({ tintColor, focused, iconIndex }: any) => {
  //   const { routeName } = navigation.state;
  {
    tabBarOptions: {
      activeTintColor: 'black',
      inactiveTintColor: 'grey',
      tabStyle: {
        // paddingBottom: hp(0.5),
        paddingTop: hp(0.7),
        marginBottom: Scale(20),
      },
      style: {
        borderTopWidth: 0,
        height: hp(8),
      },
    },
    initialRouteName: 'OverView',
  },
);

const NonAuthStack = createStackNavigator(
  {
    Landing: {screen: Landingscreen, navigationOptions: {title: 'Landingscreen' ,header: null}},
    EmailAccountLoginBlock: {
      screen: EmailAccountLoginBlock,
      navigationOptions: {title: 'EmailAccountLoginBlock', header: null},
    },
    EmailAccountRegistration: {
      screen: EmailAccountRegistration,
      navigationOptions: {title: 'EmailAccountRegistration', header: null},
    },
    ForgotPassword: {
      screen: ForgotPassword,
      navigationOptions: {title: 'ForgotPassword', header: null},
    },
    ForgotPasswordOTP: {
      screen: ForgotPasswordOTP,
      navigationOptions: {title: 'ForgotPasswordOTP', header: null},
    },
    PasswordChanged: {
      screen: PasswordChanged,
      navigationOptions: {title: 'PasswordChanged', header: null},
    },
    NewPassword: {
      screen: NewPassword,
      navigationOptions: {title: 'NewPassword', header: null},
    },
    SubCriptionScreen: {
      screen: SubCriptionScreen,
      navigationOptions: {header: null, title: 'SubCriptionScreen'},
    },
    SubcriptionSuccsess: {
      screen: SubcriptionSuccsess,
      navigationOptions: {header: null, title: 'SubcriptionSuccsess'},
    },
    FilterModal: {
      screen: FilterModal,
      navigationOptions: {header: null, title: 'FilterModal'},
    },
    LanguageOptionModal: {
      screen: LanguageOptionModal,
      navigationOptions: {header: null, title: 'LanguageOptionModal'},
    },  
    StartCourceModal: {
      screen: StartCourceModal,
      navigationOptions: {header: null, title: 'StartCourceModal'},
    },
    TakeQuizeModal: {
      screen: TakeQuizeModal,
      navigationOptions: {header: null, title: 'TakeQuizeModal'},
    },
    MockExamModal: {
      screen: MockExamModal,
      navigationOptions: {header: null, title: 'MockExamModal'},
    },
    // ReviewModal: { screen: ReviewModal, navigationOptions: { header: null, title: "ReviewModal" } },
    TermsAndConditions: {
      screen: TermsAndConditions,
      navigationOptions: {header: null, title: 'TermsAndConditions'},
    },
    // ApiCall: {
    //   screen:ApiCall,
    //   navigationOptions: { header: null, title: 'TermsAndConditions' },
    // },
  },
  {
    initialRouteName: 'Landing',
  },
);

const AuthStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {header: null, title: 'Home'},
    },
    CatalogueFive: {
      screen: CatalogueFive,
      navigationOptions: {header: null, title: 'CatalogueFive'},
    },
    PollingScr: {
      screen: PollingScr,
      navigationOptions: {header: null, title: 'PollingScr'},
    },
    CatalogueStudy: {
      screen: CatalogueStudy,
      navigationOptions: {header: null, title: 'CatalogueStudy'},
    },
    EmailNotifications: {
      screen: EmailNotifications,
      navigationOptions: {title: 'EmailNotifications'},
    },
    CfAppleLogin17: {
      screen: CfAppleLogin17,
      navigationOptions: {title: 'CfAppleLogin17'},
    },
    BulkUploading: {
      screen: BulkUploading,
      navigationOptions: {title: 'BulkUploading'},
    },
    SocialMediaAccountLoginScreen: {
      screen: SocialMediaAccountLoginScreen,
      navigationOptions: {title: 'SocialMediaAccountLoginScreen'},
    },
    CfFlashcards2: {
      screen: CfFlashcards2,
      navigationOptions: {title: 'CfFlashcards2'},
    },
    AssessmentTest: {
      screen: AssessmentTest,
      navigationOptions: {title: 'AssessmentTest'},
    },
    LanguageOptions: {
      screen: LanguageOptions,
      navigationOptions: {header: null, title: 'LanguageOptions'},
    },
    Polling: {screen: Polling, navigationOptions: {title: 'Polling'}},
    Customisableusersubscriptions: {
      screen: Customisableusersubscriptions,
      navigationOptions: {title: 'Customisableusersubscriptions'},
    },
    SubscriptionDetails: {
      screen: SubscriptionDetails,
      navigationOptions: {title: 'SubscriptionDetails'},
    },
    SubscriptionBilling: {
      screen: SubscriptionBilling,
      navigationOptions: {title: 'SubscriptionBilling'},
    },
    Search: {screen: Search, navigationOptions: {title: 'Search'}},
    Leaderboard: {
      screen: Leaderboard,
      navigationOptions: {title: 'Leaderboard'},
    },
    Sorting: {screen: Sorting, navigationOptions: {title: 'Sorting'}},
    Library2: {screen: Library2, navigationOptions: {title: 'Library2'}},
    Contactus: {
      screen: Contactus,
      navigationOptions: {header: null, title: 'Contactus'},
    },
    WebviewComponent: {
      screen: WebviewComponent,
      navigationOptions: {header: null, title: 'WebviewComponent'},
    },
    AddContactus: {
      screen: AddContactus,
      navigationOptions: {title: 'AddContactus'},
    },
    CountryCodeSelector: {
      screen: CountryCodeSelector,
      navigationOptions: {title: 'CountryCodeSelector'},
    },
    CountryCodeSelectorTable: {
      screen: CountryCodeSelectorTable,
      navigationOptions: {title: 'CountryCodeSelectorTable'},
    },
    StripeIntegration: {
      screen: StripeIntegration,
      navigationOptions: {header: null, title: 'StripeIntegration'},
    },
    Gamification: {
      screen: Gamification,
      navigationOptions: {title: 'Gamification'},
    },
    AdminConsole3: {
      screen: AdminConsole3,
      navigationOptions: {title: 'AdminConsole3'},
    },
    OTPInputAuth: {
      screen: OTPInputAuth,
      navigationOptions: {title: 'OTPInputAuth'},
    },
    Notes: {screen: Notes, navigationOptions: {title: 'Notes', header: null}},
    TermsAndConditions: {
      screen: TermsAndConditions,
      navigationOptions: {header: null, title: 'TermsAndConditions'},
    },
    Pushnotifications: {
      screen: Pushnotifications,
      navigationOptions: {title: 'Pushnotifications'},
    },
    LanguageOptionModal: {
      screen: LanguageOptionModal,
      navigationOptions: {header: null, title: 'LanguageOptionModal'},
    },
    DataImportexportcsv: {
      screen: DataImportexportcsv,
      navigationOptions: {title: 'DataImportexportcsv'},
    },
    Annotations: {
      screen: Annotations,
      navigationOptions: {title: 'Annotations', header: null},
    },
    Scoring: {
      screen: Scoring,
      navigationOptions: {title: 'Scoring', header: null},
    },
    PaymentAdmin2: {
      screen: PaymentAdmin2,
      navigationOptions: {title: 'PaymentAdmin2'},
    },
    ContentManagement: {
      screen: ContentManagement,
      navigationOptions: {title: 'ContentManagement'},
    },
    QuestionBank: {
      screen: QuestionBank,
      navigationOptions: {title: 'QuestionBank'},
    },
    // Analytics: {screen: Analytics, navigationOptions: {title: 'Analytics'}},
    Categoriessubcategories: {
      screen: Categoriessubcategories,
      navigationOptions: {title: 'Categoriessubcategories'},
    },
    Settings5: {screen: Settings5, navigationOptions: {title: 'Settings5'}},
    UserProfileBasicBlock: {
      screen: UserProfileBasicBlock,
      navigationOptions: {title: 'UserProfileBasicBlock'},
    },
    // ------------bottemTab Add -----------//
    Dashboard: {
      screen: BottemStack,
      navigationOptions: {title: 'Dashboard', header: null},
    },
    NoInternet: {
      screen: NoInternet,
      navigationOptions: {title: 'NoInternet', header: null},
    },
    // ------------bottemTab End -----------//
    Filteritems: {
      screen: Filteritems,
      navigationOptions: {title: 'Filteritems'},
    },
    Filteroptions: {
      screen: Filteroptions,
      navigationOptions: {title: 'Filteroptions'},
    },
    SocialMediaAccountRegistrationScreen: {
      screen: SocialMediaAccountRegistrationScreen,
      navigationOptions: {title: 'SocialMediaAccountRegistrationScreen'},
    },
    Notifications: {
      screen: Notifications,
      navigationOptions: {header: null, title: 'Notifications'},
    },
    Catalogue: {screen: Catalogue, navigationOptions: {title: 'Catalogue'}},
    InfoPage: {screen: InfoPage, navigationOptions: {title: 'Info'}},
    SubCriptionScreen: {
      screen: SubCriptionScreen,
      navigationOptions: {header: null, title: 'SubCriptionScreen'},
    },
    // ---------------------Course Bottem Tab Add--------------------- //
    OverView: {
      screen: BottemCourse,
      navigationOptions: {header: null, title: 'OverView'},
    },
    // ---------------------Course Bottem Tab End--------------------- //
    settings: {
      screen: settings,
      navigationOptions: {header: null, title: 'settings'},
    },
    EditProfile: {
      screen: EditProfile,
      navigationOptions: {header: null, title: 'EditProfile'},
    },
    ChangePassword: {
      screen: ChangePassword,
      navigationOptions: {header: null, title: 'ChangePassword'},
    },
    ChangeEmail: {
      screen: ChangeEmail,
      navigationOptions: {header: null, title: 'ChangeEmail'},
    },
    ManageNotifications: {
      screen: ManageNotifications,
      navigationOptions: {header: null, title: 'ManageNotifications'},
    },
    EmailAccountLoginBlock: {
      screen: EmailAccountLoginBlock,
      navigationOptions: {title: 'EmailAccountLoginBlock', header: null},
    },
    FilterModal: {
      screen: FilterModal,
      navigationOptions: {header: null, title: 'FilterModal'},
    },
    StartCourceModal: {
      screen: StartCourceModal,
      navigationOptions: {header: null, title: 'StartCourceModal'},
    },
    TakeQuizeModal: {
      screen: TakeQuizeModal,
      navigationOptions: {header: null, title: 'TakeQuizeModal'},
    },
    MockExamModal: {
      screen: MockExamModal,
      navigationOptions: {header: null, title: 'MockExamModal'},
    },
    ReviewModal: {
      screen: ReviewModal,
      navigationOptions: {header: null, title: 'ReviewModal'},
    },
    CfFlashCardOne: {
      screen: CfFlashCardOne,
      navigationOptions: {header: null, title: 'CfFlashCardOne'},
    },
    RevealAnswer: {
      screen: RevealAnswer,
      navigationOptions: {header: null, title: 'RevealAnswer'},
    },
    Congratulation: {
      screen: Congratulation,
      navigationOptions: {header: null, title: 'Congratulation'},
    },
    EmailAccountRegistration: {
      screen: EmailAccountRegistration,
      navigationOptions: {title: 'EmailAccountRegistration', header: null},
    },
    ForgotPassword: {
      screen: ForgotPassword,
      navigationOptions: {title: 'ForgotPassword', header: null},
    },
    ForgotPasswordOTP: {
      screen: ForgotPasswordOTP,
      navigationOptions: {title: 'ForgotPasswordOTP', header: null},
    },
    NewPassword: {
      screen: NewPassword,
      navigationOptions: {title: 'NewPassword', header: null},
    },
    SubcriptionSuccsess: {
      screen: SubcriptionSuccsess,
      navigationOptions: {header: null, title: 'SubcriptionSuccsess'},
    },
    moxExamQuestionOne: {
      screen: moxExamQuestionOne,
      navigationOptions: {header: null, title: 'moxExamQuestionOne'},
    },
    ReArrangeOrder: {
      screen: ReArrangeOrder,
      navigationOptions: {header: null, title: 'ReArrangeOrder'},
    },
    MocExamInit: {
      screen: MocExamInit,
      navigationOptions: {header: null, title: 'MocExamInit'},
    },
    QuizzesExamInit: {
      screen: QuizzesExamInit,
      navigationOptions: {header: null, title: 'MocExamInit'},
    },
    Themes: {
      screen: ThemesScr,
      navigationOptions: {header: null, gesturesEnabled: false},
    },
    OverViews: {
      screen: OverView,
      navigationOptions: {
     
        header: null, gesturesEnabled: false
   
      }
  }
},
  {
    initialRouteName: 'Dashboard',
  },
);

const MainStack = createStackNavigator(
  {
    SPLASH: {
      screen: Splashscreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    NonAuthenticated: {
      screen: NonAuthStack,
      navigationOptions: {
        headerShown: false,
      },
    },
    Authenticated: {
      screen: AuthStack,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    headerMode: 'none',
    defaultNavigationOptions: {
      headerVisible: false,
      gestureEnabled: false,
    },
  },
);

if (!HomeScreen.instance) {
  const defaultProps = {
    navigation: null,
    id: 'HomeScreen',
  };
  const homeScreen = new HomeScreen(defaultProps);
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: false,
      unsubcribe: '',
    };
  }


  async componentDidMount() {
    console.log('c@lled Mount :::');
    this.requestUserPermission();
    // this.notificationListener()
    // this.messageListener();
    this.CheckConnection();
    DeviceEventEmitter.addListener('checkInternet', () => {
      this.CheckConnection();
    });
    await langaugeFunction();
      // await offlineDataCall()
      // offlineDataWatcher().next()
  }

  requestUserPermission = async () => {
    console.log('request');
    if (!messagingInstance) {
      return;
    }

    const authStatus = await messagingInstance.requestPermission();
    console.log('authStatus ::', authStatus);
    const enabled =
      authStatus === messagingInstance.AuthorizationStatus.AUTHORIZED ||
      authStatus === messagingInstance.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      this.getFcmToken();
    }
  };

  getFcmToken = async () => {
    if (!messagingInstance) {
      return;
    }

    let fcmToken = await messagingInstance.getToken();
    await AsyncStorage.setItem(
      AsynchStoragekey.AsynchStoragekey.FCM_TOKEN,
      fcmToken,
    );
    console.log('new fcm token', fcmToken);
  };

  CheckConnection = () => {
    NetInfo.fetch().then(state => {
      console.log(
        'state.isConnected oooooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
        state.isConnected,
      );
      if (state.isConnected) {
        this.setState({isConnected: true});
      } else {
        this.setState({isConnected: false});
      }
    });
    this.info();
  };
  info() {
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        this.setState({isConnected: true});
      } else {
        this.setState({isConnected: false});
      }
    });
  }
  componentWillUnmount(): void {
    console.log('c@lled UnMount :::');
    // this.messageListener()
  }

  render() {
    return (
      <>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
           <StateProvider>
            <MainStack />
           </StateProvider>
          </PersistGate>
        </Provider>
      </>
    );
  }
}

export default withTranslation()(App);