import React,{useState,useEffect} from 'react';
import { View ,Text ,ScrollView,StyleSheet,Alert,Image } from 'react-native';
import CustomButtonForTherapistScreen from '../../components/CustomButtonForTherapistScreen';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import Circle from '../../components/Circle/Circle';
import { findOtherSideIdFirebase,
   updateColorAfterReadFirebase,
    getPatientBatteryStatus,
     setBackgroundInFirebase } from '../../utils/firebase';


const TherapistOptionScreen = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const navigation = useNavigation();
  const [firstRender, setfirstRender]=useState(true);
  const [color, setColor]=useState({
    location: "grey",
    calls: "grey",
    sms: "grey",
    battery:"grey"
  });
  const [patientID,setPatientID]=useState("");


  useEffect(
    () => {
       
      subscriber=auth().onAuthStateChanged(onAuthStateChanged);  
     if(user){
       console.log("user conected useEffect");
       const uid = user.uid;
       if(firstRender){
        findPatientID(uid);
       listenForColor();
        setfirstRender(false);
       }
     }
     if (!user){
       console.log (" USER DISCONNECTED FROM THERPAIST  ");
     }
    
     
     return () => subscriber;
    },
    [user]
  );

  function updateColorAfterRead(theColorArtibute){
    if (user){
    updateColorAfterReadFirebase(theColorArtibute, user.uid);
    }
   
  };

  function listenForColor(){
    if (user){
      const uid=user.uid;
   firestore()
      .collection('users')
      .doc(uid)
      .onSnapshot(documentSnapshot => {
        // console.log('User data: ', documentSnapshot.data());
        setColor({
          location: documentSnapshot.data().colorLocation,
          calls: documentSnapshot.data().colorCalls,
          sms: documentSnapshot.data().colorSMS,
          battery: documentSnapshot.data().colorBattery,
        })
      });
   
    }
    else{
      console.log("user not connected");
    }
  };

  function findPatientID(uid){
    console.log('starting function findPatientID');
    //onUpdatePressed1();
    findOtherSideIdFirebase(uid).then((result)=>{
      setPatientID(result[0]);
    })
  }
  

    const onPatientCallPressed = () =>{
      // navigation.navigate("signIn");
      console.log("patient's call pressed");
      //onUpdatePressed1();
      updateColorAfterRead("colorCalls");
      navigation.navigate("ShowCallLogPage", {patientID: patientID});
  };

  const onPatientSMSPressed = () =>{
    // navigation.navigate("signIn");
    console.log("patient's message pressed");
    //onUpdatePressed1();
    updateColorAfterRead("colorSMS");
    navigation.navigate("ShowSMSLogPage", {patientID: patientID});
};

    const findPatienPressed = () =>{
        console.log("find patiend pressed");
        updateColorAfterRead("colorLocation");
        if (patientID)
          navigation.navigate("UserLocation", {patientID: patientID});
        else  
          alert("זמנית המידע לא זמין. נסו מאוחר יותר");
 
    };
    const onSendReminders = () =>{
        console.log("on send reminders pressed")
        navigation.navigate("SendNotification")
    } 



  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
    const onBatteryStatusPressed = () =>{
      console.log("onBatteryStatusPressed");
      //onUpdatePressed1();
      updateColorAfterRead("colorBattery");
      if(patientID){
        getPatientBatteryStatus(patientID).then((result)=>{
          if (result !== 'fail'){
            Alert.alert(
              "מצב סוללה של המטופל:",
          result,
          [
            { text: "אישור", onPress: () => console.log("OK Pressed") }
          ]
        );
          };
        });

        }
        else {
          alert("זמנית המידע לא זמין. נסו מאוחר יותר");
        } 
      }




        const setBackgroundForPatient = () =>{
      
          if (initializing) return null;
          if(user && patientID){
            console.log("test if inside user");
            const uid = user.uid;
            setBackgroundInFirebase(uid, patientID);
      
            }
            else {
            console.log("user is not signed in/didnt get yet patiend id in fb");
            alert("זמנית המידע לא זמין. נסו מאוחר יותר");
            } 



          };

          function testest(){
            setColor({
              ...color,
              location: "red",
              battery: "green",
            })
          }
   
      
    return (
        <ScrollView keyboardShouldPersistTaps='handled'>
        <View style={styles.root}>
        
            <Text style={styles.title} >DementiaApp</Text>
             <Text style={styles.text} ></Text>    
             <Circle id="location" color={color.location}/>           
             <CustomButtonForTherapistScreen text="לחץ לקבלת מיקום" onPress={()=>{findPatienPressed()}}/> 
             <Circle id="calls" color={color.calls}/>
             <CustomButtonForTherapistScreen text="לחץ לרשימת השיחות" onPress={()=>{onPatientCallPressed()}}/> 
             <Circle id="sms" color={color.sms}/>
             <CustomButtonForTherapistScreen text="לחץ לרשימת ההודעות שהתקבלו" onPress={()=>{onPatientSMSPressed()}}/> 
             <Circle id="battery" color={color.battery}/>
             <CustomButtonForTherapistScreen text="לחץ לבדיקת מצב סוללה" onPress={()=>{onBatteryStatusPressed()}}/>
             <CustomButtonForTherapistScreen text="לחץ להגדרת רקע" onPress={()=>{setBackgroundForPatient()}}/>
             <CustomButtonForTherapistScreen text="לחץ לשליחת תזכורת" onPress={()=>{onSendReminders()}}/> 
             <CustomButtonForTherapistScreen text="הגדר מיקום בטוח" onPress={()=>{testest()}}/> 
          
           
            {/* <CustomButtonForTherapistScreen text="Therapist" onPress={onTherapistPressed}/> 
            <CustomButtonForTherapistScreen text="Patient" onPress={onTherapistPressed}/>  */}
        </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
 
    root:{
        //alignItems:'center',
        backgroundColor:'snow',
        padding: 50,
        paddingTop:0,
    },
    title:{
      paddingVertical: 6,
      borderWidth: 4,
      borderRadius: 8,
      backgroundColor: "#fff",
      color: "#20232a",
      textAlign: "center",
      fontSize: 40,
    },
    text:{
        flex: 1,
        fontStyle:'normal',
        fontWeight:'bold',
        fontSize: 10,
        textAlign:'center',
        color:'#051C60',
        margin: 10,
    },

})


export default TherapistOptionScreen




