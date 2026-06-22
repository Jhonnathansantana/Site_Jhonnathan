/**
 * Widget personalizado de asistente IA para Decap CMS.
 * Agrega botones en la interfaz del editor de markdown para:
 * - Generar borrador
 * - Mejorar texto seleccionado
 * - Sugerir ideas
 */
(function () {
  'use strict';

  const FUNCTION_URL = '/.netlify/functions/ai-assistant';

  function createButton(label, title, onClick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    btn.title = title;
    btn.style.cssText =
      'margin-right:8px;padding:6px 12px;background:#2563eb;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;';
    btn.addEventListener('click', onClick);
    return btn;
  }

  function getEntryMeta() {
    const cms = window.CMS;
    const state = cms?.currentState || {};
    const entry = state.entry?.data || {};
    return {
      title: entry.title || '',
      description: entry.description || '',
      body: entry.body || '',
      tags: Array.isArray(entry.tags) ? entry.tags : [],
    };
  }

  function setBodyMarkdown(newBody) {
    const cms = window.CMS;
    if (cms?.currentState?.entry?.setIn) {
      const next = cms.currentState.entry.setIn(['data', 'body'], newBody);
      cms.currentState.entry = next;
      const textarea = document.querySelector('.cms-editor-body textarea');
      if (textarea) textarea.value = newBody;
    }
  }

  function getSelectionText() {
    const textarea = document.querySelector('.cms-editor-body textarea');
    return textarea ? textarea.value.substring(textarea.selectionStart, textarea.selectionEnd) : '';
  }

  async function callAssistant(action, extra = {}) {
    const meta = getEntryMeta();
    const payload = {
      action,
      title: meta.title,
      description: meta.description,
      body: action === 'improve' ? extra.text || meta.body : meta.body,
      tags: meta.tags,
    };

    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Error ${response.status}`);
    }

    return response.json();
  }

  function showResult(result) {
    const existing = document.getElementById('cms-ai-result');
    if (existing) existing.remove();

    const panel = document.createElement('div');
    panel.id = 'cms-ai-result';
    panel.style.cssText =
      'position:fixed;bottom:20px;right:20px;width:360px;max-height:80vh;overflow:auto;background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px;box-shadow:0 10px 25px rgba(0,0,0,0.15);z-index:9999;font-family:sans-serif;font-size:14px;';
    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <strong>Resultado del asistente</strong>
        <button id="cms-ai-close" style="background:none;border:none;cursor:pointer;font-size:18px;">×</button>
      </div>
      <pre style="white-space:pre-wrap;word-break:break-word;background:#f8fafc;padding:10px;border-radius:4px;font-size:13px;">${escapeHtml(result)}</pre>
      <button id="cms-ai-use" style="margin-top:8px;padding:6px 12px;background:#0f172a;color:#fff;border:none;border-radius:4px;cursor:pointer;">Usar en cuerpo del post</button>
    `;
    document.body.appendChild(panel);

    document.getElementById('cms-ai-close').addEventListener('click', () => panel.remove());
    document.getElementById('cms-ai-use').addEventListener('click', () => {
      setBodyMarkdown(result);
      panel.remove();
    });
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showError(error) {
    const existing = document.getElementById('cms-ai-error');
    if (existing) existing.remove();

    const panel = document.createElement('div');
    panel.id = 'cms-ai-error';
    panel.style.cssText =
      'position:fixed;bottom:20px;right:20px;background:#fee2e2;color:#991b1b;border:1px solid #fecaca;border-radius:8px;padding:12px 16px;z-index:9999;max-width:320px;font-family:sans-serif;font-size:13px;';
    panel.textContent = `Error: ${error.message || error}`;
    document.body.appendChild(panel);
    setTimeout(() => panel.remove(), 6000);
  }

  function injectToolbar() {
    if (document.getElementById('cms-ai-toolbar')) return;

    const toolbar = document.createElement('div');
    toolbar.id = 'cms-ai-toolbar';
    toolbar.style.cssText = 'padding:8px 16px;background:#f8fafc;border-bottom:1px solid #e2e8f0;';

    toolbar.appendChild(
      createButton('Generar borrador', 'Genera un borrador de post con IA', async () => {
        try {
          const { result } = await callAssistant('draft');
          showResult(result);
        } catch (err) {
          showError(err);
        }
      })
    );

    toolbar.appendChild(
      createButton('Mejorar texto', 'Mejora el texto seleccionado o el cuerpo actual', async () => {
        try {
          const selected = getSelectionText();
          const { result } = await callAssistant('improve', { text: selected });
          showResult(result);
        } catch (err) {
          showError(err);
        }
      })
    );

    toolbar.appendChild(
      createButton('Ideas', 'Sugiere títulos, subtítulos y etiquetas', async () => {
        try {
          const { result } = await callAssistant('ideas');
          showResult(result);
        } catch (err) {
          showError(err);
        }
      })
    );

    const firstHeader = document.querySelector('.cms-editor-header, .cms-editor-container, main');
    if (firstHeader) {
      firstHeader.insertAdjacentElement('beforebegin', toolbar);
    } else {
      document.body.insertBefore(toolbar, document.body.firstChild);
    }
  }

  // Espera a que Decap CMS esté listo y registra un control custom.
  function init() {
    if (typeof window.CMS === 'undefined') {
      setTimeout(init, 500);
      return;
    }

    window.CMS.registerWidget('aiAssistant', () => null, {
      init: () => {
        injectToolbar();
      },
    });

    injectToolbar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
