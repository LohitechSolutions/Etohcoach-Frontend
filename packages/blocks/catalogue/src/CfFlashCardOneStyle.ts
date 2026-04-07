import { StyleSheet } from "react-native";
import Scale from "../../../components/src/Scale";
import { COLORS } from "../../../framework/src/Globals";
// Customizable Area Start
 // Customizable Area End
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
    },

    imageContainer: {
        width: Scale(300),
        height: Scale(150),
        alignSelf: 'center',
        borderRadius: Scale(11),
        marginTop: Scale(20)
    },
    dotStyle: {
        backgroundColor: '#D9D9D9',
        height: Scale(8),
        width: Scale(8),
        top: 30
    },

    activeDotStyle: {
        backgroundColor: '#FDB92E',
        height: Scale(8),
        width: Scale(8),
        top: 30
    },

    wrapper: {
        // marginTop: Scale(10),
        // justifyContent: 'center'
    },

    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    },

    slide: {
        height: 500,
        width: 375
    },

    buttoncontainer: {
        flexDirection: 'row',
        justifyContent: "space-between"
    },

    unSelected: {
        width: Scale(60),
        height: Scale(60),
        borderRadius: Scale(12),
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "#fff",
        marginLeft: 10,
    },

    selected: {
        width: Scale(60),
        height: Scale(60),
        borderRadius: Scale(12),
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: COLORS.lightRed,
        marginLeft: 10,
    },

    rattingTxt: {
        fontSize: Scale(16),
        color: "white",
        fontWeight: "400"
    },

    rattingTxt1: {
        fontSize: Scale(16),
        color: "grey",
        fontWeight: "400"
    },
    // Customizable Area Start
 // Customizable Area End

})