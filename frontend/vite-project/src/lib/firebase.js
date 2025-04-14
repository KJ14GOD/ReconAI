// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJ7udTShHkLDbhQx_ayR1rL7YFzcvGqlM",
  authDomain: "reconai-39f71.firebaseapp.com",
  projectId: "reconai-39f71",
  storageBucket: "reconai-39f71.firebasestorage.app",
  messagingSenderId: "513877880801",
  appId: "1:513877880801:web:ac2961156c8a6bc1f62ca0",
  measurementId: "G-7PZXX9BGY5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export{auth}