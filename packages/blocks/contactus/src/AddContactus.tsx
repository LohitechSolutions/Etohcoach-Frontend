import React from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import Context from "../../../components/src/context/context";

import { withTranslation } from "react-i18next";

import ContactusController, { Props, configJSON } from "./ContactusController";

export default class AddContactus extends ContactusController {
  constructor(props: Props) {
    super(props);
  }

  static contextType = Context;
  render() {
    const {t}: any = this.props;
    console.log('constact us dataa ',this.state.contactUsList)
    return (
      <KeyboardAvoidingView
        behavior={this.isPlatformiOS() ? "padding" : undefined}
        style={styles.keyboardPadding}
      >
        <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
          <TouchableWithoutFeedback
            testID={"Background"}
            onPress={() => {
              this.hideKeyboard();
            }}
          >
            <View>
              <View style={styles.bgInputContainer}>
                <Text style={styles.titleInput}>{t("Name")}</Text>
                <TextInput
                  testID="txtName" //Merge Engine::From BDS
                  style={styles.bgMobileInput} //UI Engine::From Sketch
                  placeholder={t("Name")} //UI Engine::From Sketch
                  {...this.txtNameProps} //Merge Engine::From BDS - {...this.testIDProps}
                />
              </View>
              <View style={styles.bgInputContainer}>
                <Text style={styles.titleInput}>{t("Email")}</Text>
                <TextInput
                  testID="txtEmail" //Merge Engine::From BDS
                  style={styles.bgMobileInput} //UI Engine::From Sketch
                  placeholder={ t("Email")} //UI Engine::From Sketch
                  keyboardType="email-address"
                  {...this.txtEmailProps} //Merge Engine::From BDS - {...this.testIDProps}
                />
              </View>
              <View style={styles.bgInputContainer}>
                <Text style={styles.titleInput}>{t("PhoneNumberCaps")}</Text>
                <TextInput
                  testID="txtPhoneNumber" //Merge Engine::From BDS
                  style={styles.bgMobileInput} //UI Engine::From Sketch
                  placeholder={t("PhoneNumberCaps")} //UI Engine::From Sketch
                  keyboardType="phone-pad"
                  maxLength={13}
                  {...this.txtPhoneNumberProps} //Merge Engine::From BDS - {...this.testIDProps}
                />
              </View>

              <Text style={styles.titleInput}>{t("Comments")}</Text>
              <TextInput
                placeholder={ t("Comments")}
                multiline
                testID="txtComments" //Merge Engine::From BDS
                style={styles.bgMobileInputMessage} //UI Engine::From Sketch
                {...this.txtCommentsProps} //Merge Engine::From BDS - {...this.testIDProps}
              />
              <TouchableOpacity
                style={styles.viewBtn}
                testID="btnSubmit" //Merge Engine::From BDS
                onPress={() => {
                  this.addQueryApi();
                }}
              >
                <Text style={styles.viewBtnText}>{t("AddNewQuery")}</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  keyboardPadding: { flex: 1 },
  container: {
    flex: 1,
    padding: 16,
    marginLeft: "auto",
    marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    maxWidth: 650,
    backgroundColor: "#fff"
  },
  goBack: {
    marginLeft: 16
  },
  viewBtn: {
    backgroundColor: "blue",
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "blue"
  },
  viewBtnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16
  },
  titleInput: {
    color: "#000"
  },
  bgInputContainer: {
    marginBottom: 25
  },
  bgMobileInput: {
    height: 45,
    borderBottomWidth: Platform.OS === "web" ? 0 : 1,
    borderColor: "#c9c9c9"
  },
  bgMobileInputMessage: {
    borderWidth: Platform.OS === "web" ? 0 : 1,
    borderColor: "#c9c9c9",
    height: 100,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginTop: 20
  }
});
