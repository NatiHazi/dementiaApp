import React from 'react';
import { StyleSheet, Text, View, TextInput, Button,ImageBackground } from 'react-native';
import { Entypo  } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <ImageBackground source={require('../assets/backgroundForApp.png')} style={styles.container}>
        <Text style={styles.text}>שם משתמש:</Text>
        
        <TextInput style={styles.inputUser} placeholder='הכנס שם משתמש:'></TextInput>
        <Text style={styles.text}>סיסמא:</Text>
        <View style={styles.logoEye} style={styles.inputPass} >
        <Entypo  name="eye-with-line" size={17} color="black" />
        <TextInput placeholder='הכנס סיסמא:' secureTextEntry={true}></TextInput>
        </View>
        <Button title='כניסה'></Button>
    </ImageBackground>
   
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize:16,
    fontWeight:'bold',
  },
  inputUser:{
    borderWidth:3,
    padding: 8,
    margin: 10,
    width: 250,
    textAlign:'right',
    alignContent:'center',
    borderRadius:20,
    padding:10,
  },
  inputPass:{
    borderWidth:3,
    padding: 8,
    margin: 10,
    width: 250,
    textAlign:'right',
    alignContent:'center',
    borderRadius:20,
    padding:10,
    flexDirection:'row',
  },
  logoEye:{
    flexDirection:'row',
  }
});
