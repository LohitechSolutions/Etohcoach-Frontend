// index.js - MOBILE
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import RenderHTML from 'react-native-render-html';

const snapshots = false;
if(snapshots){
  require('./indexSnapshot');
}
else {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    if(remoteMessage?.data?.notify_type == "offering new course" 
    || remoteMessage?.data?.notify_type == "Daily reminder to open the app and train" 
    || remoteMessage?.data?.notify_type == "download course"){
    let myhtml=  <RenderHTML  source={{html:remoteMessage}}/>
    console.log('Message handled in the background!', myhtml);

    }
    let myhtml=  <RenderHTML  source={{html:remoteMessage}}/>
    console.log('Message handled in the background!', myhtml);

  });
  AppRegistry.registerComponent(appName, () => App);
}
