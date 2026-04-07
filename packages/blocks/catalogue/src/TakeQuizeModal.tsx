//------- Import Statement -------//
import React from "react";
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, SafeAreaView } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { RFPercentage, RFValue as rf } from "react-native-responsive-fontsize";
import TextField from '../../../mobile/src/component/TextField';
import ButtonComponent from '../../../mobile/src/component/ButtonComponent';
import { COLORS } from "../../../framework/src/Globals";
import { courceImage, email, imgPasswordInVisible, imgPasswordVisible } from "./assets";
import MockTestModal from "../../../mobile/src/component/ModalComponent";
import Context from "../../../components/src/context/context";
import { withTranslation } from "react-i18next";

//------- Constant Statement -------//

//------- Class Declaration -------//
class TakeQuizeModal extends React.Component {
    //------- Class Constructor -------//
    static contextType = Context;
    constructor(props) {
        super(props);
        //------- States -------//
        this.state = {
            isVisible: false,
        }
    }
    //------- Render -------//
    render() {
        const {t}:any = this.props;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <MockTestModal image={courceImage} image1={email} />
                <Modal
                    animationType={"fade"}
                    transparent={false}
                    visible={true}
                    onRequestClose={() => { console.log("Modal has been closed.") }}>
                    <TouchableOpacity style={styles.modalConatiner} onPress={() => this.setState({ isVisible: !this.state.isVisible })}>
                        <View style={styles.innerModalConatin}>
                            <Image source={courceImage} style={styles.courceImage} />
                            <View style={styles.quizContainer}>
                                <Text style={styles.quizTextContain}>
                                    {t("TakeQuiz")}
                                </Text>
                            </View>
                            <View style={styles.selectContainer}>
                                <Text style={styles.selectTextContain}>
                                    {t("SelectTheQuizYouWouldLikeToTake")}
                                </Text>
                            </View>
                            <View style={styles.themeConatin}>
                                <TextField
                                    testID={'Theme'}
                                    placeHolderName={t("Theme")}
                                    Image={email}
                                />
                            </View>
                            <View style={styles.buttonConatiner}>
                                <ButtonComponent BtnText={t("BACK")} testID={'back'} extraStyle={styles.backButton} Style={styles.backText} />
                                <ButtonComponent BtnText={t("START")} testID={'start'} extraStyle={styles.startButton} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </SafeAreaView>
        )
    }
}
// Customizable Area Start
const styles = StyleSheet.create({
    modalConatiner: {
        flex: 1,
        justifyContent: 'flex-end',
        borderColor: '#fff',
        backgroundColor: COLORS.filterBackground,
    },
    innerModalConatin: {
        paddingHorizontal: hp(1),
        height: hp(65),
        width: '100%',
        borderRadius: hp(1.5),
        backgroundColor: COLORS.white,
        paddingTop: hp(4),
    },
    courceImage: {
        alignSelf: 'center',
        height: hp(15),
        width: hp(15),
        tintColor: COLORS.lightRed
    },
    themeConatin: {
        marginTop: hp(4),
    },
    buttonConatiner: {
        flexDirection: 'row',
        paddingTop: hp(5),
        justifyContent: 'space-around',
        // paddingHorizontal:hp(2),
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
    quizContainer: {
        alignSelf: 'center',
        paddingTop: hp(2),
        paddingHorizontal: hp(6),
    },
    selectContainer: {
        paddingTop: hp(1),
        paddingHorizontal: hp(1),
    },
    quizTextContain: {
        fontSize: rf(25),
        fontWeight: '600',
        textAlign: 'center',
    },
    selectTextContain: {
        fontSize: rf(15),
        color: COLORS.grey,
        textAlign: 'center',
    },

});

export default TakeQuizeModal;