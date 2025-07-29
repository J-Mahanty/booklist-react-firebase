import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-OamP8DMXuConHduypWCtcvbynqiWrTc",
  authDomain: "fir-book-list-ed0e4.firebaseapp.com",
  projectId: "fir-book-list-ed0e4",
  storageBucket: "fir-book-list-ed0e4.firebasestorage.app",
  messagingSenderId: "458279618982",
  appId: "1:458279618982:web:72fe7c0a1591fe111fa767"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);