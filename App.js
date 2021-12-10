import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View,TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TouchableNativeFeedback } from 'react-native-web';
import HomeScreen from './screens/homeScreen';

export default function App() {

  return (
    <TouchableWithoutFeedback onPress={() => { // dismiss the keyboard
      Keyboard.dismiss(); 
    }}>
      <View style={styles.container}>  
        <HomeScreen/>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
