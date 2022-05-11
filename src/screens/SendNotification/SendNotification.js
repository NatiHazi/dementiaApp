import React, { useState } from 'react';
import { Text, TextInput, View,ScrollView,StyleSheet,Alert,Linking } from 'react-native';
import CustomInput from '../../components/CutomInput';
import CustomButton from '../../components/CustomButton';
//import { getAuth, onAuthStateChanged,collection,getDocs,getFirestore,doc,getDoc, query, where } from "../../../db/firebase";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import SmsAndroid from 'react-native-get-sms-android';
//import { initializeApp } from "firebase-admin/app";

//initializeApp();

const SendNotification = () => {
    // const [title, setTitle] = useState('');
    // const [body, setBody] = useState('');
    const [user,setUser]=useState();
    const [initializing, setInitializing] = useState(true);


    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
      }

    const onSendNotificationPressed = () =>{
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        if (initializing) return null;
        if (user){
            console.log("line 30 in POJAGOJSGOIJ");
            const uid = user.uid;
            firestore()
            .collection('users')
            .doc(uid)
            .get()
            .then(documentSnapshot => {
              if (documentSnapshot.exists) {
               let phoneNumber = documentSnapshot.data().myNum;
                firestore()
                .collection('users')
                .get()
                .then(querySnapshot => {
                   querySnapshot.forEach(documentSnapshot => {
                     if(documentSnapshot.data().otherSidePhoneNum == phoneNumber){
                
                    let pushToken=documentSnapshot.data().pushToken;

                    console.log(pushToken);

                    
                    SmsAndroid.autoSend(
                      phoneNumber,
                      "SERVER KEY: \n AAAAZaWXYR4:APA91bFquEfQyxc1-uwisNTrpgfut4q7TZiOfMkVIq1FFRkhm95M5DqVqPvB2PcdL3KhoGTO9aFwwk_0FsJtDAzeotWJuj5lLUQ386kiDHuBEtYezbYnz6SRXCmgyOMR-WbSMImljXrA ",
                      (fail) => {
                        console.log('Failed with this error: ' + fail);
                      },
                      (success) => {
                        console.log('SMS sent successfully');
                      },
                    );   
                    SmsAndroid.autoSend(
                      phoneNumber,
                      "DEVICE TOKEN: \n "+ pushToken,
                      (fail) => {
                        console.log('Failed with this error: ' + fail);
                      },
                      (success) => {
                        console.log('SMS sent successfully');
                      },
                    );   


                    Linking.openURL('https://testfcm.com/');
                   
                     }
                  });
                });
              }
              });
          }
          else{
            console.log("user is not sigend in")
          }
            return subscriber;

    


    }
  return (
    <ScrollView>
        <View style={styles.root}>
            <Text style={styles.title} >שליחת תזכורות </Text>

            <Text style={styles.text}>
              אתה עומד לקבל שתי הודעות SMS המכילות קודים.
              את הקודים אתה צריך לשים בשני השדות הראשונים בעמוד שאליו תעבור.
            </Text>
            <Text style={styles.text}>שים לב כאשר אתה מדביק: מחק את ההתחלה שמכילה "SERVER KEY: "
              ו-"DEVICE TOKEN:"
            </Text>

             {/* <CustomInput
              placeholder="Title"
              value={title} 
              setValue={setTitle}
              secureTextEntry={false}
              />
              <CustomInput
              placeholder="Body"
              value={body} 
              setValue={setBody}
              secureTextEntry={false}
              /> */}
        

            <CustomButton text="הבנתי" onPress={()=>onSendNotificationPressed()}/>

            
        </View>
        </ScrollView>
  );
}
const styles = StyleSheet.create({
    root:{
        alignItems:'center',
        padding: 50,
    },
    title:{
        fontSize: 24,
        fontWeight:'bold',
        color:'#051C60',
        margin: 10,
    },
    text:{
      fontSize: 18,
     // fontWeight:'bold',
      color:'#000',
     // margin: 10,
      paddingBottom:20,
  },
 
})

export default SendNotification;

