import React from "react";
import { Component } from "react";
import styles from "./RevealAnswerStyle"
import { View, Text, SafeAreaView, Image, TouchableOpacity, FlatList, } from "react-native";
import Scale from "../../../components/src/Scale";
import RevealAnswerController from "./RevealAnswerController"
import Swiper from 'react-native-swiper'
import { COLORS } from "../../../framework/src/Globals";

export default class RevealAnswer extends RevealAnswerController {
    renderRevealAnswerCell = () => {
        console.log('aaaakakakk@@@=', this.state.reveal?.attributes?.user_count)
        return (
            <View>
                <View style={{ alignItems: "center", }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: Scale(16), fontWeight: '600', color: COLORS.lightRed }}>{this.state.reveal?.attributes?.user_count}</Text>
                        <Text style={{ fontSize: Scale(12), fontWeight: '600', color: "#B5B2BF", marginTop: Scale(8) }}>/{this.state.reveal?.attributes?.total_count}</Text>
                    </View>
                    <View style={{ width: Scale(340), height: Scale(600), alignSelf: 'center', backgroundColor: "#fff", marginTop: Scale(15), borderRadius: Scale(12), justifyContent: "space-around" }}>
                        <Text style={{ fontSize: Scale(20), lineHeight: Scale(24), fontWeight: "700", marginLeft: Scale(20), marginTop: Scale(15) }}>{this.state.reveal?.attributes?.question}</Text>
                        <Text style={{ fontSize: Scale(20), lineHeight: Scale(24), fontWeight: "700", marginLeft: Scale(20), marginTop: Scale(15) }}>{this.state.reveal?.attributes?.answer}</Text>
                    </View>
                </View>
            </View>
        )
    }

    renderRevealAnswerFlatlist = () => {
        return (
            <FlatList
                // data={this.state.revealAnswer}
                data={[]}
                renderItem={({ item }) => this.renderRevealAnswerCell()}
            />
        )
    }

    // renderRatting = () => {
    //     return (
    //         <View>
    //             <Text style={{ fontSize: Scale(16), fontWeight: "600", lineHeight: Scale(21), marginTop: Scale(10), alignSelf: "center" }}>How close was your answer</Text>
    //             <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
    //                 <Text style={{ marginLeft: Scale(25), fontSize: Scale(14), fontWeight: "400", color: "grey" }}>Wrong</Text>
    //                 <Text style={{ marginRight: Scale(25), fontSize: Scale(14), fontWeight: "400", color: "grey" }}>Perfect</Text>
    //             </View>
    //             <View style={{ flexDirection: "row", justifyContent: 'space-evenly', marginTop: Scale(10) }}>
    //                 <TouchableOpacity style={[this.state.one ? styles.selected : styles.unSelected]} onPress={() => this.renderToggleButton(0)}>
    //                     <Text style={[this.state.one ? styles.rattingTxt : styles.rattingTxt1]}>1</Text>
    //                 </TouchableOpacity>
    //                 <TouchableOpacity style={[this.state.two ? styles.selected : styles.unSelected]} onPress={() => this.renderToggleButton(1)}>
    //                     <Text style={[this.state.two ? styles.rattingTxt : styles.rattingTxt1]}>2</Text>
    //                 </TouchableOpacity>
    //                 <TouchableOpacity style={[this.state.three ? styles.selected : styles.unSelected]} onPress={() => this.renderToggleButton(2)}>
    //                     <Text style={[this.state.three ? styles.rattingTxt : styles.rattingTxt1]}>3</Text>
    //                 </TouchableOpacity>
    //                 <TouchableOpacity style={[this.state.four ? styles.selected : styles.unSelected]} onPress={() => this.renderToggleButton(3)}>
    //                     <Text style={[this.state.four ? styles.rattingTxt : styles.rattingTxt1]}>4</Text>
    //                 </TouchableOpacity>
    //                 <TouchableOpacity style={[this.state.five ? styles.selected : styles.unSelected]} onPress={() => this.renderToggleButton(4)}>
    //                     <Text style={[this.state.five ? styles.rattingTxt : styles.rattingTxt1]}>5</Text>
    //                 </TouchableOpacity>
    //             </View>
    //             <View style={{ flexDirection: 'row', justifyContent: "space-between", marginTop: Scale(10) }}>
    //                 <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginLeft: Scale(15) }} onPress={() => this.props.navigation.goBack()}>
    //                     <Image style={{ width: Scale(20), height: Scale(15), resizeMode: "contain", tintColor: "grey" }} source={require("../assets/close.png")} />
    //                     <Text style={{ marginTop: Scale(5), fontSize: Scale(12) }}>Close</Text>
    //                 </TouchableOpacity>
    //                 <View style={{ flexDirection: 'row', justifyContent: "space-between", width: Scale(180) }}>
    //                     <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', }}>
    //                         <Image style={{ width: Scale(30), height: Scale(25), tintColor: "grey" }} source={require("../assets/left_icon.png")} />
    //                         <Text style={{ marginTop: Scale(5), fontSize: Scale(12) }}>Previous</Text>
    //                     </TouchableOpacity>
    //                     <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginRight: Scale(20) }}>
    //                         <Image style={{ width: Scale(30), height: Scale(25), tintColor: "grey" }} source={require("../assets/imagenav_lesson.png")} />
    //                         <Text style={{ marginTop: Scale(5), fontSize: Scale(12) }}>Next</Text>
    //                     </TouchableOpacity>
    //                 </View>
    //             </View>
    //         </View>
    //     )
    // }

    renderToggleButton = (index: any) => {
        if (index === 0) {
            this.setState({ one: true, two: false, three: false, four: false, five: false })
        } else if (index === 1) {
            this.setState({ one: false, two: true, three: false, four: false, five: false })
        }
        else if (index === 2) {
            this.setState({ one: false, two: false, three: true, four: false, five: false })
        }
        else if (index === 3) {
            this.setState({ one: false, two: false, three: false, four: true, five: false })
        }
        else if (index === 4) {
            this.setState({ one: false, two: false, three: false, four: false, five: true })
        }
    }

    nextClick() {
        // this.setState({ swiperIndex: this.state.swiperIndex + 1 }, () => {
        //     if(this.state.swiperIndex > this.state.flashdata.length){
        //         return;
        //     }else{
        //         this.refs.swiper.scrollBy(1)
        //     }

        //     console.log("@@@ Next Button click ========>", this.state.swiperIndex)
        // })

        if (this.state.swiperIndex + 1 == this.state.flashdata1.length) {
            return;
        } else {
            this.setState({ swiperIndex: this.state.swiperIndex + 1 }, () => {
                this.refs.swiper.scrollBy(1)
            })
        }
    }

    prevClick() {
        if (this.state.swiperIndex === 0) {
            return;
        } else {
            this.setState({ swiperIndex: this.state.swiperIndex - 1 }, () => {
                this.refs.swiper.scrollBy(-1)
            })
        }

    }

    BottonView = () => {
        const showNextButton = this.state.flashdata.length % 2 === 0 ? (this.state.swiperIndex <= this.state.flashdata.length || this.state.swiperIndex === 0) : (this.state.swiperIndex < this.state.flashdata.length || this.state.swiperIndex === 0);
        return (
            <View style={{ width: "100%", height: Scale(30), flexDirection: "row", justifyContent: "space-between", marginTop: verticalScale(20) }}>
                <TouchableOpacity style={{ width: Scale(50), height: Scale(40), alignItems: "center" }} onPress={() => this.setState({ callViewVisible: this.state.swiperIndex === 0 ? false : true, }, () => {
                    this.prevClick()
                })} >
                    {/* <Image resizeMode="contain" source={IMG_CONST.DOWN_SNAP} style={{ width: Scale(40), height: Scale(40), }} /> */}
                </TouchableOpacity>
                {showNextButton && <TouchableOpacity style={{ width: Scale(50), height: Scale(40), alignItems: "center" }} onPress={() => this.setState({ callViewVisible: true }, () => {
                    this.nextClick()
                })} >
                    {/* <Image resizeMode="contain" source={IMG_CONST.DOWN1_SNAP} style={{ width: Scale(40), height: Scale(40), }} /> */}
                </TouchableOpacity>}

            </View>
        )
    }

    render() {
        return (
            <SafeAreaView>
                {/* {this.renderRevealAnswerCell()} */}
                <Swiper
                    style={styles.wrapper}
                    // renderPagination={renderPagination}
                    ref={(swiper) => { this.swiper = swiper; }}

                    showsPagination={false}
                    onIndexChanged={swiperIndex => this.setState({ swiperIndex }, () => {
                        console.log("wefresgersgeqrsgersgers", this.state.swiperIndex)
                    })}
                    showsButtons={false}
                    loop={false}
                    autoplay={false}
                    ref={'swiper'}
                >
                    {this.state.flashdata1?.map((item: any, index: any) => {
                        console.log("dwfewferwferwsvresver", item)
                        return (
                            <View key={item.theme_id} style={{ flex: 1, alignItems: "center" }} >
                                <View style={{ width: Scale(370), height: Scale(600), backgroundColor: "#fff", borderRadius: Scale(12), shadowColor: COLORS.success, shadowOffset: { width: 0, height: 30 } }}>
                                    <Image
                                        style={styles.imageContainer}
                                        // source={item?.attributes?.image}
                                        source={require("../assets/image_question.png")}
                                        resizeMode={"cover"}
                                    />
                                    <Text numberOfLines={3} style={{ marginLeft: Scale(32), marginTop: Scale(20), maxWidth: Scale(300), fontSize: Scale(20), letterSpacing: Scale(0.4), fontWeight: "700", lineHeight: Scale(24) }}>{item?.attributes.question}</Text>
                                </View>
                            </View>
                        );
                    })}
                </Swiper>
                {this.renderRatting()}
            </SafeAreaView>
        )
    }
}