(function () {
  const API_URL = "/.netlify/functions/ai-assistant";

  async function askAI(action, payload) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      });
      const data = await res.json();
      if (data.choices && data.choices[0]) {
        return data.choices[0].message.content;
      }
      throw new Error(data.error || JSON.stringify(data));
    } catch (e) {
      alert("Error del asistente: " + e.message);
      return null;
    }
  }

  function createButton(label, onClick) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = label;
    btn.style.cssText =
      "margin: 4px 4px 4px 0; padding: 6px 12px; background: #2563eb; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-family: inherit; font-size: 13px;";
    btn.addEventListener("click", onClick);
    return btn;
  }

  function findField(name) {
    return document.querySelector(`[name='${name}'], [data-testid='field-${name}'] input, [data-testid='field-${name}'] textarea`);
  }

  function getFieldValue(name) {
    const el = findField(name);
    return el ? el.value : "";
  }

  function setFieldValue(name, value) {
    const el = findField(name);
    if (!el) return;
    el.value = value;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function appendToolbar() {
    if (document.getElementById("cms-ai-toolbar")) return;
    const container = document.querySelector("[class*='EntryPage']") || document.body;
    if (!container) return;

    const toolbar = document.createElement("div");
    toolbar.id = "cms-ai-toolbar";
    toolbar.style.cssText =
      "position: fixed; bottom: 16px; right: 16px; z-index: 9999; background: var(--surface, #1b1f24); border: 1px solid var(--border, #2c3036); border-radius: 8px; padding: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.25); max-width: 320px; font-family: inherit;";

    const title = document.createElement("div");
    title.textContent = "Asistente IA";
    title.style.cssText = "font-weight: 600; margin-bottom: 8px; color: var(--foreground, #e8eaed);";
    toolbar.appendChild(title);

    toolbar.appendChild(
      createButton("Sugerir títulos", async () => {
        const topic = getFieldValue("title") || window.prompt("¿Sobre qué tema?");
        if (!topic) return;
        const result = await askAI("titles", { topic });
        if (result) window.alert(result);
      })
    );

    toolbar.appendChild(
      createButton("Borrador", async () => {
        const topic = getFieldValue("title") || window.prompt("¿Sobre qué tema?");
        if (!topic) return;
        const notes = getFieldValue("description") || "";
        const result = await askAI("draft", { topic, notes });
        if (result) setFieldValue("body", result);
      })
    );

    toolbar.appendChild(
      createButton("Mejorar texto", async () => {
        const text = getFieldValue("body") || window.prompt("Pega el texto a mejorar:");
        if (!text) return;
        const result = await askAI("improve", { text });
        if (result) setFieldValue("body", result);
      })
    );

    toolbar.appendChild(
      createButton("Resumir", async () => {
        const text = getFieldValue("body");
        if (!text) return alert("No hay cuerpo para resumir.");
        const result = await askAI("summary", { text });
        if (result) setFieldValue("description", result);
      })
    );

    document.body.appendChild(toolbar);
  }

  // Decap CMS carga el panel de forma dinámica; observamos hasta que aparezca el editor
  const observer = new MutationObserver(() => {
    if (document.querySelector("[class*='EntryPage']")) {
      appendToolbar();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
