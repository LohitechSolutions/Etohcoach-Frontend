// Customizable Area Start
import React from "react";
import { View, Text, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, ImageBackground, SafeAreaView, FlatList, Button, ScrollView, Platform } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { UK_Flag, quizImage, mockexamImage, Subtract } from "./assets";
import OverViewController from "./OverViewController";
import Scale from "../../../components/src/Scale";
import styles from "./OverViewStyle"
import Loader from "../../../components/src/Loader";
import ToastMassage from "../../../mobile/src/component/ToastMassage";
import Context from "../../../components/src/context/context";
import { Slider } from 'react-native-elements';
import { FONTS } from "../../../framework/src/Fonts";
import ThemesScr from "./ThemesScr";
import { COLORS } from "../../../framework/src/Globals";
import { withTranslation } from "react-i18next";
import { StackActions } from '@react-navigation/native';
import {getOfflineAction, updateOfflineData} from "../../../mobile/src/store/actions/OfflineData"
import {connect} from "react-redux"
import { CustomNavbarComponentt } from "../../../components/src/Customnavbarcomponent";
import {addSubscription,cancelSubscription,removeSubscription} from "../../../mobile/src/store/actions/Subscription"
import ModalComponent from "../../../mobile/src/component/ModalComponent";
import { Subscription } from "./assets";




