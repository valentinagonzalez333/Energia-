const GEMINI_API_KEY = "AQ.Ab8RN6K--SWSi_0fDziEiXJriSZOOGDKu1d9cVR7aicPDDYTqA";

const systemPrompt = `Eres Voltix AI, un asistente experto en consumo energético del hogar. 
Ayudas a los usuarios a entender su consumo eléctrico, calcular costos, detectar anomalías 
y dar recomendaciones para ahorrar energía. Responde siempre en español, de forma clara y concisa.
Si te preguntan algo que no tiene relación con energía, redirecciona amablemente la conversación.`;

let historial = [];

export async function preguntarGemini(mensaje) {
  historial.push({ role: "user", parts: [{ text: mensaje }] });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: historial,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 429) {
        return "⚠️ Demasiadas solicitudes. Espera unos segundos e intenta de nuevo.";
      }
      return "⚠️ Error al conectar con el asistente. Intenta de nuevo.";
    }

    const respuesta = data.candidates[0].content.parts[0].text;
    historial.push({ role: "model", parts: [{ text: respuesta }] });
    return respuesta;
  } catch (error) {
    return "⚠️ Error al conectar con el asistente. Intenta de nuevo.";
  }
}
