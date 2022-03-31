import React from 'react'
import { View, Text, TextInput, StyleSheet,I18nManager } from 'react-native'


const CustomInput = ({value, setValue, placeholder,secureTextEntry}) => {
  
    return (
      
        <View style={styles.container}>
            
        
            <TextInput           
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            style={styles.input}
            secureTextEntry={secureTextEntry}
            />
          
            
        </View>
    );
};

const styles = StyleSheet.create({
 
    container: {
        backgroundColor: 'white',
        width: '100%',
        height:50,
        writingDirection: 'rtl',
        borderColor: '#e8e8e8',
        borderWidth:1,
        borderRadius:5,
        padding:15,
        marginVertical: 5,
        flexDirection:'row',
    },

   
})

export default CustomInput
