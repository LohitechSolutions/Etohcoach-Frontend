//------- Import Statement -------//
import React from "react";
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, SafeAreaView, FlatList, TouchableWithoutFeedback } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { RFPercentage, RFValue as rf } from "react-native-responsive-fontsize";
import TextField from '../../../mobile/src/component/TextField';
import ButtonComponent from '../../../mobile/src/component/ButtonComponent';
import { COLORS } from "../../../framework/src/Globals";
import { courceImage, email, imgPasswordInVisible, imgPasswordVisible } from "./assets";
import Scale from "../../../components/src/Scale";
import { withTranslation } from "react-i18next";
import Context from "../../../components/src/context/context";

//------- Constant Statement -------//
interface props {
    visible: any;
    onPressBack: () => void;
    onPressStart: () => void;
    onDropDown: () => void;
    onPressSelect: (val: any) => void;
    data: any;
    navigation: any
}
interface s {
    type: any,
    title: any,
    id: any,
    visible: boolean;
}

//------- Class Declaration -------//
class ReviewModal extends React.Component<props, s> {
    //------- Class Constructor -------//
    static contextType = Context;
    constructor(props: props) {
        super(props);
        //------- States -------//
        this.state = {
            type: 'theme',
            title: 'How the wine is done?',
            id: '',
            visible: true
        }
    }
    // SelectThemFun(){
    //     this.setState({themeData:[]})
    // }
    //------- Render -------//
    OnselFun(item: any) {
        console.log('showww items ', item)
        this.setState({ type: item?.type, title: item?.title, id: item?.id })
        this.props.onPressSelect(item)
    }

    renderFlashcardModal = (item: any) => {
        const {t}:any = this.props;
        return (
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.state.visible}
            >
                <TouchableWithoutFeedback onPress={() => this.setState({ visible: false })}>
                    <View style={styles.modalConatiner} >
                        <View style={styles.innerModalConatin}>
                            <Image source={courceImage} style={styles.courceImage} />
                            <View style={styles.reviewContainer}>
                                <Text style={styles.reviewTextContain}>dddddddd{item?.title}</Text>
                            </View>
                            <View style={styles.selectContainer}>
                                <Text style={styles.selectTextContain}>{ t("SelectOneOrManyThemesAndTheNumberOfCards")}</Text>
                            </View>
                            <View style={styles.themeConatin}>
                                <TouchableOpacity style={{ flexDirection: 'row', borderRadius: 10, alignItems: 'center', backgroundColor: '#F2F2F7', width: '95%', padding: 13, alignSelf: 'center', justifyContent: 'space-between' }}
                                    onPress={() => this.props.onDropDown()} >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image style={{ width: wp(4), height: hp(2) }}
                                            source={require('../assets/Vector.png')}
                                        />
                                        <View style={{ marginLeft: 10 }}>
                                            <Text style={{ color: '#777185', fontSize: 11, fontWeight: '600' }}>{this.state.type}</Text>
                                            <Text style={{ color: '#373434', fontSize: 14, fontWeight: '500' }}>{this.state.title}</Text>
                                        </View>
                                    </View>
                                    <Image style={{ width: wp(3), height: hp(1) }}
                                        source={require('../assets/Downicon.png')}
                                    />
                                </TouchableOpacity>
                                <FlatList
                                    data={this.props.data?.themsList}
                                    renderItem={({ item }: { item: any }) =>
                                        <TouchableOpacity style={{ width: '90%', justifyContent: 'center', marginTop: 5, alignSelf: 'center', alignItems: 'center', borderRadius: 10, height: 30, backgroundColor: '#F2F2F7' }} onPress={() => this.OnselFun(item)}>
                                            <Text>{item?.title}</Text>
                                        </TouchableOpacity>
                                    }
                                />
                            </View>
                            <View style={{ alignItems: 'center', marginTop: 20 }}>
                                <Text style={{ fontSize: 14, color: 'grey' }}>{t("CARDCOUNT")}</Text>
                                <Text style={{ fontSize: 40, fontWeight: '700' }}>{this.props.data?.card_count}</Text>
                                <View style={{ width: '90%', height: 5, borderRadius: 5, backgroundColor: '#ECF1F4', marginTop: 5, marginBottom: 5 }}>
                                    <View style={{ width: JSON.stringify(this.props.data?.card_count) + "%", height: 5, borderRadius: 5, backgroundColor: COLORS.lightRed }} ></View>
                                </View>
                            </View>
                            {/* <ButtonComponent onpress={()=>this.props.onPressBack()} BtnText={'BACK'} testID={'back'} extraStyle={styles.backButton} Style={styles.backText}/>
                        <ButtonComponent onpress={()=>this.props.onPressStart()} BtnText={'START'} testID={'start'} extraStyle={styles.startButton} /> */}
                            <View style={styles.confirmButton}>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => this.props.navigation.navigate("OverView", { visible: false })}>
                                    <Text style={styles.cancelTxt}>{ t("BACK")}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ContinueButton}
                                    // onPress={() => this.onPressStart()}
                                    onPress={() => this.props.navigation.navigate("CfFlashCardOne", { visible: false })}
                                >
                                    <Text style={styles.continueTxt}>{ t("START")}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                {this.renderFlashcardModal()}
            </SafeAreaView>
        )
    }
}


// Customizable Area Start
const styles = StyleSheet.create({
    modalConatiner: {
        flex: 1,
        justifyContent: 'flex-end',
        // borderColor: '#fff',
        // backgroundColor: 'rgba(0,0,0,0.5)',
    },
    innerModalConatin: {
        paddingHorizontal: hp(1),
        height: hp(80),
        width: '100%',
        borderRadius: hp(1.5),
        backgroundColor: COLORS.white,
        paddingTop: hp(4),
    },
    courceImage: {
        alignSelf: 'center',
        height: hp(15),
        width: hp(15),
    },
    themeConatin: {
        marginTop: hp(4),
    },

    backButton: {
        height: hp(6.5),
        width: '43%',
        borderWidth: wp(0.1),
        borderColor: COLORS.grey,
        borderRadius: hp(1.3),
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },


    confirmButton: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: Scale(30)
    },

    cancelButton: {
        width: Scale(165),
        height: Scale(56),
        borderRadius: Scale(12),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: Scale(1),
        borderColor: "lightgrey"
    },

    ContinueButton: {
        width: Scale(165),
        height: Scale(56),
        borderRadius: Scale(12),
        backgroundColor: COLORS.lightRed,
        alignItems: 'center',
        justifyContent: 'center'
    },

    continueTxt: {
        fontSize: Scale(16),
        fontWeight: "700",
        color: "#fff",
    },

    cancelTxt: {
        fontSize: Scale(16),
        fontWeight: "700",
    },

    backText: {
        color: COLORS.black,
        fontSize: rf(15),
        fontWeight: '500',
    },
    startButton: {
        height: hp(6.5),
        width: '43%',
        borderRadius: hp(1.3),
        backgroundColor: COLORS.lightRed,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    reviewContainer: {
        alignSelf: 'center',
        paddingTop: hp(2),
        paddingHorizontal: hp(6),
    },
    selectContainer: {
        paddingTop: hp(1),
        paddingHorizontal: hp(1),
    },
    reviewTextContain: {
        fontSize: rf(25),
        fontWeight: '600',
        textAlign: 'center',
    },
    selectTextContain: {
        fontSize: rf(13),
        color: COLORS.grey,
        textAlign: 'center',
    },

});

export default withTranslation()(ReviewModal);
