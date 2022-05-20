import React,{useState,useEffect} from 'react';
import { View ,Image, StyleSheet,ScrollView,Text,I18nManager} from 'react-native';
import CustomInput from '../../components/CutomInput';
import CustomButton from '../../components/CustomButton';
import CustomInputWithEye from '../../components/CutomInputWithEye/CustomInputWithEye';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInFirebase } from '../../utils/firebase';


const SignInScreen = ({ route }) => {
    const { isTherapist} = route.params;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [toggleCheckBox, setToggleCheckBox] = useState(false);
    const navigation = useNavigation();

 
    const onSignInPressed = () =>{
      signInFirebase(username, password).then((result)=>{
        if (result!== 'fail'){
          if (result === true)
            navigation.navigate("TherapistScreen");
          else
            navigation.navigate("PatientScreen"); 

        }
      });

    };
        
    const onForgotPasswordPresed = () => {
        navigation.navigate("ForgotPassword", {isTherapist: isTherapist});
    };

    const onSignUpPressed = () => {
        navigation.navigate("signUn",{isTherapist: isTherapist});
    };
    const storeData = async (value) => {
        try {
          await AsyncStorage.multiSet(value)
          //getData();
        } catch (e) {
          // saving error
        }
      }
      
// const getData = async () => {
//     try {
//       const value = await AsyncStorage.multiGet(['userkey', 'passkey'])
//       if(value[0][1] !== null && value[0][1]!=='' &&  value[1][1]!=='' && value[1][1]!==null) {
//         // value previously stored
//         console.log("E M A I L: ", value[0][1], value[1][1]);
//         console.log(typeof(password));
//         setUsername(value[0][1]);
//         setPassword(value[1][1]);
//         console.log(typeof(value[1][1]));
//         console.log(typeof(password));
//         console.log("username", username);
//         onSignInPressed("called from asyncstorage",value[0][1], value[1][1]);
//       }
//     } catch(e) {
//       // error reading value
//       return;
//     }
//   }



    return (
        <ScrollView>
        <View style={styles.root}>
            <Image style={styles.logo} source={require('../../../assets/logo.jpg')}>
            </Image>
                
             <CustomInput
                
               
                placeholder="הכנס מייל"
                value={username} 
                setValue={setUsername}
                style={styles.input}
                secureTextEntry={false}
                
              />
    
             <CustomInput 
             
             placeholder="הכנס סיסמא"
              secureTextEntry 
              value={password}
              setValue={setPassword}
              style={styles.input}
              
              />


            <View style={styles.checkboxContainer}>
          
             <CheckBox style={styles.checkbox}
              disabled={false}
              value={toggleCheckBox}
              onValueChange={(newValue) => {setToggleCheckBox(newValue)
                storeData([['userkey', username],['passkey', password]]);
              }
            }
             />
              <Text style={styles.label}>זכור אותי</Text>
           
            
            </View>
        
            <CustomButton text="לחץ להתחברות" onPress={()=>onSignInPressed()}/>

            <CustomButton
            text="שכחת סיסמא?"
            onPress={onForgotPasswordPresed}
            type = "TERTIARY"
            />

            <CustomButton
            text="אין לך חשבון? לחץ להרשם!"
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
        padding: 50,
        backgroundColor:'snow',

    },
    input:{
      //textAlign:'left',
      width:"100%",
      height:'100%',
      textAlign: I18nManager.isRTL ? 'right' : 'left',

      
  },
    logo: {  
        width:250,
        height:280,
    },
    checkboxContainer: {
        flexDirection: "row",
        textAlign:"right",
      
    },
    checkbox: {
       alignSelf: "center",
 
      },
      label: {
        margin: 6,
        marginRight: '70%',
        color: 'grey'
      },
})

export default SignInScreen

