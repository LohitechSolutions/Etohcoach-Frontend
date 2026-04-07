// Customizable Area Start
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
  ScrollView,
} from "react-native";
import ThemesController from "./ThemesController";
import styles from "./ThemesScrStyle";
import Scale from "../../../components/src/Scale";
import Loader from "../../../components/src/Loader";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { FONTS } from "../../../framework/src/Fonts";
import { COLORS } from "../../../framework/src/Globals";
import { RFValue } from "react-native-responsive-fontsize";
import { lock, graps } from "./assets";
import Context from "../../../components/src/context/context";
import CircularProgresss from "../../../components/src/Circularprogress";
import { withTranslation } from "react-i18next";
// import {getOfflineAction, updateOfflineData} from "../../../mobile/src/store/actions/OfflineData"
import { connect } from "react-redux"
import { addOfflineData, updateOfflineData, loadingOfflineData } from "../../../mobile/src/store/actions/OfflineData"
import {addSubscription,updateSubscription,cancelSubscription,removeSubscription} from "../../../mobile/src/store/actions/Subscription"
import ModalComponent from "../../../mobile/src/component/ModalComponent";
import { Subscription } from "./assets";
import { CustomNavbarComponentt } from "../../../components/src/Customnavbarcomponent";
class ThemesScr extends ThemesController {
  mylistener: any;
  constructor(props: any) {
    super(props);
  }
  static contextType = Context;

  componentWillUnmount() { }

  renderHeader = () => {
    const { t }: any = this.props;
    return (
      <View>
        <View style={styles.headerView}>
          <Text numberOfLines={1} style={styles.itemHeading}>
            {this.state.course_name}
          </Text>
        </View>
        <Text style={styles.itemStorageName}>{t("Themes")}</Text>
      </View>
    );
  };

  functionToreturnLastDot = (item: any,type:any) => {

    return (
      <View style={styles.completeCourseLine}>
        {this.state.subscription !== 'subscribed' && item?.product_type=="Payable" && type=="mock"? 
        <View style={{ alignItems: 'center' }}>
        <Image style={{...styles.completeIcon,tintColor:'grey'}} source={require('../assets/lock.png')} />
        </View>:
        item?.status == "complete" ?
          <View style={{ alignItems: 'center' }}>
            <View style={styles.completedCourse}>
            </View>
          </View>
          :
          <View style={{ alignItems: 'center' }}>
            <View style={styles.Uncompleted}></View>
          </View>
        }
      </View>)


  }

