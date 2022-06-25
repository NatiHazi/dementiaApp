import React,{useState} from 'react';
import { View, Text, StyleSheet ,ScrollView,I18nManager} from 'react-native';
import CustomInput from '../../components/CutomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { sendPasswordResetEmailHandler } from '../../utils/firebase';



const ForgotPasswordScreen = ({ route }) => {
    const { isTherapist} = route.params;
    const [userName, setUserName] = useState('');

    const navigation = useNavigation();

   
    const onSendPressed = () =>{
       
            sendPasswordResetEmailHandler(userName).then((result)=>{
                //console.log("result:::!#!#" , result);
                if (result==="success")
                navigation.navigate("signIn", {isTherapist: isTherapist});
            })
           
    };

    // const onSignInPressed = () => {
    //     navigation.navigate("signIn", {isTherapist: isTherapist});
    // };

   


    return (
        <ScrollView>
        <View style={styles.root}>
        <Text style={styles.title} >איפוס סיסמא</Text>

             <CustomInput
              placeholder="הכנס מייל"
              value={userName} 
              setValue={setUserName}
              style={styles.input}
              />
          
             
            <CustomButton text="שלח" onPress={onSendPressed}/>

           

            
        </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    root:{
        alignItems:'center',
        padding: 50,
    },
    input:{
        //textAlign:'left',
        width:"100%",
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    title:{
        fontSize: 24,
        fontWeight:'bold',
        color:'#051C60',
        margin: 10,
    },
    text:{
        color:'gray',
        marginVertical:10,
    },
    link:{
        color:'#FDB075',
    },
})

export default ForgotPasswordScreen;
