import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import openMap from 'react-native-open-maps';
// import { getAuth, onAuthStateChanged,collection,getDocs,getFirestore,doc,getDoc, query, where } from "../../db/firebase";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { getPatientLocationFromServer } from '../utils/firebase';
import { useNavigation } from '@react-navigation/native';
import MapView,{Marker} from 'react-native-maps';

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
        //openMap({latitude: result[0], longitude: result[1], zoom: 20,provider:"google"});
        setlat(result[0]);
        setlongit(result[1]);
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
  (lat && longit)?
  <View style={styles.container}>
  {/*Render our MapView*/}
    <MapView
      style={styles.map}
      //specify our coordinates.
      initialRegion={{
        latitude: lat,
        longitude: longit,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      // onRegionChangeComplete={(region) => setRegion(region)}
      
    >
       <Marker
  coordinate={{latitude: lat, longitude: longit}}
  // title={'title'}
  // description={'description'}
/>
   </MapView>
   {/* <Text style={styles.text}>Current latitude{region.latitude}</Text>
    <Text style={styles.text}>Current longitude{region.longitude}</Text> */}
  </View>
  : null
);

}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, //the container will fill the whole screen.
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});