  renderThemesFltalistCell = (item: any, index: any) => {
    const data = this.state.saveImage[index];
    let imagess: any;
    if (data != undefined) {
      imagess = `data:image/jpg;base64,${data}`
    } else {
      imagess = null;
    }
    // const offlineTheme = this.props?.offlineState?.offlineData.all_themes.filter((singleTheme) => singleTheme.id == item.id)
    // console.log("renderThemeCelldata", data);
    const { t }: any = this.props;
    // console.log(item, "i am in themes flatlist checking item")
    return (
      <View style={styles.listOfThemes}>
        {!this.state.mockExamdata && index == this.state.themes_data.length - 1 ? this.functionToreturnLastDot(item,"theme") : <View style={styles.completeCourseLine}>
          {item?.status == "complete" ?
            <View style={{ alignItems: 'center' }}>
              <View style={styles.completedCourse}>
              </View>
              <View style={styles.completedCourse1}>
              </View>
            </View>
            : this.state.subscription !== 'subscribed' && item?.theme_type === 'Payable' ?
              <View style={{ alignItems: 'center' }}>
                <View style={styles.paidCourse}>
                  <Image source={lock} style={{ height: hp(1.3), width: hp(1.3), tintColor: 'grey' }} />
                </View>
                <View style={styles.Uncompleted1}>

                </View>
              </View>
              :
              <View style={{ alignItems: 'center' }}>
                <View style={styles.Uncompleted}></View>
                <View style={styles.Uncompleted1}></View>
              </View>
          }
        </View>}
        <TouchableOpacity style={styles.themeMainView} onPress={() => {
          if (this.state.subscription !== 'subscribed' && item?.theme_type
            === 'Payable') {
            this.setState({subscriptionModal:true})
            // this.props.navigation.navigate('SubCriptionScreen')
          }
          else {
            console.log(item,"cataloguefive themes")
            this.props.navigation.navigate('CatalogueFive', { theme_id: item?.id, themeIndex: index, course_id: this.props.navigation.state.params.course_id, course_name: this.props.navigation.state.params.course_name })
          }

        }}>
          <ImageBackground style={{ ...styles.themeBackground, opacity: this.state.subscription !== 'subscribed' && item?.theme_type === 'Payable' ? 0.7 : null }} source={this.state.isItOffline ? (item.downloadedPath ? { uri: item.downloadedPath } : require('../assets/graps.jpg')) : (item?.theme_attachment ? { uri: item?.theme_attachment } : require('../assets/graps.jpg'))}>
            {
              this.state.subscription !== 'subscribed' && item?.theme_type === 'Payable' ?

                < View style={{
                  height: Scale(200), width: Scale(330), justifyContent: 'center', backgroundColor: "rgba(0,0,0,0.6)"
                }}>
                  <Image source={lock} style={{ height: hp(2.3), width: hp(2.3), alignSelf: 'center', marginTop: hp(6) }} />
                  <Text style={{ color: COLORS.white, fontFamily: FONTS.Roboto_Medium, fontSize: RFValue(13), textAlign: 'center', marginTop: hp(1) }}>{t("BuyASubscriptionToAccessThisTheme")}</Text>
                </View> : null}

            <View style={styles.courseItem}>
              {item?.status == "complete" ?
                <View style={styles.completionView}>
                  <View style={styles.completeIconView}>
                    <Image style={styles.completeIcon} source={require('../assets/RightIcon.png')} />
                  </View>
                  <Text style={styles.userCompleted}>{t("Complete")}</Text>
                </View>
                : item?.status?.toLowerCase() == "current" ?
                  <View style={styles.completeView}>
                    <Image style={styles.continuePlay} source={require('../assets/playIcon.png')} />
                    <Text style={styles.userCompleted}>{t("Current")}</Text>
                  </View>
                  : this.state.subscription !== 'subscribed' && item?.theme_type
                    === 'Payable' ? <View style={styles.completionView}>
                    {/* <Image style={styles.completeIcon} source={require('../assets/I_vector.png')} /> */}
                    <Text style={styles.userCompleted}>{t("Locked")}</Text>
                  </View> :
                    <View style={styles.completionView}>
                      <Image style={styles.completeIcon} source={require('../assets/I_vector.png')} />
                      <Text style={styles.userCompleted}>{t("NotStarted")}</Text>
                    </View>
              }
              <View style={styles.completView}></View>
              <Image style={styles.completedViewIcon} source={require('../assets/image_lessons.png')} />
              <Text style={styles.userCompleted}>{item?.user_lesson_count}/{item?.lesson_count}</Text>
              <View style={styles.completView}></View>
              <Image style={styles.completedViewIcon} source={require('../assets/image_flash.png')} />
              <Text style={{ fontSize: 13, fontWeight: '700', color: 'white', marginLeft: 5, fontFamily: FONTS.Roboto_Regular }}>{item?.userflashcard}/{item?.totalaflashcard}</Text>
              <View style={styles.completView}></View>
              <Image style={styles.completedViewIcon} source={require('../assets/image_quiz.png')} />
              <Text style={styles.userCompleted}>{item?.usersquize}/{item?.totalquizes}</Text>
            </View>
          </ImageBackground>
          <Text style={styles.themeType}>{t("Theme")} {index + 1}</Text>
          <View style={{ width: '80%', paddingBottom: Scale(10) }}>
            <Text numberOfLines={1} style={styles.themeTitle} >{t(item?.title)}</Text>
          </View>
        </TouchableOpacity>
      </View >
    )
  }



  renderThemesFlatlist = () => {
    return (
      <View >
        <FlatList
          data={this.state.themes_data}
          renderItem={({ item, index }) => this.renderThemesFltalistCell(item, index)}
          extraData={this.state}
          keyExtractor={(item: any) => item.id}
        />
      </View>
    )
  }

