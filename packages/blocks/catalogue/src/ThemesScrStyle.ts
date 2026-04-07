import { SCHED_NONE } from "cluster";
import { StyleSheet } from "react-native";
import Scale from "../../../components/src/Scale";
import { FONTS } from "../../../framework/src/Fonts";
import { COLORS } from "../../../framework/src/Globals";
// Customizable Area Start 
// Customizable Area End
export default StyleSheet.create({
 // Customizable Area Start 
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.white,
    },

    headerView: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        marginLeft: Scale(10),
        marginTop: Scale(20)
    },

    itemHeading: {
        fontSize: Scale(12),
        fontWeight: "500",
        lineHeight: Scale(21),
        color: COLORS.grey,
        maxWidth: Scale(300),
        fontFamily: FONTS.Roboto_Medium
    },

    headerDot: {
        width: Scale(2),
        height: Scale(2),
        borderRadius: Scale(0.5),
        backgroundColor: "grey"
    },

    startTxt: {
        fontSize: Scale(10),
        fontWeight: "500",
        lineHeight: Scale(12),
        letterSpacing: Scale(0.5),
        marginHorizontal: Scale(5),
        color: "#fff"
    },

    itemStorageName: {
        color: COLORS.black,
        fontFamily: FONTS.Roboto_Black,
        fontSize: Scale(30),
        fontWeight: '700',
        marginTop: Scale(5),
        marginLeft: Scale(10),
    },

    listOfThemes: {
        flexDirection: 'row',
        justifyContent: "space-evenly",
    },

    completeCourseLine: {
        marginTop: Scale(30)
    },

    themeMainView: {
        height: Scale(250),
        borderRadius: Scale(12),
        backgroundColor: COLORS.white,
        marginTop: Scale(20),
        justifyContent: 'space-between',
        borderWidth: Scale(1),
        borderColor: "lightgrey",
        paddingBottom: Scale(5)
    },

    themeBackground: {
        flex:1,
        width:"100%",
        height:"100%",
        borderTopRightRadius: Scale(10),
        borderTopLeftRadius: Scale(10),
        overflow: 'hidden',
        justifyContent: 'flex-end',
        resizeMode:'contain',

    },

    courseItem: {
        backgroundColor: COLORS.black10,
        height: Scale(30),
        alignItems: 'center',
        flexDirection: 'row',
        width: Scale(330),
    },

    completedCourse: {
        width: Scale(15),
        height: Scale(15),
        borderRadius: Scale(3),
        backgroundColor: COLORS.success,
        justifyContent: 'center',
        alignItems: 'center'
    },
    paidCourse: {
        width: Scale(15),
        height: Scale(15),
        borderRadius: Scale(3),
        backgroundColor: "lightgrey",
        justifyContent: 'center',
        alignItems: 'center'
    },
    lockedCourse: {
        width: Scale(15),
        height: Scale(15),
        borderRadius: Scale(3),
        backgroundColor: 'lightgrey',
        justifyContent: 'center',
        alignItems: 'center'
    },
    Uncompleted: {
        width: Scale(15),
        height: Scale(15),
        borderRadius: Scale(3),
        backgroundColor: 'lightgrey'
    },

    completedCourse1: {
        height: Scale(240),
        width: Scale(2),
        borderRadius: Scale(3),
        backgroundColor: COLORS.success,
        marginTop: Scale(5)
    },
    MockexamcompletedCourse1: {
        height: Scale(70),
        width: Scale(2),
        borderRadius: Scale(3),
        backgroundColor: COLORS.success,
        marginTop: Scale(5)
    },


    Uncompleted1: {
        height: Scale(240),
        width: Scale(2),
        borderRadius: Scale(3),
        backgroundColor: 'lightgrey',
        marginTop: Scale(5)
    },
    mockexamUncompleted1: {
        height: Scale(70),
        width: Scale(2),
        borderRadius: Scale(3),
        backgroundColor: 'lightgrey',
        marginTop: Scale(5)
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
        height: Scale(10)
    },

    userCompleted: {
        fontSize: Scale(13),
        fontWeight: '500',
        color: COLORS.white,
        marginLeft: Scale(5),
        fontFamily: FONTS.Roboto_Regular
    },

    completeView: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    continuePlay: {
        width: Scale(10),
        height: Scale(10),
        resizeMode: "contain",
        marginLeft: Scale(5)
    },

    completionView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: Scale(5),

    },

    themeType: {
        fontSize: Scale(14),
        color: 'grey',
        marginLeft: Scale(10),
        marginTop: Scale(5),
        fontFamily: FONTS.Roboto_Regular,
        fontWeight: "500"
    },

    themeTitle: {
        fontSize: Scale(17),
        fontWeight: '700',
        marginLeft: Scale(10),
        color: COLORS.black,
        fontFamily: FONTS.Roboto_Regular,


        // marginTop: Scale(5),
        // marginBottom: Scale(10)
    },

    completView: {
        width: Scale(5),
        height: Scale(5),
        backgroundColor: 'grey',
        marginLeft: Scale(5),
        marginRight: Scale(5)
    },

    completedViewIcon: {
        height: Scale(12),
        width: Scale(12),
        resizeMode: 'cover'
    },
// Customizable Area End
})
