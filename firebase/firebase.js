// the firebase file used to configurate the firebase stuff

//Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

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
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const authentication = getAuth(app);

const resetPassword = sendPasswordResetEmail;

const storage = getStorage();
const storageRef = ref(storage);

export { db, authentication, storageRef, resetPassword };
