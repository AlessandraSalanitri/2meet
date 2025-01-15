import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyADNxzJ2JwKli9bwcTPh4LhoWriyYzvQeQ",
  authDomain: "hittastic-qho640.firebaseapp.com",
  databaseURL: "https://hittastic-qho640-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hittastic-qho640",
  storageBucket: "hittastic-qho640.firebasestorage.app",
  messagingSenderId: "661271259588",
  appId: "1:661271259588:web:cd8f27f709c5061cf61c91",
  measurementId: "G-KKCSDJWLB5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export { auth, db };