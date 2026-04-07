import React from 'react';
import { withTranslation } from "react-i18next";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { TextInput } from "react-native-paper";
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
  async componentDidMount() {
    let index = this?.props?.questionIndex
    let myLength = this.props?.data?.attributes?.is_correct?.length

    
    this.props.SchemaBasedMountFunction(index, myLength)

  }


  renderHeader = () => {
    const {t}:any = this.props;
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
        {this.state.isoFFline =='true'? <Image
          source={{uri : this.props.data?.attributes?.downloadedPath} }
          style={styles.qeustionImage}
        />: <Image
        source={{ uri: this.props.data?.attributes?.image }}
        style={styles.qeustionImage}
      />}
        {!this.props.isconfirmpressed ? <Text style={styles.answerInputTxt}>
          {t("TypeAnswersInTheAppropriateInput")}
        </Text> : <></>}
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
          <View style={styles.questionView}>
            <View>
              <TextInput
                onChangeText={(text) =>
                  this.props.functionResposibleforschema(index, text, indexOfquestion)
                }
                defaultValue={item}
                value={item}
                label={`№${index + 1}`}
                activeUnderlineColor="none"
                underlineColor="none"
                mode={"flat"}
                style={{
                  marginHorizontal: 20,

                  backgroundColor: 'none',
                  width: Scale(250),

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
            <View >
              {/* <Text style={styles.countUser}>{item?.quetionNo}</Text> */}
              <TextInput
                onChangeText={(text) =>
                  this.props.functionResposibleforschema(index, text, indexOfquestion)
                }
                key={this.state.componentRerenderkey}
                defaultValue={item}
                label={`№${index + 1}`}
                activeUnderlineColor="none"
                underlineColor="none"
                mode={"flat"}
                style={{
                  marginHorizontal: 20,
                  backgroundColor: "none",
                  width: "100%",
                }}
                disabled={true}
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
        {this.props?.short_text_and_schema_answer[this?.props?.questionIndex]?.map((ele: any, index: any) => <View >
          {this.renderQuestionListCell(ele, index)}
        </View>)}
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
      <SafeAreaView style={styles.mainContainer}>
     
        {this.renderHeader()}
        {this.renderQuestionFlatlist()}
        {/* {this.renderCLoseCheckButton()} */}
  
      </SafeAreaView>
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