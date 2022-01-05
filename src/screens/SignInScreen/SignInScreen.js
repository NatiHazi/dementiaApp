import React,{useState} from 'react';
import { View ,Image, StyleSheet,ScrollView} from 'react-native';
import CustomInput from '../../components/CutomInput';
import CustomButton from '../../components/CustomButton';
import CustomInputWithEye from '../../components/CutomInputWithEye/CustomInputWithEye';
import { useNavigation } from '@react-navigation/native';
import {getAuth,signInWithEmailAndPassword,collection, getDocs,getFirestore} from '../../../db/firebase'



const SignInScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // const [therapist, setTherapist]=useState(false);
    const navigation = useNavigation();
    
    const onSignInPressed = () =>{
     const auth = getAuth();
signInWithEmailAndPassword(auth, username, password)
  .then((userCredential) => {
      //console.log("sucess")
    // Signed in 
    const user = userCredential.user;
    const uid = user.uid;
    console.log(user.email)
    if (!user.emailVerified){
        alert("you must verify your account in your mail")
    }
    else{
        console.log("log in succeed")
        async function fetchFunction(){
            const db = getFirestore();
           const querySnapshot = await getDocs(collection(db, "users"));
            querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data().isTherapist}`);
            if (doc.data().id===uid){
            if (doc.data().isTherapist==true){
               navigation.navigate("TherapistScreen");
            }
            else{
              navigation.navigate("PatientScreen"); 
            }

        }

            });
        }
        fetchFunction();
        
       
    }
   
    
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
             <CustomInputWithEye 
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
