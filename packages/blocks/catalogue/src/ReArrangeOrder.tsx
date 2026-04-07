// Customizable Area Start 
import React from "react";
import { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  SafeAreaView,
  FlatList,
} from "react-native";
import styles from "./ReArrangeOrderStyle";
import ReArrangeOrderController from "./ReArrangeOrderController";
import Scale from "../../../components/src/Scale";
import MocExamInitController from "./MocExamInitController";
import { COLORS } from "../../../framework/src/Globals";
import { withTranslation } from "react-i18next";
import { FONTS } from "../../../framework/src/Fonts";
import Context from "../../../components/src/context/context";
import {getOfflineAction, updateOfflineData} from "../../../mobile/src/store/actions/OfflineData"
import {connect} from "react-redux"

export class ReArrangeOrder extends MocExamInitController {
  static contextType = Context;
  extractOptions = (data: any) => {
    let obj = data.attributes;
    let optionsarray = [];
    for (let key in obj) {
      if (key.includes("option_")) {
        optionsarray.push(obj[key]);
      }
    }

    return optionsarray;
  };

  async componentDidMount() {
    // let optionsarray= this.extractOptions(this.props?.data)

    // this.setState({rearrange_order_answer:{...this.state.rearrange_order_answer,[this?.props?.questionIndex]:optionsarray}})
    this.props.optionsArrrayForreArrange(
      this.props?.data,
      this?.props?.questionIndex
    );
  }

  renderHeader = () => {
    const {t}:any = this.props;
    return (
      <View style={{ marginLeft: Scale(15), marginTop: Scale(0) }}>

        {/* <View style={styles.headerView}> */}
        {/* <Text style={styles.titleTxt}>How the wine is done.</Text> */}
        {/* <View style={styles.countView}>
            <Text style={styles.countUser}>3</Text>
            <Text style={styles.totalCount}>/12</Text>
          </View> */}
        {/* </View> */}
        {/* <Text style={styles.arrangeTxt}>Arrange steps</Text> */}
      
        <Text style={{
          fontSize: Scale(22),
          fontWeight: "700",
          lineHeight: Scale(24),
          letterSpacing: Scale(0.4),
          color: "#373434", marginTop: 15
        }}>
          {this.props?.data?.attributes?.question}

        </Text>
        {/* <Image source={require("../assets/image_question.png")} style={styles.qeustionImage} /> */}
      {!this.props.confimationPress?  <Text style={styles.answerInputTxt}>
          { t("ArrangeSteps")}
        </Text>:null}
      </View>
    );
  };

  renderCLoseCheckButton = () => {
    const {t}:any = this.props;
    return (
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View style={styles.buttonMainView}>
          <TouchableOpacity style={styles.closeButtonView}>
            <Image
              style={styles.closeButton}
              source={require("../assets/close.png")}
            />
            <Text style={styles.closetxt}>{ t("Close")}</Text>
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
            <Text style={styles.closetxt}>{ t("Check")}</Text>
          </TouchableOpacity>
          {/* <View style={styles.closeButtonView}>
                    <Image style={styles.nextButton} source={require("../assets/imagenav_lesson.png")} />
                    <Text style={styles.closetxt}>Next</Text>
                </View> */}
        </View>
      </View>
    );
  };

