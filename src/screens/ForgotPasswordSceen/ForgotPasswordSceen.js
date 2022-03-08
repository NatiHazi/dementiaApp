import React,{useState} from 'react';
import { View, Text, StyleSheet, useWindowDimensions,ScrollView} from 'react-native';
import CustomInput from '../../components/CutomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import {getAuth, sendPasswordResetEmail } from '../../../db/firebase'


const ConfirmEmailScreen = ({ route }) => {
    const { isTherapist} = route.params;
    const [userName, setUserName] = useState('');

    const navigation = useNavigation();

    const onSendPressed = () =>{
            const auth = getAuth();
    sendPasswordResetEmail(auth, userName)
    .then(() => {
        // Password reset email sent!
        // ..
        console.log("Password reset email sent! ")
        alert("Please go to mail and set new Password and then sign in with new Password")
        navigation.navigate("signIn", {isTherapist: isTherapist});
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        // ..
    });
        //navigation.navigate("NewPassword");
        
    };

    const onSignInPressed = () => {
        navigation.navigate("signIn", {isTherapist: isTherapist});
    };



    return (
        <ScrollView>
        <View style={styles.root}>
            <Text style={styles.title} >Reset your password  </Text>

             <CustomInput
              placeholder="email"
              value={userName} 
              setValue={setUserName}
              />
          
             
            <CustomButton text="Send" onPress={onSendPressed}/>

            <CustomButton
            text="Back to Sign in"
            onPress={onSignInPressed}
            type = "TERTIARY"
            />

            
        </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    root:{
        alignItems:'center',
        padding: 20,
    },
    title:{
        fontSize: 24,
        fontWeight:'bold',
        color:'#051C60',
        margin: 10,
    },
    text:{
        color:'gray',
        marginVertical:10,
    },
    link:{
        color:'#FDB075',
    },
})

export default ConfirmEmailScreen
