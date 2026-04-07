// Customizable Area Start 
// Customizable Area End
import React from "react";
import { View, Text, SafeAreaView, FlatList, TouchableWithoutFeedback, Image, TouchableOpacity } from "react-native";
import MocExamInitController from "./MocExamInitController";
import { DraggableGrid } from "react-native-draggable-grid";
import styles from "./MocExamInitStyle";
import Scale from "../../../components/src/Scale";
import { FONTS } from "../../../framework/src/Fonts";
import { COLORS } from "../../../framework/src/Globals";
import { withTranslation } from "react-i18next";
import Context from "../../../components/src/context/context";
import {getOfflineAction, updateOfflineData} from "../../../mobile/src/store/actions/OfflineData"
import {connect} from "react-redux"
// Customizable Area Start 
class PairquestionScreen extends MocExamInitController {
  static contextType = Context;
  async componentDidMount() {
    console.log(this.props?.data, this.props?.questionIndex, "poooooooo");

    this.props.pairExamdidmountfunction(this.props?.questionIndex)
    // this.focusListener = this.props.navigation.addListener("willFocus", () => {
    // })
  }

  // mountingFunc=()=>{
  //   this.pairExamdidmountfunction(this.props?.questionIndex)

  // }

  renderCourseThemeItemListCell = () => {
    let arr = this.props?.data?.attributes?.is_correct
    arr = arr.map((ele: any) => {
      return ele.trim()
    })
const {t}:any = this.props;
    console.log(
      "data is the new data",
      this.state.pair_answer[this.props?.questionIndex], arr
    );
    let questionIndex = this.props?.questionIndex
    let myAnswersArray = this?.props.mystate?.pair_answer[this.props?.questionIndex]

    return (
      <View style={{ marginTop: Scale(0) }}>
      
        <View style={styles.mainView}>
          <View style={{ ...styles.headerView, marginBottom: Scale(10) }}>
            <Text style={{
              fontSize: Scale(22),
              fontWeight: "700",
              lineHeight: Scale(24),
              letterSpacing: Scale(0.4),
              color: "#373434",
            }}>
              {this.props?.data?.attributes?.question}

            </Text>

            {/* <Text style={{ fontSize: Scale(12), lineHeight: Scale(14), fontWeight: '500', color: "#777185" }}>How the wine is done.</Text> */}
            <View style={styles.userCountView}>
              {/* <Text style={{ fontSize: Scale(16), fontWeight: "800", lineHeight: Scale(16), color: "#BF3E50" }}>{"ite not here"}</Text> */}
              {/* <Text style={{ fontSize: Scale(12), fontWeight: "500", lineHeight: Scale(12), color: "#B5B2BF", marginTop: Scale(5) }}>/{item?.attributes?.total_count}</Text> */}
            </View>
          </View>
          {!this.props.mystate.isConfirmButtonPressed ? <Text
            style={{
              marginTop: Scale(10),
              marginBottom: Scale(5),
              color: "#777185",
              fontSize: Scale(16),
              lineHeight: Scale(19),
              fontWeight: "400",
            }}
          >
            {t("FindThePair")}
          </Text> : <></>}
        </View>
        {/* ele==this.props.mystate.trialCopyBoard?"green":this.props.mystate.pair_answer[this.props.questionIndex].includes(ele)?"#ECF1F4":'White', */}
        <View
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            width: "100%",
            paddingHorizontal: Scale(5),
            flexWrap: "wrap",
            marginTop: Scale(5)

          }}
        >
          {this.props?.mystate?.pairextracteddata?.map((ele: any, index: any) => (
            !this.props.mystate.isConfirmButtonPressed ? <View key={index}
              style={{
                padding: Scale(8),
                backgroundColor:ele==  this.props.mystate.trialCopyBoard?"#485579":this.props?.mystate?.pair_answer[this.props.questionIndex]?.includes(ele)?"#ECF1F4":'white',
                maxWidth: "40%",
                minWidth: "25%",
                borderRadius: Scale(9),
                marginLeft: Scale(15),
                marginTop: Scale(15)
              }}
            >
              {console.log("this.props.mystate.isConfirmButtonPressed======>",ele,this.props.mystate.trialCopyBoard)}
              <TouchableOpacity  onPress={() => { this.props.copyTotrialcopyBoard(ele);
                 }}>
                <Text
                  style={{
                    fontSize: Scale(18),
                    fontFamily: FONTS.Roboto_Regular,
                    textAlign: "center",
                   

                  }}
                >
                  {ele}
                </Text>
              </TouchableOpacity>
            </View> : this.functionShowrightorwrongForwords(index, myAnswersArray, ele)
          ))}
        </View>

