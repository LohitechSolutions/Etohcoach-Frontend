  // Customizable Area Start
import React from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { withTranslation } from "react-i18next";
import { ActivityIndicator, Image, Modal, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View,Dimensions, Linking } from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/AntDesign";
import Loader from "../../../components/src/Loader";
import Scale from "../../../components/src/Scale";
import Context from "../../../components/src/context/context";
import { FONTS } from "../../../framework/src/Fonts";
import { COLORS } from "../../../framework/src/Globals";
import ModalComponent from "../../../mobile/src/component/ModalComponent";
import exampleData from '../../Annotations/src/exampleData';
import { VideoPlayerAndroid } from '../Components/Androidvideo';
import Audiocomponent from "../Components/Audiocomponent";
import ImageZoomingModal from '../Components/ImageZoomingModal';
import VideoComponent from "../Components/VideoComponent";
import WebViewComponent from '../Components/WebViewcomponent';
import CatalogueStudyController, { Props, configJSON } from './CatalogueStudyController';
import styles from "./CatalogueStudyStyle";
import { Subscription } from "./assets";
import Videoplayer from '../Components/Androidvideo2';
import Orientation from "react-native-orientation";
import { addOfflineData, updateOfflineData, loadingOfflineData,updateOfflineStatus,addOfflineAPis } from "../../../mobile/src/store/actions/OfflineData"
import { connect } from "react-redux";
import { CustomNavbarComponentt } from '../../../components/src/Customnavbarcomponent';
import RenderHtml from "react-native-render-html"
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import WebView from 'react-native-webview';

