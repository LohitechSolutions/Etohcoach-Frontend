 // Customizable Area Start
 import React from "react";
 import { FlatList, SafeAreaView, View, Text, Image, TouchableOpacity, ScrollView, Platform, Modal, TouchableWithoutFeedback, Button } from "react-native";
 import CatalogueFiveController, { Props } from './CatelogueFiveController';
 import styles from "./CatalogueFIveStyle"
 import Scale from "../../../components/src/Scale";
 import Loader from "../../../components/src/Loader";
 import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
 import ModalComponent from "../../../mobile/src/component/ModalComponent";
 import { lock, Subscription } from "./assets";
 import { COLORS } from "../../../framework/src/Globals";
 import Context from "../../../components/src/context/context";
 import { withTranslation } from "react-i18next";
 import { FONTS } from "../../../framework/src/Fonts";
 import CircularProgresss from "../../../components/src/Circularprogress";
 import { getOfflineAction, updateOfflineData } from "../../../mobile/src/store/actions/OfflineData"
 import { addSubscription, updateSubscription, cancelSubscription, removeSubscription } from "../../../mobile/src/store/actions/Subscription"
 import { connect } from "react-redux"
 import AsyncStorage from "@react-native-async-storage/async-storage";
 import { AsynchStoragekey } from "../../../mobile/src/utils";
 import { CustomNavbarComponentt } from "../../../components/src/Customnavbarcomponent";
 
 class CatalogueFive extends CatalogueFiveController {
     constructor(props: Props) {
         super(props)
     }
     static contextType = Context;
 
     renderHeader = () => {
         const { t }: any = this.props;
         return (
             <View>
                 <View style={styles.headerView}>
                     <View style={styles.courseNameview}>
                         <Text numberOfLines={1} style={styles.itemHeading}>{this.state.course_name}</Text>
                     </View>
                     <View style={styles.headerDot} />
                     <Text style={styles.itemHeading}>{t("Theme")} {this.state.themeIndex + 1}</Text>
                 </View>
                 <Text style={styles.itemStorageName}>{this.state.theme_name}</Text>
             </View>
         )
     }
 
     renderItemFlatlistCell = (item: any, index: any) => {
         const { t }: any = this.props;
         // console.log("lesson title", item,this.state)
         return (
             <TouchableOpacity style={{ justifyContent: 'space-evenly', marginTop: Scale(20), flexDirection: 'row', }}
                 onPress={() =>
                     this.onPress(item, index)
                 }
             >
                 {this.state.flash_cards.length == 0 && this.state.quiz_exams.length == 0 && this.state.courseLesson.length - 1 == index ? this.functionForreturningDotonlastIndex(item?.attributes?.status, item?.attributes?.lesson_type) : <View style={{ alignItems: "center" }}>
                     {item?.attributes?.status?.toLowerCase() == "complete" ?
                         <View style={{ alignItems: "center" }}>
                             <View style={styles.boxView} >
                             </View>
                             <View style={styles.lineViewVisible} />
                         </View>
                         : item?.attributes?.lesson_type === "Payable" && this.state.subscription === 'unsubscribed' ?
                             <View style={{ alignItems: "center" }}>
                                 <View style={styles.boxView1} >
                                     <Image source={require("../assets/blackLock.png")} style={{ height: hp(1), width: hp(1) }} />
                                 </View>
                                 <View style={styles.lineView} />
                             </View>
                             :
                             <View style={{ alignItems: "center" }}>
                                 <View style={styles.boxView1} />
                                 <View style={styles.lineView} />
                             </View>
                     }
                 </View>}
                 <View>
                     {this.state.subscription !== "subscribed" && item?.attributes.lesson_type == "Payable" ?
                         <View style={styles.itemHedingView}>
                             <View style={styles.completeView}>
                                 <Text style={{ ...styles.userCompleted, marginLeft: Scale(15) }}>{t("Locked")}</Text>
                                 <View style={styles.headerDot} />
                                 <Image style={styles.rewardIcon} source={require("../assets/image_reward.png")} />
                                 <Text style={styles.lessonUserPoint}>{item?.attributes?.user_count}/{item?.attributes?.total_count}</Text>
                             </View>
 
                         </View>
                         : <View style={styles.itemHedingView}>
 
                             {item?.attributes?.status?.toLowerCase() == "complete" &&
                                 <View style={styles.completionView}>
                                     <View style={styles.completeIconView}>
                                         <Image style={styles.completeIcon} source={require('../assets/RightIcon.png')} />
                                     </View>
                                     <Text style={styles.userCompleted}>{t("Complete")}</Text>
                                 </View>
                             }
                             {item?.attributes?.status == "current" &&
                                 <View style={styles.completeView}>
                                     <Image style={styles.continuePlay} source={require('../assets/playIcon.png')} />
                                     <Text style={styles.userCompleted}>{t("CurrentLesson")}</Text>
                                 </View>
                             }
                             {item?.attributes?.status?.toLowerCase() == "not started" &&
                                 <View style={styles.completionView}>
                                     <Image style={styles.completeIcon} source={require('../assets/I_vector.png')} />
                                     <Text style={styles.userCompleted}>{t("NotStarted")}</Text>
                                 </View>
                             }
 
                             <View style={styles.headerDot} />
                             <Image style={styles.rewardIcon} source={require("../assets/image_reward.png")} />
                             <Text style={styles.lessonUserPoint}>{item?.attributes?.user_count}/{item?.attributes?.total_count}</Text>
                         </View>}
                     <View style={styles.courseItemList}>
                         <View style={styles.coursItemView}>
                             <Text style={styles.itemType}>{t(this.cardTypeNameSelectingFunction(item?.type))} {index + 1}</Text>
                             <Text numberOfLines={1} style={styles.itemDescriptionHeading}>{item?.attributes?.title}</Text>
                         </View>
                         <Image style={styles.rightArrowIcon} source={require("../assets/imagenav_lesson.png")} />
                     </View>
                 </View>
                
             </TouchableOpacity>
         )
     }
 
     functionForreturningDotonlastIndex = (status: any, type: any,value:any) => {
         return (
             <View style={{ alignItems: "center", marginTop: Scale(10), }}>
                 {status?.toLowerCase() == "complete" ?
                     <View style={{ alignItems: "center" }}>
                         <View style={styles.boxView} />
                     </View>
                     :value=="Payable" || type == "Payable" && this.state.subscription == "unsubscribed" ?
                         <View style={{ alignItems: "center", padding: Scale(4), borderRadius: Scale(4) }}>
                              <View style={styles.boxView1} >
                                     <Image source={require("../assets/blackLock.png")} style={{ height: hp(1), width: hp(1) }} />
                                 </View>
                         </View> :
                         <View style={{ alignItems: "center" }}>
                             <View style={styles.boxView1} />
                         </View>
                 }
             </View>
         )
     }
 
 
 
     renderCourseItemFlatlist = () => {
         return (
             <FlatList
                 data={this.state.courseLesson}
                 renderItem={({ item, index }) => this.renderItemFlatlistCell(item, index)}
             />
         )
     }
 
     renderFlashCardsItemFlatlist = () => {
         if (this.state.isItOffline) {
             return (
                 <FlatList
                     data={this.state.flash_cards[0] ? [this.state.flash_cards[0]] : []}
                     renderItem={({ item, index }) => this.renderFlashCardsItemFlatlistCell(item, index)}
                 />
             )
         } else {
             return (
                 <FlatList
                     data={this.state.flash_cards}
                     renderItem={({ item, index }) => this.renderFlashCardsItemFlatlistCell(item, index)}
                 />
             )
         }
     }
 
     renderFlashCardsItemFlatlistCell = (item: any, index: any) => {
         const { t }: any = this.props;
         console.log('item type for flash card', item, this.state.isItOffline, item?.attributes?.title)
         return (
             <TouchableOpacity style={{ justifyContent: 'space-evenly', marginTop: Scale(20), flexDirection: 'row' }}
                 onPress={() => {
                     // console.log('navigating data', item?.theme_id,'course id',this.state.course_id,'themename',this.state.theme_name,'total count',item?.total_count,'usercount',item?.user_count)
                    if( item?.product_type== "Payable" && this.state.subscription!=="subscribed")
                    {
                     this.setState({subscriptionModal:true})
                     return
                    }
                     this.props.navigation.navigate('OverView',
                         {
                             theme_id: item?.theme_id,
                             isItfromThemesLessonList: true,
                             course_id: this.state.course_id,
                             fromCatalogueFiveToOverview: true,
                             flashCardTitle: this.state.theme_name,
                             totalCardCountFromThemes: item?.total_count,
                             totalUserCardCountFromThemes: item?.user_count,
                             product_type_flashcard:item?.product_type
                         })
                 }}
             >
                 {
                     this.state.quiz_exams.length == 0 && this.state.flash_cards.length - 1 == index ? this.functionForreturningDotonlastIndex(item?.status) : <View style={{ alignItems: "center", marginTop: Scale(10), }}>
                         {
                          item?.product_type== "Payable" && this.state.subscription!=="subscribed" ?
                          <View style={{ alignItems: "center" }}>
                              <View style={styles.boxView1} >
                                     <Image source={require("../assets/blackLock.png")} style={{ height: hp(1), width: hp(1) }} />
                                 </View>
                          {/* <View style={styles.boxView} /> */}
                          <View style={styles.lineView} />
                      </View>:
                         item?.status?.toLowerCase() == "complete" ?
                             <View style={{ alignItems: "center" }}>
                                 <View style={styles.boxView} />
                                 <View style={styles.lineViewVisible} />
                             </View>
                             :
                             <View style={{ alignItems: "center" }}>
                                 <View style={styles.boxView1} />
                                 <View style={styles.lineView} />
                             </View>
                         }
                     </View>}
                 <View >
                     <View style={styles.itemHedingView}>
 
                         {item?.status?.toLowerCase() == "complete" &&
                             <View style={styles.completionView}>
                                 <View style={styles.completeIconView}>
                                     <Image style={styles.completeIcon} source={require('../assets/RightIcon.png')} />
                                 </View>
                                 <Text style={styles.userCompleted}>{t("Complete")}</Text>
                             </View>
                         }
 
                         {item?.status?.toLowerCase() == "current" &&
                             <View style={styles.completeView}>
                                 <Image style={styles.continuePlay} source={require('../assets/playIcon.png')} />
                                 <Text style={styles.userCompleted}>{t("CurrentFlashCard")}</Text>
                             </View>
                         }
                         {item?.status?.toLowerCase() == "not started" &&
                             <View style={styles.completionView}>
                                 <Image style={styles.completeIcon} source={require('../assets/I_vector.png')} />
                                 <Text style={styles.userCompleted}>{t("NotStarted")}</Text>
                             </View>
                         }
                         <View style={styles.headerDot} />
                         <Image style={{ ...styles.flashcardicon }} source={require("../assets/image_flashcards.png")} />
                         <Text style={styles.lessonUserPoint}>{item?.user_count}/{item?.total_count}</Text>
                     </View>
                     <View style={styles.courseItemList}>
                         <View style={styles.coursItemView}>
                             <Text style={styles.itemType}>{this.cardTypeNameSelectingFunction(item?.type)}</Text>
                             <Text numberOfLines={2} style={styles.itemDescriptionHeading}>{t(item?.title)}</Text>
                         </View>
                         <Image style={styles.rightArrowIcon} source={require("../assets/imagenav_lesson.png")} />
                     </View>
                 </View>
             </TouchableOpacity>
         )
     }
 
     renderQuizExamsItemFlatlist = () => {
         return (
             <FlatList
                 data={this.state.quiz_exams}
                 renderItem={({ item, index }) => this.renderQuizExamsItemFlatlistCell(item, index)}
             />
         )
     }
 
     renderQuizExamsItemFlatlistCell = (item: any, index: any) => {
         let progressData = this.functionCircularpogresscalculation(item?.total_count, item?.grade_count)
         const { t }: any = this.props;
         console.log("theme with quiz data @@", item)
         return (
             <TouchableOpacity style={{ justifyContent: 'space-evenly', marginTop: Scale(20), flexDirection: 'row', }}
                 onPress={async() => {
                     
                     if (item?.product_type== "Payable" || item?.value== "Payable" && this.state.subscription !== 'subscribed') {
                         console.log('hellloooo');
                         this.setState({ subscriptionModal: true })
                         return
                       }
                     this.props.navigation.navigate('OverViews', {
                     theme_id: item?.theme_id,
                     theme_type: item?.type,
                     quizexamDetailsFromThemesScreen: item,
                     MockexamDetailsFromThemesScreen: '',
                     course_id: this.state.courseId,
                     course_name: await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.COURCE_NAME),
                     theme_name: this.state.theme_name,
                     itemData: item,
                     // quizExamDatafromOverviewQuizexamModal: [this.state?.quizzesExamCardSelectedItem],
                 }
                 )}}
             >
                 {
                     this.state.quiz_exams.length - 1 == index ? this.functionForreturningDotonlastIndex(item?.status,item?.product_type,item?.value) : <View style={{ alignItems: "center", marginTop: Scale(10), }}>
                         {
                         item?.status?.toLowerCase() == "complete" ?
                             <View style={{ alignItems: "center" }}>
                                 <View style={styles.boxView} />
                                 <View style={styles.lineViewVisible} />
                             </View>
                             :
                             <View style={{ alignItems: "center" }}>
                                 <View style={styles.boxView1} />
                                 <View style={styles.lineView} />
                             </View>
                         }
                     </View>}
                 <View>
                     <View style={styles.itemHedingView}>
 
                         {item?.status?.toLowerCase() == "complete" &&
                             <View style={styles.completionView}>
                                 <View style={styles.completeIconView}>
                                     <Image style={styles.completeIcon} source={require('../assets/RightIcon.png')} />
                                 </View>
                                 <Text style={styles.userCompleted}>{t("Complete")}</Text>
                             </View>
                         }
                         {item?.status?.toLowerCase() == "current" &&
                             <View style={styles.completeView}>
                                 <Image style={styles.continuePlay} source={require('../assets/playIcon.png')} />
                                 <Text style={styles.userCompleted}>{t("CurrentQuiz")}</Text>
                             </View>
                         }
                         {item?.attributes?.status?.toLowerCase() == "not started" || item?.status == "not started" &&
                             <View style={styles.completionView}>
                                 <Image style={styles.completeIcon} source={require('../assets/I_vector.png')} />
                                 <Text style={styles.userCompleted}>{t("NotStarted")}</Text>
                             </View>
                         }
                         <View style={styles.headerDot} />
                         <Image style={styles.flashcardicon} source={require("../assets/quizes.png")} />
                         <Text style={styles.lessonUserPoint}>{item?.user_count}/{item?.total_count}</Text>
                     </View>
                     <View style={styles.courseItemList}>
                         <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' }} >
                             <View style={styles.coursItemView}>
                                 <Text style={styles.itemType}>{t("Quizzes")}</Text>
                                 <View style={{ width: "70%" }}>
                                     <Text  style={{...styles.itemDescriptionHeading,width:Scale(120)}}>{t(item?.title)}</Text>
                                 </View>
                             </View>
                             <View style={{ flexDirection: 'row' }}>
                                 <CircularProgresss width={40} progressColor={progressData?.pointscolor} progress={progressData?.progress} fillColor={progressData?.fillColor} pointscolor={progressData?.pointscolor} textColor={progressData?.textColor} pointsText={progressData?.pointsText} totlatext={progressData?.totlatext} isThisSmall={true} isitquizz={true} />
                                 <Image style={{ ...styles.rightArrowIcon, marginTop: Scale(5) }} source={require("../assets/imagenav_lesson.png")} />
                             </View>
                         </View>
                     </View>
                 </View>
             </TouchableOpacity>
         )
     }
 
     renderStudyContinueButton = () => {
         const { t }: any = this.props;
         return (
             <TouchableOpacity style={styles.continueButtton}
                 onPress={() => this.onPressContinue()} >
                 {/* // onPress={() => this.onPress(item, index)} > */}
                 <Text style={styles.continueStudyTxt}>{t("CONTINUESTUDYING")}</Text>
             </TouchableOpacity>
         )
     }
     BottomNavigatorCustomComponent = () => {
         const { t }: any = this.props;
         return (
             <View style={{
                 width: '100%', height: hp(12), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white',
                 paddingBottom: Platform.OS == 'ios' && this.state.deviceModel == "iPhone 12" || this.state.deviceModel == "iPhone 14 Pro" || this.state.deviceModel == "iPhone 14" ? Scale(20) : Platform.OS == 'ios' ? Scale(65) : Scale(10),
                 paddingHorizontal: Scale(30)
             }}>
                 <TouchableOpacity style={{ alignItems: "center" }} onPress={() => {                    
                     this.props.navigation.navigate("Themes", { course_id: this.props?.navigation?.state?.params?.course_id || this.state?.course_id })
                 }}>
                     <Image style={{ height: Scale(14), tintColor: 'grey', marginBottom: 8, width: Scale(9) }} source={require("../assets/leftArrow.png")} />
                     <Text style={{ color: 'grey', fontSize: Scale(13), fontFamily: FONTS.Roboto_Regular }} >
                         {t("Back")}
                     </Text>
                 </TouchableOpacity>
                 <TouchableOpacity onPress={async() => this.props.navigation.navigate('OverViews', { course_id: this.state?.course_id,course_name:await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.COURCE_NAME) })} style={{ alignItems: "center" }}>
                     <Image
                         style={{ marginBottom: 2, tintColor: "grey", height: Scale(22), width: Scale(22) }}
                         source={require("../assets/overView.png")}
                     />
                     <Text style={{ color: 'grey', fontSize: Scale(13), fontFamily: FONTS.Roboto_Regular }}>
                         {t("Overview")}
                     </Text>
                 </TouchableOpacity>
                 <TouchableOpacity onPress={()=>this.props.navigation.navigate("Themes", { course_id: this.props?.navigation?.state?.params?.course_id || this.state?.course_id })} style={{ alignItems: "center" }}>
                     <Image
                         style={{ marginBottom: 3, tintColor: "black", height: Scale(22), width: Scale(22) }}
                         source={require("../assets/leaderBoard.png")} />
                     <Text style={{ color: 'black', fontSize: Scale(13), fontFamily: FONTS.Roboto_Regular }}>
                         {t("Themes")}
                     </Text>
                 </TouchableOpacity>
                 <TouchableOpacity onPress={async() => this.props.navigation.navigate("Notes",{ course_id: this.props.navigation.state.params.course_id,course_name:await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.COURCE_NAME) })} style={{ alignItems: "center" }}>
                     <Image
                         style={{ marginBottom: 2, tintColor: "grey", height: Scale(22), width: Scale(22) }}
                         source={require("../assets/notes.png")}
                     />
                     <Text style={{ color: 'grey', fontSize: Scale(13), fontFamily: FONTS.Roboto_Regular }}>
                         {t("Notes")}
                     </Text>
                 </TouchableOpacity>
             </View>
         )
     }
 
 
 
     render() {
         console.log(this.state, 'i am checking catalogur 5 screen')
         const { t }: any = this.props;
         return (
             this.state.isLoading ? <Loader loading={true} /> :
                 <>
                     <SafeAreaView style={styles.mainContainer}>
                         {this.renderHeader()}
                         <ScrollView
                             showsVerticalScrollIndicator={false}>
                             {this.renderCourseItemFlatlist()}
                             {this.renderFlashCardsItemFlatlist()}
                             {this.renderQuizExamsItemFlatlist()}
                         </ScrollView>
                         {this.state.continueButtonStatus ? this.renderStudyContinueButton() : <></>}
                         <CustomNavbarComponentt deviceModel={this.state.deviceModel}tintpage={"themes"} backfunction={() => {                    
                     this.props.navigation.navigate("Themes", { course_id: this.props?.navigation?.state?.params?.course_id || this.state?.course_id })}} overviewfunction={async() => this.props.navigation.navigate('OverViews', { course_id: this.state?.course_id,course_name:await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.COURCE_NAME) })} themesfunction={()=>this.props.navigation.navigate("Themes", { course_id: this.props?.navigation?.state?.params?.course_id || this.state?.course_id })} notesfunction={async() => this.props.navigation.navigate("Notes",{ course_id: this.props.navigation.state.params.course_id,course_name:await AsyncStorage.getItem(AsynchStoragekey.AsynchStoragekey.COURCE_NAME) })} />
                     <ModalComponent
                     visible={this?.state?.subscriptionModal}
                     closeModal={() => this.setState({ subscriptionModal: false })}
                     cancel={t("CANCEL")}
                     logout={t("DETAILS")}
                     heding={t("SubscriptionNeeded")}
                     discription={
                         t("BuyASubScriptionPlanToUnlockAllContent")}
                     paddingHorizontal={hp(1)}
                     height={hp(55)}
                     imageIcon={true}
                     image={Subscription}
                     modalType="DEL"
                     headerHorizontal={1}
                     tintcolor={COLORS.lightRed}
                     confirmBtn={() => {
                         
                         this.setState({ subscriptionModal: false });
                         if(this.state.isItOffline){
                           this.props.navigation.navigate('NoInternet',{showHeader:true,from:'subscription'})
                         }else{
                      this.props.navigation.navigate('SubCriptionScreen',{isItfromlessonOrtheme:true})} 
                         
                      }}
                 />
                     </SafeAreaView >
                 </>
 
         )
     }
 }
 
 
 const mapStateToProps = (state: any) => {
     return {
         // offlineData : state.rootReducer.offlineReducer
         offlineState: state.rootReducer.offlineReducer,
         subscriptionState: state.rootReducer.subscriptionReducer
     }
 }
 const mapDispatchToProps = (dispatch: any) => {
     return {
         getOfflineAction: (params: any) => {
             dispatch(getOfflineAction(params))
         },
         updateOfflineData: (params: any) => {
             dispatch(updateOfflineData(params))
         },
         addSubscription: (params: any) => {
             dispatch(addSubscription(params))
         },
         removeSubscription: () => {
             dispatch(removeSubscription())
         }
     }
 };
 
 export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(CatalogueFive));
 // export default withTranslation()(CatalogueFive);
  // Customizable Area End