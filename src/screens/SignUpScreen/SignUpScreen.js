import React,{useState} from 'react';
import { View, Text, StyleSheet, useWindowDimensions,ScrollView} from 'react-native';
import CustomInput from '../../components/CutomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import {getAuth,createUserWithEmailAndPassword,sendEmailVerification,getFirestore,collection, addDoc,setDoc,doc } from '../../../db/firebase'


const SignUpScreen = ({ route }) => {
    const { isTherapist} = route.params;
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [otherSideNum, setotherSideNum] = useState('');
    const [yourNum, setYourNum] = useState('');

    const navigation = useNavigation();

    const onRegisterPressed = () =>{
        console.log("test");
            const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        const db = getFirestore();
            (async () => {
                await setDoc(doc(db, "users", user.uid), {
                    id:  user.uid,
                    isTherapist:isTherapist,
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
        navigation.navigate("ConfirmEmail", {isTherapist: isTherapist});
       
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
            console.log(errorMessage);
        }

        // ..
    });
        
    };

    const onSignInPressed = () => {
        navigation.navigate("signIn", {isTherapist: isTherapist});
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
            <Text style={styles.title} >יצירת חשבון חדש </Text>

             <CustomInput
              placeholder=" שם משתמש"
              value={username} 
              setValue={setUsername}
              secureTextEntry={false}
              />
              <CustomInput
              placeholder="מייל"
              value={email} 
              setValue={setEmail}
              secureTextEntry={false}
              />
             <CustomInput
              placeholder="סיסמא"
              value={password}
              setValue={setPassword} 
              secureTextEntry
              />
              <CustomInput
              placeholder="אימות סיסמא"
              value={passwordRepeat}
              setValue={setPasswordRepeat} 
              secureTextEntry
              />
               <CustomInput
              placeholder="מספר טלפון שלך"
              value={yourNum}
              setValue={setYourNum} 
              secureTextEntry={false}
              />
              <CustomInput
              placeholder="מספר טלפון של המטופל"
              value={otherSideNum}
              setValue={setotherSideNum} 
              secureTextEntry={false}
              />

            <CustomButton text="הרשם" onPress={()=>onRegisterPressed()}/>


            <CustomButton
            text="יש לך חשבון? לחץ לכניסה"
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
