import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
//import { getFirestore, collection, addDoc, getDocs, setDoc, doc} from "firebase/firestore"; 

// import { getFireStore, collection, addDoc, getDocs } from "firebase/firestore"; 
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgmHsN9_Jyb0pnRjIDDTQI--aDLeGUdE0",
  authDomain: "helplah-42b3f.firebaseapp.com",
  projectId: "helplah-42b3f",
  storageBucket: "helplah-42b3f.appspot.com",
  messagingSenderId: "771156405570",
  appId: "1:771156405570:web:0bb3cfa65994f0963a6cdb",
  measurementId: "G-BRR204D63B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// export default db;
//export default { app, db, getFirestore, collection, addDoc, getDocs, setDoc, doc };
// const analytics = getAnalytics(app);