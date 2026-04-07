import React from 'react'
import {Modal,TouchableWithoutFeedback,View,Text,StyleSheet} from 'react-native'
import Scale from '../../../components/src/Scale'
import { FONTS } from '../../../framework/src/Fonts'
import { COLORS } from '../../../framework/src/Globals'
import i18next from "i18next";
import { withTranslation } from "react-i18next";

const colorArray=["#ECF1F4","#ECF1F4","#C7263E","#EE8464","#F6A318","#4BA3B7","#73D19F"]

const textArray=["Incomplete cards","Active card"
,"Cards scored 1 point",
"Cards scored 2 points",
"Cards scored 3 points",
"Cards scored 4 points",
"Cards scored 5 points"
]

let Rounds=(ele:any,index:any,trans:any)=><View style={{marginTop:Scale(20),flexDirection:'row',}} >
{/* <Text style={{fontSize:Scale(100),lineHeight:Scale(20)}}>.</Text> */}
<View style={{ width:Scale(20),padding:Scale(0.4),borderRadius:Scale(13),backgroundColor:index==1? 'black':'transparent'}} >
<View style={{  padding:Scale(1),borderRadius:Scale(12),backgroundColor:index==1?'white':ele}} >
<View style={{height:Scale(17),borderRadius:Scale(12),backgroundColor:ele}}/>
</View>
</View>
<View style={{marginLeft:Scale(10)}}>
    <Text>
        {  trans(`${textArray[index]}`)}
    </Text>
</View>
</View>

let TopLine=<View style={{height:Scale(5),width:Scale(40),backgroundColor:COLORS.greyLine,alignSelf:'center',marginTop:Scale(10),borderRadius:5}}>


</View>


export const Flashcardmodal=(props:any)=>{
console.log(props.t,"changing changing")
let trans=props.t 
return (
    <Modal
    animationType={"slide"}
     transparent={true}
    visible={props.infomodalVisible}
    onRequestClose={() => { console.log("Modal has been closed.") }}>
    <TouchableWithoutFeedback onPress={()=>{props.informodalHideShow(props.infomodalVisible)}} >
        <View style={{flex:1 ,justifyContent: "flex-end"}}>

            <TouchableWithoutFeedback onPress={() => { return }}>
         <View style={{ borderRadius: Scale(12),backgroundColor:'#FFFFFF',paddingBottom:Scale(100)}} >
            {TopLine}
<View style={{marginTop:Scale(25)}}>
<View>
<Text style={{textAlign:'center',fontFamily:FONTS.Explet_SemiBold,fontWeight:'700',fontSize:24,marginBottom:Scale(20)}} >
 {trans("Flashcard Scoring")}
</Text >
</View>

    <Text style={mystyle.smalltextstyle} >{trans("The colors indicate the score you gave each flashcard.")}</Text>
    <Text style={mystyle.smalltextstyle} >
{ trans("Flashcards will be ordered from incomplete")}
</Text>
<Text style={mystyle.smalltextstyle} >{trans("through the highest score.")}</Text>

</View>

{/* view for boxes */}
<View style={{marginLeft:Scale(20)}} >
{
    colorArray.map((ele,index)=>Rounds(ele,index,trans))
}
</View>
         </View>
        </TouchableWithoutFeedback>
        </View>
    </TouchableWithoutFeedback>
</Modal>


)

}

const mystyle=StyleSheet.create({

smalltextstyle:{textAlign:'center',fontFamily:FONTS.Roboto_Regular,fontSize:14,color:COLORS.grey,marginTop:Scale(5)}

    
})