  BottomNavigatorCustomComponent = () => {
    const { t }: any = this.props;
    // console.log(this.state, "checking params bugg");
    return (
      <View
        style={{
          width: "100%",
          height:Platform.OS == "ios" &&this.state.deviceModel=="iPhone 12" ||this.state.deviceModel=="iPhone 14 Pro"|| this.state.deviceModel=="iPhone 14"?hp(12): Platform.OS == "ios" ? hp(14) : hp(8),
          flexDirection: "row",
          justifyContent: 'space-between',
          alignItems: "center",
          backgroundColor: COLORS.white,
          paddingTop:Platform.OS!=='ios'?12:Scale(10),
          paddingBottom: Platform.OS == "ios" &&this.state.deviceModel=="iPhone 12" ||this.state.deviceModel=="iPhone 14 Pro"|| this.state.deviceModel=="iPhone 14"?Scale(14) :Platform.OS == "ios"? Scale(60) : Scale(20),
          paddingHorizontal: Scale(30),
        }}
      >
        <TouchableOpacity
          style={{ alignItems: "center", marginTop: Scale(8) }}
          onPress={() => {this.props.navigation.navigate('OverViews', { course_id: this.state.coures_id,course_name:this.state.course_name })}}
        >
          <Image style={{ height: Scale(14), tintColor: 'grey', marginBottom: 8, width: Scale(9) }} source={require("../assets/leftArrow.png")} />

          <Text style={{ color: "grey",fontSize:Scale(13),fontFamily:FONTS.Roboto_Regular }}>{t("Back")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {this.props.navigation.navigate('OverViews', { course_id: this.state.coures_id,course_name:this.state.course_name})}}
          style={{ alignItems: "center" }}
        >
          <Image
            style={{ marginBottom: 3, tintColor: "grey", height: Scale(22), width: Scale(22) }}
            source={require("../assets/overView.png")}
          />
          <Text style={{ color: "grey" ,fontSize:Scale(13),fontFamily:FONTS.Roboto_Regular}}>{t("Overview")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: "center" }}>
          <Image
            style={{ marginBottom: 3, tintColor: "black", height: Scale(22), width: Scale(22) }}
            source={require("../assets/leaderBoard.png")}
          />
          <Text style={{ color: "black",fontSize:Scale(13),fontFamily:FONTS.Roboto_Regular }}>{t("Themes")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Notes",{course_id: this.props.navigation.state.params.course_id})}
          style={{ alignItems: "center" }}
        >
          <Image
            style={{ marginBottom: 2, tintColor: "grey", height: Scale(22), width: Scale(22) }}
            source={require("../assets/notes.png")}
          />
          <Text style={{ color: "grey",fontSize:Scale(13),fontFamily:FONTS.Roboto_Regular }}>{t("Notes")}</Text>
        </TouchableOpacity>
      </View>
    );
  };


  renderMockexamFlatlistContainer = () => {
    return (<View >
      <FlatList
        data={this.state.mockExamdata}
        renderItem={({ item, index }) =>
          this.renderMockexamsFlatlist(item, index)
        }
        extraData={this.state}
        keyExtractor={(item: any) => item.id}
      />
    </View>)
  }

