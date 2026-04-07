import React, { Component } from "react";
import { FlatList, SafeAreaView, View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import FlashCardQuestionAnswerController, { Props } from './FlashCardQuestionAnswerController';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Scale from "../../../components/src/Scale";
import styles from "./FlashCardQuestionAnswerStyle"
import { COLORS } from "../../../framework/src/Globals";
let data = 'Conveniently plagiarize market-driven metrics with compelling e-tailers. Rapidiously generate fully tested convergence whereas go forward scenariou. globally innovate timely metrics before Rapidiously generate fully tested convergence whereas go forward scenarios. Globally innovate timely metrics before dynamic benefits. Efficiently pursue interdependent experiences via 24/365 convergence. Compellingly expedite world-class schemas and go forward total linkage. Dynamically initiate team building niches vis-vis ubiquitous total linkage. Holistically foster superior meta-services before process-centric ideas. Completely syndicate effective infrastructures. Interactively myocardinate team building infomediaries'
import Context from "../../../components/src/context/context";

import { withTranslation } from "react-i18next";

class FlashCardQuestionAnswer extends FlashCardQuestionAnswerController {
    constructor(props: Props) {
        super(props)
    }
    static contextType = Context;


    renderFlashCard = () => {
        const { t }: any = this.props;
        return (
            <View>
                <View style={{ width: '90%', alignSelf: 'center' }}>
                    <Text style={{ fontSize: hp('1.4%') }}>How the wine is done . Theme </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <Text numberOfLines={1} style={{ fontSize: hp('3.5%'), fontWeight: '700', marginTop: 10, marginBottom: 10, maxWidth: Scale(300) }}>{this.state.lesson_details?.attributes?.title}</Text>
                        <TouchableOpacity >
                            <Image style={{ width: Scale(30), height: Scale(30), resizeMode: "contain" }} source={require('../assets/notes.png')} />
                        </TouchableOpacity>
                    </View>
                    <Image style={{ width: wp('90%'), height: hp('25%'), borderRadius: 20, marginTop: 20 }} source={require('../assets/natureImage.jpeg')} />
                    {/* <TextInput style={{fontSize:hp('2%'),marginTop:10}}> </Text> */}
                    <TextInput style={{ fontSize: hp('2%'), marginTop: 10 }} editable={false}
                        value={this.state.lesson_details?.attributes?.description}
                        multiline
                    />
                </View>
                <TouchableOpacity style={{ width: '90%', alignSelf: 'center', borderRadius: 10, height: 60, marginBottom: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.lightRed }}>
                    <Text style={{ fontSize: 16, color: 'white', fontWeight: '700', lineHeight: 18.75, letterSpacing: 0.4 }}>{ t("NEXTLESSON")}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                {this.renderFlashCard()}
            </SafeAreaView>
        )

    }
}

export default withTranslation()(FlashCardQuestionAnswer);