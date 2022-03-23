import React,{useState} from 'react';
import { View ,Image, StyleSheet,ScrollView,Text} from 'react-native';
import CustomInput from '../../components/CutomInput';
import CustomButton from '../../components/CustomButton';
import CustomInputWithEye from '../../components/CutomInputWithEye/CustomInputWithEye';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CheckBox from '@react-native-community/checkbox';

const SignInScreen = ({ route }) => {
    const { isTherapist} = route.params;
    console.log("line 12 sign in screen: ", isTherapist)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [toggleCheckBox, setToggleCheckBox] = useState(false);
    const navigation = useNavigation();
    // const [therapist, setTherapist]=useState(false);
    //  const auth = getAuth();
    const onSignInPressed = () =>{
    auth().signInWithEmailAndPassword(username, password)
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
        const usersCollection = firestore().collection('users');
        firestore()
        .collection('users')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            if (documentSnapshot.data().id===uid){
                console.log("inside id===uid");
                if (documentSnapshot.data().isTherapist==true){
                    console.log("inside Therapist is true");
               navigation.navigate("TherapistScreen");
            }
            else{
                console.log("inside Therapist is false");
              navigation.navigate("PatientScreen"); 
            }
            }
           // console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
          });
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
        
    const onForgotPasswordPresed = () => {
        navigation.navigate("ForgotPassword", {isTherapist: isTherapist});
    };

    const onSignUpPressed = () => {
        navigation.navigate("signUn",{isTherapist: isTherapist});
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


            <View style={styles.checkboxContainer}>
             <CheckBox style={styles.checkbox}
              disabled={false}
              value={toggleCheckBox}
              onValueChange={(newValue) => setToggleCheckBox(newValue)}
             />
            <Text style={styles.label}>Remember Me</Text>
            
            </View>
        
            <CustomButton text="Sign In" onPress={onSignInPressed}/>

            <CustomButton
            text="Forgot password?"
            onPress={onForgotPasswordPresed}
            type = "TERTIARY"
            />

            <CustomButton
            text="Don't have an account? Create one"
            onPress={()=>onSignUpPressed()}
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
    checkboxContainer: {
        flexDirection: "row",
        textAlign:"left",
    },
    checkbox: {
        alignSelf: "center",
        
      },
      label: {
        margin: 6,
      },
})

export default SignInScreen
