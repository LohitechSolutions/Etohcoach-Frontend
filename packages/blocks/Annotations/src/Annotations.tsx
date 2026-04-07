import React from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Dimensions,
  TouchableHighlight
  // Customizable Area Start
  // Customizable Area End
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Scale from "../../../components/src/Scale";
import BottemButton from "../../../mobile/src/component/BottemButtonComponent";
import exampleData from './exampleData.js';
import Icon from "react-native-vector-icons/FontAwesome";
import Context from "../../../components/src/context/context";
import { withTranslation } from "react-i18next";

import AnnotationsController, {
  Props,
  configJSON,
} from "./AnnotationsController";
import { RFPercentage as rf } from "react-native-responsive-fontsize";
import { FONTS } from "../../../framework/src/Fonts";
import { COLORS } from "../../../framework/src/Globals";
import WebViewComponent from "../../catalogue/Components/WebViewcomponent";
import WebView from "react-native-webview";
import RenderHTML from "react-native-render-html";
import {WebViewWithTextSelection} from '../Component/WebviewSelection'
import Loader from "../../../components/src/Loader";
import Customfeature1559826823644 from "../../customfeature1559826823644/src/Customfeature1559826823644";
import { addOfflineData, loadingOfflineData, removeOfflineAPIS, updateOfflineData,addOfflineAPis } from "../../../mobile/src/store/actions/OfflineData";
import { addSubscription, removeSubscription,cancelSubscription, updateSubscription } from "../../../mobile/src/store/actions/Subscription";
import { addUserProfile,removeUserProfile } from "../../../mobile/src/store/actions/UserProfile";
import { connect } from 'react-redux';

let COLOR = ['#FFCF7E', '#FF9999', '#A4EBFF', '#95F1C0', '#D1AEFF']



class Annotations extends AnnotationsController {
  
  constructor(props: Props) {
    super(props);
  }

