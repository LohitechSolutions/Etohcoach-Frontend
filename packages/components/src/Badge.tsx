import React, { Component } from "react";
import { Text, TouchableOpacity, View, ScrollView, SafeAreaView, Image, FlatList, ImageBackground ,StyleSheet} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
  } from "react-native-responsive-screen";

interface props {
    count: any;
}

export default class Badge extends Component<props>{
    constructor(props: props) {
        super(props)
        this.state = {

        }
    }
    render() {
        console.log("this.props.count",this.props.count)
        return (
            <View style={styles.circle}>
                <Text style={styles.count}>{this.props.count}</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    circle:{
     width:18,
     height:18,
     borderRadius:18,   //half radius will make it cirlce,
     backgroundColor:'red',
     justifyContent:"center",
     alignItems:"center"
    },
    count:{color:'#FFF',}
  })