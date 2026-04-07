import { SCHED_NONE } from "cluster";
import { StyleSheet } from "react-native";
import Scale from "../../../components/src/Scale";
import { FONTS } from "../../../framework/src/Fonts";
import { COLORS } from "../../../framework/src/Globals";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { RFPercentage as rf } from "react-native-responsive-fontsize";
// Customizable Area Start 
// Customizable Area End
export default StyleSheet.create({
  mainContianer: {
    flex: 1,
    backgroundColor: COLORS.lightRed,
  },

  progressTxt: {
    fontFamily: FONTS.Explet_Bold,
    fontSize: Scale(16),
    // fontWeight: "700",
    letterSpacing: Scale(0.4),
    lineHeight: Scale(21.42),
    marginLeft: Scale(20),
    maxWidth: Scale(200)
  },

  progressView: {
    marginTop: Scale(15),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rewardView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor:'red'
  },

  rewardTxt: {
    fontSize: Scale(14),
    fontWeight: "700",
    letterSpacing: Scale(0.4),
    lineHeight: Scale(15),
    color: COLORS.purple
  },

  rewardImage: {
    marginRight: Scale(15),
    height: Scale(24),
    width: Scale(24),
    tintColor: COLORS.purple
  },

  progresListMainView: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: Scale(10),
    marginTop: Scale(10),
  },

  progresListItem: {
    width: Scale(110),
    height: Scale(85),
    borderRadius: Scale(12),
    backgroundColor: "#EBEFF4",
    justifyContent: "space-around",
    padding: Scale(8),
    marginLeft:Scale(20),
    marginRight:Scale(4)
  },

  itemImage: {
    height: Scale(24),
    width: Scale(24),
  },

  progressListView: {
    height: Scale(),
  },

  pointView: {
    flexDirection: "row",
    marginTop: Scale(6),
  },

  pointOut: {
    fontSize: Scale(16),
    fontWeight: "800",
    lineHeight: Scale(16),
    maxWidth: Scale(100),
  },

  poinrtOutIn: {
    color: COLORS.black,
    fontFamily: FONTS.Roboto_Medium,
    fontSize: Scale(12),
    fontWeight: "500",
    lineHeight: Scale(12),
    marginTop: Scale(5),
    maxWidth: Scale(100),
  },

  wineTxt: {
    fontSize: Scale(12),
    fontWeight: "500",
    lineHeight: Scale(14.06),
    color: "#777185",
    maxWidth: Scale(100),
    fontFamily: FONTS.Roboto_Medium,
  },

  selectTxt: {
    color: COLORS.black,
    fontSize: Scale(14),
    fontWeight: "700",
    lineHeight: Scale(16.41),
    letterSpacing: Scale(0.4),
  },

  centerIconView: {
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Scale(80),
    height: Scale(255),
  },

  centerIconImage: {
    width: Scale(300),
    height: Scale(83),
    alignSelf: "center",
  },
  noCourseSelectTxt: {
    fontFamily: FONTS.Roboto_Regular,
    textAlign: "center",
    fontSize: Scale(14),
    lineHeight: Scale(17),
    letterSpacing: Scale(0.4),
    color: "#777185",
    marginTop: -5,
    maxWidth: Scale(370),

  },

  catalogueTouch: {
    width: Scale(343),
    height: Scale(56),
    borderRadius: Scale(12),
    backgroundColor: COLORS.lightRed,
    alignItems: "center",
    justifyContent: "center",
  },

  catalogueTxt: {
    fontSize: Scale(16),
    lineHeight: Scale(19),
    letterSpacing: Scale(0.4),
    fontWeight: "700",
    color: "#fff",
  },

  courseContinueTxt: {
    fontFamily: FONTS.Explet_Bold,
    fontSize: Scale(16),
    // fontWeight: "700",
    letterSpacing: Scale(0.4),
    lineHeight: Scale(21),
    width: Scale(265),
    height: Scale(21),
    marginLeft: Scale(18),
    marginTop: Scale(10),
    marginBottom: Scale(15),
    maxWidth: Scale(300)
  },

  courseList: {
    width: Scale(375),
    borderRadius: Scale(12),
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    borderWidth: Scale(1),
    padding: Scale(8),
    borderColor: "lightgrey",
    marginHorizontal: Scale(14),
    alignSelf: "center",
    marginBottom:Scale(10)
  },

  itemImageIcon: {
    width: Scale(120),
    height: Scale(130),
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },

  courseDownload: {
    marginRight: Scale(10),
    width: Scale(25),
    height: Scale(25),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Scale(5),
    backgroundColor: "rgba(0,0,0,0.5)",
    marginBottom: Scale(10),
  },

  dotStyle: {
    width: Scale(3),
    marginLeft: Scale(3),
    height: Scale(3),
    backgroundColor: "lightgrey",
    borderRadius: Scale(3),
    // marginRight:Scale(2)
  },

  headingTxt: {
    fontSize: Scale(16),
    fontWeight: "700",
    lineHeight: Scale(16),
    maxWidth: Scale(200),
    marginVertical: Scale(10),
  },

  downloadImage: {
    width: Scale(10),
    height: Scale(10),
  },

  downloadView: {
    marginRight: Scale(6),
    width: Scale(16),
    height: Scale(16),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Scale(5),
    backgroundColor: "rgba(0,0,0,0.5)",
    position:"absolute",
    top:0,
    left:0,
    // marginBottom: Scale(6)
    margin: Scale(5),
  },

  itemView: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemName: {
    fontSize: Scale(10),
    color: "grey",
    maxWidth: Scale(100),
    fontFamily:FONTS.Roboto_Regular
  },

  aboutItem: {
    fontSize: Scale(10),
    marginLeft: Scale(5),
    color: "grey",
    maxWidth: Scale(50),
    fontFamily:FONTS.Roboto_Regular
  },

  flagStyle: {
    width: Scale(12),
    height: Scale(12),
    resizeMode: "contain",
    marginLeft: Scale(5),
  },

  itemDescription: {
    fontSize: Scale(12),
    fontWeight: "400",
    lineHeight: Scale(14),
    color: "#777185",
    maxWidth: Scale(200),
  },

  dataView: {
    marginLeft: Scale(15),
    justifyContent: "space-around",
    height: Scale(130),
  },

  perMainView: {
    flexDirection: "row",
    alignItems: "center",
  },

  percentageView: {
    width: Scale(150),
    borderRadius: Scale(2),
    height: Scale(4),
    backgroundColor: "lightgrey",
    justifyContent: "center",
  },

  percentageTxt: {
    fontSize: Scale(14),
    fontWeight: "bold",
    color: "grey",
    marginLeft: Scale(8),
  },

  rewardView1: {
    flexDirection: "row",
    marginTop: Scale(10),
    alignItems: "center",
  },

  rewardImage1: {
    width: Scale(15),
    height: Scale(15),
    tintColor: 'black'
  },

  rewardget: {
    fontSize: Scale(14),
    fontWeight: "bold",
    marginLeft: Scale(5),
  },

  dotRewardView: {
    width: Scale(5),
    height: Scale(5),
    backgroundColor: "lightgrey",
    borderRadius: Scale(2),
    marginLeft: Scale(10),
    marginRight: Scale(10),
  },

  rewardPoint: {
    fontSize: Scale(14),
    fontWeight: "bold",
    marginLeft: Scale(5),
  },

  completeView: {
    width: Scale(375),
    borderWidth: Scale(0.5),
    borderColor: "#5F687A",
    borderRadius: Scale(10),
    alignItems: "center",
    paddingBottom: Scale(10),
    marginLeft: Scale(10),
    marginBottom:Scale(10)
    
  },

  itemBackground: {
    width: Scale(375),
    height: Scale(190),
    justifyContent: 'flex-end',
    borderTopLeftRadius: Scale(10),
    borderTopRightRadius: Scale(10),
    overflow: 'hidden'
  },

  completeListView: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: Scale(5)
    
  },

  checkImage: {
    width: Scale(15),
    height: Scale(15),
  },

  courseCompletionTxt: {
    color: "#FFFFFF",
    marginLeft: Scale(10),
    fontSize: Scale(10),
    lineHeight: Scale(12),
    fontWeight: "500",
    fontFamily:FONTS.Roboto_Regular
  },

  dotView: {
    marginLeft: Scale(10),
    marginRight: Scale(10),
    width: Scale(4),
    height: Scale(4),
    backgroundColor: "white",
  },

  rewardIcon: {
    width: Scale(15),
    height: Scale(15),
    resizeMode: "contain",
  },

  userRewardCount: {
    color: "#FFFFFF",
    marginLeft: Scale(10),
    fontSize: Scale(10),
    lineHeight: Scale(12),
    fontWeight: "700",
  },

  lessonImage: {
    resizeMode: "contain",
    height: Scale(15),
    width: Scale(15),
  },

  userTotalPointTxt: {
    color: "#FFFFFF",
    marginLeft: Scale(10),
    fontSize: Scale(10),
    lineHeight: Scale(12),
    fontWeight: "700",
    fontFamily:FONTS.Roboto_Regular
  },

  completeCourseListView: {
    width: "90%",
    alignSelf: "center",
    marginTop: Scale(20),
  },

  completedCourseTxt: {
    fontFamily: FONTS.Explet_SemiBold,
    fontSize: Scale(16),
    fontWeight: '700'
  },

  completeCOurseDetailView: {
    width: Scale(343),
    marginTop: Scale(5),
    alignSelf: "center",
  },

  typeAndDescriptionView: {
    flexDirection: "row",
    alignItems: "center",
  },

  itemHeading: {
    fontFamily: FONTS.Roboto_Regular,
    fontSize: Scale(14),
    fontWeight: '700',
    marginTop: Scale(5),
    lineHeight: Scale(16),
    maxWidth: Scale(350)
  },

  itemDetail: {
    fontSize: Scale(12),
    fontWeight: "400",
    color: "#777185",
    marginTop: Scale(5),
    lineHeight: Scale(14),
    fontFamily:FONTS.Roboto_Regular
  },

  allCourseView: {
    width: Scale(375),
    alignSelf: 'center',
    marginTop: Scale(20),
    alignItems: 'center',
    opacity: Scale(3),
    borderWidth: Scale(0.5),
    borderColor: 'lightgrey',
    borderRadius: Scale(12),
    paddingBottom: 10
  },

  completeProductImage: {
    width: Scale(374),
    alignItems: "flex-end",
    alignSelf: "center",
    justifyContent: "space-between",
    height: Scale(170),
  },

  hideView: {
    width: "20%",
    marginRight: Scale(10),
    marginTop: Scale(10),
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: Scale(20),
    justifyContent: "center",
    height: Scale(30),
  },

  hideTxt: {
    fontSize: Scale(12),
    fontWeight: "700",
    color: "white",
    lineHeight: Scale(14),
  },

  allCourseTxt: {
    marginTop: -5,
    fontFamily: FONTS.Explet_SemiBold,
    fontSize: Scale(16),
    alignSelf: 'center',
    fontWeight: "700",
    lineHeight: Scale(17),
    marginBottom: 5
  },

  congratulationTxt: {
    textAlign: 'center',
    width: '85%',
    alignSelf: 'center',
    color: '#777185',
    fontSize: Scale(11.7),
    lineHeight: Scale(16),
    fontWeight: "400",
    maxWidth: Scale(290)
  },
  trialVersionContainer:{
    backgroundColor: '#EBEFF4', height: hp(6), margin: hp(2), bottom: 0, position: 'absolute', width: '91%', flexDirection: 'row', alignItems: 'center', borderRadius: hp(1.3), justifyContent: 'space-between'
  },
  trialVersionImageContainer:{
    height: hp(3.5), width: hp(3.5), marginLeft: wp(3) 
  },
  trialVersionTextContainer:{
    fontFamily: FONTS.Roboto_Regular, fontSize: rf(2), color: '#777185', marginLeft: wp(2)
  }
  // Customizable Area Start 
  // Customizable Area End
})