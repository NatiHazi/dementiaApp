import React, { useState } from 'react';
import { Text, TextInput, View,ScrollView,StyleSheet,Alert,Linking } from 'react-native';
import CustomInput from '../../components/CutomInput';
import CustomButton from '../../components/CustomButton';
//import { getAuth, onAuthStateChanged,collection,getDocs,getFirestore,doc,getDoc, query, where } from "../../../db/firebase";
import { updateDataInFirebase } from '../../utils/firebase';
//import { initializeApp } from "firebase-admin/app";
import { useNavigation } from '@react-navigation/native';

//initializeApp();

const SendNotification = ({route}) => {
    const {patientID} = route.params;
    const {therapistID} = route.params;
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const navigation = useNavigation();
    // const [user,setUser]=useState();
    // const [initializing, setInitializing] = useState(true);


    // function onAuthStateChanged(user) {
    //     setUser(user);
    //     if (initializing) setInitializing(false);
    //   }

    const onSendNotificationPressed = () =>{
      updateDataInFirebase(patientID, {titleNotification: title,
      bodyNotification: body,
      }).then((result)=>{
        if (result==="success"){
        updateDataInFirebase(therapistID, {sendNotification: true}).then((result)=>{
          if (result==="success"){
          navigation.navigate("TherapistScreen");
          }
          else{
            alert("אירעה שגיאה, נסו מאוחר יותר");
          }
        });
      }
      else{
        alert("אירעה שגיאה, נסו מאוחר יותר");
      }

      });
    }
  return (
    <ScrollView>
        <View style={styles.root}>
            <Text style={styles.title} >שליחת תזכורות</Text>

             <CustomInput
              placeholder="כותרת"
              value={title} 
              setValue={setTitle}
              secureTextEntry={false}
              />
              <CustomInput
              placeholder="הודעה"
              value={body} 
              setValue={setBody}
              secureTextEntry={false}
              />
        

            <CustomButton text="שלח" onPress={()=>onSendNotificationPressed()}/>

            
        </View>
        </ScrollView>
  );
}
const styles = StyleSheet.create({
    root:{
        alignItems:'center',
        padding: 50,
    },
    title:{
        fontSize: 24,
        fontWeight:'bold',
        color:'#051C60',
        margin: 10,
    },
    text:{
      fontSize: 18,
     // fontWeight:'bold',
      color:'#000',
     // margin: 10,
      paddingBottom:20,
  },
 
})

export default SendNotification;

