import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      
      <Text style={styles.header} > Login Screen </Text>  
     
    </View>

    
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'coral',
    //alignItems: 'center',
    //justifyContent: 'center',
    //height: 25,
    //paddingTop:'10%',
    
    
  },
  header:{
   
    backgroundColor: 'papayawhip',
    //height: '10%',
    paddingTop: '5%',
    //paddingLeft:'100%',
    textAlign: 'center',
    fontWeight: 'bold',
    
    
    
  }
});
