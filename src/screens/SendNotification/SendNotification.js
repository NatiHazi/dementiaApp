import React, { useState } from 'react';
import { Text, TextInput, View,ScrollView,StyleSheet } from 'react-native';
import CustomInput from '../../components/CutomInput';
import CustomButton from '../../components/CustomButton';
import { getAuth, onAuthStateChanged,collection,getDocs,getFirestore,doc,getDoc, query, where } from "../../../db/firebase";

const SendNotification = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    // const [password, setPassword] = useState('');
    // const [passwordRepeat, setPasswordRepeat] = useState('');
    // const [otherSideNum, setotherSideNum] = useState('');
    // const [yourNum, setYourNum] = useState('');
    async function sendPushNotification(expoPushToken) {
        console.log("in 15")
            
        const message = {
          to: expoPushToken,
          sound: 'default',
          title:title,
          body: body,
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


    const onSendNotificationPressed = () =>{
        console.log("in onSendNotificationPressed");
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              const uid = user.uid;
              const db = getFirestore();
              const docRef = doc(db, "users", uid);
              let patienPushToken="";
              (async ()=>{
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                // console.log("Document data:", docSnap.data());
                var currentUserPhoneNum= docSnap.data().myNum
                const q = query(collection(db, "users"), where("otherSidePhoneNum", "==", currentUserPhoneNum));
                let patienPushToken="";
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                  // doc.data() is never undefined for query doc snapshots
                //   console.log(doc.id, " => ", doc.data());
                  patienPushToken=doc.data().pushToken;
                });
                console.log("patient push token: ",patienPushToken);
                sendPushNotification(patienPushToken)

              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
            })();
            
             
            
            } else {
              // User is signed out
              // ...
            }
             
          });


    }
  return (
    <ScrollView>
        <View style={styles.root}>
            <Text style={styles.title} >Send A Remainder as Notification </Text>

             <CustomInput
              placeholder="Title"
              value={title} 
              setValue={setTitle}
              secureTextEntry={false}
              />
              <CustomInput
              placeholder="Body"
              value={body} 
              setValue={setBody}
              secureTextEntry={false}
              />
        

            <CustomButton text="Send Notification" onPress={()=>onSendNotificationPressed()}/>

            
        </View>
        </ScrollView>
  );
}
const styles = StyleSheet.create({
    root:{
        alignItems:'center',
        padding: 20,
    },
    title:{
        fontSize: 24,
        fontWeight:'bold',
        color:'#051C60',
        margin: 10,
    },
 
})

export default SendNotification;

