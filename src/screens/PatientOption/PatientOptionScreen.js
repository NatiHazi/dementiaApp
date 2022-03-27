import React, { Component,useState,useEffect,useRef } from 'react'
import Constants from 'expo-constants';
import { Button, View,Text,Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
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
import SmsListner from 'react-native-android-sms-listener-background';
import CallDetectorManager from 'react-native-call-detection';
import SmsAndroid from 'react-native-get-sms-android';
import CustomButton from '../../components/CustomButton';



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
      startListenerTapped(uid);
           const testSms=SmsListner.addListener(message=>{
        console.log("the sms test listner: ", message);
        SmsAndroid.autoSend(
          "54654654654",
          "new SMS received to the patient",
          (fail) => {
            console.log('Failed with this error: ' + fail);
          },
          (success) => {
            console.log('SMS sent successfully');
          },
        ); 

      })
    }
  
      
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

 function startListenerTapped(uid) {
    this.callDetector = new CallDetectorManager((event, phoneNumber)=> {
    // For iOS event will be either "Connected",
    // "Disconnected","Dialing" and "Incoming"
 
    // For Android event will be either "Offhook",
    // "Disconnected", "Incoming" or "Missed"
    // phoneNumber should store caller/called number
 
 
    if (event === 'Disconnected') {
    // Do something call got disconnected
    console.log("DISCONNETED")
    SmsAndroid.autoSend(
      "54654654654",
      "new call recieved and ended",
      (fail) => {
        console.log('Failed with this error: ' + fail);
      },
      (success) => {
        console.log('SMS sent successfully');
      },
    ); 
    permessionCallLog(uid);
    
    }
    // else if (event === 'Connected') {
    // // Do something call got connected
    // // This clause will only be executed for iOS

    // }
    else if (event === 'Incoming') {
    // Do something call got incoming
    console.log("Incoming")
    }
    // else if (event === 'Dialing') {
    // // Do something call got dialing
    // // This clause will only be executed for iOS
    // }
    else if (event === 'Offhook') {
    //Device call state: Off-hook.
    // At least one call exists that is dialing,
    // active, or on hold,
    // and no calls are ringing or waiting.
    // This clause will only be executed for Android
    console.log("Offhook")
    }
    else if (event === 'Missed') {
    	// Do something call got missed
    	// This clause will only be executed for Android
      console.log("Missed")
      SmsAndroid.autoSend(
        "54654654654",
        "new call recieved and missed",
        (fail) => {
          console.log('Failed with this error: ' + fail);
        },
        (success) => {
          console.log('SMS sent successfully');
        },
      ); 
      permessionCallLog(uid);

  }
  console.log("event: ", event, "phone: ", phoneNumber);

  
},
false, // if you want to read the phone number of the incoming call [ANDROID], otherwise false
()=>{}, // callback if your permission got denied [ANDROID] [only if you want to read incoming number] default: console.error
{
title: 'Phone State Permission',
message: 'This app needs access to your phone state in order to react and/or to adapt to incoming calls.'
} // a custom permission request message to explain to your user, why you need the permission [recommended] - this is the default one
)
};
 
function stopListenerTapped() {
    this.callDetector && this.callDetector.dispose();
    
};

   

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
const signOutFunction = () =>{
    
  auth()
  .signOut()
  .then(() => navigation.navigate("MainScreen"));

}

  

  return (
    <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
    }}>
    <Text>"׳‘׳“׳™׳§׳”"</Text>
    <CustomButton text="Sing out" onPress={()=>signOutFunction()} type = "SIGNOUT"/>
  </View>
  )
}
export default PatientOptionScreen