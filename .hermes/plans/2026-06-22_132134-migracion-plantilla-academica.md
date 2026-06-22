# Migración a Academic Portfolio Astro — Plan de Implementación

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Reemplazar el sitio actual `Site_Jhonnathan` por la plantilla `rubzip/academic-portfolio-astro`, adaptándola al perfil profesional de Jhonnathan De Jesús Araujo Santana (TI, ciberseguridad, DevOps, docencia) manteniendo español como idioma, blog como sección central, modo oscuro persistente y los servicios/integraciones ya probadas (Pagefind, Decap CMS, asistente IA privado via Netlify Function).

**Architecture:** Partimos del repositorio clonado `academic-portfolio-astro-temp` y trasplantamos su estructura sobre `Site_Jhonnathan`, preservando `.git`, `.hermes/plans/` y las configuraciones de deploy (Netlify + variables de entorno) del proyecto actual. Se adaptan las colecciones de contenido, el layout, los estilos, la navegación y el contenido de ejemplo a la trayectoria real del usuario. Se reintegran Pagefind y Decap CMS siguiendo el patrón ya validado en la versión anterior.

**Tech Stack:** Astro 6.x + Tailwind CSS v4 + TypeScript + React (opcional para widgets) + Zod content collections + KaTeX + Pagefind + Decap CMS + Netlify Functions.

---

## Contexto / Supuestos

- El directorio `academic-portfolio-astro-temp` ya está clonado en `C:\Users\jhonn\Downloads\academic-portfolio-astro-temp`.
- `Site_Jhonnathan` es el proyecto activo en `C:\Users\jhonnn\Downloads\Site_Jhonnathan` y ya tiene repo Git remoto en `https://github.com/Jhonnathansantana/Site_Jhonnathan`.
- Se preservan secretos: `OPENAI_API_KEY` no se versiona; se configura vía `.env` y Netlify dashboard.
- Node.js debe ser >= 22.12.0 para la plantilla. Verificar antes.
- Se decide **no** migrar archivos obsoletos de la estructura anterior (`src/pages/monitoreo.astro`, `staging_local.md`, `mifoto.jpeg` sin usar, etc.) salvo que el usuario lo pida.

---

## Plan de tareas

### Task 1: Backup y limpieza del proyecto actual

**Objective:** Crear una copia de seguridad del `Site_Jhonnathan` actual y limpiar archivos que no se migrarán.

**Files:**
- Create: `../Site_Jhonnathan_backup_<timestamp>.zip` (backup del directorio completo excepto `node_modules` y `dist`).
- Modify: `C:\Users\jhonn\Downloads\Site_Jhonnathan\` (borrar `node_modules`, `dist`, `.astro`, lockfiles y archivos no relevantes).
- Test: `git status --short` debe mostrar solo archivos intencionales.

**Step 1: Backup local**

Run:
```bash
cd /c/Users/jhonn/Downloads
zip -r Site_Jhonnathan_backup_$(date +%Y%m%d_%H%M%S).zip Site_Jhonnathan \
  -x "Site_Jhonnathan/node_modules/*" \
  -x "Site_Jhonnathan/dist/*" \
  -x "Site_Jhonnathan/.astro/*"
```

**Step 2: Limpiar archivos generados**

Run:
```bash
cd /c/Users/jhonn/Downloads/Site_Jhonnathan
rm -rf node_modules dist .astro package-lock.json staging_local.md
```

**Step 3: Verificar estado Git**

Run: `git status --short`
Expected: archivos eliminados marcados como `D` y planes `.hermes/plans/` intactos.

**Step 4: Commit de backup/limpieza**

Run:
```bash
git add -A
git commit -m "chore: backup y limpieza previa a migración académica"
```

---

### Task 2: Copiar estructura de la plantilla académica

**Objective:** Traer todo el código fuente, configuración y assets de `academic-portfolio-astro-temp` al proyecto actual.

**Files:**
- Modify: todo `Site_Jhonnathan` excepto `.git/`, `.hermes/plans/` y `.env`.
- Test: `ls src/config && ls src/content`.

**Step 1: Copiar archivos de plantilla (preservar .git, .hermes y .env)**

Run:
```bash
cd /c/Users/jhonn/Downloads
rsync -av --exclude='.git' --exclude='.hermes' --exclude='.env' \
  academic-portfolio-astro-temp/ Site_Jhonnathan/
