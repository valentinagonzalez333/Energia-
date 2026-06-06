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
    if (snapshot.empty) {
      sinUsuarios.style.display = "block";
    } else {
      sinUsuarios.style.display = "none";
      let i = 1;
      snapshot.forEach((doc) => {
        const data = doc.data();
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${i}</td>
            <td>${data.email}</td>
            <td>${data.fechaRegistro || "Sin fecha"}</td>
        `;
        lista.appendChild(fila);
        i++;
      });
      document.getElementById("total-usuarios").textContent =
        `${snapshot.size} usuario${snapshot.size !== 1 ? "s" : ""}`;
    }
  }
});
const hamburguesa = document.getElementById("hamburguesa");
const menu = document.querySelector(".menu");

hamburguesa.addEventListener("click", () => {
    menu.classList.toggle("abierto");
});