        <View>
          <View style={{ justifyContent: "center", alignItems: "center" ,shadowColor: '#00000',
    shadowOffset: { width: 0, height: 0.2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 4}}>
            {myAnswersArray?.map((ele: any, index: any) => (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "white",
                  paddingVertical: Scale(5),
                  width: "90%",
                  borderRadius: Scale(15),
                  marginTop: Scale(15),
                  paddingBottom:Scale(10)
                }}
              >
                <View style={{ marginVertical: Scale(15) }}>
                  <Text
                    style={{
                      fontFamily: FONTS.Roboto_Regular,
                      fontWeight: "700",
                      fontSize: Scale(18),
                      color: "#373434",
                    }}
                  >
                    {this.props.data.attributes.words[index] ?? "Backend_Bug"}
                  </Text>
                </View>



                {!this.props.mystate.isConfirmButtonPressed ? <TouchableWithoutFeedback onPress={() => { this.props.functionResponsibleForAddingClipboardDataToSlots(ele, index, questionIndex) }} style={{ width: '100%' }}>
                  <View
                    style={{
                      width: "90%",
                      backgroundColor:ele!==""?"#ECF1F4":'#fffff',
                      height: Scale(50),
                      borderRadius: Scale(9),
                      borderColor:'#B5B2BF',
                      borderWidth:1
                    }}
                  >

                    <Text style={{ textAlign: 'center', marginTop: '5%' }}>
                      {ele}
                    </Text>
                  </View>

                </TouchableWithoutFeedback> : this.functionShowingrightOrWrong(index, arr, ele)

                }
                         { this.props.mystate.isConfirmButtonPressed && <View style={{height:Scale(0.9),width:'100%',backgroundColor:COLORS.greyLine,marginTop:Scale(15) }} />}
               { this.props.mystate.isConfirmButtonPressed ?<View style={{flexDirection:"row",marginTop:Scale(10),marginBottom:Scale(5)}}>
   <Text style={{color:COLORS.grey,fontFamily:FONTS.Roboto_Regular,fontSize:Scale(15),fontWeight:"700"}}>{t("CorrectAnswer")}</Text>
   <Text style={{color:COLORS.black,fontFamily:FONTS.Roboto_Regular,fontSize:Scale(15),fontWeight:"700"}}>: {arr[index]} </Text>
   </View>:<></>}
              </View>
            ))}
           
          </View>
        
        </View>
      </View>
    );
  };


  functionShowingrightOrWrong(index: any, myanswersrray: any, elem: any) {
    if (myanswersrray[index]?.toLowerCase() == elem?.toLowerCase()) {
      return (
        <View
          style={{
            width: "90%",
            backgroundColor: "#ECF1F4",
            height: Scale(50),
            borderRadius: Scale(9),
            flexDirection: 'row',
            justifyContent: "center",
            alignItems: 'center',
            borderWidth: 1,
            borderColor: COLORS.success
          }}
        >

          <Image
            style={{ ...styles.checkButton, tintColor: COLORS.success }}
            source={require("../assets/RightIcon.png")}
          />
          <View style={{ marginBottom: 3, paddingHorizontal: 8 }}>
            <Text style={{ textAlign: 'center', marginTop: '6%' }}>
              {elem}
            </Text>
          </View>
        </View>

      )
    }
    else {
      return (
        <View
          style={{
            width: "90%",
            backgroundColor: "#ECF1F4",
            height: Scale(50),
            borderRadius: Scale(9),
            flexDirection: 'row',
            justifyContent: "center",
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'red'
          }}
        >

          <Image
            style={{ ...styles.closeButton, tintColor: 'red' }}
            source={require("../assets/close.png")}
          />
          <View style={{ marginBottom: 3, paddingHorizontal: 8 }}>
            <Text style={{ textAlign: 'center', marginTop: '6%' }}>
              {elem}
            </Text>
          </View>
        </View>
      )
    }
  }

  functionShowrightorwrongForwords(index: any, myanswersrray: any, elem: any) {
    let myelementsposition = myanswersrray.indexOf(elem)
    //let rightposition=this.props.mystate?.trialPairanswers.indexOf(elem)
    let rightposition = this.props?.data?.attributes?.is_correct.indexOf(elem)
    console.log(myanswersrray, myelementsposition, rightposition, elem, this.props?.data?.attributes?.is_correct, "messy world")
    return (
      <View
        style={{
          padding: Scale(8),
          backgroundColor: "#ECF1F4",
          maxWidth: "40%",
          minWidth: "25%",
          borderRadius: Scale(9),
          marginLeft: Scale(15),
          marginTop: Scale(15),
          borderWidth: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height:Scale(40),
          borderColor: rightposition && myelementsposition == -1 || myelementsposition !== rightposition && rightposition == -1 ? "grey" : myelementsposition == rightposition ? COLORS.success : "red"

        }}
      >
        {myelementsposition == rightposition && myelementsposition == -1 || myelementsposition !== rightposition && rightposition == -1 ? <View></View> : myelementsposition == rightposition ? <Image
          style={{ ...styles.closeButton, tintColor: COLORS.success,height:Scale(15) ,width:Scale(15)}}
          source={require("../assets/RightIcon.png")}
        /> : <Image
          style={{ ...styles.closeButton, tintColor: 'red',height:Scale(30) ,width:Scale(30)}}
          source={require("../assets/close.png")}
        />}
        
        <View style={{ paddingLeft: Scale(5) }}>
          <Text
            style={{
              fontSize: Scale(18),
              fontFamily: FONTS.Roboto_Regular,
              textAlign: "center",        
            }}
          >

            {elem}
          </Text>
        </View>
      </View>)
  }

  render() {
    console.log(this.props, "checkking state inaaa")
    return (
      <SafeAreaView style={styles.mainContainer}>
        {this.renderCourseThemeItemListCell()}
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

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(PairquestionScreen));
// Customizable Area End