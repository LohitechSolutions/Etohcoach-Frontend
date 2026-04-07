//------- Import Statement -------//
import React from 'react'
import { Text, StyleSheet, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { RFValue as rf } from "react-native-responsive-fontsize";
import { COLORS } from '../../../framework/src/Globals';
import { FONTS } from '../../../framework/src/Fonts';

//------- Constant Statement -------//


//------- Class Declaration -------//
class ButttonComponent extends React.Component {



    //------- Render -------//
    render() {
        return (
                this.props.showLoader ? 
                <View style={this.props.extraStyle ? this.props.extraStyle : styles.container}>
                    <ActivityIndicator size={'small'} color={COLORS.white} />
                </View>
                :
                <TouchableOpacity disabled={this.props.disabled} style={this.props.extraStyle ? this.props.extraStyle : styles.container} onPress={this.props.onpress} testID={this.props.testID}>
                    <Text style={this.props.Style ? this.props.Style : styles.btnText}>{this.props.BtnText}</Text>
                </TouchableOpacity>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        height: hp(6.5),
        width: '92%',
        borderRadius: hp(1.3),
        backgroundColor: COLORS.lightRed,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    btnText: {
        color: 'white',
        fontSize: rf(15),
        fontFamily:FONTS.Roboto_Medium,
      
    },
})

export default ButttonComponent;