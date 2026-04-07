import React from "react";

import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Button,
  Platform,
  SafeAreaView,
  // Customizable Area Start
  // Customizable Area End
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";


import CfFlashcards2Controller, {
  Props,
  configJSON,
} from "./CfFlashcards2Controller";
import Context from "../../../components/src/context/context";

import BottomHeader from '../Components/BottomHeader.tsx'
import AppIntroSlider from 'react-native-app-intro-slider';
import { COLORS } from "../../../framework/src/Globals";
import { withTranslation } from "react-i18next";

const slides = [
  {
    key: 1,
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    // image: require('./assets/1.jpg'),
    backgroundColor: '#59b2ab',
  },
  {
    key: 2,
    title: 'Title 2',
    text: 'Other cool stuff',
    //image: require('./assets/2.jpg'),
    backgroundColor: '#febe29',
  },
  {
    key: 3,
    title: 'Rocket guy',
    text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
    //image: require('./assets/3.jpg'),
    backgroundColor: '#22bcb5',
  }
];

export default class CfFlashcards2 extends CfFlashcards2Controller {
  slider: AppIntroSlider | undefined;
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  static contextType = Context;
  // Customizable Area End
  _renderItem = ({ item }) => {
    return (
      <View style={{ alignItems: 'center' }}>

        <View style={[{ width: '90%', borderRadius: 10, height: hp('70%'), alignItems: 'center', marginTop: 10, alignSelf: 'center' }, styles.shadowProp]}>
          <Image style={{ width: '95%', height: hp('18%'), borderRadius: 10, marginTop: 10 }}
            source={require('../assets/Image.png')}
          />
          <View style={{ width: '95%' }}>
            <Text style={{ fontSize: 20, fontWeight: '700', marginTop: 10 }}>{item?.attributes?.title}</Text>
            <Text style={{ fontSize: 16, fontWeight: '400' }}>{item?.attributes?.question}</Text>
          </View>
        </View>


      </View>
    );
  }

  _keyExtractor = (item: Item) => item.title;
  render() {
    const {t}:any = this.props;

    const langaugeDatafromapi = this.context.langaugeData?.meta?.translations;
    return (
      // Customizable Area Start
      <SafeAreaView style={{ flex: 1, justifyContent: 'space-between', backgroundColor: 'white' }}>
        <View style={{ height: hp('85%'), justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.lightRed }}>{this.state.page_index + 1}</Text>
            <Text style={{ fontSize: 12, marginTop: 5, fontWeight: '500', color: '#B5B2BF' }}>{this.state.qustionList.length}</Text>
          </View>
          <AppIntroSlider renderItem={this._renderItem} data={this.state.qustionList} onDone={this._onDone}
            showPrevButton={false}
            ref={(ref) => (this.slider = ref)}
            keyExtractor={this._keyExtractor}
          />
          <TouchableOpacity style={{ width: '90%', alignSelf: 'center', height: 56, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.lightRed, borderRadius: 12 }}
            onPress={() => this.props.navigation.navigate('PollingScr')} >
            <Text style={{ fontSize: 16, fontWeight: '700', color: 'white' }}>{t("REVEALANSWER")}</Text>
          </TouchableOpacity>
        </View>


        <BottomHeader onPressClose={() => this.props.navigation.navigate('OverView')} onPressPrevious={() => {

          if (this.state.page_index == 0) {
            console.log('data lendth ', this.state.page_index)
          }
          else {
            this.setState({ page_index: this.state.page_index - 1 }, () => this.slider?.goToSlide(this.state.page_index, true))
          }

        }} onPressNext={() => {
          if (this.state.page_index == this.state.qustionList.length - 1) {
            console.log('', this.state.page_index)
          }
          else {
            this.setState({ page_index: this.state.page_index + 1 }, () => this.slider?.goToSlide(this.state.page_index, true))
          }
        }} />
      </SafeAreaView>
      // Customizable Area End
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
    padding: 16,
    marginLeft: "auto",
    marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    maxWidth: 650,
    backgroundColor: "#ffffffff",
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
});
// Customizable Area End
