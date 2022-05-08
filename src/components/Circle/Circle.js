import React from 'react';
import { View,Image,Text ,ScrollView,StyleSheet,Linking,Alert } from 'react-native';

const Circle = ({id, color}) => {
    return <View style={[styles.circle, {backgroundColor: color}]} />;
  };
  
  const styles=StyleSheet.create({
    circle: {
      width: 20,
      height: 20,
      borderRadius: 100 / 2,
      // backgroundColor: "grey",
    },
  });
  export default Circle;