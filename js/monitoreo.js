import { db } from "./firebase.js";
import {
  doc,
  onSnapshot,
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

let chart = null;

onSnapshot(doc(db, "datos-energia", "actual"), (snapshot) => {
  if (!snapshot.exists()) return;
  const d = snapshot.data();

  document.querySelectorAll(".card h3")[0].textContent = d.potencia;
  document.querySelectorAll(".card h3")[1].textContent = d.consumoHoy;
  document.querySelectorAll(".card h3")[2].textContent = d.factorPotencia;
  document.querySelectorAll(".card h3")[3].textContent = d.desviacion;

  document.querySelector(".right h3").textContent =
    `$${d.costo.toLocaleString()}`;
  document.querySelector(".right_2 p").textContent = `${d.promedio} kW`;

  const ctx = document.getElementById("graficaConsumo");
  if (!chart) {
    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: HORAS,
        datasets: [
          {
            label: "Consumo (kWh)",
            data: d.graficaHoy,
            backgroundColor: "rgba(245, 166, 35, 0.8)",
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { font: { size: 11 }, color: "#555" } } },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#888" } },
          y: {
            beginAtZero: true,
            ticks: { color: "#888", callback: (v) => v + " kWh" },
          },
        },
      },
    });
  } else {
    chart.data.datasets[0].data = d.graficaHoy;
    chart.update();
  }
});
