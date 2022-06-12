import React,{useState,useEffect} from 'react';
import { View, Text, StyleSheet, useWindowDimensions,ScrollView,I18nManager} from 'react-native';
import CustomInput from '../../components/CutomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
//import {getAuth,createUserWithEmailAndPassword,sendEmailVerification,getFirestore,collection, addDoc,setDoc,doc } from '../../../db/firebase'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { createUserWithEmailAndPasswordHandler, createNewDocumentForUser } from '../../utils/firebase';

const SignUpScreen = ({ route }) => {
    const { isTherapist} = route.params;
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [otherSideNum, setotherSideNum] = useState('');
    const [yourNum, setYourNum] = useState('');
    const [patientMail, setPatientMail] = useState('');

    const navigation = useNavigation();

   //const user = userCredential.user;
//    const [initializing, setInitializing] = useState(true);
//    const [user, setUser] = useState();


    const onRegisterPressed = () =>{
        if (username==='' || email==='' || password==='' || passwordRepeat==='' || otherSideNum==='' || yourNum==='' || (isTherapist && patientMail===''))
        alert("כל השדות הינם חובה");
        else{
            createUserWithEmailAndPasswordHandler(email,password).then((result)=>{
                console.log("AFTER");
                if (result!=='fail'){
                    createNewDocumentForUser(result, isTherapist, yourNum, otherSideNum, username, patientMail).then(()=>{
                        navigation.navigate("signIn", {isTherapist: isTherapist});
                    });
                
               
                }
            }).catch(error =>{
                console.log(error);
            })
            console.log("BEFORE");
   
    }
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
              style={styles.input}
              />
              <CustomInput
              placeholder="מייל"
              value={email} 
              setValue={setEmail}
              secureTextEntry={false}
              style={styles.input}
              />
             <CustomInput
              placeholder="סיסמא"
              value={password}
              setValue={setPassword} 
              secureTextEntry
              style={styles.input}
              />
              <CustomInput
              placeholder="אימות סיסמא"
              value={passwordRepeat}
              setValue={setPasswordRepeat} 
              secureTextEntry
              style={styles.input}
              />
               <CustomInput
              placeholder="מספר טלפון שלך"
              value={yourNum}
              setValue={setYourNum} 
              secureTextEntry={false}
              style={styles.input}
              />
              <CustomInput
              placeholder={isTherapist? "מספר טלפון של המטופל" : "מספר טלפון של המטפל"}
              value={otherSideNum}
              setValue={setotherSideNum} 
              secureTextEntry={false}
              style={styles.input}
              />
              {isTherapist? 
                  <CustomInput
                  placeholder="מייל של המטופל. שים לב המטופל צריך להרשם לפניך"
                  value={patientMail}
                  setValue={setPatientMail} 
                  secureTextEntry={false}
                  style={styles.input}
                  />
                  : null  
            }

            <CustomButton text="הרשם"  onPress={()=>onRegisterPressed()}/>


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
        padding: 50,
    },
    input:{
        //textAlign:'left',
        width:"100%",
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    title:{
        fontSize: 30,
        fontWeight:'bold',
        color:'#051C60',
        margin: 20,
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


