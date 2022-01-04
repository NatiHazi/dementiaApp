import React, { Component,useState } from 'react'
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import {getAuth, onAuthStateChanged, doc, updateDoc, getFirestore,getDocs,collection } from '../../../db/firebase'



const PatientOptionScreen = () => {
    const handlePress = () => {
    const auth = getAuth();  
    onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          
            console.log("in patient")
            async function fetchFunction(){
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              setErrorMsg('Permission to access location was denied');
              return;
            }
         }
         fetchFunction();
         async function fetchFunction2(){
            let location = await Location.getCurrentPositionAsync({});
            let long=location.coords.longitude
            let lat=location.coords.latitude
            console.log(long)
            console.log(lat)
            
            
                const db = getFirestore();
                const querySnapshot = await getDocs(collection(db, "users"));
                querySnapshot.forEach((doc2) => {
                    console.log("doc2: ", doc2.id)
                if (doc2.data().id==uid){
                    console.log("mail", user.email)
                   
                   async function fetch3(){
                    //  doc2="users/aidJvDFybZVZK92lMMdC"
                    const washingtonRef = doc(db, "users/"+doc2.id);
                        // Set the "capital" field of the city 'DC'
                        await updateDoc(washingtonRef, {
                            longitude: long,
                            latitude: lat
                        });
                    }
            fetch3();
                }
                else{
                    console.log("not current user")
                }
                });


            
      }
            fetchFunction2();
        
        
        
          // ...
        } else {
          console.log("user is not signed in")
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