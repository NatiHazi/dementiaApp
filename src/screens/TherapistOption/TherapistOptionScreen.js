import React,{useState} from 'react';
import { View,Image,Text ,ScrollView,StyleSheet} from 'react-native';
import CustomButtonForTherapistScreen from '../../components/CustomButtonForTherapistScreen';
import { useNavigation } from '@react-navigation/native';

const TherapistOptionScreen = () => {
     const navigation = useNavigation();
    const onTherapistPressed = () =>{
        navigation.navigate("signIn");
    };
    // const onPatientPressed = () =>{
    //     navigation.navigate("signIn");
    // };
    return (
        <ScrollView>
        <View style={styles.root}>
            <Text style={styles.title} >DementiaApp  </Text>
            <Text style={styles.text} > </Text>
            <CustomButtonForTherapistScreen text="Find Patient" onPress={onTherapistPressed}/> 
            <CustomButtonForTherapistScreen text="Patient's Call" onPress={onTherapistPressed}/> 
            <CustomButtonForTherapistScreen text="Patient's Mesege" onPress={onTherapistPressed}/> 
            <CustomButtonForTherapistScreen text="Patient" onPress={onTherapistPressed}/> 
            <CustomButtonForTherapistScreen text="Therapist" onPress={onTherapistPressed}/> 
            <CustomButtonForTherapistScreen text="Patient" onPress={onTherapistPressed}/> 
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


export default TherapistOptionScreen