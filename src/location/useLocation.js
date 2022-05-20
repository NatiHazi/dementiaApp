import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import openMap from 'react-native-open-maps';
// import { getAuth, onAuthStateChanged,collection,getDocs,getFirestore,doc,getDoc, query, where } from "../../db/firebase";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { getPatientLocationFromServer } from '../utils/firebase';
import { useNavigation } from '@react-navigation/native';

export default function UseLocation({route}) {
  const {patientID} = route.params;
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [lat, setlat]=useState(null);
  const[longit,setlongit]=useState(null);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const navigation = useNavigation();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  //##############################################################
  // const auth = getAuth();
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    
    // if (initializing){ 
    //   console.log("BLABLAL");
    //   return null;}
    
    if (user){
      //const uid = user.uid;
      //need to pass the PATIENT ID 
      getPatientLocationFromServer(patientID).then((result)=>{
        if (result!=='fail' && !isNaN(result[0]) && !isNaN(result[1])){
        openMap({ latitude: result[0], longitude: result[1], zoom: 20,provide:'google'});
        }
        else{
          console.log("error from line 39 useLocation: ",result);
          alert("אין מידע זמין על מיקום המטופל כרגע")
          navigation.navigate("TherapistScreen", {isTherapist: true});
          
        }
        
      })
    }
    else{
      console.log("user is not sigend in")
    }
    
    return () => subscriber;
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