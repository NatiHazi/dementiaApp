import React,{useState,useEffect} from 'react';
import { View ,Text ,ScrollView,StyleSheet,Alert,Image,Modal,Pressable,TextInput,Button,BackHandler} from 'react-native';
import CustomButtonForTherapistScreen from '../../components/CustomButtonForTherapistScreen';
import CustomInput from '../../components/CutomInput';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import Circle from '../../components/Circle/Circle';
import { findOtherSideIdFirebase,
   updateColorAfterReadFirebase,
    getPatientBatteryStatus,
     setBackgroundInFirebase,updateDataInFirebase} from '../../utils/firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import IconBadge from 'react-native-icon-badge';
import DeviceInfo from 'react-native-device-info';




const TherapistOptionScreen = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const navigation = useNavigation();
  const [firstRender, setfirstRender]=useState(true);
  const [color, setColor]=useState({
    location: "#3B71F3",
    calls: "#3B71F3",
    sms: "#3B71F3",
    battery:"#3B71F3"
  });
  const [patientID,setPatientID]=useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [long, setLong] = useState("");
  const [lat, setLat] = useState("");
  const [radius, setRadius] = useState("");
  const [w, setW] = useState("");
  
  const backAction = () => {
    navigation.navigate("TherapistScreen");
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  useEffect(
    () => {
       
      const subscriber=auth().onAuthStateChanged(onAuthStateChanged);  
     if(user){
       console.log("user conected useEffect");
       const uid = user.uid;
       if(firstRender){
        findPatientID(uid);
       listenForColor();
       DeviceInfo.getPhoneNumber().then((phoneNumber) => {
        if (phoneNumber.includes("+972")){
          phoneNumber.replace("+972","0");
        }
        Alert.alert(
          "זוהה מספר מטפל חדש",
          `זוהה מספר חדש. האם תרצה לקבל עדכוני הודעות למספר ${phoneNumber}?`,
          [
            {
              text: "לא",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "כן", onPress: () => updateTherapistNum(phoneNumber)}
          ]
        );
      });
        setfirstRender(false);
        
       }
     }
     if (!user){
       console.log (" USER DISCONNECTED FROM THERPAIST  ");
     }
    
     
     return () => subscriber;
    },
    [user]
  );
  const updateTherapistNum = (phoneRecognized) =>{
    findOtherSideIdFirebase(user.uid).then((result)=>{
      const saveOtherSideID=result[0];
      updateDataInFirebase(user.uid, {myNum: phoneRecognized}).then((reuslt)=>{
    
         updateDataInFirebase(saveOtherSideID, {otherSidePhoneNum: phoneRecognized }).then((result)=>{
          updateDataInFirebase(user.uid, {phoneNumberUpdated: true}).then((result)=>{
            
            navigation.navigate("TherapistScreen");
          })
          
      })
    });
  });
  }

  function updateColorAfterRead(theColorArtibute){
    if (user){
    updateColorAfterReadFirebase(theColorArtibute, user.uid);
    }
   
  };


  function listenForColor(){
    if (user){
      const uid=user.uid;
   firestore()
      .collection('users')
      .doc(uid)
      .onSnapshot(documentSnapshot => {
        // console.log('User data: ', documentSnapshot.data());
        setColor({
          location: documentSnapshot.data().colorLocation,
          calls: documentSnapshot.data().colorCalls,
          sms: documentSnapshot.data().colorSMS,
          battery: documentSnapshot.data().colorBattery,
        })
      });
   
    }
    else{
      console.log("user not connected");
    }
  };

  function findPatientID(uid){
    console.log('starting function findPatientID');
    //onUpdatePressed1();
    findOtherSideIdFirebase(uid).then((result)=>{
      console.log("line 99 , ", result)
      setPatientID(result[0]);
    })
  }
  

    const onPatientCallPressed = () =>{
      // navigation.navigate("signIn");
      console.log("patient's call pressed");
      //onUpdatePressed1();
      updateColorAfterRead("colorCalls");
      navigation.navigate("ShowCallLogPage", {patientID: patientID});
  };

  const onPatientSMSPressed = () =>{
    // navigation.navigate("signIn");
    console.log("patient's message pressed");
    //onUpdatePressed1();
    updateColorAfterRead("colorSMS");
    navigation.navigate("ShowSMSLogPage", {patientID: patientID});
};

    const findPatienPressed = () =>{
        console.log("find patiend pressed");
        updateColorAfterRead("colorLocation");
        if (patientID)
          navigation.navigate("UserLocation", {patientID: patientID});
        else  
          alert("זמנית המידע לא זמין. נסו מאוחר יותר");
 
    };
    const onSendReminders = () =>{
        console.log("on send reminders pressed")
        navigation.navigate("SendNotification", {patientID: patientID, therapistID: user.uid})
    } 
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
    const onBatteryStatusPressed = () =>{
      console.log("onBatteryStatusPressed");
      //onUpdatePressed1();
      
      updateColorAfterRead("colorBattery");
     
      if(patientID){
        getPatientBatteryStatus(patientID).then((result)=>{
          if (result !== 'fail'){
            Alert.alert(
              "מצב סוללה של המטופל:",
          result,
          [
            { text: "אישור", onPress: () => console.log("OK Pressed") }
          ]
        );
          };
        });

        }
        else {
          alert("זמנית המידע לא זמין. נסו מאוחר יותר");
        } 
      }
        const setBackgroundForPatient = () =>{
      
          if (initializing) return null;
          if(user && patientID){
            console.log("test if inside user");
            const uid = user.uid;
            setBackgroundInFirebase(uid, patientID);
      
            }
            else {
            console.log("user is not signed in/didnt get yet patiend id in fb");
            alert("זמנית המידע לא זמין. נסו מאוחר יותר");
            } 



          };
          
          const safeAreaInput = () => {
            console.log("line 172: ",lat,long,radius);
            if(patientID){
              const obj = {
                latSafe:lat,
                longSafe:long,
                radiusSafe:radius
              };
              updateDataInFirebase(patientID,obj);
             }
            setLat("");
            setLong("");
            setRadius("");
         
          }

        const askForUpdateLocation = () => {
          if(user){
            updateDataInFirebase(user.uid,{giveUpdateLocation:true});
            alert("הפעולה עשויה להמשך מספר שניות");
            }
            else {
              alert("זמנית השירות לא זמין, נסו מאוחר יותר.");
            }
          }
 
          
    return (
        <ScrollView keyboardShouldPersistTaps='handled'>
        <View style={styles.root}>
            <Text style={styles.title} >DementiaApp</Text>
           
             {/* <Circle id="location" color={color.location}/>    */}
             
             <Icon style={styles.iconSec} onPress={()=>{askForUpdateLocation()}}
                name="navigate-circle-outline"
              
             />
            
             <IconBadge 
          
                icon={
                  <Icon
                    name="navigate-circle-outline"
                    
                  />
                }
               
              MainElement={
              
             <CustomButtonForTherapistScreen text="לחץ לקבלת מיקום" onPress={()=>{findPatienPressed()}}/> 
            //  {/* <Circle id="calls" color={color.calls}/> */}
            
               }
           
                IconBadgeStyle={{
                  marginTop:9,
                  top:1,
                  left:0,
                  width:20,
                  height:20,
                  borderRadius:15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor:color.location,  
                  
                }} 
               />
             
             <IconBadge 
              MainElement={
             <CustomButtonForTherapistScreen text="לחץ לרשימת השיחות" onPress={()=>{onPatientCallPressed()}}/> 
              }
              IconBadgeStyle={{
                marginTop:9,
                top:1,
                left:0,
                width:20,
                height:20,
                borderRadius:15,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:color.calls,  
              }}
              />
             {/* <Circle id="sms" color={color.sms}/> */}

             <IconBadge 
              MainElement={
             <CustomButtonForTherapistScreen text="לחץ לרשימת ההודעות שהתקבלו" onPress={()=>{onPatientSMSPressed()}}/> 
              }
              IconBadgeStyle={{
                marginTop:9,
                top:1,
                left:0,
                width:20,
                height:20,
                borderRadius:15,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:color.sms,  
              }}
              />

            <IconBadge 
              MainElement={
                <CustomButtonForTherapistScreen text="לחץ לבדיקת מצב סוללה"  onPress={()=>{onBatteryStatusPressed()}}              
                />
             }
             
             IconBadgeStyle={{
              marginTop:9,
              top:1,
              left:0,
              width:20,
              height:20,
              borderRadius:15,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor:color.battery,  
              
            }}
            
              />
              
               {/* <Circle id="battery" color={color.battery}/>
             <CustomButtonForTherapistScreen text="לחץ לבדיקת מצב סוללה" onPress={()=>{onBatteryStatusPressed()}}
             /> */}
             
             <CustomButtonForTherapistScreen text="לחץ להגדרת רקע" onPress={()=>{setBackgroundForPatient()}}/>
            
             <CustomButtonForTherapistScreen text="לחץ לשליחת תזכורת" onPress={()=>{onSendReminders()}}/> 

             {/* <CustomButtonForTherapistScreen text="הגדר מיקום בטוח" onPress={()=>{safeArea()}}/>  */}
            {/* <CustomButtonForTherapistScreen text="Therapist" onPress={onTherapistPressed}/> 
            <CustomButtonForTherapistScreen text="Patient" onPress={onTherapistPressed}/>  */}


<Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                  }}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Icon style={styles.icon} name="close"
                      onPress={() => setModalVisible(!modalVisible)}
                      />
                      <Text style={styles.modalText}>הכנס קורדינטות</Text>
                  
                      <TextInput
                      style={styles.input}
                      placeholder="רוחב"
                      keyboardType="numeric"
                      value={lat}
                      onChangeText={(text)=>{
                        setLat(text);
                      }}

                      />
                      <TextInput
                      style={styles.input}
                      placeholder="אורך"
                      keyboardType="numeric"
                      value={long}
                      onChangeText={(text)=>{
                        setLong(text);
                      }}
                      />
                       <TextInput
                      style={styles.input}
                      placeholder="אנא הכנס רדיוס בקילומטרים"
                      keyboardType="numeric"
                      value={radius}
                      onChangeText={(text)=>{
                        setRadius(text);
                      }}
                      />
                      <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => {setModalVisible(!modalVisible);
                        safeAreaInput();
                        }}
                      >
   
                        <Text style={styles.textStyle}>שמור מיקום</Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
                <Pressable
                  style={[styles.button, styles.buttonOpen]}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.textStyle}>הגדר מיקום בטוח</Text>
                </Pressable>
        </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
 
    root:{
        //alignItems:'center',
        backgroundColor:'snow',
        padding: 50,
        paddingTop:0,
    },
    title:{
      paddingVertical: 6,
      borderWidth: 4,
      borderRadius: 8,
      backgroundColor: "#fff",
      color: "#20232a",
      textAlign: "center",
      fontSize: 40,
    },
    text:{
        flex: 1,
        fontStyle:'normal',
        fontWeight:'bold',
        fontSize: 10,
        textAlign:'center',
        color:'#051C60',
        margin: 10,
    },
    icon:{
      alignSelf: "flex-start",
      padding:5,
      fontSize:20
    },
    input: {
      backgroundColor: 'white',
      padding: 10,
      width:300,
      writingDirection: 'rtl',
      borderColor: '#e8e8e8',
      borderWidth:1,
      borderRadius:5,
      marginVertical: 5,
      justifyContent: 'space-evenly',
      flexDirection:'row',
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: "#F0F8FF",
      borderRadius: 20,
      padding: 20,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
      width: 0,
      height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    button: {
      padding: 20,
        height: 60,
        width:'100%',
        flexDirection:'row',
        padding:20,
        marginVertical:10,
        borderRadius:10,
        justifyContent: 'space-evenly',
        alignSelf: "flex-start",
    },
    buttonOpen: {
      backgroundColor: '#3B71F3',
    },
    buttonClose: {
      backgroundColor: '#3B71F3',
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
      fontWeight:'bold',
      fontSize: 24,
    },
    iconSec: {
      marginBottom: 6,
      marginTop:15,
      textAlign: "center",
      fontSize: 30,
    },

})


export default TherapistOptionScreen;