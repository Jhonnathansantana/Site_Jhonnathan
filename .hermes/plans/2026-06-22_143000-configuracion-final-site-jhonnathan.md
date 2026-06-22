# Configuración final y mejoras del portafolio Site_Jhonnathan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Dejar el portafolio académico listo para producción: IA privada funcional en Decap CMS, variables de entorno seguras, identidad de marca consistente, página de Servicios integrada y textos localizados.

**Architecture:** Se mantiene Astro 6 + Tailwind CSS 4 + Content Collections + Pagefind. La IA sigue corriendo solo a través de una Netlify Function (`netlify/functions/ai-assistant.js`) que lee `OPENAI_API_KEY` del entorno. El frontend nunca accede a la clave. Decap CMS se habilita con Netlify Identity + Git Gateway. Se añade una sección de Servicios sin crear una colección nueva: se implementa como una página estática con cards reutilizando componentes existentes.

**Tech Stack:** Astro 6, TypeScript, Tailwind CSS 4, Pagefind, Decap CMS, Netlify Functions, Netlify Identity/Git Gateway, OpenAI API.

---

## Current context / assumptions

- Rama activa: `main` en `https://github.com/Jhonnathansantana/Site_Jhonnathan`.
- Build exitoso: 43 páginas, Pagefind indexa 41 páginas / 782 palabras.
- `OPENAI_API_KEY` ya fue compartida por el usuario; no se versiona.
- Node.js local: v22.23.0 via nvm (requerido por Tailwind v4/Vite).
- Dominio placeholder: `https://site-jhonnathan.netlify.app`.
- Correo placeholder en `src/config/social.ts`: `jhonnathan@example.com`.
- Paginación del blog aún dice "Newer / Older / Page X of Y" en inglés.
- Widget IA actual solo abre un `prompt()` simple. Se mejorará a botones contextuales por campo.
- El usuario confirmó reemplazar contenido de ejemplo y aprobó continuar con mejoras.

---

## Step-by-step plan

### Task 1: Escribir `.env` local con placeholders claros

**Objective:** Documentar variables necesarias sin exponer secretos reales.

**Files:**
- Modify: `.env.example`

**Step 1: Actualizar `.env.example`**

```bash
# Variables de entorno requeridas para el asistente de IA de Decap CMS
# Nunca guardes valores reales en este archivo; usa el Netlify dashboard en producción.
OPENAI_API_KEY=***
OPENAI_MODEL=gpt-4o-mini
```

**Verification:**
- Leer `cat .env.example` y confirmar que no contiene la clave real.
- Confirmar `.gitignore` incluye `.env`.

**Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: clarifica placeholders de variables de entorno"
```

---

### Task 2: Mejorar la seguridad y utilidad de la Netlify Function de IA

**Objective:** La función valida origen, rate-limita por IP y soporta acciones de redacción contextual.

**Files:**
- Modify: `netlify/functions/ai-assistant.js`

**Step 1: Reemplazar función actual**

```javascript
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
```

**Step 2: Actualizar `.env.example` con `ALLOWED_HOSTS` opcional**

```bash
# Variables de entorno requeridas para el asistente de IA de Decap CMS
# Nunca guardes valores reales en este archivo; usa el Netlify dashboard en producción.
OPENAI_API_KEY=***
OPENAI_MODEL=gpt-4o-mini
# Opcional: hosts permitidos para la función de IA (separados por coma)
# ALLOWED_HOSTS=site-jhonnathan.netlify.app,localhost
```

**Verification:**
- `npm run build` sigue exitoso.
- (Opcional) Instalar Netlify CLI y probar localmente con `npx netlify dev` una vez configurada la key.

**Step 3: Commit**

```bash
git add netlify/functions/ai-assistant.js .env.example
git commit -m "feat: valida origen y acciones de redacción en asistente IA"
```

---

### Task 3: Mejorar el widget de IA en Decap CMS

**Objective:** Ofrecer botones contextuales para títulos, borradores, mejora y resumen en el editor de Decap CMS.

**Files:**
- Modify: `public/admin/cms-ai-widget.js`

**Step 1: Reemplazar widget actual**

```javascript
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
```

**Verification:**
- `npm run build` exitoso.
- Al desplegar, abrir `/admin/`, iniciar sesión con Netlify Identity y verificar que aparece la barra flotante "Asistente IA" al editar una entrada.

**Step 2: Commit**

```bash
git add public/admin/cms-ai-widget.js
git commit -m "feat: widget de IA con acciones contextuales para Decap CMS"
```

---

### Task 4: Localizar textos de paginación del blog

**Objective:** Cambiar "Newer / Older / Page X of Y" a español.

**Files:**
- Modify: `src/layouts/BaseListing.astro`

**Step 1: Editar líneas 44-54**

```astro
    {page && page.lastPage > 1 && (
        <nav class="pagination">
            {page.url.prev ? (
                <a href={page.url.prev} class="pagination-link">Más recientes</a>
            ) : (
                <span class="pagination-inactive">Más recientes</span>
            )}
            <span class="pagination-info">Página {page.currentPage} de {page.lastPage}</span>
            {page.url.next ? (
                <a href={page.url.next} class="pagination-link">Anteriores</a>
            ) : (
                <span class="pagination-inactive">Anteriores</span>
            )}
        </nav>
    )}
