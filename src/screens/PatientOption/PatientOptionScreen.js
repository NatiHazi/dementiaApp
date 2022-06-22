import React, { Component,useState,useEffect,useRef } from 'react'
import Constants from 'expo-constants';
import { Button, View,Text,Alert,StyleSheet,Image,BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
//import * as Contacts from 'expo-contacts';
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
import { updateDataInFirebase, findOtherSideIdFirebase, getFirebaseTokenMessage, getPatientNotification } from '../../utils/firebase';
import Geolocation, { useLocation } from '@mobeye/react-native-geolocation';
import PushNotification from "react-native-push-notification";
import Contacts from 'react-native-contacts';
import { set } from 'react-native-reanimated';
import GetLocation from 'react-native-get-location'





const PatientOptionScreen = () => {
const [initializing, setInitializing] = useState(true);
const [user, setUser] = useState();
const [level] = useBatteryLevel();
const [firstRender, setfirstRender]=useState(true);
const [smsPermission, setSMSPermission]=useState(false)
const [therapistPhone, settherapistPhone]=useState();
const therapistphoneUseRef=useRef(null);
const userUseRef=useRef(null);
const [idThearpist, setIdThearpist]=useState();
const [batteryLife, setBatterLife]=useState();
const prevBatteryLife = useRef();
const [userLocation, setUserLocation]=useState({
  longitude: '',
    latitude: '',
});
// const prevUserLocation = useRef({
//   longitude: '',
//     latitude: '',
// });

const [permission, setPermission] = useState(false);
const prevPermission = useRef(false)
//const location = useLocation();
const sendMessagesInSms = useRef(true);
const saveContacts=useRef([]);


// const [patientCalls, setPatientCalls]=useState();


const navigation = useNavigation();

const backAction = () => {
  navigation.navigate("PatientScreen");
  return true;
};

useEffect(() => {
  BackHandler.addEventListener("hardwareBackPress", backAction);

  return () =>
    BackHandler.removeEventListener("hardwareBackPress", backAction);
}, []);
console.log("line 78 line 78 line 78");
useEffect(()=>{
  console.log("line 80 line 80 line 80");
  let smsListenrVar=SmsListner.addListener(message=>{
    console.log("line 71");
    if (user && therapistPhone){
    console.log("the sms test listner: ", message);
    phonenumberCheck=changeAreaCode(message.originatingAddress);
    if (saveContacts.current.includes(phonenumberCheck) && saveContacts.current.length>0){
      let idx = saveContacts.current.indexOf(phonenumberCheck);
      sendAutoSms(`קיבלתי הודעה מ${saveContacts.current[idx+1]} \n תוכן ההודעה: ${message.body}`, therapistPhone
      );
    }
    else{
      sendAutoSms(`קיבלתי הודעה מ${phonenumberCheck} \n תוכן ההודעה: ${message.body}`, therapistPhone
      );
    }
    //sendAutoSms(`קיבלתי הודעה חדשה מ: ${message.originatingAddress} \n  תוכן ההודעה: ${message.body}`, therapistPhone);
     smsLog(user.uid);
     updateColorForTherapist("colorSMS", "red");
    }
    else
      console.log("LINE 67 LINE 67 LINE 67 LINE 67 LINE 67 LINE 67");
  });
  return () => smsListenrVar.remove();
},[user, therapistPhone])

  useEffect(() => {
   
  //   SystemSetting.getVolume().then((volume)=>{
  //     console.log('Current volume is ' + volume);
  // });
  // SystemSetting.setVolume(0.65);
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);  
    // let smsListenrVar=SmsListner.addListener(message=>{
    //   console.log("line 71");
    //   if (user && therapistPhone){
    //   console.log("the sms test listner: ", message);
    //   phonenumberCheck=changeAreaCode(message.originatingAddress);
    //   if (saveContacts.current.includes(phonenumberCheck) && saveContacts.current.length>0){
    //     let idx = saveContacts.current.indexOf(phonenumberCheck);
    //     sendAutoSms(`קיבלתי הודעה מ ${saveContacts.current[idx+1]} \n תוכן ההודעה: ${message.body}`, therapistPhone);
    //   }
    //   else{
    //     sendAutoSms(`קיבלתי הודעה מ ${phonenumberCheck} \n תוכן ההודעה: ${message.body}`, therapistPhone);
    //   }
    //   //sendAutoSms(`קיבלתי הודעה חדשה מ: ${message.originatingAddress} \n  תוכן ההודעה: ${message.body}`, therapistPhone);
    //    smsLog(user.uid);
    //    updateColorForTherapist("colorSMS", "red");
    //   }
    //   else
    //     console.log("LINE 67 LINE 67 LINE 67 LINE 67 LINE 67 LINE 67");
    // });
    //if (initializing) return null;
    if(user){
      console.log(" line 60 : ", user);
    

      console.log("test if inside user");
      const uid = user.uid;
      if (firstRender){    
        newlocation();
       //getLocationAndUpdateFirebase();
       
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
        //smsListenrVar.remove();
          
      }

  }, [user,therapistPhone,idThearpist]);

  useEffect(()=>{
    askContacts();
  },[])
  

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
  }, 3600000);
  return () => BackgroundTimer.clearInterval(intervalId);

  }, []);
  
  //USEEFFECT FOR CHECKING IF LOCATION HAS CAHNGED AFTER X MILI SECONDS AND IF DOES UPDATE IN SERVER
  useEffect(() => {
    if (userLocation.latitude && userLocation.longitude && user && idThearpist && therapistPhone){
      console.log(" line 175   ", userLocation.longitude);
      // prevUserLocation.current.latitude=userLocation.latitude;
      // prevUserLocation.current.longitude=userLocation.longitude;
      firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
          
        if (documentSnapshot.exists) {
          console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
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

  

  useEffect(()=>{

    createChanelNotifcation();

  },[])

 
const newlocation = () =>{
  (async () => {
  try{
  const granted3 = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: "גישה אל המיקום",
      message:
       "אנא אשר גישה למיקום המכשיר",
      buttonNeutral: "שאל אותי אחר כך",
      buttonNegative: "ביטול",
      buttonPositive: "אישור"
    }
    
  );
  if (granted3===PermissionsAndroid.RESULTS.GRANTED){
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
  })
  .then(location => {
      console.log(location);
      setUserLocation({
        longitude: location.longitude,
        latitude: location.latitude,
      });
      // const infoLocation=`latitude: ${location.latitude} longitude: ${location.longitude}`;
      // sendAutoSms(infoLocation, "+972525100072");


  })
  .catch(error => {
      const { code, message } = error;
      console.warn(code, message);
  })
  };
}catch(error){
  console.log(error);
}
  })();
}


