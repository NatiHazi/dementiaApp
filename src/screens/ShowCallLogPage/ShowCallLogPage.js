import React,{useState} from 'react';
import { View,Image,Text ,ScrollView,StyleSheet,SafeAreaView,FlatList,StatusBar} from 'react-native';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ShowLogCall = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  let DATA=[{key: "1111",key: "2222"}];
  const newCall = "New Call at: ";
  const NumberOfCall = "Number: ";
  

  const subscriber = auth().onAuthStateChanged(onAuthStateChanged);  
  if (initializing) return null;
  if(user){
    console.log("test if inside user");
    const uid = user.uid;
    let phoneNumber = "";
    let unknown_calls = "";
    //let idPatient = "";
    firestore()
    .collection('users')
    .doc(uid)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        phoneNumber = documentSnapshot.data().myNum;
        console.log("line 62 : ",phoneNumber);
      }
      });
        firestore()
        .collection('users')
        .get()
        .then(querySnapshot => {
           querySnapshot.forEach(documentSnapshot => {
             if(documentSnapshot.data().otherSidePhoneNum == phoneNumber){
              unknown_calls = documentSnapshot.data().unknown_calls;
              //console.log("line 76 ",persentBattery)
              for (let index = 0; index < unknown_calls.length; index++) {
                const element = unknown_calls[index];
                if(index %2===0){
                 DATA.push("fdsf");
                }
                else{
                   DATA.push("fsd");
                }
               }
              
              console.log("1111111111111111111111111",DATA);
             }
            //console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
          });
        });
       
    }
    else {
    console.log("user is not signed in");
    };
    console.log("2222222222222222222",DATA);
  

    return (
      <View style={styles.container}>
        
        <FlatList
         data={DATA}
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


// const ShowLogCall = () => {
//     const navigation = useNavigation();
//     const onTherapistPressed = () =>{
//         navigation.navigate("signIn",{
//             isTherapist: true});
//     };
//     const onPatientPressed = () =>{
//         navigation.navigate("signIn", {isTherapist: false});
//     };
//     return (
//         <ScrollView>
//         <View style={styles.root}>
//             <Text style={styles.title} >DementiaApp  </Text>
//             <Image style={styles.logo} source={require('../../../assets/logo.jpg')}/>
//             <Text style={styles.text} >  </Text>
//             <Text style={styles.text} >Please login as:  </Text>
//             <CustomButton text="Therapist" onPress={()=>onTherapistPressed()}/> 
//             <CustomButton text="Patient" onPress={()=>onPatientPressed()}/> 
//         </View>
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     root:{
//         alignItems:'center',
//         backgroundColor:'snow',
//         padding: 20,
//     },
//     title:{
//         fontSize: 36,
//         fontWeight:'bold',
//         color:'#051C60',
//         margin: 10,
//     },
//     text:{
//         flex: 1,
//         fontStyle:'normal',
//         fontWeight:'bold',
//         fontSize: 22,
//         textAlign:'center',
//         color:'#051C60',
//         margin: 10,
//     },
//     logo: {
        
//         width:300,
//         height:300,
//     },
// })

//export default ShowLogCall
 export default ShowLogCall