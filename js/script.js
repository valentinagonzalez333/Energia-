import { db } from "./firebase.js";
import {
  doc,
  onSnapshot,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { proteger, cerrarSesion } from "./proteger.js";
proteger();
window.cerrarSesion = cerrarSesion;

const HORAS = [
  "6AM",
  "7AM",
  "8AM",
  "9AM",
  "10AM",
  "11AM",
  "12PM",
  "1PM",
  "2PM",
  "3PM",
  "4PM",
  "5PM",
  "6PM",
  "7PM",
  "8PM",
  "9PM",
];
const HORAS_NUM = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

async function actualizarFirestore() {
  const ref = doc(db, "datos-energia", "actual");
  const snap = await getDoc(ref);
  const horaActual = new Date().getHours();

  let graficaHoy = Array(16).fill(null);
  let consumoHoy = 0;
  let potencia = parseFloat((Math.random() * 1.5 + 0.3).toFixed(3));

  if (snap.exists()) {
    const prev = snap.data();
    const potenciaPrevia = prev.potencia || 0.5;
    const variacion = (Math.random() - 0.5) * 0.3;
    potencia = parseFloat(
      Math.max(0.1, Math.min(3.5, potenciaPrevia + variacion)).toFixed(3),
    );

    graficaHoy = prev.graficaHoy || Array(16).fill(null);
    consumoHoy = prev.consumoHoy || 0;

    const incremento = parseFloat((potencia * (5 / 3600)).toFixed(5));
    consumoHoy = parseFloat((consumoHoy + incremento).toFixed(4));

    const idxHora = HORAS_NUM.indexOf(horaActual);
    if (idxHora !== -1) {
      graficaHoy[idxHora] = parseFloat(consumoHoy.toFixed(3));
    }
  }

  const costo = Math.round(consumoHoy * 121.6);
  const co2 = parseFloat((consumoHoy * 0.05).toFixed(3));
  const factorPotencia = parseFloat((Math.random() * 0.05 + 0.87).toFixed(3));
  const desviacion = parseFloat((Math.random() * 0.1).toFixed(3));
  const promedio = parseFloat(
    (consumoHoy / Math.max(1, horaActual - 5)).toFixed(3),
  );
  const nivel =
    consumoHoy < 10
      ? "Consumo Bajo"
      : consumoHoy < 18
        ? "Consumo Medio"
        : "Consumo Alto";

  await setDoc(ref, {
    potencia,
    consumoHoy,
    costo,
    co2,
    graficaHoy,
    factorPotencia,
    desviacion,
    promedio,
    nivel,
    ultimaActualizacion: new Date().toISOString(),
  });
}

const ctx = document.getElementById("grafica");
let chart = null;

onSnapshot(doc(db, "datos-energia", "actual"), (snapshot) => {
  if (!snapshot.exists()) return;
  const d = snapshot.data();

  document.querySelector(".card_1 p").textContent = `${d.consumoHoy} kWh`;
  document.querySelector(".card_1 .sub").textContent = d.nivel;
  document.querySelector(".infos .info:nth-child(1) p").textContent =
    `$${d.costo.toLocaleString()}`;
  document.querySelector(".infos .info:nth-child(2) p").textContent =
    `${d.co2} kg`;

  const graficaFiltrada = d.graficaHoy.map((v) => (v === null ? null : v));

  if (!chart) {
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: HORAS,
        datasets: [
          {
            label: "Consumo Energético",
            data: graficaFiltrada,
            borderColor: "#ff8c00",
            backgroundColor: "rgba(255,140,0,0.2)",
            tension: 0.4,
            fill: true,
            spanGaps: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: "#131212" } } },
        scales: {
          x: { ticks: { color: "white" } },
          y: { ticks: { color: "white" } },
        },
      },
    });
  } else {
    chart.data.datasets[0].data = graficaFiltrada;
    chart.update();
  }
});

actualizarFirestore();
setInterval(actualizarFirestore, 5000);
