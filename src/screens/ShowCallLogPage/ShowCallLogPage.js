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
              let emptyStr = "";
              let count = 1;
              for (let i=0; i<unknown_calls.length; i++){
                if (i%2==0){
                  emptyStr = " " + count + ") התקבלה בתאריך - " + unknown_calls[i];
                }
                else{
                  emptyStr+="\n ממספר טלפון - " + unknown_calls[i];
                    setthelist(thelist=>[...thelist, {key:emptyStr}]);
                    count+=1;
                }
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
        <Text style= {styles.text}>רשימת שיחות של המטופל</Text>
        <FlatList
         data={thelist}
         //<Text style={styles.item}>{item.key}</Text>
          renderItem={({item}) =>{
            return <View style={{flexDirection:'row'}}>
        <View>
          
            <Text style= {styles.item}>{item.key}</Text>
        </View>
        </View>
          }
        }
        />
      </View>   
)};


  
const styles = StyleSheet.create({
    text:{
    flex: 1,
    fontStyle:'normal',
    fontWeight:'bold',
    fontSize: 24,
    textAlign:'center',
    color:'#051C60',
},
  container: {
   flex: 1,
   paddingTop: 50
  },
  item: {
    flex: 1 ,
    marginRight: "10%",
    marginLeft: "11%",
    marginTop: 10,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#F0FFFF',
    borderRadius: 10,
     borderWidth: 1,
    borderColor: '#000',
    fontWeight: 'bold',
    color:'black',
 
  },
});

 export default ShowLogCall
