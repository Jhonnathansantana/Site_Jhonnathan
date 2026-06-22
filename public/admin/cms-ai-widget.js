CMS.registerEventListener({
  name: 'preSave',
  handler: async ({ entry }) => {
    return entry;
  }
});

// Widget simple: abre un modal con un textarea para pedir ayuda a la IA
(function() {
  const btn = document.createElement('button');
  btn.textContent = 'Asistente IA';
  btn.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:9999;background:var(--accent);color:white;border:none;padding:10px 16px;border-radius:6px;cursor:pointer;font-family:inherit;';
  btn.addEventListener('click', async () => {
    const prompt = window.prompt('¿Qué querés que te ayude a redactar?');
    if (!prompt) return;
    try {
      const res = await fetch('/.netlify/functions/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] })
      });
      const data = await res.json();
      if (data.choices && data.choices[0]) {
        window.alert(data.choices[0].message.content);
      } else {
        window.alert('Error: ' + JSON.stringify(data));
      }
    } catch (e) {
      window.alert('Error de conexión: ' + e.message);
    }
  });
  document.body.appendChild(btn);
})();
