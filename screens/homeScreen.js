import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container1}>
      <Text style={styles.header}> Login Screen </Text>  
      <View style={styles.container}>
        <Text>שם משתמש:</Text>
        <TextInput style={styles.inputUser} placeholder='הכנס שם משתמש:'></TextInput>
        <Text>סיסמא:</Text>
        <TextInput style={styles.inputPass} placeholder='הכנס סיסמא:'></TextInput>
        <Button style={styles.button} title='כניסה'></Button>
     </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'coral',
    alignItems: 'center',
    justifyContent: 'center',
    //height: 25,
    //paddingTop:'10%',
  },
  container1: {
    flex: 1,
    backgroundColor: 'coral',
    
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
   
  },
  inputUser:{
    borderWidth:1,
    backgroundColor: '#fff',
    padding: 8,
    margin: 10,
    width: 200,
    textAlign:'right',
    alignContent:'center',
    
  },
  inputPass:{
    borderWidth:1,
    backgroundColor: '#fff',
    padding: 8,
    margin: 10,
    width: 200,
    textAlign:'right',
    alignContent:'center',
    
  },
  button:{
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
  
    
  },
});