  static contextType = Context;
  renderDescription = () => {
    const {t}:any = this.props;
    let themename= this.state.isItOffline? this.props.navigation?.state?.params?.data?.clickItem?.attributes?.theme_name :this.props.navigation?.state?.params?.data?.themeName
let themeIndex
let lessonIndex
    console.log("annotations props",this.props.navigation?.state?.params?.data)
    return (
      <View style={{}}>
        <View style={{ width: "90%", alignSelf: "center" }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text numberOfLines={1} style={{ fontSize: Scale(13), color: "#777185", maxWidth: Scale(150) }}>
              {!this.state.isItOffline &&this.state.annotionData !== undefined ? this.state.annotionData?.attributes?.course?.course_name
                : themename}
            </Text>
            <Icon name={'square'}
              size={3}
              color={'#777185'}
              style={{ marginHorizontal: hp(0.5) }}
            />
            <Text style={{ fontSize: Scale(13), color: "#777185" }}>{t("Theme")} {!this.state.isItOffline && this.state.annotionData !== undefined ? this.state.annotionData?.attributes?.lesson?.data?.attributes?.theme_id : this.state.themeIndex + 1}</Text>
            <Icon name={'square'}
              size={3}
              color={'#777185'}
              style={{ marginHorizontal: hp(0.5) }}
            />
            <Text style={{ fontSize: Scale(13), color: "#777185" }}>{t("Lesson")} {!this.state.isItOffline &&this.state.annotionData !== undefined ? this.state.annotionData?.attributes?.lesson?.data?.attributes?.lesson_index : this.state.lessonIndex + 1}</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text numberOfLines={1} style={{fontSize: Scale(26),fontFamily: FONTS.Roboto_Bold,marginTop: 10,marginBottom: 10,maxWidth: Scale(300)}}>
            {!this.state.isItOffline && this.state.annotionData !== undefined ? this.state.annotionData?.attributes?.lesson?.data?.attributes?.title: this.props.navigation?.state?.params?.data?.lessonId?.attributes?.title}
            </Text>
          </View>
          <View style={styles.commentView}>
          { this.state.data=="" &&<Text style={styles.commentTxt}>{t("AddComment")}</Text>}
            <TextInput onFocus={
                      this.state.hideKeyboard === false ?
                        () => {
                          this.hideKeyboard()
                          this.setState({ hideKeyboard: true })
                        } : null
                    } style={styles.inputCmmnttxt} multiline={true} defaultValue={this.state.data} onChangeText={(text) => this.setState({ data: text })} onFocus={() => this.setState({ hideKeyboard: false })}
            />
          </View>
        </View>
      </View>
    );
  };

  // Customizable Area Start
  // Customizable Area End

  handleSelectionChange = ({ nativeEvent: { selection } }: any) => this.setState({ selection })

  colorPress = async (item: any) => {
    this.setState({ color: item })

    let data = {
      start: this.state.selection?.start,
      end: this.state.selection?.end,
      color: item
    }
    await this.setState({ colorArray: [...this.state.colorArray, data,] })
  }
  bottemcomponent = () => {
    return (
      <BottemButton
        isPosition={true}
        leftOnPress={() => this.props.navigation.goBack()} rightOnPress={() => {
          console.log("uuuuu--0000",this.myrefannotation) ; this.sendDomtoserver()
       const { navigation } = this.props
          // console.log(navigation, navigation.state.params.data.lession_details_notes)
          if (!navigation.state.params.data.lession_details_notes ) {
          //   // create notes
           this.createNoteApicall()
          }
          else {
            this.editNoteApicall()
           }
        }} 
        save={true} discard={true} />
    )
  }

  render() {
    const {t}:any = this.props;
    const renderSubstring = (mydata:any) => {
      if (mydata !== undefined) {

        const arraysplit = exampleData(mydata)
        const arraysplit1 = exampleData(mydata)
        this.state.colorArray.map((i: any) => {
          arraysplit1.map((it: any, index: any) => {
            if ((i.start <= it.start) && (i.end >= it.end)) {
              arraysplit1[index].color = i.color
            }
          })
        })

        const substring = arraysplit.map((word: any) => {
          let checkElementExist = arraysplit1.find(i => (i.start == word.start))
          return (
            <Text key={word.id} >
              <Text style={{ backgroundColor: !!checkElementExist ? checkElementExist.color : word.color }}>
                {mydata.substring(word.start, word.end)}{''}
              </Text>
            </Text>
          )
        })
        return substring;
      }
    };

    return (
      // Customizable Area Start
      <>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
       
            <KeyboardAvoidingView
            style={{flex:1}}
            
            behavior={this.isPlatformiOS() ? "padding" : undefined}
            // keyboardVerticalOffset={Platform.OS === "ios" ? 200 : 0}
            
            >
                 <ScrollView style={{
            flex: 1, padding: 16,
            paddingHorizontal: Scale(15),
            
          }}
          keyboardShouldPersistTaps="handled"
          >
              <View style={{
                height: '100%'
              }}>
                {this.renderDescription()}
                {/* ===============coustemend======================= */}
                <View
                  style={{ borderBottomWidth: hp(0.15), alignSelf: 'center', marginTop: hp(2.5), width: '90%', borderBottomColor: '#F0F0F2' }} />

                <View style={{ height: hp(4) }}>
                  {/* <TextInput
                    multiline={true}
                    onSelectionChange={this.handleSelectionChange}
                    onSubmitEditing={Keyboard.dismiss}
                    showSoftInputOnFocus={false}
                    editable={Platform.OS === 'ios' ? false : true}
                    contextMenuHidden={true}
                    onSubmit={Keyboard.dismiss}
                    onFocus={
                      this.state.hideKeyboard === false ?
                        () => {
                          this.hideKeyboard()
                          this.setState({ hideKeyboard: true })
                        } : null
                    }
                    // defaultValue={this.props.navigation?.state?.params?.data?.lession_details_notes?.comment ?? ""}
                  /> */}
                
              
                  {/* </TextInput> */}
                </View>
              
               
              {/* <View style={{height:Scale(200),width:Dimensions.get('window').width}}> */}
              {/* {htmlextract.map((e)=> {
                 
                 if(e["p"])
                 {
                  return <Text selectable={true} style={{ fontSize: rf(2.2), fontFamily: FONTS.Roboto_Regular, color: '#373434', fontWeight: '500' }}>{renderSubstring(e["p"])}</Text>
                 }
                 if(e["img"])
                 {
                   return <RenderHTML source={{html:e["img"]}} />
                 }
               
               
               
               })
                 
                 
                 
                 } */}
                 {/* <View style={{ flex: 1 }}> */}
      {/* <WebView
        ref={this.myrefannotation}
        source={{ uri: 'https://www.dictionary.com/browse/note' }}
        javaScriptEnabled={true}
        injectedJavaScript={enableTextSelection}
        onMessage={event => {
          const selectedText = event.nativeEvent.data;
          console.log('Selected Text:', selectedText);
          // Perform your desired actions with the selected text here
        }}
        onShouldStartLoadWithRequest={() => true}
        onLoadEnd={this.onLoadEnd}
        style={{height:Scale(120),width:Scale(300)}}
      />
    </View> */}
    {/* <Customfeature1559826823644 /> */}
    <WebViewWithTextSelection ClearAll={this.ClearAll} selectedColor={this.state.color}  t={this.props.t}  DOM={ this.state.isItOffline? this.props.navigation?.state?.params?.data?.lesson_details?.attributes?.highlight_description ||  this.props.navigation?.state?.params?.data?.lesson_details?.attributes?.description  : this.state.DOM}  lessonData={ this.state.isItOffline? this.props.navigation?.state?.params?.data?.lesson_details?.attributes?.description : this.state.lessonDatafromapi  } saveDomInstate={this.saveDomInstate}  />
                 {/* <RenderHTML source={{html:this.state.text}} /> */}
                {/* </ScrollView> */}
                {/* <View style={{
                  flexDirection: 'row', bottom: Scale(10),marginLeft: wp(2), padding: hp(1), alignItems: 'center', borderRadius: Scale(30),
                  width: wp(76), alignSelf: 'center',
                backgroundColor:'white',
                shadowColor: '#171717',
                shadowOffset: {width: -1, height: 2},
                shadowOpacity: 0.15,
                shadowRadius: 3,
                }}>


                  {COLOR.map((item: any) =>
                    <TouchableOpacity
                      onPress={() => this.colorPress(item)}
                      style={{ height: Scale(31), width: Scale(31), backgroundColor: item, marginLeft: wp(2), borderRadius: Scale(20) }}>
                    </TouchableOpacity>)}
                  <TouchableOpacity onPress={() => this.setState({ colorArray: [] })}>
                    <Text style={{ marginLeft: Scale(10), fontFamily: FONTS.Roboto_Medium, fontSize: rf(2.1), color: '#777185', paddingRight: wp(3) }}>{t("ClearAll")}</Text>
                  </TouchableOpacity>
                </View> */}
                <View style={{marginTop:Scale(30)}}>
                {this.bottemcomponent()}
                </View>
              </View>
              </ScrollView>
            </KeyboardAvoidingView>

        
          {/* ====================================== */}
        <Loader  loading={this.state.showLoader}  />
        </SafeAreaView >

      </>
      // Customizable Area End
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: '100%',
    padding: 16,
    paddingHorizontal: Scale(15),
    // position:'relative'
    // marginLeft: "auto",
    // marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    // maxWidth: 650,
    backgroundColor: "#ffffffff"
  },
  title: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,

  },
  body: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
  },
  bgPasswordContainer: {
    flexDirection: "row",
    backgroundColor: "#00000000",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    padding: 10,
    borderWidth: Platform.OS === "web" ? 0 : 1,
  },
  bgMobileInput: {
    flex: 1,
  },
  showHide: {
    alignSelf: "center",
  },
  imgShowhide: Platform.OS === "web" ? { height: 30, width: 30 } : {},
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
    marginTop: Scale(10),
  },

  commentTxt: {
    fontSize: Scale(14),
    fontWeight: "400",
    lineHeight: Scale(13),
    color: "#777185",
    marginLeft: Scale(15),
    marginTop: Scale(20),
  },

  inputCmmnttxt: {
    fontSize: Scale(14),
    color: "#373434",
    marginLeft: Scale(15),
    marginBottom: Scale(25),
    maxWidth: Scale(330),
    paddingBottom: hp(3),
    height:'70%',
    // backgroundColor:'green'
  },

  commentView: {
    width: '100%',
    height: Scale(142.2),
    borderRadius: Scale(10),
    backgroundColor: "#F2F2F7",
  },
});


