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
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import storage from '@react-native-firebase/storage';
import WallPaperManager from "react-native-set-wallpaper";
import BackgroundTimer from 'react-native-background-timer';




const PatientOptionScreen = () => {
const [initializing, setInitializing] = useState(true);
const [user, setUser] = useState();
const [level] = useBatteryLevel();
const [firstRender, setfirstRender]=useState(true);
const [therapistPhone, settherapistPhone]=useState();
const [idThearpist, setIdThearpist]=useState();
const [batteryLife, setBatterLife]=useState();
const prevBatteryLife = useRef();
const [userLocation, setUserLocation]=useState({
  longitude: '',
    latitude: '',
});
const prevUserLocation = useRef({
  longitude: '',
    latitude: '',
});

// const [patientCalls, setPatientCalls]=useState();


const navigation = useNavigation();

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
        getLocationAndUpdateFirebase();
         updateTokenMessage(uid); //update user token for messaging cloud
      permessionCallLog(uid);

      findTherapitNumAndId(uid);
      console.log(" F I R S T R E N D E R");
     
     
      smsLog(uid);
      updateSettingsFirebase(uid);
    }
    if (therapistPhone && idThearpist){
      console.log("LINE 67, AND PHONE: ", therapistPhone);
      listenSMSAndSend(uid,therapistPhone); //listen for sms coming and notice the therapist new sms came
      startListenerTapped(uid,therapistPhone); //same with calls
      listenerForUpdates(uid, idThearpist);
    }
  
      
  
      
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

  }, [user,therapistPhone,idThearpist]);

  //USEEFFECT FOR CHECKING BATTERY STATUS AND IF NEED UPDATING IN SERVER
  useEffect(() => {
    if (batteryLife && user && idThearpist){
      prevBatteryLife.current=batteryLife;
    console.log("LINE 100 BITCH");
    firestore()
    .collection('users')
    .doc(user.uid)
    .update({
      battery:batteryLife,
    })
    .then(() => {
      console.log('User battery updated!');
      const index = batteryLife.indexOf('%');
      const num_without_percent=batteryLife.substring(0, index);
      if (num_without_percent<20)
        updateColorForTherapist("colorBattery", "red");
      else
        updateColorForTherapist("colorBattery", "green");
    });
    }
}, [batteryLife, idThearpist]);
  //USEEFFECT FOR STARTING BACKGROUND INTERVAL FOR CHECKING BATTERY
  useEffect(() => {
    const intervalId = BackgroundTimer.setInterval(() => {
  
      updateSettingsFirebase();
      
  }, 3600000);
  return () => BackgroundTimer.clearInterval(intervalId);

  }, []);
  //USEEFFECT FOR STARTING INTEVAL FOR CHECKING LOCATION
  useEffect(() => {
     const intervalIdLocation = BackgroundTimer.setInterval(() => {
      getLocationAndUpdateFirebase();
      
  }, 3600000);

  return () => BackgroundTimer.clearInterval(intervalIdLocation);

  }, [user]);
  //USEEFFECT FOR CHECKING IF LOCATION HAS CAHNGED AFTER X MILI SECONDS AND IF DOES UPDATE IN SERVER
  useEffect(() => {
    if (userLocation && user && idThearpist){
      prevUserLocation.current.latitude=userLocation.latitude;
      prevUserLocation.current.longitude=userLocation.longitude;

      firestore()
      .collection('users')
      .doc(user.uid)
      .update({
        longitude: userLocation.longitude,
        latitude: userLocation.latitude
      })
      .then(() => {
        console.log('User updated!');
      });
    }

  }, [userLocation,idThearpist]);


  //MAKE COLORS FOR THE HERAPIST SCREEN-GREEN IS NEW DATA\GREY IS ALREADY SEEN\RED IS BATTERY UNDER 20%
    function updateColorForTherapist(theColorArtibute, theColor){
      if (idThearpist){
      firestore()
    .collection('users')
    .doc(idThearpist)
    .update({
      // [toUpdateField]: "grey",
      [theColorArtibute]: theColor,
    })
    .then(() => {
      console.log('User updated!');
    });
    }
    else{
    console.log("user not connected");
    }
    }
