// Customizable Area Start
import React from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Button
} from "react-native";
import styles from "./MocExamInitStyle";
import MocExamInitController from "./MocExamInitController";
import Scale from "../../../components/src/Scale";
import Context from "../../../components/src/context/context";
import MoxExamQuestionOne from "./moxExamQuestionOne";
import RevealAnswer from "./RevealAnswer";
import { RadioButton } from "react-native-paper";
import AssessmentTest from "../../AssessmentTest/src/AssessmentTest";
import ReArrangeOrder from "./ReArrangeOrder";
import { Input } from "react-native-elements";
import { DraggableGrid } from "react-native-draggable-grid";
import { FONTS } from "../../../framework/src/Fonts";
import { DraxProvider, DraxView } from "react-native-drax";
import PairquestionScreen from "./PairquestionScreen";
import { COLORS } from "../../../framework/src/Globals";
import Icon from "react-native-vector-icons/FontAwesome";
import { withTranslation } from "react-i18next";
import ResultModal from "./ResultModal";
import { useScrollToTop } from '@react-navigation/native';
import {getOfflineAction, updateOfflineData,addOfflineAPis} from "../../../mobile/src/store/actions/OfflineData"
import {connect} from "react-redux"

class MocExamInit extends MocExamInitController {
 
  static contextType = Context;
  renderHeader = () => {
    const { t }: any = this.props;
    return (
      <View style={styles.mainView}>
        <View style={{ flexDirection: "column" }}>
          {this.renderHeadercondition()}
          <Text
            style={{
              fontSize: Scale(32),
              fontWeight: "700",
              lineHeight: Scale(37),
              letterSpacing: Scale(0.4),
              color: "#373434",
            }}>
            {!this.state.isConfirmButtonPressed ? `${this.state.mockexamName}` :  t("Results")}
          </Text>
          {!this.state.isConfirmButtonPressed ? <Text
            style={{
              fontSize: Scale(16),
              fontWeight: "400",
              lineHeight: Scale(18),
              color: "#777185",
              marginTop: Scale(5),
            }}
          >
            { t("AnswerAllTheQuestion")}
          </Text> : <Text
            style={{
              fontSize: Scale(16),
              fontWeight: "400",
              lineHeight: Scale(18),
              color: "#777185",
              marginTop: Scale(5),
            }}
          >
            { t("ReviewYourAnswers")}
          </Text>}
        </View>
        {this.renderGreyLine()}
        {this.state.isConfirmButtonPressed ?this.ProgressBarHorizontal():<View/>}
      </View>
    );
  };

  renderGreyLine = () => {
    return (
      <View style={{ width: '90%', height: 1, backgroundColor: COLORS.greyLine, alignSelf: 'center', marginTop: 20 }} />
    )
  }

 ProgressBarHorizontal=()=>{
  const { t }: any = this.props;
return (
<>

<View style={{height:Scale(100),backgroundColor:'white',borderRadius:Scale(10),shadowColor:COLORS.grey,shadowOffset:{width:Scale(0),height:Scale(0)},shadowOpacity:0.2}}>
<View style={{flexDirection:"row",width:'60%',justifyContent:'space-between',alignSelf:'center',marginTop:Scale(10),alignItems:'center'}}>

<View>
<Text style={{...stylesForAnswers.ProgressBarHorizontalpointsText,color:COLORS.success}}>
{this.state.writeAnswerCount}
</Text>
<Text style={{...stylesForAnswers.ProgressBarHorizontalpointspoint}}>
  { t("CORRECT")}
</Text>
</View>
<View  style={{height:Scale(2),width:Scale(2),backgroundColor:'grey'}}/>
<View>
<Text style={{...stylesForAnswers.ProgressBarHorizontalpointsText,color:COLORS.lightRed}}>
{this.state.WrongAnsercount}
</Text>
<Text style={{...stylesForAnswers.ProgressBarHorizontalpointspoint}}>
  { t("INCORRECT")}
</Text>
</View>

</View>

<View style={{flexDirection:'row',width:'80%',alignSelf:'center',marginTop:Scale(20)}}>

<View style={{width:`${this.state.Progresspercentage}%`,backgroundColor:COLORS.success,height:Scale(5)}}>

</View>
<View style={{width:`${100-this.state.Progresspercentage}%`,backgroundColor:COLORS.lightRed,height:Scale(5),marginBottom:Scale(10)} } />
</View>
</View>
</>
)
 }


