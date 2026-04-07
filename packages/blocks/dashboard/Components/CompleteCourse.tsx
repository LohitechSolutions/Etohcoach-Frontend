import React, { Component } from "react";
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Image, ImageBackground } from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
  } from "react-native-responsive-screen";
  import Context from "../../../components/src/context/context";

import { FONTS } from "../../../framework/src/Fonts";
import { COLORS } from "../../../framework/src/Globals";
import { withTranslation } from "react-i18next";

export default class CompleteCourse extends Component{
  static contextType = Context;
    constructor(props:any){
        super(props)
        this.state={

        }
    }

    render(){
      const {t}:any = this.props;
      console.log('props dataaaaaaa ',this.props.data.length)
        return(
            <View style={{}}>
                <View style={{width:'90%',alignSelf:'center',marginTop:20}}>
                <Text style={{fontSize:hp('2.5%'),fontWeight:'700'}} >{t("COMPLETEDCOURSES")}</Text>
                </View>
              <FlatList style={{marginTop:10}}
                  data={this.props.data}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item})=>
                  <TouchableOpacity style={{width:wp('95%'),borderWidth:1,borderColor:'grey',height:hp('31%'),borderRadius:10,marginLeft:10,marginRight:10}}>
                    <ImageBackground style={{width:wp('95%'),height:hp('20%'),justifyContent:'flex-end',borderTopLeftRadius:10,borderTopRightRadius:10,overflow: 'hidden'}}
                      source={require('../assets/natureImage.jpeg')}
                    >
                        <View style={{backgroundColor:'rgba(0,0,0,0.7)',flexDirection:'row',alignItems:'center',padding:5}}>
                            <View style={{width:15,height:15,backgroundColor:'green',borderRadius:8,marginLeft:10}}></View>
                            <Text style={{color:'white',marginLeft:10,fontFamily:FONTS.Roboto_Regular}}>100%</Text>
                            <View style={{marginLeft:10,marginRight:10,width:4,height:4,borderRadius:3,backgroundColor:'white'}}></View>
                            <View style={{width:15,height:15,backgroundColor:'green',borderRadius:8}}></View>
                            <Text style={{color:'white',marginLeft:10,fontFamily:FONTS.Roboto_Regular}}>30/30</Text>
                            <View style={{marginLeft:10,marginRight:10,width:4,height:4,borderRadius:3,backgroundColor:'white'}}></View>
                            <View style={{width:15,height:15,backgroundColor:'green',borderRadius:8}}></View>
                            <Text style={{color:'white',marginLeft:10,fontFamily:FONTS.Roboto_Regular}}>2/2% </Text>
                        </View>
                    </ImageBackground>
                    <View style={{width:wp('90%'),marginTop:5,alignSelf:'center'}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={{fontSize:10,color:'grey',fontFamily:FONTS.Roboto_Regular}}>{t("WineCourseCFVCertificateEnglish")}</Text>
                            <Image style={{width:10,height:7,marginLeft:5}}
                              source={require('../assets/uk_Flag.jpeg')}
                            />
                        </View>
                        <Text style={{fontSize:16,marginTop:5,fontFamily:FONTS.Roboto_Bold}}>{t("SnacksAreEvil")}</Text>
                        <View>
                            <Text numberOfLines={3} style={{fontSize:16,fontFamily:FONTS.Roboto_Regular,color:'grey',marginTop:5}}>{t("CompleteThisEssentialCourseInOrderToProceedToAdvancedCourses")}</Text>
                        </View> 
                    </View>
                  </TouchableOpacity>
                }
              />
      </View>
    )
  }
}