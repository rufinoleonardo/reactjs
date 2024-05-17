// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDyZpZLq4vuDGOOwYuiEnf_NzqfiJlXUDA",
    authDomain: "webcarros-b9ad1.firebaseapp.com",
    projectId: "webcarros-b9ad1",
    storageBucket: "webcarros-b9ad1.appspot.com",
    messagingSenderId: "130246563993",
    appId: "1:130246563993:web:fe3228fdf7f40d6a060008"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
