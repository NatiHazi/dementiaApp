import React,{useState,useEffect} from 'react';
import { View,Image,Text ,ScrollView,StyleSheet,SafeAreaView,FlatList,StatusBar,Alert,Linking,Platform,SectionList  } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import SmsAndroid from 'react-native-get-sms-android';
import { getPatientCallsFirebase } from '../../utils/firebase';



const ShowLogCall = ({route}) => {
  const {patientID} = route.params;
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
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);  

    if (user)
    getDataFirebase();

    return () => subscriber;
    
  }, [user]);


  function getDataFirebase(){
    getPatientCallsFirebase(patientID).then((result)=>{
      if (result){
        let count = 1;
        let emptyStr;
        for (let i=0; i<result.length; i++){
           if (i%2==0){
             emptyStr = " " + count + ") התקבלה בתאריך - " + result[i];
              }
      else{
        emptyStr+="\n ממספר טלפון - " + result[i];
        setthelist(thelist=>[...thelist, {key:emptyStr}]);
        count+=1;
    }
    } 
      }
    });
  };



    return (
       //<View style={styles.container}>
       <SafeAreaView style={styles.container}>
       <ScrollView contentContainerStyle={{flexGrow:1}}>
       <Text style= {styles.text}>רשימת שיחות</Text>
          {
             thelist.map((item) => {
               return(
                 <View key={item.key}>
                    <Text style= {styles.item}>{item.key}</Text>
                    <Text></Text>
                   </View>
               )
             })
          }
       </ScrollView>
     </SafeAreaView>


        // <ScrollView style={styles.container} >
        //   <Text style= {styles.text}>רשימת שיחות של המטופל</Text>
        //   {
        //     thelist.map((item) => {
        //       return(
        //         <View key={item.key}>
        //            <Text style= {styles.item}>{item.key}</Text>
        //           </View>
        //       )
        //     })
        //   }

        // </ScrollView>

        // {/* <FlatList nestedScrollEnabled
        //  data={thelist}
        //  //<Text style={styles.item}>{item.key}</Text>
        //   renderItem={({item}) =>{
        //     return <View style={{flexDirection:'row'}}>
        // <View>
          
        //     <Text style= {styles.item}>{item.key}</Text>
        // </View>
        // </View>
        //   }
        // }
        // /> */}
       //</View>   
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
scrollView: {
  backgroundColor: 'pink',
  marginHorizontal: 10,
},
  container: {
   flex: 1,
   paddingTop: 10
  },
  item: {
    flex: 1 ,
    marginRight: "9%",
    marginLeft: "10%",
    marginTop: 10,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#F0FFFF',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    shadowRadius:20,
    fontWeight: 'bold',
    color:'black',
    width:315,
 
  },
});

 export default ShowLogCall
