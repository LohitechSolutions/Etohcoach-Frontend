import React, { useEffect, useRef } from "react";
import {
  Modal, StyleSheet, View, TouchableOpacity, Button
} from "react-native";
import Orientation from "react-native-orientation";
import Video from "react-native-video-controls";
import Icon from "react-native-vector-icons/FontAwesome";
import { COLORS } from "../../../framework/src/Globals";
import Scale from "../../../components/src/Scale";

export const VideoPlayerAndroid = (props: any) => {
  const [me, setme] = React.useState(false);
  const [pause, setPause] = React.useState(false);
  const myrefvideo = useRef(null)
  const [screenState, setScreenState] = React.useState({
    fullScreen: false,
    Width_Layout: "",
    Height_Layout: "",
    potraitMode: true,
  });
  const [currentTime, setCurrentTime] = React.useState(0);
  React.useEffect(() => {
    detectOrientation();


  }, []);
  React.useEffect(() => {
    setTimeout(() => {
      myrefvideo.current.player["ref"]["seek"](currentTime + 1)

    }, 1000)

  }, [screenState])


  useEffect(() => {
    let Number = Math.floor(myrefvideo.current["state"]["duration"])

    if (currentTime == Number) {
      setCurrentTime(0)
      myrefvideo.current.player["ref"]["seek"](0)
    }


  }, [currentTime])
  const handleProgress = (progress) => {
    setCurrentTime(progress.currentTime);
  };

 


  const changeState = (values) => {
    setScreenState((prevState) => {
      return {
        ...prevState,
        ...values,
      };
    });
  };

  // console.log("opiopoopo", screenState)


  const detectOrientation = async () => {


    // console.log('orientation change--------', screenState)
    Orientation.lockToPortrait();
    // await Orientation.lockToLandscape();
    if (screenState.Width_Layout > screenState.Height_Layout) {
      // Write code here, which you want to execute on Landscape Mode.
      // changeState({ fullScreen: true, potraitMode: false });
    } else {

      // Write code here, which you want to execute on Portrait Mode.
      // Orientation.lockToPortrait();
      // changeState({ fullScreen: false, potraitMode: true });
    }
  };



  const videoPlayerView = () => {
    let { fullScreen } = screenState;

    return (
      // <VideoPlayer
      //   source={{
      //     uri: url,
      //   }}
      //   onBack={() => changeState({ fullScreen: !fullScreen })}
      //   navigator={props.navigation}
      //   resizeMode={"contain"}
      //   toggleResizeModeOnFullscreen={true}
      //   onEnterFullscreen={() => {
      //     changeState({ fullScreen: !fullScreen });
      //   }}
      //   disableFullScreen={true}
      //   onExitFullscreen={() => {
      //     changeState({ fullScreen: false })
      //   }}
      // />
      <>
      <View style={{flex: fullScreen?1:Scale(150)}}>
        <Video
          disableVolume
          source={{ uri: props.uri }}
          ref={myrefvideo}
          // onBack={() => changeState({ fullScreen: !fullScreen })}
          resizeMode={"cover"}
          // toggleResizeModeOnFullscreen={true}
          // fullscreenAutorotate={true}
          // fullscreenOrientation={"landcape"}
          
          onEnterFullscreen={() => {
            // console.log("video video andii", screenState)
            !screenState.fullScreen ? props.functionForLanscapemode() : props.functionForpotrait()
            changeState({ fullScreen: !fullScreen });
            !screenState.fullScreen && setTimeout(() => {
              Orientation.lockToLandscape()
            })
            screenState.fullScreen && Orientation.lockToPortrait();
            // myrefvideo.current.player["ref"]["seek"](currentTime)
            // myrefvideo.current.seek(6);
          }}
          disableBack={true}
          onExitFullscreen={() => {
            // console.log("video video andiooo", myrefvideo.current.player["ref"]["seek"])

            changeState({ fullScreen: false })
            !screenState.fullScreen ? props.functionForLanscapemode() : props.functionForpotrait()
            // myrefvideo.current.player["ref"]["seek"](currentTime)
            // myrefvideo.current.seek(6);
            Orientation.lockToPortrait();
          }}
          onProgress={handleProgress}
          onEnd={() => {
            // console.log("iamendiamendiamend")
            setCurrentTime(0)
            myrefvideo.current.player["ref"]["seek"](0)
          }}
          
        />
        </View>
      </>
    );
  };

  const url =
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";


return (
  videoPlayerView()
)

  return (
    !screenState?.fullScreen ?
      <>
        {videoPlayerView()}
      </>
      :

      <Modal
        animationType={"fade"}
        supportedOrientations={["portrait", "landscape", "landscape-left", "landscape-right"]}
        transparent={true}
        presentationStyle={'overFullScreen'}
        visible={screenState.fullScreen}
      >
        <View
          style={styles.ModalWrapper}
          onLayout={(event) => {
            const { layout } = event.nativeEvent;
            changeState({
              Width_Layout: layout.width,
              Height_Layout: layout.height,
            });
          }}
        >
          {videoPlayerView()}
        </View>
      </Modal>

  );
};

const styles = StyleSheet.create({
  ModalOutsideContainer: {
    flex: 1,
  },
  ModalContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  ModalWrapper: {
    flex: 1,
    backgroundColor: "transparent",
  },
  ModalBox: {
    width: "100%",
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingHorizontal: 6,
    borderRadius: 4,
    opacity: 1,
  },
  VideoPlayerContainer: {
    width: "100%",
    height: 150,
  },
  VideoTitle: {
    paddingVertical: 8,
    fontSize: 18,
    textAlign: "center",
  },
});