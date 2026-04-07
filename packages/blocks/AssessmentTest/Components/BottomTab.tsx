import React,{ Component } from "react";
import { SafeAreaView,StyleSheet, TouchableOpacity, View,Image,Text } from "react-native";

interface props{
    onPressClose:()=>void;
    onPressNext:()=>void;
}

export default class BottomTab extends Component<props>{
    constructor(props:any){
        super(props)
    }

    render(){
        return(
            <SafeAreaView style={{flexDirection:'row',justifyContent:'space-between',alignSelf:'center',width:'90%',alignItems:'center'}}>
                <TouchableOpacity style={{alignItems:'center'}}
                    onPress={()=>this.props.onPressClose()} >
                        <Image style={{width:13,height:13}}
                           source={require('../assets/Close_icon.png')}
                        />
                    <Text style={{fontSize:12,fontWeight:'400',marginTop:10,color:'777185'}}>Close</Text>
                </TouchableOpacity>
                    <TouchableOpacity style={{alignItems:'center'}} onPress={()=>this.props.onPressNext()} >
                        <Image style={{width:15,height:15,tintColor:'#777185'}}
                           source={require('../assets/RightIcon.png')}
                        />
                        <Text style={{fontSize:12,fontWeight:'400',marginTop:10,color:'#777185'}}>Confirm</Text>
                    </TouchableOpacity>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    
})