// Customizable Area Start 
import React from "react";
import { SafeAreaView, TouchableOpacity, View, Image, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import MocExamInitController from "./MocExamInitController";
import styles from "./MocExamInitStyle";
import Scale from "../../../components/src/Scale";
import ReArrangeOrder from "./ReArrangeOrder";
import MoxExamQuestionOne from "./moxExamQuestionOne";
import PairquestionScreen from "./PairquestionScreen";
import { RadioButton } from "react-native-paper";
import { withTranslation } from "react-i18next";
import ResultModal from "./ResultModal";
import { COLORS } from "../../../framework/src/Globals";
import { FONTS } from "../../../framework/src/Fonts";
import CircularProgresss from "../../../components/src/Circularprogress";
import Context from "../../../components/src/context/context";
import i18next from "i18next";
import {getOfflineAction, updateOfflineData} from "../../../mobile/src/store/actions/OfflineData"
import {connect} from "react-redux"

class QuizzesExamInit extends MocExamInitController {
    static contextType = Context;
    renderHeadercondition = () => {
const {t}:any = this.props;
        return (
            <>
                <View style={[styles.mainView, {
                    ...styles.quizzesHeader, flexDirection: this.state.isConfirmButtonPressed && !this.state.isitinthehorizontalresultopage? "row" : 'row',
                }]}>
                    <Text style={styles.headerStyle}>
                        {this.state.courseName}
                    </Text>
                    {/* <CircularProgresss width={40} progressColor={progressData?.pointscolor} progress={progressData?.progress} fillColor={progressData?.fillColor} pointscolor={progressData?.pointscolor} textColor={progressData?.textColor} pointsText={progressData?.pointsText} totlatext={progressData?.totlatext} isThisSmall={true} /> */}
                    {this.renderingQuizresultConditionHeader()}

                </View>
                <View style={{ marginLeft: Scale(15),width:'90%' }} >

                    {this.renderQuizheadercontionagain()}

                    <Text style={{
                        marginTop: Scale(5),
                        color: "#777185",
                        fontSize: Scale(16),
                        lineHeight: Scale(19),
                        fontWeight: "400",
                        marginBottom:Scale(30)
                    }}>{!this.state.isConfirmButtonPressed ? t("AnswerTheQuestionAndClick") :  t("TheCorrectAnswerIsShownBelow")}</Text>
                </View>
                {this.state.isitinthehorizontalresultopage ?

                    <View style={{ alignSelf: "center", marginTop: Scale(15),marginBottom:Scale(15) }}>
                        {this.ProgressBarHorizontal()}
                    </View>
                    : <></>}

                {/* {this.state.quiz_page_index==this.state.mockexamdata.length-1 && this.state.isConfirmButtonPressed?  this.ProgressBarHorizontal():<></>} */}
            </>
        )
    }


    renderingQuizresultConditionHeader = () => {
        if (this.state.isConfirmButtonPressed) {
            if (this.state.isitinthehorizontalresultopage) {
                return (
                    <View >
 <Text style={styles.countStyle}>
                        <Text style={styles.currentPageCountStyle}>{this.state.quiz_page_index + 1} </Text>/ {this.state?.mockexamdata.length}</Text>
                    </View>
                )
            }
            else {
                return (
                    <View >
                    <Text style={styles.countStyle}>
                                           <Text style={styles.currentPageCountStyle}>{this.state.quiz_page_index + 1} </Text>/ {this.state?.mockexamdata.length}</Text>
                                       </View>
                )
            }
        }
        else {
            return (
                <>
                    <Text style={styles.countStyle}>
                        <Text style={styles.currentPageCountStyle}>{this.state.quiz_page_index + 1} </Text>/ {this.state?.mockexamdata.length}</Text>
                </>
            )
        }
    }

    renderQuizheadercontionagain = () => {
      const { t }: any = this.props;
      if (this.state.isConfirmButtonPressed) {
          if (this.state.mockexamdata.length === Number(this.state.quiz_page_index)) {
              return (
                  <Text style={styles.quizNameText}>{`${this.state?.mockexamdata[this.state.quiz_page_index - 1]?.attributes?.name} ${t("result")}`}</Text>
              )
          }
          else {
  
              return (
                  <Text textBreakStrategy="balanced" numberOfLines={2} style={{ ...styles.quizNameText, width: '80%' }}>{`${this.state?.mockexamdata[this.state.quiz_page_index]?.attributes?.name} ${t("result")}`}</Text>
              )
          }
      }
      else {
          return (
              <Text style={styles.quizNameText}>{this.state?.mockexamdata[this.state.quiz_page_index]?.attributes?.name}</Text>
          )
      }
  }


    renderHeader = () => {
        const { t }: any = this.props;
        return (
            <View style={styles.mainView}>
                <View style={{ flexDirection: "column" }}>
                    <Text
                        style={{
                            fontSize: Scale(32),
                            fontWeight: "700",
                            lineHeight: Scale(37),
                            letterSpacing: Scale(0.4),
                            color: "#373434",
                            marginTop: Scale(20),
                        }}
                    >
                        {!this.state.isConfirmButtonPressed ? t("MockExam1") : t("Results")}
                    </Text>
                    <Text
                        style={{
                            fontSize: Scale(16),
                            fontWeight: "400",
                            lineHeight: Scale(18),
                            color: "#777185",
                            marginTop: Scale(20),
                        }}
                    >
                        {t("AnswerTheQuestionAndClick")}
                    </Text>
                </View>

            </View>
        );
    };

    handleIndex = () => {
        let lastIndex = this.state.mockexamdata.length - 1
        if (lastIndex === this.state?.quiz_page_index) {
            this.props.navigation.goBack()
        } else {
            this.setState({ isConfirmButtonPressed: false })
            this.setState({ quiz_page_index: this.state?.quiz_page_index + 1 })
        }
    }

    renderCLoseCheckButton = () => {
        const { t }: any = this.props;
        return (
            <View style={{ justifyContent: "flex-end", bottom: Scale(0) }}>
                <View style={{ ...styles.buttonMainView }}>
                    <TouchableOpacity
                        style={styles.closeButtonView}
                        onPress={() => this.props.navigation.goBack()}
                    // onPress={() => this.props.navigation.navigate('OverView')}
                    >
                        <Image
                            style={{ height: Scale(30), width: Scale(20) }}
                            source={require("../assets/close.png")}
                        />
                        <Text style={{ ...styles.closetxt}}>{t("Close")}</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', width: '40%' }}>
                        {this.state.shouldComfirmationButtonBeVisible && this.state.equilibriumcount == 0 ?
                            <TouchableOpacity
                                onPress={() => {
                                    !this.state.isConfirmButtonPressed ? this.conditionforNextFunction() : this.nextButtonPressFunction()
                                }}
                                style={styles.closeButtonView}
                            >

                                {!this.state.isConfirmButtonPressed ? (
                                    <Image
                                        style={{
                                            height: Scale(15),
                                            width: Scale(15),
                                            tintColor: 'grey',
                                            marginTop: Scale(8)
                                        }}
                                        source={require("../assets/RightIcon.png")}
                                    />
                                ) : (
                                    <Image
                                        style={{ height: Scale(12), width: Scale(7), marginTop: Scale(9), tintColor: 'grey', }}
                                        source={require("../assets/next.png")}
                                    />
                                )}
                                <Text style={{ ...styles.closetxt, marginTop: Scale(8) }}>
                                    {this.state.isConfirmButtonPressed ? t("Next") : t("Check")}
                                </Text>
                            </TouchableOpacity>
                            : this.state.equilibriumcount !== 0 ||this.state.amIinresultopage  || this.state.isitinthehorizontalresultopage  ? <TouchableOpacity
                                onPress={() => {
                                    if(this.state.quiz_page_index==this.state.mockexamdata.length-1)
                                    {
                                     this.props.navigation.goBack()
                                     return
                                    }
                                   if(this.state.amIinresultopage)
                                   {
                                    this.setState({isitinthehorizontalresultopage:true,amIinresultopage:false})
                                    return
                                   }
                                 
                                    this.setState({ quiz_page_index: this.state.quiz_page_index + 1, equilibriumcount: this.state.equilibriumcount - 1 })
                                    this.state.equilibriumcount == 1 && !this.state.isItontheEdge && this.setState({ isConfirmButtonPressed: false })

                                    this.state.quiz_page_index == this.state.mockexamdata.length - 2 && this.setState({ amIinresultopage: true, isConfirmButtonPressed: true })
                                }}
                                style={styles.closeButtonView}
                            >


                                <Image
                                    style={{ height: Scale(12), width: Scale(7), marginTop: Scale(9), tintColor: 'grey' }}
                                    source={require("../assets/next.png")}
                                />

                                <Text style={{ ...styles.closetxt, marginTop: Scale(8) }}>
                                    {t("Next")}
                                   
                                </Text>
                            </TouchableOpacity>

                                : <View></View>}
                      <View>
                           {this.state.quiz_page_index!=0 && this.state.isItthepeak && <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => {
                                 this.setState({ quiz_page_index: this.state.quiz_page_index - 1, isConfirmButtonPressed: true, equilibriumcount: this.state.quiz_page_index == 0 ? this.state.equilibriumcount : this.state.equilibriumcount + 1})
                                 if(this.state.amIinresultopage)
                                 {
                                     this.setState({amIinresultopage:false})
                                 }
                                //  if(this.state.isitinthehorizontalresultopage)
                                //  {
                                //     this.setState({amIinresultopage:true,isitinthehorizontalresultopage:false})
                                //  }
                                }
                               
                                 }>
                                <Image
                                    style={{ height: Scale(12), width: Scale(7), marginTop: Scale(9) }}
                                    source={require("../assets/Backarrow.png")}
                                />
                                <Text style={{ ...styles.closetxt, marginTop: Scale(10) }}>
                                    {t("Previous")}
                                </Text>
                            </TouchableOpacity>}
                        </View>


                    </View>
                    {/* <TouchableOpacity style={styles.closeButtonView}>
                            <Image style={{ width: Scale(15), height: Scale(15), resizeMode: "contain" }} source={require("../assets/restartIcon.png")} />
                            <Text style={styles.closetxt}>Restart</Text>
                        </TouchableOpacity> */}

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
              {t("SelectTheCorrectAnswer")}
            </Text> : <Text
              style={{
                marginTop: Scale(5),
                color: "#777185",
                fontSize: Scale(16),
                lineHeight: Scale(19),
                fontWeight: "400",
              }}
            >
              {t("Review your answer")} 
            </Text>}
            <View style={{ marginTop: Scale(10) }}>
              {extractOptions().map((ele: any, index: any) =>
                !this.state.isConfirmButtonPressed ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
   
                      paddingLeft: Scale(15),
                      width:"90%"
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
                      width: "90%",
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
                style={{ ...stylesForAnswers.rightMultipleChoice, color: COLORS.success }}
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
                style={{ ...stylesForAnswers.rightMultipleChoice, color: "red"}}
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
              <Text style={{ ...stylesForAnswers.rightMultipleChoice,color:COLORS.success,marginLeft:Scale(5)}}>{ele}</Text>
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
                style={{ ...stylesForAnswers.rightMultipleChoice, color: "grey", marginLeft: Scale(0) }}
              >
                {ele}
              </Text>
            </View>
          );
        }
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
                // marginTop: Scale(10),
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
                  style={{ width: Scale(20), height: Scale(20) ,tintColor:'none',marginLeft:Scale(-2)}}
                  source={require("../assets/unCheck.png")}
                />
                <Text style={{ ...stylesForAnswers.rightMultipleChoice,color:COLORS.success }}>
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
              <Text style={{ ...stylesForAnswers.rightMultipleChoice, marginLeft: Scale(0) }}>{ele}</Text>
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
                style={{ ...stylesForAnswers.rightMultipleChoice, color: COLORS.success }}
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
                style={{ ...stylesForAnswers.rightMultipleChoice, color: "red", marginLeft: Scale(7) }}
              >
                {ele}
              </Text>
            </View>
          );
        }
   
   
      }


 ProgressBarHorizontal=()=>{
const {t}:any = this.props;
    return (
    <>
   
    <View style={{height:Scale(100),backgroundColor:'white',borderRadius:Scale(10),shadowColor:COLORS.grey,shadowOffset:{width:Scale(0),height:Scale(0)},shadowOpacity:0.2}}>
    <View style={{flexDirection:"row",width:'60%',justifyContent:'space-between',alignSelf:'center',marginTop:Scale(10),alignItems:'center'}}>
   
    <View>
    <Text style={{...stylesForAnswers.ProgressBarHorizontalpointsText,color:COLORS.success}}>
    {this.state.writeAnswerCount}
    </Text>
    <Text style={{...stylesForAnswers.ProgressBarHorizontalpointspoint}}>
      {t("CORRECT")}
    </Text>
    </View>
    <View  style={{height:Scale(2),width:Scale(2),backgroundColor:'grey'}}/>
    <View>
    <Text style={{...stylesForAnswers.ProgressBarHorizontalpointsText,color:COLORS.lightRed}}>
    {this.state.WrongAnsercount}
    </Text>
    <Text style={{...stylesForAnswers.ProgressBarHorizontalpointspoint}}>
      {t("INCORRECT")}
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
   

    questionQuizzesData = (quizzesData: any) => {

        console.log("quizzesData @@", quizzesData)
        console.log("quizexam renderer", this.state,"===",{"equilibriumcount":this.state.equilibriumcount},
       {"isItontheEdge" :this.state.isItontheEdge},
       {"amIinresultopage":this.state. amIinresultopage},
       {"isitinthehorizontalresultopage":this.state. isitinthehorizontalresultopage}
        )

        // return
        if (quizzesData?.attributes?.question_type == "short_text_and_schema") {
            return <MoxExamQuestionOne
                data={quizzesData}
                key={this.state.componentRerenderkey}
                isItOffline={this.state.isoFFline}
                questionIndex={this.state?.quiz_page_index}
                isconfirmpressed={this.state.isConfirmButtonPressed}
                functionResposibleforschema={this.functionResposibleforschema}
                short_text_and_schema_answer={this.state?.short_text_and_schema_answer}
                SchemaBasedMountFunction={this.SchemaBasedMountFunction}
                returnborderColorforschema={this.returnborderColorforschema}
                isConfirmButtonPressed={this.state.isConfirmButtonPressed}
                equibriumcount={this.state.equilibriumcount}
            />

        } else if (quizzesData?.attributes?.question_type == "rearrange_order") {
            return <ReArrangeOrder
                data={quizzesData}
                key={this.state.componentRerenderkey}
                questionIndex={this.state?.quiz_page_index}
                confimationPress={this.state.isConfirmButtonPressed}
                functionResponsibleForRearrange={this.functionResponsibleForRearrange}
                optionsArrrayForreArrange={this.optionsArrrayForreArrange}
                rearrange_order_answer={this.state.rearrange_order_answer}
                isConfirmButtonPressed={this.state.isConfirmButtonPressed}
            />
            // return <ReArrangeOrder rearrange_order_answer={quizzesData} questionIndex={this.state?.quiz_page_index} confimationPress={this.state.isConfirmButtonPressed} />
        } else if (quizzesData?.attributes?.question_type == "pair") {
            return <PairquestionScreen
                data={quizzesData}
                questionIndex={this.state?.quiz_page_index}
                pairExamdidmountfunction={this.pairExamdidmountfunction}
                rearrangeextarctedData={this.state.rearrangeextarctedData}
                functionResponsibleForAddingClipboardDataToSlots={this.functionResponsibleForAddingClipboardDataToSlots}
                copyTotrialcopyBoard={this.copyTotrialcopyBoard}
                mystate={this.state}
                isConfirmButtonPressed={this.state.isConfirmButtonPressed}
            />
        } else if (quizzesData?.attributes?.question_type == "multiple_choice") {
            return this.customBoxbuttonComponent(quizzesData, this.state?.quiz_page_index)
        } else if (quizzesData?.attributes?.question_type == "radio_button") {
            return this.customRadioButtonComponent(quizzesData, this.state?.quiz_page_index)
        }
    }

    render() {

        return (
            <SafeAreaView style={styles.mainContainer}>
                <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : undefined} style={styles.mainContainer}>
                    <ScrollView style={{ flex: 1 }} ref={(ref) => { this.scrollViewRef = ref; }}>

                        {this.renderHeadercondition()}

                        {this.state.mockexamdata ? this.questionQuizzesData(this.state.mockexamdata[this.state.quiz_page_index]) : null}

                    </ScrollView>
                </KeyboardAvoidingView>

                {this.renderCLoseCheckButton()}
 <ResultModal myState={this.state} CloseModal={this.functionForClosingResultModal} reviewmockFunction={this.functionWhenclickedonReviewMockexam} letsGoback={this.functionForgoingBack} />
            </SafeAreaView>
        )
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
    wrongMultiplechoiceContainer: {
        flexDirection: 'row', alignItems: 'center'
    }
    ,
    wrongmultiplechoiceImage: {
        height: Scale(30), width: Scale(15)
    },
    ProgressBarHorizontalpointsText: {
        fontFamily: FONTS.Roboto_Regular,
        fontWeight: '900',
        fontSize: Scale(28),
        textAlign: 'center'
    },
    ProgressBarHorizontalpointspoint: {
        fontFamily: FONTS.Roboto_Regular, color: COLORS.grey,
        fontSize: Scale(12),
        fontWeight: '700'

    },
    styleforWrongAnswerinbox: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginTop: Scale(15),
        marginRight: Scale(60),
        marginLeft: Scale(-10)
      }

});
const mapStateToProps = (state:any) => {
  return {
      offlineState  : state.rootReducer.offlineReducer
    }
}
const mapDispatchToProps = (dispatch : any) => {
  return {
    getOfflineAction : (params) => {
      dispatch(getOfflineAction(params))
    }, 
    updateOfflineData : (params) => {
      dispatch(updateOfflineData(params))
    }
  }
};


export default withTranslation()(connect(mapStateToProps,mapDispatchToProps)(QuizzesExamInit));
// Customizable Area End
