  import React, { Component,useState } from 'react'
  import { Button } from 'react-native';
  import { useNavigation } from '@react-navigation/native';
  import * as Location from 'expo-location';
  import {getAuth, onAuthStateChanged, doc, updateDoc, getFirestore,getDocs,collection,getDoc } from '../../../db/firebase'



  const PatientOptionScreen = () => {
      const handlePress = () => {
      const auth = getAuth();  
      onAuthStateChanged(auth, (user) => {
          if (user) {
            const uid = user.uid;
              console.log("in patient");

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
              console.log(long)
              console.log(lat)
              
                  const db = getFirestore();
                    (async()=>{
                      const docRef = doc(db, "users", uid);
                          await updateDoc(docRef, {
                              longitude: long,
                              latitude: lat
                          });
                    })();
 
        })();
              
      
          } else {
            console.log("user is not signed in");
          }
        });
        }
      
  
    
    return (
        <Button
          onPress = {handlePress}
          title = "send location!"
          color = "red"
        />
    )
  }
  export default PatientOptionScreen