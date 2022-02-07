
import React from 'react';
import {SafeAreaView, StyleSheet,TouchableWithoutFeedback, Keyboard } from 'react-native';
import Navigation from './src/navigation';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);


const App = () => {
  return (
    <TouchableWithoutFeedback onPress={() => { // dismiss the keyboard
      Keyboard.dismiss(); 
    }}>
      <SafeAreaView style={styles.root}>  
        <Navigation/>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor:'snow',
  },
});

export default App;