import { db } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { proteger, cerrarSesion } from "./proteger.js";

proteger();
window.cerrarSesion = cerrarSesion;

const hoy = new Date();

function fechaStr(date) {
  return date.toISOString().split("T")[0];
}

function fechaLabel(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("es-CO", { weekday: "short", day: "numeric" });
}

async function guardarHistorialHoy() {
  const ref = doc(db, "datos-energia", "actual");
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const d = snap.data();
  const hoyStr = fechaStr(hoy);
  const histRef = doc(db, "historial", hoyStr);
  const histSnap = await getDoc(histRef);

  if (!histSnap.exists()) {
    await setDoc(histRef, {
      fecha: hoyStr,
      consumo: d.consumoHoy,
      costo: d.costo,
      co2: d.co2,
    });
  }
}

async function generarHistorialSimulado() {
  for (let i = 1; i <= 7; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() - i);
    const fechaS = fechaStr(fecha);
    const ref = doc(db, "historial", fechaS);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      const consumo = parseFloat((Math.random() * 15 + 5).toFixed(2));
      await setDoc(ref, {
        fecha: fechaS,
        consumo,
        costo: Math.round(consumo * 121.6),
        co2: parseFloat((consumo * 0.05).toFixed(3)),
      });
    }
  }
}

async function cargarEstadisticas() {
  const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const snapshot = await getDocs(collection(db, "historial"));

  const datosMes = [];
  const ultimos7 = [];

  snapshot.forEach((doc) => {
    const d = doc.data();
    const fecha = new Date(d.fecha + "T12:00:00");

    if (fecha >= primerDiaMes && fecha <= hoy) {
      datosMes.push(d);
    }

    const diff = (hoy - fecha) / (1000 * 60 * 60 * 24);
    if (diff <= 7) {
      ultimos7.push(d);
    }
  });

  ultimos7.sort((a, b) => a.fecha.localeCompare(b.fecha));

  const totalConsumo = datosMes.reduce((s, d) => s + d.consumo, 0);
  const totalCosto = datosMes.reduce((s, d) => s + d.costo, 0);
  const totalCo2 = datosMes.reduce((s, d) => s + d.co2, 0);
  const promedio = datosMes.length > 0 ? totalConsumo / datosMes.length : 0;

  document.getElementById("stat-consumo").textContent =
    `${totalConsumo.toFixed(2)} kWh`;
  document.getElementById("stat-costo").textContent =
    `$${Math.round(totalCosto).toLocaleString()}`;
  document.getElementById("stat-co2").textContent = `${totalCo2.toFixed(2)} kg`;
  document.getElementById("stat-promedio").textContent =
    `${promedio.toFixed(2)} kWh`;

  const mesNombre = hoy.toLocaleDateString("es-CO", {
    month: "long",
    year: "numeric",
  });
  document.getElementById("mes-actual").textContent =
    mesNombre.charAt(0).toUpperCase() + mesNombre.slice(1);

  const ctx = document.getElementById("graficaSemana");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ultimos7.map((d) => fechaLabel(d.fecha)),
      datasets: [
        {
          label: "Consumo (kWh)",
          data: ultimos7.map((d) => d.consumo),
          backgroundColor: "rgba(255, 140, 0, 0.8)",
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: "#333", font: { size: 13 } } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: "#555" } },
        y: {
          beginAtZero: true,
          ticks: { color: "#555", callback: (v) => v + " kWh" },
        },
      },
    },
  });
}

async function init() {
  await generarHistorialSimulado();
  await guardarHistorialHoy();
  await cargarEstadisticas();
}
const hamburguesa = document.getElementById("hamburguesa");
const menu = document.querySelector(".menu");

hamburguesa.addEventListener("click", () => {
    menu.classList.toggle("abierto");
});

init();
