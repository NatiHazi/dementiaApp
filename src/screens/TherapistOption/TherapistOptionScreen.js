import React,{useState,useEffect, useReducer} from 'react';
import { View,Image,Text ,ScrollView,StyleSheet,Linking,Alert } from 'react-native';
import CustomButtonForTherapistScreen from '../../components/CustomButtonForTherapistScreen';
import { useNavigation } from '@react-navigation/native';
//import { getAuth,signOut, onAuthStateChanged,collection,getDocs,getFirestore,doc,getDoc, query, where } from "../../../db/firebase";
import CustomButton from '../../components/CustomButton';
// import {getFirestore,collection, addDoc } from '../../../db/firebase'
import * as Location from 'expo-location';
import { async } from '@firebase/util';
import UseLocation from '../../location/useLocation'
import * as Battery from 'expo-battery';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';




const TherapistOptionScreen = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const navigation = useNavigation();


  useEffect(
    () => {
      auth().onAuthStateChanged(onAuthStateChanged);  
     if(user){
       console.log("user conected useEffect");
     }
    },
    [user]
  )
    const onTherapistPressed = () =>{
        // navigation.navigate("signIn");
        console.log("patient's call/message pressed")
    };

    const onPatientCallPressed = () =>{
      // navigation.navigate("signIn");
      console.log("patient's call pressed")
      navigation.navigate("ShowCallLogPage");
  };

  const onPatientSMSPressed = () =>{
    // navigation.navigate("signIn");
    console.log("patient's message pressed")
    navigation.navigate("ShowSMSLogPage");
};

    const findPatienPressed = () =>{
        console.log("find patiend pressed")
    navigation.navigate("UserLocation");
  
    };
    const onSendReminders = () =>{
        console.log("on send reminders pressed")
        navigation.navigate("SendNotification")
    } 

    const storeData = async (value) => {
      try {
        await AsyncStorage.multiSet(value)
        navigation.navigate("MainScreen");
        //getData();
      } catch (e) {
        // saving error
      }
    }

    const signOutFunction = () =>{
    
        auth()
        .signOut()
        .then(() => {
          storeData([['userkey', ''],['passkey', '']]);
          //navigation.navigate("MainScreen")
        
        });
    
  }
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
    const onBatteryStatusPressed = () =>{
      console.log("onBatteryStatusPressed");
     // auth().onAuthStateChanged(onAuthStateChanged);  
      if (initializing) return null;
      console.log("checkkkkkkkkkkkkkkk");
      if(user){
        console.log("test if inside user");
        const uid = user.uid;
        let phoneNumber = "";
        let persentBattery = "";
        //let idPatient = "";
        firestore()
        .collection('users')
        .doc(uid)
        .get()
        .then(documentSnapshot => {
          if (documentSnapshot.exists) {
            phoneNumber = documentSnapshot.data().myNum;
            console.log("line 62 : ",phoneNumber);
          }
          });
            firestore()
            .collection('users')
            .get()
            .then(querySnapshot => {
               querySnapshot.forEach(documentSnapshot => {
                 if(documentSnapshot.data().otherSidePhoneNum == phoneNumber){
                  persentBattery = documentSnapshot.data().battery;
                  //console.log("line 76 ",persentBattery)
                  Alert.alert(
                    "מצב הסוללה של המטופל:",
                    persentBattery,
                    [
                      { text: "אישור", onPress: () => console.log("OK Pressed") }
                    ]
                  );

                 }
                //console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
              });
            });
        }
        else {
        console.log("user is not signed in");
        } 
      }


      const onUpdatePressed1 = () =>{
        console.log("onUpdatePressed");
       // auth().onAuthStateChanged(onAuthStateChanged);  
        if (initializing) return null;
        if(user){
          console.log("test if inside user");
          const uid = user.uid;
          let phoneNumber = "";
          let persentBattery = "";
          let getOnUpdatePresedStatus = "";
          let getOnUpdatePresedStatusSec = "";
         
            firestore()
            .collection('users')
            .doc(uid)
            .get()
            .then(documentSnapshot => {
              console.log('User exists: ', documentSnapshot.exists);

              if (documentSnapshot.exists) {
                console.log('User data: ', documentSnapshot.data());
                  getOnUpdatePresedStatus = documentSnapshot.data().onUpdatePressed;
                  if(getOnUpdatePresedStatus)
                    getOnUpdatePresedStatusSec = false;
                  else
                    getOnUpdatePresedStatusSec = true;

                  firestore()
                  .collection('users')
                  .doc(uid)
                  .update({
                  onUpdatePressed: getOnUpdatePresedStatusSec,
                  })
                  .then(() => {
                  console.log('User updated!');
                  });
              }
            });
    

          }
          else {
          console.log("user is not signed in");
          } 
        }
   
      
    return (
        <ScrollView keyboardShouldPersistTaps='handled'>
        <View style={styles.root}>
            <Text style={styles.title} >DementiaApp  </Text>
            <Text style={styles.text} > </Text>
            <CustomButtonForTherapistScreen text="לחץ לקבלת מיקום" onPress={()=>{findPatienPressed()}}/> 
            <CustomButtonForTherapistScreen text="לחץ לרשימת השיחות" onPress={()=>{onPatientCallPressed()}}/> 
            <CustomButtonForTherapistScreen text="לחץ לרשימת ההודעות שהתקבלו" onPress={()=>{onPatientSMSPressed()}}/> 
            <CustomButtonForTherapistScreen text="לחץ לשליחת תזכורת" onPress={()=>{onSendReminders()}}/> 
            <CustomButtonForTherapistScreen text="לחץ לבדיקת מצב סוללה" onPress={()=>{onBatteryStatusPressed()}}/>
            <CustomButtonForTherapistScreen text="לחץ לעידכון פרטי המטופל" onPress={()=>{onUpdatePressed1()}}/>
            <CustomButton text="Sing out" onPress={signOutFunction} type = "SIGNOUT"/>
           
            {/* <CustomButtonForTherapistScreen text="Therapist" onPress={onTherapistPressed}/> 
            <CustomButtonForTherapistScreen text="Patient" onPress={onTherapistPressed}/>  */}
        </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
 
    root:{
        alignItems:'center',
        backgroundColor:'snow',
        padding: 20,
    },
    title:{
        fontSize: 36,
        fontWeight:'bold',
        color:'#051C60',
        margin: 10,
    },
    text:{
        flex: 1,
        fontStyle:'normal',
        fontWeight:'bold',
        fontSize: 22,
        textAlign:'center',
        color:'#051C60',
        margin: 10,
    },
    logo: {
        width:300,
        height:300,
    },
})


export default TherapistOptionScreen