//------- Import Statement -------//
import React from 'react'
import { View, Button, StyleSheet, Image, TouchableOpacity, Text, Modal, FlatList, } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { RFValue as rf } from "react-native-responsive-fontsize";
import { COLORS } from '../../../framework/src/Globals';
import TextField from './TextField';
import ButttonComponent from './ButtonComponent';
import { withTranslation } from "react-i18next";


//------- Constant Statement -------//
let showpassword = require('../assets/showpassward.png')
//------- Class Declaration -------//

interface props{
    onPressBack:()=>void;
    onPressStart:()=>void;
    visible:any;
    data:any;
    onPressTheme:()=>void;
    onPressSelect:()=>void
}
interface s{
    type:any,
    title:any,
    id:any
}

class MockTestModal extends React.Component<props,s> {

    //------- Class Constructor -------//
    constructor(props:props) {
        super(props);
        //------- States -------//
        this.state = {
            type:'Theme',
            title:'How the wine is done?',
            id:''
        }
    }

    OnselFun(item:any){
        console.log('showww items ',item)
        this.setState({type:item?.type,title:item?.title,id:item?.id})
        this.props.onPressSelect(item)
    }

    //------- Render -------//
    render() {
        const {t}:any = this.props;
        console.log('props dataaaaaaaa ',this.props?.data?.title)
        return (
            <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.props.visible}
                    onRequestClose={() => { console.log("Modal has been closed.")}}>
                    <View style={styles.modalConatiner} onPress={() => this.setState({ isVisible: !this.state.isVisible })}>
                        <View style={styles.innerModalConatin}>
                            <Image source={this.props.image} style={styles.courceImage} />
                            <View style={styles.quizContainer}>
                                <Text style={styles.quizTextContain}>
                                    {this.props?.data?.title}
                                </Text>
                            </View>
                            <View style={styles.selectContainer}>
                                <Text style={styles.selectTextContain}>
                                    {this.props?.data?.subTitle}
                                    {'\n'} you would like to take
                                </Text>
                            </View>
                            <View style={styles.themeConatin}>
                                {/* <TextField
                                    testID={'Theme'}
                                    placeHolderName={this.props?.data?.placeholder}
                                    Image={this.props.image1}
                                /> */}
                                <TouchableOpacity style={{flexDirection:'row',borderRadius:10,alignItems:'center',backgroundColor:'#F2F2F7',width:'95%',padding:13,alignSelf:'center',justifyContent:'space-between'}}
                                    onPress={()=>this.props.onPressTheme()}  >
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <Image style={{width:wp(4),height:hp(2)}}
                                            source={require('../assets/Vector.png')}
                                        />
                                        <View style={{marginLeft:10}}>
                                            <Text style={{color:'#777185',fontSize:11,fontWeight:'600'}}>{this.state.type}</Text>
                                            <Text style={{color:'#373434',fontSize:14,fontWeight:'500'}}>{this.state.title}</Text>
                                        </View>
                                    </View>
                                    <Image style={{width:wp(3),height:hp(1)}}
                                       source={require('../assets/Downicon.png')}
                                    />
                                </TouchableOpacity>
                                <FlatList
                                  data={this.props.data?.mock_and_quize}
                                  renderItem={({item}:{item:any})=>
                                  <TouchableOpacity style={{width:'90%',justifyContent:'center',marginTop:5,alignSelf:'center',alignItems:'center',borderRadius:10,height:30,backgroundColor:'#F2F2F7'}} onPress={()=>this.OnselFun(item)}>
                                    <Text>{item?.title}</Text>
                                  </TouchableOpacity>
                                }
                                />
                            </View>
                            <View style={styles.buttonConatiner}>
                                <ButttonComponent onpress={()=>this.props.onPressBack()} BtnText={t("BACK")} testID={'back'} extraStyle={styles.backButton} Style={styles.backText}/>
                                <ButttonComponent onpress={()=>this.props.onPressStart()} BtnText={t("START")} testID={'start'} extraStyle={styles.startButton} />
                            </View>
                        </View>
                    </View>
                </Modal>
        )
    }
}



const styles = StyleSheet.create({
    modalConatiner: {
        flex: 1,
        justifyContent: 'flex-end',
        borderColor: '#fff',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    innerModalConatin: {
        paddingHorizontal: hp(1),
        height: hp(65),
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
    themeConatin: {
        marginTop: hp(4),
    },
    buttonConatiner: {
        flexDirection: 'row',
        paddingTop:hp(5),
        justifyContent: 'space-around',
        // paddingHorizontal:hp(2),
    },
    backButton: {
        height: hp(6.5),
        width: '43%',
        borderWidth:wp(0.1),
        borderColor:COLORS.grey,
        borderRadius: hp(1.3),
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    backText:{
        color:COLORS.black,
        fontSize:rf(15),
        fontWeight:'500',
    },
    startButton:{
        height: hp(6.5),
        width: '43%',
        borderRadius: hp(1.3),
        backgroundColor: COLORS.lightRed,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    quizContainer: {
        alignSelf: 'center',
        paddingTop: hp(2),
        paddingHorizontal: hp(6),
    },
    selectContainer: {
        paddingTop: hp(1),
        paddingHorizontal: hp(1),
    },
    quizTextContain: {
        fontSize: rf(25),
        fontWeight: '600',
        textAlign: 'center',
    },
    selectTextContain: {
        fontSize: rf(15),
        color: COLORS.grey,
        textAlign: 'center',
    },

})

export default withTranslation()(MockTestModal);