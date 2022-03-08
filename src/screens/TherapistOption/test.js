onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      const db = getFirestore();
      const docRef = doc(db, "users", uid);
      (async ()=>{
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        var currentUserPhoneNum= docSnap.data().myNum
        const q = query(collection(db, "users"), where("otherSidePhoneNum", "==", currentUserPhoneNum));
        let batteryStatus=""
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          batteryStatus=doc.data().battery
          console.log("battery", JSON.stringify({batteryStatus}))
        });
        console.log(batteryStatus)
        Alert.alert(
            "Patient Battery Status",
            batteryStatus,
            [
              
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
          );
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })();  
      // ...
    } else {
        console.log("user is sing out");
      // User is signed out
      // ...
    }
     
  });