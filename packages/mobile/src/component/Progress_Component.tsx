import React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/FontAwesome";
import { COLORS } from "../../../framework/src/Globals";
import { styles } from "../screen/LandingScreen/style";

interface props{
    onPress:()=>void;
}


//------- Class Declaration -------//
class ProgressComponent extends React.Component<props> {

    //------- Render -------//
    render() {
        return (
            <TouchableOpacity style={{ width: hp('13%'), borderColor: 'grey', height: hp(10), padding: hp(1), borderRadius: hp(1.2), justifyContent: 'space-around', backgroundColor: '#ECEFF6', }}
            onPress={()=>this.props.onPress()}
            >
              {this.props.iconImg?  <Image source={this.props.iconImg} style={{height:hp(2.5),width:hp(2.5)}}/>:
                <Icon name={this.props.iconName}
                    size={23}
                    color={COLORS.grey} />}
                <View >

                    {this.state.simpleTxt ? <Text style={{ fontSize: hp('2%'), fontWeight: '600' }}>{this.props.txt1}</Text> :
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: hp('2%'), fontWeight: '700' }}>{this.props.txt2}</Text>
                            <Text style={{ fontSize: hp('1.5%'), marginTop: hp(0.7) }}>/{this.props.txt2}</Text>
                        </View>
                    }
                </View>
                <Text style={{ fontSize: hp('1.5%'), color: 'grey' }}>{this.props.progressName}</Text>
            </TouchableOpacity>
        )
    }
}

export default ProgressComponent



