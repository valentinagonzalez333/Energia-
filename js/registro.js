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

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

    const existe = usuarios.find(u => u.user === user);
    if (existe) {
        errorMsg.textContent = "Ese usuario ya existe.";
        errorMsg.style.display = "block";
        return;
    }

    usuarios.push({ user, pass });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Cuenta creada exitosamente.");
    window.location.href = "login.html";
}