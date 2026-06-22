const { Netlify } = require('@netlify/functions');
const OpenAI = require('openai');

/**
 * Netlify Function: asistente de IA para el panel de Decap CMS.
 * Usa OpenAI para generar borradores, mejorar texto o dar ideas.
 * La API key nunca viaja al cliente; se lee de variables de entorno.
 */
exports.handler = async (event, context) => {
  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Método no permitido. Usa POST.' }),
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'OPENAI_API_KEY no está configurada.' }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'JSON inválido en el body.' }),
    };
  }

  const { action, title, description, body, tags = [] } = payload;

  if (!['draft', 'improve', 'ideas'].includes(action)) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Acción inválida. Usa draft, improve o ideas.' }),
    };
  }

  const openai = new OpenAI({ apiKey });

  const systemByAction = {
    draft:
      'Eres un asistente de redacción para un blog técnico en español. Genera borradores claros, con estructura markdown y tono profesional.',
    improve:
      'Eres un editor experto. Mejora el texto recibido en español: corrige fluidez, claridad, ortografía y formato markdown. Devuelve solo el texto mejorado.',
    ideas:
      'Eres un estratega de contenidos. Basándote en el tema, sugiere títulos alternativos, subtítulos y etiquetas relevantes en español.',
  };

  const userPrompts = {
    draft: `Título propuesto: ${title || 'sin título'}\nDescripción: ${description || ''}\nEtiquetas: ${tags.join(', ')}\n\nGenera un borrador completo de artículo en markdown.`,
    improve: `Mejora el siguiente texto manteniendo el formato markdown:\n\n${body || ''}`,
    ideas: `Tema: ${title || ''}\nDescripción: ${description || ''}\n\nSugiere títulos alternativos, posibles subtítulos de secciones y etiquetas relevantes. Devuélvelo en una lista breve y útil.`,
  };

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 2048,
      messages: [
        { role: 'system', content: systemByAction[action] },
        { role: 'user', content: userPrompts[action] },
      ],
    });

    const result = completion.choices[0]?.message?.content || '';

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ result }),
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        error: 'Error al contactar OpenAI.',
        details: error?.message || String(error),
      }),
    };
  }
};
