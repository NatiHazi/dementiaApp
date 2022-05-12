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
       
      auth().onAuthStateChanged(onAuthStateChanged);  
     if(user){
       console.log("user conected useEffect");
       const uid = user.uid;
       if(firstRender){
        findPatientID(uid);
       listenForColor();
        setfirstRender(false);
       }
     }
     
     //return () => subscriber;
    },
    [user]
  );

  function updateColorAfterRead(theColorArtibute){

        if (user){
        firestore()
      .collection('users')
      .doc(user.uid)
      .update({
        // [toUpdateField]: "grey",
        [theColorArtibute]: "grey",
      })
      .then(() => {
        console.log('User updated!');
      });
    }
    else{
      console.log("user not connected");
    }
  }

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
  }

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
      updateColorAfterRead("colorCalls");
      navigation.navigate("ShowCallLogPage");
  };

  const onPatientSMSPressed = () =>{
    // navigation.navigate("signIn");
    console.log("patient's message pressed");
    onUpdatePressed1();
    updateColorAfterRead("colorSMS");
    navigation.navigate("ShowSMSLogPage");
};

    const findPatienPressed = () =>{
        console.log("find patiend pressed");
        updateColorAfterRead("colorLocation");
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
      updateColorAfterRead("colorBattery");
     // auth().onAuthStateChanged(onAuthStateChanged);  
      if (initializing) return null;
      console.log("checkkkkkkkkkkkkkkk");
      if(user){
        console.log("test if inside user");
        const uid = user.uid;
        firestore()
        .collection('users')
        .doc(patientID)
        .get()
        .then(documentSnapshot => {
          console.log('User exists: ', documentSnapshot.exists);
      
          if (documentSnapshot.exists) {
            console.log('User data: ', documentSnapshot.data());
            const batteryPatient=documentSnapshot.data().battery;
            console.log("LINE 149 : ", batteryPatient);
            Alert.alert(
              "מצב סוללה של המטופל:",
              batteryPatient,
              [
                { text: "אישור", onPress: () => console.log("OK Pressed") }
              ]
            );
          }
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
             {/* <CustomButtonForTherapistScreen text="׳³ֲ׳³ג€”׳³ֲ¥ ׳³ֲ׳³ֲ¢׳³ג„¢׳³ג€׳³ג€÷׳³ג€¢׳³ֲ ׳³ג‚×׳³ֲ¨׳³ֻ׳³ג„¢ ׳³ג€׳³ֲ׳³ֻ׳³ג€¢׳³ג‚×׳³ֲ" onPress={()=>{onUpdatePressed1()}}/> */}
             <CustomButtonForTherapistScreen text="לחץ להגדרת רקע" onPress={()=>{simreka()}}/>
             <CustomButtonForTherapistScreen text="לחץ לשליחת תזכורת" onPress={()=>{onSendReminders()}}/> 
             <CustomButtonForTherapistScreen text="הגדר מיקום בטוח" onPress={()=>{testest()}}/> 
            <CustomButton text="Sing out" onPress={signOutFunction} type = "SIGNOUT"/>
           
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



