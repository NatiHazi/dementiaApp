import React,{useState} from 'react';
import { View ,Image, StyleSheet, useWindowDimensions,ScrollView} from 'react-native';
import Logo from '../../../assets/logo.jpg';
import CustomInput from '../../components/CutomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';





const SignInScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const{height} = useWindowDimensions();
    const navigation = useNavigation();

    const onSignInPressed = () =>{
        console.warn("Sign In")
    };

    const onForotPasswordPresed = () => {
        navigation.navigate("ForgotPassword");
    };

    const onSignUpPressed = () => {
        navigation.navigate("signUn");
    };

    return (
        <ScrollView>
        <View style={styles.root}>
            <Image
             source={Logo} 
             style={[styles.logo,{height:height * 0.3}]}
             resizeMethod="contain" 
              />
                
             <CustomInput
                iconName = "people"
                iconType = "MaterialIcons"
                placeholder="UserName"
                value={username} 
                setValue={setUsername}
                secureTextEntry={false}
              />
             <CustomInput 
              placeholder="Password"
              value={password}
              setValue={setPassword} 
              secureTextEntry
              />

            <CustomButton text="Sign In" onPress={onSignInPressed}/>

            <CustomButton
            text="Forgot password?"
            onPress={onForotPasswordPresed}
            type = "TERTIARY"
            />

            <CustomButton
            text="Don't have an account? Create one"
            onPress={onSignUpPressed}
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
        backgroundColor:'snow',
    },
    logo: {
        width:'70%',
        maxWidth:500,
        maxHeight:700,
        
        
    },
  
})

export default SignInScreen
