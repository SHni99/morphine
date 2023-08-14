// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import firebase from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const db = getFirestore(app);
const db2 = getDatabase(app);

//const authentication = getAuth(app);

const resetPassword = sendPasswordResetEmail;

const authentication = getAuth(app);

export { db, db2, authentication, resetPassword, firebase };
