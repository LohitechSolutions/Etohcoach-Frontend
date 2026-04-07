// Customizable Area Start
import React from 'react';
import { ActivityIndicator, FlatList, Image, ImageBackground, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { withTranslation } from "react-i18next";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { connect } from 'react-redux';
import HeaderComponent from "../../../components/src/HeaderComponent";
import Loader from "../../../components/src/Loader";
import NotificationModal from "../../../components/src/NotificationModal";
import Scale from "../../../components/src/Scale";
import Context from "../../../components/src/context/context";
import { FONTS } from "../../../framework/src/Fonts";
import { COLORS } from "../../../framework/src/Globals";
import { addOfflineData, loadingOfflineData, removeOfflineAPIS, updateOfflineData } from "../../../mobile/src/store/actions/OfflineData";
import { addSubscription, removeSubscription,cancelSubscription, updateSubscription } from "../../../mobile/src/store/actions/Subscription";
import { addUserProfile,removeUserProfile } from "../../../mobile/src/store/actions/UserProfile";
import OverlayView from "../../Leaderboard/Components/OverlayView";
import DashboardController, { Props } from "./DashboardController";
import styles from "./DashboardStyle";
import { rightArrow, trial } from "./assets";
import LottieView from 'lottie-react-native';

class Dashboard extends DashboardController {
  constructor(props: Props) {
    super(props);
  }

  static contextType = Context;

  renderHeader = () => {
    return (
      <View style={{ justifyContent: "center" }}>
        <HeaderComponent
          onPress={() => this.setState({ notificationBt: true })}
          count={this.state.notificationUnreadCount}
        />
      </View>
    )
  }



  renderDrinkstatus=(drinktype:any,total_courses:any,user_courses:any)=>{
    const { t }: any = this.props;
    console.log(  this.state?.dashboardData?.drinks_types,"this.state?.dashboardData?.drinks_types")


  if(drinktype=="Wine")
  {
return( <View style={styles.progresListItem}>
    <Image style={styles.itemImage} source={require("../assets/image_wine.png")} />
    <View style={styles.pointView}>
      <Text numberOfLines={1} style={styles.pointOut}>{this.state.dashboardData?.user_wine_course}</Text>
      <Text numberOfLines={1} style={styles.poinrtOutIn}>/{this.state.dashboardData?.total_wine_course}</Text>
    </View>
    <Text numberOfLines={1} style={styles.wineTxt}>{t("Wine")}</Text>
  </View>)

  }
  else if(drinktype=="Spirits")
  {
    return(<View style={styles.progresListItem}>
          <Image style={styles.itemImage} source={require("../assets/image_spirits.png")} />
          <View style={styles.pointView}>
            <Text numberOfLines={1} style={styles.pointOut}>{this.state.dashboardData?.user_spritis_course}</Text>
            <Text numberOfLines={1} style={styles.poinrtOutIn}>/{this.state.dashboardData?.total_spritis_course}</Text>
          </View>
          <Text numberOfLines={1} style={styles.wineTxt}>{t("Spirits")}</Text>
        </View>)
  }
  else if(drinktype=="Beer")
  {
    return(  <View style={styles.progresListItem}>

<Image style={styles.itemImage} source={require("../assets/image_beer.png")} />

<View style={styles.pointView}>
 <Text numberOfLines={1} style={styles.pointOut}>{this.state.dashboardData?.user_beer_course}</Text>
 <Text numberOfLines={1} style={styles.poinrtOutIn}>/{this.state.dashboardData?.total_beer_course}</Text>
</View>
<Text numberOfLines={1} style={styles.wineTxt}>{t("Beer")}</Text>
</View>)
  }
else{
  return(<View style={styles.progresListItem}>
<Image style={styles.itemImage} source={require("../assets/image_spirits.png")} />
<View style={styles.pointView}>
 <Text numberOfLines={1} style={styles.pointOut}>{user_courses}</Text>
 <Text numberOfLines={1} style={styles.poinrtOutIn}>/{total_courses}</Text>
</View>
<Text numberOfLines={1} style={styles.wineTxt}>{drinktype}</Text>
</View>)
}
  }



  renderMyProgress = () => {
    console.log(this.state, "reward_points_dashboard");
    const { t }: any = this.props;
    return (
      <View style={{ marginTop: Scale(15) }}>
        <View style={styles.progressView}>
          <Text numberOfLines={1} style={styles.progressTxt}>{t("MY PROGRESS")}</Text>
          <TouchableOpacity style={styles.rewardView} onPress={() => { console.log(this.state.dashboardData), this.setState({ overlay_bt: true }) }}>
            <Text style={styles.rewardTxt}>{this.state.dashboardData?.reward_point}</Text>
            <Image style={styles.rewardImage} source={require("../assets/imagenav_reward.png")} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal={true}  >
          <View style={{ flexDirection: 'row', marginTop: Scale(10) }}>
            {this.state.dashboardData?.drinks_types?.map(({ drinktype, total_courses, user_courses }) => this.renderDrinkstatus(drinktype, total_courses, user_courses))}
          </View>
        </ScrollView>
      </View>
    )
  }



  // renderMyProgress = () => {
  //   // console.log(this.state.dashboardData?.reward_point, "reward_points_dashboard");
  //   const { t }: any = this.props;
  //   return (
  //     <View style={{ marginTop: Scale(15) }}>
  //       <View style={styles.progressView}>
  //         <Text numberOfLines={1} style={styles.progressTxt}>{t("MY PROGRESS")}</Text>
  //         <TouchableOpacity style={styles.rewardView} onPress={() => { console.log(this.state.dashboardData), this.setState({ overlay_bt: true }) }}>
  //           <Text style={styles.rewardTxt}>{this.state.dashboardData?.reward_point}</Text>
  //           <Image style={styles.rewardImage} source={require("../assets/imagenav_reward.png")} />
  //         </TouchableOpacity>
  //       </View>
  //       <View style={styles.progresListMainView}>
  //         <View style={styles.progresListItem}>
  //           <Image style={styles.itemImage} source={require("../assets/image_wine.png")} />
  //           <View style={styles.pointView}>
  //             <Text numberOfLines={1} style={styles.pointOut}>{this.state.dashboardData?.user_wine_course}</Text>
  //             <Text numberOfLines={1} style={styles.poinrtOutIn}>/{this.state.dashboardData?.total_wine_course}</Text>
  //           </View>
  //           <Text numberOfLines={1} style={styles.wineTxt}>{t("Wine")}</Text>
  //         </View>
  //         <View style={styles.progresListItem}>
  //           <Image style={styles.itemImage} source={require("../assets/image_beer.png")} />
  //           <View style={styles.pointView}>
  //             <Text numberOfLines={1} style={styles.pointOut}>{this.state.dashboardData?.user_beer_course}</Text>
  //             <Text numberOfLines={1} style={styles.poinrtOutIn}>/{this.state.dashboardData?.total_beer_course}</Text>
  //           </View>
  //           <Text numberOfLines={1} style={styles.wineTxt}>{t("Beer")}</Text>
  //         </View>
  //         <View style={styles.progresListItem}>
  //           <Image style={styles.itemImage} source={require("../assets/image_spirits.png")} />
  //           <View style={styles.pointView}>
  //             <Text numberOfLines={1} style={styles.pointOut}>{this.state.dashboardData?.user_spritis_course}</Text>
  //             <Text numberOfLines={1} style={styles.poinrtOutIn}>/{this.state.dashboardData?.total_spritis_course}</Text>
  //           </View>
  //           <Text numberOfLines={1} style={styles.wineTxt}>{t("Spirits")}</Text>
  //         </View>
  //       </View>
  //     </View>

  //   )
  // }

  renderCenterIcon = () => {
    const { t }: any = this.props;
    return (
      <View style={styles.centerIconView}>
        <Image style={styles.centerIconImage} source={require("../assets/image_empty.png")} />
        <Text style={styles.selectTxt}>{t("SELECTACOURSE")}</Text>
        <Text numberOfLines={3} style={styles.noCourseSelectTxt}>{t("YouHaveNoActive")}</Text>
        <TouchableOpacity style={styles.catalogueTouch} onPress={() => this.props.navigation.navigate("Catalogue")}>
          <Text style={styles.catalogueTxt}>{t("GOTOCATALOGUE")}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderContinueCourseFlatlist = () => {
    const { t }: any = this.props;
    return (
      <View style={{ marginTop: Scale(10) }}>
        {this.state.dashboardData?.user_in_progress_courses &&
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center', paddingRight: Scale(20) }}>
            <Text numberOfLines={1} style={ styles.courseContinueTxt}>{t("CONTINUE WITH YOUR COURSE")}</Text>
            {<TouchableOpacity onPress={() => { this.setState({ seeAllContinue:! this.state.seeAllContinue }) }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: FONTS.Roboto_Regular, color: COLORS.darkGray }}>{!this.state.seeAllContinue? t("See all") : t("See less") }</Text>

                <Image resizeMode='cover' style={{ height: Scale(25), width: Scale(25) }} source={require('../assets/rightArrow.png')} />

              </View>
            </TouchableOpacity>}
          </View>
        }
        {(!this.state.seeAllContinue ? this.functionToReturnContinueCourses() : this.state.dashboardData?.user_in_progress_courses).map((elem: any, idx: number) => this.renderCourseContinueCell(elem, idx))}

      </View>
    )
  }

  renderCourseContinueCell = (item: any, idx: number) => {
    const { t }: any = this.props;
    console.log("user progresss dashboard",item)
    return (
      <TouchableOpacity style={styles.courseList} onPress={() => this.CourceNavigate(item,idx)}>
        {this.state.isItOffline ? 
        (<ImageBackground imageStyle={{ borderRadius: Scale(10) }} style={styles.itemImageIcon}
        source={item?.downloadedPath ?  {uri : item?.downloadedPath} : require("../assets/natureImage.jpeg")}>
          <TouchableOpacity style={styles.downloadView}>
            <Image style={styles.downloadImage} source={require('../assets/OfflineDownload.png')} />
          </TouchableOpacity>
        </ImageBackground>)
        : 
        (<ImageBackground imageStyle={{ borderRadius: Scale(10) }} style={styles.itemImageIcon}
          source={item?.course_attachment ? { uri: item?.course_attachment } : require("../assets/natureImage.jpeg")}>
          <TouchableOpacity style={styles.downloadView}>
            <Image style={styles.downloadImage} source={require('../assets/OfflineDownload.png')} />
          </TouchableOpacity>
        </ImageBackground>) }
        <View style={styles.dataView}>
          <View style={styles.itemView}>
            <Text numberOfLines={1} style={styles.aboutItem}>{t(item?.drink_type)}</Text>
            <View style={styles.dotStyle} />
            <Text numberOfLines={1} style={styles.aboutItem}>{item?.certificate}</Text>
            <View style={styles.dotStyle} />
            <Text numberOfLines={1} style={styles.aboutItem}>{item?.language_type}</Text>
            <Image style={styles.flagStyle} source={require("../assets/uk_Flag.jpeg")} />
          </View>
          <Text numberOfLines={1} style={styles.headingTxt}>{item?.course_name}</Text>
          <Text numberOfLines={3} style={styles.itemDescription}>{item?.description}</Text>
          <View style={styles.rewardView1}>
            <Image style={styles.rewardImage1} source={require('../assets/imagenav_reward.png')} />
            <Text style={styles.rewardget}>{item?.user_completed_point}/{item?.course_total_point}</Text>
            <View style={styles.dotRewardView}></View>
            <Image style={styles.rewardImage1} source={require('../assets/image_lessons.png')} />
            <Text style={styles.rewardPoint}>{item?.user_theme_count}/{item?.themes_count}</Text>
          </View>
          <View style={styles.perMainView}>
            <View style={styles.percentageView}>
              <View style={{ width: JSON.stringify(item?.user_course_percentage) + '%', height: Scale(4), borderRadius: Scale(2), backgroundColor: '#F28E3A' }}></View>
            </View>
            <Text style={styles.percentageTxt}>{item?.user_course_percentage}%</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderCompleteCourseFLatlist = () => {
    const { t }: any = this.props;
    return (
      <View style={{ alignItems: 'center' }}>
        <View style={{ ...styles.completeCourseListView, flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
          <Text style={styles.completedCourseTxt} >{t("COMPLETEDCOURSES")}</Text>
         { <TouchableOpacity onPress={()=>{this.setState({seeAllcompleted:!this.state.seeAllcompleted})}}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: FONTS.Roboto_Regular, color: COLORS.darkGray }}>{!this.state.seeAllcompleted?t("See all"):t("See less")}</Text>
            <Image resizeMode='cover' style={{ height: Scale(25), width: Scale(25) }} source={require('../assets/rightArrow.png')} />

          </View>
          </TouchableOpacity>}
        </View>
        <FlatList style={{ marginTop: 10 }}
          data={this.seeAllCompletedCourses()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => this.renderCompleteCourseFLatlistCell(item)}
        />
      </View>
    )
  }

  renderCompleteCourseFLatlistCell = (item: any) => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.state.isItOffline?this.props.navigation.navigate('NoInternet',{showHeader:false}) :this.props.navigation.navigate("OverViews", { course_id: item?.id })
        }
        style={styles.completeView}>
        <ImageBackground style={styles.itemBackground}
          source={item?.course_attachment ? { uri: item?.course_attachment } : require("../assets/natureImage.jpeg")}
        >
          <View style={{ ...styles.completeListView }}>
            <Image style={styles.checkImage} source={require("../assets/image_check.png")} />
            <Text style={styles.courseCompletionTxt}>{item?.user_course_percentage}</Text>
            <View style={styles.dotView} />
            <Image style={styles.rewardIcon} source={require("../assets/imageReward.png")} />
            <Text style={styles.userRewardCount}>{item?.user_completed_point}/{item?.course_total_point}</Text>
            <View style={styles.dotView} />
            <Image style={styles.lessonImage} source={require("../assets/imagelessons2.png")} />
            <Text style={styles.userTotalPointTxt}>{item?.user_theme_count}/{item?.themes_count}</Text>
          </View>
        </ImageBackground>
        <View style={styles.completeCOurseDetailView}>
          <View style={styles.typeAndDescriptionView}>
            <View style={styles.typeAndDescriptionView}>
              <Text numberOfLines={1} style={styles.itemName}>{item?.drink_type}</Text>
              <View style={styles.dotStyle} />
              <Text numberOfLines={1} style={styles.aboutItem}>{item?.certificate}</Text>
              <View style={styles.dotStyle} />
              <Text numberOfLines={1} style={styles.aboutItem}>{item?.language_type}</Text>
              <Image style={styles.flagStyle} source={require("../assets/uk_Flag.jpeg")} />
            </View>
          </View>
          <View>
            <Text numberOfLines={2} style={styles.headingTxt}>{item?.course_name}</Text>
          </View>
          <View>
            <Text numberOfLines={2} style={styles.itemDetail}>{item?.description}</Text>
          </View>

        </View>
      </TouchableOpacity>
    )
  }

  renderAllCourseCompleted = () => {
    const { t }: any = this.props;
    return (
      <View>
        {!this.state.hideComplete && this.state.dashboardData.all_courses_completed ? <View style={styles.allCourseView}>
          <ImageBackground resizeMode={'cover'} style={styles.completeProductImage} source={require('../assets/image_complete.png')} >
            <TouchableOpacity style={styles.hideView}
              onPress={() => this.setState({ hideComplete: true })}
            >
              <Text style={styles.hideTxt}>{t("Hide")}</Text>
            </TouchableOpacity>
          </ImageBackground>
          <Text style={styles.allCourseTxt}>{t("ALLCOURSESCOMPLETE")}</Text>
          <Text numberOfLines={2} style={styles.congratulationTxt}>{t("CongratulationsYouHaveCompletedAllCourse")}</Text>
        </View> : <></>}
      </View>
    )
  }


  renderCondiotionalCourseDisplayInDashboard = () => {
    // console.log('offline state',this.state.isItOffline,JSON.stringify(this.props.offlineState.offlineData))
    // console.log(this.state.dashboardData?.user_in_progress_courses, this.state.dashboardData?.user_completed_courses?.length, "aaaaaaassdddaa")
    if(this.state.isItOffline && this.props.offlineState?.offlineData==undefined ){
      return this.renderCenterIcon()
    }
    if(this.state.isItOffline && this.props.offlineState?.offlineData?.user_in_progress_courses.length==0 && this.props.offlineState?.offlineData?.user_completed_courses.length==0){
      return this.renderCenterIcon()
    }
    if (this.state.dashboardData?.user_in_progress_courses?.length == 0 && this.state.dashboardData?.user_completed_courses?.length != 0) {
      return this.renderAllCourseCompleted()
    }
    if (this.state.dashboardData?.user_in_progress_courses?.length > 0) {
      return this.renderContinueCourseFlatlist()
    }
    if (this.state.dashboardData?.user_in_progress_courses?.length == 0 && this.state.dashboardData?.user_completed_courses?.length == 0) {
      return this.renderCenterIcon()
    }
   
    
  }

  render() {
    
    const { t, state }: any = this.props;
    return (
      //Merge Engine DefaultContainer
      <SafeAreaView style={styles.mainContianer}>
        {this.renderHeader()}
        {/* <View>
          <Text style={styles.allCourseTxt}>Harshal</Text>
        </View> */}
        {/* <Button title="congo" onPress={()=>{this.props.navigation.navigate("Congratulation",{course_id:108})}} /> */}
        <View style={{ backgroundColor: 'white', flex: 1 }}>
          <OverlayView
            RewardPoint={this.state.dashboardData?.reward_point}
            overlay={this.state.overlay_bt}
            onPress={() => { return this.setState({ overlay_bt: false }), this.props.navigation.navigate('Leaderboard') }}
            onRequestclose={() => this.setState({ overlay_bt: !this.state.overlay_bt })}
            onTapClose={() => this.setState({ overlay_bt: false })
            }
          />

          

          {this.renderMyProgress()}
          <ScrollView>
            {this.renderCondiotionalCourseDisplayInDashboard()}
            {this.state.dashboardData?.user_completed_courses?.length > 0 && this.renderCompleteCourseFLatlist()}
          </ScrollView>
          {/* {this.state.dashboardData?.user_in_progress_courses?.length > 0 || this.state.dashboardData?.user_completed_courses?.length? this.renderContinueCourseFlatlist() : this.renderCenterIcon()} */}

          {
            this.state.notificationBt == true && (
              <NotificationModal
                notificationBtn={this.state.notificationBt}
                CloseModal={() => { this.setState({ notificationBt: false }); this.getDashboardData() }}
                BackBtnCloseModal={() => this.setState({ notificationBt: false })}
                navigation={this.props.navigation}
                getDashboardData={this.getDashboardData}
                mystring="aaaaaa"
              />
            )
          }

           

          {!this.state.isItOffline && this.props.offlineState?.offlineData?.downloadPercent > 0 && this.props.offlineState?.offlineData?.downloadPercent < 80 ?

            <TouchableOpacity style={{ backgroundColor: '#EBEFF4', height: hp(6), margin: hp(2), bottom: Scale(55), position: 'absolute', width: '91%', flexDirection: 'row', alignItems: 'center', borderRadius: hp(1.3), justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={trial} style={styles.trialVersionImageContainer} />
                <Text style={[styles.trialVersionTextContainer, { maxWidth: '80%' }]}>
                  {t("Offline downloaded progress")} : {this.props?.offlineState?.offlineData?.downloadPercent === 0 ? "0" : this.props?.offlineState?.offlineData?.downloadPercent}%
                </Text>
              </View>
              <View style={{ position: "absolute", right: 15 }}>
                {this.props.offlineState?.offlineData?.downloadPercent < 80 &&
                  <LottieView
                    source={require('../../../components/images/animation.json')}
                    imageAssetsFolder={'images'}
                    autoPlay
                    loop
                    style={{ height: 10, width: 10 }}
                  />
                }
              </View>
            </TouchableOpacity>
            : null}   
          {String(this.state.subscription).toLowerCase()!== "subscribed" && (this.state.subscription_reciept==''||this.state.subscription_reciept=="null"||this.state.subscription_reciept==undefined)  ?
          
            <TouchableOpacity onPress={() => {this.state.isItOffline ? this.props.navigation.navigate('NoInternet',{showHeader:true,from:'subscription'}) : this.props.navigation.navigate('SubCriptionScreen')}} style={{ backgroundColor: '#EBEFF4', height: hp(6), margin: hp(2), bottom: 0, position: 'absolute', width: '91%', flexDirection: 'row', alignItems: 'center', borderRadius: hp(1.3), justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={trial} style={styles.trialVersionImageContainer} />
                <Text style={styles.trialVersionTextContainer}>
                  {t("This is a trial version of the app.")}
                </Text>
              </View>
              <Image source={rightArrow} style={{ height: hp(4), width: hp(4), marginRight: wp(2) }} />
            </TouchableOpacity> 
            : null} 
        </View>
        <Loader loading={this.state.isLoading} />

      </SafeAreaView>
      //Merge Engine End DefaultContainer
    );
  }
}
const mapStateToProps = (state : any) => {
  return {
    // offlineData : state.rootReducer.offlineReducer
    offlineState  : state.rootReducer.offlineReducer,
    userProfileState:state.rootReducer.userProfileReducer,
    subscriptionState:state.rootReducer.subscriptionReducer
  }
}

const mapDispatchToProps = (dispatch : any) => {
  return {
    addOfflineData : (params:any) => {
      dispatch(addOfflineData(params))
    }, 
    updateOfflineData : (params:any) => {
      dispatch(updateOfflineData(params))
    },
    loadingOfflineData : (params:any) => {
      dispatch(loadingOfflineData(params))
    },
    removeSubscription:()=>{
      dispatch(removeSubscription())
    },
    cancelSubscription:()=>{
      dispatch(cancelSubscription())
    },
    addSubscription:(params:any)=>{
      dispatch(addSubscription(params))
    },
    updateSubscription:(params:any)=>{
      dispatch(updateSubscription(params))
    },
    removeOfflineAPIS:()=>{
      dispatch(removeOfflineAPIS())
    },

    addUserProfile:(params:any)=>{
      dispatch(addUserProfile(params))
    },
    removeUserProfile:()=>{
      dispatch(removeUserProfile())
    },
  }
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
// Customizable Area End
