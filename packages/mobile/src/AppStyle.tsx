import { StyleSheet, Platform } from 'react-native';
import scale, { verticalScale } from '../../components/src/Scale';

export default StyleSheet.create({

    outerContainer: {
        flex: 1,
        alignSelf: 'center',
        alignItems: 'center'
    },

    tabContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(17),
        // backgroundColor: COLORS.white,
    },

    tabLabel: {
        fontSize: scale(10),
        marginTop: verticalScale(7.5),
    },

    homeIcons: {
        width: scale(20),
        height: scale(20),
        resizeMode: "contain",
        // backgroundColor:"red"
    },

    dashIcon: {
        width: scale(17),
        height: scale(17),
        resizeMode: 'contain',
        tintColor:"#000"
    },

    dashIcon2 : {
        width: scale(17),
        height: scale(17),
        resizeMode: 'contain',
        tintColor:"grey"
    },

    catalogueIcon : {
        width: scale(24),
        height: scale(24),
        resizeMode: 'contain',
        tintColor:"#000"
    },
    catalogueIcon1 : {
        width: scale(24),
        height: scale(24),
        resizeMode: 'contain',
        tintColor:"grey"
    },

    exploreIcons: {
        width: scale(21),
        height: scale(21),
    },

    searchIcons: {
        width: scale(21),
        height: scale(21),
    },

    wishListIcons: {
        width: scale(22.5),
        height: scale(19.8),
    },

    profileIcons: {
        width: scale(21),
        height: scale(21),
    },

    bottomTabStyle: {
        height: scale(66),
        width: '100%',
        alignSelf: 'center',
    },

    mainContainer: {
        flex: 1,
        backgroundColor: '#ffffff'
    },

    componentView: {
        width: "100%",
        height: "100%",
        justifyContent: 'center',
        zIndex: 100,
        position: 'absolute',
        backgroundColor: 'transparent',
    },

    sliderView: {
        height: scale(40),
        borderTopRightRadius: scale(8),
        borderTopLeftRadius: scale(8),
        backgroundColor: "#000000",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    blankView: {
        marginLeft: scale(60)
    },

    sliderViewBtn: {
        height: scale(40),
        width: scale(70),
        justifyContent: 'center',
        alignItems: 'center',
    },

    sliderViewBtnView: {
        backgroundColor: '#ffffff',
        height: scale(3),
        width: scale(45),
        borderRadius: scale(2),
    },

    closeBtnView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: scale(10),
    },

    minusBtn: {
        margin: scale(10)
    },

    minusImageBtn: {
        height: scale(20),
        width: scale(20),
    },

    closeBtn: {
        margin: scale(10)
    },

    closeImageBtn: {
        height: scale(20),
        width: scale(20),
    },

});

