import React,{useState} from 'react';
import { View, Text, StyleSheet, useWindowDimensions,ScrollView} from 'react-native';
import CustomInput from '../../components/CutomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native'
//לשנות ככה שיהיה כתוב למשתמש שהוא צריך ללכת למייל ולהפעיל את המשתמש בקישור שנשלח. ואז אחרי שהוא ילחץ 'הבנתי' אז יעבור למסך התחברות
const ConfirmEmailScreen = () => {
    const [code, setCode] = useState('');

    const navigation = useNavigation();

    const onConfirmPressed = () =>{
        navigation.navigate("signIn");
    };

    const onSignInPressed = () => {
        navigation.navigate("signIn");
    };

    const onSResendPressed = () => {
        console.log("onSResendPressed");
    };
    const onPrivacyPressed = () => {
        console.log("onPrivacyPressed");
    };

    return (
        <ScrollView>
        <View style={styles.root}>
            <Text style={styles.title} >Confirm your email  </Text>

             <CustomInput
              placeholder="Enter your confirmation code"
              value={code} 
              setValue={setCode}
              />
          
             
            <CustomButton text="Confirm" onPress={onConfirmPressed}/>

            <CustomButton
            text="Resend code"
            onPress={onSResendPressed}
            type = "SECONDARY"
            />
            <CustomButton
            text="Back to Sign in"
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

export default ConfirmEmailScreen