const askContacts = ()=>{
  (async()=>{ 
    try{
    const granted= await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: "READ CONTACS",
        message:
          "READ CONTACS PERMEISION",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED){
      Contacts.getAll().then((contacts) => {
        // work with contacts
          //console.log(contacts)
          contacts.forEach(contact=>{
            //console.log(contact.displayName)
            let cotactNum=contact.phoneNumbers[0]["number"];
            cotactNum=changeAreaCode(cotactNum);
            saveContacts.current.push(cotactNum, contact.displayName);
              
          })
   
          
        }).catch(err=>{
          console.log(err);
        })
         
        
    }
    else{
      console.log("permission for contacts denied");
    }
  } catch(err){
    console.log(err);
  }
      
})(); 
}

  const createChanelNotifcation = () =>{

    PushNotification.createChannel({
      channelId: "dementiaApp channel", 
      channelName: "dementiaApp channel", 
      // playSound: false, // (optional) default: true
      soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
      vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
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
      console.log("LINE 296 LINE 296 296 296 296 296 296 296", result);
      setIdThearpist(result[0]);
      settherapistPhone(result[1]);
      therapistphoneUseRef.current=result[1];
    });
  }



  function getContacs(number){
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          const contact = data[0];
          console.log(contact);
        }
      }
    })();
  }

  
  //A FUNCTION THAT SENDS SMS TO THE THERAPIST
  function sendAutoSms(text, therapistPhone){
    if(sendMessagesInSms.current){
      console.log("line 360 line 360 !!");
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
        //text=changeAreaCode(text);
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

  //   function checkContacsAndSentMessage(phoneCheck, messageToSend, address){
  //     (async()=>{ 
  //     try{
  //     const granted= await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
  //       {
  //         title: "READ CONTACS",
  //         message:
  //           "READ CONTACS PERMEISION",
  //         buttonNeutral: "Ask Me Later",
  //         buttonNegative: "Cancel",
  //         buttonPositive: "OK"
  //       }
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED){
  //       Contacts.getAll().then((contacts) => {
  //         // work with contacts
  //           //console.log(contacts)
  //           phoneCheck=changeAreaCode(phoneCheck);
  //           let found=false;
  //           contacts.forEach(contact=>{
  //             //console.log(contact.displayName)
  //             let cotactNum=contact.phoneNumbers[0]["number"];
  //             console.log("393 393 393 ", cotactNum, phoneCheck);
  //             cotactNum=changeAreaCode(cotactNum);
  //             if (cotactNum===phoneCheck){
  //               found=true;
  //               console.log(messageToSend)
  //               sendAutoSms(messageToSend+ `${contact.displayName} `, address);
  //             }
                
  //           })
  //           if (!found){
  //             sendAutoSms(`${messageToSend} ${phoneCheck} `, address);
  //           }
            
  //         }).catch(err=>{
  //           console.log(err);
  //         })
           
          
  //     }
  //     else{
  //       console.log("permission for contacts denied");
  //     }
  //   } catch(err){
  //     console.log(err);
  //   }
        
  // })();   
               
  //   }
 
    //GETS THE LOG OF SMS MESSAGES OF THE PATIENT AND UPDATE IT TO THE FIREBASE
  function smsLog(uid){
    console.log("in sms log");
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
              let num=object.address;
              num=changeAreaCode(num);
              if (saveContacts.current.includes(num)){
                let idx = saveContacts.current.indexOf(num);
                num=saveContacts.current[idx+1];
              }
              save_SMS.push(num,object.body)
              console.log('Number of sender ' + object.address);
              console.log('Massege ' + object.body);        
            });
         
            updateDataInFirebase(uid, {List_SMS: save_SMS});
            
            
          },
        );
        
      } else {
        console.log("SMS PERMISSION DENIED");
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
  function listenerForUpdates(uid,idThearpist){
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
     if (documentSnapshot.data().giveUpdateLocation){
      //getLocationAndUpdateFirebase();
      newlocation();
      updateListersToFalseInTherDoc(idThearpist,"giveUpdateLocation");

    }
    if (documentSnapshot.data().sendNotification){
      getPatientNotification(uid).then((result)=>{
        PushNotification.localNotification({
          channelId: "dementiaApp channel",
          title: result[0],
          message: result[1],
        });

      });
      updateListersToFalseInTherDoc(idThearpist,"sendNotification");
    }
    if (documentSnapshot.data().stopGetSMS){
      //settherapistPhone('')
      sendMessagesInSms.current=false;
    }
    if (!documentSnapshot.data().stopGetSMS){
      //settherapistPhone('')
      sendMessagesInSms.current=true;
    }
    if (documentSnapshot.data().phoneNumberUpdated){
      findOtherSideIdFirebase(uid).then((result)=>{
        setIdThearpist(result[0]);
      settherapistPhone(result[1]);
      updateListersToFalseInTherDoc(idThearpist,"phoneNumberUpdated");
      });
      
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
    console.log("DISCONNETED");
    permessionCallLog(uid);
    updateColorForTherapist("colorCalls", "red");
    permessionCallLog(uid);
    //updateSettingsFirebase(uid);
    }
    // else if (event === 'Connected') {
    // // Do something call got connected
    // // This clause will only be executed for iOS

    // }
    else if (event === 'Incoming') {
    // Do something call got incoming
    console.log("Incoming");
    console.log("LINE 583. LETS PRINT SAVED CONTATS: ", saveContacts);
    phonenumberCheck=changeAreaCode(phoneNumber);
    if (saveContacts.current.includes(phonenumberCheck)){
      let idx = saveContacts.current.indexOf(phonenumberCheck);
      sendAutoSms(`קיבלתי שיחה חדשה מ${saveContacts.current[idx+1]}`, therapistPhone)
    }
    else{
      sendAutoSms(`קיבלתי שיחה חדשה מ${phonenumberCheck}`, therapistPhone)
    }

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
    phonenumberCheck=changeAreaCode(phoneNumber);
    if (saveContacts.current.includes(phonenumberCheck)){
      let idx = saveContacts.current.indexOf(phonenumberCheck);
      sendAutoSms(` התקשרתי אל ${saveContacts.current[idx+1]}`, therapistPhone)
    }
    else{
      sendAutoSms(` התקשרתי אל ${phonenumberCheck}`, therapistPhone)
    }
   // phoneNumber=checkContacsAndSentMessage(phoneNumber, 'התקשרתי אל', therapistPhone);
    //sendAutoSms(`התקשרתי אל: ${phoneNumber}`, therapistPhone)
    //permessionCallLog(uid);
 
    console.log("Offhook");
    }
    else if (event === 'Missed') {
    	// Do something call got missed
    	// This clause will only be executed for Android
      permessionCallLog(uid);
      updateColorForTherapist("colorCalls", "red");
      permessionCallLog(uid);
      //updateSettingsFirebase(uid);

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
  userUseRef.current=user;
  if (initializing) setInitializing(false);
}

function changeAreaCode (number){
  if (number.includes("+972")){
    number=number.replace("+972", "0");
  }
  while(number.includes("-")){
    number=number.replace("-","");
  }
  while(number.includes(" ")){
    number=number.replace(" ","");
  }
  return number;
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
             console.log("i: ", c[i]);
            // if (!c[i]["name"]){
              thephone=c[i]["phoneNumber"];
             thephone=changeAreaCode(thephone);
             if (saveContacts.current.includes(thephone)){
               let idx = saveContacts.current.indexOf(thephone);
               thephone=saveContacts.current[idx+1];
             }

              save_unknown_calls.push(c[i]["dateTime"],thephone,c[i].type)
            // }
          }
          console.log("the arrrayyyyy: ", save_unknown_calls);
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
  console.log("gsdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddDD");
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
            console.log("BACKGROUND LOCATION PERMISION GRANTED");
            let locationfrst = await Location.getCurrentPositionAsync({});
            console.log(" LINE 532 LINE 532 LINE 532 LINE 532 LINE 532");
            console.log(locationfrst);
                if (prevUserLocation.current.latitude!==locationfrst.coords.latitude || prevUserLocation.current.longitude!==locationfrst.coords.longitude){
                  console.log("CHONE CHONE CHONE CHONE CHONE CHONE");
                  setUserLocation({
                    longitude: locationfrst.coords.longitude,
                    latitude: locationfrst.coords.latitude,
                  });
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

    async function requestReadSmsPermission() {
      try {
       const grant = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          {
            title: "הרשאות לקריאת אסמס",
            message: "אשר הרשאה זו אם אתה מסכים שהמטפל יוכל לראות את ההודעות שלך"
          }
        );
        if (grant===PermissionsAndroid.RESULTS.GRANTED){
          setSMSPermission(true);
        }
      } catch (err) {}
    }
    
 

  

  return (
    <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
    }}>
       
    <Text>שלום!</Text>
    {/* <Button title="תן גישה להרשאות" onPress={()=>{askPerm()}} />    */}
    {/* { !smsPermission?
    <Button title="אני רוצה לתת הרשאה להודעות" onPress={()=>requestReadSmsPermission} />
    : null
    } */}
    <Button title="תבדוק מיקום" onPress={newlocation} />
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