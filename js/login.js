import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

function loguear() {
    const user = document.getElementById("usuario").value.trim();
    const pass = document.getElementById("contrasena").value;

    signInWithEmailAndPassword(auth, user, pass)
        .then(() => {
            window.location.href = "panel.html";
        })
        .catch(() => {
            alert("Usuario o contraseña incorrectos.");
        });
}

window.loguear = loguear;