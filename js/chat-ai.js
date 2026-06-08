import { db } from "./firebase.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { preguntarGemini, limpiarHistorial } from "./gemini.js";

const estilos = `
.chat-flotante {
    position: fixed;
    bottom: 90px;
    right: 20px;
    width: 340px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    display: none;
    flex-direction: column;
    z-index: 1999;
    overflow: hidden;
    font-family: 'Poppins', sans-serif;
}

.chat-flotante.abierto {
    display: flex;
}

.chat-header {
    background: linear-gradient(135deg, rgba(255,140,0,0.9), rgba(245,158,11,0.9));
    padding: 14px 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chat-header span {
    color: white;
    font-weight: 600;
    font-size: 15px;
}

.chat-header-botones {
    display: flex;
    gap: 8px;
}

.chat-header button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 16px;
    padding: 0;
    opacity: 0.85;
}

.chat-header button:hover {
    opacity: 1;
}

.chat-cuerpo {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px;
    max-height: 320px;
    overflow-y: auto;
}

.chat-msg {
    display: flex;
    max-width: 85%;
}

.chat-msg span {
    padding: 10px 14px;
    border-radius: 14px;
    font-size: 13px;
    line-height: 1.5;
}

.chat-msg.usuario {
    align-self: flex-end;
}

.chat-msg.usuario span {
    background: linear-gradient(135deg, rgba(255,140,0,0.85), rgba(245,158,11,0.85));
    color: white;
}

.chat-msg.modelo {
    align-self: flex-start;
}

.chat-msg.modelo span {
    background: rgba(100,100,100,0.15);
    color: #333;
}

.chat-msg.cargando span {
    opacity: 0.6;
    font-style: italic;
}

.chat-footer input {
    flex: 1;
    padding: 10px 14px;
    border-radius: 12px;
    border: 1px solid rgba(0,0,0,0.15);
    background: rgba(255,255,255,0.8);
    color: #333;
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    outline: none;
}

.chat-footer input {
    flex: 1;
    padding: 10px 14px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.2);
    background: rgba(255,255,255,0.1);
    color: white;
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    outline: none;
}

.chat-footer input::placeholder {
    color: rgba(0,0,0,0.4);
}

.chat-footer button {
    background: linear-gradient(135deg, rgba(255,140,0,0.9), rgba(245,158,11,0.9));
    border: none;
    border-radius: 12px;
    padding: 10px 14px;
    color: white;
    font-size: 16px;
    cursor: pointer;
}
`;

const styleEl = document.createElement("style");
styleEl.textContent = estilos;
document.head.appendChild(styleEl);

const chatHTML = `
<div class="chat-flotante" id="chat-flotante">
    <div class="chat-header">
        <span>⚡ Voltix AI</span>
        <div class="chat-header-botones">
            <button id="chat-limpiar" title="Limpiar chat">🗑️</button>
            <button id="chat-cerrar">✕</button>
        </div>
    </div>
    <div class="chat-cuerpo" id="chat-cuerpo">
        <div class="chat-msg modelo">
            <span>Hola, soy Voltix AI. ¿En qué puedo ayudarte con tu consumo energético?</span>
        </div>
    </div>
    <div class="chat-footer">
        <input type="text" id="chat-ia-input" placeholder="Escribe tu pregunta..." />
        <button id="chat-ia-enviar">➤</button>
    </div>
</div>
`;

document.body.insertAdjacentHTML("beforeend", chatHTML);

function cargarMensajesGuardados() {
  const historial = sessionStorage.getItem("voltix-chat");
  if (!historial) return;
  const cuerpo = document.getElementById("chat-cuerpo");
  cuerpo.innerHTML = "";
  JSON.parse(historial).forEach((m) => {
    const tipo = m.role === "user" ? "usuario" : "modelo";
    agregarMensaje(m.parts[0].text, tipo);
  });
}

function agregarMensaje(texto, tipo) {
  const cuerpo = document.getElementById("chat-cuerpo");
  const div = document.createElement("div");
  div.className = `chat-msg ${tipo}`;
  div.innerHTML = `<span>${texto.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>")}</span>`;
  cuerpo.appendChild(div);
  cuerpo.scrollTop = cuerpo.scrollHeight;
  return div;
}

async function obtenerContexto() {
  try {
    const snap = await getDoc(doc(db, "datos-energia", "actual"));
    if (!snap.exists()) return "";
    const d = snap.data();

    const DISPOSITIVOS = [
      { nombre: "Nevera", porcentaje: 0.2 },
      { nombre: "Aire acondicionado", porcentaje: 0.25 },
      { nombre: "Lavadora", porcentaje: 0.12 },
      { nombre: "Television", porcentaje: 0.08 },
      { nombre: "Computador", porcentaje: 0.07 },
      { nombre: "Iluminación", porcentaje: 0.1 },
      { nombre: "Microondas", porcentaje: 0.06 },
      { nombre: "Router WiFi", porcentaje: 0.04 },
      { nombre: "Cargadores", porcentaje: 0.05 },
      { nombre: "Otros", porcentaje: 0.03 },
    ];

    const dispositivosStr = DISPOSITIVOS.map(
      (dev) =>
        `  - ${dev.nombre}: ${(d.potencia * dev.porcentaje).toFixed(3)} kW (${Math.round(dev.porcentaje * 100)}%)`,
    ).join("\n");

    return `\n\n[Datos actuales del sistema Voltix:
- Potencia actual total: ${d.potencia} kW
- Consumo hoy: ${d.consumoHoy} kWh
- Costo estimado hoy: $${d.costo} COP
- CO₂ evitado hoy: ${d.co2} kg
- Factor de potencia: ${d.factorPotencia}
- Desviación estándar: ${d.desviacion} kW
- Promedio: ${d.promedio} kW
- Nivel: ${d.nivel}

Consumo por dispositivo ahora mismo:
${dispositivosStr}]`;
  } catch {
    return "";
  }
}

async function enviarMensaje() {
  const input = document.getElementById("chat-ia-input");
  const texto = input.value.trim();
  if (!texto) return;
  input.value = "";
  agregarMensaje(texto, "usuario");
  const cargando = agregarMensaje("Escribiendo...", "modelo cargando");
  const contexto = await obtenerContexto();
  const respuesta = await preguntarGemini(texto + contexto);
  cargando.remove();
  agregarMensaje(respuesta, "modelo");
}

document.addEventListener("DOMContentLoaded", () => {
  const boton = document.querySelector(".boton-ia");
  const flotante = document.getElementById("chat-flotante");
  const cerrar = document.getElementById("chat-cerrar");
  const limpiar = document.getElementById("chat-limpiar");
  const input = document.getElementById("chat-ia-input");
  const enviar = document.getElementById("chat-ia-enviar");

  cargarMensajesGuardados();

  boton.addEventListener("click", () => {
    flotante.classList.toggle("abierto");
  });

  cerrar.addEventListener("click", () => {
    flotante.classList.remove("abierto");
  });

  limpiar.addEventListener("click", () => {
    limpiarHistorial();
    const cuerpo = document.getElementById("chat-cuerpo");
    cuerpo.innerHTML = `<div class="chat-msg modelo"><span>Chat limpiado. ¿En qué puedo ayudarte?</span></div>`;
  });

  enviar.addEventListener("click", enviarMensaje);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") enviarMensaje();
  });
});
