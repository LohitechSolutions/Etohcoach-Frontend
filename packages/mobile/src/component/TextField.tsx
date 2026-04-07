//------- Import Statement -------//
import React from 'react'
import { View, TextInput, StyleSheet, Image, TouchableOpacity, Text, Platform, } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { RFValue as rf } from "react-native-responsive-fontsize";
import { COLORS } from '../../../framework/src/Globals';



//------- Class Declaration -------//
class TextField extends React.Component {
    //------- Class Constructor -------//
    constructor(props) {
        super(props);
        //------- States -------//
        this.state = {
        }
    }



    //------- Render -------//
    render() {
        return (
            <View testID={this.props.testID} style={[styles.mainContainer, {
                borderWidth: this.props.borderwidth, borderColor: this.props.borderColor
            }]}>
                <View style={{ flexDirection: 'row', marginLeft: wp(1.5) }}>
                    <Image source={this.props.Image} style={styles.textFieldIcon} resizeMode={'contain'} />
                    <View style={{ width: '82%', justifyContent: 'space-around', marginLeft: wp(1.5) }}>
                        {!!this.props.label ? <Text style={[styles.labalText, this.props?.labalColor &&{ color: this.props.labalColor }]}>{this.props.placeHolderName}</Text> : null}
                        <TextInput
                            placeholder={this.props.placeHolderName}
                            style={[styles.container, { color: this.props.textFieldColor, fontWeight: this.props.fWeight }]}
                            value={this.props?.Value}
                            onChangeText={this.props.onChangeText}
                            secureTextEntry={this.props.secureTextEntry}
                            keyboardType={this.props.keyboardType ?? 'default'}
                            editable={this.props.editable}
                        />
                    </View>
                </View>
                {
                    this.props.showButton ?
                        <TouchableOpacity onPress={this.props.onPress}>
                            <Image source={this.props.passwardImage} style={styles.textFieldIcon2} />
                        </TouchableOpacity> : null
                }
            </View >
        )
    }
}



const styles = StyleSheet.create({
    container: {
        height: wp(7),
        fontSize: rf(14),
        lineHeight: wp(4),
        padding: wp(1),
    },
    textFieldIcon: {
        height: hp(3.5),
        width: hp(3.5),
        alignSelf: 'center',
        tintColor: 'grey'
    },
    textFieldIcon2: {
        height: hp(3.2),
        width: hp(3.2),
        tintColor: COLORS.grey
    },
    mainContainer: {
        flexDirection: 'row',
        height: hp(7),
        width: '93.5%',
        alignSelf: 'center',
        backgroundColor: '#f0eff5',
        padding: hp(1.2),
        justifyContent: 'space-between',
        borderRadius: hp(1.1),
        alignItems: 'center',

    },
    labalText: {
        height: wp(8),
        fontSize: rf(11.7),
        lineHeight: wp(4),
        padding: wp(1),
        color: COLORS.grey

    }

})

export default TextField;