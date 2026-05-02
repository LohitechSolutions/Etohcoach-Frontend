import React from 'react';
import { withTranslation } from "react-i18next";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Scale from "../../../components/src/Scale";
import Context from "../../../components/src/context/context";
import { COLORS } from "../../../framework/src/Globals";
import MocExamInitController, { Props } from "./MocExamInitController";
import styles from "./moxExamQuestionOneStyle";
import {getOfflineAction, updateOfflineData,addOfflineAPis} from "../../../mobile/src/store/actions/OfflineData"
import {connect} from "react-redux"

let answerArray = ["leaf", "grape", "flower", "Hoof", "Bud"];


class MoxExamQuestionOne extends MocExamInitController {
  static contextType = Context;

  mountSchemaSlots = () => {
    const index = this.props.questionIndex;
    const rawCorrect = this.props?.data?.attributes?.is_correct;
    let myLength = Array.isArray(rawCorrect)
      ? rawCorrect.length
      : rawCorrect !== undefined && rawCorrect !== null && rawCorrect !== ""
        ? 1
        : 0;
    if (!Number.isFinite(myLength) || myLength < 0) myLength = 0;
    this.props.SchemaBasedMountFunction(index, myLength);
  };

  async componentDidMount() {
    this.mountSchemaSlots();
  }

  componentDidUpdate(prevProps: Readonly<any>) {
    if (
      prevProps.questionIndex !== this.props.questionIndex ||
      prevProps.data?.id !== this.props.data?.id
    ) {
      this.mountSchemaSlots();
    }
  }


  renderQuestionImageIfPresent = () => {
    const offline = this.state.isoFFline === "true" || this.state.isoFFline === true;
    const uri = offline
      ? this.props.data?.attributes?.downloadedPath
      : this.props.data?.attributes?.image;
    if (uri == null || typeof uri !== "string" || uri.trim() === "") {
      return null;
    }
    return (
      <Image source={{ uri: uri.trim() }} style={styles.qeustionImage} resizeMode="cover" />
    );
  };

  renderHeader = () => {
    const { t }: any = this.props;
    return (
      <View style={{ marginTop: 0 }}>
        <Text
          style={{
            fontSize: Scale(22),
            fontWeight: "700",
            lineHeight: Scale(24),
            letterSpacing: Scale(0.4),
            color: "#373434",
            marginStart: 15,
            marginTop: 15,
          }}
        >
          {this.props?.data?.attributes?.question}
        </Text>
        {this.renderQuestionImageIfPresent()}
        {!this.props.isconfirmpressed ? (
          <Text style={styles.answerInputTxt}>{t("TypeAnswersInTheAppropriateInput")}</Text>
        ) : null}
      </View>
    );
  };

