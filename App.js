import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './screens/homeScreen';

export default function App() {
  return (
     <View style={styles.container}>
    {/* //   <Text>BLABLA lk lk lk lk lk BLALBA!</Text>
    //   <StatusBar style="auto" /> */}
    {/* nnnnn */}
    <HomeScreen/>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
    paddingTop: '10%',
    //height:25,
  },
});