  renderMockexamsFlatlist = (item: any, elem: any) => {
    const { t }: any = this.props;
    let progressData = this.functionCircularpogresscalculation(item.total_count, item.mock_exams[0].attributes.grade_count)
    console.log(item, progressData, "i am item of mock exam")
    let totalItem = item
    //  item=item.attributes
    return (
      <View style={styles.listOfThemes}>
        {this.state.mockExamdata && this.state.mockExamdata.length - 1 !== elem ? <View style={styles.completeCourseLine}>
          {
          this.state.subscription !== 'subscribed' && item?.product_type=="Payable"? 
          
          <View style={{ alignItems: 'center',justifyContent:"center" }}>
          <View style={styles.Uncompleted}>
          <Image style={{...styles.completeIcon,tintColor:'grey',alignSelf:'center',marginTop:Scale(2.5)}} source={require('../assets/lock.png')} />

          </View>
              <View style={styles.mockexamUncompleted1}></View>
          </View>:
          
          item?.status == "complete" ? (
            <View style={{ alignItems: "center" }}>
              <View style={styles.completedCourse}></View>
              <View style={styles.MockexamcompletedCourse1}></View>
            </View>
          ) : (
            <View style={{ alignItems: "center" }}>
              <View style={styles.Uncompleted}></View>
              <View style={styles.mockexamUncompleted1}></View>
            </View>
          )}
        </View> : this.functionToreturnLastDot(item,"mock")}
        <TouchableOpacity
          onPress={() => {
          if(this.state.subscription !== 'subscribed'&&item.product_type=="Payable" )
          {
            this.setState({subscriptionModal:true})
            return
          }

            console.log(
              "gvsdcvjsdvchsdvhdscvhvccvcvh",
              this.props.navigation.state.params
            ),
              this.props.navigation.navigate("OverViews", {
                MockexamDetailsFromThemesScreen: totalItem,
                course_id: this.props.navigation.state.params.course_id
              })
          }}
        >
          <View
            style={{
              ...styles.themeMainView,
              width: Scale(330),
              height: Scale(90),
            }}
          >
            <View
              style={{
                backgroundColor: "#000",
                height: Scale(30),
                alignItems: "center",
                flexDirection: "row",
                width: "100%",
                borderTopEndRadius: Scale(12),
                borderTopLeftRadius: Scale(12)
              }}
            >
              {item?.status == "complete" ? (
                <View style={styles.completionView}>
                  <View style={styles.completeIconView}>
                    <Image
                      style={styles.completeIcon}
                      source={require("../assets/RightIcon.png")}
                    />
                  </View>
                  <Text style={styles.userCompleted}>{t("Complete")}</Text>
                </View>
              ) : item?.status == "current" ? (
                <View style={styles.completeView}>
                  <Image
                    style={styles.continuePlay}
                    source={require("../assets/playIcon.png")}
                  />
                  <Text style={styles.userCompleted}>{t("Current")}</Text>
                </View>
              ) : (
                <View style={styles.completionView}>
                  <Image
                    style={styles.completeIcon}
                    source={require("../assets/I_vector.png")}
                  />
                  <Text style={styles.userCompleted}>{t("NotStarted")}</Text>
                </View>
              )}
            </View>
            <View style={{ marginTop: Scale(5), height: "60%", flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <Text style={styles.themeType}>{t("MockExam")}</Text>
                <Text numberOfLines={1} style={{...styles.themeTitle,width:180}}>{item?.name}</Text>
              </View>
              <View style={{ marginRight: Scale(10), flexDirection: "row", alignItems: 'center' }}>

                <CircularProgresss width={40} progressColor={progressData?.pointscolor} progress={progressData?.progress} fillColor={progressData?.fillColor} pointscolor={progressData?.pointscolor} textColor={progressData?.textColor} pointsText={progressData?.pointsText} totlatext={progressData?.totlatext} isThisSmall={true} />
                {/* <CircularProgresss width={50} progressColor={progressData.pointscolor}  fillColor={progressData.fillColor}  pointscolor={progressData.pointscolor} textColor={progressData.textColor} textColor={progressData.textColor} pointsText={progressData.pointsText} totlatext={progressData.totlatext} /> */}
                <Image source={require('../assets/imagenav_lesson.png')} style={{ height: Scale(25), width: Scale(30), marginLeft: Scale(0), marginBottom: Scale(5) }} />
              </View>

            </View>
          </View>
        </TouchableOpacity>
      </View>

    );
  };




  nodataFound = () => {
    const { t }: any = this.props;
    return (
      <View style={{ alignSelf: 'center', flex: 1, justifyContent: 'center' }}>
        <Text style={{ fontFamily: FONTS.Roboto_Regular, fontSize: 17 }}>
          {t("NoDataFound")}
        </Text>

      </View>
    )
  }

  render() {
    const { t }: any = this.props;
    if (this.state.isLoading) {
      return <Loader loading={this.state.isLoading} />;
    }

    return (
      <>
        <SafeAreaView style={styles.mainContainer}>
          {this.renderHeader()}
          {(this.state.themes_data?.length === 0 || this.state.themes_data === undefined) && (this.state.mockExamdata?.length === 0 || this.state.mockExamdata === undefined) ? this.nodataFound() : <ScrollView>
            {this.state.themes_data?.length > 0 && this.renderThemesFlatlist()}
            {this.renderMockexamFlatlistContainer()}
          </ScrollView>}
          <CustomNavbarComponentt deviceModel={this.state.deviceModel}tintpage={"themes"} backfunction={() => {this.props.navigation.navigate('OverViews', { course_id: this.state.coures_id,course_name:this.state.course_name })}} overviewfunction={() => {this.props.navigation.navigate('OverViews', { course_id: this.state.coures_id,course_name:this.state.course_name })}} themesfunction={()=>{}} notesfunction={() => this.props.navigation.navigate("Notes",{course_id: this.props.navigation.state.params.course_id})}  />
        </SafeAreaView>
        <ModalComponent
                    visible={this.state.subscriptionModal}
                    closeModal={() => this.setState({ subscriptionModal: false })}
                    cancel={t("CANCEL")}
                    logout={t("DETAILS")}
                    heding={t("SubscriptionNeeded")}
                    discription={
                        t("BuyASubScriptionPlanToUnlockAllContent")}
                    paddingHorizontal={hp(1)}
                    height={hp(55)}
                    imageIcon={true}
                    image={Subscription}
                    modalType="DEL"
                    headerHorizontal={1}
                    tintcolor={COLORS.lightRed}
                    confirmBtn={() => { 
                      
                      this.setState({ subscriptionModal: false });
                      if(this.state.isItOffline){
                        this.props.navigation.navigate('NoInternet',{showHeader:true,from:'subscription'})
                      }else{
                   this.props.navigation.navigate('SubCriptionScreen',{isItfromlessonOrtheme:true})}}
                  }
                      
        
                />
      </>
    );
  }
}
const mapStateToProps = (state: any) => {
  return {
    subscriptionState : state.rootReducer.subscriptionReducer,
    offlineState: state.rootReducer.offlineReducer
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    addOfflineData: (params:any) => {
      dispatch(addOfflineData(params))
    },
    updateOfflineData: (params:any) => {
      dispatch(updateOfflineData(params))
    },
    loadingOfflineData: (params:any) => {
      dispatch(loadingOfflineData(params))
    },
    addSubscription : (params:any) => {
      dispatch(addSubscription(params))
    }, 
    removeSubscription : () => {
      dispatch(removeSubscription())
    }
  }
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ThemesScr));
 // Customizable Area End