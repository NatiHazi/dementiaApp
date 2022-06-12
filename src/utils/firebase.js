import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';


const SUCCESS="success";
const FAILURE="fail";
//########################################################################
const sendPasswordResetEmailHandler = async (userName) =>{
    console.log("sajkfjkasf");
    //const {isTherapist, userName} = routes.params;
    console.log("username", userName);
   const result = auth().sendPasswordResetEmail(userName)
   .then(function() {
   // Email sent.
   console.log("Password reset email sent! ");
   alert("אנא הכנס למייל ובחר סיסמא חדשה בלינק שישלח לך");
   //navigation.navigate("signIn", {isTherapist: isTherapist});
   return SUCCESS;
   })
   .catch(function(error) {
   // An error happened.
   const errorCode = error.code;
   const errorMessage = error.message;
   if (errorCode==='auth/invalid-email')
   alert("מייל לא חוקי");
   console.log(errorCode)
   return FAILURE;
   });
   return result;
};
// export default sendPasswordResetEmailHandler;


//########################################################################
    const createUserWithEmailAndPasswordHandler = async (email,password) => {
    const result = auth()
    .createUserWithEmailAndPassword(email,password)
    .then((userCredential) => {
    console.log('User account created & signed in!');
    userCredential.user.sendEmailVerification();

    alert('נשלח לך מייל אימות על מנת להפעיל את המשתמש');
    return userCredential.user;
    })
    .catch(error => {
    if (error.code === 'auth/email-already-in-use') {
      alert('מייל זה נמצא כבר בשימוש במערכת');
    }

    if (error.code === 'auth/invalid-email') {
      alert('מייל זה לא חוקי');;
    }
    if (error.code === 'The email address is badly formatted'){
      alert ("הפורמט של המייל לא תקין");
    }
    if (error.code === 'auth/weak-password'){
      alert ("הסיסמא חייבת להכיל לפחות שישה תווים");
    }
    console.log(error.code);
    console.error(error);
    return FAILURE;
    });
    return result;
    };


//########################################################################
    const getPatientLocationFromServer = async (patientId) => {
        console.log("line 68 in firebase : ", patientId);
    const result=firestore()
    .collection('users')
    .doc(patientId)
    .get()
    .then(documentSnapshot => {
    if (documentSnapshot.exists) {
        let patinetlat = documentSnapshot.data().latitude;
        let patientlong= documentSnapshot.data().longitude;
        console.log("patientlat: ", patinetlat)
        console.log("patientlong: ", patientlong)
       return [patinetlat, patientlong];
        //openMap({ latitude: patinetlat, longitude: patientlong, zoom: 20,provide:'google'});

     
    }
    else{
        return "fail";
    }
    });
    return result;
};

//##################33
const createNewDocumentForUser = async (user, isTherapist, yourNum, otherSideNum, username, patientMail) =>{
  let objToPut, mailString, theMail;
  if (patientMail){
    mailString='patientMail';
    theMail=patientMail;
  }
  else{
    mailString='myMail';
    theMail=user.email;
  }
  objToPut={
    id:  user.uid,
    isTherapist:isTherapist,
    myNum: yourNum,
    otherSidePhoneNum: otherSideNum,
    userName: username,
    [mailString]: theMail
  }
    firestore()
    .collection('users')
    .doc(user.uid)
    .set(objToPut)
    .then(() => {
        console.log('User added!');
    });
};
//########################

const findOtherSideIdFirebase = async (uid) =>{
    const result=firestore()
    .collection('users')
    .doc(uid)
    .get()
    .then(documentSnapshot => {
    console.log('User exists: ', documentSnapshot.exists);
    if (documentSnapshot.exists) {
     // console.log('User data: ', documentSnapshot.data());
     let email='';
    if (!documentSnapshot.data().isTherapist){
      email=documentSnapshot.data().myMail;
      const result2=firestore()
      .collection('users')
      // Filter results
      .where('patientMail', '==', email)
      .get()
      .then(querySnapshot => {
        /* ... */
        let returnIDandPhones=[];
       querySnapshot.forEach(doc=>{
        //console.log(" LI NE 144 FIRE BASE: ", doc.data().patientMail, "\n", doc.data().myNum)
        returnIDandPhones.push([doc.data().id, doc.data().myNum]);
       })
       //console.log(" LINE 148 FIRE BASE : ",returnIDandPhones)
       return returnIDandPhones;
      });
      return result2;
    }
    else{
      email=documentSnapshot.data().patientMail;
      const result2=firestore()
      .collection('users')
      // Filter results
      .where('myMail', '==', email)
      .get()
      .then(querySnapshot => {
        /* ... */
        let returnIDandPhones=[];
       querySnapshot.forEach(doc=>{
        //console.log(" LI NE 144 FIRE BASE: ", doc.data().patientMail, "\n", doc.data().myNum)
        returnIDandPhones.push([doc.data().id, doc.data().myNum]);
       })
       //console.log(" LINE 148 FIRE BASE : ",returnIDandPhones)
       return returnIDandPhones;
      });
      return result2;
    }
    
     }
  });
  
  return result;
  
};
//###########

