import React, { useRef } from 'react';
import { WebView } from 'react-native-webview';
import { Button, View,ScrollView,TouchableOpacity,Text,Dimensions } from 'react-native';
import Scale from '../../../components/src/Scale';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { RFPercentage as rf } from "react-native-responsive-fontsize";
import { FONTS } from '../../../framework/src/Fonts';

let COLOR = ['#FFCF7E', '#FF9999', '#A4EBFF', '#95F1C0', '#D1AEFF']


export const WebViewWithTextSelection = (props) => {
console.log(props,"checkkkkin lesson")
let lessonDescription=props.DOM || "<p></p>"
let  isSurroundedByViewPort=false

if(props.DOM=="N/A")
{
  lessonDescription=props.lessonData
}
if(lessonDescription.includes('<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0">'))
{
  isSurroundedByViewPort=true
}
else{
  lessonDescription= `<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="font-family:'Roboto Regular',sans-serif;">
   ${lessonDescription}
  </body>
</html>`
}





  const webViewRef = useRef(null);
  const handleButtonClick = (color) => {
    const script = `
      var selectedText = window.getSelection().toString();
    
      var range = window.getSelection().getRangeAt(0);
    
      // Check if the range intersects with any image element
      var intersectsWithImage = Array.from(range.getClientRects()).some(rect => {
        var elements = document.elementsFromPoint(rect.x, rect.y);
        return elements.some(element => element.nodeName === 'IMG');
      });
    
     
  
      if (selectedText !== "" && !intersectsWithImage) {
        var span = document.createElement("span");
        span.style.backgroundColor = '${color}'; // Use the color parameter
        span.appendChild(document.createTextNode(selectedText));
        range.deleteContents();
        range.insertNode(span);
      }
      // Send the entire HTML content back to the React Native application
    var htmlContent = document.documentElement.outerHTML;
    window.ReactNativeWebView.postMessage(JSON.stringify({ htmlContent }));
  
    `;
    
    webViewRef.current.injectJavaScript(script);
  };
  
 

  const deviceWidth = Dimensions.get('window').width;
  const injectedJavaScript = `
    function resizeImages() {
      var images = document.getElementsByTagName('img');
      for (var i = 0; i < images.length; i++) {
        images[i].style.maxWidth = '${deviceWidth-50}px';
        images[i].style.height = 'auto';
      }
    }

    setTimeout(resizeImages, 500); // Delay to ensure images are loaded
  `;
  
  
 
  const onMessage = event => {
    const { htmlContent } = JSON.parse(event.nativeEvent.data);
    console.log(htmlContent,"checking html ocntent Vaia on message")
    // You can now use the selected text and intersectsWithImage in your application logic
    props.saveDomInstate(htmlContent)
  };
  return (
    <View>
    <ScrollView style={{height:Scale(350),marginBottom:Scale(40)}}>
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        source={{ html: lessonDescription }}
        onMessage={onMessage}
        style={{flex:1 ,width: '100%', height: Scale(340) }}
        scalesPageToFit={true}
      scrollEnabled={true}
      injectedJavaScript={injectedJavaScript}
      />
      {/* <Button title="Select Text" onPress={() => handleButtonClick(props.selectedColor)} /> */}
     
      </View>
      </ScrollView>

<View style={{
  flexDirection: 'row', bottom: Scale(10),marginLeft: wp(2), padding: hp(1), alignItems: 'center', borderRadius: Scale(30),
  width: wp(76), alignSelf: 'center',
backgroundColor:'white',
shadowColor: '#171717',
shadowOffset: {width: -1, height: 2},
shadowOpacity: 0.15,
shadowRadius: 3,
}}>


  {COLOR.map((item: any) =>
    <TouchableOpacity
      onPress={() => {handleButtonClick(item)}}
      style={{ height: Scale(31), width: Scale(31), backgroundColor: item, marginLeft: wp(2), borderRadius: Scale(20) }}>
    </TouchableOpacity>)}
  <TouchableOpacity onPress={() => {props.ClearAll()}}>
    <Text style={{ marginLeft: Scale(10), fontFamily: FONTS.Roboto_Medium, fontSize: rf(2.1), color: '#777185', paddingRight: wp(3) }}>{props.t("ClearAll")}</Text>
  </TouchableOpacity>
</View>

</View>
  )

}
