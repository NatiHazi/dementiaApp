import React,{useState} from 'react';
import { View, Text, StyleSheet, useWindowDimensions,ScrollView,I18nManager} from 'react-native';
import CustomInput from '../../components/CutomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native'



const AccountSettingScreen = () => {
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [user, setUser] = useState();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [otherSideNum, setotherSideNum] = useState('');
    const [yourNum, setYourNum] = useState('');
    const navigation = useNavigation();
    


    return (
        <ScrollView>
        <View style={styles.root}>
        <Text style={styles.title} >עריכת פרטי חשבון</Text>

             <CustomInput
              placeholder=" שם משתמש"
              value={username} 
              setValue={setUsername}
              secureTextEntry={false}
              style={styles.input}
              />
              <CustomInput
              placeholder="מייל"
              value={email} 
              setValue={setEmail}
              secureTextEntry={false}
              style={styles.input}
              />
               <CustomInput
              placeholder="מספר טלפון שלך"
              value={yourNum}
              setValue={setYourNum} 
              secureTextEntry={false}
              style={styles.input}
              />
              <CustomInput
                placeholder="מספר טלפון של המטופל"
              value={otherSideNum}
              setValue={setotherSideNum} 
              secureTextEntry={false}
              style={styles.input}
              />

            <CustomButton text="שמור" />
    
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
        fontSize: 30,
        fontWeight:'bold',
        color:'#051C60',
        margin: 20,
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
