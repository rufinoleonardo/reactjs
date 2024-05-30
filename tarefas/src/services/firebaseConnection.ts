import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBKLbOWX3Mhq-RSkx9aBhND8qdTyt3E97s",
    authDomain: "tarefas-plus-497b8.firebaseapp.com",
    projectId: "tarefas-plus-497b8",
    storageBucket: "tarefas-plus-497b8.appspot.com",
    messagingSenderId: "330224149260",
    appId: "1:330224149260:web:7eacbb9d56037528ed5f29"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { db };