```

**Step 2: Restaurar .gitignore de seguridad**

Create/Modify: `C:\Users\jhonn\Downloads\Site_Jhonnathan\.gitignore`

```gitignore
# Dependencies
node_modules/

# Build outputs
dist/
.astro/

# Environment variables
.env
.env.local
.env.production
.env.*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/settings.json
.idea/

# Logs
*.log
npm-debug.log*

# Misc
.cache/
```

**Step 3: Verificar estructura**

Run:
```bash
cd /c/Users/jhonn/Downloads/Site_Jhonnathan
ls src/config src/content src/pages src/layouts
```
Expected: aparecen `site.ts`, `pages.ts`, `navigation.ts`, `social.ts`, `themes.ts`, `bio.md`, `cv.md`, `posts/`, etc.

**Step 4: Commit inicial de migración**

Run:
```bash
cd /c/Users/jhonn/Downloads/Site_Jhonnathan
git add -A
git commit -m "feat: migra estructura base de academic-portfolio-astro"
```

---

### Task 3: Instalar dependencias y verificar build base

**Objective:** Asegurar que Node >= 22.12.0 esté disponible e instalar dependencias de la plantilla.

**Files:**
- Test: `node -v`, `npm run build`.

**Step 1: Verificar Node.js**

Run:
```bash
node -v
```
Expected: `v22.12.0` o superior.

Si es menor, avisar al usuario; no proseguir.

**Step 2: Instalar dependencias**

Run:
```bash
cd /c/Users/jhonn/Downloads/Site_Jhonnathan
npm install
```

**Step 3: Build base sin cambios**

Run:
```bash
npm run build
```
Expected: build exitoso generando `dist/` con el sitio de Claude Shannon de ejemplo.

**Step 4: Commit**

Run:
```bash
git add package-lock.json
git commit -m "chore: instala dependencias de plantilla académica"
```

---

### Task 4: Localizar el sitio a español

**Objective:** Cambiar metadatos, navegación, títulos de sección y contenido de ejemplo a español.

**Files:**
- Modify: `src/config/site.ts`
- Modify: `src/config/pages.ts`
- Modify: `src/config/navigation.ts`
- Modify: `src/config/social.ts` (solo labels si aplica)
- Test: `npm run build`.

**Step 1: Cambiar metadatos del sitio**

Modify `src/config/site.ts`:

```typescript
export const SITE: SiteConfig = {
    website: "https://site-jhonnathan.netlify.app/",
    author: "Jhonnathan De Jesús Araujo Santana",
    desc: "Portafolio académico y profesional de Jhonnathan De Jesús Araujo Santana. TI, ciberseguridad, DevOps y docencia.",
    title: "Jhonnathan De Jesús Araujo Santana",
    ogImage: "jhonnathan.webp",
    postPerPage: 5,
    favicon: "/favicon.svg",
    lang: "es",
};
```

**Step 2: Traducir títulos de páginas**

Modify `src/config/pages.ts`:

```typescript
export const PAGES: PagesConfig = {
    home: { title: "Sobre mí", subtitle: "", isActive: true },
    blog: { title: "Blog", subtitle: "Reflexiones sobre tecnología, ciberseguridad, gestión de TI y educación.", isActive: true },
    publications: { title: "Publicaciones", subtitle: "Artículos, papers y materiales académicos.", isActive: false },
    talks: { title: "Charlas", subtitle: "Presentaciones y conferencias.", isActive: false },
    projects: { title: "Proyectos", subtitle: "Experimentos, repositorios y desarrollo asistido por IA.", isActive: true },
    teaching: { title: "Docencia", subtitle: "Cursos, talleres y materiales educativos.", isActive: true },
    tags: { title: "Etiquetas", subtitle: "Explora contenido por tema.", isActive: true },
    cv: { title: "Currículum", subtitle: "Trayectoria académica y profesional.", isActive: true },
};
```

**Step 3: Traducir navegación**

Modify `src/config/navigation.ts`:

```typescript
export const NAV_LINKS: NavLink[] = [
    { href: "/", label: "Sobre mí", isActive: true },
    { href: "/publications", label: "Publicaciones", isActive: false },
    { href: "/talks", label: "Charlas", isActive: false },
    { href: "/teaching", label: "Docencia", isActive: true },
    { href: "/projects", label: "Proyectos", isActive: true },
    { href: "/posts", label: "Blog", isActive: true },
    { href: "/tags", label: "Etiquetas", isActive: true },
    { href: "/cv", label: "CV", isActive: true },
];
```

**Step 4: Build para verificar traducciones**

Run: `npm run build`
Expected: exitoso.

**Step 5: Commit**

Run:
```bash
git add src/config/
git commit -m "feat: localiza navegación y metadatos a español"
```

---

### Task 5: Configurar datos del perfil profesional

**Objective:** Reemplazar el contenido de ejemplo de Claude Shannon por el perfil real del usuario, extraído de `https://cv.jhonnathan.com.do/` y del contexto actual.

