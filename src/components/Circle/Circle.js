import React from 'react';
import { View,Image,Text ,ScrollView,StyleSheet,Linking,Alert } from 'react-native';

const Circle = ({id, color}) => {
    return <View style={styles.circle} />;
  };
  
  const styles=StyleSheet.create({
    circle: {
      width: 15,
      height: 15,
      alignSelf: "center",
      borderRadius: 100 / 2,
      backgroundColor: "grey",
      alignItems:'center',
      alignSelf: "flex-end",
    },
  });
  export default Circle;