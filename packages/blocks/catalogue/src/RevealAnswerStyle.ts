import { StyleSheet } from "react-native";
import Scale from "../../../components/src/Scale";
import { COLORS } from "../../../framework/src/Globals";

export default StyleSheet.create({
    mainContianer: {
        flex: 1,
    },

    unSelected: {
        width: Scale(60),
        height: Scale(60),
        borderRadius: Scale(12),
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "#fff"
    },

    selected: {
        width: Scale(60),
        height: Scale(60),
        borderRadius: Scale(12),
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: COLORS.lightRed
    },

    rattingTxt: {
        fontSize: Scale(16),
        color: "#fff",
        fontWeight: "400"
    },

    rattingTxt1: {
        fontSize: Scale(16),
        color: "grey",
        fontWeight: "400"
    },

    imageContainer: {
        width: Scale(300),
        height: Scale(170),
        alignSelf: 'center',
        borderRadius: Scale(11),
        marginTop: Scale(20)
    },

    wrapper: {
        marginTop: Scale(10),
        justifyContent: 'center'
    },

})