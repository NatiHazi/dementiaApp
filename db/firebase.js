// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore,collection, addDoc,getDocs,doc, updateDoc,setDoc,getDoc, query, where  } from "firebase/firestore";
import {
   getAuth,signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail, onAuthStateChanged   } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-7RT0TdnmSFh4SPOAgP44jkmS2szUBeM",
  authDomain: "dementiaapp-8b292.firebaseapp.com",
  projectId: "dementiaapp-8b292",
  storageBucket: "dementiaapp-8b292.appspot.com",
  messagingSenderId: "436569858334",
  appId: "1:436569858334:web:7315a5e32d6a8ff63d290f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export {getAuth,signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  getFirestore,collection,
   addDoc,
   getDocs,
   doc, updateDoc,onAuthStateChanged,setDoc,getDoc, query, where  };
