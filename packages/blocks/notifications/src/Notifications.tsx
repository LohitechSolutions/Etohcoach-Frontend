import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
  FlatList,
  Modal,
  SectionList,
  SafeAreaView,
  ImageBackground,
  TouchableWithoutFeedback
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Context from "../../../components/src/context/context";
import i18n from "i18n-js";

import { withTranslation } from "react-i18next";

// Customizable Area End
const DATA = [
  {
    header: "NEW",
    data: [
      { title: "New update available!", subTitle: "Update 1.23 available in the store.", time: "1 hour ago" },
      { title: "New course available!", subTitle: "Wine variety course is available for study.", time: "2 hour ago" },
      {
        title: "Couse finished!",
        subTitle: "Congratulations! You have finshed How the wine is done and got 25 points!", time: "2 hour ago"
      }
    ]
  },
  {
    header: "PREVIOUS NOTIFICATIONS",
    data: [
      { title: "New update available!", subTitle: "Update 1.16 available in the store.", time: "Yesterday" },
      { title: "New course available", subTitle: "Wine variety couse is available for study.", time: "Last week" }
    ]
  },

];
const Item = ({ title }: { title: any }) => (
  <TouchableOpacity style={{ flexDirection: 'row', marginTop: 10, borderBottomWidth: 1, paddingBottom: 8, borderColor: 'grey', justifyContent: 'space-between', width: wp('90%'), alignSelf: 'center', alignItems: 'center' }}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'grey' }}>
        <Image style={{ width: 20, height: 20 }}
          source={require('../assets/ic_password_invisible.png')}
        />
      </View>
      <View style={{ marginLeft: 10 }}>
        <Text style={{ fontSize: hp('2%'), fontWeight: '700' }}>{title.title}</Text>
        <Text style={{ fontSize: hp('1.2%'), color: 'grey', width: wp('70%') }}>{title.subTitle}</Text>
        <Text style={{ fontSize: hp('1%'), color: 'grey' }}>{title.time}</Text>
      </View>
    </View>
    <TouchableOpacity>
      <Text style={{ fontSize: hp('3%'), color: 'grey' }}>x</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);


import NotificationsController, {
  Props,
  configJSON,
} from "./NotificationsController";


class Notifications extends NotificationsController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }
  static contextType = Context;


  render() {
    const {t}:any = this.props;
    return (
      // Customizable Area Start
      <ImageBackground style={{ width: '100%', height: '100%' }} source={require('../assets/bgimage.png')} >
        <SafeAreaView style={{}}>

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.notificationBt}
          >
            <TouchableWithoutFeedback onPress={() => this.setState({ notificationBt: false })}>
              <View style={styles.centeredView} >
                <View style={styles.modalView}>
                  <Text style={{ fontSize: hp('3%'), fontWeight: '600', marginTop: 20 }}>{t("Notifications")}</Text>
                  <SectionList
                    sections={DATA}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => <Item title={item} />}
                    renderSectionHeader={({ section: { header } }) => (
                      //for the title
                      <View style={{ width: '90%', flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'center', alignSelf: 'center' }}>
                        <View style={{ height: 5, width: '40%', borderRadius: 5, backgroundColor: 'grey' }}></View>
                        <Text style={{ width: '30%', textAlign: 'center' }}>{header}</Text>
                        <View style={{ height: 5, width: '40%', backgroundColor: 'grey', borderRadius: 5 }}></View>
                      </View>
                    )}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </SafeAreaView>
      </ImageBackground>
      // Customizable Area End
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',

  },
  modalView: {
    backgroundColor: "white",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    height: hp('85%'),
    borderRadius: 20,
    justifyContent: 'center',
  },
});

export default withTranslation()(Notifications)
// Customizable Area End
