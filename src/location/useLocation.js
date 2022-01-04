import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import openMap from 'react-native-open-maps';

export default function UseLocation() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    // text = JSON.stringify(location);
    openMap({ latitude: location.coords.latitude, longitude: location.coords.longitude });
  }

  return (
    <View style={styles.container}>
      {/* <Text>{text}</Text> */}
    </View>
  );
}
const styles = StyleSheet.create({ container:{
    flex: 1
}}); 