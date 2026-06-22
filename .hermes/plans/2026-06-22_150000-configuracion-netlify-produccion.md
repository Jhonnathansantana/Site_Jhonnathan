# Configuración de producción en Netlify para Site_Jhonnathan

> **For Hermes:** Implementa este plan directamente en el repo; los pasos que requieren acceso al dashboard de Netlify quedan documentados para ejecución manual del usuario.

**Goal:** Dejar el repositorio completamente preparado para el despliegue en producción en Netlify, con documentación clara de las configuraciones que deben hacerse en el dashboard (variables de entorno, Identity, Git Gateway, dominio).

**Architecture:** El sitio es estático (Astro) con una Netlify Function para el asistente de IA. La clave de OpenAI nunca viaja al frontend; se lee desde variables de entorno del dashboard. Decap CMS usa Netlify Identity + Git Gateway para autenticar editores y escribir en GitHub.

**Tech Stack:** Astro 6, Tailwind CSS 4, Netlify Functions, Decap CMS, Netlify Identity, Git Gateway, OpenAI API.

---

## Current context / assumptions

- Rama activa: `main` en `https://github.com/Jhonnathansantana/Site_Jhonnathan`.
- Build exitoso: 44 páginas, Pagefind indexa 42 páginas / 780 palabras.
- `netlify.toml` ya tiene `[functions] directory = "netlify/functions"` y `NODE_VERSION = "22"`.
- `.env.example` y `NETLIFY_SETUP.md` ya existen pero pueden mejorarse.
- El usuario no ha proporcionado correo real, dominio real ni confirmado la API key en dashboard.
- Node.js local: v22.23.0 vía nvm.

---

## Step-by-step plan

### Task 1: Refinar `.env.example` con comentarios didácticos

**Objective:** Documentar exactamente qué variables necesita cada entorno sin exponer secretos.

**Files:**
- Modify: `.env.example`

**Step 1: Reescribir `.env.example`**

```bash
# Variables de entorno para desarrollo local y producción
# IMPORTANTE: este archivo es solo documentación. Nunca guardes valores reales aquí.
# En local, copia este archivo a `.env` y rellena los valores.
# En Netlify, configura las variables en Site configuration > Environment variables.

# Requerida para el asistente de IA en Decap CMS
OPENAI_API_KEY=***

# Modelo de OpenAI. Recomendado para costos bajos y buen rendimiento en español.
OPENAI_MODEL=gpt-4o-mini

# Opcional: restringe qué dominios pueden llamar a /.netlify/functions/ai-assistant
# Si se omite, por defecto se permiten site-jhonnathan.netlify.app y localhost.
# ALLOWED_HOSTS=site-jhonnathan.netlify.app,localhost

# Opcional: útil solo en desarrollo local para saltar la validación de origen.
# NUNCA habilitar en producción.
# SKIP_ORIGIN_CHECK=true
```

**Verification:**
- `cat .env.example` no contiene ningún valor real.
- `.gitignore` incluye `.env`.

**Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: mejora .env.example con guía de variables"
```

---

### Task 2: Mejorar `NETLIFY_SETUP.md` con captura paso a paso

**Objective:** Crear una guía que un no-desarrollador pueda seguir para configurar producción.

**Files:**
- Modify: `NETLIFY_SETUP.md`

**Step 1: Reescribir documento**

```markdown
# Guía de despliegue y configuración en Netlify

Esta guía asume que el repositorio ya está conectado a Netlify (deploy from GitHub) y que la rama por defecto es `main`.

## 1. Configurar variables de entorno

1. Ir al dashboard de Netlify y seleccionar el sitio.
2. Navegar a **Site configuration > Environment variables**.
3. Agregar estas variables:

   | Variable | Valor | ¿Requerida? |
   |---|---|---|
   | `OPENAI_API_KEY` | La clave que te proporcionó OpenAI | Sí |
   | `OPENAI_MODEL` | `gpt-4o-mini` | Sí |
   | `ALLOWED_HOSTS` | `site-jhonnathan.netlify.app` (o tu dominio real) | Opcional |

4. Guardar. Netlify las inyectará automáticamente en el build y en las functions.

**Importante:** nunca copies `OPENAI_API_KEY` en archivos del repositorio.

## 2. Habilitar Netlify Identity

1. En el dashboard, ir a **Site configuration > Identity**.
2. Hacer clic en **Enable Identity**.
3. En **Registration preferences**, elegir **Invite only** (recomendado para un panel privado).
4. En **External providers**, dejar solo los que necesites (por ejemplo, GitHub).
5. En **Identity > Users**, hacer clic en **Invite users** y enviar invitación a tu correo.

## 3. Habilitar Git Gateway

1. Ir a **Site configuration > Identity > Services**.
2. Hacer clic en **Enable Git Gateway**.
3. Autorizar acceso al repositorio `Jhonnathansantana/Site_Jhonnathan`.
4. Confirmar que la rama seleccionada es `main`.

## 4. Probar Decap CMS

