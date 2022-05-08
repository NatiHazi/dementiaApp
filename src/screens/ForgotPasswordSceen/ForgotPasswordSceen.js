import React,{useState} from 'react';
import { View, Text, StyleSheet ,ScrollView} from 'react-native';
import CustomInput from '../../components/CutomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';





const ForgotPasswordSceen = ({ route }) => {
    const { isTherapist} = route.params;
    const [userName, setUserName] = useState('');

    const navigation = useNavigation();

    const onSendPressed = () =>{
        
            auth().sendPasswordResetEmail(userName)
            .then(function() {
            // Email sent.
            console.log("Password reset email sent! ")
            alert("Please go to mail and set new Password and then sign in with new Password")
            navigation.navigate("signIn", {isTherapist: isTherapist});
            })
            .catch(function(error) {
            // An error happened.
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode)
            });


        
    };

    const onSignInPressed = () => {
        navigation.navigate("signIn", {isTherapist: isTherapist});
    };



    return (
        <ScrollView>
        <View style={styles.root}>
            <Text style={styles.title} >איפוס סיסמא</Text>

             <CustomInput
              placeholder="הכנס מייל"
              value={userName} 
              setValue={setUserName}
              />
          
             
            <CustomButton text="שלח" onPress={onSendPressed}/>

            <CustomButton
            text="חזור למסך התחברות"
            onPress={onSignInPressed}
            type = "TERTIARY"
            />

            
        </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    root:{
        alignItems:'center',
        padding: 20,
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

export default ForgotPasswordSceen;
