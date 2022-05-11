
import React from 'react';
import {SafeAreaView, StyleSheet,TouchableWithoutFeedback, Keyboard,View } from 'react-native';
import Navigation from './src/navigation';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);


const App = () => {
  return (
    <TouchableWithoutFeedback onPress={() => { // dismiss the keyboard
      Keyboard.dismiss(); 
    }}>
      <View style={styles.root}>  
        <Navigation/>
      </View>
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