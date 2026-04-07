import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text, TouchableWithoutFeedback, Modal, SectionList, FlatList, Button } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { FONTS, FONTSIZE } from "../../framework/src/Fonts";
import { COLORS } from "../../framework/src/Globals";
import Loader from "./Loader";
import NotificationController from "./NotificationController";
import Scale from "./Scale";
import { withTranslation } from "react-i18next";
import RenderHTML from "react-native-render-html";
import WebViewComponent from "../../blocks/catalogue/Components/WebViewcomponent";
import {addNotification,removeNotification} from '../../mobile/src/store/actions/Notification';
import { connect } from "react-redux";
const Data = [
  {
    "header": "NEW",
    "data": [
      {
        "remarks": "You've made it to the podium! Congratulations! You are one of the best learners!",
        "created_at": "2022-11-16T11:16:25.737Z",
        "notify_type": "top 3 in the Leaderboard",
        "time": "about 2 hours"
      },
      {
        "remarks": "You've made it to the podium! Congratulations! You are one of the best learners!",
        "created_at": "2022-11-16T11:16:25.314Z",
        "notify_type": "top 3 in the Leaderboard",
        "time": "about 2 hours"
      },
      {
        "remarks": "You've made it to the podium! Congratulations! You are one of the best learners!",
        "created_at": "2022-11-16T11:13:37.429Z",
        "notify_type": "top 3 in the Leaderboard",
        "time": "about 2 hours"
      },
      {
        "remarks": "You've made it to the podium! Congratulations! You are one of the best learners!",
        "created_at": "2022-11-16T11:13:37.040Z",
        "notify_type": "top 3 in the Leaderboard",
        "time": "about 2 hours"
      },
      {
        "remarks": "You've made it to the podium! Congratulations! You are one of the best learners!",
        "created_at": "2022-11-16T11:11:36.836Z",
        "notify_type": "top 3 in the Leaderboard",
        "time": "about 2 hours"
      },
      {
        "remarks": "You've made it to the podium! Congratulations! You are one of the best learners!",
        "created_at": "2022-11-16T11:11:36.440Z",
        "notify_type": "top 3 in the Leaderboard",
        "time": "about 2 hours"
      },
      {
        "remarks": "A new course is here! Come and try new course for notification",
        "created_at": "2022-11-16T10:23:40.594Z",
        "notify_type": "New course is released",
        "time": "about 3 hours"
      }
    ]
  },
  {
    "header": "PREVIOUS NOTIFICATIONS",
    "data": [
      {
        "remarks": "A new course is here! Come and try lakhan course",
        "created_at": "2022-11-15T09:11:47.311Z",
        "notify_type": "New course is released",
        "time": "1 day"
      },
      {
        "remarks": "A new course is here! Come and try new pen add",
        "created_at": "2022-11-15T09:04:54.213Z",
        "notify_type": "New course is released",
        "time": "1 day"
      },
      {
        "remarks": "A new course is here! Come and try wine making",
        "created_at": "2022-11-15T08:14:16.240Z",
        "notify_type": "New course is released",
        "time": "1 day"
      },
      {
        "remarks": "A new course is here! Come and try jk",
        "created_at": "2022-11-15T07:48:37.432Z",
        "notify_type": "New course is released",
        "time": "1 day"
      },
      {
        "remarks": "A new course is here! Come and try get new course",
        "created_at": "2022-11-15T07:46:38.095Z",
        "notify_type": "New course is released",
        "time": "1 day"
      },
      {
        "remarks": "A new course is here! Come and try xyz",
        "created_at": "2022-11-15T07:43:00.695Z",
        "notify_type": "New course is released",
        "time": "1 day"
      },
      {
        "remarks": "A new course is here! Come and try dheeraj book",
        "created_at": "2022-11-15T07:41:53.106Z",
        "notify_type": "New course is released",
        "time": "1 day"
      },
      {
        "remarks": "A new course is here! Come and try shivnai",
        "created_at": "2022-11-15T07:40:00.539Z",
        "notify_type": "New course is released",
        "time": "1 day"
      },
      {
        "remarks": "A new course is here! Come and try sonam",
        "created_at": "2022-11-15T07:38:45.438Z",
        "notify_type": "New course is released",
        "time": "1 day"
      },
      {
        "remarks": "A new course is here! Come and try test course",
        "created_at": "2022-11-15T07:36:02.239Z",
        "notify_type": "New course is released",
        "time": "1 day"
      },
      {
        "remarks": "A new course is here! Come and try New course arrived",
        "created_at": "2022-11-15T07:30:48.901Z",
        "notify_type": "New course is released",
        "time": "1 day"
      },
      {
        "remarks": "A new course is here! Come and try pencil",
        "created_at": "2022-11-15T07:30:35.381Z",
        "notify_type": "New course is released",
        "time": "1 day"
      },
      {
        "remarks": "A new course is here! Come and try new pen add",
        "created_at": "2022-11-15T07:26:35.013Z",
        "notify_type": "New course is released",
        "time": "1 day"
      },
      {
        "remarks": "A new course is here! Come and try efefee",
        "created_at": "2022-11-14T10:33:42.682Z",
        "notify_type": "New course is released",
        "time": "2 days"
      },
      {
        "remarks": "sdcd course is available for study",
        "created_at": "2022-11-14T10:18:22.819Z",
        "notify_type": null,
        "time": "2 days"
      },
      {
        "remarks": "zdsccas course is available for study",
        "created_at": "2022-11-14T10:13:40.212Z",
        "notify_type": null,
        "time": "2 days"
      },
      {
        "remarks": "sdfdssd course is available for study",
        "created_at": "2022-11-14T10:12:45.649Z",
        "notify_type": null,
        "time": "2 days"
      },
      {
        "remarks": "dcsdc course is available for study",
        "created_at": "2022-11-14T10:11:11.393Z",
        "notify_type": null,
        "time": "2 days"
      },
      {
        "remarks": "You've made it to the podium! Congratulations! You are one of the best learners!",
        "created_at": "2022-11-14T06:30:00.594Z",
        "notify_type": null,
        "time": "2 days"
      },
      {
        "remarks": "You've made it to the podium! Congratulations! You are one of the best learners!",
        "created_at": "2022-11-14T06:30:00.568Z",
        "notify_type": null,
        "time": "2 days"
      },
      {
        "remarks": "You've made it to the podium! Congratulations! You are one of the best learners!",
        "created_at": "2022-11-14T06:29:12.478Z",
        "notify_type": null,
        "time": "2 days"
      },
      {
        "remarks": "You've made it to the podium! Congratulations! You are one of the best learners!",
        "created_at": "2022-11-14T06:28:42.455Z",
        "notify_type": null,
        "time": "2 days"
      },
      {
        "remarks": "The course The key stages in grape growing and winemaking\t is downloaded",
        "created_at": "2022-11-14T06:05:47.779Z",
        "notify_type": null,
        "time": "2 days"
      },
      {
        "remarks": "Congratulations! You have finished The types, characteristics and styles of wines from the principal grape varieties and other examples of wines and got 0 point",
        "created_at": "2022-11-09T05:54:49.234Z",
        "notify_type": null,
        "time": "7 days"
      },
      {
        "remarks": " course is available for study",
        "created_at": "2022-11-02T16:07:10.468Z",
        "notify_type": null,
        "time": "14 days"
      },
      {
        "remarks": "Congratulations! You have finished  csvsdv and got 0 point",
        "created_at": "2022-10-19T11:45:47.915Z",
        "notify_type": null,
        "time": "28 days"
      },
      {
        "remarks": " csvsdv course is available for study",
        "created_at": "2022-10-19T11:39:17.583Z",
        "notify_type": null,
        "time": "28 days"
      }
    ]
  }
]


