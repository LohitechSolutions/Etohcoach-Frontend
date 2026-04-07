import React from "react";

import {
  StyleSheet,
  Text,
  View,
  Platform,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  // Customizable Area Start
  // Customizable Area End
} from "react-native";
import { RFPercentage as rf } from "react-native-responsive-fontsize";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { FONTS } from "../../../framework/src/Fonts";
import { COLORS } from "../../../framework/src/Globals";
import { rewardIcon, rightArrow } from "./assets";
import Icon from "react-native-vector-icons/FontAwesome";
import Context from "../../../components/src/context/context";

import NotesController, {
  Props,
  configJSON,
} from "./NotesController";
import Scale from "../../../components/src/Scale";
import Loader from "../../../components/src/Loader";
import { withTranslation } from "react-i18next";
import { t } from "i18next";
import { addOfflineData, loadingOfflineData, removeOfflineAPIS, updateOfflineData } from "../../../mobile/src/store/actions/OfflineData";
import { addSubscription, removeSubscription,cancelSubscription, updateSubscription } from "../../../mobile/src/store/actions/Subscription";
import { addUserProfile,removeUserProfile } from "../../../mobile/src/store/actions/UserProfile";
import { connect } from 'react-redux';
import { CustomNavbarComponentt } from "../../../components/src/Customnavbarcomponent";

class Notes extends NotesController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  static contextType = Context;
  // Customizable Area End


  renderList(item: any) {
    const {t}:any = this.props;
    return (
      <TouchableOpacity onPress={() => { 
        
        if(this.state.isItOffline){
          this.setState({selectedIndex:item.item.attributes.lesson_id}) 
          this.offlineCourseRedirection(item.item,item.item.attributes.lesson.data.attributes.theme_id)
        }else{
          this.setState({selectedIndex:item.item.attributes.lesson_id,showLodar:true}) 
        ;this.getLessonCourseData(item.item.attributes.lesson.data.attributes.theme_id) 
      } 
        }}>
        <View style={{ borderWidth: hp(0.2), borderRadius: hp(2), borderColor: '#F0F0F2', marginTop: hp(2) }}>
          <View style={styles.noteIcon}>
            <Image source={rewardIcon} style={styles.rewardIcon} />
            <Text style={styles.AnnotationsText} >{t("Annotations")}</Text>
            {item?.item?.attributes?.comment !== "" ?
              <>
                <Icon name={'square'}
                  size={3}
                  color={COLORS.white}
                  style={{ marginLeft: wp(2) }}
                />
                <Text style={styles.AnnotationsText}>{t("Comment")}</Text>
              </>
              : null}
          </View>


          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ marginLeft: wp(3), marginTop: hp(1) }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: rf(1.7), fontFamily: FONTS.Roboto_Medium, color: '#777185' }}>{item?.item?.attributes?.lesson?.data?.attributes?.theme_name + " "} {t("theme")} </Text>
                <Icon name={'square'}
                  size={3}
                  color={'#777185'}
                  style={{ marginLeft: wp(2) }}
                />
                <Text style={{ fontSize: rf(1.7), fontFamily: FONTS.Roboto_Medium, color: '#777185', marginLeft: wp(2) }}>{t("Lesson")} {item?.item?.attributes?.lesson?.data?.attributes?.lesson_index} </Text>
              </View>
