import React from "react";

// Customizable Area Start
import {
    View,
    StyleSheet,
    Platform,
    ScrollView,
    Text,
    Image,
    KeyboardAvoidingView,
    SafeAreaView,
    TouchableOpacity,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { RFValue as rf } from "react-native-responsive-fontsize";
import ButtonComponent from '../../../mobile/src/component/ButtonComponent';
import { imgPasswordInVisible, imgPasswordVisible, } from './assets';
import { COLORS } from "../../../framework/src/Globals";
import { withTranslation } from "react-i18next";

// Customizable Area End

import ForgotPasswordController, { Props } from "./ForgotPasswordController";
import Loader from "../../../components/src/Loader";
import { back, passwordImage, save } from "../../user-profile-basic/src/assets";
import NewPasswordController from "./NewPasswordController";
import { password } from "../../email-account-registration/src/assets";
import TextField from "../../../mobile/src/component/TextField";
import ToastMassge from "../../../mobile/src/component/ToastMassage";
import Context from "../../../components/src/context/context";


class NewPassword extends NewPasswordController {
  // Customizable Area Start
  static contextType = Context;
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.isChangePassword = true;
    // Customizable Area Start
    // Customizable Area End
  }
  
  render() {
    const {t}:any = this.props;

    const langaugeDatafromapi = this.context.langaugeData?.meta?.translations;
    return (
      <SafeAreaView style={styles.container}>
                <View style={styles.imgConatiner}>
                    <Image source={passwordImage} style={styles.userImage} />
                </View>
                <View style={styles.usernameContainer}>
                    <Text style={styles.userTextContain}>
                    {t("NewPassword")}
                    </Text>
                </View>
                <View style={styles.displayedContainer}>
                    <Text style={styles.desplayTextContain}>
                    {t("EnterConfirmText")}
                    </Text>
                </View>
                <View style={styles.lastNameContain}>
                    <TextField
                        testID={'Passward'}
                        borderwidth={this.state.newPasswordError === true ? hp(0.2) : 0}
                        borderColor={this.state.newPasswordError === true ? COLORS.lightRed : null}
                        showButton={true}
                        placeHolderName={t("Newpassword")}
                        Image={password}
                        Value={this.state.newPassword}
                        label={this.state.newPassword}
                        onChangeText={(text: string) => this.setState({ newPassword: text })}
                        secureTextEntry={this.state.newSecreEntry === true ? false : true}
                        onPress={() => this.setState({ newSecreEntry: !this.state.newSecreEntry })}
                        passwardImage={this.state.newSecreEntry === true ? imgPasswordInVisible : imgPasswordVisible}
                        textFieldColor={this.state.newPasswordError === true ? COLORS.lightRed : null}
                        labalColor={this.state.newPasswordError === true ? COLORS.lightRed : null}
                        fWeight={this.state.newPassword !== '' ? '400' : null}
                    />
                    {this.state.newPasswordError === true && <Text testID={'Inccorect Passward'} style={styles.errorLabel}>{t("IncorrectPassword")}</Text>}
                </View>

                <View style={styles.lastNameContain}>
                    <TextField
                        testID={'ReEnterPassward'}
                        borderwidth={this.state.reEnterPasswordError === true ? hp(0.2) : 0}
                        borderColor={this.state.reEnterPasswordError === true ? COLORS.lightRed : null}
                        showButton={true}
                        placeHolderName={t("ReEnterNewpassword")}
                        Image={password}
                        Value={this.state.reEnterPassword}
                        label={this.state.reEnterPassword}
                        onChangeText={(text: string) => this.setState({ reEnterPassword: text })}
                        secureTextEntry={this.state.reEnterSecreEntry === true ? false : true}
                        onPress={() => this.setState({ reEnterSecreEntry: !this.state.reEnterSecreEntry })}
                        passwardImage={this.state.reEnterSecreEntry === true ? imgPasswordInVisible : imgPasswordVisible}
                        textFieldColor={this.state.reEnterPasswordError === true ? COLORS.lightRed : null}
                        labalColor={this.state.reEnterPasswordError === true ? COLORS.lightRed : null}
                        fWeight={this.state.reEnterPassword !=='' ? '400' : null}
                    />
                    {this.state.reEnterPasswordError === true && <Text testID={'Inccorect Passward'} style={styles.errorLabel}>{t("IncorrectPassword")}</Text>}
                </View>

 
                {this.state.changepasswordToast === "Success"? <View style={{ position: 'absolute', bottom: hp(12), width: '100%' }}>
                    <ToastMassge isSuccess={true} toastMassage={t("PasswordChangedSuccessfully")} />
                </View> :this.state.changepasswordToast === "Error"?<View style={{ position: 'absolute', bottom: hp(12), width: '100%' }}>
                    <ToastMassage isSuccess={false} toastMassage={this.state.passwordErrorMassage} />
                </View> : null}


                <View style={styles.bottomConatiner}>
                    <TouchableOpacity style={styles.backConatiner} onPress={() => this.props.navigation.goBack()}>
                        <Image source={back} style={styles.backImg} />
                        <Text style={styles.backText}>{t("Back")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveConatiner} onPress={() => this.submitChangePassword()}>
                        <Image source={save} style={styles.saveImg} />
                        <Text style={styles.backText}>{t("Save")}</Text>
                    </TouchableOpacity>
                </View>
                <Loader loading={this.state.showLoader}/>
            </SafeAreaView>
        );
    }
}

// Customizable Area Start
const styles = StyleSheet.create({
    // Customizable Area Start
    container: {
        flex: 1,
        // paddingHorizontal:hp(2),
        backgroundColor: COLORS.white,
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
        fontWeight: '600',
        textAlign: 'center',
    },
    desplayTextContain: {
        fontSize: rf(13),
        color: COLORS.grey,
        textAlign: 'center',
    },
    firstNameContain: {
        marginTop: hp(2),
    },
    errorLabel: {
        alignSelf: 'flex-end',
        marginRight: wp(8),
        color: COLORS.lightRed
    },
    lastNameContain: {
        marginTop: hp(2),
    },
    bottomConatiner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: hp(5),
        width: '100%',

    },
    backConatiner: {
        paddingHorizontal: hp(4),
        alignItems: 'center',
    },
    saveConatiner: {
        paddingHorizontal: hp(4),
        alignItems: 'center',
        justifyContent: 'center'
    },
    backText: {
        paddingTop: hp(1),
        marginLeft: hp(1),
        color: COLORS.grey,
    },
    saveImg: {
        height: hp(2.5),
        width: hp(2.5),
        tintColor: COLORS.grey
    },
    backImg: {
        height: hp(2),
        width: hp(2),
        tintColor: COLORS.grey
    }
    // Customizable Area End
});

export default withTranslation()(NewPassword);
// Customizable Area End
