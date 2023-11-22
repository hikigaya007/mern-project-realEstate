// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-4dd9b.firebaseapp.com",
  projectId: "mern-estate-4dd9b",
  storageBucket: "mern-estate-4dd9b.appspot.com",
  messagingSenderId: "1054553250055",
  appId: "1:1054553250055:web:724f5a914d0cad8c520da2"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);