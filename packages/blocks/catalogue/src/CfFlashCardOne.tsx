  // Customizable Area Start 
import React from 'react'
import { Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import Swiper from 'react-native-swiper';
import Loader from "../../../components/src/Loader";
import Scale from "../../../components/src/Scale";
import Context from "../../../components/src/context/context";
import { COLORS } from "../../../framework/src/Globals";
import CfFlashCardOneController from "./CfFlashCardOneController";
import styles from "./CfFlashCardOneStyle";

import { withTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { FONTS } from "../../../framework/src/Fonts";
import { addOfflineAPis, addOfflineData, loadingOfflineData, updateOfflineData, updateOfflineStatus } from "../../../mobile/src/store/actions/OfflineData";
import { Flashcardmodal } from '../Components/Flashcardmodal';
import { TopComponent } from '../Components/Topcomponent';
import WebViewComponent from "../Components/WebViewcomponent";
import { url } from 'inspector';
class CfFlashCardOne extends CfFlashCardOneController {
    static contextType = Context;
    prevClick() {
        let calculatedindex = this.state.swiperIndex - 1
        if (calculatedindex == -1) {
            return
        }

        this.setState(
            { isSelect: false, swiperIndex: calculatedindex }, 
            () => { 
                if(this.state.swiperIndex === 0) {
                    this.swiperRef.scrollBy(this.state.flashdata.length * -1);
                } else {
                    this.swiperRef.scrollTo(this.state.swiperIndex);
                }
            }
        );  
    }

    nextClick() {
        if (this.state.isSelect && !this.state.flashdata[this.state.swiperIndex].attributes.rating) {
            return
        }

        let calculatedindex = this.state.swiperIndex + 1
        if (calculatedindex >= this.state.flashdata.length) {
            calculatedindex = 0
        }
        
        this.setState(
            { isSelect: false, swiperIndex: calculatedindex }, 
            () => { 
                if(this.state.swiperIndex === 0) {
                    this.swiperRef.scrollBy(this.state.flashdata.length * -1);
                } else {
                    this.swiperRef.scrollTo(this.state.swiperIndex);
                }
            }
        );  
    }

    renderUserFlashCard = () => {
        return (
            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: Scale(20) }}>
                <Text style={{ fontSize: Scale(16), fontWeight: 'bold', color: COLORS.lightRed, lineHeight: Scale(16) }}>{this.state.swiperIndex + 1}</Text>
                <Text style={{ fontSize: Scale(12), fontWeight: '700', color: "#B5B2BF", lineHeight: Scale(12), marginTop: Scale(4) }}>/{this.state.flashdata?.length}</Text>
            </View>
        )
    }

    renderRevealAnswerButton = () => {
        const { t }: any = this.props;
        return (
            <View style={{ alignItems: "center", alignSelf: "center", }}>
                <TouchableOpacity style={{ width: Scale(350), height: Scale(55), borderRadius: Scale(12), alignItems: 'center', justifyContent: "center", backgroundColor: COLORS.lightRed }} onPress={() => this.setState({ isSelect: true })}>
                    <Text style={{ fontSize: Scale(16), fontWeight: "700", color: "#fff", lineHeight: Scale(18), letterSpacing: Scale(0.4) }}> { t("REVEALANSWER")}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderRattingList = (item: any) => {
        const { t }: any = this.props;
        return (
            <View>
                <Text style={{ fontSize: Scale(16), fontWeight: "600", lineHeight: Scale(21), alignSelf: "center" }}>{t("HowCloseWasYourAnswer")}</Text>
                <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
                    <Text style={{ marginLeft: Scale(20), fontSize: Scale(14), fontWeight: "400", color: "grey" }}>{ t("Wrong")}</Text>
                    <Text style={{ marginRight: Scale(5), fontSize: Scale(14), fontWeight: "400", color: "grey" }}>{t("Perfect")}</Text>
                </View>
                <View style={{ marginTop: Scale(10), flexDirection: 'row' }}>
                    <TouchableOpacity style={[this?.state?.flashdata[this.state.swiperIndex]?.attributes?.rating==1? styles.selected : styles.unSelected]} onPress={() => this.userRating(item.id, 1)}>
                        <Text style={[this?.state?.flashdata[this.state.swiperIndex]?.attributes?.rating== 1 ? styles.rattingTxt : styles.rattingTxt1]}>1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[this?.state?.flashdata[this.state.swiperIndex]?.attributes?.rating==2 ? styles.selected : styles.unSelected]} onPress={() => this.userRating(item.id, 2)}>
                        <Text style={[this?.state?.flashdata[this.state.swiperIndex]?.attributes?.rating==2  ? styles.rattingTxt : styles.rattingTxt1]}>2</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[this?.state?.flashdata[this.state.swiperIndex]?.attributes?.rating==3 ? styles.selected : styles.unSelected]} onPress={() => this.userRating(item.id, 3)}>
                        <Text style={[this?.state?.flashdata[this.state.swiperIndex]?.attributes?.rating ==3  ? styles.rattingTxt : styles.rattingTxt1]}>3</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[this?.state?.flashdata[this.state.swiperIndex]?.attributes?.rating==4 ? styles.selected : styles.unSelected]} onPress={() => this.userRating(item.id, 4)}>
                        <Text style={[this?.state?.flashdata[this.state.swiperIndex]?.attributes?.rating==4   ? styles.rattingTxt : styles.rattingTxt1]}>4</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[this?.state?.flashdata[this.state.swiperIndex]?.attributes?.rating==5 ? styles.selected : styles.unSelected]} onPress={() => this.userRating(item.id, 5)}>
                        <Text style={[this?.state?.flashdata[this.state.swiperIndex]?.attributes?.rating ==5 ? styles.rattingTxt : styles.rattingTxt1]}>5</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render() {
       
        const {t}:any = this.props;
        return (
            <SafeAreaView style={styles.mainContainer}>
                {/* {this.renderUserFlashCard()} */}
                <Swiper
                    style={styles.wrapper}
                    ref={(ref) => {this.swiperRef = ref}}
                    scrollEnabled={false}
                    showsPagination={false}
                    showsButtons={false}
                    loop={false}
                    autoplay={false}
                >
                    {this.state.flashdata?.map((item: any, index: any) => {

                        return (
                            <View style={{ flex: 1 }}>
                                <TopComponent isAllflashcardcompleted={this.state.isAllflashcardcompleted} topData={this.state.flashdata} flasdata={this.state.flashdata} swiperIndex={this.state.swiperIndex} informodalHideShow={this.informodalHideShow}   />
                                <View key={item.theme_id} style={{ flex: 1, alignItems: "center", justifyContent: 'space-between', }} >
                                    {this.state.isSelect ?
                                        <View style={{ width: Scale(370), height: "70%", backgroundColor: "#fff", borderRadius: Scale(12), shadowColor: "green", justifyContent: 'space-evenly', marginTop: Scale(20) }}>
                                           
                                            <Text style={{ fontFamily: FONTS.Roboto_Bold, color: COLORS.grey, marginLeft: Scale(40),marginTop: Scale(20) }}>
                                                { t("QUESTION")}
                                            </Text>
                                            {item?.attributes?.image !== "null" ?
                                                <Image
                                                    style={{ ...styles.imageContainer, marginTop: 0 }}
                                                    source={{uri: item?.attributes?.image}}
                                                    resizeMode={"cover"}
                                                />
                                                :
                                               <View />
                                            }
                                            <ScrollView style={{marginTop:Scale(20)}}>
                                            <Text  style={{ marginLeft: Scale(32), maxWidth: Scale(300), fontSize: Scale(20), letterSpacing: Scale(0.4), fontWeight: "400", lineHeight: Scale(24), fontFamily: FONTS.Roboto_Regular }}>{item?.attributes.question}</Text>
                                            </ScrollView>
                                            <View style={{ height: "30%" }}>
                                               
                                                <View style={{ width: Scale(300), height: Scale(1), backgroundColor: "lightgrey", alignSelf: 'center' }} />
                                               
                                                <Text style={{ fontFamily: FONTS.Roboto_Bold, color: COLORS.grey, marginLeft: Scale(40), marginTop: Scale(20) }}>
                                                    { t("ANSWER")}
                                                </Text>
                                                <ScrollView>
                                    {/* <RenderHTML source={{html:item?.attributes.answer}} /> */}
                                    <View style={{width:'80%',alignSelf:'center'}}>
                                    <WebViewComponent   html={item?.attributes.answer}/>
                                    </View>
                                                {/* <Text style={{ marginLeft: Scale(40), marginTop: Scale(10), maxWidth: Scale(300), fontSize: Scale(20), letterSpacing: Scale(0.4), fontWeight: "600", lineHeight: Scale(24) }}>{item?.attributes.answer}</Text> */}
                                                </ScrollView>
                                            </View>
                                        </View>
                                        :
                                        <View style={{ width: Scale(370), height: "70%", backgroundColor: "#fff", borderRadius: Scale(12), marginTop: Scale(20) }}>
                                            {item?.attributes?.image !== "null" ?
                                                <Image
                                                    style={styles.imageContainer}
                                                    source={{uri: item?.attributes?.image}}
                                                    resizeMode={"cover"}
                                                />
                                                :
                                                <View />
                                            }
                                            <Text style={{ marginLeft: Scale(32), marginTop: Scale(20), maxWidth: Scale(300), fontSize: Scale(20), letterSpacing: Scale(0.4), fontWeight: "400", lineHeight: Scale(24), fontFamily: FONTS.Roboto_Regular }}>{item?.attributes.question}</Text>
                                        </View>
                                    }
                                    {this.state.isSelect ? this.renderRattingList(item) :
                                        <View style={{ alignItems: "center", alignSelf: "center", }}>
                                            <TouchableOpacity style={{ width: Scale(350), height: Scale(55), borderRadius: Scale(12), alignItems: 'center', justifyContent: "center", backgroundColor: COLORS.lightRed }} onPress={() => this.setState({ isSelect: true, userFlashCardId: item.id })}>
                                                <Text style={{ fontSize: Scale(16), fontWeight: "700", color: "#fff", lineHeight: Scale(18), letterSpacing: Scale(0.4) }}>{t("REVEALANSWER")}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                    <View style={{ flexDirection: 'row', justifyContent: "space-between", width: "100%", marginBottom: Scale(10),alignItems:'center' }}>
                                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginLeft: Scale(30) }} onPress={() => { this.state.isSelect ? this.setState({ isSelect: false }) : this.props.navigation.goBack() }}>
                                            <Image style={{ width: Scale(35), height: Scale(35), resizeMode: "contain", tintColor: "grey" }} source={require("../assets/close.png")} />
                                            <Text style={{ marginTop: Scale(5), fontSize: Scale(10), fontWeight: "400", lineHeight: Scale(10), color: "#777185" }}>{ t("Close")}</Text>
                                        </TouchableOpacity>
                                        <View style={{ flexDirection: 'row', justifyContent: "space-between", width: Scale(180), marginRight: Scale(30) ,marginTop:Scale(10)}}>
                                           {this.state.swiperIndex!=0? <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', }} onPress={() => this.prevClick()}>
                                                <Image style={{ width: Scale(15), height: Scale(15), tintColor: "grey", resizeMode: "contain" }} source={require("../assets/leftArrow.png")} />
                                                <Text style={{ marginTop: Scale(15), fontSize: Scale(10), fontWeight: "400", lineHeight: Scale(10), color: "#777185" }}>{ t("Previous")}</Text>
                                            </TouchableOpacity>:<View />}
                                            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginRight: Scale(20) }} onPress={() => this.nextClick()}>
                                                <Image style={{ width: Scale(15), height: Scale(15), tintColor: "grey", resizeMode: "contain" }} source={require("../assets/rightArrow.png")} />
                                                <Text style={{ marginTop: Scale(15), fontSize: Scale(10), fontWeight: "400", lineHeight: Scale(10), color: "#777185", }}>{t("Next")}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </Swiper>
                <Loader loading={this.state.isLoading} />
                <Flashcardmodal infomodalVisible={this.state.infomodalVisible} informodalHideShow={this.informodalHideShow}  t={this.props.t} />
            </SafeAreaView >
        )
    }
}

const mapStateToProps = (state: any) => {
    return {
        offlineState: state.rootReducer.offlineReducer,
        subscriptionState:state.rootReducer.subscriptionReducer
    }
}

const mapDispatchToProps = (dispatch: any) => {
    // bindActionCreators(
    //   {
    //     // offlineDataWatcher
    //     // OfflineActionCreators
    //     addOfflineData
    //   },
    //   dispatch,
    return {
        addOfflineData: (params:any) => {
            dispatch(addOfflineData(params))
        },
        updateOfflineData: (params:any) => {
            dispatch(updateOfflineData(params))
        },
        updateOfflineStatus: (params:any) => {
            dispatch(updateOfflineStatus(params))
        },
        loadingOfflineData: (params:any) => {
            dispatch(loadingOfflineData(params))
        },
        addOfflineAPis: (params:any) => {
            dispatch(addOfflineAPis(params))
        },
    }
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(CfFlashCardOne));
 // Customizable Area End
