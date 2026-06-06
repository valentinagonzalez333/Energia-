import { auth, db } from "./firebase.js";
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { proteger, cerrarSesion } from "./proteger.js";

proteger();
window.cerrarSesion = cerrarSesion;

const lista = document.getElementById("lista-usuarios");
const sinUsuarios = document.getElementById("sin-usuarios");

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const snapshot = await getDocs(collection(db, "usuarios"));

  if (snapshot.empty) {
    sinUsuarios.style.display = "block";
  } else {
    sinUsuarios.style.display = "none";
    let i = 1;
    snapshot.forEach((doc) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `<td>${i}</td><td>${doc.data().email}</td>`;
      lista.appendChild(fila);
      i++;
    });
  }
});