class OverView extends OverViewController {
    static contextType = Context;
    renderSubCategory = () => {
        const {t}:any = this.props;
        // console.log("courseIImgae", this.state.courseImage);
        return (
            <TouchableWithoutFeedback onPress={() => this.setState({ disabled: false })}>
                <View>
                    <View>
                    <ImageBackground style={styles.mainImg} source={{uri: this.state.courseImage}} >
                          {this.state?.course_Details?.status!='complete' &&  <View>
                                {this.state.course_Details?.status != "not started" &&
                                    <TouchableOpacity style={styles.menuBar} onPress={() => this.setState({ disabled: !this.state.disabled })}>
                                        <View style={styles.dotView} />
                                        <View style={styles.dotView} />
                                        <View style={styles.dotView} />
                                    </TouchableOpacity>
                                }
                            </View>}
                            <View>
                                {this.state.disabled &&
                                    <TouchableOpacity style={styles.unenrollButton} onPress={() => this.setState({ unEnrollCourse: true, disabled: false })}>
                                        <Text style={styles.unEnRollText}>{t("UnenrollRromTheCourse")}</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        </ImageBackground>
                    </View>
                    <View style={styles.themesView}>
                        <View style={styles.categoryView}>
                            <TouchableOpacity style={styles.themesBox} onPress={() => { if (this.state.course_Details?.status == "not started") { return }; this.props.navigation.navigate("Themes", { course_id: this.props?.navigation?.state?.params?.course_id || this.state?.course_id }) }}>
                                <Text style={styles.themeTxt}>{this.state.course_Details?.course_themes? this.state.course_Details?.course_themes : this.state.course_Details?.themes_count}</Text>
                                <Text style={styles.txtStyle}>{t("Themes")}</Text>
                            </TouchableOpacity>
                            <View style={styles.lineView} />
                            <TouchableOpacity style={styles.themesBox} onPress={() => { if (this.state.course_Details?.status == "not started") { return }; this.props.navigation.navigate("Themes", { course_id: this.props?.navigation?.state?.params?.course_id || this.state?.course_id }) }}>
                                <Text style={styles.themeTxt}>{this.state.course_Details?.course_lessons ? this.state.course_Details?.course_lessons : this.state.course_Details?.lesson_count}</Text>
                                <Text style={styles.txtStyle}>{t("Lessons")}</Text>
                            </TouchableOpacity>
                            <View style={styles.lineView} />
                            <View style={styles.themesBox}>
                                <Text style={styles.themeTxt}>{this.state.course_Details?.course?.difficulty}</Text>
                                <Text style={styles.txtStyle}>{t("Difficulty")}</Text>
                            </View>
                            <View style={styles.lineView} />
                            <View style={styles.themesBox}>
                                <Text style={styles.themeTxt}>{this.state.course_Details?.course?.duration ? this.state.course_Details?.course?.duration : "0h 0m"}</Text>
                                <Text style={styles.txtStyle}>{t("EstimatedTime")}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback >
        )
    }

    renderAvailableCourse = () => {
        const {t}:any = this.props;
        return (
            <TouchableWithoutFeedback onPress={() => this.setState({ disabled: false })}>
                <View >
                    <View style={styles.aboutItemView}>
                        <View style={styles.aboutItem}>
                        <Text style={styles.itemNav}>{this.state.isConnect ? t(this.state.course_Details?.drink_type) : t(this.state.course_Details?.course?.drink_type)}</Text>
                            <View style={styles.circleImg}></View>
                            <Text style={styles.itemNav}>{this.state.course_Details?.course?.certificate}</Text>
                            <View style={styles.circleImg}></View>
                            <Text style={styles.itemNav}>{this.state.isConnect ? this.state.course_Details?.language_type : t(this.state.course_Details?.course?.language_type)}</Text>
                            <Image source={UK_Flag} style={styles.ukFlag} />
                        </View>
                        {this.state.course_Details?.status != "not started" && this.state.course_Details?.user_course_percentage != 100 &&
                            <View style={styles.availableOflineView}>
                                <Text style={styles.offlineTxt}>{t("AvailableOffline")}</Text>
                                <TouchableOpacity style={styles.download}>
                                    <Image style={styles.downLoadOfflineIcon} source={require('../assets/Download.png')} />
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                    {this.state.course_Details?.status != "not started" &&
                        <View style={styles.percantageView}>
                           
                            <Text style={styles.percantageTxt}>{this.state.course_Details?.user_course_percentage}%</Text>
                            <View style={styles.zeroPointView}>
                                <View style={{ width: this.state.course_Details?.user_course_percentage ? JSON.stringify(this.state.course_Details?.user_course_percentage) + "%" : 0, height: Scale(4), borderRadius: Scale(2), backgroundColor: this.state.course_Details?.user_course_percentage == 100 ? COLORS.success : '#FBA100' }}></View>
                            </View>
                           
                        </View>

                    }
              {this.state.course_Details?.status == "complete" &&<Text style={{fontFamily:FONTS.Roboto_Regular,color:COLORS.grey,marginTop:Scale(2),fontSize:Scale(12),marginLeft:Scale(10)}}>{this.convertDateTotext()}</Text>}
                </View>
            </TouchableWithoutFeedback>
        )
    }

   
    renderCourseDescription = () => {
        return (
                <View >
                    <Text numberOfLines={2} style={{...styles.wineDoneTxt,marginVertical:this.state.course_Details?.status != "complete"?Scale(2):Scale(6)}}>{this.state.course_Details?.course?.course_name}</Text>
                
                        <ScrollView scrollEnabled={true}  style={{...styles.descriptionView,height:this.state.course_Details?.status =="complete"?Scale(130):this.state.course_Details?.status == "not started"?Scale(180):Scale(130) }}  >
                        <Text  style={styles.wineAns}>{this.state.course_Details?.course?.description}</Text>
                   </ScrollView>
               
                </View>
        )
    }



    renderCourseItems = () => {
        const {t}:any = this.props;
        // console.log("@@@@@@@courseId=======", this.state)
        // console.log("this.state.course_Details?.point_earned", this.state.course_Details?.point_earned);
        return (
            <TouchableWithoutFeedback onPress={() => this.setState({ disabled: false })}>
                <View style={{ flex: 1, marginTop: Scale(10), justifyContent: 'flex-end' }}>
                    {this.state.course_Details?.status != "not started" &&
                        <View style={styles.mainViewEarnedPoints}>
                            <View style={styles.subCategoryView}>
                                <Image style={styles.rewardImage} source={require("../assets/image_reward.png")} />
                                <Text style={styles.earnedPoints}>{this.state.isConnect ? this.state.course_Details?.user_completed_point : this.state?.course_Details?.point_earned }</Text>
                                {/* <Text style={styles.earnedPoints}>{this.state.course_Details?.point_earned ? this.state.course_Details?.point_earned : this.state.course_Details?.course_total_point}</Text> */}
                                <Text style={styles.rearnedPointTxt}>{t("PointsEarned")}</Text>
                            </View>
                        </View>
                    }
                    <View style={styles.subCategoryItems}>
                        <TouchableOpacity style={styles.subCategoryItemsView}
                            onPress={() => {
                                this.state.course_Details?.status != "not started" && this.setState({ flashCardVisible: true, }, () => !this.state.isItOffline  &&this.onPressFlashcardStart())
                            }}>
                            <View style={styles.completeCourse}>
                                <Image style={styles.flashCardIcon} source={require("../assets/image_flashcards.png")} />
                                {this.state.course_Details?.user_course_percentage == 100 &&
                                    <Image style={styles.flashCardIcon} source={require("../assets/Other.png")} />
                                }
                            </View>
                            {/* {this.state.course_Details &&
                            <View >
                                <Text style={styles.subCategoruItemTxt}>{this.state.course_Details?.course_flashcards}</Text>
                            </View>
                        } */}
                            {this.state.course_Details?.status != "not started" ?
                                <View style={styles.countTotalView}>
                                    <Text style={styles.userCount}>{this.state.course_Details?.user_course_flashcard}</Text>
                                    <Text style={styles.totalCount}>/{this.state.course_Details?.course_flashcards}</Text>
                                </View>
                                :
                                <View >
                                    <Text style={styles.subCategoruItemTxt}>{this.state.course_Details?.course_flashcards}</Text>
                                </View>
                            }
                            <Text style={styles.subItemsTxt}>{t("Flashcards")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.subCategoryItemsView}
                            onPress={() => { this.state.course_Details?.status != "not started" && this.setState({ quzziesModal: true }, () => this.onPressFlashcardStart()) }}
                        >
                            <View style={styles.completeCourse}>
                                <Image style={styles.flashCardIcon} source={require("../assets/quizes.png")} />
                                {this.state.course_Details?.user_course_percentage == 100 &&
                                    <Image style={styles.flashCardIcon} source={require("../assets/Other.png")} />
                                }
                            </View>
                            {this.state.course_Details?.status != "not started" ?
                                <View >
                                    <View style={styles.countTotalView}>
                                        <Text style={styles.userCount}>{this.state.course_Details?.user_course_quizzes}</Text>
                                        <Text style={styles.totalCount}>/{this.state.course_Details?.course_quiz_exams}</Text>
                                    </View>
                                </View>
                                :
                                <Text style={styles.subCategoruItemTxt}>{this.state.course_Details?.course_quiz_exams}</Text>
                            }
                            <Text style={styles.subItemsTxt}>{ t("Quizzes")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.subCategoryItemsView}
                            onPress={() => { this.state.course_Details?.status != "not started" && this.setState({ mocExam: true }, () => this.onPressFlashcardStart()) }}>
                            <View style={styles.completeCourse}>
                                <Image style={styles.itemsImage} source={require("../assets/Vector2.png")} />
                                {this.state.course_Details?.user_course_percentage == 100 &&
                                    <Image style={styles.flashCardIcon} source={require("../assets/Other.png")} />
                                }
                            </View>
                            <View >
                                {this.state.course_Details?.status != "not started" ?
                                    <View style={styles.countTotalView}>
                                        <Text style={styles.userCount}>{this.state.course_Details?.user_mock_exam}</Text>
                                        <Text style={styles.totalCount}>/{this.state.course_Details?.course_mock_exams}</Text>
                                    </View>
                                    :
                                    <Text style={styles.subCategoruItemTxt}>{this.state.course_Details?.course_mock_exams}</Text>
                                }
                            </View>
                            <Text style={styles.subItemsTxt}>{ t("MockExam")}</Text>
                        </TouchableOpacity>
                    </View>
                    {this.state.course_Details?.status == "not started" ||   this.state.course_Details?.status == "unenroll" ?
                        <TouchableOpacity style={styles.startCourseButton} onPress={() => {this.setState({ isVisible: true, })}}>
                            <Text style={styles.startCourseTxt}>{ t("STARTCOURSE")}</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={styles.startCourseButton}
                            onPress={()=>this.RestartCourseFunction()}>
                            <Text style={styles.continueTxt}>{this.state?.course_Details?.user_course_percentage=='100' ?  t("RESTARTCOURSE") :  t("CONTINUECOURSE")}</Text>
                        </TouchableOpacity>
                    }
                </View >
            </TouchableWithoutFeedback >
        )
    }

    renderStartCourseModal = () => {
        const {t}:any = this.props;
        return (
            <View>
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.isVisible}
                >
                    <TouchableWithoutFeedback onPress={() => this.setState({ isVisible: false })}>
                        <View style={styles.modalConatiner}>
                            <View style={styles.innerModalConatin}>
                                <View style={styles.dragButton} />
                                <Image source={require("../assets/greatMsg.png")} style={styles.courceImage} />
                                <Text style={styles.greatTextContain}>{ t("GreatLetsStartByReviewingTheCourse")}</Text>
                                <Text style={styles.browseTextContain}>
                                {t("YouCanAlsoDirectlyBrowseTheFlashcards")}
                                </Text>
                                <TouchableOpacity style={styles.buttonContain} onPress={() => this.onPressCourseStart()}>
                                    <Text style={styles.continueTxt}>{t("CONTINUE")}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        )
    }

    renderUnEnrollModal = () => {
        const {t}:any = this.props;
        return (
            <View>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.unEnrollCourse}
                >
                    <TouchableWithoutFeedback onPress={() => this.setState({ unEnrollCourse: false })}>
                        <View style={styles.modalConatiner}>
                            <View style={styles.innerModalConatin}>
                                <View style={styles.dragButton} />
                                <Image source={require("../assets/unEnroll.png")} style={styles.courceImage} />
                                <Text style={styles.unenrollTxt}>{t("UnenrollFromCourse")}</Text>
                                <Text style={styles.confirmTxtContain}> { t("AreYouSureYouWantToUnenrollFromThisCourse")}</Text>
                                <View style={styles.confirmButton}>
                                    <TouchableOpacity style={styles.cancelButton} onPress={() => this.setState({ unEnrollCourse: false })}>
                                        <Text style={styles.cancelTxt}>{ t("CANCEL")}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { this.onPressUnenrollCourse() }} style={styles.ContinueButton} >
                                        <Text style={styles.continueTxt}>{t("UNENROLL")}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        )
    }

    renderFlashcardModal = () => {
        const {t}:any = this.props;
        let UserCount = this.state.flashcardCount
        let totalCount = this.state.flashcardUserCompletedCount
        let totalFlashCardParsentege = (totalCount / UserCount) * 100
        // console.log("checking datsa from catalogue 5 in overview",UserCount, totalCount);
        return (
            <Modal
                transparent={true}
                animationType="slide"
                visible={this.state.flashCardVisible}
            >
                <TouchableWithoutFeedback onPress={() => { this.setState({ flashCardVisible: false }); this.setState({ dropDown: false, flashCardID: "", themeGetid: "", flashCardTitle: "", flashcardName: '', flashcardCount: "" }) }}>
                    <View style={styles.flashModalConatiner}>
                    <TouchableWithoutFeedback onPress={() => { return }}>
                        <View style={styles.flashInnerModalConatin}>
                            <View style={styles.dragButton} />
                            <Image source={Subtract} style={styles.courceImage} />
                            <View style={styles.reviewContainer}>
                                <Text style={styles.reviewTextContain}>{ t("ReviewFlashcards")}</Text>
                            </View>
                            <View style={styles.selectContainer}>
                                <Text style={{ ...styles.selectTextContain, marginTop: -20, lineHeight: Scale(22) }}>{ t("SelectOneOrManyThemesAndTheNumberOfCards")}</Text>
                            </View>
                            <View style={styles.themeConatin}>
                                <TouchableOpacity style={this.state.dropDown ? styles.selected : styles.notSelected}
                                    onPress={() => this.setState({ dropDown: !this.state.dropDown })}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image style={{ width: wp(4), height: hp(2) }} source={require('../assets/Vector.png')} />
                                        <View style={{ marginLeft: 10 }}>
                                            <Text style={{ color: '#777185', fontSize: Scale(12), fontWeight: '600' }}>{this.state.flashcardName ? this.state.flashcardName : t("Theme")}</Text>
                                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                            <Text numberOfLines={1} style={{ color: '#373434', fontSize: Scale(14), fontWeight: '500', maxWidth: Scale(250) }}>{this.state.flashCardTitle ? this.state.flashCardTitle : t("PleaseSelectATheme")}</Text>
                                          {this.isusersubscribed()=="unsubscribed"&& this.state.product_type_flashcard=="Payable"?<Image source={require("../assets/lock.png")} style={{tintColor:"grey",height:Scale(15),width:Scale(15),marginRight:Scale(5),marginLeft:Scale(20)}} />:<></>}
                                        </View>
                                        </View>
                                    </View>
                                    <Image style={{ width: wp(6), height: hp(3) }} source={require('../assets/Downicon.png')} />
                                </TouchableOpacity>
                                {this.state.dropDown && this.renderFlatlistDropDownList()}
                            </View>
                           {this?.state?.flashCardID?<>
                            <Text style={{ fontSize: 14, color: 'grey', alignSelf: 'center' }}>{t("CARDCOUNT")}</Text>
                            <Text style={{ fontSize: Scale(40), fontWeight: '700', alignSelf: "center" }}>{Math.round(this.state.counterFlash) }</Text>
                            {/* <View style={{ width: '90%', height: 5, borderRadius: 5, backgroundColor: '#ECF1F4', marginTop: 5, marginBottom: 5, alignSelf: "center" }}>
                                <View style={{ width: totalFlashCardParsentege ? JSON.stringify(totalFlashCardParsentege) + "%" : 0, height: 5, borderRadius: 5, backgroundColor: totalFlashCardParsentege == 100 ? COLORS.success : COLORS.lightRed }} />
                            </View> */}
                            {this.Sliderelement()}
                            </>:<View style={{height:5}} />
                            }
                            <View style={styles.buttonsOnFlash}>
                                <TouchableOpacity style={styles.flashButton} onPress={() => {
                                    this.setState({ flashCardVisible: false, flashcardCount: '', flashcardName: '', flashCardTitle: '', dropDown: false, flashCardID: '' });
                                    this.props.navigation.setParams({ isItfromThemesLessonList: false, course_id: this.props?.navigation?.state?.params?.course_id || this.state?.course_id });
                                }}>
                                    <Text style={styles.backTxt}>{t("BACK")}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity disabled={this.state.flashCardID==""  ||this.state?.course_Details?.course_flashcards==0|| Math.round(this.state.counterFlash)==0}  style={{...styles.flashStartButton,backgroundColor:this.state.flashCardID==""  ||this.state?.course_Details?.course_flashcards==0 || Math.round(this.state.counterFlash)==0?"#B5B2BF":COLORS.lightRed}} onPress={() => {
                                    if(this.state.flashCardID=="" )
                                    {
                                        return
                                    }

                                    if(this.state?.course_Details?.course_flashcards==0){
                                      return
                                    }
                                   if(this.isusersubscribed()!=="subscribed" && this.state.product_type_flashcard=="Payable")
                                   {
                                    this.setState({flashCardVisible:false},()=>{
                                        this.setState({subscriptionModal:true})
                                        
                                    })
                                    return
                                   }
                                    this.props.navigation.setParams({ isItfromThemesLessonList: false })
                                    console.log('flashcards on overview',this.state.flashCardID,this.state.typeOfselectedFlashcard)
                                    this.setState({ flashCardVisible: false }, () => { this.state.flashCardID && this.props.navigation.navigate("CfFlashCardOne", { flashCardID: this.state.flashCardID ,typeOfselectedFlashcard:this.state.typeOfselectedFlashcard,flashCardseelctedCount:Math.round(this.state.counterFlash) }) },
                                    )

                                }}>
                                    <Text style={styles.startCourseTxt}>{ t("START")}</Text>
                                </TouchableOpacity>
                            </View>
                         <Loader loading={this.state.isflahscardloading} />
                        </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    renderFlashcardModalifFromOverView = () => {
        const { t }: any = this.props;
        let UserCount = this.props?.navigation?.state?.params?.totalUserCardCountFromThemes
        let totalCount = this.props?.navigation?.state?.params?.totalCardCountFromThemes
        let totalFlashCardParsentege = (UserCount / totalCount) * 100

        // console.log("checking datsa from catalogue 5 in from flashcard overview", this.props.navigation.state.params)

        return (
            <Modal
                transparent={true}
                animationType="slide"
                visible={this.state.iamImounted}
            >
                <TouchableWithoutFeedback >
                    <View style={styles.flashModalConatiner}>
                        <View style={styles.flashInnerModalConatin}>
                            <View style={styles.dragButton} />
                            <Image source={Subtract} style={styles.courceImage} />
                            <View style={styles.reviewContainer}>
                                <Text style={styles.reviewTextContain}>{t("ReviewFlashcards")}</Text>
                            </View>
                            <View style={styles.selectContainer}>
                                <Text style={{ ...styles.selectTextContain, marginTop: -20, lineHeight: Scale(22) }}>{t("SelectOneOrManyThemesAndTheNumberOfCards")}</Text>
                            </View>
                            <View style={styles.themeConatin}>
                                <TouchableOpacity style={this.state.dropDown ? styles.selected : styles.notSelected}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image style={{ width: wp(4), height: hp(2) }} source={require('../assets/Vector.png')} />
                                        <View style={{ marginLeft: 10 }}>
                                            <Text style={{ color: '#777185', fontSize: Scale(12), fontWeight: '600' }}>{this.state.flashcardName ? this.state.flashcardName : t("Theme")}</Text>
                                           <View style={{flexDirection:'row',alignItems:'center'}}>
                                            <Text numberOfLines={1} style={{ color: '#373434', fontSize: Scale(14), fontWeight: '500', maxWidth: Scale(250) }}>{this.props.navigation?.state?.params?.flashCardTitle ?? "How the wine is done?"}</Text>
                                           {this.props.navigation?.state?.params?.product_type_flashcard!=="Payable" &&  this.isusersubscribed()=="unsubscribed"?<Image source={require("../assets/lock.png")} style={{tintColor:"grey",height:Scale(15),width:Scale(15),marginRight:Scale(5),marginLeft:Scale(20)}} />:<></>}
                                            </View>
                                        </View>
                                    </View>
                                    {/* <Image style={{ width: wp(3), height: hp(1) }} source={require('../assets/Downicon.png')} /> */}
                                </TouchableOpacity>
                            </View>
                            <Text style={{ fontSize: 14, color: 'grey', alignSelf: 'center' }}>{t("CARDCOUNT")}</Text>
                            <Text style={{ fontSize: Scale(40), fontWeight: '700', alignSelf: "center" }}>{Math.round(this.state.counterFlash)}</Text>
                            {/* <View style={{ width: '90%', height: 5, borderRadius: 5, backgroundColor: '#ECF1F4', marginTop: 5, marginBottom: 5, alignSelf: "center" }}>
                        {this.Sliderelement()}

                        </View> */}
                            <View>
                                {this.Sliderelement()}
                            </View>
                            <View style={styles.buttonsOnFlash}>
                                <TouchableOpacity style={styles.flashButton} onPress={() => {
                                    this.setState({ flashCardVisible: false, flashcardCount: '', flashcardName: '', flashCardTitle: '', dropDown: false, flashCardID: '' });
                                    this.props.navigation.setParams({ isItfromThemesLessonList: false, course_id: this.props?.navigation?.state?.params?.course_id || this.state?.courseId });
                                     this.props.navigation.navigate('ProductCategory', { theme_id: this.props.navigation?.state?.params?.theme_id, course_id: this.props?.navigation?.state?.params?.course_id || this.state?.courseId })
                                    // this.props.navigation.goBack(null)
                                }}>
                                    <Text style={styles.backTxt}>{t("BACK")}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.flashStartButton} onPress={() => {
                                    console.log(this.props?.navigation?.state?.params, "from the pqram theme id")
                                    this.props.navigation.setParams({ isItfromThemesLessonList: false })
                                    this.setState({ flashCardVisible: false },
                                        () => { this.props?.navigation?.state?.params?.theme_id && this.props.navigation.navigate("CfFlashCardOne", { flashCardID: this.props?.navigation?.state?.params?.theme_id, typeOfselectedFlashcard: this.state.typeOfselectedFlashcard, flashCardseelctedCount: Math.round(this.state.counterFlash) }) })
                                    this.setState({ dropDown: false, flashCardID: "", themeGetid: "", flashCardTitle: "", flashcardName: '', flashcardCount: "" })
                                }}>
                                    <Text style={styles.startCourseTxt}>{t("START")}</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    renderFlatlistDropDownListCell = (item: any) => {
        return (
            <View style={{ alignItems: "center", justifyContent: 'space-evenly' }}>
                <TouchableOpacity style={{ width: Scale(350), alignSelf: "center", backgroundColor: "#F2F2F7", paddingBottom: 5 }} onPress={() => {this.functionResposibleforAddingdropodwnlistTostates(item)}}>
                   <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                    <Text numberOfLines={1} style={{ fontSize: Scale(16), fontWeight: "300", marginLeft: Scale(15), lineHeight: Scale(20), maxWidth: Scale(250) ,marginBottom:Scale(5)}}>{item?.title}</Text>
                    {this.isusersubscribed()!=="subscribed" && item.product_type=="Payable"?<Image source={require("../assets/lock.png")} style={{tintColor:"grey",height:Scale(15),width:Scale(15),marginRight:Scale(5),marginLeft:Scale(20)}} />:<></>}
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderFlatlistDropDownList = () => {
        return (
            <View  >
                <ScrollView style={{height:Scale(150)}}>
                <FlatList
                    data={this.state.courseThemeListData}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => this.renderFlatlistDropDownListCell(item)}
                    // keyExtractor={item => item?.id}
                />
                </ScrollView>
            </View>
        )
    }

    renderQuzziesModal = () => {
        const {t}:any = this.props;
        // console.log("this.state?.quizzesExamCardSelectedItem.quiz", this.state?.quizzesExamCardSelectedItem.quiz, this.props?.navigation?.state?.params)
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.quzziesModal}
            >
                <TouchableWithoutFeedback onPress={()=> this.quizzesmodalhide()}>
                    <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: "#00000090", borderTopLeftRadius: Scale(12), borderTopRightRadius: Scale(12) }}>
                       <TouchableWithoutFeedback onPress={()=>{return}}>
                        <View style={{ height: Scale(550), backgroundColor: "#fff", borderTopLeftRadius: Scale(12), borderTopRightRadius: Scale(12), justifyContent: "space-between" }}>
                            <View style={styles.dragButton} />
                            <Image source={quizImage} style={styles.courceImage} />
                            <Text style={styles.quizTextContain}>{ t("TakeQuiz")}</Text>
                            <Text style={styles.selectTextContain}>{t("SelectTheQuizYouWouldLikeToTake")}</Text>
                            <TouchableOpacity disabled={this.props?.navigation?.state?.params?.quizexamDetailsFromThemesScreen} style={{ flexDirection: 'row', borderRadius: 10, alignItems: 'center', backgroundColor: '#F2F2F7', width: '95%', padding: 13, alignSelf: 'center', justifyContent: 'space-between' }}
                                onPress={() => this.setState({ dropDown: !this.state.dropDown })}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image style={{ width: wp(4), height: hp(2) }} source={require('../assets/Vector.png')} />
                                    <View style={{ marginLeft: 10 }}>
                                    <Text numberOfLines={1} style={{ color: '#777185', fontSize: Scale(12), fontWeight: '600', maxWidth: Scale(250),fontFamily:FONTS.Roboto_Regular }}>{this.state.quizeName ? this.state.quizeName :  t("Theme")}</Text>
                                    <Text numberOfLines={1} style={{ color: '#373434', fontSize: Scale(14), fontWeight: '500', maxWidth: Scale(250),fontFamily:FONTS.Roboto_Regular  }}>{this.state.quizeTitle ? this.state.quizeTitle :  t("PleaseSelectAnyOfTheTheme")}</Text>
                                    </View>
                                    {this.isusersubscribed()!=="subscribed" && this.state?.quizzesExamCardSelectedItem?.value=="Payable"?
                                    <View style={{marginTop:Scale(10),marginLeft:Scale(15)}}>
                                    <Image source={require("../assets/lock.png")} style={{tintColor:"grey",height:Scale(15),width:Scale(15),marginRight:Scale(10)}} />
                                    </View>
                                    :<></>}

                                </View>
                             { this.props?.navigation?.state?.params?.quizexamDetailsFromThemesScreen?<></>: <Image style={{ width: wp(6), height: hp(3) }} source={require('../assets/Downicon.png')} />}
                            </TouchableOpacity>
                            {!this.props?.navigation?.state?.params?.quizexamDetailsFromThemesScreen && this.state?.course_Details?.course_quiz_exams!=0 && this.state.dropDown && this.renderQuizeFlatlist()}
                            <View style={styles.buttonsOnFlash}>
                                <TouchableOpacity style={styles.flashButton} onPress={()=>{this.navigatefromOverviewtothemesForquiz()}}>
                                    <Text style={styles.backTxt}>{t("BACK")}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{...styles.flashStartButton,backgroundColor:this.state.quizeAndMoc_id=="" && !this.props?.navigation?.state?.params?.MockexamDetailsFromThemesScreen || this.state?.course_Details?.course?.course_quiz_exams==0?COLORS.grey:COLORS.lightRed}}
                               disabled={this.state.quizeAndMoc_id=="" &&!this.props?.navigation?.state?.params?.MockexamDetailsFromThemesScreen  || this.state.course_Details?.course?.course_quiz_exams==0}
                                    onPress={()=>{this.gotoQuizfromquizzesmodal()}}>
                                    {/* onPress={() => { this.setState({ quzziesModal: false }, () => { this.state?.quizzesExamCardSelectedItem?.type && this.props.navigation.navigate("QuizzesExamInit", { quizeAndMoc_id: 1, quizeType: this.state.quizeType }) }) }}> */}
                                    {/* onPress={() => { this.setState({ quzziesModal: false }, () => { this.props.navigation.navigate("ReArrangeOrder", { quizeAndMoc_id: 1, quizeType: this.state.quizeType }) }) }}> */}
                                    <Text style={styles.startCourseTxt}>{t("START")}</Text>
                                </TouchableOpacity>
                            </View>
                    <Loader loading={this.state.isquizzloading} />
                        </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    renderQuizeFlatlist = () => {

        return (
            <FlatList
                data={this.state?.quizzExamData?.drop_down_list}
                renderItem={({ item }) => this.renderQuizeFlatlistCell(item)}
            />
        )
    }

    renderQuizeFlatlistCell = (item: any) => {

        return (
            <View style={{ height: Scale(50), alignSelf: 'center', backgroundColor: "#F2F2F7", width: "95%", alignItems: "center", justifyContent: 'space-around' }}>
                <TouchableOpacity
                    style={{ width: "100%", alignSelf: "center", backgroundColor: "#F2F2F7", borderRadius: Scale(12), paddingLeft: Scale(20),flexDirection:'row', justifyContent: 'space-between' ,alignItems:'center' }}
                    onPress={() => this.setState({
                        dropDown: false,
                        quizeAndMoc_id: item?.id,
                        quizeTitle: item?.title,
                        quizeName: item?.type,
                        quizeType: item?.type,
                        quizzesExamCardSelectedItem:item
                    })}>
                    <Text numberOfLines={1} style={styles.mockexamTextstyle}>{item?.title}</Text>
                    {this.isusersubscribed()!=="subscribed" && item.value!=="Free"?<Image source={require("../assets/lock.png")} style={{tintColor:"grey",height:Scale(15),width:Scale(15),marginRight:Scale(10)}} />:<></>}
                </TouchableOpacity>
            </View>
        )
    }

    renderMocExamModal = () => {
        const {t}:any = this.props;
        // console.log("MockexamDetailsFromThemesScreen ::", this.props?.navigation?.state?.params?.quizexamDetailsFromThemesScreen)
        // console.log("MockexamDetailsFromThemesScreen @::", this.props?.navigation?.state?.params?.MockexamDetailsFromThemesScreen)
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.mocExam}
                onRequestClose={() => { console.log("Modal has been closed.") }}>
                <TouchableWithoutFeedback onPress={()=>{this.Mockexamtouchablewithoutfeedback()}}>
                    <View style={styles.flashModalConatiner}>

                        <TouchableWithoutFeedback onPress={() => { return }}>
                            <View style={{ height: this.state.dropDown ? Scale(650) : Scale(500), borderRadius: Scale(12), backgroundColor: "#FFF", justifyContent: 'space-around' }}>
                                <View style={{ ...styles.dragButton, marginBottom: Scale(20) }} />
                                <Image source={mockexamImage} style={styles.courceImage} />
                                <Text style={styles.quizTextContain}>{t("TakeMockExam")}</Text>
                                <Text style={styles.selectTextContain}>{ t("SelectTheMockExamYouWouldLikeToTake")}</Text>
                                <TouchableOpacity disabled={this.props?.navigation?.state?.params?.MockexamDetailsFromThemesScreen} style={{ flexDirection: 'row', borderRadius: 10, alignItems: 'center', backgroundColor: '#F2F2F7', width: '90%', padding: 13, alignSelf: 'center', justifyContent: 'space-between', marginTop: Scale(20) }}
                                    onPress={() => { this.setState({ dropDown: !this.state.dropDown }) }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image style={{ width: wp(5), height: hp(3) }} source={require('../assets/exam.png')} />
                                        <View style={{ marginLeft: 10 }}>
                                            <Text numberOfLines={1} style={{ color: '#777185', fontSize: Scale(12), fontWeight: '600', maxWidth: Scale(250), fontFamily: FONTS.Roboto_Regular }}>{this.state.mocExamName ? this.state.mocExamName : t("MockExam")}</Text>
                                           <View style={{flexDirection:'row'}}>
                                            <Text numberOfLines={1} style={{ color: '#373434', fontSize: Scale(14), fontWeight: '500', maxWidth: Scale(250), fontFamily: FONTS.Roboto_Regular }}>{this.state?.mockExamflashcardSelectedItem?.name ? this.state?.mockExamflashcardSelectedItem?.name : t("PleaseSelectAnyOfTheMockexams")}</Text>
                                            {this.state?.mockExamflashcardSelectedItem?.name && this.state?.mockExamflashcardSelectedItem?.product_type=="Payable" && this.isusersubscribed()=="unsubscribed" ? <Image source={require("../assets/lock.png")} style={{tintColor:"grey",height:Scale(15),width:Scale(15),marginRight:Scale(5),marginLeft:Scale(20)}} />:<></>}

                                            </View>
                                        </View>
                                    </View>
                                   {this.props?.navigation?.state?.params?.MockexamDetailsFromThemesScreen?<></>: <Image style={{ width: wp(6), height: hp(3) }} source={require('../assets/Downicon.png')} />}
                                </TouchableOpacity>
                                <ScrollView style={{ height: Scale(100) }}>
                                    {!this.props?.navigation?.state?.params?.MockexamDetailsFromThemesScreen && this.state.dropDown && this.renderMocExamFlatist()}
                                </ScrollView>
                                <View style={styles.buttonsOnFlash}>
                                    <TouchableOpacity style={styles.flashButton} onPress={()=>{this.mockexammodalnavigatetothemes()}}>
                                        <Text style={styles.backTxt}>{t("BACK")}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                    disabled={!this.state.mockExamflashcardSelectedItem.id || this.state.course_Details.course.course_mock_exams==0}
                                    style={{...styles.flashStartButton,backgroundColor:!this.state.mockExamflashcardSelectedItem.id || this.state.course_Details.course.course_mock_exams==0?COLORS.grey:COLORS.lightRed}} onPress={()=>{this.mockexammodalstartbutton()}}>
                                        <Text style={styles.startCourseTxt}>{t("START")}</Text>
                                    </TouchableOpacity>
                        </View>
                    </View>
                    </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    renderMocExamFlatist = () => {
        return (
            <FlatList
                data={this.state.mocExam_data.data}
                renderItem={({ item, index }) => this.renderMocExamFlatistCell(item, index)}
            />
        )
    }

        renderMocExamFlatistCell = (item: any,index:any) => {
        let entireData=item
        // item=entireData.attributes
        console.log(item, "@@@@ checking from mock exam dropdownlist")
        return (
            <TouchableOpacity onPress={() => this.setState({
                dropDown: false,
                mockExamflashcardSelectedItem: item
            })} style={{ height: Scale(50), alignSelf: 'center', backgroundColor: "#F2F2F7", width: "90%", alignItems: "center", justifyContent: 'space-around' }}>
                <View style={{ width: "100%", alignSelf: "center", backgroundColor: "#F2F2F7", borderRadius: Scale(12), paddingLeft: Scale(20) ,flexDirection:"row",justifyContent:'space-between',alignItems:'center'}} >
                    {/* <Text numberOfLines={1} style={{ fontSize: Scale(16), fontWeight: "700", marginLeft: Scale(15), maxWidth: Scale(250) }}>{item?.exam_type}</Text> */}
                    <Text numberOfLines={1} style={styles.mockexamTextstyle}>{item?.name}</Text>
                {this.isusersubscribed()!=="subscribed" && item.product_type=="Payable"?<Image source={require("../assets/lock.png")} style={{tintColor:"grey",height:Scale(15),width:Scale(15),marginRight:Scale(5),marginLeft:Scale(20)}} />:<></>}
                </View>
            </TouchableOpacity>
        )
    }

    toastMessageRender = () => {
        const {t}:any = this.props;
        return (
            this.state.shouldDisplayunenrollToastmessage ?
                <ToastMassage isSuccess={this.state.unenrollSuccess} toastMassage={!this.state.unenrollSuccess ? t("UnenrollmentFailed") :  t("SuccessfullyUnenrolled")} />
                :
                <></>
        )
    }

    customNavbarComponent = () => {
        const {t}:any = this.props;
        return (
            <View style={{
                width: '100%', height: hp(7.5), flexDirection: 'row', justifyContent: 'space-between',
                marginBottom:Platform.OS != 'ios' ? Scale(20):Platform.OS == 'ios'&& this.state.deviceModel=="iPhone 12" ||this.state.deviceModel=="iPhone 14 Pro"|| this.state.deviceModel=="iPhone 14" ?-13:18,
                paddingTop: Platform.OS != 'ios' ? 20 : Scale(10),
                paddingHorizontal:Scale(30)
            }}>
                <TouchableOpacity style={{ alignItems: "center",marginTop:Scale(4) }} onPress={() => this.props.navigation.goBack(null)}>
                    <Image style={{ height: Scale(14), tintColor: 'grey', marginBottom: 8 ,width:Scale(9)}} source={require("../assets/leftArrow.png")} />

                    <Text style={{ color: 'grey',fontFamily:FONTS.Roboto_Regular,fontSize:Scale(13) }} >
                    {t("Back")}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: "center" }}>
                    <Image style={{ marginBottom:Scale(4)  ,height:Scale(22),width:Scale(22),tintColor:"black"} }source={require("../assets/overView.png")} />
                    <Text style={{fontFamily:FONTS.Roboto_Regular,fontSize:Scale(13) }} >
                    { t("Overview")}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.state.course_Details?.status != "not started" && this.props.navigation.navigate("Themes", { course_id: this.props?.navigation?.state?.params?.course_id || this.state?.courseId }) }} style={{ alignItems: "center" }}>
                    <Image style={{ marginBottom: Scale(4), tintColor: 'grey',height:Scale(22),width:Scale(22) }} source={require("../assets/leaderBoard.png")} />
                    <Text style={{ color: 'grey',fontFamily:FONTS.Roboto_Regular,fontSize:Scale(13)  }}>
                    { t("Themes")}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.state.course_Details?.status != "not started" && this.props.navigation.navigate("Notes",{ course_id: this.props?.navigation?.state?.params?.course_id||this.state.courseId  })} style={{ alignItems: "center" }}>
                    <Image style={{ marginBottom: Scale(4), tintColor: 'grey',height:Scale(22),width:Scale(22) }} source={require("../assets/notes.png")} />
                    <Text style={{ color: 'grey',fontFamily:FONTS.Roboto_Regular ,fontSize:Scale(13) }}>
                    { t("Notes")}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }



Sliderelement=()=>{

  return (
    <View style={{width:'90%',alignSelf:'center'}}>
      <Slider
      value={this.state?.counterFlash ||this.state?.flashcardCount || 1}
      onValueChange={(value)=>{this.setState({counterFlash:value })}}
      maximumValue={ this.state.flashcardCount ||1 }
      maximumTrackTintColor={"#ECF1F4" }
      minimumTrackTintColor={COLORS.lightRed}
      thumbTintColor={COLORS.lightRed}
    />
    </View>
  )
  }




    render() {
        // console.log(this.props.navigation?.state?.params?.quizexamDetailsFromThemesScreen
        //     , "params inside overveiw",this.state,this.state?.course_Details?.course?.course_quiz_exams)
        // console.log('================rutu', this.state.flashcardCount );
       console.log("course_details harshal--", this.state.quizzExamData,this.state.mocExam_data );
   const {t}:any = this.props;
        return (
            <>
                <SafeAreaView style={styles.container} >
                    {this.renderSubCategory()}
                   
                        {this.renderUnEnrollModal()}
                        {this.renderAvailableCourse()}
                        {this.renderCourseDescription()}
                        {this.renderCourseItems()}
                        {this.renderStartCourseModal()}
                        {this.props.navigation?.state?.params?.isItfromThemesLessonList ? !this.state.goingTocongo && this.renderFlashcardModalifFromOverView() : this.renderFlashcardModal()}
                        {this.renderQuzziesModal()}
                        {this.renderMocExamModal()}
                   
                    {this.toastMessageRender()}
                    <Loader loading={this.state.isLoading} />
                    <CustomNavbarComponentt deviceModel={this.state.deviceModel} tintpage={"overview"} backfunction={() => this.props.navigation.goBack(null)} overviewfunction={() => {return}} themesfunction={() => {this.state.course_Details?.status != "not started" && this.props.navigation.navigate("Themes", { course_id: this.props?.navigation?.state?.params?.course_id || this.state?.courseId }) }} notesfunction={() => this.state.course_Details?.status != "not started" && this.props.navigation.navigate("Notes",{ course_id: this.props?.navigation?.state?.params?.course_id||this.state.courseId  })}/>
                </SafeAreaView>
                <ModalComponent
                    visible={this.state.subscriptionModal}
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
                   this.props.navigation.navigate('SubCriptionScreen',{isItfromlessonOrtheme:true})}}
                  }
                />
            </>

        )
    }
}

const mapStateToProps = (state:any) => {
    return {
        offlineState  : state.rootReducer.offlineReducer,
        subscriptionState : state.rootReducer.subscriptionReducer,
      }
  }
  const mapDispatchToProps = (dispatch : any) => {
    return {
      getOfflineAction : (params:any) => {
        dispatch(getOfflineAction(params))
      }, 
      updateOfflineData : (params:any) => {
        dispatch(updateOfflineData(params))
      }
    }
  };
  
  export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(OverView))
  // Customizable Area End