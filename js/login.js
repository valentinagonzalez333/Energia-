function loguear() {
    const user = document.getElementById("usuario").value.trim();
    const pass = document.getElementById("contrasena").value;

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const encontrado = usuarios.find(u => u.user === user && u.pass === pass);

    if ((user === "admin" && pass === "1234") || encontrado) {
        sessionStorage.setItem("sesion", "activa");
        window.location.href = "panel.html";
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
}