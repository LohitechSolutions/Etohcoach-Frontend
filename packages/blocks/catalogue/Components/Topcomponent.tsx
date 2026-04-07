import React, { useState, useRef, useEffect } from "react";
import { View, Text, SafeAreaView, Image, TouchableOpacity, FlatList, Dimensions, ScrollView } from "react-native";
import Scale from "../../../components/src/Scale";
import { COLORS } from "../../../framework/src/Globals";
import { FONTS } from "../../../framework/src/Fonts";
import { Colors } from "react-native-paper";

let lowstyle = {
    flexDirection: 'row', height: Scale(20), justifyContent: 'center'

}

let arr = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6]
export const TopComponent = (props: any) => {
    const scrollViewRef = useRef(null);
    const [scrollview, setscrllview] = useState(0)
    let currentIndexID = props?.flasdata[props.swiperIndex]?.id

    console.log(props, 'props in top flash')

    const checkifAllofthemhavefullrating = (data: any) => {
        let count = 0
        for (let i = 0; i < data.length; i++) {
            if (data[i].attributes.rating == 5) {
                count++
            }

        }

        return count
    }

    const InnerBackgroundCOlor = (rating) => {

        if (rating == 0) {
            return "#ECF1F4"
        }
        else if (rating == 1) {
            return COLORS.lightRed
        }
        else if (rating == 2) {
            return "#EE8464"
        }
        else if (rating == 3) {
            return "#F6A318"
        }
        else if (rating == 4) {
            return "#4BA3B7"
        }
        else if (rating == 5) {
            return "#73D19F"
        }
    }


    const OuterBackgroundColor = (current, index) => {

        if (current == index) {
            return '#485579'
        }
        else {
            return 'transparent'
        }

    }

    const scrollTo70Percent = () => {
        if (scrollViewRef.current) {
            if (props.swiperIndex <= 11) {
                scrollViewRef.current.scrollTo({ x: 0, animated: true });
                return

            }

            //   const { width } = scrollViewRef.current.contentSize;
            //   const scrollToOffset = width * 0.7;
            let multiply = Math.floor((props.swiperIndex + 1) / 12)

            console.log(multiply, "multiply")
            const boxSize = (scrollViewRef.current.props.style[0].width / 12) * (props.swiperIndex + 1 - 12)
            console.log(boxSize, scrollViewRef.current.props.style[0].width, props.swiperIndex, "jjjjjjj----ooooaa")
            if (boxSize)
                scrollViewRef.current.scrollTo({ x: scrollViewRef.current.props.style[0].width + boxSize - 40 - (multiply >= 5 ? 20 : 0), animated: true });

        }
    };

    useEffect(() => {
        scrollTo70Percent()
        console.log("jjjjjjj----oooo", scrollViewRef)

    }, [props.swiperIndex])



    let scrollviewIFcompleted =

        <ScrollView horizontal ref={scrollViewRef} style={props.flasdata.length >= 12 || props.topData.length >= 12 ? [{ width: Scale(220) }] : []}>
            <View style={{ flexDirection: 'row', height: Scale(20), marginLeft: Scale(10) }}>
                {
                    props.topData.map((e: any, index: any) =>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ marginTop: Scale(5) }} >
                                <View style={{
                                    width: Scale(12),
                                    height: Scale(12),
                                    borderRadius: Scale(13),
                                    borderWidth: Scale(1.5),
                                    borderColor: OuterBackgroundColor(currentIndexID, e?.id),
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }} >
                                    <View style={{
                                        width: Scale(10), height: Scale(10), borderRadius: Scale(10), backgroundColor: 'transparent',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }} >
                                        <View style={{ width: Scale(7), height: Scale(7), borderRadius: Scale(7), backgroundColor: InnerBackgroundCOlor(e?.attributes?.rating) }} />
                                    </View>
                                </View>
                                {console.log(props?.topData[index + 1]?.attributes?.rating, props?.topData[index]?.attributes?.rating)}

                            </View>
                            {index < props.flasdata.length - 1 && InnerBackgroundCOlor(props.topData[index]?.attributes?.rating) != InnerBackgroundCOlor(props.topData[index + 1]?.attributes?.rating) ? <View style={{ marginLeft: Scale(5), marginRight: Scale(10), width: Scale(2), height: 5, backgroundColor: "#ECF1F4", marginTop: Scale(5) }} /> : <View />}
                        </View>
                    )
                }

            </View>
        </ScrollView>

    let scrollviewIFnotCompleted = <ScrollView horizontal ref={scrollViewRef} style={props.flasdata.length >= 12 || props.topData.length >= 12 ? [{ width: Scale(190) }] : []}>
        <View style={{ flexDirection: 'row', height: Scale(20) }}>
            {
                props.topData.map((e: any, index: any) =>


                    <View style={{ marginRight: Scale(5), marginTop: Scale(5) }} >
                        <View style={{
                            width: Scale(12),
                            height: Scale(12),
                            borderRadius: Scale(13),
                            borderWidth: Scale(1.5),
                            borderColor: OuterBackgroundColor(currentIndexID, e?.id),
                            alignItems: 'center',
                            justifyContent: 'center'
                        }} >
                            <View style={{
                                width: Scale(10), height: Scale(10), borderRadius: Scale(10), backgroundColor: 'transparent',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }} >
                                <View style={{ width: Scale(7), height: Scale(7), borderRadius: Scale(7), backgroundColor: InnerBackgroundCOlor(e?.attributes?.rating) }} />
                            </View>
                        </View>
                    </View>
                )
            }

        </View>
    </ScrollView>
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Scale(20) }}>
            <TouchableOpacity style={{ height: 25, width: 25 }} onPress={() => { props.informodalHideShow(false) }}>
                <Image style={{ height: "100%", width: '100%' }} source={require('../assets/InfoIcon.png')} />
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>

                {props.isAllflashcardcompleted ? scrollviewIFcompleted : scrollviewIFnotCompleted}



            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                <Text style={{ color: "#73D19F", fontFamily: FONTS.Roboto_Regular, fontWeight: '800', fontSize: 16, marginBottom: Scale(3) }}>{checkifAllofthemhavefullrating(props?.flasdata ?? [])}</Text>
                <Text style={{ fontFamily: FONTS.Roboto_Regular, fontSize: 13, color: COLORS.grey }}>/</Text>
                <Text style={{ fontFamily: FONTS.Roboto_Regular, fontSize: 13, color: COLORS.grey }}>{props.flasdata.length}</Text>

            </View>
        </View>
    )
}
