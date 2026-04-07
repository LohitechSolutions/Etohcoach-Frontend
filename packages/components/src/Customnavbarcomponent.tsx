
import React from "react";

import {View,TouchableOpacity,Image,Platform,Text, SafeAreaView} from 'react-native'
import Scale from "./Scale";
import { FONTS } from "../../framework/src/Fonts";
import i18n from "./i18n/i18n.config";
import i18next from "i18next";


export const CustomNavbarComponentt = ({deviceModel,tintpage,backfunction,overviewfunction,themesfunction,notesfunction}) => {
    const t= i18next.t

let iphone11={
    marginBottom:Scale(7)
}

    console.log(backfunction,"backfunction")
    return (
        <View style={ {marginBottom:Platform.OS=="ios"? Scale(7):Scale(25)}}>
            <SafeAreaView style={{ backgroundColor:'white'}}>
        <View style={{
            width: '100%',height:Scale(50), flexDirection: 'row', justifyContent: 'space-between',
            paddingHorizontal:Scale(30),
            paddingTop:Scale(10),
            backgroundColor:'white'
        }}>
            <TouchableOpacity style={{ alignItems: "center",marginTop:Scale(4) }} onPress={() =>{backfunction()}}>
                <Image style={{ height: Scale(19), tintColor:tintpage=='grey', marginBottom:Scale(8) ,width:Scale(8)}} source={require("../images/leftArrow.png")} />

                <Text style={{ color: 'grey',fontFamily:FONTS.Roboto_Regular,fontSize:Scale(13) }} >
                {t("Back")}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: "center" }} onPress={()=>{overviewfunction()}}>
                <Image style={{ marginBottom:Scale(7)  ,height:Scale(24),width:Scale(22),tintColor: tintpage=="overview"? "black":'grey'} }source={require("../images/overView.png")} />
                <Text style={{fontFamily:FONTS.Roboto_Regular,fontSize:Scale(13),color: tintpage=="overview"? "black":'grey' }} >
                { t("Overview")}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {themesfunction()}} style={{ alignItems: "center" }}>
                <Image style={{ marginBottom: Scale(7), tintColor:tintpage=="themes"? "black":'grey',height:Scale(24),width:Scale(22) }} source={require("../images/leaderBoard.png")} />
                <Text style={{ color:  tintpage=="themes"? "black":'grey',fontFamily:FONTS.Roboto_Regular,fontSize:Scale(13)  }}>
                { t("Themes")}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{notesfunction()}} style={{ alignItems: "center" }}>
                <Image style={{ marginBottom: Scale(7), tintColor: tintpage=="notes"? "black":'grey',height:Scale(24),width:Scale(22) }} source={require("../images/notes.png")} />
                <Text style={{ color:  tintpage=="notes"? "black":'grey',fontFamily:FONTS.Roboto_Regular ,fontSize:Scale(13) }}>
                { t("Notes")}
                </Text>
            </TouchableOpacity>
        </View>
        </SafeAreaView>
        </View>
    )
}