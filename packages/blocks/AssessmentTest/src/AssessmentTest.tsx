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
  FlatList,
  SectionList
  // Customizable Area Start
  // Customizable Area End
} from "react-native";

import AssessmentTestController, {
  Props,
  configJSON,
} from "./AssessmentTestController";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";


import BottomTab from '../Components/BottomTab'
import { COLORS } from "../../../framework/src/Globals";

const DATA = [
  {
    title: "Standard question",
    subTitle: 'Select the correct answer.',
    data: ["True", "false"]
  },
  {
    title: "Question with multiselect",
    subTitle: 'Select one or more answers.',
    data: ["Answer 1", "Answer 2", "Answer 3"]
  },
  {
    title: "Drinks",
    subTitle: 'Select the correct answer.',
    imagesrc: require('../assets/image_question.png'),
    data: ["True", "False"]
  },

];

export default class AssessmentTest extends AssessmentTestController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  // Customizable Area End
  Item({ title }) {
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
      </View>
    )
  };

  render() {
    return (
      // Customizable Area Start
      <SafeAreaView style={{ justifyContent: 'space-between', flex: 1 }}>
        <View style={{ width: '90%', height: hp('85%'), alignSelf: 'center' }}>
          <Text style={{ fontSize: 8, fontWeight: '500', color: '#777185' }}>How the wine is done</Text>
          <Text style={{ fontSize: 32, fontWeight: '700', color: '#373434' }}>Mock exam 1</Text>
          <Text style={{ fontSize: 16, fontWeight: '400', color: '#777185' }}>Answer all the questions and click confirm to see results</Text>
          <SectionList style={{ marginTop: 20 }}
            sections={DATA}
            keyExtractor={(item, index) => item + index}
            stickySectionHeadersEnabled={false}
            renderItem={(item: any) => {
              <View style={{ height: 40, marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={{ width: 20, height: 20, marginLeft: 20, alignItems: 'center', borderRadius: 5, justifyContent: 'center', backgroundColor: COLORS.success }}>

                  <Image style={{ width: 12, height: 12, tintColor: 'white' }}
                    source={require('../assets/RightIcon.png')}
                  />
                </TouchableOpacity>
                <Text style={{ marginLeft: 10, fontSize: 14, fontWeight: '500' }} >{item}</Text>
              </View>
            }

            }
            renderSectionHeader={({ section: { title, subTitle, imagesrc } }) =>
            (
              <View style={{ borderTopWidth: 1, borderColor: '#F0F0F2', marginTop: 10 }}>
                {imagesrc ?
                  <Image style={{ width: '100%', height: 180, borderRadius: 20 }}
                    source={imagesrc}
                  />

                  : null}
                <Text style={{ fontSize: 20, marginTop: 10, fontWeight: '700', color: '#373434' }}>{title}</Text>
                <Text style={{ fontSize: 16, marginTop: 5, fontWeight: '400', color: '#777185' }}>{subTitle}</Text>
              </View>
            )
            }
          />
        </View>
        <BottomTab onPressClose={() => console.log('on close ')} onPressNext={() => console.log('on next')} />
      </SafeAreaView>
      // Customizable Area End
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
});
// Customizable Area End