  renderQuestionListCell = (item: any, index: any) => {
    let answerArray = this.props?.data?.attributes?.is_correct
    let indexOfquestion = this?.props?.questionIndex;
    const {t}:any = this.props;
    return (
      <View style={styles.questionListView}>
        {!this.props.isconfirmpressed ? (
          <View style={[styles.questionView, { alignItems: "stretch", width: "100%", maxWidth: "100%", alignSelf: "stretch" }]}>
            <View style={{ width: "100%", paddingVertical: Scale(8) }}>
              <Text style={{ fontSize: Scale(12), color: "#777185", marginHorizontal: Scale(20), marginBottom: Scale(6) }}>
                {`№${index + 1}`}
              </Text>
              <RNTextInput
                onChangeText={(text) =>
                  this.props.functionResposibleforschema(index, text, indexOfquestion)
                }
                value={item != null ? String(item) : ""}
                editable={!this.props.isconfirmpressed}
                placeholder=""
                placeholderTextColor="#999"
                multiline={false}
                scrollEnabled={false}
                underlineColorAndroid="transparent"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="default"
                textAlignVertical={Platform.OS === "android" ? "center" : "auto"}
                style={{
                  marginHorizontal: Scale(20),
                  paddingHorizontal: Scale(12),
                  paddingVertical: Platform.OS === "ios" ? Scale(12) : Scale(10),
                  backgroundColor: "#FFFFFF",
                  borderRadius: Scale(8),
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: "#CFCFD6",
                  width: "92%",
                  alignSelf: "center",
                  minHeight: Scale(44),
                  fontSize: Scale(15),
                  color: "#373434",
                }}
              />
            </View>
          </View>
        ) : (
          <View
            style={{
              ...styles.questionView,
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: this.props.returnborderColorforschema(
                item,
                index,
                indexOfquestion,
                answerArray
              ),
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: Scale(12), color: "#777185", marginHorizontal: Scale(20), marginBottom: Scale(6) }}>
                {`№${index + 1}`}
              </Text>
              <RNTextInput
                value={item != null ? String(item) : ""}
                editable={false}
                multiline
                underlineColorAndroid="transparent"
                style={{
                  marginHorizontal: Scale(20),
                  paddingHorizontal: Scale(12),
                  paddingVertical: Scale(10),
                  backgroundColor: "#F2F2F7",
                  borderRadius: Scale(8),
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: "#CFCFD6",
                  width: "100%",
                  minHeight: Scale(44),
                  fontSize: Scale(15),
                  color: "#373434",
                }}
              />
            </View>
            {/* <Image style={styles.closeButton} source={require("../assets/close.png")} /> */}
            {/* <Image style={styles.nextButton} source={require("../assets/RightIcon.png")} /> */}
            <View style={{ marginRight: Scale(10) }}>
              {this.props.isconfirmpressed && this.props.returnborderColorforschema(
                item,
                index,
                indexOfquestion,
                answerArray
              ) == COLORS.success ? <Image
                style={{ ...styles.closeButton, tintColor: COLORS.success ,height:Scale(15),width:Scale(15)}}
                source={require("../assets/RightIcon.png")}
              /> :
                <Image
                  style={{ ...styles.closeButton, tintColor: "red",height:Scale(30),width:Scale(30)}}
                  source={require("../assets/close.png")}
                />}
            </View>
          </View>
        )}
        {this.props.isconfirmpressed ? <Text style={styles.answerTxt}>{t("CorrectAnswer")}: {answerArray[index]}</Text> : null}
      </View>
    );
  };

  renderQuestionFlatlist = () => {
    return (
      <>
        {this.props?.short_text_and_schema_answer[this?.props?.questionIndex]?.map((ele: any, index: any) => (
          <View key={`schema-slot-${this.props.questionIndex}-${index}`}>
            {this.renderQuestionListCell(ele, index)}
          </View>
        ))}
      </>
    );
  };

  renderCLoseCheckButton = () => {
    const {t}:any = this.props;
    return (
      <View style={styles.buttonMainView}>

      
        <TouchableOpacity
          style={styles.closeButtonView}
          onPress={() => this.props.navigation.goBack({ quzziesModal: true })}
        >
          <Image
            style={styles.closeButton}
            source={require("../assets/close.png")}
          />
          <Text style={styles.closetxt}>{t("Close")}</Text>
        </TouchableOpacity>
        <View />
        <TouchableOpacity
          style={styles.closeButtonView}
          onPress={() => this.props.navigation.navigate("ReArrangeOrder")}
        >
          <Image
            style={styles.checkButton}
            source={require("../assets/RightIcon.png")}
          />
          <Text style={styles.closetxt}>{t("Check")}</Text>
        </TouchableOpacity>
        {/* <View style={styles.closeButtonView}>
                    <Image style={styles.nextButton} source={require("../assets/imagenav_lesson.png")} />
                    <Text style={styles.closetxt}>Next</Text>
                </View> */}
      </View>
    );
  };

  render() {
    // console.log(this.state, "checkingggg inmmm");
    console.log(this.state.isoFFline, "checkingggg offline state data");
    return (
      <View style={{ backgroundColor: "#fff", width: "100%" }}>
        {this.renderHeader()}
        {this.renderQuestionFlatlist()}
      </View>
    );
  }
}

const mapStateToProps = (state:any) => {
  return {
      offlineState  : state.rootReducer.offlineReducer
    }
}
const mapDispatchToProps = (dispatch : any) => {
  return {
    getOfflineAction : (params:any) => {
      dispatch(getOfflineAction(params))
    }, 
    updateOfflineData : (params:any) => {
      dispatch(updateOfflineData(params))
    }
  }
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(MoxExamQuestionOne));