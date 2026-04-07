// @ts-nocheck

import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/FontAwesome";
import { COLORS } from "../../../framework/src/Globals";;
import Context from "../../../components/src/context/context";
import {
  NatureImage, UK_Flag, studymedal, Imagereward, graduationHat, downArrow, image_spirits, image_beer, image_wine, image_filter, noData, graps
} from "./assets";
import { withTranslation } from "react-i18next";
// Customizable Area End

import CatalogueController, { Props } from "./CatalogueController";
import { RFPercentage as rf } from "react-native-responsive-fontsize";
import HeaderComponent from "../../../components/src/HeaderComponent";
import FilterModal from "./FilterModal";
import Scale from "../../../components/src/Scale";
import { FONTS } from '../../../framework/src/Fonts';
import Loader from "../../../components/src/Loader";
import NotificationModal from "../../../components/src/NotificationModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import asynchKeys from "../../../mobile/src/utils/asynchKeys";
import { AsynchStoragekey } from "../../../mobile/src/utils";
import NoInternet from "../../Internet/src/Internet";


class Catalogue extends CatalogueController {
  constructor(props: Props) {

    super(props);
    // Customizable Area Start
    // Customizable Area End
  }
  
  static contextType = Context;
  CourceNavigate = async (item: any) => {
    await AsyncStorage.setItem(AsynchStoragekey.AsynchStoragekey.COURCE_NAME, item?.course_name);
    this.props.navigation.navigate('OverViews', { course_id: item?.id, course_name:item?.course_name,courseImage: item?.course_attachment })
  }


  renderItem(item: any) {
    const { t } = this.props;
   console.log('show item dataaaa item', item)
    return (
      <View style={styles.mainList}>
        <TouchableOpacity onPress={() => this.CourceNavigate(item)
          // this.props.navigation.navigate('OverView', { course_id: item?.id, courseImage: item?.course_attachment })
        }>
          <Image source={{uri:item?.course_attachment ?? "https://etohcoachfinal-159129-ruby.b159129.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBYms9IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--7ebbade4727829ddc614227538e7af6b084cf7ab/123.png"} } style={styles.flatListImg} />
          {item?.value === 'Unpaid' && this.state.subscription === 'unsubscribed' ? <View style={{ flexDirection: 'row', position: 'absolute', alignSelf: 'flex-end', top: hp(15.5) }}>
            <View style={{ backgroundColor: COLORS.filterBackground, paddingHorizontal: hp(1), borderRadius: hp(1), height: hp(2.9), justifyContent: 'center', marginRight: hp(1) }}>
              <Text style={{ color: COLORS.white, fontFamily: FONTS.Roboto_Medium, fontSize: rf(1.7) }}>{t("FreeLessons")}</Text>
            </View>
            <View style={{ backgroundColor: COLORS.filterBackground, paddingHorizontal: hp(0.7), borderRadius: hp(1), height: hp(2.9), justifyContent: 'center', marginRight: wp(2) }}>
              <Image source={downArrow} style={{ height: hp(1.6), width: hp(1.5), tintColor: COLORS.white, resizeMode: 'contain' }} />
            </View>
          </View>
            : null}
          <View style={styles.blackLine}>
            {/* <Icon name={'play'}
              size={12}
              color={COLORS.orange}
              style={{ marginLeft: wp(5) }} /> */}
       <Image style={{...styles.courseItemIcon,marginLeft: wp(5)}} source={ item.course_status=="complete"?require("../assets/image_check.png"): require("../assets/play.png") } />

            <Text style={styles.txtNumber}>{item?.user_course_percentage}%</Text>
            <Icon name={'square'}
              size={4}
              color={COLORS.grey}
              style={styles.blackTxt} />
            <Image style={styles.courseItemIcon} source={Imagereward} />
            <Text style={styles.blackTxtNumber}>{item?.user_completed_point}/{item?.course_total_point}</Text>
            <Icon name={'square'}
              size={4}
              color={COLORS.grey}
              style={styles.blackTxt} />
            <Image style={styles.courseItemIcon} source={require("../assets/themePoints.png")} />
            <Text style={styles.blackTxtNumber}>{item?.user_theme_count}/{item?.themes_count}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp(1), marginLeft: wp(2) }}>
            <Text style={styles.itemNav}>{t(item?.drink_type)}</Text>
            <Icon name={'square'}
              size={5}
              color={COLORS.grey}
              style={styles.circleImg} />
            <Text style={styles.itemNav}>{item?.certificate}</Text>
            <Icon name={'square'}
              size={5}
              color={COLORS.grey}
              style={styles.circleImg} />
            <Text style={styles.itemNav}>{item.language_type}</Text>
            <Image source={UK_Flag} style={styles.ukFlag} />

