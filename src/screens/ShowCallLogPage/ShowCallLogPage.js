import React,{useState,useEffect} from 'react';
import { View,Image,Text ,ScrollView,StyleSheet,SafeAreaView,FlatList,StatusBar,Alert,Linking,Platform  } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import SmsAndroid from 'react-native-get-sms-android';



const ShowLogCall = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [thelist, setthelist]=useState([]);
  const newCall = "שיחה חדשה ב: ";
  const NumberOfCall = "מספר הטלפון: ";

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
  useEffect(() => {
  
    getDataFirebase();
    
  }, [user]);
 //#######################################################
// dunction for updates call from firebase
  function updateCalls(id,phoneNumber){
    let firstFire = true;
    const subscriber = firestore()
    .collection('users')
    .doc(id)
    .onSnapshot(documentSnapshot => {
      if (!firstFire){
      console.log('User data: ', documentSnapshot.data().unknown_calls);
      
      SmsAndroid.autoSend(
        phoneNumber,
        "Patient got another message",
        (fail) => {
          console.log('Failed with this error: ' + fail);
        },
        (success) => {
          console.log('SMS sent successfully');
        },
      );  
      }
      firstFire=false;
      return () => subscriber(); 
    });
  }
   //#######################################################

  function getDataFirebase(){
  const subscriber = auth().onAuthStateChanged(onAuthStateChanged);  
  // if (initializing){  return null;}
  if(user){
    console.log("test if inside user");
    const uid = user.uid;
    let phoneNumber = "";
    let unknown_calls = "";
    let idPatient = "";
    //#######################################################
    firestore()
    .collection('users')
    .doc(uid)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        phoneNumber = documentSnapshot.data().myNum;
      }
      });
        firestore()
        .collection('users')
        .get()
        .then(querySnapshot => {
           querySnapshot.forEach(documentSnapshot => {
             if(documentSnapshot.data().otherSidePhoneNum == phoneNumber){
              idPatient = documentSnapshot.data().id;
             console.log("idPatient: ",idPatient);  
              unknown_calls = documentSnapshot.data().unknown_calls;
              for (let i=0; i<unknown_calls.length; i++){
                if (i%2==0)
              setthelist(thelist=>[...thelist, {key:"תאריך מס' 1 ': " + i + " - " + unknown_calls[i]}]);
                else
              setthelist(thelist=>[...thelist, {key:"Phone Number No': " + i + " from - " + unknown_calls[i]}]);
                } 

             
             updateCalls(idPatient,phoneNumber); 
             }
          });
        }); 
        //#######################################################
    }
    else {
    console.log("user is not signed in");
    };
  }


    return (
      <View style={styles.container}>
        
        <FlatList
         data={thelist}
          renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
        />
         
      </View>
    );
    
};



  
const styles = StyleSheet.create({
    text:{
    flex: 1,
    fontStyle:'normal',
    fontWeight:'bold',
    fontSize: 22,
    textAlign:'center',
    color:'#051C60',
},
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    marginTop:16,
    padding: 10,
    fontSize: 18,
    height: 44,
    backgroundColor:'#F0F8FF',
    textAlign: 'right',
  },
});

 export default ShowLogCall