class CatalogueStudy extends CatalogueStudyController {
    constructor(props: Props) {
        super(props)
    }
    static contextType = Context;
    renderHeader = () => {
        const { t }: any = this.props;
        return (
            <View>
                <View style={{ width: Scale(375), alignSelf: 'center', marginTop: Scale(20) }}>
                    <View style={styles.heading}>
{       !this.state.isItOffline    ?   <Text numberOfLines={1} style={{ fontSize: Scale(13), color: "grey", maxWidth: Scale(150) }}>{ this.state.annotionsData !== undefined&& this.state.annotionsData.length!=0 ? this.state.annotionsData?.attributes?.course?.course_name : this.state.themeName}</Text>:
  <Text numberOfLines={1} style={{ fontSize: Scale(13), color: "grey", maxWidth: Scale(150) }}>

    {this.getCousenameoffline()}
  </Text>

}

                   <View style={styles.emptyView} />
                        <Text style={{ fontSize: Scale(13), color: "grey", }}>{t("Theme")} { !this.state.isItOffline &&  this.state.annotionsData !== undefined&& this.state.annotionsData.length!=0 ? this.state.annotionsData?.attributes?.lesson?.data?.attributes?.theme_id : this.state.themeIndex + 1}</Text>
                        <View style={styles.emptyView} />
                        <Text style={{ fontSize: Scale(13), color: "grey", }}>{t("Lesson")} {!this.state.isItOffline && this.state.annotionsData !== undefined&& this.state.annotionsData.length!=0 ? this.state.annotionsData?.attributes?.lesson?.data?.attributes?.lesson_index : this.state.lessonIndex + 1}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <Text numberOfLines={1} style={{ fontFamily: FONTS.Roboto_Bold, fontSize: Scale(26), marginTop: Scale(10), maxWidth: Scale(300) }}>{this.state.lessonId?.attributes?.title}</Text>
                        <TouchableOpacity onPress={() => 
                        
                        this.props.navigation.navigate("Annotations", {
                            data: this.state, course_id: this.props?.navigation?.state?.params?.course_id
                        })
                        }>
                            <Image style={{ width: Scale(30), height: Scale(30), resizeMode: "contain" }} source={require('../assets/notes.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    renderImageOflesson= ()=>{
        const data = this.state.saveImage;
        let imagess:any ;
        if(data != undefined){
            imagess = `data:image/jpg;base64,${data}`
        }else{
            imagess = null;
        }
        return (
          <TouchableOpacity onPress={()=>{this.setState({selectedImage:'aa'})}}>
              <Image source={this.state.isItOffline ? { uri: this.state.lesson_details?.attributes?.downloadedPath } : { uri: this.state.lesson_details.attributes.image }} style={{ width: wp('90%'), height: hp('25%'), borderRadius: 20, justifyContent: "flex-end", alignItems: 'flex-end' }} />
            <View style={{position:'absolute',bottom:Scale(10),right:Scale(10)}}>
               <Image style={{height:Scale(20),width:Scale(20)}} source={require('../assets/zoom-in.png')} />
            </View>
          </TouchableOpacity>
        )
       }


       functionReturningMedia= ()=>{
        console.log('media type',this.state.lesson_details?.attributes)
        if(this.state?.lesson_details?.attributes?.audio_file)
        {
            return(
                <View style={styles.formediacontainer}>
                <Audiocomponent loader={this.state.audioLoading} currentTime={this.state.audiocurrentDuration} PlayPause={this.functionResponsibleforPausingPlay} Sound={this?.state?.audiostore} url={this.state.isItOffline ? this.state.lesson_details?.attributes?.downloadedPath : this.state?.lesson_details?.attributes?.audio_file} />
                </View>
            )
        }
        else if(this.state?.lesson_details?.attributes?.image )
        {
            return (
                 <View style={styles.formediacontainer}>
                    {this.renderImageOflesson()}
                </View>
            )
        }
       else if( this.state?.lesson_details?.attributes?.video_file )
       {
            return(
                <View  style={styles.formediacontainer}>
                    {!this.state.islessomunmounted && this.renderVideoPlayer()}
                </View>
            )
       }else{
            return (<></>)
       }
       }
   

     

  renderVideoPlayer= ()=>{
    if(Platform.OS=='android')
    {
        return (<>
         {/* <View style={[this.state.myOrientation=='LANDSCAPE' ? {width : wp('100%') , height : hp('100%') } : {width: wp('90%'), height: hp('25%')}]}> */}
          {/* <VideoPlayerAndroid 
            state={this.state} 
            functionForLanscapemode={this.functionForLanscapemode}  
            functionForpotrait={this.functionForpotrait} 
            AssigningnewREf={this.AssigningnewREf} 
            newRef={this.newRef} 
            url={this.state?.lesson_details?.attributes?.video_file}/> */}
            <Videoplayer 
                functionForLanscapemode={this.functionForLanscapemode}     
                functionForpotrait={this.functionForpotrait}  
                isItOffline={this.state.isItOffline} 
                url={this.state.isItOffline?this.state?.lesson_details?.attributes?.downloadedPath :this.state?.lesson_details?.attributes?.video_file}  
            />
        {/* </View>  */}
        </>
        )
    }
    else{
        return (
            <View style={{width: wp('90%'), height: hp('25%')}}>
                <VideoComponent 
                    key={this.state.keyforvideo} 
                    playervalue={this.player} 
                    AssigningRef={this.AssigningRef} 
                    uri={this.state.isItOffline?this.state?.lesson_details?.attributes?.downloadedPath :this.state?.lesson_details?.attributes?.video_file} />
            </View>
        )
    }
   }

    // renderLessonImageDescription = () => {
    //     return (
    //         <View style={{ width: Scale(375), alignSelf: 'center', marginTop: Scale(20) }}>
    //             <TouchableOpacity onPress={()=>{this.setState({selectedImage:'aa'})}}>
    //             <ImageBackground imageStyle={{ borderRadius: 18 }} style={{ width: wp('90%'), height: hp('25%'), borderRadius: 20, marginTop: 20, justifyContent: "flex-end", alignItems: 'flex-end' }} source={this.state.lessonId?.attributes?.image != 'null' ? { uri: this.state.lessonId?.attributes?.image } : require('../assets/natureImage.jpeg')}>
    //                 <TouchableOpacity >
    //                     <Image style={{ width: Scale(20), height: Scale(20), margin: Scale(10) }} source={require('../assets/image_zoom.png')} />
    //                 </TouchableOpacity>
    //             </ImageBackground>
    //             </TouchableOpacity>
    //             <View style={{ marginBottom: 60, paddingBottom: 30, minHeight: Platform.OS !== 'ios' ? "15%" : '35%' }}>
    //                 <Text style={{...styles.descriptionTxt,minHeight:Scale(180)}}>{this.state.lessonId?.attributes?.description}</Text>
    //             </View>
    //         </View>
    //     )
    // }

    renderNextButton = () => {
        // this.functionRenderingButtontext()
        const { t }: any = this.props;

        return (
            <View style={{ marginTop: Scale(30), justifyContent: "flex-end" }}>
                {this.state.annotionsData === undefined||this.state.annotionsData.length==0 ? <TouchableOpacity
                    //                 style={{ width: '90%', alignSelf: 'center', borderRadius: 10, height: Scale(60), marginBottom: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.lightRed }}
                    onPress={async () => {
                        this.scrollViewRef.scrollTo({x: 0, y: 0, animated: true})
                        let nextIndex = this.state.selectedIndex + 1;


                        if (nextIndex == this.state.lessionList.length-1) {

                            let flashcard_data = this.props?.navigation?.state?.params?.flashcard_data[0] || null
                            if (!flashcard_data) {
                                this.setState({ nextButtonTitle: "CONTINUE" })

                            }
                            else{
                                this.setState({ nextButtonTitle: "REVIEWFLASHCARDS" })


                            }

                          }

                     
                        if ((this.state.lessionList[nextIndex]?.type == 'lesson')) {
                            // if(this.state.lessionList[nextIndex]?.attributes?.lesson_type==="Payable" && await AsyncStorage.getItem("USER_SUBSCRIPTION")=="unsubscribed" )
                            if(this.state.lessionList[nextIndex]?.attributes?.lesson_type==="Payable" && this.props.subscriptionState?.subscriptionInfo?.userSubscription=="unsubscribed" )
                            {
                                this.setState({ subscriptionModal: true })
                                return
                            }
                            let commentsArray=this.state.lessionList[nextIndex]?.attributes?.comments
                            this.setState({ selectedIndex: nextIndex, lessonId: this.state.lessionList[nextIndex], lessonIndex: this.state.lessonIndex+1 , clickItem: this.state.lessionList[nextIndex-1],lession_details_notes:commentsArray[0]?.data?.attributes})
                        }
                        else {
                           
                            let flashcard_data = this.props?.navigation?.state?.params?.flashcard_data[0]
                            if (!flashcard_data) {
                                console.log("I am about to go back in rendernext button")
                                this.props.navigation.goBack()
                                this.getLessonCourseDataNext( this.state.lessionList[nextIndex-1] )

                                return
                            }

                            if(flashcard_data?.product_type=="Payable" && this.props.subscriptionState?.subscriptionInfo?.userSubscription=="unsubscribed" )
                            {
                                this.setState({ subscriptionModal: true })
                                return
                            }
                            this.setState({islessomunmounted:true})
                            this.props.navigation.navigate('OverView', { theme_id: this.props?.navigation?.state?.params?.flashcard_data[0]?.theme_id, isItfromThemesLessonList: true, course_id: this.props?.navigation?.state?.params?.course_id, fromCatalogueFiveToOverview: true, flashCardTitle: this.props?.navigation?.state?.params?.flashcard_data[0]?.title, totalCardCountFromThemes: flashcard_data?.total_count, totalUserCardCountFromThemes: flashcard_data?.user_count })
                        }

                        this.getLessonCourseDataNext(this.state.lessionList[nextIndex-1] )
                        this.getLessonCourseDataNextAltered(this.state.clickItem, nextIndex)
                     


                       
                        // console.log("@@@@@ next button =======", this.state.lessionList[nextIndex])
                    // for making the lessondetails to next lesson

                    this.setState({lesson_details:this.state?.lessionList[nextIndex] ?? []},()=>this.audioFetchFunctionWhenGoingnext(nextIndex))
                    // for making the lesson to next lesson detail

                     

                       
                    }}
       
                    style={{ width: '90%', alignSelf: 'center', borderRadius: 10, height: Scale(60), marginBottom: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.lightRed }}>
                    <Text style={{ fontSize: 16, color: 'white', fontWeight: '700', lineHeight: 18.75, letterSpacing: 0.4 }}>{t(this.state?.nextButtonTitle)}</Text>
                </TouchableOpacity> : null}
            </View>
        )
    }
    BottomNavigatorCustomComponent = () => {
        const { t }: any = this.props;
        return (
            <View style={{
                width: '100%', height:Platform.OS == 'ios'&& this.state.deviceModel=="iPhone 12" ||this.state.deviceModel=="iPhone 14 Pro"|| this.state.deviceModel=="iPhone 14"? hp(14):hp(12), flexDirection: 'row',  justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white',
                paddingBottom: Platform.OS == 'ios'&&  this.state.deviceModel=="iPhone 12" ||this.state.deviceModel=="iPhone 14 Pro"|| this.state.deviceModel=="iPhone 14" ? Scale(10):Platform.OS == 'ios'?Scale(65) : Scale(10),
                paddingHorizontal:Scale(30)
            }}>

                <TouchableOpacity style={{ alignItems: "center" }} onPress={() => this.props.navigation.goBack()}>
                    <Image style={{ height: Scale(14), tintColor: 'grey', marginBottom: 8, width: Scale(9) }} source={require("../assets/leftArrow.png")} />
                    <Text style={{ color: 'grey',fontSize:Scale(13) ,fontFamily:FONTS.Roboto_Regular}} >
                        {t("Back")}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.setState({islessomunmounted:true});this.props.navigation.navigate('OverView', { course_id: this.props.navigation.state.params.course_id })}} style={{ alignItems: "center" }}>
                    <Image
                        style={{ marginBottom: 2, tintColor: "grey", height: Scale(22), width: Scale(22) }}
                        source={require("../assets/overView.png")}
                    />
                    <Text style={{ color: 'grey',fontSize:Scale(13) ,fontFamily:FONTS.Roboto_Regular }}>
                        {t("Overview")}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.props.navigation.navigate("Themes", { course_id: this.props?.navigation?.state?.params?.course_id }) } style={{ alignItems: "center" }}>
                <Image
            style={{ marginBottom: 3, tintColor: "black", height: Scale(22), width: Scale(22) }}
            source={require("../assets/leaderBoard.png")}/>        
                       <Text style={{ color: 'black' ,fontSize:Scale(13) ,fontFamily:FONTS.Roboto_Regular}}>
                        {t("Themes")}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.setState({islessomunmounted:true});this.props.navigation.navigate("Notes",{course_id:this.props.navigation?.state?.params?.course_id})}} style={{ alignItems: "center" }}>
                <Image
            style={{ marginBottom: 2, tintColor: "grey", height: Scale(22), width: Scale(22) }}
            source={require("../assets/notes.png")}
          />
                    <Text style={{ color: 'grey',fontSize:Scale(13) ,fontFamily:FONTS.Roboto_Regular }}>
                        {t("Notes")}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }


     CommentData = () => {
        const { t }: any = this.props;

 if( this.commentJsxtrueornot())
 {
    return (
        <View style={styles.myCommentViewContainer}>
        <Text style={styles.mycommentTextTitleStyle}>{t("MyComment")}</Text>
        <Text style={styles.myCommentTextStyle}>{this.state.annotionsData?.attributes?.comment
        }</Text>
    </View>
    )
 }
 else if(this.lessoonlistjsxtrueornot()){
return (<View style={styles.myCommentViewContainer}>
<Text style={styles.mycommentTextTitleStyle}>{ t("MyComment")}</Text>
<Text style={styles.myCommentTextStyle}>{this.state?.lession_details_notes?.comment}</Text>
</View> )
 }
 else{
    return <></>
 }
    }

    render() {
        console.log(this.state,'checking the state in cataloguestudey')
        // const {getTheFiles, isitOffline} = this.context;
        // const datafile = getTheFiles(`lesson_image_${this.state.lesson_details.id}`);
        const { t }: any = this.props;
        
        const renderLessonImageDescription = () => {   
            const injectedJS = `
            (function() {
              const style = document.createElement('style');
              style.type = 'text/css';
              style.innerHTML = \`
                body { font-size: 16px !important; }
                iframe { border: none; width: 100%; height: 100%; }
              \`;
              document.head.appendChild(style);
            })();
            true;
          `;    
          let result = this.htmlContent()
          const hasIframe = result && result.includes('<iframe');
           let Data=this.returnData()
            return (
                Data != undefined ?
                    <View style={{ marginHorizontal: Scale(20), alignSelf: 'center',width:'90%' }}>
                                  {
                                     this.functionReturningMedia()
                                  }              
                     
                        <ScrollView contentContainerStyle={{}} showsVerticalScrollIndicator={false}  >
                            <View style={{}}>
                                {this.functionReturningpotrait()&& this.state.shouldDescriptionvisible && this.CommentData()}
                                {/* =============add highlight ============================ */}
                                
                                 {/* {hightlight(Data)} */}
                               { this.functionReturningpotrait()&& this.state.shouldDescriptionvisible && <View style={{marginTop:Scale(10)}}>
                                {hasIframe ?    <WebView 
    source={{html:result !== undefined ? result: ""}} 
    injectedJavaScript={injectedJS}
    style={{width:responsiveWidth(this.isPlatformiOS() ? 300 : 100),height:responsiveHeight(30)}}
    /> :  
      <RenderHtml contentWidth={responsiveWidth(100)} source={{html:result !== undefined ? result: ""}} />}
</View>}
                                {/* ========================================= */}
                              
                            </View>
                             {  this.functionReturningpotrait() && Data != undefined ? this.renderNextButton() : null}
                        </ScrollView>
                    </View > :
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                        {/* <ActivityIndicator color={COLORS.black} size={'small'} /> */}
                        <Loader loading={true}/>
                    </View>
            )
        }

        return (
            // onPress={() => { this.setState({ selectedImage: null }) }}
            <>
                <SafeAreaView style={styles.mainContainer}>
                    { this.functionReturningpotrait() && this.renderHeader()}
                     <ScrollView contentContainerStyle={{ flexGrow: 1 }} ref={(ref) => { this.scrollViewRef = ref; }}>
                 {/* {Platform.OS== "android" && !this.state?.lesson_details?.attributes?.audio_file  && !this.state?.lesson_details?.attributes?.image  && <VideoPlayerAndroid state={this.state} functionForLanscapemode={this.functionForLanscapemode}  functionForpotrait={this.functionForpotrait} AssigningnewREf={this.AssigningnewREf} newRef={this.newRef} />} */}
                 {/* {Platform.OS== "android" && <VideoPlayerAndroid state={this.state} functionForLanscapemode={this.functionForLanscapemode}  functionForpotrait={this.functionForpotrait} AssigningnewREf={this.AssigningnewREf} newRef={this.newRef} />} */}
              {/* <Videoplayer functionForLanscapemode={this.functionForLanscapemode}  functionForpotrait={this.functionForpotrait} AssigningnewREf={this.AssigningnewREf} /> */}
                        { renderLessonImageDescription()}
                        
                    </ScrollView> 
                   {this.state.selectedImage == "aa"? <Modal visible={this.state.selectedImage == "aa"}>
                        <TouchableWithoutFeedback  >
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ width: '100%' }}> 
                                    <ImageZoomingModal url={this.state.isItOffline ? this.state?.lesson_details?.attributes?.downloadedPath : this.state?.lesson_details?.attributes?.image} />
                                </View>
                                <TouchableOpacity onPress={() => { this.setState({ selectedImage: null }) }} style={{paddingHorizontal:Scale(10),paddingVertical:Scale(10),borderWidth:1,borderColor:COLORS.black,borderRadius:40}} >
                               <Icon name="close" size={Scale(25)} />
                               </TouchableOpacity>
                            </View>
                           
                        </TouchableWithoutFeedback>
                    </Modal>:<></>}
                    {/* <Loader loading={this.state.showLoader} /> */}
                    {/* {this.state.showLoader && */}
                    {/* <ActivityIndicator color={COLORS.black} size={'small'} /> */}
                    {/* } */}
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
                    confirmBtn={this.confirmbtnfunction}

                />      
                          {  this.functionReturningpotrait() &&<CustomNavbarComponentt deviceModel={this.state.deviceModel} tintpage={"themes"} backfunction={() => this.props.navigation.goBack()} overviewfunction={() => {this.setState({islessomunmounted:true});this.props.navigation.navigate('OverViews', { course_id: this.props.navigation.state.params.course_id })}} themesfunction={()=>{}} notesfunction={() => {this.setState({islessomunmounted:true});this.props.navigation.navigate("Notes",{course_id:this.props.navigation?.state?.params?.course_id})}} />}

                </SafeAreaView>
            </>
        )

    }
}

const mapStateToProps = (state: any) => {
    return {
        // offlineData : state.rootReducer.offlineReducer
        offlineState: state.rootReducer.offlineReducer,
        subscriptionState:state.rootReducer.subscriptionReducer
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        addOfflineData: (params:any) => {
            dispatch(addOfflineData(params))
        },
        updateOfflineData: (params:any) => {
            dispatch(updateOfflineData(params))
        },
        updateOfflineStatus: (params:any) => {
            dispatch(updateOfflineStatus(params))
        },
        loadingOfflineData: (params:any) => {
            dispatch(loadingOfflineData(params))
        },
        addOfflineAPis: (params:any) => {
            dispatch(addOfflineAPis(params))
        },
    }
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(CatalogueStudy));
// Customizable Area End