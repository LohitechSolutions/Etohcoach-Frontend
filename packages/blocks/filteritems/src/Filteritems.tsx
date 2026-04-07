import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
  SafeAreaView
} from "react-native";
import Context from "../../../components/src/context/context";

import { withTranslation } from "react-i18next";
// Customizable Area End

import FilteritemsController, { Props } from "./FilteritemsController";
import Icon from "react-native-vector-icons/FontAwesome";
export default class Filteritems extends FilteritemsController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }
  static contextType = Context;
  // Customizable Area Start
  getList(item: any) {
    let value = item.item.attributes;
    console.log(value, "getList");
    return (
      <View style={styles.productBox}>
        <View style={styles.ImgContainer}>
          <Image
            style={styles.productImg}
            source={{ uri: value.images[0].url }}
            resizeMode="cover"
          />
        </View>
        <View style={styles.detailContent}>
          <Text style={styles.productName}>{value.name}</Text>
          <Text style={styles.price}>{value.price}</Text>
          <View style={[styles.flexBox, styles.starBox]}>
            <Text style={styles.rating}>{value.average_rating}</Text>
            <Icon
              name="star"
              size={12}
              style={styles.sortIcon}
              color="orange"
            />
          </View>
        </View>
      </View>
    );
  }
  // Customizable Area End

  render() {
    const {t}:any = this.props;
    return (
      //Merge Engine DefaultContainer
      <SafeAreaView style={styles.container}>
      {/* Customizable Area Start */}
        <View style={styles.topContainer}>
          <TouchableOpacity
            style={[styles.topBox, styles.flexBox]}
            onPress={() => this.navigateToFilter()}
            testID={"navigateToFilter"}
          >
            <Icon
              name="filter"
              size={15}
              style={styles.sortIcon}
              color="#808080"
            />
            <Text style={styles.topText}>{t("Filter")}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView keyboardShouldPersistTaps="always">
          <TouchableWithoutFeedback
            onPress={() => {
              this.hideKeyboard();
            }}
          >
            {/* Customizable Area Start */}
            {/* Merge Engine UI Engine Code */}
            <View>
              <View style={[styles.productContainer, styles.flexBox]}>
                <FlatList
                  data={this.state.data}
                  renderItem={item => this.getList(item)}
                  extraData={this.state}
                  keyExtractor={(item: any) => item.id}
                  numColumns={2}
                  columnWrapperStyle={styles.row}
                />
              </View>
            </View>
            {/* Merge Engine UI Engine Code */}
            {/* Customizable Area End */}
          </TouchableWithoutFeedback>
        </ScrollView>
      {/* Customizable Area End */}
      </SafeAreaView>
      //Merge Engine End DefaultContainer
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    maxWidth: 650,
    backgroundColor: "#ffffffff"
  },
  topContainer: {
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "black",
    shadowOpacity: 1.0,
    backgroundColor:"#FFF"
  },
  topBox: {
    width: "100%",
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
    justifyContent: "space-between"
  },
  sortText: {
    fontSize: 16,
    color: "#696969"
  },
  sortIcon: {
    marginRight: 12
  },
  flexBox: {
    display: "flex",
    flexDirection: "row"
  },
  productContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white"
  },
  productBox: {
    height: 250,
    borderBottomWidth: 1,
    flexDirection: "column",
    flex: 0.5,
    borderRightWidth: 1,
    borderColor: "#ccc"
  },
  ImgContainer: {
    //marginBottom: 15,
    height: 150
  },
  productName: {
    paddingVertical: 5,
    fontSize: 16
  },
  price: {
    color: "#444",
    fontSize: 16,
    marginBottom: 10
  },
  productImg: {
    width: "100%",
    height: "100%"
  },
  detailContent: {
    padding: 10
  },
  rating: {
    color: "#000",
    paddingRight: 6
  },
  starBox: {
    alignItems: "center"
  }
});
// Customizable Area End
