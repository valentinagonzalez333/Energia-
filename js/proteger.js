import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

export function proteger() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.replace("login.html");
    }
  });

  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      onAuthStateChanged(auth, (user) => {
        if (!user) window.location.replace("login.html");
      });
    }
  });
}

export function cerrarSesion() {
    import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js")
        .then(({ signOut }) => signOut(auth))
        .then(() => {
            sessionStorage.removeItem("voltix-chat");
            window.location.replace("login.html");
        });
}

window.cerrarSesion = cerrarSesion;