const updateColorAfterReadFirebase = async (theColorArtibute,uid) =>{

    firestore()
  .collection('users')
  .doc(uid)
  .update({
    // [toUpdateField]: "grey",
    [theColorArtibute]: "#3B71F3",
  })
  .then(() => {
    console.log('User updated!');
  });

}
//#######################
const getPatientBatteryStatus = async (patientID) =>{
   const result = firestore()
    .collection('users')
    .doc(patientID)
    .get()
    .then(documentSnapshot => {
      console.log('User exists: ', documentSnapshot.exists);
  
      if (documentSnapshot.exists) {
        console.log('User data: ', documentSnapshot.data());
        const batteryPatient=documentSnapshot.data().battery;
        return batteryPatient;
       
      }
    }).catch((error)=>{
        console.log("error from 181 in firebase");
        return FAILURE;
    });
    return result;
};
//###############
const setBackgroundInFirebase = async(uid,patientID) =>{

            (async()=>{
              try{
               const result = await launchImageLibrary();
             console.log("LINE 189: ", result.assets[0].uri);
             const pathToFile=result.assets[0].uri;
             const reference = storage().ref(`${patientID}/image-for-background.png`);
             try{
             await reference.putFile(pathToFile);
             firestore()
             .collection('users')
             .doc(uid)
             .update({
               setBackground: true,
             })
             .then(() => {
             console.log('User updated!');
             });
             }
             catch(error){
               console.log(error);
             }
           } catch(error){
             console.log("error get image : ", error);
           }
             })();
   
    
};
//##################3
const updateDataInFirebase = async (uid, objUpdate) =>{
   const result= firestore()
    .collection('users')
    .doc(uid)
    .update(objUpdate)
    .then(() => {
      console.log('User updated!');
      return SUCCESS;
    });
    return result;
};
//#########

const getFirebaseTokenMessage = async (uid) =>{
    firebase.messaging().getToken()
    .then(fcmToken => {
    if (fcmToken) {
  
    //console.log("gabi yexxxxssss",fcmToken);
        updateDataInFirebase(uid,{pushToken:fcmToken});
    // user has a device token
  } else {
    console.log("no token message");
    // user doesn't have a device token yet
  } 
  });
};
//###############
const signInFirebase = async (username, password) =>{
  const result=auth().signInWithEmailAndPassword(username, password)
  .then((userCredential) => {
  const user = userCredential.user;
  const uid = user.uid;
  if (!user.emailVerified){
      alert("you must verify your account in your mail");
      return FAILURE;

  }
  else{
      console.log("log in succeed");
        const result2= firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then(documentSnapshot => {
    
        if (documentSnapshot.exists) {
          return documentSnapshot.data().isTherapist;
        }
      });
      return result2;
        
      
  
 
  }
})
.catch((error) => {
  const errorCode = error.code;
  const errorMessage = error.message;
  console.log(errorCode)
 
  if (errorCode ==="auth/invalid-email"){
      alert("invalid email")
  }
  if (errorCode ==="auth/user-not-found"){
      alert("User not existing in the system")
  }
  if (errorCode ==="auth/wrong-password"){
      alert("wrong password")
  }
  return FAILURE;
  
});
return result;
};
//###############################################3
const getPatientCallsFirebase = async (patiendId) =>{
   const result = firestore()
    .collection('users')
    .doc(patiendId)
    .get()
    .then(documentSnapshot => {
    
      if (documentSnapshot.exists) {
        return documentSnapshot.data().unknown_calls;
      
      }
    });
    return result;
};
//#################3
const getPatientSmsFirebase = async (patiendId) =>{
  const result = firestore()
   .collection('users')
   .doc(patiendId)
   .get()
   .then(documentSnapshot => {
   
     if (documentSnapshot.exists) {
       return documentSnapshot.data().List_SMS;
     
     }
   });
   return result;
};
//#########################3
const getUserNameDrawer = async (uid) =>{
 const result = firestore()
  .collection('users')
  .doc(uid)
  .get()
  .then(documentSnapshot => {
    console.log('User exists: ', documentSnapshot.exists);

    if (documentSnapshot.exists) {
      // setUserNameFirebase(documentSnapshot.data().userName);
      return documentSnapshot.data().userName;
    }
  });
  return result;
};

const getPatientNotification = async (patiendId) =>{
  const result = firestore()
   .collection('users')
   .doc(patiendId)
   .get()
   .then(documentSnapshot => {
   
     if (documentSnapshot.exists) {
       return [documentSnapshot.data().titleNotification, documentSnapshot.data().bodyNotification];
     
     }
   });
   return result;
};



export {sendPasswordResetEmailHandler,
     createUserWithEmailAndPasswordHandler,
     getPatientLocationFromServer,
      createNewDocumentForUser,
      findOtherSideIdFirebase,
      updateColorAfterReadFirebase,
      getPatientBatteryStatus,
      setBackgroundInFirebase,
      updateDataInFirebase,
      getFirebaseTokenMessage,
      signInFirebase,
      getPatientCallsFirebase,
      getPatientSmsFirebase,
      getUserNameDrawer,
      getPatientNotification};