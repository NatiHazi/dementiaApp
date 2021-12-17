import React,{useState} from 'react';
import { View, Text, StyleSheet, useWindowDimensions,ScrollView} from 'react-native';
import CustomInput from '../../components/CutomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native'


const SignUpScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');

    const navigation = useNavigation();

    const onRegisterPressed = () =>{
        navigation.navigate("ConfirmEmail");
    };

    const onSignInPressed = () => {
        navigation.navigate("signIn");
    };

    const onTermOfUsePressed = () => {
        console.warn("onSignUpPressed");
    };
    const onPrivacyPressed = () => {
        console.warn("onPrivacyPressed");
    };

    return (
        <ScrollView>
        <View style={styles.root}>
            <Text style={styles.title} >Create an account </Text>

             <CustomInput
              placeholder="UserName"
              value={username} 
              setValue={setUsername}
              secureTextEntry={false}
              />
              <CustomInput
              placeholder="Email"
              value={email} 
              setValue={setEmail}
              secureTextEntry={false}
              />
             <CustomInput
              placeholder="Password"
              value={password}
              setValue={setPassword} 
              secureTextEntry
              />
              <CustomInput
              placeholder="Password Repeat"
              value={passwordRepeat}
              setValue={setPasswordRepeat} 
              secureTextEntry
              />

            <CustomButton text="Register" onPress={onRegisterPressed}/>

            <Text style={styles.text}>
                By registering, you confirm that you accept our 
                <Text styles={styles.link} onPress={onTermOfUsePressed} > Term of Use</Text> and 
                <Text styles={styles.link} onPress={onPrivacyPressed} > Privacy Policy</Text>
            </Text>

            <CustomButton
            text="Have have an account? Sign in"
            onPress={onSignInPressed}
            type = "TER"
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

export default SignUpScreen
