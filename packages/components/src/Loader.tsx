import { ActivityIndicator, Text, View, Modal, StyleSheet, Platform } from "react-native";

import React ,{useEffect,useRef} from "react";
import SvgXml from "react-native-svg";
import Video from 'react-native-video';
import RenderHTML from "react-native-render-html";
import Svg, { Path } from 'react-native-svg';
import LottieView from 'lottie-react-native';
// let anim=require('../images/loaderanimation.lottie')


import {  Animated } from 'react-native';

const AnimatedSvgIcon = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(animatedValue, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    });

    Animated.loop(animation).start();

    return () => animation.stop();
  }, [animatedValue]);

  const pathData =
    "M11.06298,1.5c-10.0001,0 -24.49999,46.5 15.00021,46.5c32.00388,0 34.99981,-48 2.99981,-48c-9,0 -16.50001,4 -16.50001,17";

  const strokeDashArray = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0 172", "172 0"],
  });

  return (
    <View>
      <Svg width={64} height={64} viewBox="0 0 64 64">
        <Path
          d={pathData}
          fill="none"
          stroke="rgb(199, 38, 62)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={strokeDashArray}
        />
      </Svg>
    </View>
  );
};




interface myProps {
  loading: boolean;
}
export default function Loader(props: myProps) {
  return props.loading ? (
    // <Modal transparent={true} visible={true}>
    <View style={[styles.container]}>
      <View style={styles.spinnerView}>
        {/* {/ <Text style={{ marginBottom: 10 }}>Please wait</Text> /} */}
        {/* <ActivityIndicator /> */}
         <LottieView
        source={require('../images/animation.json')}
        imageAssetsFolder={'images'}
        autoPlay
        loop
        // style={{height:100,width:100}}
      /> 
      
      </View>
    </View>
  ) : (
    // </Modal>
    <View />
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 99,
    alignItems: "center",
    justifyContent: "space-around"
  },
  spinnerView: {
    backgroundColor: "#FFFFFF",
    height: 100,
    width: 100,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 2.0,
    alignSelf: "center",
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
    color:'white'
  },
});