const mapStateToProps = (state : any) => {
  return {
    offlineState  : state.rootReducer.offlineReducer,
    userProfileState:state.rootReducer.userProfileReducer,
    subscriptionState:state.rootReducer.subscriptionReducer
  }
}

const mapDispatchToProps = (dispatch : any) => {
  return {
    addOfflineData : (params:any) => {
      dispatch(addOfflineData(params))
    }, 
    updateOfflineData : (params:any) => {
      dispatch(updateOfflineData(params))
    },
    addOfflineAPis: (params:any) => {
      dispatch(addOfflineAPis(params))
  },
    loadingOfflineData : (params:any) => {
      dispatch(loadingOfflineData(params))
    },
    removeSubscription:()=>{
      dispatch(removeSubscription())
    },
    cancelSubscription:()=>{
      dispatch(cancelSubscription())
    },
    addSubscription:(params:any)=>{
      dispatch(addSubscription(params))
    },
    updateSubscription:(params:any)=>{
      dispatch(updateSubscription(params))
    },
    removeOfflineAPIS:()=>{
      dispatch(removeOfflineAPIS())
    },

    addUserProfile:(params:any)=>{
      dispatch(addUserProfile(params))
    },
    removeUserProfile:()=>{
      dispatch(removeUserProfile())
    },
  }
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Annotations));
// Customizable Area End
