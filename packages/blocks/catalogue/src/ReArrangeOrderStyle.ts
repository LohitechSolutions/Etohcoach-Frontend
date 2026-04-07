import { StyleSheet } from "react-native";
import Scale from "../../../components/src/Scale";
import { FONTS } from "../../../framework/src/Fonts";
import { COLORS } from "../../../framework/src/Globals";

export default StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    headerView: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: Scale(20),
        marginRight: Scale(20),
        alignItems: 'center',
        marginTop: Scale(5)
    },

    countView: {
        flexDirection: 'row'
    },

    titleTxt: {
        fontSize: Scale(12),
        fontWeight: "400",
        color: 'grey'
    },

    nextButton: {
        width: Scale(30),
        height: Scale(20),
        resizeMode: 'cover',
        tintColor: "grey",
        marginRight: Scale(5)
    },

    rightAnswerTxt: {
        fontSize: Scale(16),
        fontWeight: "500"
    },

    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: Scale(6),
        width: Scale(40),
        justifyContent: 'space-between'
    },

    arrangeTxt: {
        fontSize: Scale(22),
        fontWeight: "700",
        marginLeft: Scale(20)
    },

    imageTxt: {
        fontSize: Scale(16),
        fontWeight: '400',
        color: "grey",
        marginLeft: Scale(10),
        marginTop: Scale(20)
    },

    totalCount: {
        fontSize: Scale(12),
        fontWeight: "400",
        color: "grey",
        marginTop: Scale(2)
    },

    buttonMainView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: Scale(20)
    },

    bottmButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },

    closeButtonView: {
        alignItems: 'center',
    },

    closeButton: {
        resizeMode: 'contain',
        width: Scale(13),
        height: Scale(15),
        tintColor: "#777185"
    },

    checkButton: {
        resizeMode: 'contain',
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

    answerInputTxt: {
        fontSize: Scale(16),
        fontWeight: "400",
        lineHeight: Scale(19),
        color: "#777185",
        marginTop: Scale(10),
        // marginLeft: Scale(20)
    },

    questionListView: {
        alignSelf: 'center',
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        marginTop: Scale(20),
    },

    questionView: {
        width: Scale(360),
        // height: Scale(50),
        borderRadius: Scale(8),
        backgroundColor: "white",
        padding: Scale(10),
        paddingRight:Scale(20),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        marginLeft: Scale(10),
        shadowColor: '#8B8B8B',
        shadowOffset: {width: 1, height: 2},
        shadowOpacity: 0.1,
    },

    countUser: {
        fontSize: Scale(14),
        fontWeight: "400",
        color: "black",
    },

    answerTxt: {
        fontSize: Scale(11),
        fontWeight: '400',
        lineHeight: Scale(13),
        color: "grey"
    },
    questionviewifRightanswer: {
        width: Scale(360),
        height: Scale(50),
        borderRadius: Scale(8),
        backgroundColor: "white",
        padding: Scale(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        marginLeft: Scale(10),
        borderColor: COLORS.success,
        shadowOpacity: Scale(-1),
        borderWidth: 1,

    },
    quizNameText:{
        fontFamily:FONTS.Roboto_Bold,
        fontSize: Scale(32)
      },

})