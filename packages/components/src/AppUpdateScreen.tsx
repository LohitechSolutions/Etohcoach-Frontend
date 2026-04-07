import React, { Component } from "react";
import {Modal, View,Image,Text,StyleSheet,Platform,Linking, TouchableOpacity, ScrollView} from 'react-native'
import Scale from "./Scale";
import { COLORS } from "../../framework/src/Globals";
import { FONTS } from "../../framework/src/Fonts";
import ButttonComponent from "../../mobile/src/component/ButtonComponent";
import i18next from "i18next";

interface props{
type:number;
visible:boolean;
link:string;
homefunction:any
}
let i18n=i18next
export default  class AppUpdateScreen  extends Component<props> {
    constructor(props:any) {
      super(props);
    }



 ReturnSubSText(type:any)
{

if(type==1)
{
    return (
        <>
<View  style={{marginTop:Scale(55)}}>
<Text style={styles.headingFont} >
{i18n.t("App Maintenance")}
</Text>
<Text  style={styles.regularFont}>
{i18n.t("Our team is working hard to resolve an issue.")}

</Text>
<Text  style={styles.regularFont}>
{i18n.t("Please come back soon.")}
</Text>
</View>
        </>
    )
}
if(type==2)
{
    return(
<>
<View style={{marginTop:Scale(45)}} >
<Text style={styles.headingFont} >
{i18n.t("It’s time for an update")}
</Text>
<Text  style={styles.regularFont}>
{i18n.t("Please update EtOH Coach to continue")}


</Text>
<Text  style={styles.regularFont}>
{i18n.t("enjoying your experience with some new")}
</Text>
<Text  style={styles.regularFont}>
{i18n.t("features we have for you.")}
</Text>


</View>
</>
    )
}
if(type==3)
{
    return (
        <>
        <ScrollView scrollEnabled style={{height:Scale(30),marginTop:Scale(20)}}>
        <View style={{}}  >
<Text style={styles.headingFont} >
{i18n.t("We’re better than ever")}
</Text>
<Text  style={styles.regularFont}>
{i18n.t("Please update the EtOH Coach app and gain")}
</Text>
<Text  style={styles.regularFont}>
{i18n.t("access to the new features we have for you.")}
</Text>

</View>
</ScrollView>
        </>
    )
}

}





    render() {
let type=this.props.type
console.log("type of autoupdate",this.props.type)
return (


    <View>

<Modal visible={this.props?.visible} >

<View style={{width:"100%",height:200,alignSelf:'flex-start',marginLeft:Scale(-10),marginTop:Scale(-10)}} >

<Image   source={require("../images/update_polygon.png")}  style={{resizeMode:'contain',width:"75%",height:'100%'}} />
</View>

<View style={{alignSelf:'center',width:'100%',height:Scale(300),marginTop:Scale(70)}}>

<Image   source={ type==1?  require("../images/update_1.png"):type==2?require("../images/update_2.png"):require("../images/update_3.png")}  style={{resizeMode:'contain',width:"100%",height:'100%'}} />



</View>

{this.ReturnSubSText(type)   }

<View style={{position:'absolute',bottom:Scale(40),width:'100%'}}>
<ButttonComponent  onpress={()=>{

if(type==1)
{
    return
}
      
if (Platform.OS === 'ios') {
    Linking.openURL(this.props.link);
  } else {
    console.log("<>")
    Linking.openURL(
        this.props.link
    );
  }

}}  BtnText={ type==1? i18n.t("NOTIFY ME") : i18n.t("UPDATE NOW")}/>

{type==3&&<TouchableOpacity style={{marginTop:Scale(20)}} onPress={()=>{  this.props.homefunction()}}>
<Text style={{textAlign:'center',fontFamily:FONTS.Explet_SemiBold}} >{i18n.t("Skip for now")}</Text></TouchableOpacity>}
</View>
</Modal>



    </View>


)



    }


}


let styles=StyleSheet.create({

regularFont:{textAlign:'center',fontSize:16,fontFamily:FONTS.Roboto_Regular ,color:COLORS.grey,marginTop:Scale(5)},
headingFont:{textAlign:'center',fontFamily:FONTS.Explet_SemiBold,fontSize:25,marginBottom:Scale(7)}

})



