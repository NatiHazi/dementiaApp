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
import CallLogs from 'react-native-call-log'


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

const [expoPushToken, setExpoPushToken] = useState('');
const [notification, setNotification] = useState(false);
const notificationListener = useRef();
const responseListener = useRef();

const [level] = useBatteryLevel();

function onAuthStateChanged(user) {
  setUser(user);
  if (initializing) setInitializing(false);
}

  useEffect(() => {
    //#############Check battery status##################
    let batteryStatus = percentage(level);
    console.log(batteryStatus);
    //#############start premission to contact##################
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          const contact = data[0];
          alert(JSON.stringify(contact));
        }
      }
    })();
    //#############end premission to contact##################

    //#############start premission to location##################
    // const auth = getAuth();
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);  
    if (initializing) return null;
    if(user){
      console.log("test if inside user");
      const uid = user.uid;
      (async ()=>{
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log("717171771177111771171717711")
        if (status !== 'granted') {
          console.log("kdsjfdffsj.fsdfjsdlfsdf")
          setErrorMsg('Permission to access location was denied');
          return;
        }
    })();

    (async ()=>{
      console.log("testtttttttttttttttttttttttttttttttt");
      let location = await Location.getCurrentPositionAsync({});
      console.log("testtttttttttttttttttttttttttttttttt");
      let long=location.coords.longitude
      let lat=location.coords.latitude
      console.log("line 81 ",long);
      console.log("line 82 ",lat);
      (async()=>{
                  firestore()
                  .collection('users')
                  .doc(uid)
                  .update({
                    longitude: "long",
                    latitude: "lat",
                    battery:batteryStatus
                  })
                  .then(() => {
                    console.log('User updated!');
                  });
            })();

      })();
      //#############end premission to location##################

      //#############start premission to notfication##################
   
  
      firebase.messaging().getToken()
      .then(fcmToken => {
      if (fcmToken) {
      console.log("gabi yexxxxssss",fcmToken);
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
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  });
   //#############end premission to notfication##################

    //#############start premission to call##################
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
        console.log(CallLogs);
        CallLogs.load(5).then(c => console.log("ccccccccccccccccccccccccccccccccc",c));

      } else {
        console.log('Call Log permission denied');
      }
    }

    catch (e) {
      console.log(e);
    }
  })();



     return unsubscribe; 
     console.log("nati is the best"); 
  }
 
      else {
      console.log("user is not signed in");
      }

  }, [level]);

  function percentage(level) {
    return `${Math.floor(level * 100)}%`;
}
  // async function registerForPushNotificationsAsync() {
  //   let token;
  //   if (Constants.isDevice) {
  //     const { status: existingStatus } = await Notifications.getPermissionsAsync();
  //     let finalStatus = existingStatus;
  //     if (existingStatus !== 'granted') {
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       finalStatus = status;
  //     }
  //     if (finalStatus !== 'granted') {
  //       alert('Failed to get push token for push notification!');
  //       return;
  //     }
  //     token = (await Notifications.getExpoPushTokenAsync()).data;
  //     console.log(token);
  //   } else {
  //     alert('Must use physical device for Push Notifications');
  //   }
  
  //   if (Platform.OS === 'android') {
  //     Notifications.setNotificationChannelAsync('default', {
  //       name: 'default',
  //       importance: Notifications.AndroidImportance.MAX,
  //       vibrationPattern: [0, 250, 250, 250],
  //       lightColor: '#FF231F7C',
  //     });
  //   }
  //   return token;
  // }  
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