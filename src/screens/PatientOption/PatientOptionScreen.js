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
const [batteryStatus, setBatteryStatus]=useState('');
const [lon, setLon]=useState('');
const [lat, setLat]=useState('');

const [level] = useBatteryLevel();

 
  useEffect(() => {
  //   SystemSetting.getVolume().then((volume)=>{
  //     console.log('Current volume is ' + volume);
  // });
  // SystemSetting.setVolume(0.65);


  

    //#############start premission to contact##################
 //permissionContacts();
  getLocation(); //get user location and set in in useState 
  //#############start premission to call log##################
     
    //#############Check battery status##################
    setBatteryStatus(percentage(level));
    console.log(batteryStatus);
 
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);  
    if (initializing) return null;
    if(user){
      console.log("test if inside user");
      const uid = user.uid;
      updateBatteryandLocation(uid); //update in firebase battery and location
      updateTokenMessage(uid); //update user token for messaging cloud
      permessionCallLog(uid);


    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    //  return unsubscribe; 
     console.log("nati is the best"); 
  }
 
      else {
      console.log("user is not signed in");
      }
      return()=>{
        console.log("CLEAN USEEFFECT")
      }

  }, [level, lon, lat, batteryStatus]);


  function percentage(level) {
    return `${Math.floor(level * 100)}%`;
    
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

function getLocation(){
  (async ()=>{
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    else{
      (async ()=>{
    let location = await Location.getCurrentPositionAsync({});
    setLon(location.coords.longitude);
    setLat(location.coords.latitude);
  })();
    }
})();

  

}

function updateBatteryandLocation(uid){
  console.log("lon, lat, batt: ", {lon}, lat, batteryStatus);
  (async()=>{
    firestore()
    .collection('users')
    .doc(uid)
    .update({
      longitude: lon,
      latitude: lat,
      battery:batteryStatus
    })
    .then(() => {
      console.log('User updated!');
    });
})();
}

function updateTokenMessage(uid){
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