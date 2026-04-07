import React from "react";
import { Dimensions, Text,View } from 'react-native';
 import ProgressLabel from 'react-progress-label';
import { FONTS } from "../../framework/src/Fonts";
import { COLORS } from "../../framework/src/Globals";
import Scale from "./Scale";
import { withTranslation } from "react-i18next";
import { useTranslation } from 'react-i18next';


// width
// fillColor
// progressColor
//trackBorderColor
//pointscolor
//textColor
//pointstext
//totlatext
function CircularProgresss(props:any){
  const { t } = useTranslation();
let width=props.width || 200

console.log("checking props in circular lib",props)
      return(
        <View style={{alignItems:'center',height:width,width:width}}>
        <ProgressLabel
        progress={props.progress}
        fillColor={ props.progress=='100'?'rgb(109,197,150)':"white"}
        trackColor={COLORS.greyLine}
        progressColor={Number(props.progress)>70?COLORS.success:COLORS.lightRed}
        progressWidth={width/8}
        trackWidth={width/8}
        trackBorderWidth={1}
        trackBorderColor={props.progress=='100'?COLORS.success:"white"}
        cornersWidth={width/16.066}
        size={width}
      >
      </ProgressLabel>
     {!props.isThisSmall && !props.isItfromQuizzes ? <View style={{position:'absolute',top:'38%',alignItems:'center'}}>
        <View style={{flexDirection:"row",alignItems:'center'}}>
      <Text style={{fontFamily:FONTS.Roboto_Medium,fontWeight:'800',fontSize:width/7,color:props.pointscolor ??'red'}}>{props.pointsText} </Text><Text style={{marginTop:width/15,color:props.progress=="100"?'#FFFFFF' :'#B5B2BF',fontFamily:FONTS.Roboto_Medium,marginLeft:-4}}>/</Text><Text style={{marginTop:width/15,color:props.progress=="100"?'#FFFFFF' :'#B5B2BF',fontFamily:FONTS.Roboto_Light,fontSize:width/14}}>{props.totlatext ??10}</Text>

      </View>            
        <Text style={{fontFamily:FONTS.Roboto_Medium,fontWeight:'400',fontSize:width/17,color:props.progress=="100"?'#FFFFFF' :'#777185'}}>{t("Correctanswers")}</Text>

      </View>:props.isThisSmall && !props.isItfromQuizzes?
      <View style={{position:'absolute',alignItems:'center',right:props.isitquizz?Scale(50):  Scale(50),top:Scale(10)}}>
      <View style={{flexDirection:"row",alignItems:'center'}}>
    <Text style={{fontFamily:FONTS.Roboto_Medium,fontWeight:'800',fontSize:Scale(20),color: Number(props.progress)>70?COLORS.success :COLORS.lightRed }}>{props.pointsText} </Text>
    <Text style={{marginTop:width/15,fontFamily:FONTS.Roboto_Medium,marginLeft:-4,color:props.progress=="100"?'#B5B2BF' :'#B5B2BF'}}>/</Text>
    <Text style={{marginTop:width/14,color:'#777185',fontFamily:FONTS.Roboto_Light,fontSize:Scale(13)}}>{props.totlatext ??10}</Text>
    {/* Number(props.progress)>70?COLORS.success :COLORS.lightRed  */}
    {/* Number(props.progress)>70&&Number(props.progress)<100?COLORS.success :Number(props.progress)==100?COLORS.white: COLORS.lightRed */}
    </View>            

    </View>
    :props.isItfromQuizzes?
    <View style={{position:'absolute',alignItems:'center',right: Scale(30),top:Scale(30)}}>
    <View style={{flexDirection:"row",alignItems:'center'}}>
  <Text style={{fontFamily:FONTS.Roboto_Medium,fontWeight:'800',fontSize:Scale(20),color:Number(props.progress)>70&&Number(props.progress)<100?COLORS.success :Number(props.progress)==100?COLORS.white: COLORS.lightRed  }}>{props.pointsText} </Text><Text style={{marginTop:width/15,fontFamily:FONTS.Roboto_Medium,marginLeft:-4,color:props.progress=="100"?'#FFFFFF' :'#B5B2BF'}}>/</Text><Text style={{marginTop:width/15,color:props.progress=="100"?'#FFFFFF' :'#B5B2BF',fontFamily:FONTS.Roboto_Light,fontSize:Scale(15)}}>{props.totlatext ??10}</Text>

  </View>            
  <Text style={{fontFamily:FONTS.Roboto_Medium,fontWeight:'500',fontSize:width/10,color:props.progress=="100"?'#FFFFFF' :'#777185'}}>{t("Correct")}</Text>
  <Text style={{fontFamily:FONTS.Roboto_Medium,fontWeight:'500',fontSize:width/10,color:props.progress=="100"?'#FFFFFF' :'#777185'}}>{t("Answers")}</Text>

  </View>:<></>
 
}
      {/* <Text style={{position:'absolute',top:120,left:60}}>Helllo</Text> */}
      </View>
      )
}

export default withTranslation()(CircularProgresss);