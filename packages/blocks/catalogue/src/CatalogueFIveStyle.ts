import { SafeAreaView, StyleSheet, Platform } from "react-native";
import Scale from "../../../components/src/Scale";
import { COLORS } from "../../../framework/src/Globals";
import { scaleRatio } from "../../../framework/src/Utilities";

export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },

    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: Scale(10),
        marginTop: Scale(20)
    },

    courseNameview: {
        maxWidth: Scale(200)
    },

    itemHeading: {
        fontSize: Scale(12),
        fontWeight: "500",
        lineHeight: Scale(14),
        color: "#777185",
        maxWidth: Scale(200)
    },

    headerDot: {
        width: Scale(2),
        height: Scale(2),
        borderRadius: Scale(0.5),
        backgroundColor: "grey",
        marginLeft: Scale(5),
        marginRight: Scale(5)
    },

    startTxt: {
        fontSize: Scale(10),
        fontWeight: "500",
        lineHeight: Scale(12),
        letterSpacing: Scale(0.5),
        marginHorizontal: Scale(5),
        color: "#fff"
    },

    completeView: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    completeIconView: {
        width: Scale(15),
        marginLeft: Scale(10),
        height: Scale(15),
        borderRadius: Scale(10),
        backgroundColor: COLORS.success,
        alignItems: 'center',
        justifyContent: 'center'
    },

    completeIcon: {
        width: Scale(10),
        height: Scale(10),
        resizeMode: 'contain',
    },

    completionView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: Scale(5),
        justifyContent: "center"
    },

    continuePlay: {
        width: Scale(10),
        height: Scale(10),
        resizeMode: "contain",
        marginLeft: Scale(10)
    },

    userCompleted: {
        fontSize: Scale(13),
        fontWeight: '700',
        color: 'white',
        marginLeft: Scale(5)
    },


    itemStorageName: {
        fontSize: Scale(30),
        fontWeight: '700',
        marginTop: Scale(10),
        marginLeft: Scale(10),
    },

    boxView: {
        width: Scale(15),
        height: Scale(15),
        borderRadius: Scale(4),
        backgroundColor: COLORS.success,
    },

    boxView1: {
        width: Scale(15),
        height: Scale(15),
        borderRadius: Scale(4),
        backgroundColor: "lightgrey",
        justifyContent: 'center',
        alignItems: "center",
    },


    lineViewVisible: {
        height: Scale(60),
        width: Scale(2),
        backgroundColor: COLORS.success,
        marginTop: Scale(5)
    },
    lineView: {
        height: Scale(60),
        width: Scale(2),
        backgroundColor:"lightgrey",
        marginTop: Scale(5)
    },

    itemHedingView: {
        width: Scale(340),
        height: Scale(20),
        backgroundColor: "#000000",
        flexDirection: 'row',
        alignItems: 'center',
        borderTopLeftRadius: Scale(12),
        borderTopRightRadius: Scale(12)
    },

    rewardIcon: {
        width: Scale(12),
        height: Scale(12),
        marginHorizontal: Scale(5),
        tintColor: "grey"
    },
    flashcardicon: {
        width: Scale(10),
        height: Scale(11),
        marginHorizontal: Scale(5),
    },

    rewardIconImage: {
        width: Scale(13),
        height: Scale(11),
        tintColor: "grey",
        marginLeft: Scale(10),

    },

    lessonUserPoint: {
        fontSize: Scale(10),
        fontWeight: "700",
        lineHeight: Scale(12),
        letterSpacing: Scale(0.5),
        marginHorizontal: Scale(5),
        color: "#fff"
    },

    courseItemList: {
        width: Scale(340),
        height: Scale(60),
        backgroundColor: "#ffffff",
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        borderBottomLeftRadius: Scale(12),
        borderBottomRightRadius: Scale(12),
        borderWidth: Scale(1),
        borderColor: "lightgrey",
    },

    coursItemView: {
        marginLeft: Scale(10),
        justifyContent: 'space-between',
        marginTop: 8,
        marginBottom: 3
    },

    itemType: {
        fontWeight: "500",
        fontSize: Scale(10),
        lineHeight: Scale(12),
        letterSpacing: Scale(0.5),
        color: 'grey',
        margin: Scale(5)
    },

    itemDescriptionHeading: {
        fontWeight: "700",
        fontSize: Scale(16),
        lineHeight: Scale(19),
        letterSpacing: Scale(0.5),
        maxWidth: Scale(250),
        margin: Scale(5)
    },

    rightArrowIcon: {
        width: Scale(30),
        height: Scale(30),
        marginRight: Scale(10)
    },

    continueButtton: {
        width: Scale(350),
        alignItems: 'center',
        borderRadius: Scale(10),
        marginTop: Scale(10),
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: COLORS.lightRed,
        height: Scale(55),
        marginBottom: Platform.OS == "ios" ? Scale(10) : 0
    },

    continueStudyTxt: {
        fontSize: Scale(16),
        color: 'white',
        fontWeight: "700",
        lineHeight: Scale(18)
    },

    backButton: {
        alignItems: "center",
        height: Scale(40),
        justifyContent: "space-between"
    },

    bottomStackView: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-around',
        height: Scale(100),
    },
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
          width: 0
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: "50%",
        width: "100%",
        }
          // Customizable Area Start
    // Customizable Area End
})