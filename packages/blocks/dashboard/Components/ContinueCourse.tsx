import React, { Component } from "react";
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Image, ImageBackground } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Scale from "../../../components/src/Scale";
import Context from "../../../components/src/context/context";

import { withTranslation } from "react-i18next";

interface props {
  data: any
}
class CountinueCourse extends Component<props>{
  static contextType = Context;
  constructor(props: props) {
    super(props)
    this.state = {

    }
  }
  render() {
    const {t}:any = this.props;
    console.log('Continue with your course ', this.props.data)
    return (
      <View >
        <View style={{ width: '90%', alignSelf: 'center', marginTop: Scale(20) }}>
          <Text style={{ fontSize: Scale(17), fontWeight: '700' }} >{t("CONTINUEWITHYOURCOURSE")}</Text>
        </View>
        <FlatList style={{ marginTop: 10 }}
          data={this.props.data}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }: { item: any }) =>
            <TouchableOpacity style={{ width: wp('95%'), borderWidth: Scale(2), borderColor: 'lightgrey', height: Scale(170), flexDirection: 'row', borderRadius: 10, justifyContent: 'space-evenly', marginLeft: 10, marginRight: 10, alignItems: 'center' }}>
              <ImageBackground imageStyle={{ borderRadius: 8 }} style={{ width: wp('34%'), height: 145, borderRadius: 10, alignItems: 'flex-end', justifyContent: 'flex-end' }}
                source={require('../assets/natureImage.jpeg')}
              >
                <TouchableOpacity style={{ marginRight: 10, width: 25, height: 25, alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.5)', marginBottom: 10 }}>
                  <Image style={{ width: 13, height: 13 }}
                    source={require('../assets/Download.png')}
                  />
                </TouchableOpacity>
              </ImageBackground>
              <View style={{ width: wp('55%') }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                  <Text style={{ fontSize: 10, color: 'grey' }}>{t(item?.drink_type)}</Text>
                  <View style={{ width: Scale(3), marginLeft: Scale(2.5), height: Scale(3), backgroundColor: "grey", borderRadius: Scale(3) }} />
                  <Text style={{ fontSize: 10, marginLeft: Scale(5), color: 'grey' }}>{t("Course")}</Text>
                  <View style={{ width: Scale(3), marginLeft: Scale(2.5), height: Scale(3), backgroundColor: "grey", borderRadius: Scale(3) }} />
                  <Text style={{ fontSize: 10, marginLeft: Scale(5), color: 'grey' }}>{item?.certificate}</Text>
                  <View style={{ width: Scale(3), marginLeft: Scale(2.5), height: Scale(3), backgroundColor: "grey", borderRadius: Scale(3) }} />
                  <Text style={{ fontSize: 10, marginLeft: Scale(5), color: 'grey' }}>{item?.language_type}</Text>
                  {/* <Image style={{width:10,height:7,marginLeft:5}}
                              source={require('../assets/uk_Flag.jpeg')}
                            /> */}
                </View>
                <Text numberOfLines={1} style={{ fontSize: 16, fontWeight: 'bold' }}>{item?.course_name}</Text>
                <View>
                  <Text numberOfLines={3} style={{ fontSize: 16, fontWeight: '600', color: 'grey' }}>{t("CompleteThisEssentialCourseInOrderCompetentlyOchre")}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                  <Image style={{ width: 15, height: 15 }}
                    source={require('../assets/image_reward.png')}
                  />
                  <Text style={{ fontSize: 14, fontWeight: 'bold', marginLeft: 5 }}>16/25</Text>
                  <View style={{ width: 5, height: 5, backgroundColor: 'grey', borderRadius: 1, marginLeft: 10, marginRight: 10 }}></View>
                  <Image style={{ width: 15, height: 15 }}
                    source={require('../assets/image_lessons.png')}
                  />
                  <Text style={{ fontSize: 14, fontWeight: 'bold', marginLeft: 5 }}>3/5</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: '80%', borderRadius: 2, height: 4, backgroundColor: 'lightgrey', justifyContent: 'center' }}>
                    <View style={{ width: JSON.stringify(item?.user_course_percentage) + '%', height: 4, borderRadius: 2, backgroundColor: '#F28E3A' }}></View>
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'grey', marginLeft: 5 }}>{item?.user_course_percentage}%</Text>
                </View>
              </View>
            </TouchableOpacity>
          }
        />
      </View>
    )
  }
}

export default withTranslation()(CountinueCourse);