import React,{ Component } from "react";
import { SafeAreaView,StyleSheet, TouchableOpacity, View,Image,Text } from "react-native";
import Context from "../../../components/src/context/context";


import { withTranslation } from "react-i18next";
interface props{
    onPressClose:()=>void;
    onPressPrevious:()=>void;
    onPressNext:()=>void;
}

export default class BottomHeader extends Component<props>{
    constructor(props:any){
        super(props)
    }
    static contextType = Context;

    render(){
        const {t}:any = this.props;

        const langaugeDatafromapi = this.context.langaugeData?.meta?.translations;
        return(
            <SafeAreaView style={{flexDirection:'row',justifyContent:'space-between',alignSelf:'center',width:'90%',alignItems:'center'}}>
                <TouchableOpacity style={{alignItems:'center'}}
                    onPress={()=>this.props.onPressClose()} >
                        <Image style={{width:13,height:13}}
                           source={require('../assets/Close_icon.png')}
                        />
                    <Text style={{fontSize:12,fontWeight:'400',marginTop:10}}>{t("Close")}</Text>
                </TouchableOpacity>
                <View style={{width:'40%',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                    <TouchableOpacity style={{alignItems:'center'}}
                        onPress={()=>this.props.onPressPrevious()}  >
                        <Image style={{width:10,height:13}}
                           source={require('../assets/Right_icon.png')}
                        />
                        <Text style={{fontSize:12,fontWeight:'400',marginTop:10}}>{t("Previous")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{alignItems:'center'}} onPress={()=>this.props.onPressNext()} >
                        <Image style={{width:10,height:13,transform: [{ rotate: '190deg'}]}}
                           source={require('../assets/Right_icon.png')}
                        />
                        <Text style={{fontSize:12,fontWeight:'400',marginTop:10}}>{t("Next")}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    
})