**Files:**
- Modify: `src/content/bio.md`
- Modify: `src/content/cv.md`
- Create: `public/jhonnathan.jpg` o `.webp` (usar foto real si el usuario la proporciona; de lo contrario placeholder).
- Modify: `src/config/social.ts`
- Test: `npm run build`.

**Step 1: Actualizar `src/content/bio.md`**

```markdown
---
name: "Jhonnathan De Jesús Araujo Santana"
avatar: "jhonnathan.jpg"
shortBio: "Gerente de TI, especialista en ciberseguridad, DevOps y docente. Más de 15 años transformando infraestructura, procesos y talento tecnológico en organizaciones de República Dominicana."
institution: "Fundación Sur Futuro · ITLA · INFOTEP"
---

Soy **Gerente de TI** en [Fundación Sur Futuro](https://www.fsf.edu.do), docente en [ITLA](https://www.itla.edu.do) y facilitador en [INFOTEP](https://www.infotep.gob.do). Mi trabajo cruza la **gestión de infraestructura tecnológica**, la **ciberseguridad práctica**, el **monitoreo/DevOps** y la **formación de talento técnico**.

## Trayectoria

Llevo más de 15 años liderando equipos y proyectos de tecnología. He diseñado políticas de seguridad, desplegado centros de monitoreo, automatizado operaciones y capacitado a cientos de estudiantes y profesionales en áreas como redes, seguridad informática, gestión de servicios y desarrollo asistido por inteligencia artificial.

## Intereses

- Ciberseguridad operacional y gobernanza de riesgos digitales.
- DevOps, monitoreo y cultura Site Reliability Engineering (SRE).
- Formación técnica y diseño de currículos orientados a la industria.
- Desarrollo asistido por IA y productividad del desarrollador.
- Liderazgo tecnológico alineado a objetivos de negocio.
```

**Step 2: Actualizar `src/content/cv.md`**

Usar estructura mínima real (ajustar según CV real del usuario):

```markdown
---
name: "Jhonnathan De Jesús Araujo Santana"
title: "Gerente de TI · Ciberseguridad · DevOps · Docente"
experience:
  - role: "Gerente de TI"
    institution: "Fundación Sur Futuro"
    period: "20XX — Presente"
    description: "Liderazgo de la dirección tecnológica, infraestructura, seguridad, soporte y proyectos digitales de la organización."
  - role: "Docente / Facilitador"
    institution: "ITLA / INFOTEP"
    period: "20XX — Presente"
    description: "Diseño y dictado de cursos en redes, ciberseguridad, gestión de TI y herramientas de productividad con IA."
education:
  - degree: "[Título universitario]"
    institution: "[Institución]"
    period: "[Años]"
    description: "[Breve descripción]"
---
```

**Step 3: Actualizar redes sociales**

Modify `src/config/social.ts`:

```typescript
export const SOCIALS: SocialLink[] = [
    {
        name: "Github",
        href: "https://github.com/Jhonnathansantana",
        linkTitle: "Perfil de GitHub de Jhonnathan",
        isActive: true,
    },
    {
        name: "LinkedIn",
        href: "https://www.linkedin.com/in/jhonnathan-de-jesus-araujo-santana/",
        linkTitle: "LinkedIn de Jhonnathan",
        isActive: true,
    },
    {
        name: "Mail",
        href: "mailto:jhonnathan@example.com",
        linkTitle: "Enviar correo a Jhonnathan",
        isActive: true,
    },
];
```

