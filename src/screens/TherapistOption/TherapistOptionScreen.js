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
import WallPaperManager from "react-native-set-wallpaper";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import Circle from '../../components/Circle/Circle';

const TherapistOptionScreen = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const navigation = useNavigation();
  const [firstRender, setfirstRender]=useState(true);
  const [patientID,setPatientID]=useState("");


  useEffect(
    () => {
      auth().onAuthStateChanged(onAuthStateChanged);  
     if(user){
       console.log("user conected useEffect");
       const uid = user.uid;
       if(firstRender){
        findPatientID(uid);
        setfirstRender(false);
       }
     }
    },
    [user]
  )

  function findPatientID(uid){
    console.log('starting function findPatientID');
    onUpdatePressed1();
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
        let id = documentSnapshot.data().id;
        setPatientID(id);
      }
    });
  });
    }
  });
  }
    const onTherapistPressed = () =>{
        // navigation.navigate("signIn");
        console.log("patient's call/message pressed")
    };

    const onPatientCallPressed = () =>{
      // navigation.navigate("signIn");
      console.log("patient's call pressed");
      onUpdatePressed1();
      navigation.navigate("ShowCallLogPage");
  };

  const onPatientSMSPressed = () =>{
    // navigation.navigate("signIn");
    console.log("patient's message pressed");
    onUpdatePressed1();
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
      onUpdatePressed1();
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
                    "מצב סוללה של המטופל:",
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

        const simreka = () =>{
          // WallPaperManager.setWallpaper({ uri: "https://sportsmax.tv/media/k2/items/cache/d217a9def455f84c86bbdc187da6da99_XL.jpg" }, (res) => {
          //   console.log(res);
          // });

          if (initializing) return null;
          if(user){
            console.log("test if inside user");
            const uid = user.uid;
            let getSetBackgroundStatus = "";
            let getSetBackgroundStatusSec = "";
           
              firestore()
              .collection('users')
              .doc(uid)
              .get()
              .then(documentSnapshot => {
                console.log('User exists: ', documentSnapshot.exists);
  
                if (documentSnapshot.exists) {
                  console.log('User data: ', documentSnapshot.data());
                  getSetBackgroundStatus = documentSnapshot.data().setBackground;
                    if(getSetBackgroundStatus)
                    getSetBackgroundStatusSec = false;
                    else
                    getSetBackgroundStatusSec = true;
  
                    (async()=>{
                      try{
                       const result = await launchImageLibrary();
                     console.log("LINE 189: ", result.assets[0].uri);
                     const pathToFile=result.assets[0].uri;
                     const reference = storage().ref(`${patientID}/image-for-background.png`);
                     try{
                     await reference.putFile(pathToFile);
                     firestore()
                     .collection('users')
                     .doc(uid)
                     .update({
                       setBackground: getSetBackgroundStatusSec,
                     })
                     .then(() => {
                     console.log('User updated!');
                     });
                     }
                     catch(error){
                       console.log(error);
                     }
                   } catch(error){
                     console.log("error get image : ", error);
                   }
                     })();


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
            <Circle id="location" color="red"/>
            <CustomButtonForTherapistScreen text="לחץ לרשימת השיחות" onPress={()=>{onPatientCallPressed()}}/> 
            <Circle id="calls" color="grey"/>
            <CustomButtonForTherapistScreen text="לחץ לרשימת ההודעות שהתקבלו" onPress={()=>{onPatientSMSPressed()}}/> 
            <Circle id="sms" color="grey"/>
            <CustomButtonForTherapistScreen text="לחץ לבדיקת מצב סוללה" onPress={()=>{onBatteryStatusPressed()}}/>
            <Circle id="battery" color="red"/>
            {/* <CustomButtonForTherapistScreen text="׳׳—׳¥ ׳׳¢׳™׳“׳›׳•׳ ׳₪׳¨׳˜׳™ ׳”׳׳˜׳•׳₪׳" onPress={()=>{onUpdatePressed1()}}/> */}
            <CustomButtonForTherapistScreen text="לחץ להגדרת רקע" onPress={()=>{simreka()}}/>
            <CustomButtonForTherapistScreen text="לחץ לשליחת תזכורת" onPress={()=>{onSendReminders()}}/> 
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