          </View>
          <Text style={{ ...styles.wineDoneTxt, fontFamily: FONTS.Roboto_Bold }}>{item?.course_name}</Text>
          <Text numberOfLines={2} style={styles.complateTxt}>{item?.description}</Text>
          <View style={{ flexDirection: 'row', marginTop: hp(2), marginLeft: wp(3) }}>
            <View style={styles.awardView}>
              <Image source={Imagereward} style={{ height: hp(1.9), width: hp(1.6),marginRight:Scale(4) }} />

              <Text style={styles.awardTxt}>{item?.course_total_point}</Text>
            </View>
            <View style={styles.theameView}>
              <Image source={graduationHat} style={{ tintColor: 'black', height: hp(1.4), width: hp(1.4), marginTop: hp(0.9), }} />

              <Text style={styles.themeTxt}>{item?.themes_count} {t("Themes")}</Text>
            </View>
            <View style={styles.theameView}>
              <Image source={studymedal} style={styles.studyMedalImg} />
              <Text style={styles.themeTxt}>{t(item?.difficulty)}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { t } = this.props;
    console.log('show item dataaaa item', this.state)
    const headerIconList = this.state.headerIconList
      
    const dataLength = this.state.filterId == 0 ? this.state.catlogue_data : this.state.filteredArray
    return (
      // Merge Engine DefaultContainer
      <>
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightRed }}>
          {/* {this.state.isLoading ? <Loader loading={this.state.isLoading} /> : null}  */}
          <View style={{ justifyContent: 'center' }}>
            <HeaderComponent
              onPress={() => this.setState({ notificationBt: true })}
              count={this.state.notificationUnreadCount}
            />
          </View>
          {
            this.state.isConnectionStatus ? (
              <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ marginHorizontal: wp(4) }}>
                  <View style={styles.searchBar}>
                    <Image style={styles.searchIcon} source={require("../assets/imageSearch.png")} />
                    <TextInput
                      value={this.state.search_key}
                      style={styles.searchInput}
                      onChangeText={(text) => this.setState({ search_key: text })}
                      placeholder={t("SearchForCourse")}
                      placeholderTextColor="grey"
                      onSubmitEditing={this.getSearchresults}
                    />
                    <TouchableOpacity onPress={()=>{this.setState({search_key:""},()=>{
                      this.getSearchresults()
                    })}} >
                  { this.state.search_key!==""? <Image style={{height:Scale(20),width:Scale(20)}} source={require("../assets/cancelicon.png")} />:<View></View>}
                    </TouchableOpacity>
                  </View>
                  <View style={styles.listView}>
                    {headerIconList.map((item, index) =>
                      <View  key={index}>
                        <TouchableOpacity
                          onPress={() => {
                            console.log("jjjjjjjj---iiiii-ooo",item)

                             if(item.id === 0)
                             {
                              this.cancelsearchkey()
                                if( this.state.isFilterSelected)
                                {
                                  this.setState({isFilterSelected:false})

                                }
                                else{
                                  this.setState({isFilterSelected:true})
                                }
                             }
                             else{
                              
                              let theItem
                              if(item.value=='Wine')
                              {
                              theItem="wine"
                              }
                              else if(item.value=='Beer')
                              {
                              theItem="beer"
                              }
                              else if(item.value=='Spirits')
                              {
                              theItem="Spirits"
                              }

                              
                           
                             this. AddremoveFilteronPress(item.value, "drinks_types", [])
                             
                             setTimeout(()=>{
                              this.GetFilterList()
                             },500)
                             }
                          }}
                          style={{ height: 40, width: 40, marginLeft: 10, borderRadius: 10, borderWidth: 1, borderColor: COLORS.lightBlueGrey, alignItems: 'center', justifyContent: 'center', backgroundColor: this.functionToreturnBackgroundcolor(item) }}>
                          <Image source={item.name} style={{ height: 25, width: 25, tintColor: this.functionToreturnTintcolor(item)}} />
                        </TouchableOpacity>
                        <Text style={styles.listName}>{item.iconName}</Text>
                      </View>)}
                  </View>
                 
                  <FilterModal functionConnectingfilters={this.functionConnectingfilters} state={this.state} AddremoveFilteronPress={this.AddremoveFilteronPress} visible={this.state.isFilterSelected} GetFilterList={this.GetFilterList} closeAnywhere={() => { this.state.isFilterSelected ? this.setState({ isFilterSelected: false }) : "" }} closeModal={() => this.setState({ isFilterSelected: !this.state.isFilterSelected })} />



                  <FlatList style={{ marginBottom: Scale(100) }}
                    data={this.state.catlogue_data }
                    key={(item: any) => item.data}
                    renderItem={(item) => this.renderItem(item?.item, this.props)}
                    contentContainerStyle={{ paddingBottom: hp(10) }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                  />

                  {(this.state.catlogue_data ?.length == 0) && !this.state.isLoading ?
                    <View style={{ bottom: hp(4) }}>
                      <Image source={noData} style={{ alignSelf: 'center', height: hp(12), width: wp(15) }} />
                      <Text style={{ textAlign: 'center', marginTop: hp(2), fontSize: rf(2.2), fontFamily: FONTS.Roboto_Medium }}>{t("NoCoursesFound")}</Text>
                      <Text style={{ textAlign: 'center', fontSize: rf(1.9), fontFamily: FONTS.Roboto_Regular, color: COLORS.grey, marginTop: hp(0.5) }}>{t("TryExpandingYourSearchOrUsingDifferentKeywords")}</Text>
                    </View>

                    : null}


                </View>
                {this.state.isLoading ? <Loader loading={this.state.isLoading} /> : null}
              </View>
            ) : (
              <NoInternet />
            )

          }
          {
            this.state.notificationBt == true && (
              <NotificationModal
                notificationBtn={this.state.notificationBt}
                CloseModal={() => {this.setState({ notificationBt: false });this.getDashboardData()}}
                BackBtnCloseModal={() => this.setState({ notificationBt: false })}
                navigation={this.props.navigation}
                
                />
            )}
        </SafeAreaView>
      </TouchableWithoutFeedback>

      </>
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.filterBackground,
  },
  headingTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(5),
  },
  hedingText: {
    fontSize: rf(20),
    fontWeight: 'bold',
  },
  drinkConatiner: {
    marginBottom: hp(1),
    marginTop: hp(2)
  },
  drinkText: {
    fontWeight: 'bold',
    paddingHorizontal: hp(1),
  },
  drinksContainer: {
    flexDirection: 'row',
    paddingTop: hp(1),
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: wp(0.1),
    paddingBottom: hp(2),

  },
  drinksContainer1: {
    flexDirection: 'row',
    paddingTop: hp(1),
    paddingBottom: hp(2),
  },
  awardImg: {
    height: hp(1.5),
    width: hp(1.5)
  },
  studyMedalImg: {
    height: hp(1.7),
    width: hp(1.3),
    marginTop: hp(0.8),
    marginLeft: 10
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
  buttonContain: {
    marginTop: hp(10),
  },
  modal: {
    paddingHorizontal: hp(2),
    height: '80%',
    width: '100%',
    borderRadius: hp(3),
    borderColor: '#fff',
    marginTop: hp(20),
    backgroundColor: COLORS.white,
  },
  closeModal: {
    flex: 1,
    backgroundColor: COLORS.filterBackground
  },
  text: {
    color: '#3f2949',
    marginTop: 10
  },
  medalImg: {
    height: hp(1.5),
    width: hp(1.5),
    marginLeft: wp(2.5),
    tintColor: 'white'
  },
  topContainer: {
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    shadowOffset: { width: 10, height: 10 },
    shadowColor: "black",
    shadowOpacity: 1.0
  },
  topBox: {
    width: "50%",
    paddingVertical: 5,
    marginVertical: 12,
    justifyContent: "center",
    alignItems: "center"
  },
  topText: {
    textAlign: "center",
    fontSize: 16,
    color: "#000"
  },
  rightBorder: {
    borderRightWidth: 1,
    borderRightColor: "#ccc"
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 15,
    minHeight: 260,
    position: "relative"
  },
  modalBox: {
    margin: 0,
    width: "100%",
    justifyContent: "flex-end",
    marginBottom: -20
  },
  play: {
    marginLeft: wp(5),
    height: hp(1.2),
    width: hp(1.2)

  },
  closeIcon: {
    position: "absolute",
    right: 15,
    top: 15,
    fontWeight: "normal",
    zIndex: 999
  },
  heading: {
    fontSize: 18,
    color: "#000",
    marginBottom: 15
  },
  sortList: {
    paddingVertical: 8,
    alignItems: "center"
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#ffffffff"
  },
  header: {
    flex: 0.15,
    backgroundColor: COLORS.lightRed
  },
  subContainer: {
    backgroundColor: COLORS.white,
    flex: 1
  },
  headerImage: {
    flexDirection: 'row',
    marginTop: hp(6.5),
    justifyContent: 'space-between',
    marginHorizontal: wp(5)
  },
  appIconImg: {
    height: hp(3.7),
    width: hp(18.3),
    tintColor: COLORS.white
  },
  bellView: {
    height: hp(5.3),
    width: hp(5.3),
    borderRadius: hp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightRed
  },
  searchBar: {
    width: '100%',
    height: hp(6.2),
    backgroundColor: '#f0eff5',
    marginTop: hp(2),
    borderRadius: hp(1),
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchIcon: {
    width: Scale(15),
    height: Scale(15),
    marginLeft: Scale(10)
  },

  searchInput: {
    width: '85%',
    fontSize: rf(2.1),
    padding: hp(1),
  },
  listImgView: {
    marginLeft: wp(4),
  },
  listView: {
    flexDirection: 'row',
    marginTop: hp(2.3),
    marginBottom:hp(2.3)
  },
  listName: {
    textAlign: 'center',
    marginLeft: wp(4),
    fontSize: rf(1.5),
    marginTop: hp(0.5),
    fontFamily: FONTS.Roboto_Regular
  },
  headerListIcon: {
    height: hp(6),
    width: hp(6)
  },
  mainList: {
    width: '98%',
    borderWidth: hp(0.1),
    borderColor: '#f0eff5',
    borderRadius: hp(1.3),
    marginTop: hp(1.2),
    shadowOffset: { width: 1, height: 4 },
    shadowColor: '#f0eff5',
    shadowOpacity: 0.5,
    shadowRadius: 3,
    paddingBottom: 6,
    borderTopRightRadius: hp(1.3),
    borderTopLeftRadius: hp(1.3),
    overflow: 'hidden', // Ensures child elements like images stay within the container
  },
  flatListImg: {
    width: '100%', // Ensure the image takes up the full width of the container
    height: hp(24), // Set a height for the image
    resizeMode: 'cover', // Ensures the image covers the container without stretching
  },
   blackLine: {
    height: hp(2.8),
    width: '100%',
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center'
  },
  blackTxt: {
    marginLeft: wp(2.5)
  },
  txtNumber: {
    fontSize: rf(1.5),
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: wp(3)
  },
  blackTxtNumber: {
    fontSize: rf(1.5),
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: wp(1.5)
  },
  ukFlag: {
    height: hp(0.8),
    width: hp(1.3),
    marginLeft: wp(1.3)
  },
  itemNav: {
    color: COLORS.grey,
    marginLeft: wp(1),
    fontSize: rf(1.4),
    fontFamily: FONTS.Roboto_Regular
  },
  circleImg: {
    marginLeft: wp(1.3)
  },
  wineDoneTxt: {
    fontSize: rf(2.2),
    marginLeft: wp(3),
    marginTop: hp(0.5),
    fontFamily: FONTS.Roboto_Bold
  },
  complateTxt: {
    marginLeft: wp(3),
    width: '88%',
    fontSize: rf(1.7),
    color: COLORS.grey,
    fontFamily: FONTS.Roboto_Regular,
    marginTop: 3
  },
  awardView: {
    height: hp(3),
    // width: wp(11),
    backgroundColor: COLORS.purple,

    borderRadius: hp(0.7),
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    paddingHorizontal: wp(1.7)
  },

  awardTxt: {
    fontSize: rf(1.5),
    color: COLORS.white,
    fontWeight: '600'
  },
  theameView: {
    flexDirection: 'row',
    marginLeft: wp(2.8),
  },
  themeTxt: {
    marginLeft: Scale(5),
    fontWeight: '600',
    fontSize: rf(1.5),
    marginTop: hp(0.7),
  },

  courseItemIcon: {
    resizeMode: "contain",
    width: Scale(13),
    height: Scale(13
    ),
    marginLeft: Scale(5)
  },
  internetImg: {
    height: Scale(97),
    width: Scale(70),
  },
  offlineText: {
    fontFamily: FONTS.Explet_Bold,
    color: COLORS.black,
    fontSize: Scale(20),
    marginTop: Scale(25)
  }


});

export default withTranslation()(Catalogue);
// Customizable Area End
