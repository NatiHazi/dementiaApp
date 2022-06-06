import React,{useEffect,useState} from 'react';
import { View, StyleSheet } from 'react-native';
import {useTheme,Avatar,Title,Caption,Paragraph,Drawer,Text,TouchableRipple,Switch} from 'react-native-paper';
import {DrawerContentScrollView,DrawerItem} from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import { getUserNameDrawer } from '../utils/firebase';

export function DrawerContent(props) {
  const [user, setUser] = useState();
  const [initializing, setInitializing] = useState(true);
  const [userNameFirebase, setUserNameFirebase]=useState('');
  
  const navigation = useNavigation();

  useEffect(
    () => {
      subscriber=auth().onAuthStateChanged(onAuthStateChanged);  
     if(user){
      getUserNameDrawer(user.uid).then((result)=>{
        if (result)
        setUserNameFirebase(result);
      })
     }
     
     return () => subscriber;
    },
    [user]
  );

    const signOutFunction = () =>{
      
        auth()
        .signOut()
        .then(() => {
          storeData([['userkey', ''],['passkey', '']]);
         
        
        });
    
    }

    const storeData = async (value) => {
      try {
        await AsyncStorage.multiSet(value)
        navigation.navigate("MainScreen");
        //getData();
      } catch (e) {
        // saving error
      }
    }

    function onAuthStateChanged(user) {
      setUser(user);
      if (initializing) setInitializing(false);
    }

    return(
        <View style={{flex:1}}>
            
        <DrawerContentScrollView {...props}>
            <View style={styles.drawerContent}>
                <View style={styles.userInfoSection}>
                    <View style={{flexDirection:'row',marginTop: 15}}>  
                    <Avatar.Image 
                                source={{
                                    uri: 'https://iconape.com/wp-content/files/qe/12301/png/user-tie.png'
                                }}
                                size={50}
                            />
                            <View style={{marginLeft:15, flexDirection:'column'}}>
                                <Title style={styles.title}>{userNameFirebase}</Title>
                                <Caption style={styles.caption}>מטפל</Caption>
                            </View>
                    </View>
                </View>
            </View>
                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="key-outline"
                                color={color}
                                size={size}
                                />
                            )}
                            label="שינוי סיסמא"
                            onPress={() => {props.navigation.navigate('ForgotPassword',{ isTherapist: true })}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="newspaper-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="הגדרות חשבון"
                            onPress={() => {props.navigation.navigate('AccountSettingScreen')}}
                        />

                    </Drawer.Section>
            
        </DrawerContentScrollView>


        <Drawer.Section style={styles.bottomDrawerSection}>
         <DrawerItem 
             icon={({color, size}) => (
                 <Icon 
                 name="log-out" 
                 color={color}
                 size={size}
                 />
             )}
             label="התנתקות"
             onPress={() => {signOutFunction()}}
         />
     </Drawer.Section>
        </View>      
      
    );
}


const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 10,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1,
        
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });