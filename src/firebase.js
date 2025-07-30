// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAD7wp11CInWXwfl_QJCdpg3nFai4R7_Aw",
  authDomain: "e-learning-9dd87.firebaseapp.com",
  projectId: "e-learning-9dd87",
  storageBucket: "e-learning-9dd87.appspot.com",
  messagingSenderId: "639253705327",
  appId: "1:639253705327:web:ceee59c9b7b1eefe68d39a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
