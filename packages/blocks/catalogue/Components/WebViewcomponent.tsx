import { Button, Image, TouchableOpacity, View, Text, Dimensions,useWindowDimensions,TouchableWithoutFeedback, Modal } from "react-native";
import React, { Component, useState } from "react";
import RenderHtml,{useInternalRenderer} from 'react-native-render-html';
import ImageZoomingModal from "./ImageZoomingModal";
import  Icon from "react-native-vector-icons/AntDesign";
import Scale from "../../../components/src/Scale";
import { COLORS } from "../../../framework/src/Globals";
function CustomImageRenderer(
  props
) {
  const { Renderer, rendererProps } = useInternalRenderer('img', props);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onPress = () => setIsModalOpen(true);
  const onModalClose = () => setIsModalOpen(false);
  const uri = rendererProps.source.uri;
  const thumbnailSource = {
    ...rendererProps.source,
    // You could change the uri here, for example to provide a thumbnail.
    uri: uri.replace('1200', '300').replace('720', '200')
  };
  return (
    <View style={{ alignItems: 'center' }}>
      <Renderer {...rendererProps} source={thumbnailSource} onPress={onPress} />
      <View style={{position:'absolute',bottom:Scale(10),right:Scale(10)}}>
               <Image style={{height:Scale(20),width:Scale(20)}} source={require('../assets/zoom-in.png')} /> 
            </View>
      <Modal visible={isModalOpen} onRequestClose={onModalClose}>
                        <TouchableWithoutFeedback  >
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ width: '100%' }}>
                                {/* <Renderer {...rendererProps} /> */}
                                <ImageZoomingModal url={uri} />

                                </View>
                                <TouchableOpacity onPress={onModalClose} style={{paddingHorizontal:Scale(10),paddingVertical:Scale(10),borderWidth:1,borderColor:COLORS.black,borderRadius:40}} >
                               <Icon name="close" size={Scale(25)} />
                               </TouchableOpacity>
                            </View>
                           
                        </TouchableWithoutFeedback>
                    </Modal>
      {/* <Modal visible={isModalOpen} onRequestClose={onModalClose}>
        <Renderer {...rendererProps} />
        <Button title="Close Modal" onPress={onModalClose} />
      </Modal> */}
    </View>
  );
}

const tagsStyles = {
  img: {
    alignSelf: 'center'
  }
};

const renderers = {
  img: CustomImageRenderer
};
export default function WebViewComponent(props: any) 
{
  const { width } = useWindowDimensions();
  
    return (
      <RenderHtml
      contentWidth={width-40}s
     tagsStyles={tagsStyles}
     renderers={renderers}
        source={{html:props.html} }
        // androidHardwareAccelerationDisabled={false}
             /> 
    )
}