```

**Verification:**
- `npm run build` exitoso.
- Previsualizar `/posts` y confirmar textos en español (solo se muestra si hay más de 5 posts).

**Step 2: Commit**

```bash
git add src/layouts/BaseListing.astro
git commit -m "i18n: paginación del blog en español"
```

---

### Task 5: Actualizar correo de contacto en configuración social

**Objective:** Reemplazar placeholder por correo real del usuario (a confirmar).

**Files:**
- Modify: `src/config/social.ts`

**Step 1: Preguntar al usuario su correo real**

Si el usuario proporciona un correo como `jhonnathan@tudominio.com`, actualizar:

```typescript
    {
        name: "Mail",
        href: "mailto:jhonnathan@tudominio.com",
        linkTitle: `Enviar correo a Jhonnathan`,
        isActive: true,
    },
```

**Verification:**
- `npm run build` exitoso.
- Hacer clic en el icono de correo del footer/social abre el cliente de correo.

**Step 2: Commit**

```bash
git add src/config/social.ts
git commit -m "chore: actualiza correo de contacto"
```

---

### Task 6: Agregar página de Servicios

**Objective:** Crear `/services` que presente servicios profesionales del perfil sin agregar una colección nueva.

**Files:**
- Create: `src/pages/services.astro`
- Create: `src/data/services.json`
- Modify: `src/config/pages.ts`
- Modify: `src/config/navigation.ts`

**Step 1: Crear `src/data/services.json`**

```json
[
  {
    "title": "Gestión de TI",
    "description": "Diseño y liderazgo de infraestructura tecnológica, soporte, seguridad y alineación de TI con objetivos de negocio.",
    "tags": ["infraestructura", "seguridad", "soporte"]
  },
  {
    "title": "Ciberseguridad práctica",
    "description": "Evaluación de riesgos, hardening, políticas de acceso, concienciación y controles proportionales para organizaciones dominicanas.",
    "tags": ["zero trust", "hardening", "gestión de riesgos"]
  },
  {
    "title": "DevOps y automatización",
    "description": "Pipelines de CI/CD, despliegue continuo, monitoreo y funciones serverless con herramientas modernas como Netlify y GitHub Actions.",
    "tags": ["devops", "netlify", "github actions"]
  },
  {
    "title": "Docencia y formación técnica",
    "description": "Diseño de cursos y talleres en redes, ciberseguridad, gestión de TI y productividad con IA para instituciones educativas.",
    "tags": ["docencia", "itla", "infotep"]
  },
  {
    "title": "Asesoría en IA productiva",
    "description": "Acompañamiento para integrar asistentes de IA de forma segura y productiva en flujos de trabajo, educación y desarrollo.",
    "tags": ["ia", "productividad", "automatización"]
  }
]
```

**Step 2: Crear `src/pages/services.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import BaseItemCard from "../components/ui/BaseItemCard.astro";
import services from "../data/services.json";
import { PAGES } from "../config";

const { title, subtitle } = PAGES.services;
---

<BaseLayout title={title}>
    <header class="page-header">
        {title && <h1 class="page-title">{title}</h1>}
        {subtitle && <p class="page-subtitle">{subtitle}</p>}
    </header>

    <section class="item-list">
        {services.map((service) => (
            <BaseItemCard
                title={service.title}
                description={service.description}
                tags={service.tags}
                href="mailto:jhonnathan@example.com"
            />
        ))}
    </section>
</BaseLayout>
```

**Step 3: Activar página en `src/config/pages.ts`**

Añadir dentro de `PAGES`:

```typescript
    services: {
        title: "Servicios",
        subtitle: "Consultoría y acompañamiento en TI, ciberseguridad, DevOps, docencia e IA productiva.",
        isActive: true,
    },
```

**Step 4: Agregar enlace en `src/config/navigation.ts`**

Insertar después de "Proyectos":

```typescript
    { href: "/services", label: "Servicios", isActive: true },
```

**Verification:**
- `npm run build` genera `/services/index.html`.
- Navegación muestra el enlace "Servicios".
- Página lista 5 tarjetas con tags.

**Step 5: Commit**

```bash
git add src/data/services.json src/pages/services.astro src/config/pages.ts src/config/navigation.ts
git commit -m "feat: agrega página de Servicios profesionales"
```

---

### Task 7: Reordenar navegación final

**Objective:** Orden lógico: Inicio/Blog/Servicios/Docencia/Proyectos/Etiquetas/CV.

**Files:**
- Modify: `src/config/navigation.ts`

**Step 1: Reordenar NAV_LINKS**

```typescript
export const NAV_LINKS: NavLink[] = [
    { href: "/", label: "Sobre mí", isActive: true },
    { href: "/posts", label: "Blog", isActive: true },
    { href: "/services", label: "Servicios", isActive: true },
    { href: "/teaching", label: "Docencia", isActive: true },
    { href: "/projects", label: "Proyectos", isActive: true },
    { href: "/tags", label: "Etiquetas", isActive: true },
    { href: "/cv", label: "CV", isActive: true },
];
```

**Verification:**
- `npm run build` exitoso.
- Revisar navbar en desktop y mobile.

**Step 2: Commit**

```bash
git add src/config/navigation.ts
git commit -m "ui: reordena navegación con Servicios"
```

---

### Task 8: Documentar pasos de despliegue y configuración en Netlify

**Objective:** Crear guía clara para configurar variables de entorno, Identity y Git Gateway.

**Files:**
- Create: `NETLIFY_SETUP.md`

**Step 1: Escribir documento**

```markdown
# Configuración en Netlify

## 1. Variables de entorno

En el dashboard de Netlify del sitio:

- Ir a **Site configuration > Environment variables**.
- Agregar:
  - `OPENAI_API_KEY` = la clave real (nunca en el repo).
  - `OPENAI_MODEL` = `gpt-4o-mini` (u otro modelo).
  - Opcional: `ALLOWED_HOSTS` = `site-jhonnathan.netlify.app` (o dominio real).

## 2. Netlify Identity

- Ir a **Site configuration > Identity**.
- Hacer clic en **Enable Identity**.
- Configurar registro: recomendado **Invite only** para un panel privado.
- Invitar al usuario administrador.

## 3. Git Gateway

- Dentro de **Identity > Services**, habilitar **Git Gateway**.
- Autorizar acceso al repositorio `Jhonnathansantana/Site_Jhonnathan`.
- Confirmar que la rama es `main`.

## 4. Decap CMS

- Acceder a `https://site-jhonnathan.netlify.app/admin/`.
- Iniciar sesión con la invitación de Identity.
- Verificar que la barra "Asistente IA" aparece al editar una entrada.

## 5. Dominio real

Cuando se configure un dominio personalizado:

- Actualizar `site` en `astro.config.mjs`.
- Descomentar y actualizar `site_url` y `logo_url` en `public/admin/config.yml`.
- Actualizar `ALLOWED_HOSTS` si se usa validación de origen.
```

**Verification:**
- `npm run build` sigue exitoso (documento no afecta build).
- Markdown renderiza correctamente en GitHub.

**Step 2: Commit**

```bash
git add NETLIFY_SETUP.md
git commit -m "docs: guía de configuración en Netlify"
```

---

### Task 9: Build final y push

**Objective:** Verificar que todo el plan compila correctamente y subir cambios.

**Files:**
- (ninguno nuevo)

**Step 1: Build limpio**

```bash
rm -rf dist .astro
npm run build
```

**Expected output:**
- Build exitoso.
- 44+ páginas generadas.
- Pagefind indexa contenido en español.

**Step 2: Push**

```bash
git push origin main
```

---

## Tests / validation

- `npm run build` debe terminar sin errores.
- `npx netlify dev` (con `OPENAI_API_KEY` local) debe responder a POST `/.netlify/functions/ai-assistant` con acción `ideas`.
- `/admin/` debe cargar Decap CMS después de habilitar Identity + Git Gateway.
- `/services` debe generarse y listar 5 tarjetas.
- `/posts` debe mostrar paginación en español cuando haya más de 5 posts.
- `git status` debe mostrar working tree limpio tras el push.

---

## Risks, tradeoffs, and open questions

- **API key:** si no se configura en Netlify, la función devuelve error 500. Esto es intencional para evitar filtraciones.
- **Widget de IA:** depende de la estructura DOM de Decap CMS; puede requerir ajustes si cambia la versión de Decap CMS.
- **Página de Servicios:** se eligió página estática para no complicar el schema de contenido. Si en el futuro se quiere CMS, se puede convertir en colección.
- **Correo:** requiere confirmación del usuario. Si no se proporciona, se mantiene placeholder.
- **Dominio real:** se deja como placeholder hasta que el usuario confirme el dominio definitivo.
- **Rate limiting:** la función actual no limita número de requests. Para producción pública se recomienda agregar límite por IP o sesión.

---

## Post-plan manual steps (no automatizables desde el repo)

1. Configurar `OPENAI_API_KEY` y `OPENAI_MODEL` en Netlify dashboard.
2. Habilitar Netlify Identity y Git Gateway.
3. Invitar administrador del CMS.
4. Actualizar dominio real cuando esté disponible.
5. Confirmar y actualizar correo real en `src/config/social.ts`.
