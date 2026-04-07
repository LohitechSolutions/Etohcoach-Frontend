import React from "react";
import { StyleSheet, Text, Image, TouchableOpacity, View } from "react-native";
import { RFPercentage as rf } from "react-native-responsive-fontsize";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
// Customizable Area Start
import { FONTS } from "../../../framework/src/Fonts";
import { COLORS } from "../../../framework/src/Globals";
import { BackBtn } from "../../user-profile-basic/src/assets";
import { LanguageIcon, RadioBtn_off, RadioBtn_on, Save } from "./assets";
import Loader from "../../../components/src/Loader";
import Context from "../../../components/src/context/context";
import { withTranslation } from "react-i18next";
import { langaugeFunction } from "./component/i18n/i18n.config";
import i18next from "i18next";


const LunguageArray = [{ name: 'English ' }, { name: 'Francais ' }]
// Customizable Area End

import LanguageOptionsController, {
  Props,
  configJSON,
} from "./LanguageOptionsController";

class LanguageOptions extends LanguageOptionsController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    this.state = {
      currentLanguage: "English",
    };
    // Customizable Area End
  }
  // Customizable Area Start
  changeLanguage = (language: string) => {
    this.setState({ currentLanguage: language });
  };
  static contextType = Context;
  // Customizable Area End
  render() {
    const { t }: any = this.props;
    const { language, setLanguage, setLanguageToAsyncStorage } = this.context;
    return (
      // Customizable Area Start
      <View style={styles.container}>
        <View style={styles.imgView}>
          <Image source={LanguageIcon} style={styles.mainImg} />
          <Text style={styles.imgName}>{t("Language")}</Text>
          <Text style={styles.desc}>{t("SelectLanguage")}</Text>
        </View>
        <View style={{ marginTop: hp(2) }}>
          {this.state.totalLanguages
            ?.map((item: any, index: number) => {
                return (
                  <View style={styles.languageBtn}>
                    <TouchableOpacity
                    style={styles.buttonlanguage}
                      onPress={() => {
                        setLanguage(item.language);
                        this.setLanguageSelect(index);
                      }}
                    >
                      <Image
                        source={
                          this.state.languageSelect === index
                            ? RadioBtn_on
                            : RadioBtn_off
                        }
                        style={[
                          styles.btnSelectImg,
                          {
                            tintColor:
                              this.state.languageSelect === index
                                ? COLORS.success
                                : COLORS.grey,
                          },
                        ]}
                      />
                    <Text style={styles.languageName}>{item?.language}</Text>
                    <View style={styles.imagecontainer}>
                      <Image
                        source={{ uri: item.flag }}
                        style={styles.flagImg}
                        />
                    </View>
                  </TouchableOpacity>
                  </View>
                );
              })}
        </View>
        <View style={styles.bottemView}>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={{ alignItems: "center" }}
          >
            <Image source={BackBtn} style={styles.backBtnImg} />
            <Text style={styles.backText}>{t("Back")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => {
              if(this.state.isItOffline){
                this.props.navigation.navigate('NoInternet',{showHeader:true,from:'language'})
              }else{
              this.setLoader(true);
              setLanguageToAsyncStorage(language);
              this.getLanguageresults();
              if (language == "English") {
                console.log("English Language");
                i18next.changeLanguage("en");
              } else if(language == "Français"){
                console.log("Francais Language");
                i18next.changeLanguage("fr");
              }
              langaugeFunction();
            }
            }}
          >
            <Image source={Save} style={styles.saveBtnImg} />
            <Text style={styles.saveText}>{t("Save")}</Text>
          </TouchableOpacity>
        </View>
        <Loader loading={this.state.showLoader} />
      </View>
      // Customizable Area End
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  mainImg: {
    height: hp(12),
    width: hp(12),
    tintColor: COLORS.lightRed,
  },
  imgView: {
    alignItems: "center",
    marginTop: hp(8),
  },
  imgName: {
    fontSize: rf(3.3),
    marginTop: hp(2.3),
    fontFamily: FONTS.Explet_Bold,
    lineHeight:hp(3.5)
  },
  desc: {
    marginTop: hp(1),
    fontSize: rf(2.1),
    color: COLORS.grey,
    alignSelf: "center",
    textAlign: "center",
    fontFamily: FONTS.Roboto_Regular,
    width: hp(28),
  },
  imagecontainer: {
    marginLeft: wp(1),
    alignSelf: 'center'
  },
  flagImg: {
    height: hp(3),
    width: hp(3),
    marginLeft: wp(0.5),
  },
  languageBtn: {
    flexDirection: "row",
    marginTop: hp(2),
    alignItems: "center",
  },
  buttonlanguage: {
    flexDirection: 'row'
  },
  btnSelectImg: {
    height: hp(4),
    width: hp(4),
    marginLeft: wp(5),
  },
  languageName: {
    marginLeft: wp(2),
    fontSize: rf(2.4),
    fontFamily: FONTS.Roboto_Regular,
    alignSelf: 'center'
  },
  backBtnImg: {
    marginBottom: hp(0.7),
    height: hp(2.5),
    width: hp(2.5),
    tintColor: COLORS.grey,
  },
  backText: {
    color: COLORS.grey,
    fontFamily: FONTS.Roboto_Regular,
    fontSize: rf(1.9),
  },
  saveText: {
    color: COLORS.grey,
    fontFamily: FONTS.Roboto_Regular,
    fontSize: rf(1.9),
  },
  saveBtnImg: {
    marginBottom: hp(0.7),
    height: hp(2.5),
    width: hp(2.5),
    tintColor: COLORS.grey,
  },
  bottemView: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    width: "84%",
    marginBottom: hp(3),
    justifyContent: "space-between",
    marginHorizontal: wp(8),
    alignSelf: "center",
  },
});

export default withTranslation()(LanguageOptions);
// Customizable Area End