  renderQuestionListCell = (item: any, index: any) => {
    const {t}:any = this.props;
    return (
      <View>
        <View style={styles.questionListView}>
          <Text style={styles.countUser}>{index + 1}</Text>
          {!this.props.confimationPress ? (
            <View >
              <View
                style={
                  !this.props.isConfirmButtonPressed
                    ?{... styles.questionView,minHeight:Scale(60)}
                    : this.props.isConfirmButtonPressed &&
                      this.props?.data?.attributes?.is_correct[index] == item
                      ?{ ...styles.questionviewifRightanswer,minHeight:Scale(60)}
                      :{ ...styles.questionviewifRightanswer,minHeight:Scale(60)}
                }
              >
                <Text style={{...styles.rightAnswerTxt,width:Scale(290)}}>{item}</Text>
                <View style={styles.buttonView}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.functionResponsibleForRearrange(
                        index,
                        "up",
                        this?.props?.questionIndex
                      );
                    }}
                  >
                    <Image
                      style={styles.nextButton}
                      source={require("../assets/image_up.png")}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.functionResponsibleForRearrange(
                        index,
                        "down",
                        this?.props?.questionIndex
                      );
                    }}
                  >
                    <Image
                       style={styles.nextButton}
                      source={require("../assets/Downicon.png")}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View style={{paddingBottom:Scale(10)}}>
            {this.functionForrenderingAnswer(item, index)}
            </View>
          )}
        </View>
      </View>
    );
  };

  findTherealPosition(item: any) {
    console.log(this.props?.data?.attributes?.is_correct, item, "checking position from my rearrange");

    let position;
    for (let i = 0; i < this.props?.data?.attributes?.is_correct?.length; i++) {
      console.log(this.props?.data?.attributes?.is_correct, item, "checking position");

      if (this.props?.data?.attributes?.is_correct[i] == item) {
        position = i;


      }
    }

    return Number(position) + 1;
  }

  functionForrenderingAnswer(item: any, index: any) {
    console.log("checking for conooo", this.props.confimationPress);
    if (this.props?.data?.attributes?.is_correct[index] == item) {
      return (
        <View>
          <View
            style={{
              ...styles.questionView,
              borderWidth: 1,
              borderColor: COLORS.success,
              minHeight: Scale(60)
            }}
          >
            <Text style={{...styles.rightAnswerTxt,width:Scale(290)}}>{item}</Text>
            <View style={styles.buttonView}>
              <View></View>
              <Image
                style={{ ...styles.checkButton, tintColor: COLORS.success }}
                source={require("../assets/RightIcon.png")}
              />
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View>
          <View
            style={{
              ...styles.questionView,
              borderWidth: 1,
              borderColor: "red",
                minHeight:Scale(60)
            }}
          >
            <Text style={{...styles.rightAnswerTxt,width:Scale(290)}}>{item}</Text>
            <View style={styles.buttonView}>
              <Text>{this.findTherealPosition(item)}</Text>
              <Image
                style={{ tintColor: "red",height:Scale(25),width:Scale(25)}}
                source={require("../assets/close.png")}
              />
            </View>
          </View>
        </View>
      );
    }
  }

  // functionResponsibleForRearrange=(index:any,direction:any,QuestionIndex:any)=>
  // {
  //   console.log(this,'asss')
  //   let myarr= this.state?.rearrange_order_answer[QuestionIndex]
  //   if(direction=='up' && index==0)
  //   {
  //     let temp=myarr[index]
  //     myarr[index]=myarr[myarr.length-1]
  //     myarr[myarr.length-1]=temp
  //     this.setState({rearrange_order_answer:{...this.state.rearrange_order_answer,[QuestionIndex]:myarr}})
  //   }
  //   else if(direction=='down' && index==myarr.length-1)
  //   {
  //     let temp=myarr[myarr.length-1]
  //     console.log(myarr.length-1,index,'checking inside core function')
  //     myarr[myarr.length-1]=myarr[0]
  //     myarr[0]=temp
  //     this.setState({rearrange_order_answer:{...this.state.rearrange_order_answer,[QuestionIndex]:myarr}})
  //   }
  //   else
  //   {
  //     console.log('checking inside core function others')

  //     if(direction=='down')
  //     {
  //       let temp=myarr[index]
  //       console.log(myarr.length-1,index,'checking inside core function')
  //       myarr[index]=myarr[index+1]
  //       myarr[index+1]=temp
  //       this.setState({rearrange_order_answer:{...this.state.rearrange_order_answer,[QuestionIndex]:myarr}})
  //     }
  //     if(direction=='up')
  //     {
  //       let temp=myarr[index]
  //       console.log(myarr.length-1,index,'checking inside core function')
  //       myarr[index]=myarr[index-1]
  //       myarr[index-1]=temp
  //       this.setState({rearrange_order_answer:{...this.state.rearrange_order_answer,[QuestionIndex]:myarr}})
  //     }

  //   }

  // }

  renderQuestionFlatlist = () => {
    console.log("this.props?.rearrange_order_answer ", this.props?.questionIndex, this.props?.rearrange_order_answer, "zigzag")
    console.log("this.props?.rearrange_order_answer ", this.props?.rearrange_order_answer[this.props?.questionIndex], "zigzag")
    return (
      <View style={{ justifyContent: "flex-end",paddingBottom:Scale(10) }}>
        <FlatList
          scrollEnabled={false}
          // data={this.props?.rearrange_order_answer[this.props?.questionIndex]}
          data={this.props?.rearrange_order_answer[this.props?.questionIndex]}
          renderItem={({ item, index }) =>
            this.renderQuestionListCell(item, index)
          }
        />
        <View></View>
      </View>
    );
  };

  render() {
    console.log("checking for conooo", this.props);

    console.log(this?.props, "checking params in rearrage");
    console.log(this.state, "checking state of rearrange answeerss");
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

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ReArrangeOrder));
// Customizable Area End