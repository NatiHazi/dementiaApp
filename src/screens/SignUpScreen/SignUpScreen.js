import React,{useState} from 'react';
import { View, Text, StyleSheet, useWindowDimensions,ScrollView} from 'react-native';
import CustomInput from '../../components/CutomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import {getAuth,createUserWithEmailAndPassword,sendEmailVerification,getFirestore,collection, addDoc,setDoc,doc } from '../../../db/firebase'


const SignUpScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [otherSideNum, setotherSideNum] = useState('');
    const [yourNum, setYourNum] = useState('');

    const navigation = useNavigation();

    const onRegisterPressed = () =>{
            const auth = getAuth();
            console.log("email line 21:", email)
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        const db = getFirestore();
            (async () => {
                await setDoc(doc(db, "users", user.uid), {
                    id:  user.uid,
                    isTherapist:true,
                    myNum: yourNum,
                    otherSidePhoneNum: otherSideNum
                  });
        
            })();
            sendEmailVerification(auth.currentUser)
            //user.emailVerified =>checks if user verified email.
    .then(() => {
        // Email verification sent!
        // ...
        console.log("email verification sent!")
        navigation.navigate("ConfirmEmail");
       
    });
        
        
        // ...
        console.log("created new user with mail: ", user.email)
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        if (errorCode==="auth/email-already-in-use"){
        alert("this email already in use")
        }
        else{
            alert(errorMessage)
        }
        // ..
    });
        
    };

    const onSignInPressed = () => {
        navigation.navigate("signIn");
    };

    const onTermOfUsePressed = () => {
        console.log("onSignUpPressed");
    };
    const onPrivacyPressed = () => {
        console.log("onPrivacyPressed");
    };

    return (
        <ScrollView>
        <View style={styles.root}>
            <Text style={styles.title} >Create an account </Text>

             <CustomInput
              placeholder="UserName"
              value={username} 
              setValue={setUsername}
              secureTextEntry={false}
              />
              <CustomInput
              placeholder="Email"
              value={email} 
              setValue={setEmail}
              secureTextEntry={false}
              />
             <CustomInput
              placeholder="Password"
              value={password}
              setValue={setPassword} 
              secureTextEntry
              />
              <CustomInput
              placeholder="Password Repeat"
              value={passwordRepeat}
              setValue={setPasswordRepeat} 
              secureTextEntry
              />
               <CustomInput
              placeholder="your phone number"
              value={yourNum}
              setValue={setYourNum} 
              secureTextEntry={false}
              />
              <CustomInput
              placeholder="Patient phone number"
              value={otherSideNum}
              setValue={setotherSideNum} 
              secureTextEntry={false}
              />

            <CustomButton text="Register" onPress={()=>onRegisterPressed()}/>

            <Text style={styles.text}>
                By registering, you confirm that you accept our 
                <Text styles={styles.link} onPress={onTermOfUsePressed} > Term of Use</Text> and 
                <Text styles={styles.link} onPress={onPrivacyPressed} > Privacy Policy</Text>
            </Text>

            <CustomButton
            text="Have have an account? Sign in"
            onPress={onSignInPressed}
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

export default SignUpScreen
