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



const TherapistOptionScreen = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

     const navigation = useNavigation();
    const onTherapistPressed = () =>{
        // navigation.navigate("signIn");
        console.log("patient's call/message pressed")
    };

    const onPatientCallPressed = () =>{
      // navigation.navigate("signIn");
      console.log("patient's call/message pressed")
      // const subscriber = auth().onAuthStateChanged(onAuthStateChanged);  
      // if (initializing) return null;
      // if(user){
      //   console.log("test if inside user");
      //   const uid = user.uid;
      //   let phoneNumber = "";
      //   let unknown_calls = "";
      //   //let idPatient = "";
      //   firestore()
      //   .collection('users')
      //   .doc(uid)
      //   .get()
      //   .then(documentSnapshot => {
      //     if (documentSnapshot.exists) {
      //       phoneNumber = documentSnapshot.data().myNum;
      //       console.log("line 62 : ",phoneNumber);
      //     }
      //     });
      //       firestore()
      //       .collection('users')
      //       .get()
      //       .then(querySnapshot => {
      //          querySnapshot.forEach(documentSnapshot => {
      //            if(documentSnapshot.data().otherSidePhoneNum == phoneNumber){
      //             unknown_calls = documentSnapshot.data().unknown_calls;
      //             //console.log("line 76 ",persentBattery)
      //             Alert.alert(
      //               "שיחות לא מזוהות שהתקבלו:",
      //               JSON.stringify(unknown_calls),
      //               [
                      
      //                 { text: "OK", onPress: () => console.log("OK Pressed") }
      //               ]
      //             );
      //            }
      //           //console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
      //         });
      //       });
      //       navigation.navigate("ShowCallLogPage");
      //   }
      //   else {
      //   console.log("user is not signed in");
      //   } 
      navigation.navigate("ShowCallLogPage");

  };

    const findPatienPressed = () =>{
        console.log("find patiend pressed")
    navigation.navigate("UserLocation");
  
    };
    const onSendReminders = () =>{
        console.log("on send reminders pressed")
        navigation.navigate("SendNotification")
    } 

    const signOutFunction = () =>{
    
        auth()
        .signOut()
        .then(() => navigation.navigate("MainScreen"));
    
  }
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
    const onBatteryStatusPressed = () =>{
      console.log("onBatteryStatusPressed");
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);  
      if (initializing) return null;
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
                    "Patient Battery Status",
                    persentBattery,
                    [
                      
                      { text: "OK", onPress: () => console.log("OK Pressed") }
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
   
      
    return (
        <ScrollView>
        <View style={styles.root}>
            <Text style={styles.title} >DementiaApp  </Text>
            <Text style={styles.text} > </Text>
            <CustomButtonForTherapistScreen text="Find Patient" onPress={findPatienPressed}/> 
            <CustomButtonForTherapistScreen text="Patient's Call" onPress={onPatientCallPressed}/> 
            <CustomButtonForTherapistScreen text="Patient's Mesege" onPress={onTherapistPressed}/> 
            <CustomButtonForTherapistScreen text="SendReminders" onPress={onSendReminders}/> 
            <CustomButtonForTherapistScreen text="Battery Status" onPress={onBatteryStatusPressed}/>
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