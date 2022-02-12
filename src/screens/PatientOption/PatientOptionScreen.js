  import React, { Component,useState,useEffect,useRef } from 'react'
  import Constants from 'expo-constants';
  import { Button, View,Text } from 'react-native';
  import { useNavigation } from '@react-navigation/native';
  import * as Location from 'expo-location';
  import {getAuth, onAuthStateChanged, doc, updateDoc, getFirestore,getDocs,collection,getDoc } from '../../../db/firebase'
  import * as Contacts from 'expo-contacts';
  import * as Notifications from 'expo-notifications';



  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  const PatientOptionScreen = () => {
  
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();


    useEffect(() => {
      //#############start premission to contact##################
      (async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Emails],
          });
  
          if (data.length > 0) {
            const contact = data[0];
            alert(JSON.stringify(contact));
          }
        }
      })();
      //#############end premission to contact##################

      //#############start premission to location##################
      const auth = getAuth();  
      onAuthStateChanged(auth, (user) => {
          if (user) {
            const uid = user.uid;
            const db = getFirestore();
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
              console.log(long);
              console.log(lat);
              
                  
                    (async()=>{
                      const docRef = doc(db, "users", uid);
                          await updateDoc(docRef, {
                              longitude: long,
                              latitude: lat
                          });
                    })();
 
        })();
         
  //#############end premission to location##################

  //#############start premission to notfication##################
  registerForPushNotificationsAsync().then(token => {setExpoPushToken(token);

  (async()=>{
    const docRef = doc(db, "users", uid);
        await updateDoc(docRef, {
            pushToken:token
        });
  })();
  });
  //registerForPushNotificationsAsync().then(token => console.log(token));
  

  notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    setNotification(notification);
  });

  responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    console.log(response);
  });

} else {
  console.log("user is not signed in");
}
});

  return () => {
    Notifications.removeNotificationSubscription(notificationListener.current);
    Notifications.removeNotificationSubscription(responseListener.current);
  };
    }, []);

    async function sendPushNotification(expoPushToken) {
      const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Original Title',
        body: 'And here is the body!',
        data: { someData: 'goes here' },
      };
    
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
    }
  
    async function registerForPushNotificationsAsync() {
      let token;
      if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
      } else {
        alert('Must use physical device for Push Notifications');
      }
    
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }


    
      return token;
    }
 

      const handlePress = () => {
      // const auth = getAuth();  
      // onAuthStateChanged(auth, (user) => {
      //     if (user) {
      //       const uid = user.uid;
      //         console.log("in patient");

      //         (async ()=>{
      //         let { status } = await Location.requestForegroundPermissionsAsync();
      //         if (status !== 'granted') {
      //           setErrorMsg('Permission to access location was denied');
      //           return;
      //         }
      //     })();
          
      //     (async ()=>{
      //         let location = await Location.getCurrentPositionAsync({});
      //         let long=location.coords.longitude
      //         let lat=location.coords.latitude
      //         console.log(long)
      //         console.log(lat)
              
      //             const db = getFirestore();
      //               (async()=>{
      //                 const docRef = doc(db, "users", uid);
      //                     await updateDoc(docRef, {
      //                         longitude: long,
      //                         latitude: lat
      //                     });
      //               })();
 
      //   })();
              
      
      //     } else {
      //       console.log("user is not signed in");
      //     }
      //   });
        }
      
  
    
    return (
      <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>

      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      />
    </View>
        // <Button
        //   onPress = {handlePress}
        //   title = "send location!"
        //   color = "red"
        // />
    )
  }

  

  export default PatientOptionScreen