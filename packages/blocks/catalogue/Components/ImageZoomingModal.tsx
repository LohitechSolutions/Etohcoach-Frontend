
import React, { Component } from "react";
import { Button, Image, TouchableOpacity, View ,Text,Modal,TouchableWithoutFeedback} from "react-native";
import  { useState, useRef, createRef } from 'react';
import { PanGestureHandler, PinchGestureHandler, State, } from 'react-native-gesture-handler';
import {  Animated, Dimensions } from 'react-native';
import Scale from "../../../components/src/Scale";

import { GestureHandlerRootView } from "react-native-gesture-handler"



export default function ImageZoomingModal(props:any){
    const [panEnabled, setPanEnabled] = useState(false);
console.log("panpanpan")
  
    const scale = useRef(new Animated.Value(1)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
  
    const pinchRef = createRef();
    const panRef = createRef();
  
    const onPinchEvent = Animated.event([{
      nativeEvent: { scale }
    }],
      { useNativeDriver: true });
  
    const onPanEvent = Animated.event([{
      nativeEvent: {
        translationX: translateX,
        translationY: translateY
      }
    }],
      { useNativeDriver: true });
  
    const handlePinchStateChange = ({ nativeEvent }) => {
      // enabled pan only after pinch-zoom
      if (nativeEvent.state === State.ACTIVE) {
        setPanEnabled(true);
      }
  
      // when scale < 1, reset scale back to original (1)
      const nScale = nativeEvent.scale;
      if (nativeEvent.state === State.END) {
        if (nScale < 1) {
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true
          }).start();
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true
          }).start();
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true
          }).start();
  
          setPanEnabled(false);
        }
      }
    };
return(
<View style={{height:"85%"}}  >
      <GestureHandlerRootView
        onGestureEvent={onPanEvent}
        ref={panRef}
        simultaneousHandlers={[pinchRef]}
        enabled={panEnabled}
        failOffsetX={[-1000, 1000]}
        shouldCancelWhenOutside
      
      >
        <Animated.View>
          <PinchGestureHandler
            ref={pinchRef}
            onGestureEvent={onPinchEvent}
            simultaneousHandlers={[panRef]}
            onHandlerStateChange={handlePinchStateChange}
          >
            <Animated.Image
              source={{ uri: props.url }}
              style={{
                width: '100%',
                height: '100%',
                transform: [{ scale }, { translateX }, { translateY }]
              }}
              resizeMode="contain"
            />

          </PinchGestureHandler>
        </Animated.View>

      </GestureHandlerRootView>
    </View>


)

 








}