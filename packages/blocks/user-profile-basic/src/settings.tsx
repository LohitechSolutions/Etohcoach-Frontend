import React from "react";
import { TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Context from "../../../components/src/context/context";
import { COLORS } from "../../../framework/src/Globals";
import BottemButton from "../../../mobile/src/component/BottemButtonComponent";
import ModalComponent from "../../../mobile/src/component/ModalComponent";
import ProfileButttonComponent from "../../../mobile/src/component/ProfileButtonComponent";
import UserProfileBasicController from "./UserProfileBasicController";
import { DeleteUser, Password, deleteAccount, email, notification, user } from "./assets";

import { withTranslation } from "react-i18next";
import { connect } from 'react-redux';
import { addUserProfile, removeUserProfile } from "../../../mobile/src/store/actions/UserProfile";
import { removeSubscription } from "../../../mobile/src/store/actions/Subscription";
import moment from "moment";

class UserProfileBasicBlock extends UserProfileBasicController {
  static contextType = Context;
  render() {
    const { t }: any = this.props;
    console.log('subscribed info:',this.state.subscribed)
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ marginTop: hp(5) }}>
          <ProfileButttonComponent
            buttonName={t("EditProfileName")}
            btnIcon={user}
            borderwidth={hp(0.1)}
            tintcolor={COLORS.grey}
            backArrow={true}
            onPress={() => this.props.navigation.navigate("EditProfile")}
          />
          {this.state.accountType === "EmailAccount" ?
            <ProfileButttonComponent
              buttonName={t("ChangePassword")}
              btnIcon={Password}
              borderwidth={hp(0.1)}
              tintcolor={COLORS.grey}
              backArrow={true}
              onPress={() =>
                this.props.navigation.navigate("ChangePassword")
              }
            /> : null}
          {this.state.accountType === "EmailAccount" ?
            <ProfileButttonComponent
              buttonName={t("ChangeEmail")}
              btnIcon={email}
              borderwidth={hp(0.1)}
              tintcolor={COLORS.grey}
              backArrow={true}
              onPress={() =>
                this.props.navigation.navigate("ChangeEmail")
              }
            /> : null}
          <ProfileButttonComponent
            buttonName={t("ManageNotifications")}
            btnIcon={notification}
            borderwidth={hp(0.1)}
            tintcolor={COLORS.grey}
            backArrow={true}
            onPress={() =>
              this.props.navigation.navigate("ManageNotifications")
            }
          />
          <ProfileButttonComponent
            buttonName={t("DeleteAccount")}
            btnIcon={DeleteUser}
            borderwidth={hp(0.1)}
             isdelete={true}
            textColor={COLORS.lightRed}
            backArrow={true}
            onPress={() => this.setState({ deleteModalVisible: true })}
          />

          <ModalComponent
            visible={this.state.deleteModalVisible}
            closeModal={() =>
              this.setState({
                deleteModalVisible: !this.state.deleteModalVisible,
              })
            }
            cancel={t("CANCEL")}
            logout={t("DELETE")}
            heding={t("DeleteAccount")}
            discription={t("AreYouSureYouDeleteYourAccount")}
            activeSubscription={this.state.subscribed}
            subscriptionDate={this.state.subscriptionDate? moment(this.state.subscriptionDate).subtract(1, 'months').format('MMM DD, YYYY'):''}
            tintColor={COLORS.lightRed}
            paddingHorizontal={hp(8)}
            height={hp(55)}
            imageIcon={true}
            image={deleteAccount}
            modalType="DEL"
            confirmBtn={() => this.deleteAccount()}
          />
        </View>
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: hp(5),
            marginLeft: hp(5),
          }}
          onPress={() => this.props.navigation.goBack()}
        />
        <BottemButton
          leftOnPress={() => this.props.navigation.goBack()}
          back={true}
        />
        {/* <Loader loading={this.state.showLoader} /> */}
      </View>
    );
  }
}

const mapStateToProps = (state : any) => {
  return {
    userProfileState: state.rootReducer.userProfileReducer,
    subscriptionState: state.rootReducer.subscriptionReducer,
  }
}

const mapDispatchToProps = (dispatch : any) => {
  return {
    addUserProfile : (params:any) => {
      dispatch(addUserProfile(params))
    }, 
   
   
    removeUserProfile:()=>{
      dispatch(removeUserProfile())
    },
    removeSubscription:()=>{
      dispatch(removeSubscription())
    }
  }
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(UserProfileBasicBlock));