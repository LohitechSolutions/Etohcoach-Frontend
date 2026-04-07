//------- Import Statement -------//
import React from "react";
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, SafeAreaView } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { RFPercentage, RFValue as rf } from "react-native-responsive-fontsize";
import ButtonComponent from '../../../mobile/src/component/ButtonComponent';
import { COLORS } from "../../../framework/src/Globals";
import { courceImage, email } from "./assets";
import { withTranslation } from "react-i18next";
import Context from "../../../components/src/context/context";

//------- Constant Statement -------//
 interface props{
    onPress:()=>void;
    visible:any
 }
//------- Class Declaration -------//
class StartCourceModal extends React.Component<props>{
    //------- Class Constructor -------//
    static contextType = Context;
    constructor(props:props) {
        super(props);
        //------- States -------//
        this.state = {
            isVisible: false,
        }
    }
    //------- Render -------//
    render() {
      const {t}:any = this.props;
        return (
          <Modal
            animationType={"slide"}
            transparent={true}
            visible={this.props.visible}
          >
            <View
              style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              <TouchableOpacity
                style={styles.modalConatiner}
                onPress={() =>
                  this.setState({ isVisible: !this.state.isVisible })
                }
              >
                <View style={styles.innerModalConatin}>
                  <Image
                    source={this.props.image}
                    style={[
                      styles.courceImage,
                      { tintColor: this.props.tintcolor },
                    ]}
                  />
                  <View style={styles.greatContainer}>
                    <Text style={styles.greatTextContain}>
                      {this.props.heding}
                      {/* Great! Let's start by  {'\n'} reviewing the cource. */}
                    </Text>
                  </View>
                  <View style={styles.browseContainer}>
                    <Text
                      style={[
                        styles.browseTextContain,
                        { fontSize: this.props.fontsize },
                      ]}
                    >
                      {this.props.discription}
                      {/* You can also directly browse the flashcards {'\n'} or test yourself with our quizzes */}
                    </Text>
                  </View>
                  <View style={styles.buttonContain}>
                    <ButtonComponent
                      BtnText={t("CONTINUE")}
                      testID={"Continue"}
                      onpress={() => this.props.closeModal()}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
        );
    }
}
// Customizable Area Start
const styles = StyleSheet.create({
    modalConatiner: {
        flex: 1,
        justifyContent: 'flex-end',
        borderColor: '#fff',
    },
    innerModalConatin: {
        paddingHorizontal: hp(1),
        height: hp(50),
        width: '100%',
        borderRadius: hp(1.5),
        backgroundColor: COLORS.white,
        paddingTop: hp(4),
    },
    courceImage: {
        alignSelf: 'center',
        height: hp(15),
        width: hp(15),
    },
    greatContainer: {
        alignSelf: 'center',
        paddingTop: hp(2),
        // paddingHorizontal: hp(6),
    },
    browseContainer: {
        paddingTop: hp(1),
        paddingHorizontal: hp(1),
    },
    greatTextContain: {
        fontSize: rf(25),
        fontWeight: '600',
        textAlign:'center',
    },
    browseTextContain: {
        fontSize: rf(15),
        color:COLORS.grey,
        textAlign:'center',
    },
    buttonContain: {
        marginTop: hp(3),
      },
});

export default withTranslation()(StartCourceModal);