//FIND THERAPIST NUM AND ID IN FIRERBASE COLLECTION TO MAKE QUERIES EASIER
  function findTherapitNumAndId(uid){
    firestore()
    .collection('users')
    .doc(uid)
    .get()
    .then(documentSnapshot => {
    console.log('User exists: ', documentSnapshot.exists);

    if (documentSnapshot.exists) {
     // console.log('User data: ', documentSnapshot.data());
     let myPhone =  documentSnapshot.data().myNum;
     firestore()
    .collection('users')
    .get()
    .then(querySnapshot => {
    querySnapshot.forEach(documentSnapshot => {
     // console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
      if(documentSnapshot.data().otherSidePhoneNum === myPhone){
        let terapistPhone = "+972" + (documentSnapshot.data().myNum).slice(1) ;
        let therapistId=documentSnapshot.data().id;
        console.log(terapistPhone);
        settherapistPhone(terapistPhone);
        setIdThearpist(therapistId);
      }
    });
  });
    }
  });
  }
  //A FUNCTION THAT SENDS SMS TO THE THERAPIST
  function sendAutoSms(text, therapistPhone){
    (async ()=>{
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        {
          title: "SEND SMS PERMEISION",
          message:
            "SEND SMS PERMEISION",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can SEND SMS");

        SmsAndroid.autoSend(
          therapistPhone,
          text,
          (fail) => {
            console.log('Failed with this error: ' + fail);
          },
          (success) => {
            console.log('SMS sent successfully');
           
          },
        );

      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  })();

 
  }
  //A FUNTION THAT LISTENS FOR NEW INCOMING SMS AND THEN HANDLES IT
  function listenSMSAndSend(uid,therapistPhone){
    
    SmsListner.addListener(message=>{
          console.log("the sms test listner: ", message);
          sendAutoSms('התקבלה הודעה חדשה אצל המטופל', therapistPhone);
           smsLog(uid);
           updateColorForTherapist("colorSMS", "green");
        })
       
       
    }
 
    //GETS THE LOG OF SMS MESSAGES OF THE PATIENT AND UPDATE IT TO THE FIREBASE
  function smsLog(uid){
    (async ()=>{
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: "READ SMS PERMEISION",
          message:
            "READ SMS PERMEISION",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use SMS READ");

        let save_SMS=[]
        var filter = {
          box: 'inbox',
          indexFrom: 0, // start from index 0
          maxCount: 10, // count of SMS to return each time
        };
        
        SmsAndroid.list(
          JSON.stringify(filter),
          (fail) => {
            console.log('Failed with this error: ' + fail);
          },
          (count, smsList) => {
            console.log('Count: ', count);
            // console.log('List: ', smsList);
            var arr = JSON.parse(smsList);
            arr.forEach(function(object) {
              save_SMS.push(object.address,object.body)
              console.log('Number of sender ' + object.address);
              console.log('Massege ' + object.body);        
            });
            firestore()
            .collection('users')
            .doc(uid)
            .update({
              List_SMS: save_SMS,
            })
            .then(() => {
              console.log('User updated!');
            });
          },
        );
        
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  })();


  }
  // SETTING VIRABLES FROM FIREBASE THAT INDECATES ABOUT LISTNERS TO OFF
  function updateListersToFalseInTherDoc(id,field){
    firestore()
    .collection('users')
    .doc(id)
    .update({
      [field]:false
    })
    .then(() => {
      console.log('updateeeeeeeeeeeee');
    });
  }

  //FUNCTION THAT WAITS FOR BACKGROUND UPDATE FROM THERAPIST (AND ALSO FOR UPDATES FOR ANY KIND DATA, BUT LATER WILL BE EDITTED)
  function listenerForUpdates(uid){
    let firstFire = true;
    firestore()
  .collection('users')
  .doc(idThearpist)
  .onSnapshot(documentSnapshot => {
    if (!firstFire){
    //  if(documentSnapshot.data().onUpdatePressed){
    //   getLocationAndUpdateFirebase();
    //   permessionCallLog(uid);
    //   updateSettingsFirebase(uid);
    //   smsLog(uid);
    //   updateListersToFalseInTherDoc(idThearpist,"onUpdatePressed");

    //  }
     if (documentSnapshot.data().setBackground){
       (async()=>{
       try{
      const urlBackground = await storage().ref(`${uid}image-for-background.png`).getDownloadURL();
      if (urlBackground){
        console.log("line 227: ", urlBackground);
         WallPaperManager.setWallpaper({ uri: urlBackground }, (res) => {
           console.log(res);
           
            });
          }
       }
       catch(error){
         console.log(" line 232: ", error);
       }
       updateListersToFalseInTherDoc(idThearpist,"setBackground");
       })();
     }
      
    }
  
    firstFire=false;
  });

  }


//FUNCTION THAT LISTENRS FOR NEW INCOMING CALLS AND THEN HANDLES IT
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
    sendAutoSms("התקבלה שיחה חדשה אצל המטופל", therapistPhone);
    permessionCallLog(uid);
    updateColorForTherapist("colorCalls", "green");
    updateSettingsFirebase(uid);
    
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
      sendAutoSms("התקבלה שיחה חדשה אצל המטופל", therapistPhone)
      permessionCallLog(uid);
      updateColorForTherapist("colorCalls", "green");
      updateSettingsFirebase(uid);

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
//FUNCTION THAT CHECKS THE BATTERY IN DEVICE AND UPDATES IT IN FIREBASE IF IT HAD CHANGED
function updateSettingsFirebase(uid){
  DeviceInfo.getBatteryLevel().then(level => {
    let batterypercent=Math.floor(level*100)+"%";
    // console.log(" LINE 296: ", batterypercent);
    // console.log("LINE 371 :: ", batteryLife);
    if (batterypercent!==prevBatteryLife.current){
      console.log("LINE 439 KINE 439 LINE 439 LINE 439", batterypercent, prevBatteryLife.current);
    setBatterLife(batterypercent);
    }
  });
  
 
}


//TO BE LOGGED IN USER
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

//FUNCTION THAT TAKES THE CALLS LOG FROM DEVICE AND PUT IT IN FIREBASE
function permessionCallLog(uid){
  (async ()=>{
    try {
      console.log(" L I N E 365 ");
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
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log(" L I N E 378 ");
        //console.log(CallLogs);
        CallLogs.load(10).then(c => {
          let i=0;
          let save_unknown_calls=[]
          for (i; i<c.length; i++){
            // console.log("i: ", c[i])
            // if (!c[i]["name"]){
              save_unknown_calls.push(c[i]["dateTime"],c[i]["phoneNumber"])
            // }
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
//GETS THE LOCATION AND UPDATES IN FIREBASE
function getLocationAndUpdateFirebase(){
  if (user){
    const uid=user.uid;
  (async ()=>{
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    else{
      (async ()=>{
    let location = await Location.getCurrentPositionAsync({});
    console.log(" LINE 532 LINE 532 LINE 532 LINE 532 LINE 532");
        if (prevUserLocation.current.latitude!==location.coords.latitude || prevUserLocation.current.longitude!==location.coords.longitude){
          console.log("CHONE CHONE CHONE CHONE CHONE CHONE");
          setUserLocation({
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          });
}
  })();
    }
})();
}
}

//TOKEN MESSAGE FOR NOTIFCIATIONS
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
//ASYNCSTORAGE TO STORE DATA FOR REMEMBERING THE USER AND AUTO CONNECT
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
  .then(() =>{ 
    storeData([['userkey', ''],['passkey', '']]);
    //navigation.navigate("MainScreen")
  }
  );

}

  

  return (
    <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
    }}>
    <Text>"בדיקה"</Text>
    <CustomButton text="Sing out" onPress={signOutFunction} type = "SIGNOUT"/>
  </View>
  )
}
export default PatientOptionScreen