**Step 4: Build**

Run: `npm run build`
Expected: exitoso.

**Step 5: Commit**

Run:
```bash
git add src/content/ src/config/social.ts public/jhonnathan.jpg
git commit -m "feat: reemplaza contenido de ejemplo por perfil profesional real"
```

---

### Task 6: Adaptar colecciones: posts, proyectos, docencia

**Objective:** Eliminar contenido académico de ejemplo (publicaciones, charlas de Shannon) y crear contenido inicial alineado al perfil profesional.

**Files:**
- Delete: `src/content/posts/*.md` (excepto el post de setup si se adapta).
- Delete: `src/content/projects/*.md`.
- Delete: `src/content/publications/` y `src/content/talks/`.
- Create: 3–4 posts iniciales en `src/content/posts/`.
- Create: 2 proyectos en `src/content/projects/`.
- Create: 1–2 ítems en `src/content/teaching/`.
- Test: `npm run build`.

**Step 1: Borrar contenido de ejemplo**

Run:
```bash
rm -rf src/content/posts/* src/content/projects/* src/content/publications src/content/talks
```

**Step 2: Crear posts iniciales**

Create `src/content/posts/por-que-el-blog-ahora.md`:

```markdown
---
title: "Por qué reconstruí mi sitio como blog profesional"
date: "2026-06-22"
description: "De portfolio estático a centro de contenido sobre tecnología, ciberseguridad y gestión de TI."
tags: ["meta", "blog", "carrera"]
author: "Jhonnathan De Jesús Araujo Santana"
---

Decidí convertir mi sitio personal en un espacio de escritura técnica regular...
```

Crear 2–3 posts más sobre: ciberseguridad práctica para PyMEs, monitoreo con herramientas open source, productividad con IA para equipos de TI.

**Step 3: Crear proyectos**

Create `src/content/projects/site-jhonnathan.md`:

```markdown
---
title: "Site Jhonnathan"
description: "Sitio personal/blog construido con Astro, Tailwind CSS y Decap CMS, con asistente de IA privado para edición de contenido."
tags: ["astro", "tailwind", "decap-cms", "ia"]
external_url: "https://github.com/Jhonnathansantana/Site_Jhonnathan"
---
```

Create `src/content/projects/loom-ecf.md`:

```markdown
---
title: "Loom-eCF"
description: "Sistema de facturación electrónica para la DGII (República Dominicana) con React, TypeScript y despliegue en Netlify."
tags: ["react", "typescript", "dgii", "netlify"]
external_url: "https://github.com/Jhonnathansantana/Loom-eCF"
---
```

**Step 4: Crear docencia**

Create `src/content/teaching/ciberseguridad-operacional.md`:

```markdown
---
title: "Ciberseguridad operacional para equipos de TI"
institution: "INFOTEP"
description: "Taller práctico de hardening, gestión de incidentes y cultura de seguridad para técnicos y administradores de sistemas."
tags: ["ciberseguridad", "hardening", "infotep"]
---
```

**Step 5: Build**

Run: `npm run build`
Expected: exitoso; las páginas de publicaciones/talks desactivadas no generan rutas.

**Step 6: Commit**

Run:
```bash
git add src/content/
git commit -m "feat: contenido inicial adaptado al perfil profesional"
```

---

### Task 7: Ajustar tipografía a Noto Sans

**Objective:** Reemplazar Inter por Noto Sans (preferencia del usuario) respetando el sistema de fuentes self-hosted de la plantilla.

**Files:**
- Modify: `package.json` (reemplazar `@fontsource/inter` por `@fontsource/noto-sans` o `@fontsource-variable/noto-sans`).
- Modify: `src/layouts/BaseLayout.astro` (imports de fuente).
- Modify: `src/styles/global.css` (font-family base).
- Test: `npm run build`.

**Step 1: Instalar Noto Sans**

Run:
```bash
npm uninstall @fontsource/inter @fontsource-variable/inter
npm install @fontsource-variable/noto-sans
```

**Step 2: Actualizar imports**

Modify `src/layouts/BaseLayout.astro`:

```astro
---
import "@fontsource-variable/noto-sans/wght.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "katex/dist/katex.min.css";
import "../styles/global.css";
```

**Step 3: Actualizar CSS base**

Modify `src/styles/global.css`:

```css
html {
    font-family: "Noto Sans Variable", "Noto Sans", system-ui, sans-serif;
    scroll-behavior: smooth;
}
```

**Step 4: Build**

Run: `npm run build`
Expected: exitoso.

**Step 5: Commit**

Run:
```bash
git add package.json package-lock.json src/layouts/BaseLayout.astro src/styles/global.css
git commit -m "feat: adopta tipografía Noto Sans"
```

---

### Task 8: Ajustar paleta de colores y modo oscuro persistente

**Objective:** Aplicar colores de baja saturación, alto contraste, eye-friendly, y evitar flash de tema al cargar.

**Files:**
- Modify: `src/config/themes.ts`.
- Modify: `src/styles/global.css`.
- Modify: `src/layouts/BaseLayout.astro` (script inline para tema inicial).
- Test: build + inspección visual del toggle.

**Step 1: Definir temas personalizados**

Modify `src/config/themes.ts`:

```typescript
export const THEMES: Record<string, Theme> = {
    light_default: {
        background: "#f7f8fa",
        foreground: "#1a1d21",
        accent: "#2563eb",
        muted: "#5f6773",
        border: "#e2e5e9",
        surface: "#ffffff",
        isDark: false,
    },
    dark_default: {
        background: "#121519",
        foreground: "#e8eaed",
        accent: "#60a5fa",
        muted: "#8b929d",
        border: "#2c3036",
        surface: "#1b1f24",
        isDark: true,
    },
};
```

(Dejar solo los necesarios o mantener notepad como alternativa si se desea.)

**Step 2: Script anti-flash en `<head>`**

Modify `src/layouts/BaseLayout.astro` agregando antes del cierre `</head>`:

```astro
<script is:inline>
  (function () {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved ? saved : prefersDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
  })();
</script>
```

Asegurar que el selector de tema persista en `localStorage` y use `data-theme`.

**Step 3: Build**

Run: `npm run build`
Expected: exitoso.

**Step 4: Commit**

Run:
```bash
git add src/config/themes.ts src/styles/global.css src/layouts/BaseLayout.astro
git commit -m "feat: ajusta paleta eye-friendly y modo oscuro persistente"
```

---

### Task 9: Reintegrar Pagefind

**Objective:** Volver a tener búsqueda full-text con Pagefind, indexando el build estático.

**Files:**
- Modify: `package.json` (agregar `pagefind` como devDependency y script de postbuild).
- Modify: `astro.config.mjs` si es necesario marcar `/pagefind/pagefind.js` como external.
- Create: `src/components/Search.astro` (o adaptar el existente de la versión anterior).
- Modify: `src/pages/posts/[...page].astro` o `src/pages/index.astro` para incluir Search si aplica.
- Test: build + verificar `dist/pagefind/`.

**Step 1: Agregar Pagefind**

Run:
```bash
npm install -D pagefind
```

**Step 2: Agregar script postbuild**

Modify `package.json`:

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "astro": "astro",
  "postbuild": "pagefind --site dist"
}
```

**Step 3: Marcar pagefind como external**

Modify `astro.config.mjs` si el build de Vite falla:

```javascript
vite: {
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      external: ["/pagefind/pagefind.js"],
    },
  },
},
```

**Step 4: Crear componente de búsqueda**

Create `src/components/Search.astro` con el widget de Pagefind y botón de limpiar.

**Step 5: Agregar Search al blog**

Modify `src/pages/posts/[...page].astro`:

```astro
---
import Search from "../../components/Search.astro";
---

<BaseListing ...>
  <Search slot="header-extra" />
</BaseListing>
```

(Si `BaseListing` no acepta slots, colocar Search justo antes de `BaseListing`.)

**Step 6: Build**

Run: `npm run build`
Expected: build exitoso; `dist/pagefind/` contiene `pagefind.js`, `pagefind-ui.css`, etc.

**Step 7: Commit**

Run:
```bash
git add package.json package-lock.json astro.config.mjs src/components/Search.astro src/pages/posts/[...page].astro
git commit -m "feat: reintegra Pagefind para búsqueda full-text"
```

---

### Task 10: Reintegrar Decap CMS y asistente IA privado

**Objective:** Recuperar el panel `/admin/` de Decap CMS con autenticación Git Gateway y el widget de asistente IA seguro vía Netlify Function.

**Files:**
- Create: `public/admin/config.yml`.
- Create: `public/admin/index.html`.
- Create: `public/admin/cms-ai-widget.js`.
- Create: `netlify/functions/ai-assistant.js`.
- Modify: `netlify.toml`.
- Create: `.env.example`.
- Modify: `.gitignore`.
- Test: build + verificar archivos en `dist/admin/`.

**Step 1: Crear `public/admin/config.yml`**

```yaml
backend:
  name: git-gateway
  branch: master
  repo: Jhonnathansantana/Site_Jhonnathan

