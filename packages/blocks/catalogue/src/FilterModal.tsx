//------- Import Statement -------//
// Customizable Area Start 
import React from "react";
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, SafeAreaView, FlatList, TouchableWithoutFeedback } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { RFPercentage, RFValue as rf } from "react-native-responsive-fontsize";
import ButtonComponent from '../../../mobile/src/component/ButtonComponent';
import { COLORS } from "../../../framework/src/Globals";
import CatalogueController from "./CatalogueController";
import { FONTS } from "../../../framework/src/Fonts";
import Context from "../../../components/src/context/context";

import { withTranslation } from "react-i18next";

//------- Class Declaration -------//
class FilterModal extends CatalogueController {
    //------- Class Constructor -------//
    static contextType = Context;
    constructor(props) {
        super(props);
        //------- States -------/
    }
    //------- Render -------//
    render() {
        const {t}:any = this.props;
        console.log(this, "cheking  modalllll")
        // const drinks_types = [
        //     {
        //         id: 1,
        //         type: 'drinks_type',
        //         title: '',
        //         mytitle: ''
        //     },
        //     {
        //         id: 2,
        //         type: 'drinks_type',
        //         title:t("Wines"),
        //         mytitle: 'wine'
        //     },
        //     {
        //         id: 3,
        //         type: 'drinks_type',
        //         title: t("Beers"),
        //         mytitle: 'beer'
        //     },
        //     {
        //         id: 4,
        //         type: 'drinks_type',
        //         title: t("Spirits"),
        //         mytitle: 'Spirits'
        
        //     },
        //     {
        //         id: 5,
        //         type: 'drinks_type',
        //         title: t("new"),
        //         mytitle: 'Spirits'
        
        //     }
        // ]
        const drinks_types=this.props.state.dynamicDrinktype
        const difficulty = [
            {
                id: 1,
                type: 'difficulty',
                title: '',
                mytitle: ''
        
            },
            {
                id: 2,
                type: 'difficulty',
                title: t("Beginner"),
                mytitle: 'Beginner'
            },
            {
                id: 3,
                type: 'difficulty',
                title:  t("Intermediate"),
                mytitle: 'Intermediate'
            },
            {
                id: 4,
                type: 'difficulty',
                title: t("Expert"),
                mytitle: 'Expert'
            }
        ]  
        // const certificate = [
        //     {
        //         id: 1,
        //         type: 'certificate',
        //         title: '',
        //         mytitle: ''
        //     },
        //     {
        //         id: 2,
        //         type: 'certificate',
        //         title: 'WSET',
        //         mytitle: 'WSET'
        //     },
        //     {
        //         id: 3,
        //         type: 'certificate',
        //         title: 'CFV',
        //         mytitle: 'CFV'
        //     },
        //     {
        //         id: 4,
        //         type: 'certificate',
        //         title: 'new1',
        //         mytitle: 'new1'
        //     },
        //     {
        //         id: 6,
        //         type: 'certificate',
        //         title: 'new2',
        //         mytitle: 'new2'
        //     }
        // ]

        const certificate=this.props.state.dynamicCertificate

        const completion = [
            {
                id: 1,
                type: 'completion',
                title: '',
                mytitle: ''
            },
            {
                id: 2,
                type: 'completion',
                title: t("NotStarted"),
                mytitle: 'not_started',
        
            },
            {
                id: 3,
                type: 'completion',
                title: t("InProgress"),
                mytitle: 'inprogress'
            },
            {
                id: 4,
                type: 'completion',
                title: t("Complete"),
                mytitle: 'complete'
            }
        ]
        const ContentAvailable = [
            {
                id: 1,
                type: 'ContentAvailable',
                title: '',
                mytitle: ''
            },
            {
                id: 2,
                type: 'ContentAvailable',
                title:  t("WithFreeContentOnly"),
                mytitle: 'Unpaid'
            },
        
        ]

        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.props.visible}
            >
                <TouchableWithoutFeedback onPress={() => { this.props.closeAnywhere()}}>
                    <View style={styles.modalBackground}>
                        <TouchableWithoutFeedback onPress={() => { return }}>

                            <View style={styles.modal}>
                                <View style={{ width: '15%', height: 5, backgroundColor: COLORS.filterBox, alignSelf: 'center', marginTop: '5%', borderRadius: 4 }}>
                                </View>
                                <View style={styles.headingTextContainer}>
                                    <Text style={styles.hedingText}>{t("Filters")}</Text>
                                </View>
                                <View style={styles.drinkConatiner}>
                                    <Text style={styles.drinkText}>{t("ContentAvailability")}</Text>
                                </View>
                                <View style={[styles.drinksContainer]}>
                                    <FlatList
                                        data={ContentAvailable}
                                        horizontal={true}
                                        renderItem={({ item }: { item: any }) =>
                                            // title:'In progress'
                                            <TouchableOpacity onPress={() => { this.props.AddremoveFilteronPress(item.mytitle, "content_availability", ContentAvailable) }} style={this.props.state.content_availability.includes(item.mytitle) ? styles.allConatinerPressed : styles.allConatiner}><Text style={this.props.state.content_availability.includes(item.mytitle) ? styles.allTextPressed : {color:COLORS.black}}>{item?.mytitle == '' ? t("All") : item?.title}</Text></TouchableOpacity>
                                        }
                                    />
                                </View>
                                <View style={styles.drinkConatiner}>
                                    <Text style={styles.drinkText}>{ t("DrinksType")}</Text>
                                </View >
                                <View style={[styles.drinksContainer]}>
                                    <FlatList
                                        data={drinks_types}
                                        horizontal={true}
                                        renderItem={({ item }: { item: any }) =>
                                            // title:'In progress'
                                            // <TouchableOpacity
                                            //     onPress={() => { this.props.AddremoveFilteronPress(item.mytitle, "drinks_types", drinks_types) }}
                                            //     style={this.props.state.drinks_types.includes(item.mytitle) ? styles.allConatinerPressed : styles.allConatiner}>
                                            //     <Text style={this.props.state.drinks_types.includes(item.mytitle) ? styles.allTextPressed : null}>{item?.mytitle == '' ? "All" : item?.title}</Text>
                                            // </TouchableOpacity>
                                            <TouchableOpacity onPress={() => { this.props.AddremoveFilteronPress(item.mytitle, "drinks_types", drinks_types) }} style={this.props.state.drinks_types.includes(item.mytitle) ? styles.allConatinerPressed : styles.allConatiner}><Text style={this.props.state.drinks_types.includes(item.mytitle) ? styles.allTextPressed : {color:COLORS.black}}>{item?.mytitle == '' ? t("All") : item?.title}</Text></TouchableOpacity>
                                        }
                                    />
                                </View>
                                <View style={styles.drinkConatiner}>
                                    <Text style={styles.drinkText}>{t("Difficulty")}</Text>
                                </View>
                                <View style={styles.drinksContainer}>
                                    <FlatList
                                        data={difficulty}
                                        horizontal={true}
                                        renderItem={({ item }: { item: any }) =>
                                            <TouchableOpacity onPress={() => { this.props.AddremoveFilteronPress(item.mytitle, "difficulty", difficulty) }} style={this.props.state.difficulty.includes(item.mytitle) ? styles.allConatinerPressed : styles.allConatiner}><Text style={this.props.state.difficulty.includes(item.mytitle) ? styles.allTextPressed : {color:COLORS.black}}>{item?.mytitle == '' ? t("All") : item?.title}</Text></TouchableOpacity>
                                        }
                                    />

                                </View>
                                <View style={styles.drinkConatiner}>
                                    <Text style={styles.drinkText}>{t("Certificate")}</Text>
                                </View>
                                <View style={styles.drinksContainer}>
                                    <FlatList
                                        data={certificate}
                                        horizontal={true}
                                        renderItem={({ item }: { item: any }) =>
                                            <TouchableOpacity onPress={() => { this.props.AddremoveFilteronPress(item.mytitle, "certificate", certificate) }} style={this.props.state.certificate.includes(item.mytitle) ? styles.allConatinerPressed : styles.allConatiner} >
                                                <Text style={this.props.state.certificate.includes(item.mytitle) ? styles.allTextPressed : {color:COLORS.black}}>{item?.mytitle == '' ? t("All") : item?.mytitle}</Text></TouchableOpacity>
                                        }
                                    />


                                </View>
                                <View style={styles.drinkConatiner}>
                                    <Text style={styles.drinkText}>{ t("Completion")}</Text>
                                </View>
                                <View style={styles.drinksContainer1}>
                                    <FlatList
                                        data={completion}
                                        horizontal={true}
                                        renderItem={({ item }: { item: any }) =>
                                            <TouchableOpacity 
                                                onPress={() => { this.props.AddremoveFilteronPress(item.mytitle, "completion", completion) }} 
                                                style={this.props.state.completion.includes(item.mytitle) ? styles.allConatinerPressed : styles.allConatiner} >
                                                    <Text style={this.props.state.completion.includes(item.mytitle) ? styles.allTextPressed : {color:COLORS.black}}>
                                                        {item?.mytitle == '' ?  t("All") : item?.title}
                                                    </Text>
                                            </TouchableOpacity>
                                        }
                                    />

                                </View>
                                <View style={styles.buttonContain}>
                                    <ButtonComponent BtnText={t("APPLYFILTER")} testID={'Filter'} onpress={() => { this.props.GetFilterList(); this.props.closeModal(); console.log(this.state, 'checking the state just') }} />
                                </View>
                            </View >
                        </TouchableWithoutFeedback >

                    </View >
                </TouchableWithoutFeedback >
            </Modal >

        )


    }
}
// Customizable Area Start
const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    closeModal: {
        flex: 1,
        backgroundColor: COLORS.filterBackground
    },
    modal: {
        paddingHorizontal: hp(2),
        height: '90%',
        width: '100%',
        borderRadius: hp(3),
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderColor: '#fff',
        marginTop: hp(20),
        backgroundColor: COLORS.white,
    },
    headingTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: hp(2),
    },
    hedingText: {
        fontFamily: FONTS.Explet_SemiBold,
        fontSize: rf(22),
    },
    drinkConatiner: {
        marginBottom: hp(1),
        marginTop: hp(2)
    },
    drinkText: {
        fontWeight: 'bold',
        paddingHorizontal: hp(1),
        fontFamily:FONTS.Roboto_Bold
    },
    drinksContainer: {
        flexDirection: 'row',
        paddingTop: hp(1),
        borderBottomColor: COLORS.filterBox,
        borderBottomWidth: wp(0.1),
        paddingBottom: hp(2),

    },
    drinksContainer1: {
        flexDirection: 'row',
        paddingTop: hp(1),
        paddingBottom: hp(2),
    },
    allConatiner1: {
        height: hp(4),
        paddingHorizontal: hp(1),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: hp(1),
        marginLeft: hp(1),
        backgroundColor: 'rgba(42,39,39,1)',
    },
    allConatiner: {
        height: hp(4),
        paddingHorizontal: hp(1),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: hp(1),
        marginLeft: hp(1),
        backgroundColor: COLORS.filterBox,
    },
    allConatinerPressed: {
        height: hp(4),
        paddingHorizontal: hp(1),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: hp(1),
        marginLeft: hp(1),
        backgroundColor: COLORS.black,
    },
    allTextPressed: {
        color: COLORS.white
    },
    buttonContain: {
        marginTop: hp(1),
    },

});

export default withTranslation()(FilterModal);
// Customizable Area End