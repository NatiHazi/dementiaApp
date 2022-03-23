import React, { Component,useState,useEffect,useRef } from 'react'
import Constants from 'expo-constants';
import { Button, View,Text,Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
//import {getAuth, onAuthStateChanged, doc, updateDoc, getFirestore,getDocs,collection,getDoc } from '../../../db/firebase'
import * as Contacts from 'expo-contacts';
import * as Notifications from 'expo-notifications';
import { useBatteryLevel } from '@use-expo/battery';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid } from 'react-native';
import CallLogs from 'react-native-call-log';
import SystemSetting from 'react-native-system-setting';
 import SmsListner from 'react-native-android-sms-listener-background'


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const PatientOptionScreen = () => {
const [initializing, setInitializing] = useState(true);
const [user, setUser] = useState();
const [level] = useBatteryLevel();
const [firstRender, setfirstRender]=useState(true);
 
  useEffect(() => {
  //   SystemSetting.getVolume().then((volume)=>{
  //     console.log('Current volume is ' + volume);
  // });
  // SystemSetting.setVolume(0.65);


    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);  
    //if (initializing) return null;
    
    if(user){
      console.log("test if inside user");
      const uid = user.uid;
      if (firstRender){
        getLocationAndUpdateFirebase(uid);
         updateTokenMessage(uid); //update user token for messaging cloud
      permessionCallLog(uid);
      console.log(" F I R S T R E N D E R");
      // const testSms=SmsListner.addListener(message=>{
      //   console.log("the sms test listner: ", message);
        
      // })
      
      
  
       }
       const testSms=SmsListner.addListener(message=>{
        console.log("the sms test listner: ", message);
        
      })

      if(level)
      updateBatteryFirebase(uid, level);
      //updateLocationFirebase(uid);
     
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    //  return unsubscribe; 
     console.log("nati is the best"); 

     setfirstRender(false);

  }
 
      else {
      console.log("user is not signed in");
      }
      return()=>{
        console.log("CLEAN USEEFFECT")
        

      }

  }, [user,level]);

   

  function percentage(level) {
    return `${Math.floor(level * 100)}%`;
    
}
function updateBatteryFirebase(uid, level){
  let levelPercent=percentage(level);
  console.log(" BATTERY LEVEL LEVEL : " ,levelPercent);
  firestore()
  .collection('users')
  .doc(uid)
  .update({
    battery:levelPercent
  })
  .then(() => {
    console.log('User battery updated!');
  });
}



function onAuthStateChanged(user) {
  setUser(user);
  if (initializing) setInitializing(false);
}

function permissionContacts(){
  (async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Emails],
      });

      if (data.length > 0) {
        const contact = data[0];
        console.log("line 56 pateinet: ",JSON.stringify(contact))
        alert(JSON.stringify(contact));
      }
    }
  })();
}


function permessionCallLog(uid){
  (async ()=>{
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        {
          title: 'Call Log Example',
          message:
            'Access your call logs',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //console.log(CallLogs);
        CallLogs.load(5).then(c => {
          let i=0;
          let save_unknown_calls=[]
          for (i; i<c.length; i++){
            // console.log("i: ", c[i])
            if (!c[i]["name"]){
              save_unknown_calls.push(c[i]["dateTime"],c[i]["phoneNumber"])
            }
          }
          console.log("the arrrayyyyy: ", save_unknown_calls)
          firestore()
            .collection('users')
            .doc(uid)
            .update({
              unknown_calls: save_unknown_calls,
            })
            .then(() => {
              console.log('User updated!');
            });

        });

      } else {
        console.log('Call Log permission denied');
      }
    }

    catch (e) {
      console.log(e);
    }
  })();
}

function getLocationAndUpdateFirebase(uid){
  (async ()=>{
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    else{
      (async ()=>{
    let location = await Location.getCurrentPositionAsync({});
    firestore()
  .collection('users')
  .doc(uid)
  .update({
    longitude: location.coords.longitude,
    latitude: location.coords.latitude
  })
  .then(() => {
    console.log('User updated!');
  });
  })();
    }
})();

  

}


function updateTokenMessage(uid){
  console.log("I N  T O K E N  M E S S EAGE");
  firebase.messaging().getToken()
  .then(fcmToken => {
  if (fcmToken) {
  //console.log("gabi yexxxxssss",fcmToken);
  firestore()
  .collection('users')
  .doc(uid)
  .update({
    pushToken:fcmToken
  })
  .then(() => {
    console.log('User updated!');
  });
  // user has a device token
} else {
  console.log("nati yexxxxssss");
  // user doesn't have a device token yet
} 
});
}
  

  return (
    <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
    }}>
    <Text>"בדיקה"</Text>
  </View>
  )
}
export default PatientOptionScreen