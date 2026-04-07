import React, { Component } from "react";
import { View, Image, TouchableOpacity, FlatList, Text, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Scale from "../../../components/src/Scale";
import { withTranslation } from "react-i18next";

interface props {
    data: any,
    onPress: (val: any) => void;
}

export default class MyProgressComponete extends Component<props>{
    constructor(props: props) {
        super(props)
        this.state = {
        }
    }
    render() {
        console.log('checkkkkkk ddddd ', this.props.data)
        return (
            <FlatList style={{ alignSelf: "center", marginTop: Scale(5) }}
                data={this.props.data}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }: { item: any }) =>
                    <TouchableOpacity style={{ width: Scale(110), borderColor: 'grey', height: 100, padding: Scale(10), borderRadius: Scale(10), justifyContent: 'space-evenly', margin: Scale(8), backgroundColor: '#ECEFF6' }}
                        onPress={() => this.props.onPress(item)} >
                        <Image style={{ width: 30, height: 30 }}
                            source={item?.image}
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                            <Text style={{ fontSize: hp('2%'), fontWeight: '700' }}>{item?.user_count}</Text>
                            <Text style={{ fontSize: hp('1.5%'), marginTop: 5, fontWeight: "600" }}>/{item?.total_count}</Text>
                        </View>
                        <Text style={{ fontSize: hp('1.5%'), color: 'grey' }}>{item?.title}</Text>
                    </TouchableOpacity>
                }
            />
        )
    }

}