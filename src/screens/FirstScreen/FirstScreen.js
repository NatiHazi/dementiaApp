import React,{useState} from 'react';
import { View,Image,Text ,ScrollView,StyleSheet} from 'react-native';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';




const FirstScreen = () => {
    const navigation = useNavigation();
    console.log("BLAT");
    
    const getData = async () => {
        try {
          const value = await AsyncStorage.multiGet(['userkey', 'passkey'])
          if(value[0][1] !== null && value[0][1]!=='' &&  value[1][1]!=='' && value[1][1]!==null) {
            // value previously stored
            console.log("E M A I L: ", value[0][1], value[1][1]);
            auth().signInWithEmailAndPassword(value[0][1], value[1][1])
            .then((userCredential) => {
            console.log("sucess")
            // Signed in 
            const user = userCredential.user;
            const uid = user.uid;
            console.log(user.email)
            if (!user.emailVerified){
                alert("you must verify your account in your mail")
                
            }
            else{
                console.log("log in succeed")
                firestore()
                .collection('users')
                .get()
                .then(querySnapshot => {
                  querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().id===uid){
                        console.log("inside id===uid");
                        if (documentSnapshot.data().isTherapist==true){
                            console.log("inside Therapist is true");
                       navigation.navigate("TherapistScreen");
                    }
                    else{
                        console.log("inside Therapist is false");
                      navigation.navigate("PatientScreen"); 
                    }
                    }
                   // console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
                  });
                });    
            
            }
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode)
           
            if (errorCode ==="auth/invalid-email"){
                //alert("invalid email")
                console.log("invalid email");
            }
            if (errorCode ==="auth/user-not-found"){
                //alert("User not existing in the system")
                console.log("auth/user-not-found");
            }
            if (errorCode ==="auth/wrong-password"){
                //alert("wrong password")
                console.log("auth/wrong-password");
            }
            navigation.navigate("MainScreen"); 
            
          });
            
          }
          else{
              console.log("ASYNC STORAGE IS EMPTY.");
              navigation.navigate("MainScreen"); 
            
          }
        } catch(e) {
          // error reading value
          console.log(e);
          navigation.navigate("MainScreen"); 
        }
      };

      
     getData();

    return (
        <ScrollView>
        <View style={styles.root}>
            {/* <Text style={styles.title} >DementiaApp  </Text> */}
            <Image style={styles.logo} source={require('../../../assets/logo.jpg')}/>
       
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
        height:400,
    },
})


export default FirstScreen