import React from "react";
import { Component } from "react";
import { View, Text, TouchableOpacity, Image, ImageBackground, SafeAreaView } from "react-native"
import styles from "./CongratulationStyle"
import CongratulationController from "./CongratulationController"
import Scale from "../../../components/src/Scale";
import Loader from "../../../components/src/Loader";
import { COLORS } from "../../../framework/src/Globals";
import Context from "../../../components/src/context/context";
import { Svg, LinearGradient, Stop } from 'react-native-svg';

import { withTranslation } from "react-i18next";
import { FONTS } from "../../../framework/src/Fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsynchStoragekey } from "../../../mobile/src/utils";
// Customizable Area Start
 // Customizable Area End
 // Customizable Area Start
class Congratulation extends CongratulationController {
    static contextType = Context;
    renderCongratulation = () => {
        const {t}:any = this.props;
        console.log(this.props?.navigation?.state?.params, "congoooo");
        return (
            <View style={{ flex: 1, opacity: 0.8, height: Scale(430), width: Scale(414) }}>
                <ImageBackground resizeMode="cover" style={{ height: Scale(420), width: Scale(414), justifyContent: "flex-end", }} source={require("../assets/bgImage.png")} >
                </ImageBackground>
                <View style={{ flexDirection: "row", height: Scale(40), borderRadius: Scale(12), alignItems: "center", justifyContent: "space-evenly", backgroundColor: COLORS.purple, alignSelf: "center", bottom: 20 ,paddingHorizontal:Scale(7)}}>
                    <Text style={{ fontSize: Scale(24), color: "#fff", fontWeight: "700",fontFamily:FONTS.Roboto_Regular ,marginLeft:Scale(13)}}>+ {this.state?.reward_point} </Text>
                    <Image style={{ width: Scale(23), height: Scale(24) }} source={require("../assets/imageThemes.png")} />
                </View>
                <Text style={{ fontSize: Scale(33),fontWeight: "600", color: 'black', alignSelf: "center",fontFamily:FONTS.Explet_SemiBold }}>{t("Congratulations")}</Text>
                <Text style={{ fontSize: Scale(14), fontWeight: "400", lineHeight: Scale(16), color: "#777185", alignSelf: "center", marginTop: Scale(20), }}>{t("You have finished the course!")}</Text>
                <View style={{ width: Scale(350), height: Scale(95), borderRadius: Scale(12), alignSelf: 'center', backgroundColor: "#EBEFF4", marginTop: Scale(30) }}>
                    <View style={{ flexDirection: "row", marginTop: Scale(10), marginLeft: Scale(10), width: Scale(150), alignItems: 'center' }}>
                        <Image style={{ width: Scale(18), height: Scale(18), resizeMode: 'cover' }} source={require("../assets/IconI.png")} />
                        <Text style={{ fontSize: Scale(16), fontWeight: "800", lineHeight: Scale(19), color: "#373434",fontFamily:FONTS.Roboto_Regular,marginLeft:Scale(10) }}>{t("DidYouKnow")}?</Text>
                    </View>
                    <View  style={{alignItems:'flex-start',marginStart:Scale(10)}}>
                        <Text style={{ fontWeight: "500", fontSize: Scale(12),lineHeight: Scale(14), color: "#777185",textAlign:"left", marginTop: Scale(10)}}>{this.state?.congratulations?.course?.did_you_know}</Text>
                    </View>
                </View>
            </View>
        )
    }

    rendderWowButton = () => {
        const {t}:any = this.props;

        return (
            <TouchableOpacity
                onPress={async() => { this.props.navigation.navigate("OverViews", { course_id: this.props?.navigation?.state?.params?.course_id,course_name:await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.COURCE_NAME) }) }}
                style={{ width: Scale(343), height: Scale(56), borderRadius: Scale(12), backgroundColor: COLORS.lightRed, alignItems: "center", justifyContent: 'center', alignSelf: "center",marginBottom:Scale(20) }}>
                <Text style={{ fontSize: Scale(16), fontWeight: "600", lineHeight: Scale(19), letterSpacing: Scale(0.4), color: "#fff" }}>{t("WOWGREAT")}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        console.log(this.state?.congratulations, "checking congratulations")
        return (
            <SafeAreaView style={styles.mainContainer}>
                {this.renderCongratulation()}
                {this.rendderWowButton()}
                <Loader loading={this.state.isLoading} />
            </SafeAreaView>
        )
    }
}

export default withTranslation()(Congratulation);
 // Customizable Area End
