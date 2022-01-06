  import React, { useState, useEffect } from 'react';
  import { Platform, Text, View, StyleSheet } from 'react-native';
  import * as Location from 'expo-location';
  import openMap from 'react-native-open-maps';
  import { getAuth, onAuthStateChanged,collection,getDocs,getFirestore,doc,getDoc, query, where } from "../../db/firebase";

  export default function UseLocation() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [lat, setlat]=useState(null);
    const[longit,setlongit]=useState(null);

    const auth = getAuth();
    useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        const db = getFirestore();
        const docRef = doc(db, "users", uid);
        (async ()=>{
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          var currentUserPhoneNum= docSnap.data().myNum
          console.log(currentUserPhoneNum);
          const q = query(collection(db, "users"), where("otherSidePhoneNum", "==", currentUserPhoneNum));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            setlat(doc.data().latitude);
            setlongit(doc.data().longitude);
          });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })();
      
        
          openMap({ latitude: lat, longitude: longit });
        
        // ...
      } else {
        // User is signed out
        // ...
      }
       
    });
 }, []);


    return (
      <View style={styles.container}>
        {/* <Text>{text}</Text> */}
      </View>
    );
  }
  const styles = StyleSheet.create({ container:{
      flex: 1
  }}); 