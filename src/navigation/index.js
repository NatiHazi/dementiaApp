import React from 'react'
import { View, Text } from 'react-native'
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
import SendNotification from '../screens/SendNotification/SendNotification'

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="MainScreen" component={MainScreen}/>
                <Stack.Screen name="TherapistScreen" component={TherapistOption}/>
                <Stack.Screen name="signIn" component={SignInScreen}/>
                <Stack.Screen name="signUn" component={SignUpScreen}/>
                <Stack.Screen name="NewPassword" component={NewPasswordScreen}/>
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordSceen}/>
                <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen}/>
                <Stack.Screen name="UserLocation" component={UseLocation}/>
                <Stack.Screen name="PatientScreen" component={PatientOption}/>
                <Stack.Screen name="SendNotification" component={SendNotification}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation
