
// Customizable Area Start
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from "react-native";
import React from "react";
import { RFValue as rf } from "react-native-responsive-fontsize";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from "react-native-responsive-screen";
import Context from "../../../components/src/context/context";
import { FONTS } from "../../../framework/src/Fonts";
import { COLORS } from "../../../framework/src/Globals";
import BottemButton from "../../../mobile/src/component/BottemButtonComponent";
import TextField from '../../../mobile/src/component/TextField';
import ToastMassage from "../../../mobile/src/component/ToastMassage";
import UserProfileBasicController, { Props } from "./UserProfileBasicController";
import { user, userImage } from "./assets";

import { withTranslation } from "react-i18next";
import { connect } from 'react-redux';
import { addUserProfile, removeUserProfile } from "../../../mobile/src/store/actions/UserProfile";
// Customizable Area End

class EditProfile extends UserProfileBasicController {
    static contextType = Context;
    constructor(props: Props) {
        super(props);
        // Customizable Area Start

        // Customizable Area End
    }

    // Customizable Area Start

    // Customizable Area End

    render() {
        const { t }: any = this.props;
        return (

            /* Customizable Area Start */

            <SafeAreaView style={styles.container}>
                <View style={styles.imgConatiner}>
                    <Image source={userImage} style={styles.userImage} />
                </View>
                <View style={styles.usernameContainer}>
                    <Text style={styles.userTextContain} >
                        {t("UserName")}
                    </Text>
                </View>
                <View style={styles.displayedContainer}>
                    <Text style={styles.desplayTextContain}>
                        {t("UserNameLeaderBoard")}
                    </Text>
                </View>
                <View style={styles.firstNameContain}>
                    <TextField
                        testID={'FirstName'}
                        placeHolderName={t("FirstName")}
                        Image={user}
                        Value={this.state.firstName}
                        onChangeText={(text: string) => this.setState({ firstName: text })}
                        label={this.state.firstName}
                        borderwidth={this.state.firstNameError !== '' ? hp(0.2) : 0}
                        borderColor={this.state.firstNameError !== '' ? COLORS.lightRed : null}
                        fWeight={this.state.firstName!=='' ? '400' : '0'}
                        editable={this.state.isConnectionStatus}
                    />
                    {this.state.firstNameError !== "" && (
                        <Text testID={"firstNameError"} style={styles.errorLabel}>
                            {this.state.firstNameError}
                        </Text>
                    )}
                </View>
                <View style={styles.lastNameContain}>
                    <TextField
                        testID={'LastName'}
                        placeHolderName={t("LastName")}
                        Image={user}
                        Value={this.state.lastName}
                        onChangeText={(text) => this.setState({ lastName: text })}
                        label={this.state.lastName}
                        borderwidth={this.state.lastNameError !== '' ? hp(0.2) : 0}
                        editable={this.state.isConnectionStatus}
                        borderColor={this.state.lastNameError !== '' ? COLORS.lightRed : null}
                        fWeight={this.state.lastName !== '' ? '400' : '0'} />
                    {this.state.lastNameError !== "" && (
                        <Text testID={"lastNameError"} style={styles.errorLabel}>
                            {this.state.lastNameError}
                        </Text>
                    )}
                </View>
                {
                    this.state.error != '' ? <ToastMassage isSuccess={false} toastMassage={this.state.error} /> : null
                }
                {
                    this.state.success != '' ? <ToastMassage isSuccess={true} toastMassage={this.state.success} /> : null
                }
                <BottemButton leftOnPress={() => this.props.navigation.goBack()} rightOnPress={() => this.submitSaveProfile()} save={true} back={true} />
                {/* <Loader loading={this.state.showLoader} /> */}
            </SafeAreaView>
            /* Customizable Area End */
        );
    }
}

const styles = StyleSheet.create({
    // Customizable Area Start
    container: {
        flex: 1,
        // paddingHorizontal:hp(2),
        backgroundColor: 'white',
    },
    imgConatiner: {
        alignSelf: 'center',
        marginTop: hp(2),
    },
    userImage: {
        height: hp(12),
        width: hp(12),
        tintColor: COLORS.lightRed
    },
    usernameContainer: {
        alignSelf: 'center',
        paddingTop: hp(2),
    },
    displayedContainer: {
        // paddingTop: hp(1),
    },
    userTextContain: {
        fontSize: rf(25),
        fontFamily: FONTS.Explet_Bold,
        textAlign: 'center',
    },
    desplayTextContain: {
        fontSize: rf(13),
        color: COLORS.grey,
        textAlign: 'center',
        fontFamily: FONTS.Roboto_Regular
    },
    firstNameContain: {
        marginTop: hp(2),
    },
    lastNameContain: {
        marginTop: hp(2),
    },
    errorLabel: {
        alignSelf: "flex-end",
        marginRight: wp(4),
        color: COLORS.lightRed,
    },

    // Customizable Area End
});
const mapStateToProps = (state : any) => {
    return {
      userProfileState: state.rootReducer.userProfileReducer,
    }
  }
  
  const mapDispatchToProps = (dispatch : any) => {
    return {
      addUserProfile : (params:any) => {
        dispatch(addUserProfile(params))
      }, 
     
     
      removeUserProfile:()=>{
        dispatch(removeUserProfile())
      }
    }
  };
  
  export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(EditProfile));