# site_url y logo_url se actualizarán cuando exista dominio real
# site_url: https://site-jhonnathan.netlify.app
# logo_url: https://site-jhonnathan.netlify.app/logo.svg

media_folder: "public/images/uploads"
public_folder: "/images/uploads"

locale: es

collections:
  - name: "posts"
    label: "Entradas del blog"
    folder: "src/content/posts"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - { label: "Título", name: "title", widget: "string" }
      - { label: "Fecha", name: "date", widget: "datetime", date_format: "YYYY-MM-DD", time_format: false }
      - { label: "Descripción", name: "description", widget: "text", required: false }
      - { label: "Autor", name: "author", widget: "string", default: "Jhonnathan De Jesús Araujo Santana" }
      - { label: "Etiquetas", name: "tags", widget: "list", required: false }
      - { label: "URL externa", name: "external_url", widget: "string", required: false }
      - { label: "Imagen destacada", name: "image", widget: "image", required: false }
      - { label: "Cuerpo", name: "body", widget: "markdown" }

  - name: "projects"
    label: "Proyectos"
    folder: "src/content/projects"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Título", name: "title", widget: "string" }
      - { label: "Descripción", name: "description", widget: "text" }
      - { label: "Etiquetas", name: "tags", widget: "list", required: false }
      - { label: "URL externa", name: "external_url", widget: "string", required: false }
      - { label: "Imagen", name: "image", widget: "image", required: false }
      - { label: "Cuerpo", name: "body", widget: "markdown", required: false }

  - name: "teaching"
    label: "Docencia"
    folder: "src/content/teaching"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Título", name: "title", widget: "string" }
      - { label: "Institución", name: "institution", widget: "string" }
      - { label: "Descripción", name: "description", widget: "text" }
      - { label: "Etiquetas", name: "tags", widget: "list", required: false }
      - { label: "URL externa", name: "external_url", widget: "string", required: false }
      - { label: "Cuerpo", name: "body", widget: "markdown", required: false }
```

**Step 2: Crear `public/admin/index.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin — Jhonnathan De Jesús Araujo Santana</title>
  <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
</head>
<body>
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
  <script src="./cms-ai-widget.js"></script>
</body>
</html>
```

**Step 3: Crear widget de IA**

Create `public/admin/cms-ai-widget.js` (reutilizar/adaptar la versión anterior que llama a `/.netlify/functions/ai-assistant`).

**Step 4: Crear Netlify Function**

Create `netlify/functions/ai-assistant.js` (reutilizar lógica anterior):

```javascript
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "API key no configurada" }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Cuerpo inválido" }) };
  }

  const { messages } = body;
  if (!Array.isArray(messages)) {
    return { statusCode: 400, body: JSON.stringify({ error: "messages debe ser un array" }) };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, temperature: 0.7 }),
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

**Step 5: Configurar `netlify.toml`**

Create/Modify `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"

[functions]
  directory = "netlify/functions"
```

**Step 6: Crear `.env.example`**

Create `.env.example`:

```bash
OPENAI_API_KEY=***
OPENAI_MODEL=gpt-4o-mini
```

**Step 7: Verificar `.gitignore`**

Asegurar que `.env` y archivos de credenciales estén ignorados.

**Step 8: Build**

Run: `npm run build`
Expected: exitoso; `dist/admin/` debe existir.

**Step 9: Commit**

Run:
```bash
git add public/admin/ netlify/ netlify.toml .env.example .gitignore
git commit -m "feat: reintegra Decap CMS y asistente IA privado via Netlify Function"
```

---

### Task 11: Configurar dominio, base path y SEO