  renderHeadercondition = () => {
    if (this.state.isConfirmButtonPressed) {
      return (
        <View style={{ flexDirection: "row" }}>
          <Text style={{ ...stylesForAnswers.headerStyle }}>
            {this.state.courseName.trim()}
          </Text>

          <View style={{ display: "flex", flexDirection: 'row', alignItems: 'center', marginLeft: Scale(5) }}>

            <View style={{ height: Scale(3), width: Scale(3), backgroundColor: COLORS.grey, marginRight: Scale(5) }}>

            </View>
            <Text style={{ ...stylesForAnswers.headerStyle }}>
              {this.state.mockexamName}
            </Text>
          </View>
        </View>
      )
    }
    else {
      return (
        <View>
          <Text style={stylesForAnswers.headerStyle}>
            {this.state.courseName}
          </Text>
        </View>
      )
    }

  }

  renderCourseThemeItemListCell = (data: any, index: any) => {
    const { t }: any = this.props;
    let extractOptions = (data: any) => {
      let obj = data.attributes;
      let optionsarray = [];
      for (let key in obj) {
        if (key.includes("option_")) {
          optionsarray.push({ name: obj[key], key: obj[key] });
        }
      }
      return optionsarray;
    };

    let myarray = extractOptions(data, index);
    this.setState({
      pair_answer: { ...this.state.pair_answer, [index]: myarray },
    });

    console.log("data is the new data", myarray);

    return (
      <View>
        <View style={styles.mainView}>
          <View style={styles.headerView}>
            <Text
              style={{
                fontSize: Scale(12),
                lineHeight: Scale(14),
                fontWeight: "500",
                color: "#777185",
              }}
            >
              How the wine is done.
            </Text>
            <View style={styles.userCountView}>
              <Text
                style={{
                  fontSize: Scale(16),
                  fontWeight: "800",
                  lineHeight: Scale(16),
                  color: COLORS.lightRed,
                }}
              >
                {"ite not here"}
              </Text>

            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: "5%",
          }}
        >
          <View style={{ width: "40%" }}>
            {myarray.map((e, myinde) => (
              <View style={{ height: 70 }}>
                <Text style={{ fontSize: 16, marginTop: 10 }}>
                  Word {myinde}
                </Text>
              </View>
            ))}
          </View>
          <DraggableGrid
            style={{ width: "40%" }}
            itemHeight={70}
            numColumns={1}
            renderItem={(item: { name: string; key: string }) => {
              return (
                <View style={{ height: 40 }} key={item.key}>
                  <Text style={{ fontSize: 16 }}>{item.name}</Text>
                </View>
              );
            }}
            data={myarray}
            onDragRelease={(data) => {
              console.log("here in drag", data);

            }}
          />
        </View>
      </View>
    );
  };

  renderCLoseCheckButton = () => {
    const { t }: any = this.props;
    return (
      <View style={{ justifyContent: "flex-end", bottom: Scale(0) }}>
        <View style={styles.buttonMainView}>
          <TouchableOpacity
            style={styles.closeButtonView}
            onPress={() => this.props.navigation.goBack()}
          >
            <Image
              style={styles.closeButton}
              source={require("../assets/close.png")}
            />
            <Text style={styles.closetxt}>{ t("Close")}</Text>
          </TouchableOpacity>
          <View />
          {this.state.shouldComfirmationButtonBeVisible ? <TouchableOpacity
            onPress={() => {
              !this.state.isConfirmButtonPressed ? this.theFunctionResponsibleFormakingConfirmationbuttonTrue() : this.restartButtonPressFunction()
            }}
            style={styles.closeButtonView}
          >
            {!this.state.isConfirmButtonPressed ? (
              <Image
                style={stylesForAnswers.styleforRestartbutton}
                source={require("../assets/RightIcon.png")}
              />
            ) : (
              <Image
                style={{...stylesForAnswers.styleforRestartbutton}}
                source={require("../assets/restartIcon.png")}
              />
            )}
            <Text style={{ ...styles.closetxt, marginTop: Scale(7) }}>
              {this.state.isConfirmButtonPressed ?  t("Restart") : t("Confirm")}
            </Text>
          </TouchableOpacity> : <View></View>}
        </View>
      </View>
    );
  };

  customRadioButtonComponent = (data: any, questionIndex: any) => {
    function extractOptions() {
      let obj = data.attributes;
      let optionsarray = [];
      for (let key in obj) {
        if (key.includes("option_")) {
          optionsarray.push(obj[key]);
        }
      }
      optionsarray = optionsarray.filter((ele) => {
        return ele !== ""
      })

      return optionsarray;
    }

    console.log("i am checking optionsloop", extractOptions());

    const { t }: any = this.props;
    return (
      <View style={{ paddingStart: Scale(15), marginTop: Scale(30) }}>
        <Text
          style={{
            fontSize: Scale(22),
            fontWeight: "700",
            lineHeight: Scale(24),
            letterSpacing: Scale(0.4),
            color: "#373434",
          }}
        >
          {data.attributes.question}
        </Text>
        {!this.state.isConfirmButtonPressed ? <Text
          style={{
            marginTop: Scale(5),
            color: "#777185",
            fontSize: Scale(16),
            lineHeight: Scale(19),
            fontWeight: "400",
          }}
        >
          { t("SelectTheCorrectAnswer")}
        </Text> : null}
        <View style={{ marginTop: Scale(10) }}>
          {extractOptions().map((ele: any, index: any) =>
            !this.state.isConfirmButtonPressed ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                     width:'100%',
                  paddingLeft: Scale(15),
                }}
              >
                <RadioButton.Android
                  value="first"
                  status={
                    this.state?.radio_button_answer?.[questionIndex]?.answer ===
                      ele
                      ? "checked"
                      : "unchecked"
                  }
                  color={this.state?.radio_button_answer?.[questionIndex]?.answer ===ele?"#485579":"grey"}
                  onPress={() => {
                    this.functionResponsibleForHandlingRadiobuttonQuestion(
                      ele,
                      questionIndex
                    );
                  }}
                />
                <Text
                  style={{
                    fontSize: Scale(14),
                    fontWeight: "500",
                    lineHeight: Scale(17),
                    marginLeft: Scale(10),
                    width:'85%'
                  }}
                >
                  {ele}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: Scale(80),
                  paddingLeft: Scale(15),
                }}
              >
                {this.answerComponentForRadioQuestion(
                  ele,
                  index,
                  questionIndex
                )}
              </View>
            )
          )}
        </View>
        {this.renderGreyLine()}
      </View>
    );
  };

  answerComponentForRadioQuestion = (
    ele: any,
    index: any,
    questionIndex: any
  ) => {
    console.log(
      ele,
      this.state.mockexamdata[questionIndex]?.attributes?.is_correct[0],
      this.state.radio_button_answer?.[questionIndex]?.answer,
      this.state.mockexamdata[questionIndex]?.attributes?.is_correct.includes(
        ele
      ),
      "checking in radio button"
    );

    // if (!this.state.radio_button_answer?.[questionIndex]?.answer) {
    //   if (
    //     this.state.mockexamdata[questionIndex]?.attributes?.is_correct.trim().includes(
    //       ele
    //     )
    //   ) {
    //     return (
    //       <View style={stylesForAnswers.multiplechoiceView}>
    //         <Image
    //           style={{ ...styles.checkButton, tintColor: "grey" }}
    //           source={require("../assets/RightIcon.png")}
    //         />
    //         <Text style={{ ...stylesForAnswers.rightMultipleChoice }}>
    //           {ele}
    //         </Text>
    //       </View>
    //     );
    //   }

    //   return (
    //     <View style={{...stylesForAnswers.styleforWrongAnswerinbox,marginLeft:Scale(-10),marginRight:Scale(20),backgroundColor:'red'}}>
    //       <Image
    //         style={{ ...styles.closeButton, tintColor: "grey", height: Scale(30) }}
    //         source={require("../assets/close.png")}
    //       />
    //       <Text
    //         style={{ ...stylesForAnswers.rightMultipleChoice, color: "red" }}
    //       >
    //         {ele}
    //       </Text>
    //     </View>
    //   );
    // }

    if (

      ele == this.state.radio_button_answer?.[questionIndex]?.answer &&
      this.state.radio_button_answer?.[questionIndex]?.answer ==
      this.state.mockexamdata[questionIndex]?.attributes?.is_correct[0].trim()
    ) {
      console.log("how am I here");
      return (
        <View style={stylesForAnswers.multiplechoiceView}>
          <View style={{width:Scale(23),height:Scale(23),backgroundColor:COLORS.success,borderRadius:Scale(23),alignItems:'center',justifyContent:'center' }}>
          <Image
            style={{ ...styles.checkButton, tintColor: COLORS.white }}
            source={require("../assets/RightIcon.png")}
          />
          </View>
          <Text
            style={{ ...stylesForAnswers.rightMultipleChoice, color: COLORS.success ,width:Scale(280)}}
          >
            {ele}
          </Text>
        </View>
      );
    } else if (
      ele == this.state.radio_button_answer?.[questionIndex]?.answer &&
      this.state.radio_button_answer?.[questionIndex]?.answer !==
      this.state.mockexamdata[questionIndex]?.attributes?.is_correct[0].trim()
    ) {
      return (
        <View style={stylesForAnswers.styleforWrongAnswerinbox}>
          <View style={{width:Scale(21),height:Scale(21),backgroundColor:"red",justifyContent:'center',alignItems:'center',borderRadius:Scale(13),marginLeft: Scale(10)}}>
         
          <Image
            style={{ ...styles.closeButton, tintColor: "white", height: Scale(30) }}
            source={require("../assets/close.png")}
          />
          </View>
          <Text
            style={{ ...stylesForAnswers.rightMultipleChoice, color: "red",width:Scale(280)}}
          >
            {ele}
          </Text>
        </View>
      );
    } else if (
      ele != this.state.radio_button_answer?.[questionIndex]?.answer &&
      ele == this.state.mockexamdata[questionIndex]?.attributes?.is_correct[0].trim()
    ) {
      return (
        <View style={{...stylesForAnswers.multiplechoiceView,marginLeft:Scale(-6)}}>
         <Image
            style={{ ...styles.closeButton, tintColor: "grey", height: Scale(25) }}
            source={require("../assets/radioGrey.png")}
          />
          <Text style={{ ...stylesForAnswers.rightMultipleChoice,color:COLORS.success,marginLeft:Scale(5),width:Scale(280)}}>{ele}</Text>
        </View>
      );
    } else {
      return (
        <View style={{...stylesForAnswers.styleforWrongAnswerinbox}}>
          <Image
            style={{ ...styles.closeButton, tintColor: "grey", height: Scale(25),marginLeft:Scale(2),marginRight:Scale(4) }}
            source={require("../assets/radioGrey.png")}
          />
          <Text
            style={{ ...stylesForAnswers.rightMultipleChoice, color: "grey", marginLeft: Scale(0),width:Scale(280) }}
          >
            {ele}
          </Text>
        </View>
      );
    }
  };

  customNameTheImageComponent = () => {
    const { t }: any = this.props;
    return (
      <>
        <View>
          <View style={{ marginTop: Scale(10) }}>
            <Text style={styles.sampleTxt}>{"Sample Question"}</Text>
            <Text style={styles.imageTxt}>
              {"What are the names of the image?"}
            </Text>
            <TouchableOpacity>
              <Image
                source={{
                  uri:
                    "https://upload.wikimedia.org/wikipedia/commons/b/bb/Table_grapes_on_white.jpg",
                }}
                style={styles.qeustionImage}
              />
            </TouchableOpacity>
            <Text style={styles.answerInputTxt}>
              {"type answers in the apropriate input"}
            </Text>
          </View>
        </View>
        <View>
          <View style={styles.questionListView}>
            <View style={styles.questionView}>
              <View>
                <Text style={styles.countUser}>{1}</Text>
                <Text>{"what is the name of the image ?"}</Text>
              </View>
              <View style={styles.choiceCorrect}>
                <Image
                  style={styles.closeButton}
                  source={require("../assets/close.png")}
                />
                <Image
                  style={styles.nextButton}
                  source={require("../assets/RightIcon.png")}
                />
              </View>
            </View>
            <Text style={styles.answerTxt}>
              {t("CorrectAnswer")}:{"coreect anser is"}
            </Text>
            <View style={styles.questionView}>
              <View>
                <TextInput style={{ maxWidth: Scale(200) }}>
                  <Text style={styles.countUser}>{2}</Text>
                  <Text>{"Question text is aked"}</Text>
                </TextInput>
              </View>
            </View>
          </View>
        </View>
      </>
    );
  };

  customBoxbuttonComponent = (data: any, questionIndex: any) => {
    console.log(data.attributes, "i am here in mockkkk");

    function extractOptions() {
      let obj = data.attributes;
      let optionsarray = [];
      for (let key in obj) {
        if (key.includes("option_")) {
          optionsarray.push(obj[key]);
        }
      }

      optionsarray = optionsarray.filter((ele) => {
        return ele !== ""
      })

      return optionsarray;
    }

    const { t }: any = this.props;
    return (
      <View style={{ paddingStart: Scale(15) }}>
        <Text
          style={{
            fontSize: Scale(22),
            fontWeight: "700",
            lineHeight: Scale(24),
            letterSpacing: Scale(0.4),
            color: "#373434",
            marginTop: Scale(20),
          }}
        >
          {data.attributes.question}
        </Text>
        {!this.state.isConfirmButtonPressed ? <Text
          style={{
            marginTop: Scale(5),
            color: "#777185",
            fontSize: Scale(16),
            lineHeight: Scale(19),
            fontWeight: "400",
          }}
        >
          Select one or more answers.
        </Text> : null}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "50%",
            justifyContent: "space-between",
            marginTop: Scale(5),
          }}
        >
          <View style={{ flexDirection: "column", marginStart: Scale(15) }}>
            {this.MultiplechoiceCheckboxflatlist(
              extractOptions(),
              questionIndex
            )}
          </View>
        </View>
        {this.renderGreyLine()}
      </View>
    );
  };

  MultiplechoiceCheckboxflatlist = (item: any, questionIndex: any) => {
    console.log("my tem ------", item, questionIndex);
    return item.map((ele: any, index: any) =>
      !this.state.isConfirmButtonPressed ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            marginTop: Scale(15),
          }}
        >
          {this.state?.multiple_choice_answer?.[questionIndex]?.[ele] ? (
            <TouchableOpacity
              onPress={() => {
                this.functionResponsibleForHandlingMutiplechoiceBoxQuestion(
                  ele,
                  questionIndex
                );
              }}
            >
              <Image
                style={{ width: Scale(20), height: Scale(20) }}
                source={require("../assets/Component.png")}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                this.functionResponsibleForHandlingMutiplechoiceBoxQuestion(
                  ele,
                  questionIndex
                );
              }}
            >
              <Image
                style={{ width: Scale(20), height: Scale(20) }}
                source={require("../assets/unCheck.png")}
              />
            </TouchableOpacity>
          )}

          <View>
            <Text
              style={{
                fontSize: Scale(14),
                fontWeight: "500",
                lineHeight: Scale(17),
                marginLeft: Scale(10),
              }}
            >
              {ele}
            </Text>
          </View>
        </View>
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            marginTop: Scale(15),
          }}
        >
          {this.renderRightorwrongFormultipleChoice(ele, index, questionIndex)}
        </View>
      )
    );
  };

  renderRightorwrongFormultipleChoice(
    ele: any,
    index: any,
    questionIndex: any
  ) {
    if (!this.state.multiple_choice_answer?.[questionIndex]?.[ele]) {
      if (
        this.state.mockexamdata[questionIndex]?.attributes?.is_correct.includes(
          ele
        )
      ) {
        return (
          <View style={stylesForAnswers.multiplechoiceView}>
            <Image
              style={{ width: Scale(20), height: Scale(20) ,tintColor:'none'}}
              source={require("../assets/unCheck.png")}
            />
            <Text style={{ ...stylesForAnswers.rightMultipleChoice,color:COLORS.success,width:Scale(280) }}>
              {ele}
            </Text>
          </View>
        );
      }

      return (
        <View style={{ ...stylesForAnswers.styleforWrongAnswerinbox }}>
          <Image
            style={{ ...styles.closeButton, tintColor: "none", height: Scale(20) }}
            source={require("../assets/greysquare.png")}
          />
          <Text style={{ ...stylesForAnswers.rightMultipleChoice, marginLeft: Scale(0) ,width:Scale(280)}}>{ele}</Text>
        </View>
      );
    }

    if (
      this.state.mockexamdata[questionIndex]?.attributes?.is_correct.includes(
        this.state.multiple_choice_answer?.[questionIndex]?.[ele]
      )
    ) {
      return (
        <View style={stylesForAnswers.multiplechoiceView}>
     <View style={{height:Scale(20),width:Scale(20),backgroundColor:COLORS.success,borderRadius:Scale(5),justifyContent:'center',alignItems:'center',marginLeft:Scale(-2)}}>

          <Image
            style={{ ...styles.checkButton, tintColor: 'white',height:Scale(20),width:Scale(13) }}
            source={require("../assets/RightIcon.png")}
          />
          </View>
          <Text
            style={{ ...stylesForAnswers.rightMultipleChoice, color: COLORS.success,width:Scale(280) }}
          >
            {ele}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={{ ...stylesForAnswers.styleforWrongAnswerinbox,marginLeft:Scale(-2) }}>
          <View style={{height:Scale(20),width:Scale(20),backgroundColor:COLORS.red,borderRadius:Scale(5),justifyContent:'center',alignItems:'center'}}>
          <Image
            style={{ ...styles.closeButton, tintColor:COLORS.white, height: Scale(28) }}
            source={require("../assets/close.png")}
          />
          </View>
          <Text
            style={{ ...stylesForAnswers.rightMultipleChoice, color: "red", marginLeft: Scale(7),width:Scale(280) }}
          >
            {ele}
          </Text>
        </View>
      );
    }


  }

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : undefined} style={styles.mainContainer}>

          <ScrollView key={this.state.componentRerenderkey} ref={(ref) => { this.scrollViewRef = ref; }} style={{ flex: 1 }}>

            {this.renderHeader()}

            {/* {   this.customBoxbuttonComponent()} */}
            {this.state?.mockexamdata?.map((ele: any, questionIndex: any) =>
              ele?.attributes?.question_type == "multiple_choice" ? (
                this.customBoxbuttonComponent(ele, questionIndex)
              ) : ele?.attributes?.question_type == "radio_button" ? (
                this.customRadioButtonComponent(ele, questionIndex)
              ) : ele?.attributes?.question_type == "rearrange_order" ? (
                <>
                  <ReArrangeOrder
                    data={ele}
                    key={this.state.componentRerenderkey}
                    questionIndex={questionIndex}
                    confimationPress={this.state.isConfirmButtonPressed}
                    functionResponsibleForRearrange={this.functionResponsibleForRearrange}
                    optionsArrrayForreArrange={this.optionsArrrayForreArrange}
                    rearrange_order_answer={this.state.rearrange_order_answer}
                    isItformockexam={this.props?.navigation?.state?.params.isItFromMockExamMOdal}
                  />
                  {this.renderGreyLine()}
                </>
              ) : ele?.attributes?.question_type == "pair" ? (
                <>
                  <PairquestionScreen
                    data={ele}
                    key={this.state.componentRerenderkey}
                    questionIndex={questionIndex}
                    isItformockexam={this.props?.navigation?.state?.params.isItFromMockExamMOdal}
                    pairExamdidmountfunction={this.pairExamdidmountfunction}
                    rearrangeextarctedData={this.state.rearrangeextarctedData}
                    functionResponsibleForAddingClipboardDataToSlots={
                      this.functionResponsibleForAddingClipboardDataToSlots
                    }
                    copyTotrialcopyBoard={this.copyTotrialcopyBoard}
                    mystate={this.state}
                    returnBackgroundColorPair={this.returnBackgroundColorPair}
                    pairBackgroundColor={this.state.pairBackgroundColor}
                  />
                  {this.renderGreyLine()}
                 
                </>
              ) : ele?.attributes?.question_type == "short_text_and_schema" ? (
                <>
                  <MoxExamQuestionOne
                    data={ele}
                    isItformockexam={this.props?.navigation?.state?.params.isItFromMockExamMOdal}
                    key={this.state.componentRerenderkey}
                    questionIndex={questionIndex}
                    isconfirmpressed={this.state.isConfirmButtonPressed}
                    functionResposibleforschema={this.functionResposibleforschema}
                    short_text_and_schema_answer={this.state?.short_text_and_schema_answer}
                    SchemaBasedMountFunction={this.SchemaBasedMountFunction}
                    returnborderColorforschema={this.returnborderColorforschema}
                  />
                  {this.renderGreyLine()}
                </>
              ) : null
            )}

          </ScrollView>
        </KeyboardAvoidingView>
        <ResultModal myState={this.state} CloseModal={this.functionForClosingResultModal} isItformmockexam={true} reviewmockFunction={this.functionWhenclickedonReviewMockexam} letsGoback={this.functionForgoingBack}  />
        {this.renderCLoseCheckButton()}
      </SafeAreaView>
    );
  }
}

let stylesForAnswers = StyleSheet.create({
  rightMultipleChoice: {
    fontSize: Scale(14),
    fontWeight: "500",
    lineHeight: Scale(17),
    marginLeft: Scale(10),
  },
  multiplechoiceView: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: Scale(15),
  },
  headerStyle: {
    fontFamily: FONTS.Roboto_Light,
    color: "#373434",
    fontSize: Scale(10)
  },
  styleforWrongAnswerinbox: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: Scale(15),
    marginRight: Scale(60),
    marginLeft: Scale(-10)
  }
  ,
  styleforRestartbutton: {
    height: Scale(17),
    width: Scale(17),
     tintColor: 'grey',
      marginTop: Scale(9)
  },
  ProgressBarHorizontalpointsText: {
fontFamily:FONTS.Roboto_Regular,
fontWeight:'900',
fontSize:Scale(28),
textAlign:'center'
  },
  ProgressBarHorizontalpointspoint:  {
      fontFamily:FONTS.Roboto_Regular,color:COLORS.grey,
      fontSize:Scale(12),
      fontWeight:'700'

  }

});

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
    },
    addOfflineAPis : (params:any)=>{
      dispatch(addOfflineAPis(params))
    }
  }
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(MocExamInit));
 // Customizable Area End
