import React, { Component } from "react";
import { View, Image, TouchableOpacity, ImageBackground } from "react-native";
import Badge from "./Badge";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLORS } from "../../framework/src/Globals";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface props {
    onPress: () => void;
    count: any
}

export default class HeaderComponent extends Component<props>{
    constructor(props: props) {
        super(props)
        this.state = {
          
        }
    }
    render() {

       // console.log("####################### '''", this.props.count)
        return (
            <View style={{ backgroundColor: COLORS.lightRed, height: 90, justifyContent: 'flex-end', alignItems: 'center' }}>
                <Image style={{ width: '22%', height: 150, zIndex: 10, alignSelf: 'flex-start', tintColor: '#FFFF00', position: "absolute" }} source={require("../images/hexamask.png")} />
                <View style={{ flexDirection: 'row', width: '90%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <Image style={{ width: hp('16%'), height: hp('3.3%'), tintColor: 'white' }}
                        source={require('../images/a2fceb79e4fda1e2aaed65127c7dc7f1f68faec0.png')}
                    />
                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => {this.props.onPress();AsyncStorage.setItem("notificationCalculation",JSON.stringify (0) )
                    }} >
                        {/* {
                            this.props.count > 0 && (
                                <View style={{ position: "absolute", top: 0, zIndex: 1, right: "2%" }}>
                                    <Badge count={this.props.count} />
                                </View>
                            )
                        } */}
                        {
                            this.props.count > 0 && (
                                <View style={{ position: "absolute", top: 0, zIndex: 1, right: "2%" }}>
                                    <Badge count={this.props.count} />
                                </View>
                            )
                        }
                        {/* <View style={{ position: "absolute", top: 0, zIndex: 1, right: "2%" }}>
                            <Badge count={this.props.count} />
                        </View> */}
                        <Image style={{ width: 40, height: 40, tintColor: 'white', resizeMode: "cover" }}
                            source={require('../images/imagenav_notifications.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
