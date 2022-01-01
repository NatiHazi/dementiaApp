import React,{useState} from 'react';
import { View ,Image, StyleSheet,ScrollView} from 'react-native';
import CustomInput from '../../components/CutomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import {getAuth,signInWithEmailAndPassword} from '../../../db/firebase'



const SignInScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const navigation = useNavigation();

    const onSignInPressed = () =>{
        const auth = getAuth();
signInWithEmailAndPassword(auth, username, password)
  .then((userCredential) => {
      //console.log("sucess")
    // Signed in 
    const user = userCredential.user;
    console.log(user.email)
    if (!user.emailVerified){
        alert("you must verify your account in your mail")
    }
    else{
        console.log("log in succeed")
        // .......
    }
   
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode)
    if (errorCode ==="auth/invalid-email"){
        alert("invalid email")
    }
    if (errorCode ==="auth/user-not-found"){
        alert("User not existing in the system")
    }
    if (errorCode ==="auth/wrong-password"){
        alert("wrong password")
    }
    
    
  });
    };

    const onForotPasswordPresed = () => {
        navigation.navigate("ForgotPassword");
    };

    const onSignUpPressed = () => {
        navigation.navigate("signUn");
    };

    return (
        <ScrollView>
        <View style={styles.root}>
            <Image style={styles.logo} source={require('../../../assets/logo.jpg')}>
            </Image>
                
             <CustomInput
                iconName = "people"
                iconType = "MaterialIcons"
                placeholder="email"
                value={username} 
                setValue={setUsername}
                secureTextEntry={false}
                
              />
             <CustomInput 
              placeholder="Password"
              value={password}
              setValue={setPassword} 
              secureTextEntry
              />

            <CustomButton text="Sign In" onPress={onSignInPressed}/>

            <CustomButton
            text="Forgot password?"
            onPress={onForotPasswordPresed}
            type = "TERTIARY"
            />

            <CustomButton
            text="Don't have an account? Create one"
            onPress={onSignUpPressed}
            type = "TER"
            />

            
        </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    root:{
        alignItems:'center',
        padding: 20,
        backgroundColor:'snow',
    },
    logo: {
        
        width:300,
        height:300,
    },
  
})

export default SignInScreen
