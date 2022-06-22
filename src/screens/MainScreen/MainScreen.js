import React,{useState,useEffect} from 'react';
import { View,Image,Text ,ScrollView,StyleSheet,Modal,Pressable,BackHandler} from 'react-native';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';



const MainScreeen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();
    const onTherapistPressed = () =>{
        navigation.navigate("signIn",{
            isTherapist: true});
    };
    const backAction = () => {
      navigation.navigate("MainScreen");
      return true;
    };
    useEffect(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
  
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, []);
    const onPatientPressed = () =>{
        navigation.navigate("signIn", {isTherapist: false});
    };
    
    return (
        <ScrollView>
        <View style={styles.root}>
        <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Icon style={styles.icon} name="close"
                      onPress={() => setModalVisible(!modalVisible)}
                      />
                      <Text style={styles.modalText}>מידע תפעולי</Text>
                      <Text style={styles.TextInfo}>- משתמש מטופל חייב להרשם ולהתחבר ראשון למערכת.</Text>
                      <Text style={styles.TextInfo}>- יש לוודא הכנסה תקינה של אימייל ומספרי טלפון.</Text>
                      <Text style={styles.TextInfo}>- אנא וודא מתן הרשאות, במידה ואינך מאשר הרשאות האפליקציה לא תפעל כראוי.</Text>
                      <Text style={styles.TextInfo}>- בכדי לקבל מידע אמין המשתמשים חייבים להשאיר את האפליקציה מחוברת ברקע, השירות לא יתאפשר אם האפליקצייה תהיה סגורה.</Text>
                    </View>
                  </View>
                </Modal>
                <Pressable
                  style={styles.iconSec}
                  onPress={() => setModalVisible(true)}
                >
                    
                 <Icon style={styles.iconSec} 
                name="information-circle-outline" />
                </Pressable>
        
              
            
            <Text style={styles.title} >DementiaApp  </Text>
            <Image style={styles.logo} source={require('../../../assets/logo.jpg')}/>
            <Text style={styles.text} >  </Text>
            <Text style={styles.text} >התחברות</Text>
            <CustomButton text="התחבר כמטפל" onPress={()=>onTherapistPressed()}/> 
            <CustomButton text="התחבר כמטופל" onPress={()=>onPatientPressed()}/> 
        </View>
        </ScrollView>
    );
        
       
};

const styles = StyleSheet.create({
    root:{
        alignItems:'center',
        backgroundColor:'snow',
        padding: 50,
        
    },
    title:{
        fontSize: 36,
        fontWeight:'bold',
        color:'#051C60',
        margin: 10,
    },
    text:{
        flex: 1,
        fontStyle:'normal',
        fontWeight:'bold',
        fontSize: 22,
        textAlign:'center',
        color:'#051C60',
        margin: 10,
    },
    logo: {
        
        width:300,
        height:300,
    },
    icon:{
        alignSelf: "flex-start",
        padding:5,
        fontSize:20
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "#F0F8FF",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontWeight:'bold',
        fontSize: 24,
      },
    TextInfo:{
        marginBottom: 15,
        fontSize: 18,
        alignSelf: "flex-start",
      },
    iconSec: {
       // marginBottom: 6,
      //  marginTop:10,
       
        fontSize: 25,
        alignSelf: "flex-start",
      },
})


export default MainScreeen