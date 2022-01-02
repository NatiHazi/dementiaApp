import React,{useState} from 'react';
import { View, Text, StyleSheet, useWindowDimensions,ScrollView} from 'react-native';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native'
const ConfirmEmailScreen = () => {

    const navigation = useNavigation();

    const onConfirmPressed = () =>{
        navigation.navigate("signIn");
    };
    return (
        <ScrollView>
        <View style={styles.root}>
            <Text style={styles.title} >Confirm your email  </Text>
            <Text style={styles.text} >  </Text>
            <Text style={styles.text} >Please go to your email and Confirm your account  </Text>
            <Text style={styles.text} >  </Text>
            <CustomButton text="Got it" onPress={onConfirmPressed}/> 
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
        flex: 1,
        fontStyle:'normal',
        fontSize: 22,
        textAlign:'center',
        color:'#051C60',
        margin: 10,
    },
})

export default ConfirmEmailScreen