<View style={{width:Scale(320)}}>
              <Text style={styles.courceName}  numberOfLines={2}>{item?.item?.attributes?.lesson?.data?.attributes?.title}</Text></View>
            </View>
            <View style={{ marginRight: wp(4) }}>
              <Image source={rightArrow} style={styles.backArrow} />
            </View>
          </View>

          {item?.item?.attributes?.comment !== "" ?
            <>
              < View style={{ borderBottomWidth: 1, width: '93%', alignSelf: 'center', marginVertical: hp(1), borderBottomColor: '#F0F0F2' }} />
              <View style={{ marginHorizontal: wp(3) }}>
                {/* <Text style={styles.commentTxt}>{t("MyComment")}</Text> */}
                <Text style={styles.commentDesc}>{item?.item?.attributes?.comment}</Text>
              </View>
            </> : null

          }
        </View>
      </TouchableOpacity>
    )


  }

  

  BottomNavigatorCustomComponent = () => {
    const { t }: any = this.props;
    return (
        <View style={{
            width: '100%', height:Platform.OS == 'ios'&& this.state.deviceModel=="iPhone 12" ||this.state.deviceModel=="iPhone 14 Pro"|| this.state.deviceModel=="iPhone 14"? hp(14):hp(12), flexDirection: 'row',  justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white',
            paddingBottom: Platform.OS == 'ios'&&  this.state.deviceModel=="iPhone 12" ||this.state.deviceModel=="iPhone 14 Pro"|| this.state.deviceModel=="iPhone 14" ? Scale(10):Platform.OS == 'ios'?Scale(65) : Scale(10),
            paddingHorizontal:Scale(30)
        }}>

            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => this.props.navigation.goBack()}>
                <Image style={{ height: Scale(14), tintColor: 'grey', marginBottom: 8, width: Scale(9) }} source={require("../assets/leftArrow.png")} />
                <Text style={{ color: 'grey',fontSize:Scale(13) ,fontFamily:FONTS.Roboto_Regular}} >
                    {t("Back")}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={() => {
              this.setState({islessomunmounted:true});
              // console.log('course detail',this.state.courseId,this.state.courceName)
              this.props.navigation.navigate('OverViews', { course_id: this.state.courseId,course_name:this.state.courceName })
            }} 
            style={{ alignItems: "center" }}>
                <Image
                    style={{ marginBottom: 2, tintColor: "grey", height: Scale(22), width: Scale(22) }}
                    source={require("../assets/overView.png")}
                />
                <Text style={{ color: 'grey',fontSize:Scale(13) ,fontFamily:FONTS.Roboto_Regular }}>
                    {t("Overview")}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => { this.props.navigation.navigate("Themes", { course_id: this.state?.courseId,course_name:this.state.courceName }) }}>
            <Image
        style={{ marginBottom: 3, tintColor: "grey", height: Scale(22), width: Scale(22) }}
        source={require("../assets/leaderBoard.png")}/>        
                   <Text style={{ color: 'grey' ,fontSize:Scale(13) ,fontFamily:FONTS.Roboto_Regular}}>
                    {t("Themes")}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={() => {this.setState({islessomunmounted:true});this.props.navigation.navigate("Notes")}} style={{ alignItems: "center" }}>
            <Image
        style={{ marginBottom: 2, tintColor: "black", height: Scale(22), width: Scale(22) }}
        source={require("../assets/notes.png")}
      />
                <Text style={{ color: 'black',fontSize:Scale(13) ,fontFamily:FONTS.Roboto_Regular }}>
                    {t("Notes")}
                </Text>
            </TouchableOpacity>
        </View>
    )
}



  customNavbarComponent = () => {
    const {t}:any = this.props;
    return (
        <View style={{
            width: '100%', height: hp(7.5), flexDirection: 'row', justifyContent: 'space-between',backgroundColor:"",
            marginBottom:Platform.OS != 'ios' ? Scale(35):Platform.OS == 'ios'&& this.state.deviceModel=="iPhone 12" ||this.state.deviceModel=="iPhone 14 Pro"|| this.state.deviceModel=="iPhone 14" ?-13:18,
            paddingTop: Platform.OS != 'ios' ? 20 : Scale(10),
            paddingHorizontal:Scale(30)
        }}>
            <TouchableOpacity style={{ alignItems: "center",marginTop:Scale(4) }} onPress={() => this.props.navigation.goBack()}>
                <Image style={{ height: Scale(14), tintColor: 'grey', marginBottom: 8 ,width:Scale(9)}} source={require("../assets/leftArrow.png")} />

                <Text style={{ color: 'grey',fontFamily:FONTS.Roboto_Regular,fontSize:Scale(13) }} >
                {t("Back")}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: "center" }} onPress={()=>{this.props.navigation.navigate("OverViews",{course_id:this.state.courseId})}}   >
                <Image style={{ marginBottom:Scale(4)  ,height:Scale(22),width:Scale(22),tintColor:"black"} }source={require("../assets/overView.png")} />
                <Text style={{fontFamily:FONTS.Roboto_Regular,fontSize:Scale(13) }} >
                { t("Overview")}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { this.props.navigation.navigate("Themess", { course_id: this.props?.navigation?.state?.params?.course_id || this.state?.course_id }) }} style={{ alignItems: "center" }}>
                <Image style={{ marginBottom: Scale(4), tintColor: 'grey',height:Scale(22),width:Scale(22) }} source={require("../assets/leaderBoard.png")} />
                <Text style={{ color: 'grey',fontFamily:FONTS.Roboto_Regular,fontSize:Scale(13)  }}>
                { t("Themes")}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.state?.course_Details?.status != "not started" && this.props.navigation.navigate("Notes")} style={{ alignItems: "center" }}>
                <Image style={{ marginBottom: Scale(4), tintColor: 'grey',height:Scale(22),width:Scale(22) }} source={require("../assets/notes.png")} />
                <Text style={{ color: 'grey',fontFamily:FONTS.Roboto_Regular ,fontSize:Scale(13) }}>
                { t("Notes")}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

