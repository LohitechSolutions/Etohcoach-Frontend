import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
// import {SelectableText} from '@alentoma/react-native-selectable-text';
import { FONTS } from "../../../framework/src/Fonts";
 import Scale from '../../../components/src/Scale'

// import Button from './button';
import exampleData from './exampleData';
import highlightColor from './colors';

export default function HighlightExample({example, defaultHighlightText, onChange}) {
  const wordArray = exampleData(example);

  const [wordData, setWordData] = useState(wordArray);
  const [highlightedArray, setHighlightedArray] = useState(wordArray)
  
  const getSelectionData = async (event, content, start, end) => {
    const color = highlightColor(event);  
    setWordData(
      wordData.map(word =>
        word.start >= start && word.end <= end ? {...word, color: color} : word,
      ),
    );
  };

  useEffect(() => {onChange(wordData);},[wordData])

  const renderSubstring = () => {    
    const substring = wordData.map(word => {
      // console.log("66666+++", word)
      let checkElementExist = defaultHighlightText.find(i => (i.start == word.start))
      return <Text key={word.id} >
        <Text style={{backgroundColor: !!checkElementExist ? checkElementExist.color : word.color}}>
          {example.substring(word.start, word.end)}{''}
        </Text>
      </Text>
    })
    return substring;
  };


  useEffect(() => {
    // onChange(wordArray);
  }, [wordArray])

  const getcolors = () => {
    let Array = []
    wordData.filter((item) => {
      if(item.color !== null){
         Array.push(item)
      }
    })
    // console.log('ARRAY: ', Array);
    onChange(Array)

  }

  const handleButtonPress = () => {
    setWordData(wordArray);
  };

  return (
  
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        {/* <SelectableText
          menuItems={[
            'yellow',
            'lightgreen',
            'Orange',
            'Red',
            'pink',
            'lightblue',
          ]}
          onSelection={({eventType, content, selectionStart, selectionEnd}) => {
            console.log("55555555",eventType, content, selectionStart, selectionEnd);
            getSelectionData(eventType, content, selectionStart, selectionEnd);          
          }}
          TextComponent={renderSubstring}
          style={styles.paragraph}
       
        /> */}
      </View>
      <View style={{alignItems: 'center'}}>
        {/* <View style={{width: '50%', paddingTop: 25}}>
          <Button
            text={'Zurücksetzen'}
            backgroundColor={'#0082B6'}
            borderColor={'#0082B6'}
            fontColor={'#fff'}
            onPress={handleButtonPress}
          />
        </View> */}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          position: 'absolute',
          bottom: 30,
          alignSelf: 'center',
          width: '90%',
        }}>
        {/* {menuItem.map(item => (
          <TouchableOpacity
            style={{
              height: 30,
              width: 30,
              backgroundColor: item === 'Orange' ? '#FFA500' : item,
              borderRadius: 20,
              marginLeft: 10,
            }}
            onPress={() => {
              menuItem.fill(item), console.log('abc', menuItem.fill(item));
            }}
          />
        ))}
        <TouchableOpacity onPress={handleButtonPress} style={{marginLeft: 15}}>
          <Text>Clear all</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 20,
    backgroundColor: '#fff',
    padding: 5,
  },
  paragraph: {
    fontSize: Scale(19),
    fontWeight: "500",
    lineHeight: Scale(18),
    fontFamily: FONTS.Roboto_Regular,
    color:"#373434"
    
  },
});

