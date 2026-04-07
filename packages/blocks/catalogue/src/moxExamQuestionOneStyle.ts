import { StyleSheet } from "react-native";
import Scale from "../../../components/src/Scale";
import { FONTS } from "../../../framework/src/Fonts";

export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#fff"
    },

    headerView: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: Scale(20),
        marginRight: Scale(20),
        alignItems: 'center'
    },

    countView: {
        flexDirection: 'row'
    },

    titleTxt: {
        fontSize: Scale(16),
        fontWeight: "400",
        color: 'grey'
    },

    countUser: {
        fontSize: Scale(14),
        fontWeight: "400",
    },

    totalCount: {
        fontSize: Scale(12),
        fontWeight: "400",
        color: "grey",
        marginTop: Scale(2)
    },

    answerTxt: {
        paddingVertical:Scale(2),
        fontSize: Scale(14),
        fontWeight: '400',
        lineHeight: Scale(13),
        color:"grey",
        marginTop:6,
        marginLeft:5
    },

    sampleTxt: {
        fontSize: Scale(21),
        fontWeight: "600",
        marginTop: Scale(10),
        marginLeft: Scale(10)
    },

    imageTxt: {
        fontSize: Scale(16),
        fontWeight: '400',
        color: "grey",
        marginLeft: Scale(15),
        marginTop: Scale(20),
    },

    qeustionImage: {
        width: Scale(360),
        height: Scale(343),
        borderRadius: Scale(12),
        alignSelf: 'center',
        resizeMode: "cover",
        marginTop: Scale(20)
    },

    buttonMainView: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },

    closeButtonView: {
        alignItems: 'center',
    },

    closeButton: {
        resizeMode: 'contain',
        width: Scale(10),
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
        marginLeft: Scale(20)
    },

    questionListView: {
        alignSelf: 'center'
    },

    questionView: {
        width: Scale(360),
        // height: Scale(50),
        borderRadius: Scale(8),
        backgroundColor: "#F2F2F7",
        marginTop: Scale(20),
        // padding: Scale(10),
        flexDirection:'row',
        alignItems:'center',
        justifyContent:"space-between",
        // borderWidth:1,
        // borderColor:'red',
    },

    nextButton : {
        width:Scale(30),
        height:Scale(20),
        resizeMode:'cover',
        tintColor:"grey"
    },

    quizNameText:{
        fontFamily:FONTS.Roboto_Bold,
        fontSize: Scale(32)
      }
})