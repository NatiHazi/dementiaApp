import React,{useState,useEffect, useRef} from 'react';
import { View ,Image, StyleSheet,ScrollView,Text,I18nManager,Alert, Linking } from 'react-native';
import CustomInput from '../../components/CutomInput';
import CustomButton from '../../components/CustomButton';
import CustomInputWithEye from '../../components/CutomInputWithEye/CustomInputWithEye';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInFirebase } from '../../utils/firebase';
import { PermissionsAndroid } from 'react-native';


const SignInScreen = ({ route }) => {
    const { isTherapist} = route.params;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [toggleCheckBox, setToggleCheckBox] = useState(false);
    const navigation = useNavigation();
   
    const onSignInPressed = () =>{
      if (username === '' || password === ''){
        Alert.alert(
          "שגיאת התחברות",
          "כל השדות הינם חובה",
          [
            { text: "אישור", onPress: () => console.log("OK Pressed") }
          ]
        );
      }
      else{
        signInFirebase(username, password,isTherapist).then((result)=>{
        if (result!== 'fail'){
          if (result === true)
            navigation.navigate("TherapistScreen");
          else{
            askPermissions();
          
          }
        }
      });
    }
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
      
      const askPermissions = () =>{
        (async()=>{ 
          try{
            const granted1 = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
              title: "אפליקצית DementiaApp רוצה הרשאות לאנשי קשר",
              message:
                "אפליקצית DementiaApp אוספת נתוני אנשי קשר כדי לזהות שיחות",
              buttonNeutral: "שאל אותי אחר כך",
              buttonNegative: "ביטול",
              buttonPositive: "אישור"
            }
          );
          
          const granted6 = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECEIVE_SMS, 
            {
              title: "אפליקצית DementiaApp רוצה הרשאות להודעות נכנסות",
              message:
                "אפליקצית DementiaApp אוספת נתוני הודעות נכנסות כדי לזהות הודעות זדוניות",
              buttonNeutral: "שאל אותי אחר כך",
              buttonNegative: "ביטול",
              buttonPositive: "אישור"
            }
          );

          const granted2 = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_SMS, 
            {
              title: "אפליקצית DementiaApp רוצה הרשאות לקרוא הודעות",
              message:
                "אפליקצית DementiaApp אוספת נתוני הודעות כדי לזהות הודעות זדוניות",
              buttonNeutral: "שאל אותי אחר כך",
              buttonNegative: "ביטול",
              buttonPositive: "אישור"
            }
          );
          const granted5 = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.SEND_SMS,
            {
              title: "אפליקצית DementiaApp רוצה הרשאות לשליחת הודעות",
              message:
                "אפליקצית DementiaApp שולחת הודעות כדי לעדכן את המטפל",
              buttonNeutral: "שאל אותי אחר כך",
              buttonNegative: "ביטול",
              buttonPositive: "אישור"
            }
          );
          const granted3 = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "אפליקצית DementiaApp רוצה הרשאות למיקום",
              message:
                "אפליקצית DementiaApp מבקשת הרשאות למיקום כדי לעדכן את המטפל",
              buttonNeutral: "שאל אותי אחר כך",
              buttonNegative: "ביטול",
              buttonPositive: "אישור"
            }
            
          );

          const granted4 = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
            {
              title: "אפליקצית DementiaApp רוצה הרשאות ליומן שיחות",
              message:
                "אפליקצית DementiaApp מבקשת הרשאות ליומן שיחות בשביל לזהות שיחות לא מזוהות",
              buttonNeutral: "שאל אותי אחר כך",
              buttonNegative: "ביטול",
              buttonPositive: "אישור"
            }
            
          );

          const granted7 = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            {
              title: "אפליקצית DementiaApp רוצה הרשאות למיקום ברקע",
              message:
                "אפליקצית DementiaApp מבקשת הרשאות למיקום ברקע כדי לעדכן את המטפל, ההרשאה תפעל כאשר האפליקציה פתוחה ברקע",
              buttonNeutral: "שאל אותי אחר כך",
              buttonNegative: "ביטול",
              buttonPositive: "אישור"
            }
            
          );
          if(granted1 !== PermissionsAndroid.RESULTS.GRANTED || granted2 !== PermissionsAndroid.RESULTS.GRANTED || granted3 !== PermissionsAndroid.RESULTS.GRANTED
             || granted4 !== PermissionsAndroid.RESULTS.GRANTED ||granted5 !== PermissionsAndroid.RESULTS.GRANTED){
              Alert.alert(
                "הרשאות גישה",
                "אנא שים לב כי האפליקציה צריכה הרשאות גישה של הודעות, אנשי קשר,מיקום ולוג שיחות על מנת לעבוד כראוי. \n אם לא אישרת את אחד מההרשאות תצטרך לעשות זאת ידנית דרך ההגדרות",
                [
                  {
                    text: "הבנתי",
                    onPress: () => {navigation.navigate("PatientScreen");}
                   // onPress: () => {Linking.openSettings();}
                  }
                ]
              );
          }
          else{
            navigation.navigate("PatientScreen");
          }
          }catch(err){
            console.log("line 52: err in sign in: ", err);
          }
        })();
      }



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