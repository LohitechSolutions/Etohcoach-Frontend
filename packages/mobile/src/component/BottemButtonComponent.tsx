import React from 'react'
import { Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { RFValue as rf } from "react-native-responsive-fontsize";
import { COLORS } from '../../../framework/src/Globals';
import { FONTS } from '../../../framework/src/Fonts';
import Context from "../../../components/src/context/context";
import { withTranslation } from "react-i18next";
import Scale from '../../../components/src/Scale';
import Icon from "react-native-vector-icons/FontAwesome";
class BottemButton extends React.Component {
    //------- Render -------//
    static contextType = Context;
    render() {
        const { t }: any = this.props;
        return (
            <View style={[styles.container,
            this.props.isPosition !== true && { position: 'absolute' }]} >
                <TouchableOpacity onPress={this.props.leftOnPress}>
                    {this.props.close ?
                        <View style={{ alignItems: 'center' }}>
                            <Image source={require('../assets/closeButton.png')} style={styles.closeBtn} />
                            <Text style={styles.BtnTxt}>{t("Close")}</Text>
                        </View>
                        : this.props.back ? <View style={{ alignItems: 'center' }}>
                            <Image source={require('../assets/backButton.png')} style={{...styles.leftBtn}} />
                            {/* <Icon name='angle-left'/> */}
                            <Text style={styles.BtnTxt}>{t("Back")}</Text>
                        </View> : this.props.discard ? <View style={{ alignItems: 'center', paddingLeft: hp(2), }}>
                            <Image source={require('../assets/discard.png')} style={styles.discardBtn} />
                            <Text style={styles.BtnTxt}>{t("Discard")}</Text>
                        </View> : null}

                </TouchableOpacity>
                {this.props.save ? <TouchableOpacity style={{ alignItems: 'center', paddingRight: hp(2) }} onPress={this.props.rightOnPress}>
                    <Image source={require('../assets/saveButton.png')} style={styles.rightBtn} />
                    <Text style={styles.BtnTxt}>{t("Save")}</Text>
                </TouchableOpacity> : null}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: hp(5),
        width: '90%',
        // position: 'absolute',
        bottom: hp(1),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        margin: wp(5),
        // backgroundColor: 'white'
    },
    leftBtn: {
        height: hp(3),
        width: hp(4),
      
    },
    discardBtn: {
        height: hp(2.4),
        width: hp(2.2)
    },
    rightBtn: {
        height: hp(3.5),
        width: hp(3.5)
    },
    BtnTxt: {
        fontSize: rf(11),
        color: COLORS.grey,
        fontFamily: FONTS.Roboto_Regular,
    },
    closeBtn: {
        height: hp(2),
        width: hp(2)
    }
})

export default withTranslation()(BottemButton);