**Objective:** Ajustar `astro.config.mjs` para despliegue en Netlify (sin subpath `/academic-portfolio-astro`), sitemap en español y metadatos correctos.

**Files:**
- Modify: `astro.config.mjs`.
- Modify: `public/robots.txt` si existe.
- Test: build.

**Step 1: Actualizar astro.config.mjs**

Modify `astro.config.mjs`:

```javascript
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  build: {
    inlineStylesheets: "always",
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        external: ["/pagefind/pagefind.js"],
      },
    },
  },
  site: "https://site-jhonnathan.netlify.app",
  base: "/",
  integrations: [sitemap()],
});
```

**Step 2: Build**

Run: `npm run build`
Expected: exitoso.

**Step 3: Commit**

Run:
```bash
git add astro.config.mjs
git commit -m "chore: configura site y base path para Netlify"
```

---

### Task 12: Verificación final, push y checklist de deploy

**Objective:** Validar build completo, sin errores, con contenido real; empujar a GitHub; indicar pasos manuales restantes.

**Files:**
- Test: `npm run build`.
- Test: `git push origin master`.

**Step 1: Build final**

Run:
```bash
cd /c/Users/jhonn/Downloads/Site_Jhonnathan
npm run build
```
Expected: build exitoso; genera `dist/` con home, blog, posts, proyectos, docencia, CV y admin.

**Step 2: Verificar estructura dist**

Run:
```bash
ls dist/ | head -20
ls dist/admin/ dist/pagefind/ 2>/dev/null || true
```
Expected: existen `index.html`, `admin/index.html`, `pagefind/`.

**Step 3: Push a GitHub**

Run:
```bash
git push origin master
```
Expected: subida exitosa.

**Step 4: Documentar pasos manuales**

Actualizar `README.md` con:
- Variables de entorno `OPENAI_API_KEY` y `OPENAI_MODEL` en Netlify.
- Habilitar Netlify Identity + Git Gateway.
- Actualizar URLs reales cuando se disponga del dominio.

**Step 5: Commit final**

Run:
```bash
git add README.md
git commit -m "docs: actualiza README con instrucciones de deploy"
```

---

## Tests / Validación

- `npm run build` debe ejecutarse sin errores en cada tarea.
- `dist/pagefind/` debe existir tras el postbuild.
- `dist/admin/` debe contener `index.html`, `config.yml` y `cms-ai-widget.js`.
- Navegación debe mostrar solo secciones activas en español.
- Modo oscuro debe persistir sin flash al recargar.
- No debe existir `OPENAI_API_KEY` en ningún archivo versionado.

---

## Riesgos, tradeoffs y preguntas abiertas

- **Tailwind v4 vs v3:** la plantilla usa v4 sin `tailwind.config.js`; si el usuario tenía componentes/estilos custom en la versión anterior, habrá que reescribirlos o descartarlos.
- **Node 22:** requerimiento estricto de la plantilla; si el entorno no lo tiene, la migración se bloquea.
- **Contenido académico:** se eliminan `publications` y `talks` por defecto; si el usuario quiere publicar papers/charlas futuras, solo hay que activarlas en `PAGES` y crear contenido.
- **Foto real:** si no se dispone de `public/jhonnathan.jpg`, se deja un placeholder y se documenta.
- **API key:** la clave previa ([REDACTED]) se configura manualmente; no se escribe en repo.

---

## Archivos que cambiarán

- `package.json`, `package-lock.json`
- `astro.config.mjs`
- `src/config/site.ts`, `src/config/pages.ts`, `src/config/navigation.ts`, `src/config/social.ts`, `src/config/themes.ts`
- `src/layouts/BaseLayout.astro`
- `src/styles/global.css`
- `src/content/bio.md`, `src/content/cv.md`
- `src/content/posts/*.md`, `src/content/projects/*.md`, `src/content/teaching/*.md`
- `src/components/Search.astro`
- `public/admin/config.yml`, `public/admin/index.html`, `public/admin/cms-ai-widget.js`
- `netlify/functions/ai-assistant.js`, `netlify.toml`
- `.env.example`, `.gitignore`, `README.md`

---

## Ejecución recomendada

Plan complete and saved. Ready to execute using subagent-driven-development — I'll dispatch a fresh subagent per task with two-stage review (spec compliance then code quality). Shall I proceed?
