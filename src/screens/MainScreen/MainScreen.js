import React,{useState} from 'react';
import { View,Image,Text ,ScrollView,StyleSheet} from 'react-native';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';




const MainScreeen = () => {
    const navigation = useNavigation();
    const onTherapistPressed = () =>{
        navigation.navigate("signIn",{
            isTherapist: true});
    };
    const onPatientPressed = () =>{
        navigation.navigate("signIn", {isTherapist: false});
    };
    

    return (
        <ScrollView>
        <View style={styles.root}>
            <Text style={styles.title} >DementiaApp  </Text>
            <Image style={styles.logo} source={require('../../../assets/logo.jpg')}/>
            <Text style={styles.text} >  </Text>
            <Text style={styles.text} >Please login as:  </Text>
            <CustomButton text="Therapist" onPress={()=>onTherapistPressed()}/> 
            <CustomButton text="Patient" onPress={()=>onPatientPressed()}/> 
        </View>
        </ScrollView>
    );
        
       
};

const styles = StyleSheet.create({
    root:{
        alignItems:'center',
        backgroundColor:'snow',
        padding: 20,
    },
    title:{
        fontSize: 36,
        fontWeight:'bold',
        color:'#051C60',
        margin: 10,
    },
    text:{
        flex: 1,
        fontStyle:'normal',
        fontWeight:'bold',
        fontSize: 22,
        textAlign:'center',
        color:'#051C60',
        margin: 10,
    },
    logo: {
        
        width:300,
        height:300,
    },
})


export default MainScreeen