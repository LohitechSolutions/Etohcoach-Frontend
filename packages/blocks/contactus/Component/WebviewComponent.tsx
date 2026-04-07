import React, { Component } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Button,
  Image,
  Text,
  TouchableOpacity
} from "react-native";
import { WebView } from "react-native-webview";
import BottemButton from "../../../mobile/src/component/BottemButtonComponent";
import Loader from "../../../components/src/Loader";
import Scale from "../../../components/src/Scale";
import { FONTS } from "../../../framework/src/Fonts";


function isUrl(s) {
  var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  return regexp.test(s);
}

export default class WebviewComponent extends Component {
  constructor(props: any) {
    super(props);
  }

  getUrlcontactUs = () => {

    if (this.props.navigation?.state?.params?.Data?.page === "View knowledge base") {
      if (isUrl(this.props.navigation?.state?.params?.Data?.url) === true && this.props.navigation?.state?.params?.Data?.url !== null) {
        return this.props.navigation?.state?.params?.Data?.url
      } else {
        return "https://etoh.tawk.help/"
      }
    }
    else {
      if (isUrl(this.props.navigation?.state?.params?.Data?.url) === true && this.props.navigation?.state?.params?.Data?.url !== null) {
        return this.props.navigation?.state?.params?.Data?.url
      }
      else {
        return "https://etohcoachfinal-159129-ruby.b159129.dev.eastus.az.svc.builder.cafe/chat/display"
      }
    }

  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <WebView
         startInLoadingState={true}
          originWhitelist={["*"]}
          source={{
            uri:
              this.getUrlcontactUs()
          }}
          renderLoading={() => {
            return <View style={{height:"100%"}}>
              <Loader loading={true}/>
            </View>
          }}
          style={styles.webContaner}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn("WebView error: ", nativeEvent);
          }}
        />
        <View style={{height:Scale(60),backgroundColor:'white',justifyContent:'center'}}>
        {/* <BottemButton leftOnPress={() => this.props.navigation.goBack()} back={true} /> */}
        <TouchableOpacity onPress={()=>{this.props.navigation.goBack()}} style={{width:Scale(60),alignItems:'center',marginLeft:Scale(5)}}>
        <Image source={require('../assets/backButton.png')}  style={{height:Scale(20),width:Scale(35),tintColor:'grey'}} />
        <Text style={{fontFamily:FONTS.Roboto_Regular,color:'grey'}}>Back</Text>
        </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  webContaner: {
    flex: 1
  },
});
