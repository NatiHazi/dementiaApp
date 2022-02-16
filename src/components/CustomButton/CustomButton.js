import React from 'react'
import { View, Text, StyleSheet, Pressable,TouchableHighlight } from 'react-native'

const CustomButton = ({ onPress, text, type = "PRIMARY" }) => {
    return (
        <TouchableHighlight
        underlayColor="#DDDDDD"
        onPress={onPress} style={[styles.container, styles[`container_${type}`]]}>
          <Text style={[styles.text, styles[`text_${type}`]]}>{text}</Text>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    container:{
        width:'100%',
        padding:15,
        marginVertical:5,
        alignItems: 'center',
        borderRadius:5,
    },

    container_PRIMARY:{
        backgroundColor:'#3B71F3',
    },

    container_SECONDARY:{
        borderColor:'#3B71F3',
        borderWidth:2,
    },

    text:{
        fontWeight: 'bold',
        color:'white',
    },

    text_TERTIARY:{
        color:'gray',
        
    },
    text_TER:{
        color:'gray',
    },
    text_SECONDARY:{
        color:'#3B71F3',
    },
    text_SIGNOUT:{
        color:'gray',
        width:'100%',
        alignItems: 'flex-start',
     
    },
    
});

export default CustomButton