// Customizable Area Start
render() {
  const {t}:any = this.props;
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <Loader loading={this.state.showLodar} />
        <View style={{ flex: 1, marginHorizontal: wp(5), marginTop: hp(2) }}>
          <Text style={styles.headerCourceName} numberOfLines={1}>{this.state.courceName}</Text>
          <View style={styles.hederNameView}>
            <Text style={styles.headerName}>{t("Annotations")}</Text>
          </View>

      <View>
      { this.state.noteData.length!==0? <FlatList
          data={this.state.noteData}
          renderItem={(item: any) => this.renderList(item)} />:<View style={{justifyContent:'center',alignItems:'center',height:'90%'}}>
            <Text style={{fontFamily:FONTS.Roboto_Regular,fontSize:18}} >{t("No annotations found")}</Text>
            </View>
}
          </View>
        </View>
<CustomNavbarComponentt deviceModel={this.state.deviceModel} tintpage={"notes"} backfunction={() => this.props.navigation.goBack()} overviewfunction={()=>{this.props.navigation.navigate("OverViews",{course_id:this.state.courseId})}} themesfunction={ ()=>{this.props.navigation.navigate("Themes", { course_id: this.props?.navigation?.state?.params?.course_id || this.state?.course_id }) }} notesfunction={() => {this.state?.course_Details?.status != "not started" && this.props.navigation.navigate("Notes")}} />
      </SafeAreaView>
    </>

);
}
}
 // Customizable Area End
// Customizable Area Start
const styles = StyleSheet.create({
  hederNameView: {
    marginTop: hp(0.5)
  },
  headerName: {
    fontSize: rf(5),
    fontFamily: FONTS.Roboto_Bold,
    fontWeight: '500'
  },
  noteIcon: {
    backgroundColor: COLORS.black10,
    borderTopRightRadius: hp(2),
    borderTopLeftRadius: hp(2),
    flexDirection: 'row',
    alignItems: 'center',
    padding: hp(0.5)

  },
  courceName: {
    fontFamily: FONTS.Roboto_Bold,
    fontSize: rf(2.5)
  },
  backArrow: {
    height: hp(4.5),
    width: hp(3),

  },
  rewardIcon: {
    height: hp(1.7),
    width: hp(1.7),
    marginLeft: wp(4)
  },
  AnnotationsText: {
    color: 'white',
    marginLeft: wp(1.7),
    fontFamily: FONTS.Roboto_Regular,
    fontSize: rf(1.7),
    fontWeight: '700'
  },
  commentTxt: {
    fontFamily: FONTS.Roboto_Regular,
    color: '#777185',
    fontSize: rf(1.7),
    fontWeight: '400'
  },
  commentDesc: {
    fontFamily: FONTS.Roboto_Medium,
    fontSize: rf(2),
    marginBottom: hp(1.2)
  },
  headerCourceName: {
    width: wp(90),
    color: '#777185',
    fontSize: rf(1.7),
    fontFamily: FONTS.Roboto_Regular
  }
});


const mapStateToProps = (state : any) => {
  return {
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

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Notes));
// Customizable Area End