class NotificationModal extends NotificationController {
  handleNotification: any;
  render() {
    const Item = ({ title, handleNotification }: { title: any, handleNotification: any }) => {

      const handleTitle = (type: any) => {
        if (type == "New course is released") {
          return "New course is released"
        } else if (type == "Course finished") {
          return "Course finished!"
        } else if (type == "offering new course") {
          return "Course finished!"
        } else if (type == "New app update is released") {
          return "A new update is released!"
        } else if (type == "download course") {
          return "download course"
        } else if (type == "top 3 in the Leaderboard") {
          return "You've made it to the podium!"
        }
      }

      console.log("this.state.notificationData 00000000000",this.props,this.state)
      return (
        <TouchableOpacity style={{
          flexDirection: 'row',
          marginTop: 10,
          borderBottomWidth: Scale(0.5),
          borderBottomColor: "#F0F0F2",
          borderColor: 'grey',
          justifyContent: 'space-between',
          width: wp('90%'),
          alignSelf: 'center',
          alignItems: 'center',
          paddingVertical: Scale(15)
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: Scale(45), height: Scale(45), borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ECF1F4' }}>
              {
                title.notify_type == "offering new course" && (
                  <Image
                    style={{ width: Scale(20), height: Scale(20) }}
                    source={require('../images/course_finished.png')}
                  />
                )
              }

              {
                // new_course_available
                title.notify_type ==  "New course is released" && (
                  <Image
                    style={{ width: Scale(25), height: Scale(20) }}
                    source={require('../images/new_course_available.png')}
                  />
                )
              }

              {
                title.notify_type == "top 3 in the Leaderboard" && (
                  <Image
                    style={{ width: Scale(22), height: Scale(25) }}
                    source={require('../images/top_leaderboard.png')}
                  />
                )
              }

              {
                title.notify_type == "New app update is released" && (
                  <Image
                  style={{ width: Scale(20), height: Scale(22) }}
                  source={require('../images/new_update_release.png')}
                />
                )
              }
              {/* <Image style={{ width: 20, height: 20 }}
                source={require('../images/ic_password_invisible.png')}
              /> */}
            </View>
            <TouchableOpacity style={{ marginLeft: Scale(15)}} onPress={() => handleNotification(title)}>
           <Text style={{ fontSize: Scale(16), fontWeight: '700', lineHeight: Scale(16), fontFamily: FONTS.Roboto_Regular }}>{handleTitle(title.notify_type)}</Text>
              {/* <Text style={{ fontSize: Scale(12), color: 'grey', fontWeight: '400', width: wp('70%'), lineHeight: Scale(15), marginVertical: Scale(3) ,fontFamily: FONTS.Roboto_Regular}}>{title.remarks}</Text> */}
          <View style={{width:Scale(290)}}>
          <RenderHTML source={{html:title.remarks}}  />
          <Text style={{ fontSize: Scale(10), color: '#B5B2BF', lineHeight: Scale(10), fontWeight: '400',fontFamily: FONTS.Roboto_Regular ,marginTop:Scale(7) }}>{title.time}</Text> 

          </View>
          {/* <WebViewComponent html={title.remarks} /> */}
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={()=>{this.deleteThenotification(title)}}  style={{width:Scale(30),height:Scale(70),alignItems:'center',justifyContent:'center'}}>
            {/* <Text style={{ fontSize: hp('3%'), color: 'grey' }}>x</Text> */}
            <Image
              style={{ width: Scale(8.57), height: Scale(8.57) }}
              source={require('../images/cross.png')}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    }

    // console.log("this ::::",typeof this.state.notificationData)


    this.handleNotification = (remoteMessage: any) => {
      console.log("dd --sssss-----------dddddddd", remoteMessage)
      if (
        remoteMessage?.notify_type == "New course is released" 
      
      ) {

        this.props.navigation.navigate("OverViews",{course_id:remoteMessage?.course_id})
        this.props.CloseModal()
        // this.setState({notificationVisible:false})
      // } else if (remoteMessage?.data?.notify_type == "top 3 in the Leaderboard") {
      //   this.props.navigation.navigate("Leaderboard")
      //   if (this.props.notificationBtn) return false
      // } else if (remoteMessage?.data?.notify_type == "Subscription expires soon") {
      //   this.props.navigation.navigate("Subcription")
      //   if (this.props.notificationBtn) return false
      // } else if (remoteMessage?.data?.notify_type == "offering new course") {
      //   this.props.navigation.navigate("OverViews")
      //   // if (this.props.notificationBtn) return false
      // }
    }
    else if( remoteMessage?.notify_type=="offering new course"){
      console.log("checking whyyyyyyyy noticication",remoteMessage)
      this.props.navigation.navigate("Catalogue")
      this.props.CloseModal()
    }
    else if (remoteMessage?.notify_type == "top 3 in the Leaderboard") {
        this.props.navigation.navigate("Leaderboard")
        this.props.CloseModal()
      }
      else{
        this.props.navigation.navigate("Catalogue")
        this.props.CloseModal()
      }


  }

const {t}:any = this.props;
    return (


      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.notificationBtn}
        onRequestClose={this.props.BackBtnCloseModal}
      >

        <TouchableWithoutFeedback onPress={this.props.CloseModal}>
          {/* <View style={styles.centeredView}></View> */}
       
        <View style={styles.centeredView} >
        <TouchableWithoutFeedback onPress={()=>{return}}>
          <View style={styles.modalView}>
          <View  style={{height:Scale(5),width:Scale(50),borderRadius:Scale(5),backgroundColor:'#ECF1F4',marginTop:Scale(15)}}></View>
     
     {/* <Button title="press" onPress={()=>{this.props.navigation.navigate("Catalogue");console.log("this.props.navigation.navigate",this.props.navigation,)}}/> */}


            <Text style={{ fontSize: hp('3%'), fontWeight: '600', marginTop: 20,fontFamily:FONTS.Explet_SemiBold }}>{t("Notifications")}</Text>
            {
              this.state.notificationData?.length > 0 ? (
                <SectionList
                  sections={this.state.notificationData}
                  keyExtractor={(item, index) => item + index}
                  // renderItem={({ item }) => <Item title={item} />}
                  renderItem={({ item }) => {
                    return (
                      <Item title={item} handleNotification={this.handleNotification} />
                    )
                  }}
                  renderSectionHeader={({ section: { header } }) => (
                    //for the title
                    <View style={{ width: '90%', flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'center', alignSelf: 'center' }}>
                      {
                        this.state.notificationData[0].data.length > 0 && (
                          <>
                            {
                              header == "NEW" && (
                                <View style={{ height: Scale(0.5), width: '37%', backgroundColor: 'grey', borderRadius: 5 }}></View>
                              )
                            }

                            {/* <View style={{ height: .5, width: '20%', borderRadius: 5, backgroundColor: 'grey' }}></View> */}
                            {
                              header == "NEW" && (
                                <Text style={{ width: '30%', textAlign: 'center', fontSize: Scale(12), lineHeight: Scale(12), color: COLORS.grey }}>{t(header)}</Text>
                              )
                            }
                            {
                              header == "NEW" && (
                                <View style={{ height: Scale(.5), width: '37%', backgroundColor: 'grey', borderRadius: 5 }}></View>
                              )
                            }
                          </>
                        )
                      }


                      {
                        this.state.notificationData[1].data.length > 0 && (
                          <>
                            {
                              header == "PREVIOUS NOTIFICATIONS" && (
                                <View style={{ height: Scale(.5), width: '20%', backgroundColor: 'grey', borderRadius: 5 }}></View>
                              )
                            }
                            {
                              header == "PREVIOUS NOTIFICATIONS" && (
                                <Text style={{ width: '65%', textAlign: 'center', fontSize: Scale(12), lineHeight: Scale(12), color: COLORS.grey }}>{t(header)}</Text>
                              )
                            }
                            {
                              header == "PREVIOUS NOTIFICATIONS" && (
                                <View style={{ height: Scale(.5), width: '20%', backgroundColor: 'grey', borderRadius: 5 }}></View>
                              )
                            }
                          </>
                        )
                      }

                      {/* <View style={{ height: .5, width: '20%', backgroundColor: 'grey', borderRadius: 5 }}></View> */}
                    </View>
                  )}
                />
              ) : (
                <View style={styles.centerIconView}>
                  <Text numberOfLines={3} style={styles.noCourseSelectTxt}>{t("NoNotificationFound")}</Text>
                </View>
              )
            }
          </View>
          </TouchableWithoutFeedback>
         <Loader loading={this.state.isLoading} /></View>
       
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',

  },
  modalView: {
    backgroundColor: "white",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    height: hp('85%'),
    borderRadius: 20,
    // justifyContent: 'center',
  },
  noCourseSelectTxt: {
    textAlign: 'center',
    fontSize: Scale(14),
    lineHeight: Scale(14),
    letterSpacing: Scale(0.4),
    color: "#777185",
    maxWidth: Scale(370)

  },
  centerIconView: {
    alignItems: "center",
    justifyContent: 'space-between',
    marginTop: Scale(170),
    height: Scale(255),
  },

});
const mapStateToProps = (state: any) => {
  return {
      notificationState: state.rootReducer.notificationReducer,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
      addNotification: (params:any) => {
          dispatch(addNotification(params))
      },
      removeNotification: () => {
          dispatch(removeNotification())
      },
  }
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(NotificationModal))