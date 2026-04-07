import React, { Component } from "react";
import { SafeAreaView, View,Text, FlatList, TouchableOpacity,Image, ImageBackground } from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
  } from "react-native-responsive-screen";
  import Context from "../../../components/src/context/context";


  import { withTranslation } from "react-i18next";

interface Props{
    onPress:()=>void;
}
export default class All_Course_Completed extends Component<Props>{
    static contextType = Context;
    constructor(props:Props){
        super(props)
        this.state={

        }
    }
    render(){
        const {t}:any = this.props;
        return(
            <View style={{width:wp('90%'),alignSelf:'center',marginTop:10,borderRadius:20,elevation: 5,shadowColor: '#000',shadowOffset: { width: 0, height: 0 },shadowOpacity: 0.2,shadowRadius: 1, backgroundColor:'white'}}>
                <ImageBackground resizeMode={'contain'} style={{width:wp('90%'),alignItems:'flex-end',height:hp('19%'),alignSelf:'center'}}
                    source={require('../assets/image_complete.png')}
                >
                    <TouchableOpacity style={{width:'20%',marginRight:10,marginTop:10,alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)',borderRadius:20,justifyContent:'center',height:30}}
                        onPress={()=>this.props.onPress()} >
                        <Text style={{fontSize:16,fontWeight:'800',color:'white'}}>{t("Hide")}</Text>
                    </TouchableOpacity>
                </ImageBackground>
                <Text style={{fontSize:hp('2%'),alignSelf:'center'}}>{t("ALLCOURSESCOMPLETE")}</Text>
                <Text style={{textAlign:'center',width:'85%',alignSelf:'center',color:'grey',fontSize:hp('1.6%'),marginBottom:10}}>{t("CongratulationsYouHaveCompletedAllCourse")}</Text>
            </View>
        )
    }
}