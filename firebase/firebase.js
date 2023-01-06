// the firebase file used to configurate the firebase stuff

//Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import firebase from "firebase/app";
import { getAuth, sendPasswordResetEmail, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getReactNativePersistence } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDH9SMbhwEBF9rRmpaPMHSakGDCtrobFf4",
  authDomain: "morphine-64cdd.firebaseapp.com",
  databaseURL:
    "https://morphine-64cdd-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "morphine-64cdd",
  storageBucket: "morphine-64cdd.appspot.com",
  messagingSenderId: "62142839589",
  appId: "1:62142839589:web:72f3e4e462105c3f5178cc",
  measurementId: "G-73YK78PGYH",
};

//Initialize Firebase

let app;
let authentication;

if (getApps().length < 1) {
  app = initializeApp(firebaseConfig);
  authentication = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  app = getApp();
  authentication = getAuth(app);
}
//const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const db2 = getDatabase(app);

//const authentication = getAuth(app);

const resetPassword = sendPasswordResetEmail;

const storage = getStorage();
const storageRef = ref(storage);

export { db, db2, authentication, storageRef, resetPassword, firebase };
