import { Button, Image, TouchableOpacity, View, Text } from "react-native";
import Video from "react-native-video";

import React, { Component, useRef, useState } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import { COLORS } from "../../../framework/src/Globals";
import Scale from "../../../components/src/Scale";
import { ActivityIndicator, Colors } from "react-native-paper";
import Loader from "../../../components/src/Loader";

export default function VideoComponent(props: any) {
  const [me, setme] = useState(false);
  const [pause, setPause] = useState(false);

  return (
    <View key={props.key}>
      {
        <Video
          style={{ width: "100%", height: "100%" }}
          //   video={{ uri: this.state?.lesson_details?.attributes?.video_file }}
          source={{ uri: props.uri }}
          ref={(ref) => {
            props.AssigningRef(ref);
          }}
          repeat={true}
          controls={true}
          fullscreenAutorotate={true}
          fullscreenOrientation={"all"}
          onLoadStart={() => {
            setme(true);
            console.log("the video has started");
          }}
          onReadyForDisplay={() => {
            setme(false);
            console.log("the video has started not");
          }}
          onEnd={() => {
            console.log("i am here or not-----", props.playervalue),
              setPause(true);
          }}
          // onProgress={(e)=>{console.log("i am here or not-----", e)}}
          paused={pause}
        />
      }
      <Loader loading={me} />
    </View>
  );
}
