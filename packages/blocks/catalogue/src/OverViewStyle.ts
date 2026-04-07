import { StyleSheet } from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Scale from "../../../components/src/Scale";
import { FONTS } from "../../../framework/src/Fonts";
import { COLORS } from "../../../framework/src/Globals";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
// Customizable Area Start 
// Customizable Area End
export default StyleSheet.create({
  // Customizable Area Start 
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  mainImg: {
    height: Scale(230),
    width: Scale(414),
    padding: Scale(15),

    alignSelf: "center",
    resizeMode: "cover",
  },

  menuBar: {
    alignSelf: "flex-end",
    width: Scale(24),
    height: Scale(24),
    borderRadius: Scale(6),
    backgroundColor: "#000",
    marginTop: Scale(10),
    marginRight: Scale(10),
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  mainContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },

  dotView: {
    width: Scale(2),
    height: Scale(2),
    borderRadius: Scale(1),
    backgroundColor: "#FFF",
  },

  unenrollButton: {
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    marginTop: Scale(5),
    borderRadius: Scale(4),
    marginRight: Scale(12),
    paddingVertical: Scale(10),
    paddingHorizontal: Scale(6),
  },

  unEnRollText: {
    fontSize: Scale(16),
    fontWeight: "500",
  },

  themesView: {
    height: Scale(90),
    width: "100%",
    backgroundColor: "#e9eff2",
    justifyContent: "center",
  },

  aboutItemView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Scale(10),
    justifyContent: "space-between",
  },

  aboutItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: Scale(10),
  },

  itemNav: {
    color: "grey",
    fontWeight: "400",
    fontSize: Scale(10),
  },

  availableOflineView: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: Scale(10),
  },

  offlineTxt: {
    fontSize: Scale(10),
    fontWeight: "400",
    //  color: "grey"
  },

  download: {
    width: Scale(18),
    height: Scale(19),
    // tintColor: "#000",
    resizeMode: "contain",
    borderRadius: Scale(4),
    backgroundColor: "#000",
    marginLeft: Scale(5),
    alignItems: "center",
    justifyContent: "center",
  },

  downLoadOfflineIcon: {
    width: Scale(9),
    height: Scale(10),
    // tintColor: "#000",
    resizeMode: "contain",
    borderRadius: Scale(4),
    backgroundColor: "#000",
    // marginLeft: Scale(5)
  },

  percantageView: {
    alignItems: "center",
    marginTop: Scale(5),
    flexDirection: "row",
    marginLeft: Scale(10),
  },

  percantageTxt: {
    fontSize: Scale(11),
    marginRight: Scale(5),
    fontWeight: "600",
  },

  zeroPointView: {
    width: Scale(320),
    backgroundColor: "#ECF1F4",
    borderRadius: Scale(10),
    height: Scale(5),
    marginLeft: Scale(3),
  },

  userPointView: {
    // width: Scale(300),
    height: Scale(5),
    borderRadius: Scale(10),
    backgroundColor: "#F6A318",
  },

  subCategoryView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: Scale(140),
    alignSelf: "center",
  },

  mainViewEarnedPoints: {
    width: Scale(380),
    height: Scale(35),
    borderRadius: Scale(4),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#ECEFF6",
    marginBottom: Scale(10),
  },

  subCategoruItemTxt: {
    fontSize: Scale(16),
    fontWeight: "600",
  },

  flashCardIcon: {
    width: Scale(25),
    height: Scale(25),
    resizeMode: "cover",
  },

  completeCourse: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  itemsImage: {
    width: Scale(22),
    height: Scale(24),
    resizeMode: "contain",
    alignItems: "center",
    justifyContent: "center",
  },

  quizesImage: {
    width: Scale(13),
    height: Scale(14),
    resizeMode: "contain",
  },

  iconImage: {
    width: Scale(14),
    height: Scale(15),
    resizeMode: "contain",
  },

  countTotalView: {
    flexDirection: "row",
    alignItems: "center",
  },

  userCount: {
    fontSize: Scale(16),
    fontWeight: "700",
  },

  totalCount: {
    fontSize: Scale(14),
    marginTop: heightPercentageToDP(0.7),
  },

  subItemsTxt: {
    fontSize: Scale(14),
    color: "grey",
  },

  rewardImage: {
    width: Scale(23),
    height: Scale(23),
    resizeMode: "contain",
    tintColor: COLORS.purple
  },

  earnedPoints: {
    fontSize: Scale(16),
    fontWeight: "600",
    marginLeft: Scale(5),
    marginRight: Scale(3),
  },

  rearnedPointTxt: {
    fontSize: Scale(13),
    fontWeight: "300",
    color: "grey",
  },

  subCategoryItems: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  subCategoryItemsView: {
    width: Scale(115),
    borderColor: "grey",
    height: Scale(90),
    padding: Scale(10),
    borderRadius: Scale(12),
    justifyContent: "space-around",
    backgroundColor: "#ECEFF6",
  },

  circleImg: {
    width: Scale(4),
    height: Scale(4),
    backgroundColor: "lightgrey",
    marginLeft: Scale(5),
    marginRight: Scale(5),
  },

  ukFlag: {
    height: heightPercentageToDP(0.8),
    width: heightPercentageToDP(1.3),
    marginLeft: widthPercentageToDP(1.3),
  },

  wineDoneTxt: {
    fontWeight: "700",
    fontSize: Scale(20),
    marginVertical: Scale(6),
    maxWidth: Scale(350),
    marginLeft: Scale(10),
    fontFamily: FONTS.Roboto_Regular
  },

  descriptionView: {
    height: Scale(160),
  },
  wineAns: {
    maxWidth: Scale(360),
    fontSize: Scale(16),
    // marginRight: widthPercentageToDP(3),
    color: "grey",
    marginLeft: Scale(10),
    fontWeight: "500",
    lineHeight: Scale(20),
    fontFamily: FONTS.Roboto_Regular

  },

  categoryView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: Scale(15),
    marginRight: Scale(15),
  },

  themesBox: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: heightPercentageToDP(0.8),
  },
  lessonView: {
    height: heightPercentageToDP(4.5),
    width: widthPercentageToDP(22),
    borderRightWidth: heightPercentageToDP(0.15),
    borderColor: COLORS.white,
    alignItems: "center",
    marginTop: heightPercentageToDP(0.8),
  },
  intermidiate: {
    width: widthPercentageToDP(27),
    borderRightWidth: heightPercentageToDP(0.15),
    borderColor: COLORS.white,
    alignItems: "center",
    marginTop: heightPercentageToDP(0.8),
  },
  estimatedTime: {
    width: widthPercentageToDP(23),
    alignItems: "center",
  },
  themeTxt: {
    fontWeight: "800",
    fontSize: Scale(14),
  },
  txtStyle: {
    color: COLORS.grey,
    fontSize: Scale(14),
    textAlign: "center",
  },

  lineView: {
    width: Scale(1.5),
    height: Scale(40),
    backgroundColor: "#FFFFFF",
  },

  startCourseButton: {
    height: Scale(55),
    width: Scale(350),
    backgroundColor: COLORS.lightRed,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: Scale(12),
    marginTop: Scale(20),
  },

  flashButton: {
    height: Scale(55),
    width: Scale(170),
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: Scale(12),
    borderWidth: Scale(0.5),
    borderColor: "lightgrey",
  },

  backTxt: {
    fontSize: Scale(16),
    fontWeight: "700",
    color: "#000",
  },

  flashStartButton: {
    height: Scale(55),
    width: Scale(170),
    backgroundColor: COLORS.lightRed,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: Scale(12),
  },

  startCourseTxt: {
    color: "#fff",
    fontSize: Scale(16),
    fontWeight: "700",
    lineHeight: Scale(20),
  },

  modalConatiner: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#00000090",
  },

  innerModalConatin: {
    height: Scale(460),
    borderRadius: Scale(12),
    backgroundColor: "#FFF",
    justifyContent: "space-around",
  },

  dragButton: {
    width: Scale(60),
    height: Scale(6),
    borderRadius: Scale(12),
    backgroundColor: "lightgrey",
    alignSelf: "center",
    marginTop: Scale(5),
  },

  drageButtonFQM: {
    width: Scale(60),
    height: Scale(6),
    borderRadius: Scale(12),
    backgroundColor: "lightgrey",
    alignSelf: "center",
  },

  courceImage: {
    alignSelf: "center",
    height: Scale(110),
    width: Scale(110),
    tintColor: COLORS.lightRed
  },

  greatTextContain: {
    fontSize: Scale(28),
    fontWeight: "600",
    textAlign: "center",
    alignSelf: "center",
    fontFamily: FONTS.Explet_Bold,
    lineHeight: Scale(30),
  },

  unenrollTxt: {
    fontWeight: "600",
    fontSize: Scale(28),
    alignSelf: "center",
    fontFamily: FONTS.Explet_Bold,
  },

  confirmTxtContain: {
    fontSize: Scale(14),
    fontWeight: "400",
    textAlign: "center",
    alignSelf: "center",
    color: COLORS.grey,
    lineHeight: Scale(20),
    bottom: Scale(24),
  },

  quizTextContain: {
    fontSize: Scale(23),
    fontWeight: "600",
    textAlign: "center",
    fontFamily: FONTS.Explet_Bold,
    marginTop: Scale(20),
    marginBottom: Scale(10),
  },

  browseTextContain: {
    fontSize: Scale(16),
    color: COLORS.grey,
    textAlign: "center",
    alignSelf: "center",
    bottom: Scale(20),
    lineHeight: Scale(22),
  },

  buttonContain: {
    backgroundColor: COLORS.lightRed,
    height: Scale(60),
    width: Scale(360),
    borderRadius: Scale(14),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    bottom: Scale(20),
  },

  confirmButton: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  cancelButton: {
    width: Scale(170),
    height: Scale(56),
    borderRadius: Scale(12),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: Scale(1),
    borderColor: "lightgrey",
  },

  ContinueButton: {
    width: Scale(170),
    height: Scale(56),
    borderRadius: Scale(12),
    backgroundColor: COLORS.lightRed,
    alignItems: "center",
    justifyContent: "center",
  },

  continueTxt: {
    fontSize: Scale(16),
    fontWeight: "700",
    color: "#fff",
  },

  cancelTxt: {
    fontSize: Scale(16),
    fontWeight: "700",
  },

  flashModalConatiner: {
    flex: 1,
    justifyContent: "flex-end",
    borderColor: "#fff",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  flashInnerModalConatin: {
    height: heightPercentageToDP(80),
    width: "100%",
    borderRadius: heightPercentageToDP(1.5),
    backgroundColor: COLORS.white,
    justifyContent: "space-between",
  },

  themeConatin: {
    marginTop: heightPercentageToDP(4),
  },

  backButton: {
    height: heightPercentageToDP(6.5),
    width: "43%",
    borderWidth: widthPercentageToDP(0.1),
    borderColor: COLORS.grey,
    borderRadius: heightPercentageToDP(1.3),
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  backText: {
    color: COLORS.black,
    fontSize: Scale(15),
    fontWeight: "500",
  },
  startButton: {
    height: heightPercentageToDP(6.5),
    width: "43%",
    borderRadius: heightPercentageToDP(1.3),
    backgroundColor: COLORS.lightRed,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  reviewContainer: {
    alignSelf: "center",
    paddingTop: heightPercentageToDP(2),
    paddingHorizontal: heightPercentageToDP(6),
  },
  selectContainer: {
    paddingTop: heightPercentageToDP(0.4),
    paddingHorizontal: heightPercentageToDP(1),
  },
  reviewTextContain: {
    fontSize: Scale(28),
    fontWeight: "600",
    textAlign: "center",
    fontFamily: FONTS.Explet_Bold,
    marginTop: -20,
    marginBottom: 20,
  },
  selectTextContain: {
    fontSize: Scale(16),
    color: COLORS.grey,
    textAlign: "center",
  },

  buttonsOnFlash: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: Scale(414),
    marginBottom: Scale(30),
  },

  examConatin: {
    marginTop: heightPercentageToDP(4),
  },
  buttonConatiner: {
    flexDirection: "row",
    paddingTop: heightPercentageToDP(5),
    justifyContent: "space-around",
  },

  quizContainer: {
    alignSelf: "center",
    paddingTop: heightPercentageToDP(2),
    paddingHorizontal: heightPercentageToDP(6),
  },

  notSelected: {
    flexDirection: "row",
    borderRadius: Scale(10),
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    width: Scale(350),
    padding: Scale(13),
    alignSelf: "center",
    justifyContent: "space-between",
  },

  selected: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    width: Scale(350),
    padding: Scale(13),
    alignSelf: "center",
    justifyContent: "space-between",
  },

  themeNameTitle: {
    fontSize: Scale(16),
    fontWeight: "700",
    marginLeft: Scale(15),
    lineHeight: Scale(20),
    maxWidth: Scale(250),
  },

  quizeTouchable: {
    width: Scale(200),
    // alignSelf: "center",
    borderRadius: Scale(12),
  },

  quizeDropDownView: {
    alignItems: "center",
    justifyContent: "space-around",
  },
  mockexamTextstyle: {
    color: "#373434",
    fontSize: Scale(14),
    fontWeight: "500",
    maxWidth: Scale(300),
    fontFamily: FONTS.Roboto_Regular,
  },
  dropdownliststyle:{
    width: hp(3),
     height: hp(3) 
  }
  
  // Customizable Area End
});
