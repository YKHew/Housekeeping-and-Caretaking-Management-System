// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
//import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
// import {} from 'firebase/fucntion';
import { getStorage } from 'firebase/storage';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCOtrq8NQuNS0gqCrx1bcf4fGUNwWUqh8Q",
    authDomain: "housekeeping-and-caretaking.firebaseapp.com",
    projectId: "housekeeping-and-caretaking",
    storageBucket: "housekeeping-and-caretaking.appspot.com",
    messagingSenderId: "136044339953",
    appId: "1:136044339953:web:3c369f17b69aa2f2677f50",
    measurementId: "G-PHYG1Y8GKP",

    // The value of `databaseURL` depends on the location of the database
    //databaseURL: "https://housekeeping-and-caretaking-default-rtdb.asia-southeast1.firebasedatabase.app",

};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const FIREBASE_AUTH = getAuth(FIREBASE_APP);
const FIRESTORE_DB = getFirestore(FIREBASE_APP);
const FIREBASE_STORAGE = getStorage(FIREBASE_APP);

export { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB, FIREBASE_STORAGE };
