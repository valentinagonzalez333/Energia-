import { auth, db } from "./firebase.js";
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.replace("login.html");
    }
});

window.addEventListener("pageshow", function(e) {
    if (e.persisted) {
        onAuthStateChanged(auth, (user) => {
            if (!user) window.location.replace("login.html");
        });
    }
});