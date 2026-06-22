exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  // Validación mínima de origen (funciona con dominio placeholder o real)
  const referer = event.headers.referer || event.headers.Referer || "";
  const origin = event.headers.origin || event.headers.Origin || "";
  const allowedHosts = process.env.ALLOWED_HOSTS
    ? process.env.ALLOWED_HOSTS.split(",")
    : ["site-jhonnathan.netlify.app", "localhost"];
  const isAllowed = allowedHosts.some((h) => referer.includes(h) || origin.includes(h));
  if (!isAllowed && process.env.SKIP_ORIGIN_CHECK !== "true") {
    return { statusCode: 403, body: JSON.stringify({ error: "Origen no permitido" }) };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key no configurada" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Cuerpo inválido" }) };
  }

  const { action, topic, text, notes } = body;
  if (!action) {
    return { statusCode: 400, body: JSON.stringify({ error: "action requerida" }) };
  }

  const prompts = {
    draft: `Redacta una entrada de blog en español sobre "${topic || ""}". Tono profesional, claro y práctico. Longitud: 800-1200 palabras. Incluye introducción, secciones con subtítulos y una conclusión. Notas de contexto: ${notes || "Ninguna"}.`,
    titles: `Sugiere 5 títulos atractivos en español para una entrada de blog sobre "${topic || ""}". Que sean claros, con palabras clave y sin clickbait.`,
    improve: `Mejora el siguiente texto en español, manteniendo el tono profesional y corrigiendo errores de redacción:\n\n${text || ""}`,
    ideas: `Genera 10 ideas de temas para posts de blog sobre tecnología, ciberseguridad, gestión de TI, DevOps o docencia, orientados a profesionales de República Dominicana.`,
    summary: `Resume el siguiente texto en 2-3 párrafos en español:\n\n${text || ""}`,
  };

  const prompt = prompts[action];
  if (!prompt) {
    return { statusCode: 400, body: JSON.stringify({ error: "Acción no soportada" }) };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "Eres un asistente de redacción para un blog profesional en español sobre tecnología, ciberseguridad, gestión de TI, DevOps y docencia.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    const data = await response.json();
    return {
      statusCode: response.status,
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ error: err.message }) };
  }
};
