import { Button, Image, TouchableOpacity, View ,Text} from "react-native";
import SoundCloudWaveform from 'react-native-soundcloud-waveform';




import React, { Component } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import { COLORS } from "../../../framework/src/Globals";
import Scale from "../../../components/src/Scale";
import { ActivityIndicator, Colors } from "react-native-paper";
import Loader from "../../../components/src/Loader";

export default function Audiocomponent(props: any) {

    console.log("checking audioooooooo",props?.Sound?.getDuration() )
props?.Sound?.getCurrentTime((seconds)=>{console.log(seconds)})

    if(props.audioLoading || !props?.Sound?.getDuration())
    {
        return(
            <View style={{backgroundColor:'white',marginTop:Scale(30)}}>
           <Loader loading={true}  />
            </View>
        )
    }


    return (
        <View style={{width:'70%',flexDirection:'row',alignItems:'center'}}>

            <TouchableOpacity  
         
            style={{backgroundColor:COLORS.lightRed,padding:Scale(17),justifyContent:'center',borderRadius:Scale(7)}} onPress={props?.PlayPause} >

           
<Icon name={props?.Sound?.isPlaying()? "pause":"play"} color={'white'} style={{textAlign:'center'}} />

</TouchableOpacity>

<View style={{backgroundColor:COLORS.greyLine,marginLeft:Scale(10),paddingVertical:Scale(13),borderRadius:Scale(10),flexDirection:'row',paddingHorizontal:Scale(10)}}>

<Text style={{marginRight:-20,marginTop:Scale(2)}}>

 {  Math.floor(props?.currentTime % 3600 / 60).toString().padStart(2,'0')}:{ Math.floor(props?.currentTime % 60).toString().padStart(2,'0')}

</Text>

<View>
        <SoundCloudWaveform
        waveformUrl={'https://w1.sndcdn.com/PP3Eb34ToNki_m.png'}
        percentPlayed={props?.currentTime /props?.Sound?.getDuration()}
        setTime={(time)=>{console.log(time);props?.Sound?.setCurrentTime((time/56)*props?.Sound?.getDuration())}}  
        active={COLORS.lightRed}
        activeInverse={COLORS.lightRed}
        height={10}
        width={Scale(250)}
        inactive={COLORS.lightGray}
        inactiveInverse={COLORS.lightGray}
       
      />
</View>
      <Text style={{marginLeft:-20,marginTop:Scale(2)}}>
      {  Math.floor(props?.Sound?.getDuration() % 3600 / 60).toString().padStart(2,'0')}:{ Math.floor(props?.Sound?.getDuration() % 60).toString().padStart(2,'0')}

      </Text>
    </View>

        </View>







    )





}