1. Desplegar el sitio (o esperar al deploy automático tras push).
2. Acceder a `https://site-jhonnathan.netlify.app/admin/`.
3. Iniciar sesión con la invitación de Identity.
4. Crear o editar una entrada de blog.
5. Verificar que la barra flotante **Asistente IA** aparece con botones: Sugerir títulos, Borrador, Mejorar texto, Resumir.

## 5. Configurar dominio personalizado (cuando esté disponible)

1. En Netlify, ir a **Domain settings > Add custom domain**.
2. Seguir las instrucciones de DNS.
3. Actualizar en el repositorio:
   - `astro.config.mjs`: cambiar `site` al dominio real.
   - `public/admin/config.yml`: descomentar y actualizar `site_url` y `logo_url`.
   - `ALLOWED_HOSTS` en Netlify si se usa validación de origen.
4. Hacer push de los cambios.

## 6. Configurar correo de contacto (cuando lo confirmes)

Actualizar estos archivos con tu correo real:

- `src/config/social.ts` (enlace "Mail").
- `src/pages/services.astro` (href de las tarjetas de servicio).

## Solución de problemas comunes

- **El asistente de IA devuelve 500:** revisar que `OPENAI_API_KEY` esté configurada y que la cuenta tenga saldo/créditos.
- **Decap CMS no carga:** verificar Identity y Git Gateway habilitados, y que el navegador no bloquee cookies de terceros.
- **Los cambios del CMS no se reflejan:** Git Gateway hace commit a `main`; puede tomar unos minutos en desplegar.
- **Error de origen no permitido:** revisar `ALLOWED_HOSTS` y que el dominio de acceso coincida.
```

**Verification:**
- Markdown renderiza bien en GitHub.
- `npm run build` sigue exitoso.

**Step 2: Commit**

```bash
git add NETLIFY_SETUP.md
git commit -m "docs: guía completa de configuración en Netlify"
```

---

### Task 3: Verificar y mejorar `netlify.toml`

**Objective:** Asegurar que el build, funciones y redirecciones estén correctos.

**Files:**
- Modify: `netlify.toml`

**Step 1: Revisar contenido actual**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"

[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/admin/*"
  to = "/admin/index.html"
  status = 200

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

**Step 2: Agregar redirecciones para SPA de admin y API**

Si `netlify.toml` no tiene las redirecciones anteriores, añadirlas. La redirección `/admin/*` evita 404 al recargar el panel de Decap CMS.

**Verification:**
- `npm run build` exitoso.
- `netlify.toml` es parseable (`python -c "import tomllib; ..."` en Python 3.11+ o cualquier validador online).

**Step 3: Commit**

```bash
git add netlify.toml
git commit -m "chore: redirecciones para admin SPA y API functions"
```

---

### Task 4: Crear script de verificación local opcional

**Objective:** Permitir al usuario probar la función de IA en local sin desplegar.

**Files:**
- Create: `scripts/test-ai-function.js`

**Step 1: Crear script**

```javascript
// Uso: node scripts/test-ai-function.js
// Requiere OPENAI_API_KEY configurada como variable de entorno.

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
    process.exit(1);
  }
}

test();
```

**Verification:**
- Sin `OPENAI_API_KEY` el script falla con mensaje claro.
- Con `npx netlify-cli dev` corriendo y key configurada, responde con ideas.

**Step 2: Commit**

```bash
git add scripts/test-ai-function.js
git commit -m "chore: script para probar función de IA en local"
```

---

### Task 5: Build final y push

**Objective:** Asegurar que todo el repo esté limpio y desplegable.

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

- `npm run build` sin errores.
- `.env.example` no contiene valores reales.
- `NETLIFY_SETUP.md` cubre: variables, Identity, Git Gateway, CMS, dominio, correo, troubleshooting.
- `netlify.toml` tiene build, functions, redirecciones `/admin/*` y `/api/*`.
- `scripts/test-ai-function.js` es ejecutable con Node 22 y verifica `OPENAI_API_KEY`.

---

## Risks, tradeoffs, and open questions

- **API key:** el usuario debe configurarla manualmente en Netlify; no podemos hacerlo desde el repo.
- **Dominio real:** se mantiene placeholder hasta que el usuario lo confirme.
- **Correo real:** se mantiene placeholder hasta que el usuario lo confirme.
- **Netlify Identity/Git Gateway:** requieren intervención manual en el dashboard.
- El script `test-ai-function.js` asume Netlify CLI; si no está instalado, el usuario puede instalarlo con `npm install -g netlify-cli`.

---

## Post-plan manual steps

1. Configurar `OPENAI_API_KEY` y `OPENAI_MODEL` en Netlify dashboard.
2. Habilitar Netlify Identity (Invite only) y Git Gateway.
3. Invitar usuario administrador.
4. Probar `/admin/` con Decap CMS y el asistente de IA.
5. Configurar dominio real y actualizar repo.
6. Configurar correo real y actualizar `src/config/social.ts` y `src/pages/services.astro`.
