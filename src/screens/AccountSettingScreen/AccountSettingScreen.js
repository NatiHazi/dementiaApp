import React,{useState, useEffect} from 'react';
import { View, Text, StyleSheet, useWindowDimensions,ScrollView,I18nManager,Switch} from 'react-native';
import CustomInput from '../../components/CutomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { updateDataInFirebase, findOtherSideIdFirebase } from '../../utils/firebase';




const AccountSettingScreen = () => {
    const [username, setUsername] = useState('');
    const [usernameSec, setUsernameSec] = useState('');
    const [user, setUser] = useState();
    const [otherSideNum, setotherSideNum] = useState('');
    const [yourNum, setYourNum] = useState('');
    const [initializing, setInitializing] = useState(true);
    const [userNameFirebase, setUserNameFirebase]=useState('');
    const [isEnabled, setIsEnabled] = useState(false);
    const navigation = useNavigation();

    useEffect(
        () => {
          subscriber=auth().onAuthStateChanged(onAuthStateChanged);  
         if(user){
            firestore()
            .collection('users')
            .doc(user.uid)
            .get()
            .then(documentSnapshot => {
              console.log('User exists: ', documentSnapshot.exists);
    
              if (documentSnapshot.exists) {
                setUsername(documentSnapshot.data().userName);
                setUsernameSec(documentSnapshot.data().userName);
                setYourNum(documentSnapshot.data().myNum);
                setotherSideNum(documentSnapshot.data().otherSidePhoneNum);
                setIsEnabled(documentSnapshot.data().stopGetSMS)


              }
            });
         }
         
         return () => subscriber;
        },
        [user]
      );

      function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
      }

      function updateDetails(){
          if (user){
            findOtherSideIdFirebase(user.uid).then((result)=>{
              const saveOtherSideID=result[0];
              updateDataInFirebase(user.uid, {userName: username, myNum: yourNum, otherSidePhoneNum: otherSideNum }).then((reuslt)=>{
            
                 updateDataInFirebase(saveOtherSideID, {userName: username, myNum: otherSideNum , otherSidePhoneNum: yourNum }).then((result)=>{
                  updateDataInFirebase(user.uid, {phoneNumberUpdated: true}).then((result)=>{
                    
                    navigation.navigate("TherapistScreen");
                  })
                  
              })
            });
          });
           
          }
      };
      const toggleSwitch = () => {
        updateDataInFirebase(user.uid, {stopGetSMS: !isEnabled }).then((result)=>{
           setIsEnabled(previousState => !previousState);
        });
        
      
      };

    return (
        <ScrollView>
        <View style={styles.root}>
        <Text style={styles.title} >עריכת פרטי חשבון</Text>
        <Text style={styles.subtitle} >שם משתמש</Text>
             <CustomInput
              placeholder=" שם משתמש"
              value={username} 
              setValue={setUsername}
              secureTextEntry={false}
              style={styles.input}
              />
             <Text style={styles.subtitle} > מספר הטלפון של {usernameSec}</Text>
               <CustomInput
              placeholder="מספר טלפון שלך"
              value={yourNum}
              setValue={setYourNum} 
              secureTextEntry={false}
              style={styles.input}
              />
              <Text style={styles.subtitle} > מספר הטלפון של המטופל</Text>
              <CustomInput
              placeholder="מספר טלפון של המטופל"
              value={otherSideNum}
              setValue={setotherSideNum} 
              secureTextEntry={false}
              style={styles.input}
              />
              <View>
                <Text>קבל עדכונים אודות שיחות והודעות נכנסות אצל המטופל</Text>
              <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled ? "green" : "#f4f3f4"}
              onValueChange={toggleSwitch}
              value={isEnabled}
              style={styles.input}
            />
            </View>
            <CustomButton text="שמור" onPress={()=>{updateDetails()}}/>
    
        </View>
        </ScrollView>
    );
};
 
const styles = StyleSheet.create({
    root:{
        // alignItems:'center',
        padding: 50,
    },
    input:{
        //textAlign:'left',
        width:"100%",
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    title:{
        fontSize: 30,
        fontWeight:'bold',
        color:'#051C60',
        margin: 20,
    },
    subtitle:{
        fontSize: 12,
        fontWeight:'bold',
        color:'#051C60',
        margin: 5,
        textAlign: 'left',
    },
    text:{
        color:'gray',
        marginVertical:10,
    },
    link:{
        color:'#FDB075',
    },
})


export default AccountSettingScreen