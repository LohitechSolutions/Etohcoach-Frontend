import { StyleSheet } from "react-native";
import Scale from "../../../components/src/Scale";
import { FONTS } from "../../../framework/src/Fonts";
import { COLORS } from "../../../framework/src/Globals";
// Customizable Area Start 
// Customizable Area End
export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FAFCFE",

  },
  mainView: {
    justifyContent: "space-between",
    marginTop: Scale(15),
    margin: Scale(20),
  },
  quizzesHeader: {
    display: "flex",
    flexDirection: "row",
  },

  mainHeaderView: {
    // justifyContent: "space-between",
    // marginTop: Scale(15),
    // marginLeft: Scale(20)
  },

  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    // margin: Scale(20)
  },

  userCountView: {
    marginRight: Scale(20),
    flexDirection: "row"
  },

  buttonMainView: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: Scale(20),

  },

  bottmButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },

  closeButtonView: {
    alignItems: "center"
  },

  arrangeTxt: {
    fontSize: Scale(22),
    fontWeight: "700",
    marginLeft: Scale(20)
  },

  choiceCorrect: {
    flexDirection: "row",
    alignItems: "center"
  },

  closeButton: {
    resizeMode: "contain",
    width: Scale(35),
    height: Scale(35),
    tintColor: "grey"
  },

  checkButton: {
    resizeMode: "contain",
    width: Scale(15),
    height: Scale(15),
    tintColor: "grey"
  },

  closetxt: {
    fontSize: Scale(12),
    fontWeight: "400",
    lineHeight: Scale(15),
    color: "grey"
  },

  countView: {
    flexDirection: "row"
  },

  titleTxt: {
    fontSize: Scale(16),
    fontWeight: "400",
    color: "grey"
  },

  countUser: {
    fontSize: Scale(14),
    fontWeight: "400",
    color: "red"
  },

  totalCount: {
    fontSize: Scale(12),
    fontWeight: "400",
    color: "grey",
    marginTop: Scale(2)
  },

  answerTxt: {
    fontSize: Scale(11),
    fontWeight: "400",
    lineHeight: Scale(13),
    color: "grey",
    marginTop: Scale(5)
  },

  sampleTxt: {
    fontSize: Scale(25),
    fontWeight: "700",
    marginTop: Scale(10),
    marginLeft: Scale(10)
  },

  imageTxt: {
    fontSize: Scale(16),
    fontWeight: "400",
    color: "grey",
    marginLeft: Scale(20),
    marginTop: Scale(20)
  },

  qeustionImage: {
    width: Scale(370),
    height: Scale(343),
    borderRadius: Scale(12),
    alignSelf: "center",
    resizeMode: "cover",
    marginTop: Scale(20)
  },

  answerInputTxt: {
    fontSize: Scale(16),
    fontWeight: "400",
    lineHeight: Scale(19),
    color: "#777185",
    marginTop: Scale(10),
    marginLeft: Scale(20)
  },

  questionListView: {
    alignSelf: "center"
  },

  questionArrangeListView: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center"
  },

  questionView: {
    width: Scale(360),
    height: Scale(50),
    borderRadius: Scale(8),
    backgroundColor: "#F2F2F7",
    marginTop: Scale(20),
    padding: Scale(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: Scale(1),
    borderColor: "grey",
    marginLeft: Scale(10)
  },

  nextButton: {
    width: Scale(30),
    height: Scale(25),
    resizeMode: "cover",
    tintColor: "grey",
    marginLeft: Scale(15)
  },

  wrapper: {
    marginTop: Scale(10),
    justifyContent: "center"
  },

  imageContainer: {
    width: Scale(300),
    height: Scale(170),
    alignSelf: "center",
    borderRadius: Scale(11),
    marginTop: Scale(20)
  },

  rightAnswerTxt: {
    fontWeight: "500",
    fontSize: Scale(16)
  },

  buttonView: {
    flexDirection: "row",
    alignItems: "center"
  },

  headerStyle: {
    fontFamily: FONTS.Roboto_Light,
    color: "#777185",
    fontSize: Scale(10)
  },

  countStyle: {
    color: COLORS.inActiveGray,
    fontFamily: FONTS.Roboto_Medium,
    fontSize: Scale(16)
  },
  currentPageCountStyle: {
    color: "#BF3E50",
    fontFamily: FONTS.Roboto_Bold,
    fontSize: Scale(20)
  },
  quizNameText: {
    fontFamily: FONTS.Roboto_Bold,
    fontSize: Scale(32)
  }
  // Customizable Area Start
   // Customizable Area End
});
