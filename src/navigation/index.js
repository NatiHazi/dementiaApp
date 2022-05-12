import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ConfirmEmailScreen from '../screens/ConfirmEmailScreen';
import MainScreen from '../screens/MainScreen';
import TherapistOption from '../screens/TherapistOption';
import UseLocation from '../location/useLocation'
import PatientOption from '../screens/PatientOption';
import SendNotification from '../screens/SendNotification/SendNotification';
import ShowLogCall from '../screens/ShowCallLogPage/ShowCallLogPage';
import ShowSMSLog from '../screens/ShowSMSLogPage/ShowSMSLogPage';
import FirstScreen from '../screens/FirstScreen/FirstScreen';
import AccountSettingScreen from '../screens/AccountSettingScreen/AccountSettingScreen'
import { createDrawerNavigator } from '@react-navigation/drawer';
import auth from '@react-native-firebase/auth';
import {DrawerContent} from '../screens/DrawerContent';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();


const MyDrawer = () => {
    return (
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
          <Drawer.Screen name="DementiaApp" component={TherapistOption} />
        </Drawer.Navigator>
     
    );
  }

const Navigation = () => {
    return (
        <NavigationContainer style = {{flex:1}}>
            <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="FirstScreen" component={FirstScreen}/>
                <Stack.Screen name="MainScreen" component={MainScreen}/>
                <Stack.Screen name="TherapistScreen" component={MyDrawer} />
                <Stack.Screen name="signIn" component={SignInScreen}/>
                <Stack.Screen name="signUn" component={SignUpScreen}/>
                <Stack.Screen name="NewPassword" component={NewPasswordScreen}/>
                <Stack.Screen name="AccountSettingScreen" component={AccountSettingScreen}/>
                <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen}/>
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
