import React from 'react';
import {View, Text, Image, ViewStyle} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {FONTS} from '../../../framework/src/Fonts';
import {COLORS} from '../../../framework/src/Globals';
// import images from '../assets';

interface ToastMessageProps {
  isSuccess: boolean;
  toastMassage: string;
  containerStyle: ViewStyle;
}
//------- Component Declaration -------//
const ToastMassage: React.FunctionComponent<ToastMessageProps> = ({
  isSuccess,
  toastMassage,
  containerStyle,
}) => {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          backgroundColor: isSuccess ? COLORS.success : COLORS.lightRed,
          position: 'absolute',
          zIndex: 99,
          padding: hp(2),
          marginHorizontal: hp(5),
          borderRadius: hp(1),
          bottom: hp(8),
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: 0.8,
        },
        containerStyle,
      ]}>
      {/* <Image
        source={isSuccess ? images.check : images.cross}
        resizeMode={'contain'}
        style={{width: hp(2), height: hp(2), backgroundColor: 'white'}}
      /> */}
      <Text style={{color: COLORS.white, fontFamily: FONTS.Roboto_Regular}}>
        {toastMassage}
      </Text>
    </View>
  );
};

export default ToastMassage;
