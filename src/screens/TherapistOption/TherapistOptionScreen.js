import React,{useState,useEffect, useReducer} from 'react';
import { View,Image,Text ,ScrollView,StyleSheet,Linking,Alert } from 'react-native';
import CustomButtonForTherapistScreen from '../../components/CustomButtonForTherapistScreen';
import { useNavigation } from '@react-navigation/native';
import { getAuth, onAuthStateChanged,collection,getDocs,getFirestore,doc,getDoc, query, where } from "../../../db/firebase";
// import {getFirestore,collection, addDoc } from '../../../db/firebase'
import * as Location from 'expo-location';
import { async } from '@firebase/util';
import UseLocation from '../../location/useLocation'
import * as Battery from 'expo-battery';




const TherapistOptionScreen = () => {
     const navigation = useNavigation();
    const onTherapistPressed = () =>{
        navigation.navigate("signIn");
    };
    const findPatienPressed = () =>{
        console.log("find patiend pressed")
    navigation.navigate("UserLocation");
  
    };
    const onSendReminders = () =>{
        console.log("on send reminders pressed")
        navigation.navigate("SendNotification")
    }
    
    const onBatteryStatusPressed = () =>{
        console.log("onBatteryStatusPressed")
        const auth = getAuth();
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
                const q = query(collection(db, "users"), where("otherSidePhoneNum", "==", currentUserPhoneNum));
                let batteryStatus=""
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                  // doc.data() is never undefined for query doc snapshots
                  batteryStatus=doc.data().battery
                  console.log("battery", JSON.stringify({batteryStatus}))
                });
                console.log(batteryStatus)
                Alert.alert(
                    "Patient Battery Status",
                    batteryStatus,
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                      },
                      { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]
                  );
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
            })();  
              // ...
            } else {
                console.log("user is sing out");
              // User is signed out
              // ...
            }
             
          });
    }
    return (
        <ScrollView>
        <View style={styles.root}>
            <Text style={styles.title} >DementiaApp  </Text>
            <Text style={styles.text} > </Text>
            <CustomButtonForTherapistScreen text="Find Patient" onPress={findPatienPressed}/> 
            <CustomButtonForTherapistScreen text="Patient's Call" onPress={onTherapistPressed}/> 
            <CustomButtonForTherapistScreen text="Patient's Mesege" onPress={onTherapistPressed}/> 
            <CustomButtonForTherapistScreen text="SendReminders" onPress={onSendReminders}/> 
            <CustomButtonForTherapistScreen text="Battery Status" onPress={onBatteryStatusPressed}/> 
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