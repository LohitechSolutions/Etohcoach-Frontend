import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text, FlatList, StyleSheet } from "react-native";
import { RFValue as rf } from "react-native-responsive-fontsize";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { FONTS } from "../../../framework/src/Fonts";
import { COLORS } from "../../../framework/src/Globals";
interface props {
    data: any
}

export default class ScoreList extends Component<props>{
    constructor(props: props) {
        super(props)
        this.state = {
            data: this.props.data
        }
    }
    render() {
        return (
            <FlatList style={styles.container}
                data={this.props.data}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }: { item: any, index: number }) =>

                    <TouchableOpacity style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', borderBottomWidth: hp(0.1), height: 60, justifyContent: 'space-between', padding: 10, borderColor: '#F0F0F2' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: hp('2%') }}>{index + 1}</Text>
                            <Text style={{ fontSize: rf(14), fontFamily: FONTS.Roboto_Regular, marginLeft: wp(3) }}>{item?.attributes?.name}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.itemScore}>{item?.attributes?.reward_point}</Text>
                            <Image style={{ width: hp('3%'), height: hp('3%'), marginLeft: 10, tintColor: COLORS.purple }}
                                source={require('../assets/rewardpurple.png')}
                            />
                        </View>
                    </TouchableOpacity>
                }
            />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '92%',
        height: hp('51%'),
        alignSelf: 'center'
    },
    itemScore: {
        fontSize: rf(14),
        fontFamily: FONTS.Roboto_Medium,
        color: COLORS.purple
    }
});