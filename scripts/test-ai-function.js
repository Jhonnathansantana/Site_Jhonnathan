// Uso: node scripts/test-ai-function.js
// Requiere OPENAI_API_KEY configurada como variable de entorno.
// Requiere que npx netlify-cli dev esté corriendo (o un endpoint accesible).

const endpoint = process.env.ENDPOINT || "http://localhost:8888/.netlify/functions/ai-assistant";
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("❌ OPENAI_API_KEY no está definida.");
  process.exit(1);
}

async function test() {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "ideas" }),
    });
    const data = await res.json();
    if (data.choices && data.choices[0]) {
      console.log("✅ Respuesta de IA:");
      console.log(data.choices[0].message.content.slice(0, 200) + "...");
    } else {
      console.error("❌ Error:", data);
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Fallo de conexión:", err.message);
    console.error("Asegúrate de que npx netlify-cli dev esté corriendo en otra terminal.");
    process.exit(1);
  }
}

test();
