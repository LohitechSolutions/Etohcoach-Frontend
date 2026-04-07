import React, { Component } from "react";
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Image, ImageBackground } from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { COLORS } from "../../../framework/src/Globals";
import Context from "../../../components/src/context/context";

import { withTranslation } from "react-i18next";

interface props {
    onPress: () => void;
}
export default class Select_Course extends Component<props> {
    constructor(props: props) {
        super(props)
        this.state = {

        }
    }
    static contextType = Context;
    render() {
        const {t}:any = this.props;
        return (
            <View style={{ alignItems: 'center', alignSelf: 'center', marginTop: 50, width: '100%' }}>
                <Image style={{ width: hp('20%'), height: hp('20%'), marginTop: 10 }}
                    source={require('../assets/glassCollation.jpeg')}
                />
                <Text style={{ fontSize: hp('2%'), fontWeight: '700', marginBottom: 10 }}>{t("SELECTACOURSE")}</Text>
                <Text style={{ fontSize: hp('1.5%'), fontWeight: '600', color: '#848387', textAlign: 'center' }}>{t("YouHaveNoActive")}</Text>
                <TouchableOpacity style={{ width: '90%', height: 60, borderRadius: 15, marginTop: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.lightRed }}
                    onPress={() => this.props.onPress()} >
                    <Text style={{ fontSize: hp('2%'), color: 'white', fontWeight: '700' }}>{t("GOTOCATALOGUE")}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}