import React, { Component } from "react";
import { FlatList, TouchableOpacity, Text, View, StyleSheet, Image } from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { rewandPurple, TopDaily, TopOne, TopWeekly } from '../src/assets'
import { RFValue as rf } from "react-native-responsive-fontsize";
import { FONTS } from "../../../framework/src/Fonts";
import { COLORS } from "../../../framework/src/Globals";
import Context from "../../../components/src/context/context";

import { withTranslation } from "react-i18next";

interface props {

}
interface s {
    data: any
}

class DaysScorList extends Component<props, s>{
    constructor(props: any) {
        super(props)
    }
    static contextType = Context;

    render() {
        const {t}:any = this.props;
        let headerData = [
            {
                title: t("TopDaily"),
                sub_title: this.props?.data?. top_daily?.attributes?.name,
                count: this.props?.data?. top_daily?.attributes?.reward_point ,
                image: TopDaily

            },
            {
                title: t("TopWeekly"),
                sub_title: this.props?.data?.top_weekly?.attributes?.name,
                count: this.props?.data?.top_weekly?.attributes?.reward_point,
               
                image: TopWeekly
            },
            {
                title: t("Top1"),
                sub_title: this.props?.data?.top?.attributes?.name,
                count: this.props?.data?.top?.attributes?.reward_point,
                image: TopOne
            }
        ]
        return (
            <FlatList style={styles.listView}
                horizontal={true}
                data={headerData}
                scrollEnabled={false}
                renderItem={({ item }: { item: any }) =>
                    <TouchableOpacity style={styles.dayScorBtn}>
                        <Image style={{ width: hp(9), height: hp(9) }}
                            source={item.image}
                        />
                        <Text style={styles.headerName}>{item.title}</Text>
                        <Text style={styles.sunbTitle}>{item.sub_title}</Text>
                        <View style={{ flexDirection: "row", marginTop: hp(1) }}>
                            <Text style={styles.Itemcount}>{item.count}</Text>
                            <Image style={styles.countImg}
                                source={rewandPurple}
                            />
                        </View>
                    </TouchableOpacity>
                }
            />
        )
    }
}

const styles = StyleSheet.create({
    dayScorBtn: {
        width: wp(32),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: wp(1),
        marginTop: hp(1.7),
    },
    headerName: {
        fontSize: rf(14),
        fontFamily: FONTS.Roboto_Bold,
        marginTop: hp(0.7),
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal:wp(2)
    },
    sunbTitle: {
        fontSize: rf(12),
        color: 'grey',
        marginTop: hp(0.4),
        fontFamily: FONTS.Roboto_Regular
    },
    Itemcount: {
        fontSize: rf(14),
        color: COLORS.purple,
        fontFamily: FONTS.Roboto_Bold,

    },
    countImg: {
        width: hp(3),
        height: hp(3),
        marginLeft: wp(1),
        tintColor: COLORS.purple
    },
    listView: {
        // justifyContent:'space-between'
        // width: '90%', 
        // alignSelf: ''
    }
});

export default withTranslation()(DaysScorList);