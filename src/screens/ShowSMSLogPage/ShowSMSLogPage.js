import React,{useState,useEffect} from 'react';
import { View,Image,Text ,ScrollView,StyleSheet,SafeAreaView,FlatList,StatusBar,Alert,Linking,Platform  } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';



const ShowSMSLog = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [thelist, setthelist]=useState([]);
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
  useEffect(() => {
    getDataFirebase();
  }, [user]);
 //#######################################################
// dunction for updates call from firebase
  function updateSMS(id){
    let SMSPatient = "";
    const subscriber = firestore()
    .collection('users')
    .doc(id)
    .onSnapshot(documentSnapshot => {
      console.log('User data: ', documentSnapshot.data().List_SMS
      );
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
    let SMSPatient = "";
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
             SMSPatient = documentSnapshot.data().List_SMS;
              for (let i=0; i<SMSPatient.length; i++){
                if (i%2==0)
              setthelist(thelist=>[...thelist, {key:"SMS No': " + i + " from - " + SMSPatient[i]}]);
                else
              setthelist(thelist=>[...thelist, {key:"Message No': " + i + " - " + SMSPatient[i]}]);
                }   
                updateSMS(idPatient); 
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
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

 export default ShowSMSLog