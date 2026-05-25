function loguear() {
  let user = document.getElementById("usuario").value;
  let pass = document.getElementById("contrasena").value;

  if (user === "admin" && pass === "1234") {
    sessionStorage.setItem("sesion", "activa");
    window.location.href = "panel.html";
  } else {
    alert("Usuario o contraseña incorrectos");
  }
}