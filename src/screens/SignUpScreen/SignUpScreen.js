import React,{useState,useEffect} from 'react';
import { View, Text, StyleSheet, useWindowDimensions,ScrollView} from 'react-native';
import CustomInput from '../../components/CutomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
//import {getAuth,createUserWithEmailAndPassword,sendEmailVerification,getFirestore,collection, addDoc,setDoc,doc } from '../../../db/firebase'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const SignUpScreen = ({ route }) => {
    const { isTherapist} = route.params;
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [otherSideNum, setotherSideNum] = useState('');
    const [yourNum, setYourNum] = useState('');

    const navigation = useNavigation();

   //const user = userCredential.user;
   const [initializing, setInitializing] = useState(true);
   const [user, setUser] = useState();
   useEffect(() => {
    //Runs on the first render
    //And any time any dependency value changes
    if(user){
        console.log('inside user line 40');
        firestore()
        .collection('users')
        .doc(user.uid)
        .set({
            id:  user.uid,
            isTherapist:isTherapist,
            myNum: yourNum,
            otherSidePhoneNum: otherSideNum
        })
        .then(() => {
            console.log('User added!');
        });
      
    }
  }, [user]);
   // Handle user state changes
   function onAuthStateChanged(user) {
     setUser(user);
     if (initializing) setInitializing(false);
   }

    const onRegisterPressed = () =>{
        console.log("test");  
        auth()
        .createUserWithEmailAndPassword(email,password)
        .then((userCredential) => {
        console.log('User account created & signed in!');
        userCredential.user.sendEmailVerification();
        auth().onAuthStateChanged(onAuthStateChanged);
   
        // (async()=>{
        // await auth().currentUser.sendEmailVerification({
        //     handleCodeInApp: true,
        //     url: email,
        //    });
        // })();
        
           navigation.navigate("ConfirmEmail", {isTherapist: isTherapist});
        })
        .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
        }

        console.error(error);
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
