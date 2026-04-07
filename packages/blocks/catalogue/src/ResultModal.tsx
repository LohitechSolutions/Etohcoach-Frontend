import React from "react";
import { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Modal,
  StyleSheet

} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
import MocExamInitController from "./MocExamInitController";
import { withTranslation } from "react-i18next";
import { COLORS } from "../../../framework/src/Globals";
import { FONTS } from "../../../framework/src/Fonts";
import Scale from "../../../components/src/Scale";
import CircularProgresss from "../../../components/src/Circularprogress";
import Context from "../../../components/src/context/context";
import {getOfflineAction, updateOfflineData} from "../../../mobile/src/store/actions/OfflineData"
import {connect} from "react-redux"

class ResultModal extends MocExamInitController {

  static contextType = Context;
  render() {
const {t}:any = this.props;
    console.log("propsss----------result",this.props)
    let myprogress=Number(this.props.myState.Progresspercentage)
    // console.log("asdjflsdf",this.props.myState.ResultModalPointsText)
    return(
        <Modal
              animationType="slide"
              transparent={true}
              visible={this.props.isItformmockexam?this.props.myState.resultModalVisible:this.props.myState.modalShowforquizzes}
            >
              <TouchableWithoutFeedback
                style={{ backgroundColor: "red", height: "50%", width: "100%" }}
              >
                <View style={styles.centeredView}>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      return;
                    }}
                    style={{ backgroundColor: "red", height: "50%", width: "100%" }}
                  >
                    <View style={[styles.modalView]}>
                      <View
                        style={{
                          height: 5,
                          backgroundColor: "#ECF1F4",
                          width: "20%",
                          borderRadius: 5,
                        }}
                      />
                     
                     <View style={{marginTop:Scale(40)}}>
                     <CircularProgresss progressColor={this.props.myState.CircularprogressprogressColor} progress={this.props.myState.Progresspercentage} fillColor={this.props.myState.CircularprogressfillColor} pointscolor={this.props.myState.Circularprogresspointscolor} textColor={this.props.myState.CircularprogresstextColor} pointsText={this.props.myState.Circularprogresspointstext} totlatext={this.props.myState.Circularprogresstotlatext} />
                     </View>
    
                      <Text
                     
                        style={{
                          fontSize: hp("3.2%"),
                          color: "#000",
                          fontFamily: FONTS.Explet_SemiBold,
                          marginTop: "10%",
                      
                        }}
                      >
                        
                {t(this.props.myState.ResultModalPointsText)}
                      </Text>
           
{/* 
                      <Text
                      numberOfLines={2}
                
                        style={{
                          fontSize:Scale(15),
                          marginTop: 10,
                          fontFamily: FONTS.Roboto_Regular,
                          color: "#777185",
                          width:'80%',
                          textAlign:'center'
                        }}
                      >
                      {this.props.myState.ResultModalPointsSubtest}
                      </Text> */}

<View>


{myprogress>=70 && myprogress<100 ? <View>
<Text style={styles.styleForSubtext}>
{this.props.isItformmockexam? t("ReviewYourExamResults"): t("ReviewYourQuizResults")}
</Text>
<Text style={styles.styleForSubtext}>
  {t("ToSeeWhatCanBeImproved")}
</Text>
</View>:
  myprogress<70?
<View>
<Text style={styles.styleForSubtext}>
  {t("ImproveYourScoreByReviewingLessons")}
</Text>
{/* <Text style={styles.styleForSubtext}>
  {t("AndFlashcards")}
</Text> */}
  </View>:
  <View>
    <Text style={styles.styleForSubtext}>
    {t("YouveMasteredThisConcept")}
</Text>
    </View>}
           </View>
                   
                   <View style={{marginTop:Scale(50),width:'100%'}}>
                    
                        <TouchableOpacity
                          style={{
                            backgroundColor:COLORS.lightRed,
                            width: "100%",
                            height: 50,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 15,
                          }}
                          onPress={() => {this.props.isItformmockexam?this.props.reviewmockFunction():this.props.CloseModal()}}
                        >
                            <Text
                              style={{
                                color: "#fff",
                                textAlign: "center",
                                fontSize: hp("2.0%"),
                                fontFamily: FONTS.Roboto_Bold,
                              }}
                            >
                              {this.props.isItformmockexam? t("REVIEWEXAM"): t("REVIEWQUIZ")}
                             
                            </Text>
                        </TouchableOpacity>
             
                        <TouchableOpacity
                          style={{
                            borderWidth: 0.5,
                            width: "100%",
                            height: 50,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 15,
                            backgroundColor:COLORS.white,
                            borderColor: COLORS.white,
                            shadowColor:'grey',
                            shadowOpacity:0.1,
                            marginTop:Scale(20),
                            shadowOffset:{height:1,width:1}
                            
                          }}
                          onPress={ () =>{this.props.CloseModal();this.props.letsGoback()}}
                        >
                          <Text
                            style={{
                              fontSize: hp("2%"),
                              fontFamily: FONTS.Roboto_Bold,
                              color: COLORS.black
                            }}
                          >
                         {t("RETURNTOCOURSE")}
                          </Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
    )
    
    

  }
  
}
const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
      borderRadius: 10,
      borderBottomEndRadius: 0,
      borderBottomStartRadius: 0,
      marginTop: 20,
      backgroundColor: "#FFFFFF",
      padding: 20,
      paddingTop: 15,
      paddingBottom: 5,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        height: 2,
        width: 0,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      height: "70%",
      width: "100%",
    },
    styleForSubtext:{
      fontSize:Scale(15),
      marginTop: 10,
      fontFamily: FONTS.Roboto_Regular,
      color: "#777185",
      textAlign:'center'
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
      }
    }
  };
  
  export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ResultModal));