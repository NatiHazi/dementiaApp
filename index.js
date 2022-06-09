// // /**
// //  * @format
// //  */

// // import {AppRegistry} from 'react-native';
// // import App from './App';
// // import {name as appName} from './app.json';
// // messaging().setBackgroundMessageHandler(async remoteMessage => {
// //     console.log('Message handled in the background!', remoteMessage);
// //   });
// // // AppRegistry.registerComponent(appName, () => App);
// // AppRegistry.registerComponent('main',() => App);
// import 'react-native-gesture-handler';
// import { registerRootComponent } from 'expo';
// import App from './App';
// import messaging from '@react-native-firebase/messaging';
// import { AppRegistry } from 'react-native';

// // registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// // It also ensures that whether you load the app in Expo Go or in a native build,
// // the environment is set up appropriately
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Message handled in the background!', remoteMessage);
//   });
//   AppRegistry.registerComponent('app', () => App);
// registerRootComponent(App);



// // import 'react-native-gesture-handler';
// // import { registerRootComponent } from 'expo';
// // import App from './App';
// // import messaging from '@react-native-firebase/messaging';
// // import { AppRegistry } from 'react-native';

// // // registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// // // It also ensures that whether you load the app in Expo Go or in a native build,
// // // the environment is set up appropriately
// // messaging().setBackgroundMessageHandler(async remoteMessage => {
// //     console.log('Message handled in the background!', remoteMessage);
// //   });
// //   AppRegistry.registerComponent('app', () => App);
// // registerRootComponent(App);



// //@@@@@@@@@@@@@@@@@@@@@@@@@@@

// /**
//  * @format
//  */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Message handled in the background!', remoteMessage);
//   });
// // AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerComponent('main',() => App);
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './App';
import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import PushNotification from "react-native-push-notification";


// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

PushNotification.configure({
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);

  },

});

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
  AppRegistry.registerComponent('app', () => App);
registerRootComponent(App);



// import 'react-native-gesture-handler';
// import { registerRootComponent } from 'expo';
// import App from './App';
// import messaging from '@react-native-firebase/messaging';
// import { AppRegistry } from 'react-native';

// // registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// // It also ensures that whether you load the app in Expo Go or in a native build,
// // the environment is set up appropriately
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Message handled in the background!', remoteMessage);
//   });
//   AppRegistry.registerComponent('app', () => App);
// registerRootComponent(App);
