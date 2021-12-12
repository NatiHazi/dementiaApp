import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, Button,ImageBackground,TouchableOpacity } from 'react-native';
import { Entypo  } from '@expo/vector-icons';




export default function HomeScreen() {
  const [userName, setUserName]=useState('');
  const [userPassword, setUserPassword]=useState('');
  const [secure, setSecure]=useState(true);
  const [EntypoValue, setEntypo]=useState("eye")

  const eyePresses=()=>{
    if (secure==true){
      setSecure(false)
    } 
  else{
    setSecure(true)
  }
  if (EntypoValue=="eye-with-line"){
    setEntypo("eye")
  }
  else{
    setEntypo("eye-with-line")
  }
  }
  const buttonHandler=(userNamePar, userPassVal)=>{
    console.log("username: ", userNamePar, "Password: ", userPassVal)
    setUserName('')
    setUserPassword('')
    
  }

  return (
    <ImageBackground source={require('../assets/backgroundForApp.png')} style={styles.container}>
        <Text style={styles.text}>שם משתמש:</Text>
        
        <TextInput placeholderTextColor={'#394150'} style={styles.inputUser} placeholder='הכנס שם משתמש:'
          onChangeText={(valUser)=>setUserName(valUser)} value ={userName}></TextInput>
        <Text style={styles.text}>סיסמא:</Text>
        <View  style={styles.inputPass} >
          <TouchableOpacity>
            <Entypo  name={EntypoValue} size={20} color="black" onPress={()=>eyePresses()} />
            </TouchableOpacity>
          <TextInput style={styles.flexPass}  placeholderTextColor={'#394150'} placeholder='הכנס סיסמא:' secureTextEntry={secure}
            onChangeText={(valPassword)=>setUserPassword(valPassword)} value ={userPassword}></TextInput>
        </View>
        <Button title='כניסה' onPress={()=>buttonHandler(userName,userPassword )}></Button>
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
    padding: 10,
    margin: 10,
    width: 250,
    textAlign:'right',
    alignContent:'center',
    borderRadius:20,
  },
  inputPass:{
    borderWidth:3,
    padding: 10,
    margin: 10,
    width: 250,
    textAlign:'right',
    alignContent:'center',
    borderRadius:20,
   flexDirection:'row',
  },
  logoEye:{
    flexDirection:'row',
    padding:10,
    
  },
  flexPass:{
    flex:1
  },
});
