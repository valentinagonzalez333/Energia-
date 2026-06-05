import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

function registrar() {
  const user = document.getElementById("usuario").value.trim();
  const pass = document.getElementById("contrasena").value;
  const confirmar = document.getElementById("confirmar").value;
  const errorMsg = document.getElementById("error-msg");

  if (!user || !pass || !confirmar) {
    errorMsg.textContent = "Completa todos los campos.";
    errorMsg.style.display = "block";
    return;
  }

  if (pass !== confirmar) {
    errorMsg.textContent = "Las contraseñas no coinciden.";
    errorMsg.style.display = "block";
    return;
  }

  if (pass.length < 6) {
    errorMsg.textContent = "La contraseña debe tener al menos 6 caracteres.";
    errorMsg.style.display = "block";
    return;
  }

  createUserWithEmailAndPassword(auth, user, pass)
    .then((cred) => {
      return setDoc(doc(db, "usuarios", cred.user.uid), {
        email: user,
        uid: cred.user.uid,
      });
    })
    .then(() => {
      alert("Cuenta creada exitosamente.");
      window.location.href = "login.html";
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        errorMsg.textContent = "Ese correo ya está registrado.";
      } else if (error.code === "auth/invalid-email") {
        errorMsg.textContent = "El usuario debe ser un correo válido.";
      } else {
        errorMsg.textContent = "Error al registrar. Intenta de nuevo.";
      }
      errorMsg.style.display = "block";
    });
}

window.registrar = registrar;
