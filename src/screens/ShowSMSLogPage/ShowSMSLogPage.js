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
// function for updates call from firebase
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
              let emptyStr = "";
              let count = 1;
              for (let i=0; i<SMSPatient.length; i++){
                if (i%2==0){
                  emptyStr = " " + count + ") הודעה התקבלה ממספר - " + SMSPatient[i];
                }
                else{
                  emptyStr+="\n פירוט ההודעה - " + SMSPatient[i];
                   setthelist(thelist=>[...thelist, {key:emptyStr}]);
                   count+=1;
                }
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
        
        <Text style= {styles.text}>רשימת הודעות של המטופל</Text>
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
    );
    
};



  
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
   paddingTop: 50,
  },
  item: {
    flex: 1 ,
    marginRight: "10%",
    marginLeft: "11%",
    marginTop: 10,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#F0FFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    fontWeight: 'bold',
    color:'black',
    width:315,
 
  },
});

 export default ShowSMSLog