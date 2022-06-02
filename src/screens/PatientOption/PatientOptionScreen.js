import React, { Component,useState,useEffect,useRef } from 'react'
import Constants from 'expo-constants';
import { Button, View,Text,Alert,StyleSheet,Image } from 'react-native';
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
import { updateDataInFirebase, findOtherSideIdFirebase, getFirebaseTokenMessage } from '../../utils/firebase';
import Geolocation, { useLocation } from '@mobeye/react-native-geolocation';





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

const [permission, setPermission] = useState(false);
const prevPermission = useRef(false)
const location = useLocation();

// const [patientCalls, setPatientCalls]=useState();


const navigation = useNavigation();

  useEffect(() => {
  //   SystemSetting.getVolume().then((volume)=>{
  //     console.log('Current volume is ' + volume);
  // });
  // SystemSetting.setVolume(0.65);
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);  
    let smsListenrVar=SmsListner.addListener(message=>{
      if (user && therapistPhone){
      console.log("the sms test listner: ", message);
      sendAutoSms('קיבלתי הודעה חדשה!', therapistPhone);
       smsLog(user.uid);
       updateColorForTherapist("colorSMS", "red");
      }
      else
        console.log("LINE 67 LINE 67 LINE 67 LINE 67 LINE 67 LINE 67");
    });
    //if (initializing) return null;
    if(user){
      console.log(" line 60 : ", user);
    

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
      //listenSMSAndSend(uid,therapistPhone); //listen for sms coming and notice the therapist new sms came
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
        console.log("CLEAN USEEFFECT");
        subscriber;
        smsListenrVar.remove();
          
      }

  }, [user,therapistPhone,idThearpist]);
  

  //USEEFFECT FOR CHECKING BATTERY STATUS AND IF NEED UPDATING IN SERVER
  useEffect(() => {
    if (batteryLife && user && idThearpist){
      prevBatteryLife.current=batteryLife;

      updateDataInFirebase(user.uid, {battery:batteryLife}).then((result)=>{
        if (result === "success"){
          const index = batteryLife.indexOf('%');
      const num_without_percent=batteryLife.substring(0, index);
      if (num_without_percent<20){
        // need to send SMS 
        sendAutoSms("הסוללה שלי מתחת ל20 אחוזים, נדרש להטעין!", therapistPhone);
        updateColorForTherapist("colorBattery", "red");
      }
        
      else
        updateColorForTherapist("colorBattery", "red");
        }
      });

    }
}, [batteryLife, idThearpist]);
  //USEEFFECT FOR STARTING BACKGROUND INTERVAL FOR CHECKING BATTERY
  useEffect(() => {
    const intervalId = BackgroundTimer.setInterval(() => {
  
      updateSettingsFirebase();
      // 3600000
  }, 10000);
  return () => BackgroundTimer.clearInterval(intervalId);

  }, []);
  //USEEFFECT FOR STARTING INTEVAL FOR CHECKING LOCATION
  // useEffect(() => {
  //    const intervalIdLocation = BackgroundTimer.setInterval(() => {
  //     //getLocationAndUpdateFirebase();
  //     nisuikatan();
      
  // }, 10000);

  // return () => BackgroundTimer.clearInterval(intervalIdLocation);

  // }, [user]);
  //USEEFFECT FOR CHECKING IF LOCATION HAS CAHNGED AFTER X MILI SECONDS AND IF DOES UPDATE IN SERVER
  useEffect(() => {
    if (userLocation && user && idThearpist && therapistPhone){
      console.log(" line 175   ", userLocation.longitude)
      prevUserLocation.current.latitude=userLocation.latitude;
      prevUserLocation.current.longitude=userLocation.longitude;
      firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
          
        if (documentSnapshot.exists) {
          console.log('16216216261261261261261216216216261621621621216262');
          let latitudeSave = documentSnapshot.data().latSafe;
          let longitudeSave = documentSnapshot.data().longSafe;
          let radiusSave = documentSnapshot.data().radiusSafe;
          let rediusResult = distance(latitudeSave,userLocation.latitude,longitudeSave,userLocation.longitude);
          if(rediusResult>radiusSave){
            console.log('rediusResult>radiusSave');
            sendAutoSms('יצאתי מאזור בטוח', therapistPhone);
          }
          else{
            console.log('171717171717171717171717117171711717171');
          }
        }
      });

      updateDataInFirebase(user.uid,{ longitude: userLocation.longitude,latitude: userLocation.latitude });
      updateColorForTherapist("colorLocation", "red");

    }

  }, [userLocation,idThearpist, therapistPhone]);

  //TEST WITH NEW LOCATION LIBARY
  useEffect(() => {
    // Geolocation.configuration(10, 500, "BalancedPower");
    Geolocation.configure({
      distanceFilter: 100,
      desiredAccuracy: 'BalancedPower',
      bufferSize: 10,
      updateInterval: 10000
    });
    if (Platform.OS === 'ios') {
      Geolocation.checkIOSAuthorization().then((res) => {
        setPermission(res);
      });
    } else {
      PermissionsAndroid.check('android.permission.ACCESS_FINE_LOCATION').then((res) => {
         setPermission(res);
      });
    }
  }, [])

  useEffect(() => {
    if (!prevPermission.current && permission) {
      Geolocation.start();
    }
    prevPermission.current = permission;
  }, [permission]);

