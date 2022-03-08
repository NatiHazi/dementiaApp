import React, { Component,useState,useEffect,useRef } from 'react'
import Constants from 'expo-constants';
import { Button, View,Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
//import {getAuth, onAuthStateChanged, doc, updateDoc, getFirestore,getDocs,collection,getDoc } from '../../../db/firebase'
import * as Contacts from 'expo-contacts';
import * as Notifications from 'expo-notifications';
import { useBatteryLevel } from '@use-expo/battery';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';



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
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
    })();

    (async ()=>{
      let location = await Location.getCurrentPositionAsync({});
      let long=location.coords.longitude
      let lat=location.coords.latitude
      console.log(long);
      console.log(lat);
      (async()=>{
                  firestore()
                  .collection('users')
                  .doc(uid)
                  .update({
                    longitude: long,
                    latitude: lat,
                    battery:batteryStatus
                  })
                  .then(() => {
                    console.log('User updated!');
                  });
            })();

      })();
      registerForPushNotificationsAsync().then(token => {setExpoPushToken(token);

        (async()=>{
       // const docRef = doc(db, "users", uid);
          // await updateDoc(docRef, {
          //     pushToken:token
          // });
          firestore()
          .collection('users')
          .doc(uid)
          .update({
            pushToken:token
          })
          .then(() => {
            console.log('User updated!');
          });
        })();
        });
        //registerForPushNotificationsAsync().then(token => console.log(token));
        
        
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
        });
        
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
        });
    }
      else {
      console.log("user is not signed in");
      }


return () => {
  Notifications.removeNotificationSubscription(notificationListener.current);
  Notifications.removeNotificationSubscription(responseListener.current);
};
  }, [level]);

  function percentage(level) {
    return `${Math.floor(level * 100)}%`;
}
  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    return token;
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