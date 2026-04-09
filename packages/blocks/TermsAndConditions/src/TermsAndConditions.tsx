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
  Dimensions,
  SafeAreaView,
  // Customizable Area Start
  // Customizable Area End
} from "react-native";
import { RFPercentage as rf } from "react-native-responsive-fontsize";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { FONTS } from "../../../framework/src/Fonts";
import { COLORS } from "../../../framework/src/Globals";
import BottemButton from "../../../mobile/src/component/BottemButtonComponent";
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { connect } from 'react-redux';
import { bindActionCreators } from '../../../../react-native/src/shims/redux';
import { userLoginWatcher } from '../../../mobile/src/store/actions';
import { userTermsWatcher } from '../../../mobile/src/store/actions';
import Context from "../../../components/src/context/context";

import { withTranslation } from "react-i18next";

import TermsAndConditionsController, {
  Props,
  configJSON,
} from "./TermsAndConditionsController";
import ToastMassage from "../../../mobile/src/component/ToastMassage";
import Loader from "../../../components/src/Loader";
import Scale from "../../../components/src/Scale";
import { addTerms, addPrivacy } from "../../../mobile/src/store/actions/Legal"

class TermsAndConditions extends TermsAndConditionsController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start


  // async componentDidMount() {
  //   this.setState({ showLoader: true })
  //   // this._loginApiCall(),
  //   if(this.props.navigation?.state?.params?.TermsAndConditions){
  //     this.tearmAndConditionApi()
  //   }else{
  //     this.privacyPolicyApi();
  //   }
  // }
 

  static contextType = Context;
  // Customizable Area End
  width = Dimensions.get('window').width
  render() {
    const {t}:any = this.props;
    const privacyPolicy = {
      html: this.state.privacyPolicy
    };
    const Terms = {
      html: this.state.termsCondition
    };
    const privacy = {
      html: this.state.privacyPolicy
    }
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{width:'100%',marginTop:hp(7),marginLeft:Scale(10)}}>
        {this.props.navigation?.state?.params?.TermsAndConditions? <Text style={styles.header}>{t("TermsandConditions")}</Text>:<Text style={[styles.header, { marginTop: hp(2) }]}>
              {t("PrivacyPolicy")}
            </Text>}
            <View style={styles.seprateline} />
            </View>
        <ScrollView keyboardShouldPersistTaps="always" style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={{ marginHorizontal: wp(3.7)}}>
           {!this.props.navigation?.state?.params?.TermsAndConditions? 
           <View>
            <RenderHtml
              contentWidth={this.width}
              source={privacy}/>
            </View>
            :<></>}
           {this.props.navigation?.state?.params?.TermsAndConditions? <View style={{flex:1}}>
            <RenderHtml
              contentWidth={this.width}
              source={Terms}
            />
            </View>:<></>}
          </View>
        </ScrollView>
      <View style={{width:'100%',height:Scale(90)}}>
        <BottemButton back={true}  leftOnPress={() => this.props.navigation.goBack()} />
        </View>

        {/* <Button title="" > */}
        {
          this.state.error != '' ? <ToastMassage isSuccess={false} toastMassage={this.state.error} /> : null
        }
        <Loader loading={this.state.showLoader} />
      </View>
      // // Customizable Area Start
      
      // // Customizable Area End
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    // marginLeft: "auto",
    // marginRight: "auto",
    // width: Platform.OS === "web" ? "75%" : "100%",
    // maxWidth: 650,
    backgroundColor: "#ffffffff",
  },
  header: {
    // fontWeight: '600',
    fontSize: rf(4),
    fontFamily: FONTS.Roboto_Bold
  },
  termsTxt: {
    marginTop: hp(2),
    fontSize: rf(2.1),
    lineHeight: hp(2.7),
    marginRight: wp(3),
    color: COLORS.grey,
    fontFamily: FONTS.Roboto_Regular

  },
  seprateline: {
    borderBottomWidth: hp(0.12),
    borderColor: COLORS.borderColor,
    marginTop: hp(3),
    width: '95%',
    opacity: 0.7,
    alignSelf: 'center'
  }
  // title: {
  //   marginBottom: 32,
  //   fontSize: 16,
  //   textAlign: "left",
  //   marginVertical: 8,
  // },
  // body: {
  //   marginBottom: 32,
  //   fontSize: 16,
  //   textAlign: "left",
  //   marginVertical: 8,
  // },
  // bgPasswordContainer: {
  //   flexDirection: "row",
  //   backgroundColor: "#00000000",
  //   marginBottom: 16,
  //   borderBottomWidth: 1,
  //   borderColor: "#767676",
  //   borderRadius: 2,
  //   padding: 10,
  //   borderWidth: Platform.OS === "web" ? 0 : 1,
  // },
  // bgMobileInput: {
  //   flex: 1,
  // },
  // showHide: {
  //   alignSelf: "center",
  // },
  // imgShowhide: Platform.OS === "web" ? { height: 30, width: 30 } : {},
});
// Customizable Area End

// ------ Connect to props functions and values ------ //


const mapStateToProps = (state: any) => {
  return {
    // offlineData : state.rootReducer.offlineReducer
    legalState: state.rootReducer.legalReducer
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    addTerms: (params:any) => {
      dispatch(addTerms(params))
    },
    addPrivacy: (params:any) => {
      dispatch(addPrivacy(params))
    },
  }
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(TermsAndConditions));