useEffect(()=>{
  console.log("LINE 235 LOCATION", location);
  setUserLocation({
    longitude: location.longitude,
    latitude: location.latitude,
  });
}, [location])


  function nisuikatan(){
    console.log('LINE 237: ', location.latitude);
    Geolocation.getLastLocations(10).then(locations => {
      const lastLocation = locations[0];
      const lastLocationSec = locations[1];
      console.log("last location:");
      console.log("Latitude", lastLocation.latitude);
      console.log("Longitude", lastLocation.longitude);
      console.log("last location lastLocationSec:");
      console.log("Latitude", lastLocationSec.latitude);
      console.log("Longitude", lastLocationSec.longitude);
      // console.log("user ref \n : ",prevUserLocation.current.latitude, userLocation.longitude );
//       if (prevUserLocation.current.latitude!==lastLocation.latitude || prevUserLocation.current.longitude!==lastLocation.longitude){
//         console.log("CHONE CHONE CHONE CHONE CHONE CHONE");
//         setUserLocation({
//           longitude: lastLocation.latitude,
//           latitude: lastLocation.longitude,
//         });
// }
 
    })
    
  };
  //MAKE COLORS FOR THE HERAPIST SCREEN-GREEN IS NEW DATA\GREY IS ALREADY SEEN\RED IS BATTERY UNDER 20%
    function updateColorForTherapist(theColorArtibute, theColor){
      if (idThearpist){
        updateDataInFirebase(idThearpist,{[theColorArtibute]: theColor});
    }
    else{
    console.log("user not connected");
    }
    }
//FIND THERAPIST NUM AND ID IN FIRERBASE COLLECTION TO MAKE QUERIES EASIER
  function findTherapitNumAndId(uid){
    findOtherSideIdFirebase(uid).then((result)=>{
      setIdThearpist(result[0]);
      settherapistPhone(result[1]);
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
          sendAutoSms('קיבלתי הודעה חדשה!', therapistPhone);
           smsLog(uid);
           updateColorForTherapist("colorSMS", "red");
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
         
            updateDataInFirebase(uid, {List_SMS: save_SMS});
            
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
    updateDataInFirebase(id,{ [field]:false } );

  };

  //FUNCTION THAT WAITS FOR BACKGROUND UPDATE FROM THERAPIST (AND ALSO FOR UPDATES FOR ANY KIND DATA, BUT LATER WILL BE EDITTED)
  function listenerForUpdates(uid){
   // let firstFire = true;
    firestore()
  .collection('users')
  .doc(idThearpist)
  .onSnapshot(documentSnapshot => {
   // if (!firstFire){

     if (documentSnapshot.data().setBackground){
       (async()=>{
       try{
      const urlBackground = await storage().ref(`${uid}/image-for-background.png`).getDownloadURL();
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
      
    //}
  
    //firstFire=false;
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
    sendAutoSms(`קיבלתי שיחה חדשה מ ${phoneNumber}`, therapistPhone);
    permessionCallLog(uid);
    updateColorForTherapist("colorCalls", "red");
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
      sendAutoSms(`קיבלתי שיחה חדשה מ ${phoneNumber}`, therapistPhone)
      permessionCallLog(uid);
      updateColorForTherapist("colorCalls", "red");
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
          updateDataInFirebase(uid,{ unknown_calls: save_unknown_calls } );
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
      console.log('Permission to access location was denied LINE 513 513 513 513 513 513');
      return;
    }
    else{
      (async ()=>{

        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            {
              title: "האפליקציה צריכה גישה למיקום שלך ברקע",
              message:
                "על מנת שהמטפל יוכל לדעת היכן אתה נמצא, תצטרך לאשר גישה למיקום",
              buttonNeutral: "שאל מאוחר יותר",
              buttonNegative: "ביטול",
              buttonPositive: "אישור"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("BACKGROUND LOCATION PERMISION GRANTED");
            let locationfrst = await Location.getCurrentPositionAsync({});
            console.log(" LINE 532 LINE 532 LINE 532 LINE 532 LINE 532");
            console.log(locationfrst);
                if (prevUserLocation.current.latitude!==locationfrst.coords.latitude || prevUserLocation.current.longitude!==locationfrst.coords.longitude){
                  console.log("CHONE CHONE CHONE CHONE CHONE CHONE");
                  // setUserLocation({
                  //   longitude: locationfrst.coords.longitude,
                  //   latitude: locationfrst.coords.latitude,
                  // });
        }

          } else {
            console.log("BACKGROUND LOCATION PERMISION NOT GRANTED !!!");
          }
        } catch (err) {
          console.warn(err);
        }
      

  })();
    }
})();
}
}

//TOKEN MESSAGE FOR NOTIFCIATIONS
function updateTokenMessage(uid){
  getFirebaseTokenMessage(uid);
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


function distance(lat1,lat2, lon1, lon2)
  {
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 =  lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
    + Math.cos(lat1) * Math.cos(lat2)
    * Math.pow(Math.sin(dlon / 2),2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;

    // calculate the result
    return(c * r);
    }

  

  return (
    <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
    }}>
       
    <Text>שלום!</Text>
    <CustomButton text="Sing out" onPress={signOutFunction} type = "SIGNOUT"/>
  </View>
  )
}

const styles = StyleSheet.create({
  logo: {  
      width:250,
      height:280,
  },
})

export default PatientOptionScreen;