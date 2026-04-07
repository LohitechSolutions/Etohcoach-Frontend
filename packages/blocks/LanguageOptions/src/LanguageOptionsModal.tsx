//------- Import Statement -------//
import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Modal,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue as rf } from "react-native-responsive-fontsize";
import { FONTS } from "../../../framework/src/Fonts";
import { COLORS } from "../../../framework/src/Globals";
import { LanguageIcon, RadioBtn_off, RadioBtn_on ,Rectangle} from "./assets";
import Loader from "../../../components/src/Loader";
import Context from "../../../components/src/context/context";
import { langaugeFunction } from "./component/i18n/i18n.config";
import ButttonComponent from "../../../mobile/src/component/ButtonComponent";
import { withTranslation } from "react-i18next";
//------- Constant Statement -------//
import LanguageOptionsModalController, {
  Props,
  configJSON,
} from "./LanguageOptionsModalController";

//------- Class Declaration -------//
class LanguageOptionModal extends LanguageOptionsModalController {
  //------- Class Constructor -------//
  constructor(props: any) {
    super(props);
    //------- States -------//
  }

  static contextType = Context;
  //------- Render -------//
  render() {
    const { t, i18n }: any = this.props;
    const {
      language,
      setLanguage,
      setLanguageToAsyncStorage,
      displayLanguage,
    } = this.context;
    console.log("Modal starts");
    return (
      <Modal
        animationType={"fade"}
        transparent={true}
        visible={this.props.visible}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <TouchableOpacity
            style={styles.modalConatiner}
            onPress={() => {
              this.props.closeModal();
              this.loadDisplayLanguage();
            }}
          />
          <View style={styles.innerModalConatin}>
          <Image
              source={Rectangle}
              style={styles.rectangleIcon}
        /> 
            <View style={styles.imgView}>
              <Image source={LanguageIcon} style={styles.mainImg} />
              <Text style={styles.imgName}>{t("Language")}</Text>
              <Text style={styles.desc}>{t("SelectLanguage")}</Text>
            </View>
            <View style={{ marginTop: hp(2) }}>
              {this.state.totalLanguages?.map((item: any, index: number) => {
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
              <ButttonComponent
                BtnText={t("CONTINUE")}
                onpress={() => {
                  this.setLoader(true);
                  setLanguageToAsyncStorage(language);
                  this.getLanguageresultsModal();
                  console.log(language, "languagefromModal");
                  if (language == "English") {
                    console.log("English Language");
                    this.props.languageState("English ");
                    i18n.changeLanguage("en");
                  } else if (language == "Français") {
                    console.log("Français Language");
                    this.props.languageState("Français ");
                    i18n.changeLanguage("fr");
                  }
                  
                  displayLanguage();
                  this.props.closeModal();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalConatiner: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  innerModalConatin: {
    position: "absolute",
    bottom: 0,
    paddingHorizontal: hp(1),
    height: hp(62),
    width: "100%",
    borderTopLeftRadius: hp(1.5),
    borderTopRightRadius: hp(1.5),
    backgroundColor: COLORS.white,
    paddingTop: hp(3),
    paddingBottom: hp(4),
  },
  buttonlanguage: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  mainImg: {
    height: hp(12),
    width: hp(12),
    tintColor: COLORS.lightRed,
  },
  imgView: {
    alignItems: "center",
    marginTop: hp(3),
  },
  imgName: {
    fontSize: rf(25),
    marginTop: hp(2.3),
    fontFamily: FONTS.Explet_Bold,
    lineHeight:hp(5)
  },
  desc: {
    marginTop: hp(1),
    fontSize: rf(15),
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
    height: hp(2),
    width: hp(2),
    marginLeft: wp(0.5),
  },
  languageBtn: {
    flexDirection: "row",
    marginTop: hp(2),
    alignItems: "center",
  },
  btnSelectImg: {
    height: hp(4),
    width: hp(4),
    marginLeft: wp(5),
  },
  languageName: {
    marginLeft: wp(2),
    fontSize: rf(15),
    fontFamily: FONTS.Roboto_Regular,
    alignSelf: 'center'
  },
  bottemView: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    width: "84%",
    marginBottom: hp(5),
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: wp(8),
    alignSelf: "center",
  },
  rectangleIcon:{
    position: "absolute",
    top: 12,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: wp(14),
    height: wp(1),
    color: "black"
  }
});

export default withTranslation()(LanguageOptionModal);