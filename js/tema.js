const body = document.body;
const boton = document.getElementById("boton-tema");

function aplicarTema(tema) {
  if (tema === "dark") {
    body.classList.add("dark");
    boton.textContent = "☀️";
  } else {
    body.classList.remove("dark");
    boton.textContent = "🌙";
  }
}

const temaGuardado = localStorage.getItem("voltix-tema") || "light";
aplicarTema(temaGuardado);

boton.addEventListener("click", () => {
  const nuevo = body.classList.contains("dark") ? "light" : "dark";
  localStorage.setItem("voltix-tema", nuevo);
  aplicarTema(nuevo);
});

window.addEventListener("storage", (e) => {
  if (e.key === "voltix-tema") {
    aplicarTema(e.newValue || "light");
  }
});
