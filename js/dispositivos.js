import { db } from "./firebase.js";
import {
  doc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { proteger, cerrarSesion } from "./proteger.js";

proteger();
window.cerrarSesion = cerrarSesion;

const DISPOSITIVOS = [
  { nombre: "Nevera", icono: "❄️", porcentaje: 0.2 },
  { nombre: "Aire acondicionado", icono: "🌬️", porcentaje: 0.25 },
  { nombre: "Lavadora", icono: "🫧", porcentaje: 0.12 },
  { nombre: "Television", icono: "📺", porcentaje: 0.08 },
  { nombre: "Computador", icono: "💻", porcentaje: 0.07 },
  { nombre: "Iluminación", icono: "💡", porcentaje: 0.1 },
  { nombre: "Microondas", icono: "📡", porcentaje: 0.06 },
  { nombre: "Router WiFi", icono: "📶", porcentaje: 0.04 },
  { nombre: "Cargadores", icono: "🔌", porcentaje: 0.05 },
  { nombre: "Otros", icono: "⚡", porcentaje: 0.03 },
];

function renderDispositivos(potenciaTotal) {
  const lista = document.getElementById("lista-dispositivos");
  lista.innerHTML = DISPOSITIVOS.map((d) => {
    const consumo = (potenciaTotal * d.porcentaje).toFixed(3);
    const pct = Math.round(d.porcentaje * 100);
    return `
        <div class="disp-card">
            <div class="disp-icono">${d.icono}</div>
            <div class="disp-info">
                <div class="disp-nombre-fila">
                    <span class="disp-nombre">${d.nombre}</span>
                    <span class="disp-consumo">${consumo} kW</span>
                </div>
                <div class="disp-barra-wrap">
                    <div class="disp-barra" style="width: ${pct}%"></div>
                </div>
                <span class="disp-pct">${pct}% del consumo total</span>
            </div>
        </div>`;
  }).join("");
}

onSnapshot(doc(db, "datos-energia", "actual"), (snapshot) => {
  if (!snapshot.exists()) return;
  const d = snapshot.data();

  document.getElementById("consumo-total-disp").textContent =
    `${d.potencia} kW en uso`;
  renderDispositivos(d.potencia);
});
