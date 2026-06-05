import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAscuQusBvEftlMKHygLj-IX-fyit8XKfk",
  authDomain: "energia-voltix.firebaseapp.com",
  projectId: "energia-voltix",
  storageBucket: "energia-voltix.firebasestorage.app",
  messagingSenderId: "427085548356",
  appId: "1:427085548356:web:2dd5922769dbd24bcca511",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
