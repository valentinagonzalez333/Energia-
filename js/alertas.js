import { db } from "./firebase.js";
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { proteger, cerrarSesion } from "./proteger.js";

proteger();
window.cerrarSesion = cerrarSesion;

const UMBRALES = {
    consumoAlto: 15,
    consumoCritico: 20,
    potenciaAlta: 2.5,
    potenciaCritica: 3.0,
    costoAlto: 2000,
    costoCritico: 3000,
    co2Alto: 0.8,
    co2Critico: 1.2,
    factorBajo: 0.85,
    factorCritico: 0.80,
    desvAlta: 0.07,
    desvCritica: 0.09,
};

function evaluarAlertas(d) {
    const alertas = [];

    if (d.consumoHoy >= UMBRALES.consumoCritico) {
        alertas.push({ icono: "🔴", tipo: "critica", titulo: "Consumo Crítico", mensaje: `El consumo de hoy es ${d.consumoHoy} kWh, superando el límite crítico de ${UMBRALES.consumoCritico} kWh.` });
    } else if (d.consumoHoy >= UMBRALES.consumoAlto) {
        alertas.push({ icono: "🟡", tipo: "advertencia", titulo: "Consumo Elevado", mensaje: `El consumo de hoy es ${d.consumoHoy} kWh, por encima del umbral de ${UMBRALES.consumoAlto} kWh.` });
    } else {
        alertas.push({ icono: "🟢", tipo: "normal", titulo: "Consumo Normal", mensaje: `El consumo de hoy es ${d.consumoHoy} kWh, dentro del rango normal.` });
    }

    if (d.potencia >= UMBRALES.potenciaCritica) {
        alertas.push({ icono: "🔴", tipo: "critica", titulo: "Pico de Potencia Crítico", mensaje: `Potencia actual de ${d.potencia} kW, nivel peligroso detectado.` });
    } else if (d.potencia >= UMBRALES.potenciaAlta) {
        alertas.push({ icono: "🟡", tipo: "advertencia", titulo: "Potencia Elevada", mensaje: `Potencia actual de ${d.potencia} kW, por encima de lo habitual.` });
    } else {
        alertas.push({ icono: "🟢", tipo: "normal", titulo: "Potencia Normal", mensaje: `Potencia actual de ${d.potencia} kW, dentro del rango normal.` });
    }

    if (d.costo >= UMBRALES.costoCritico) {
        alertas.push({ icono: "🔴", tipo: "critica", titulo: "Costo Crítico", mensaje: `El costo estimado hoy es $${d.costo.toLocaleString()} COP, nivel crítico.` });
    } else if (d.costo >= UMBRALES.costoAlto) {
        alertas.push({ icono: "🟡", tipo: "advertencia", titulo: "Costo Elevado", mensaje: `El costo estimado hoy es $${d.costo.toLocaleString()} COP, considera reducir el consumo.` });
    } else {
        alertas.push({ icono: "🟢", tipo: "normal", titulo: "Costo Normal", mensaje: `El costo estimado hoy es $${d.costo.toLocaleString()} COP, dentro del presupuesto.` });
    }

    if (d.co2 >= UMBRALES.co2Critico) {
        alertas.push({ icono: "🔴", tipo: "critica", titulo: "CO₂ Crítico", mensaje: `Emisiones de ${d.co2} kg CO₂ hoy, impacto ambiental muy alto.` });
    } else if (d.co2 >= UMBRALES.co2Alto) {
        alertas.push({ icono: "🟡", tipo: "advertencia", titulo: "CO₂ Elevado", mensaje: `Emisiones de ${d.co2} kg CO₂ hoy, considera reducir el consumo.` });
    } else {
        alertas.push({ icono: "🟢", tipo: "normal", titulo: "CO₂ Normal", mensaje: `Emisiones de ${d.co2} kg CO₂ hoy, impacto ambiental reducido.` });
    }

    if (d.factorPotencia <= UMBRALES.factorCritico) {
        alertas.push({ icono: "🔴", tipo: "critica", titulo: "Factor de Potencia Crítico", mensaje: `Factor de potencia ${d.factorPotencia}, instalación eléctrica inestable.` });
    } else if (d.factorPotencia <= UMBRALES.factorBajo) {
        alertas.push({ icono: "🟡", tipo: "advertencia", titulo: "Factor de Potencia Bajo", mensaje: `Factor de potencia ${d.factorPotencia}, puede indicar ineficiencia eléctrica.` });
    } else {
        alertas.push({ icono: "🟢", tipo: "normal", titulo: "Factor de Potencia Estable", mensaje: `Factor de potencia ${d.factorPotencia}, instalación eléctrica estable.` });
    }

    if (d.desviacion >= UMBRALES.desvCritica) {
        alertas.push({ icono: "🔴", tipo: "critica", titulo: "Desviación Crítica", mensaje: `Desviación estándar de ${d.desviacion} kW, consumo muy irregular detectado.` });
    } else if (d.desviacion >= UMBRALES.desvAlta) {
        alertas.push({ icono: "🟡", tipo: "advertencia", titulo: "Consumo Irregular", mensaje: `Desviación estándar de ${d.desviacion} kW, fluctuaciones fuera de lo normal.` });
    } else {
        alertas.push({ icono: "🟢", tipo: "normal", titulo: "Consumo Estable", mensaje: `Desviación estándar de ${d.desviacion} kW, consumo estable.` });
    }

    return alertas;
}

onSnapshot(doc(db, "datos-energia", "actual"), (snapshot) => {
    if (!snapshot.exists()) return;
    const d = snapshot.data();
    const alertas = evaluarAlertas(d);
    const lista = document.getElementById("lista-alertas");
    const totalBadge = document.getElementById("total-alertas");

    const activas = alertas.filter(a => a.tipo !== "normal").length;
    totalBadge.textContent = `${activas} activas`;
    totalBadge.className = `badge ${activas > 0 ? "badge-alerta" : "badge-ok"}`;

    lista.innerHTML = alertas.map(a => `
        <div class="alerta ${a.tipo}">
            <div class="alerta-icono">${a.icono}</div>
            <div class="alerta-info">
                <h3>${a.titulo}</h3>
                <p>${a.mensaje}</p>
            </div>
        </div>
    `).join("");
});


const hamburguesa = document.getElementById("hamburguesa");
const menu = document.querySelector(".menu");

hamburguesa.addEventListener("click", () => {
    menu.classList.toggle("abierto");
});