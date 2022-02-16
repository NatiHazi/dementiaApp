import React from 'react'
import { View, Text, StyleSheet, Pressable,TouchableHighlight } from 'react-native'

const CustomButtonForTherapistScreen = ({ onPress, text}) => {
    return (
        <TouchableHighlight
        underlayColor="#DDDDDD"
        onPress={onPress} style={styles.container}>
            <Text style={[styles.text]}>{text}</Text>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#3B71F3',
        padding: 20,
        height: 60,
        width:'60%',
        flexDirection:'row',
        padding:20,
        marginVertical:10,
        borderRadius:10,
        justifyContent: 'space-evenly' 
    },

    text:{
        fontWeight: 'bold',
        color:'white',
    },
    
  

    
});

export default CustomButtonForTherapistScreen
