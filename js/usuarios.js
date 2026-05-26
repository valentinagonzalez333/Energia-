const lista = document.getElementById("lista-usuarios");
const sinUsuarios = document.getElementById("sin-usuarios");
const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

if (usuarios.length === 0) {
    sinUsuarios.style.display = "block";
} else {
    sinUsuarios.style.display = "none";
    usuarios.forEach((u, i) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td>${i + 1}</td><td>${u.user}</td>`;
        lista.appendChild(fila);
    });
}