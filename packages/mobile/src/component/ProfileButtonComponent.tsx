import React from "react";
import { Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { FONTS } from "../../../framework/src/Fonts";
import { COLORS } from "../../../framework/src/Globals";
import Scale from "../../../components/src/Scale";

//------- Class Declaration -------//
class ProfileButttonComponent extends React.Component {



    //------- Render -------//
    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress} style={this.props.borderTouchableBtn ?
                this.props.shaddow ? [styles.borderTouchableBtn, {
                    shadowColor: 'black',
                    shadowOpacity: 0.3,
                    shadowOffset: { width: 0, height: 0 },
                    shadowRadius: 5,
                    elevation: 12,
                    backgroundColor: 'white'
                }] : styles.borderTouchableBtn
                : [styles.touchableBtn, { borderBottomWidth: this.props.borderwidth }]}>
               { !this.props.isprivacy?<Image style={{ width: hp(3.5), height: hp(3.5), marginLeft: this.props.borderTouchableBtn ? wp(5) : wp(3), tintColor: this.props.tintcolor }}
                    source={this.props.btnIcon}
                    resizeMode={'contain'}
                />:
                 <Image style={{ width: hp(2.8), height: hp(2.8), marginLeft: wp(4) ,marginRight:Scale(8), tintColor: this.props.tintcolor }}
                    source={this.props.btnIcon}
                    resizeMode={'contain'}
                />}
                <Text style={{ fontSize: hp('2.1%'), marginLeft: wp(3), fontFamily: FONTS.Roboto_Medium, color: this.props.textColor, width: '75%' }}>{this.props.buttonName}</Text>
                {this.props.backArrow ? <Image source={require('../assets/leftArrow.png')} style={{ width: hp(4.5), height: hp(4.5) ,tintColor:this.props.isdelete?COLORS.lightRed:'none'}} /> : null}
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    touchableBtn: {
        width: '90%',
        alignSelf: 'center',
        borderColor: COLORS.lightBlueGrey,
        height: hp(7.3),
        alignItems: 'center',
        flexDirection: 'row',
    },
    borderTouchableBtn: {
        width: '98%',
        alignSelf: 'center',
        borderColor: COLORS.lightBlueGrey,
        height: hp(6.5),
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: hp(0.1),
        borderRadius: hp(1.5),
    }
})

export default ProfileButttonComponent
