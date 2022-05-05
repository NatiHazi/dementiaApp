import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';
import ForgotPasswordSceen from '../screens/ForgotPasswordSceen';
import ConfirmEmailScreen from '../screens/ConfirmEmailScreen';
import MainScreen from '../screens/MainScreen';
import TherapistOption from '../screens/TherapistOption';
import UseLocation from '../location/useLocation'
import PatientOption from '../screens/PatientOption';
import SendNotification from '../screens/SendNotification/SendNotification';
import ShowLogCall from '../screens/ShowCallLogPage/ShowCallLogPage';
import ShowSMSLog from '../screens/ShowSMSLogPage/ShowSMSLogPage';
import FirstScreen from '../screens/FirstScreen/FirstScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();


const MyDrawer = () => {
    return (
        <Drawer.Navigator>
          <Drawer.Screen name="DementiaApp" component={TherapistOption} />
          <Drawer.Screen name="MainScreen" component={MainScreen} />
          <Drawer.Screen name="Forgot Password" component={ForgotPasswordSceen} />
        </Drawer.Navigator>
     
    );
  }

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="FirstScreen" component={FirstScreen}/>
                <Stack.Screen name="MainScreen" component={MainScreen}/>
                <Stack.Screen name="TherapistScreen" component={MyDrawer}/>
                <Stack.Screen name="signIn" component={SignInScreen}/>
                <Stack.Screen name="signUn" component={SignUpScreen}/>
                <Stack.Screen name="NewPassword" component={NewPasswordScreen}/>
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordSceen}/>
                <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen}/>
                <Stack.Screen name="UserLocation" component={UseLocation}/>
                <Stack.Screen name="PatientScreen" component={PatientOption}/>
                <Stack.Screen name="SendNotification" component={SendNotification}/>
                <Stack.Screen name="ShowCallLogPage" component={ShowLogCall}/>
                <Stack.Screen name="ShowSMSLogPage" component={ShowSMSLog}/>
                
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation
