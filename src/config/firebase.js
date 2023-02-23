// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore/lite'
import { getStorage } from 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCg1VUjKo-48e20iiXK5escazGh02M5dO0",
    authDomain: "todo-app-272.firebaseapp.com",
    projectId: "todo-app-272",
    storageBucket: "todo-app-272.appspot.com",
    messagingSenderId: "457708183519",
    appId: "1:457708183519:web:bad72fa844bb8cb3faae6a",
    measurementId: "G-WENWWJCX8W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { analytics, auth, firestore, storage };