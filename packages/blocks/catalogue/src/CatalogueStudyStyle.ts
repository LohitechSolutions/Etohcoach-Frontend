import { StyleSheet } from "react-native";
import Scale from "../../../components/src/Scale";
import { COLORS } from "../../../framework/src/Globals";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { FONTS } from "../../../framework/src/Fonts";
import { RFPercentage as rf, } from "react-native-responsive-fontsize";
  // Customizable Area Start 
    // Customizable Area End
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor:'white'
    },

    descriptionTxt: {
        marginTop: Scale(20),
        fontSize: Scale(16),
        fontWeight: "400",
        lineHeight: Scale(18),
    },

    comentBox: {
        height: Scale(105),
        borderRadius: Scale(10),
        backgroundColor: "#F2F2F7",
        marginTop: Scale(10)
    },

    commentTxt: {
        fontSize: Scale(14),
        fontWeight: '400',
        lineHeight: Scale(13),
        color: "#777185",
        marginLeft: Scale(15),
        marginTop: Scale(20)
    },

    inputCmmnttxt: {
        fontSize: Scale(16),
        color: "#373434",
        marginLeft: Scale(15),
        marginTop: Scale(5),
        maxWidth: Scale(330)
    },

    heading: {
        flexDirection: "row",
        alignItems: "center"
    },

    emptyView: {
        width: Scale(4),
        height: Scale(4),
        borderRadius: Scale(3),
        backgroundColor: "grey",
        marginHorizontal:Scale(5)
    },
    myCommentViewContainer:{ 
        padding: 5, 
        borderBottomWidth: 1, 
        borderColor: COLORS.inactiveIndicator 
    },
    mycommentTextTitleStyle:{ 
        color: COLORS.darkGray, 
        fontFamily: FONTS.Roboto_Regular, 
        fontSize: rf(1.8), 
        fontWeight: '600' 
    },
    myCommentTextStyle:{ 
        fontSize: rf(2.4), 
        fontFamily: FONTS.Roboto_Medium, 
        marginBottom: hp(2) 
    },
    highlightViewContainer: {
        marginTop: hp(2), 
        flexWrap: 'wrap', 
        flexDirection: 'row'
    },
    highlightTextStyle:{
        fontSize: rf(2.2), 
        color: '#373434', 
        fontFamily: FONTS.Roboto_Regular 
    },
    formediacontainer:{
marginVertical:Scale(20)
    }
    // Customizable Area Start 
    // Customizable Area End
})
