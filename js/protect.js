if (sessionStorage.getItem("sesion") !== "activa") {
  window.location.replace("login.html");
}

window.addEventListener("pageshow", function(e) {
  if (e.persisted || sessionStorage.getItem("sesion") !== "activa") {
    window.location.replace("login.html");
  }
});

function cerrarSesion() {
  sessionStorage.removeItem("sesion");
  window.location.replace("login.html");
}