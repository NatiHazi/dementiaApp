import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import openMap from 'react-native-open-maps';
// import { getAuth, onAuthStateChanged,collection,getDocs,getFirestore,doc,getDoc, query, where } from "../../db/firebase";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function UseLocation() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [lat, setlat]=useState(null);
  const[longit,setlongit]=useState(null);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  //##############################################################
  // const auth = getAuth();
  useEffect(() => {
    console.log("line 45 in asjdskj")
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    
    // if (initializing){ 
    //   console.log("BLABLAL");
    //   return null;}
    
    if (user){
      console.log("line 30 in POJAGOJSGOIJ")
      const uid = user.uid;
      firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
         let phoneNumber = documentSnapshot.data().myNum;
          firestore()
          .collection('users')
          .get()
          .then(querySnapshot => {
             querySnapshot.forEach(documentSnapshot => {
               if(documentSnapshot.data().otherSidePhoneNum == phoneNumber){
               let patinetlat = documentSnapshot.data().latitude;
               let patientlong= documentSnapshot.data().longitude;
                console.log("patientlat: ", patinetlat)
                console.log("patientlong: ", patientlong)
                openMap({ latitude: patinetlat, longitude: patientlong, zoom: 20,provide:'google'});

               }
            });
          });
        }
        });
    }
    else{
      console.log("user is not sigend in")
    }
    // return subscriber;
}, [user]);



  return (
    <View style={styles.container}>
      {/* <Text>{text}</Text> */}
    </View>
  );
}
const styles = StyleSheet.create({ container:{
    flex: 1
}}); 