import React,{useState} from 'react';
import { View, Text, StyleSheet, useWindowDimensions,ScrollView} from 'react-native';
import CustomInput from '../../components/CutomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native'


const ConfirmEmailScreen = () => {
    const [userName, setUserName] = useState('');

    const navigation = useNavigation();

    const onSendPressed = () =>{
        navigation.navigate("NewPassword");
    };

    const onSignInPressed = () => {
        navigation.navigate("signIn");
    };



    return (
        <ScrollView>
        <View style={styles.root}>
            <Text style={styles.title} >Reset your password  </Text>

             <CustomInput
              placeholder="user name"
              value={userName} 
              setValue={setUserName}
              />
          
             
            <CustomButton text="Send" onPress={onSendPressed}/>

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
