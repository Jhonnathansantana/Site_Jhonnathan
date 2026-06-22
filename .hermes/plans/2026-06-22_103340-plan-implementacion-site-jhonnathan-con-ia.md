# Plan de Implementación: Site_Jhonnathan (con IA de redacción en Decap CMS)

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Construir un blog personal y profesional moderno, rápido y accesible con Astro, React islands, Tailwind CSS personalizado, Decap CMS y asistente de IA privado para sugerir borradores de posts.

**Architecture:** Sitio estático generado con Astro. Componentes interactivos livianos con React islands. Contenido editorial gestionado vía Markdown + Decap CMS. Diseño visual propio sobre Tailwind con tipografía Noto Sans, paleta semántica de alto contraste y modo oscuro automático/manual. Búsqueda local con Pagefind. Asistente de IA en Decap CMS protegido por Netlify Function.

**Tech Stack:**
- Astro 5
- React 19 (islands)
- Tailwind CSS 4 con capa de diseño propia
- Decap CMS (Git-based)
- Pagefind
- Netlify Functions
- OpenAI API (o Gemini API si se prefiere)
- Netlify (hosting)

---

## Decisiones de diseño

- **Tipografía:** Noto Sans para todo el cuerpo.
- **Paleta:** Colores de baja saturación, alto contraste. Fondos cálidos en modo claro (`stone`) y grises fríos en modo oscuro (`slate`).
- **Modo oscuro:** Sistema automático (`prefers-color-scheme`) + toggle manual persistente.
- **Técnicas UX/UI:** jerarquía tipográfica clara, espaciado generoso, líneas de lectura controladas, botones grandes, feedback en interacciones, accesibilidad básica.

---

## Funcionalidad de IA

**Alcance:** Privada, solo dentro del panel de Decap CMS.

**Casos de uso:**
1. Generar borrador de post a partir de un tema o notas.
2. Sugerir títulos para un borrador existente.
3. Mejorar/resumir un texto escrito.
4. Generar ideas de temas para el blog.

**Seguridad:** La API key nunca se expone al navegador. Se usa Netlify Function como proxy.

---

## Fases y tareas

### FASE 1: Setup del proyecto

#### Task 1.1: Crear proyecto Astro

**Objective:** Tener el esqueleto base del proyecto corriendo.

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `README.md`

**Step 1: Bootstrap**

Run:
```bash
npm create astro@latest Site_Jhonnathan -- --template minimal --install --git --typescript strict
```

Expected output: proyecto creado con Astro 5 y TypeScript estricto.

**Step 2: Instalar dependencias**

Run:
```bash
npm install @astrojs/react @astrojs/tailwind react react-dom
npm install -D tailwindcss postcss autoprefixer
```

**Step 3: Configurar Astro con React y Tailwind**

Create/modify: `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), tailwind({ applyBaseStyles: false })],
  site: 'https://site-jhonnathan.netlify.app',
});
```

**Step 4: Verificar build**

Run:
```bash
npm run build
```

Expected: build exitosa sin errores, carpeta `dist/` generada.

**Step 5: Commit**

```bash
git add .
git commit -m "chore: setup Astro + React + Tailwind"
```

---

#### Task 1.2: Configurar Tailwind con capa de diseño propia

**Objective:** Definir tipografía Noto Sans, paleta semántica y modo oscuro base.

**Files:**
- Create: `src/styles/global.css`
- Create: `tailwind.config.js`
- Create: `src/pages/design-system.astro`

**Step 1: Crear global.css con Noto Sans y variables CSS**

Create: `src/styles/global.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@font-face {
  font-family: 'Noto Sans';
  src: url('/fonts/NotoSans-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Noto Sans';
  src: url('/fonts/NotoSans-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@layer base {
  :root {
    --font-sans: 'Noto Sans', system-ui, sans-serif;

    --color-bg: 255 251 245;
    --color-surface: 255 255 255;
    --color-text: 28 25 23;
    --color-muted: 120 113 108;
    --color-primary: 41 37 36;
    --color-accent: 180 83 9;
    --color-border: 231 229 228;
    --color-focus: 180 83 9;
  }

  [data-theme='dark'] {
    --color-bg: 12 10 9;
    --color-surface: 28 25 23;
    --color-text: 245 245 244;
    --color-muted: 168 162 158;
    --color-primary: 250 245 235;
    --color-accent: 251 191 36;
    --color-border: 68 64 60;
    --color-focus: 251 191 36;
  }

  html {
    font-family: var(--font-sans);
    background-color: rgb(var(--color-bg));
    color: rgb(var(--color-text));
  }
}
```

**Step 2: Configurar tailwind.config.js**

Create: `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      colors: {
        bg: 'rgb(var(--color-bg))',
        surface: 'rgb(var(--color-surface))',
        text: 'rgb(var(--color-text))',
        muted: 'rgb(var(--color-muted))',
        primary: 'rgb(var(--color-primary))',
        accent: 'rgb(var(--color-accent))',
        border: 'rgb(var(--color-border))',
        focus: 'rgb(var(--color-focus))',
      },
      lineHeight: {
        relaxed: '1.75',
      },
      maxWidth: {
        readable: '65ch',
      },
    },
  },
  plugins: [],
};
```

**Step 3: Descargar Noto Sans a public/fonts**

- `public/fonts/NotoSans-Regular.woff2`
- `public/fonts/NotoSans-Bold.woff2`

**Step 4: Crear página de design system**

Create: `src/pages/design-system.astro`

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Design System">
  <main class="mx-auto max-w-readable px-6 py-20">
    <h1 class="text-4xl font-bold tracking-tight">Design System</h1>
    <p class="mt-4 text-muted">Tipografía Noto Sans, colores semánticos, modo oscuro.</p>

    <section class="mt-12 space-y-6">
      <h2 class="text-2xl font-bold">Paleta</h2>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div class="h-24 rounded-lg bg-bg border border-border" />
        <div class="h-24 rounded-lg bg-surface border border-border" />
        <div class="h-24 rounded-lg bg-text" />
        <div class="h-24 rounded-lg bg-accent" />
      </div>
    </section>

    <section class="mt-12 space-y-6">
      <h2 class="text-2xl font-bold">Tipografía</h2>
      <p class="text-sm text-muted">Texto pequeño / muted</p>
      <p class="text-base">Cuerpo de texto en Noto Sans. Optimizado para lectura prolongada.</p>
      <p class="text-xl font-bold">Título en 20px con peso bold.</p>
    </section>
  </main>
</Layout>
```

**Step 5: Verificar visualmente**

Run:
```bash
npm run dev
```

Abrir `http://localhost:4321/design-system` y verificar Noto Sans, colores y sin errores de consola.

**Step 6: Commit**

```bash
git add .
git commit -m "feat: add custom Tailwind design system with Noto Sans"
```

---

#### Task 1.3: Implementar toggle de modo oscuro persistente

**Objective:** Permitir modo oscuro automático + manual con persistencia en localStorage.

**Files:**
- Create: `src/components/ThemeToggle.tsx`
- Modify: `src/layouts/Layout.astro`
- Modify: `src/styles/global.css`

**Step 1: Crear ThemeToggle como React island**

Create: `src/components/ThemeToggle.tsx`

```tsx
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  if (!mounted) return <button aria-label="Cambiar tema" className="h-10 w-10" />;

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
      className="h-10 w-10 rounded-full border border-border bg-surface text-text hover:bg-border focus:outline-none focus:ring-2 focus:ring-focus"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

**Step 2: Agregar script inline anti-flash**

Modify: `src/layouts/Layout.astro`

```astro
---
export interface Props {
  title: string;
  description?: string;
}
const { title, description = 'Blog personal y profesional de Jhonnathan' } = Astro.props;
---

<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <script is:inline>
      (function () {
        const saved = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = saved || (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
      })();
    </script>
  </head>
  <body class="min-h-screen bg-bg text-text antialiased transition-colors duration-300">
    <slot />
  </body>
</html>
```

**Step 3: Verificar toggle**

Run:
```bash
npm run dev
```

Abrir cualquier página, cambiar el toggle y recargar. Verificar que no hay flash de modo claro.

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add persistent dark mode toggle"
```

---

### FASE 2: Layout y componentes base

#### Task 2.1: Crear layout principal y navegación

**Objective:** Tener un layout común con Navbar responsive y Footer.

**Files:**
- Create: `src/layouts/Layout.astro`
- Create: `src/components/Navbar.tsx`
- Create: `src/components/Footer.astro`
- Modify: `src/pages/index.astro`

**Step 1: Layout base con Navbar y Footer**

Use el Layout de Task 1.3 y agregar slots para header/footer.

**Step 2: Navbar responsive**

Create: `src/components/Navbar.tsx`

```tsx
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/sobre-mi', label: 'Sobre mí' },
  { href: '/blog', label: 'Blog' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/portafolio', label: 'Portafolio' },
  { href: '/contacto', label: 'Contacto' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur">
      <nav className="mx-auto flex max-w-readable items-center justify-between px-6 py-4">
        <a href="/" className="text-lg font-bold tracking-tight">Jhonnathan</a>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted hover:text-text focus:outline-none focus:ring-2 focus:ring-focus"
            >
              {l.label}
            </a>
          ))}
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            className="h-10 w-10 rounded-full border border-border bg-surface text-text"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border px-6 py-4 md:hidden">
          <ul className="space-y-3">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="block text-muted hover:text-text">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
```

**Step 3: Footer**

Create: `src/components/Footer.astro`

```astro
---
const year = new Date().getFullYear();
---

<footer class="border-t border-border bg-surface py-10">
  <div class="mx-auto max-w-readable px-6 text-center text-sm text-muted">
    <p>© {year} Jhonnathan. Todos los derechos reservados.</p>
  </div>
</footer>
```

**Step 4: Actualizar Layout.astro**

```astro
<body class="min-h-screen bg-bg text-text antialiased transition-colors duration-300">
  <Navbar client:load />
  <main id="main-content" class="mx-auto max-w-readable px-6 py-16">
    <slot />
  </main>
  <Footer />
</body>
```

**Step 5: Verificar responsive**

Run:
```bash
npm run dev
```

Redimensionar a móvil, probar menú hamburguesa, probar tema oscuro.

**Step 6: Commit**

```bash
git add .
git commit -m "feat: add Navbar, Footer and main Layout"
```

---

#### Task 2.2: Crear componentes base reutilizables

**Objective:** Tener botones, tarjetas y tipografía base consistentes.

**Files:**
- Create: `src/components/Button.astro`
- Create: `src/components/Card.astro`
- Create: `src/components/Prose.astro`

**Step 1: Button**

```astro
---
export interface Props {
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}
const { href, variant = 'primary' } = Astro.props;

const base = 'inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2';
const variants = {
  primary: 'bg-primary text-bg hover:opacity-90',
  secondary: 'bg-accent text-text hover:brightness-105',
  ghost: 'border border-border bg-surface text-text hover:bg-border',
};
const classes = `${base} ${variants[variant]}`;
---

{href ? (
  <a href={href} class={classes}><slot /></a>
) : (
  <button class={classes}><slot /></button>
)}
```

**Step 2: Card**

```astro
---
export interface Props {
  title: string;
  href?: string;
  description?: string;
  meta?: string;
}
const { title, href, description, meta } = Astro.props;
---

<article class="rounded-xl border border-border bg-surface p-6 transition hover:border-focus focus-within:border-focus">
  {meta && <p class="text-xs uppercase tracking-wider text-muted">{meta}</p>}
  <h3 class="mt-2 text-xl font-bold">
    {href ? <a href={href} class="hover:text-accent focus:outline-none">{title}</a> : title}
  </h3>
  {description && <p class="mt-2 text-muted">{description}</p>}
</article>
```

**Step 3: Prose**

```astro
---
---

<div class="prose prose-stone max-w-readable dark:prose-invert">
  <slot />
</div>
```

**Step 4: Instalar @tailwindcss/typography**

Run:
```bash
npm install -D @tailwindcss/typography
```

Modify `tailwind.config.js` agregando el plugin.

**Step 5: Verificar en design-system**

Actualizar `design-system.astro` con Button, Card y Prose. Verificar visualmente.

**Step 6: Commit**

```bash
git add .
git commit -m "feat: add Button, Card and Prose components"
```

---

### FASE 3: Páginas estáticas

#### Task 3.1: Página de inicio (Hero + CTAs)

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Hero con presentación clara**

```astro
---
import Layout from '../layouts/Layout.astro';
import Button from '../components/Button.astro';
---

<Layout title="Jhonnathan — Blog profesional">
  <section class="py-20 text-center">
    <p class="text-sm font-bold uppercase tracking-widest text-accent">Consultor · Desarrollador · Escritor</p>
    <h1 class="mx-auto mt-6 max-w-2xl text-4xl font-bold leading-tight md:text-6xl">
      Construyo productos digitales con enfoque en resultados.
    </h1>
    <p class="mx-auto mt-6 max-w-readable text-lg text-muted">
      Comparto lo que aprendo sobre desarrollo, producto y tecnología. También ayudo a equipos a lanzar mejor software.
    </p>
    <div class="mt-10 flex flex-wrap justify-center gap-4">
      <Button href="/servicios" variant="primary">Ver servicios</Button>
      <Button href="/blog" variant="ghost">Leer el blog</Button>
    </div>
  </section>
</Layout>
```

**Step 2: Verificar en desktop y móvil**

Run:
```bash
npm run dev
```

**Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add homepage hero"
```

---

#### Task 3.2: Página Sobre mí

**Files:**
- Create: `src/pages/sobre-mi.astro`
- Create: `public/images/profile.jpg` (foto del usuario)

**Step 1: Estructura con foto, bio y valores**

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Sobre mí — Jhonnathan">
  <h1 class="text-3xl font-bold">Sobre mí</h1>
  <div class="mt-8 grid gap-10 md:grid-cols-[200px_1fr]">
    <img src="/images/profile.jpg" alt="Foto de Jhonnathan" class="aspect-square w-full rounded-xl object-cover" />
    <div class="space-y-4 text-lg leading-relaxed text-muted">
      <p class="text-text">[Aquí va la bio del usuario. Mínimo 2 párrafos: quién es, qué hace y qué le interesa.]</p>
      <p>Experiencia, herramientas y forma de trabajo.</p>
    </div>
  </div>

  <section class="mt-16">
    <h2 class="text-2xl font-bold">Valores</h2>
    <ul class="mt-4 grid gap-4 sm:grid-cols-2">
      <li class="rounded-lg border border-border p-4">Claridad sobre complejidad.</li>
      <li class="rounded-lg border border-border p-4">Software que resuelve problemas reales.</li>
      <li class="rounded-lg border border-border p-4">Aprendizaje continuo.</li>
      <li class="rounded-lg border border-border p-4">Colaboración remota efectiva.</li>
    </ul>
  </section>
</Layout>
```

**Step 2: Placeholder de foto**

Si no hay foto aún, usar un SVG placeholder neutro en `public/images/profile.svg`.

**Step 3: Commit**

```bash
git add src/pages/sobre-mi.astro public/images
git commit -m "feat: add about page"
```

---

#### Task 3.3: Página Servicios

**Files:**
- Create: `src/pages/servicios.astro`
- Create: `src/data/services.json`

**Step 1: Listado de servicios en JSON**

```json
[
  {
    "title": "Consultoría técnica",
    "description": "Ayudo a equipos a tomar mejores decisiones de arquitectura, stack y procesos.",
    "price": "Desde $X"
  },
  {
    "title": "Desarrollo web",
    "description": "Sitios rápidos, accesibles y fáciles de mantener con Astro, React o el stack que corresponda.",
    "price": "Desde $X"
  },
  {
    "title": "Mentoría",
    "description": "Sesiones 1:1 para desarrolladores que quieren crecer en arquitectura frontend, producto o carrera.",
    "price": "Desde $X"
  }
]
```

**Step 2: Página**

```astro
---
import Layout from '../layouts/Layout.astro';
import Card from '../components/Card.astro';
import Button from '../components/Button.astro';
import services from '../data/services.json';
---

<Layout title="Servicios — Jhonnathan">
  <h1 class="text-3xl font-bold">Servicios</h1>
  <p class="mt-4 text-muted">Cómo puedo ayudarte.</p>

  <div class="mt-10 grid gap-6 sm:grid-cols-2">
    {services.map((s) => (
      <Card title={s.title} description={s.description} meta={s.price} />
    ))}
  </div>

  <div class="mt-12 text-center">
    <Button href="/contacto" variant="primary">Hablemos</Button>
  </div>
</Layout>
```

**Step 3: Commit**

```bash
git add src/pages/servicios.astro src/data/services.json
git commit -m "feat: add services page"
```

---

#### Task 3.4: Página Portafolio

**Files:**
- Create: `src/pages/portafolio.astro`
- Create: `src/data/projects.json`

**Step 1: JSON de proyectos**

```json
[
  {
    "title": "Loom-eCF",
    "description": "Facturación electrónica integrada con DGII.",
    "tags": ["React", "TypeScript", "Netlify"],
    "url": "https://loom-ecf.com"
  }
]
```

**Step 2: Página con grid y tags**

```astro
---
import Layout from '../layouts/Layout.astro';
import projects from '../data/projects.json';
---

<Layout title="Portafolio — Jhonnathan">
  <h1 class="text-3xl font-bold">Portafolio</h1>
  <p class="mt-4 text-muted">Proyectos seleccionados.</p>

  <div class="mt-10 grid gap-6 sm:grid-cols-2">
    {projects.map((p) => (
      <article class="rounded-xl border border-border bg-surface p-6">
        <h3 class="text-xl font-bold"><a href={p.url} target="_blank" rel="noopener" class="hover:text-accent">{p.title}</a></h3>
        <p class="mt-2 text-muted">{p.description}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          {p.tags.map((t) => <span class="rounded-full bg-border px-3 py-1 text-xs text-muted">{t}</span>)}
        </div>
      </article>
    ))}
  </div>
</Layout>
```

**Step 3: Commit**

```bash
git add src/pages/portafolio.astro src/data/projects.json
git commit -m "feat: add portfolio page"
```

---

#### Task 3.5: Página Contacto

**Files:**
- Create: `src/pages/contacto.astro`

**Step 1: Formulario simple + enlaces directos**

```astro
---
import Layout from '../layouts/Layout.astro';
import Button from '../components/Button.astro';
---

<Layout title="Contacto — Jhonnathan">
  <h1 class="text-3xl font-bold">Contacto</h1>
  <p class="mt-4 text-muted">¿Tienes un proyecto o pregunta? Escríbeme.</p>

  <form name="contact" method="POST" data-netlify="true" class="mt-10 space-y-6">
    <div>
      <label for="name" class="block text-sm font-bold">Nombre</label>
      <input id="name" name="name" type="text" required class="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-3 text-text focus:border-focus focus:outline-none focus:ring-1 focus:ring-focus" />
    </div>
    <div>
      <label for="email" class="block text-sm font-bold">Correo</label>
      <input id="email" name="email" type="email" required class="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-3 text-text focus:border-focus focus:outline-none focus:ring-1 focus:ring-focus" />
    </div>
    <div>
      <label for="message" class="block text-sm font-bold">Mensaje</label>
      <textarea id="message" name="message" rows="5" required class="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-3 text-text focus:border-focus focus:outline-none focus:ring-1 focus:ring-focus"></textarea>
    </div>
    <Button variant="primary">Enviar mensaje</Button>
  </form>

  <p class="mt-8 text-sm text-muted">O escríbeme directamente a: <a href="mailto:hola@jhonnathan.com" class="text-accent hover:underline">hola@jhonnathan.com</a></p>
</Layout>
```

**Step 2: Commit**

```bash
git add src/pages/contacto.astro
git commit -m "feat: add contact page with Netlify form"
```

---

### FASE 4: Blog con Content Collections

#### Task 4.1: Configurar Content Collections de Astro

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/blog/primer-post.md`
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[slug].astro`

**Step 1: Esquema de colección blog**

Create: `src/content/config.ts`

```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().max(120),
    description: z.string().max(240),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
    cover: z.string().optional(),
  }),
});

export const collections = { blog };
```

**Step 2: Post de ejemplo**

Create: `src/content/blog/primer-post.md`

```md
---
title: "Cómo construí este sitio con Astro"
description: "Decisiones técnicas, diseño y flujo de contenido de un blog moderno."
pubDate: 2026-06-22
tags: ["astro", "tailwind", "desarrollo-web"]
category: "desarrollo"
---

Contenido del artículo.
```

**Step 3: Commit**

```bash
git add src/content
git commit -m "feat: add Astro content collections for blog"
```

---

#### Task 4.2: Listado de posts

**Files:**
- Create: `src/pages/blog/index.astro`

**Step 1: Página de listado con filtros básicos**

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../../layouts/Layout.astro';
import Card from '../../components/Card.astro';

const posts = await getCollection('blog', (p) => !p.data.draft);
posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
---

<Layout title="Blog — Jhonnathan">
  <h1 class="text-3xl font-bold">Blog</h1>
  <p class="mt-4 text-muted">Artículos sobre desarrollo, producto y tecnología.</p>

  <div class="mt-10 grid gap-6">
    {posts.map((post) => (
      <Card
        href={`/blog/${post.slug}`}
        title={post.data.title}
        description={post.data.description}
        meta={post.data.pubDate.toLocaleDateString('es-ES', { dateStyle: 'long' })}
      />
    ))}
  </div>
</Layout>
```

**Step 2: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat: add blog post list"
```

---

#### Task 4.3: Página individual de post

**Files:**
- Create: `src/pages/blog/[slug].astro`

**Step 1: Página dinámica con estilos de lectura**

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../../layouts/Layout.astro';
import Prose from '../../components/Prose.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<Layout title={`${post.data.title} — Jhonnathan`} description={post.data.description}>
  <article>
    <p class="text-sm text-muted">{post.data.pubDate.toLocaleDateString('es-ES', { dateStyle: 'long' })}</p>
    <h1 class="mt-2 text-3xl font-bold md:text-4xl">{post.data.title}</h1>
    <p class="mt-4 text-lg text-muted">{post.data.description}</p>

    {post.data.tags.length > 0 && (
      <div class="mt-6 flex flex-wrap gap-2">
        {post.data.tags.map((t) => <span class="rounded-full bg-border px-3 py-1 text-xs text-muted">#{t}</span>)}
      </div>
    )}

    <Prose>
      <Content />
    </Prose>
  </article>
</Layout>
```

**Step 2: Commit**

```bash
git add src/pages/blog/[slug].astro
git commit -m "feat: add dynamic blog post page"
```

---

### FASE 5: Decap CMS con asistente de IA

#### Task 5.1: Panel de administración y configuración base

**Files:**
- Create: `public/admin/index.html`
- Create: `public/admin/config.yml`

**Step 1: HTML del panel**

Create: `public/admin/index.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin — Site Jhonnathan</title>
  </head>
  <body>
    <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
  </body>
</html>
```

**Step 2: Configuración de colecciones**

Create: `public/admin/config.yml`

```yaml
backend:
  name: git-gateway
  branch: main

media_folder: "public/images/uploads"
public_folder: "/images/uploads"

collections:
  - name: "blog"
    label: "Blog"
    folder: "src/content/blog"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - { label: "Título", name: "title", widget: "string", pattern: ["^.{1,120}$", "Máximo 120 caracteres"] }
      - { label: "Descripción", name: "description", widget: "text", pattern: ["^.{1,240}$", "Máximo 240 caracteres"] }
      - { label: "Fecha", name: "pubDate", widget: "datetime" }
      - { label: "Borrador", name: "draft", widget: "boolean", default: true }
      - { label: "Etiquetas", name: "tags", widget: "list", allow_add: true }
      - { label: "Categoría", name: "category", widget: "string", required: false }
      - { label: "Cuerpo", name: "body", widget: "markdown" }
```

**Step 3: Commit**

```bash
git add public/admin
git commit -m "feat: setup Decap CMS admin panel and blog collection"
```

---

#### Task 5.2: Crear Netlify Function para asistente de IA

**Objective:** Proteger la API key y exponer un endpoint seguro que Decap CMS pueda llamar.

**Files:**
- Create: `netlify/functions/ai-assistant.ts`
- Modify: `netlify.toml`

**Step 1: Instalar dependencias**

Run:
```bash
npm install -D @netlify/functions
npm install openai
```

**Step 2: Configurar Netlify Functions en netlify.toml**

Modify/Create: `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/admin/*"
  to = "/admin/index.html"
  status = 200
```

**Step 3: Crear endpoint de IA**

Create: `netlify/functions/ai-assistant.ts`

```ts
import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Body {
  action: 'draft' | 'titles' | 'improve' | 'ideas';
  topic?: string;
  text?: string;
  notes?: string;
  tone?: string;
  model?: string;
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const body: Body = JSON.parse(event.body || '{}');
  const { action, topic, text, notes, tone = 'profesional y claro', model = 'gpt-4o-mini' } = body;

  if (!['draft', 'titles', 'improve', 'ideas'].includes(action)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid action' }) };
  }

  const prompt = buildPrompt(action, { topic, text, notes, tone });

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'Sos un asistente experto en redacción de blogs técnicos y profesionales en español. Respondé de forma concisa y útil.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });

    const result = completion.choices[0]?.message?.content?.trim() || '';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error generando sugerencias de IA' }),
    };
  }
};

function buildPrompt(action: Body['action'], params: { topic?: string; text?: string; notes?: string; tone?: string }): string {
  switch (action) {
    case 'draft':
      return `Escribí un borrador de post de blog sobre "${params.topic || params.notes || 'un tema técnico'}". Tono: ${params.tone}. Incluí título sugerido, introducción, 3 secciones con subtítulos y conclusión. Longitud: entre 400 y 700 palabras.`;
    case 'titles':
      return `Sugerí 5 títulos atractivos y claros para un post de blog sobre este texto o tema:\n\n${params.text || params.topic || ''}\n\nTono: ${params.tone}.`;
    case 'improve':
      return `Mejorá este texto de blog manteniendo su significado. Hacelo más claro, conciso y atractivo. Tono: ${params.tone}.\n\nTexto:\n${params.text || ''}`;
    case 'ideas':
      return `Generá 10 ideas de posts de blog relacionados con "${params.topic || params.notes || 'tecnología, desarrollo de software y producto digital'}". Para cada una incluí título tentativo y una oración de descripción. Tono: ${params.tone}.`;
  }
}
```

**Step 4: Commit**

```bash
git add netlify netlify/functions/ai-assistant.ts
pm install -D @netlify/functions openai
git add package.json package-lock.json
git commit -m "feat: add secure Netlify Function for AI writing assistant"
```

---

#### Task 5.3: Crear widget custom de IA para Decap CMS

**Objective:** Agregar botones dentro del editor de Decap CMS que llamen al endpoint seguro.

**Files:**
- Create: `public/admin/cms-ai-widget.js`
- Modify: `public/admin/index.html`
- Modify: `public/admin/config.yml`

**Step 1: Script de widget**

Create: `public/admin/cms-ai-widget.js`

```js
/* global CMS */

const AI_ENDPOINT = '/.netlify/functions/ai-assistant';

function createAiButton(label, action, getTextFn, setTextFn) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = label;
  btn.className = 'css-1hvrgvd-ActionButton'; // reutiliza clases de Decap, fallback visual
  btn.style.margin = '4px';
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.textContent = 'Generando...';
    try {
      const body = getTextFn();
      const res = await fetch(AI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...body }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTextFn(data.result);
    } catch (err) {
      alert('Error de IA: ' + err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  });
  return btn;
}

function injectAiToolbar() {
  const markdownContainers = document.querySelectorAll('[class*="MarkdownControl"], .cms-editor');
  markdownContainers.forEach((container) => {
    if (container.dataset.aiInjected) return;
    container.dataset.aiInjected = 'true';

    const wrapper = document.createElement('div');
    wrapper.style.marginBottom = '8px';
    wrapper.style.display = 'flex';
    wrapper.style.flexWrap = 'wrap';
    wrapper.style.gap = '4px';

    // Botón para generar borrador: usa el título actual como topic
    wrapper.appendChild(
      createAiButton(
        '✨ Borrador IA',
        'draft',
        () => ({ topic: document.querySelector('input[name="title"]')?.value || '' }),
        (result) => {
          const body = document.querySelector('textarea[name="body"], .cm-content');
          if (body) body.value = result;
        }
      )
    );

    // Botón para mejorar texto actual
    wrapper.appendChild(
      createAiButton(
        '🔧 Mejorar texto',
        'improve',
        () => ({ text: document.querySelector('textarea[name="body"], .cm-content')?.value || '' }),
        (result) => {
          const body = document.querySelector('textarea[name="body"], .cm-content');
          if (body) body.value = result;
        }
      )
    );

    // Botón para ideas de temas
    wrapper.appendChild(
      createAiButton(
        '💡 Ideas',
        'ideas',
        () => ({ notes: document.querySelector('input[name="title"]')?.value || '' }),
        (result) => alert(result)
      )
    );

    container.insertBefore(wrapper, container.firstChild);
  });
}

// Decap CMS carga de forma asíncrona; observamos el DOM
const observer = new MutationObserver(() => {
  injectAiToolbar();
});

window.addEventListener('load', () => {
  observer.observe(document.body, { childList: true, subtree: true });
  injectAiToolbar();
});
```

**Step 2: Incluir widget en admin**

Modify: `public/admin/index.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin — Site Jhonnathan</title>
  </head>
  <body>
    <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
    <script src="./cms-ai-widget.js"></script>
  </body>
</html>
```

**Step 3: Commit**

```bash
git add public/admin/cms-ai-widget.js public/admin/index.html
git commit -m "feat: add Decap CMS custom AI writing widget"
```

---

#### Task 5.4: Documentar variables de entorno en Netlify

**Files:**
- Create: `.env.example`
- Modify: `README.md`

**Step 1: Archivo de ejemplo**

Create: `.env.example`

```
# Netlify / local development
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

**Step 2: Configurar en Netlify Dashboard**

- Ir a Site settings > Environment variables.
- Agregar `OPENAI_API_KEY` con la key real.
- Opcional: agregar `OPENAI_MODEL` para cambiar modelo sin deploy.

**Step 3: Commit**

```bash
git add .env.example README.md
git commit -m "docs: add environment variables for AI assistant"
```

---

### FASE 6: Búsqueda con Pagefind

#### Task 6.1: Integrar Pagefind

**Files:**
- Create: `src/components/Search.tsx`
- Modify: `src/pages/blog/index.astro`
- Modify: `package.json` scripts

**Step 1: Instalar Pagefind**

Run:
```bash
npm install -D pagefind
```

**Step 2: Configurar script de build**

Modify: `package.json`

```json
"scripts": {
  "dev": "astro dev",
  "start": "astro dev",
  "build": "astro build && pagefind --site dist",
  "preview": "astro preview"
}
```

**Step 3: Componente de búsqueda**

Create: `src/components/Search.tsx`

```tsx
import { useEffect, useRef, useState } from 'react';

interface Result {
  url: string;
  title: string;
  excerpt: string;
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const pagefindRef = useRef<any>(null);

  useEffect(() => {
    const init = async () => {
      const pf = await import('/pagefind/pagefind.js');
      pagefindRef.current = pf;
    };
    init();
  }, []);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (!value.trim() || !pagefindRef.current) {
      setResults([]);
      return;
    }
    const search = await pagefindRef.current.search(value);
    const items = await Promise.all(search.results.map((r: any) => r.data()));
    setResults(items.map((d: any) => ({ url: d.url, title: d.meta.title, excerpt: d.excerpt })));
  };

  return (
    <div className="relative">
      <input
        type="search"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Buscar en el blog..."
        className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text focus:border-focus focus:outline-none focus:ring-1 focus:ring-focus"
        aria-label="Buscar en el blog"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 mt-2 max-h-80 w-full overflow-auto rounded-lg border border-border bg-surface shadow-lg">
          {results.map((r) => (
            <li key={r.url} className="border-b border-border last:border-0">
              <a href={r.url} className="block p-4 hover:bg-border focus:outline-none focus:bg-border">
                <p className="font-bold text-text">{r.title}</p>
                <p className="mt-1 text-sm text-muted" dangerouslySetInnerHTML={{ __html: r.excerpt }} />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

**Step 4: Agregar a blog index**

Modify: `src/pages/blog/index.astro` agregando `<Search client:load />` arriba de la lista.

**Step 5: Verificar búsqueda**

Run:
```bash
npm run build
npm run preview
```

Buscar "astro" y verificar que devuelve resultados.

**Step 6: Commit**

```bash
git add package.json src/components/Search.tsx src/pages/blog/index.astro
git commit -m "feat: add Pagefind search to blog"
```

---

### FASE 7: Despliegue

#### Task 7.1: Configurar Netlify

**Files:**
- Create: `netlify.toml`
- Create: `public/_redirects`
- Verify Decap CMS OAuth setup on Netlify

**Step 1: netlify.toml**

Ensure: `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/admin/*"
  to = "/admin/index.html"
  status = 200
```

**Step 2: Conectar repositorio en Netlify**

- Crear sitio nuevo desde Git.
- Configurar variable de entorno `OPENAI_API_KEY`.
- Habilitar Netlify Identity.
- Habilitar Git Gateway en Netlify Identity settings.

**Step 3: Probar admin y publicación con IA**

Abrir `https://<site>.netlify.app/admin/`, autenticar, crear un post de prueba y probar los botones "Borrador IA", "Mejorar texto" e "Ideas".

**Step 4: Commit**

```bash
git add netlify.toml public/_redirects
git commit -m "chore: add Netlify deployment config"
```

---

## Tests / validation

### Build y preview

Run:
```bash
npm run build
npm run preview
```

Expected: build exitoso, preview sirve en `http://localhost:4321`.

### Local Netlify Functions

Run:
```bash
npx netlify-cli dev
```

Probar POST a `http://localhost:8888/.netlify/functions/ai-assistant` con body:

```json
{
  "action": "ideas",
  "topic": "Astro y sitios estáticos"
}
```

Expected: respuesta JSON con `result` no vacío.

### Checks de accesibilidad básica

- Contrastes: verificar con DevTools Lighthouse.
- Navegación por teclado: probar Tab, Enter, Escape en menú móvil y toggle de tema.
- `aria-label` en botones sin texto visible.

### Responsive

Probar en anchos: 320px, 768px, 1024px, 1440px.

### CMS smoke test

1. Abrir `/admin/` en producción.
2. Login con Netlify Identity.
3. Probar botones de IA.
4. Crear un post de prueba.
5. Verificar que el post aparece publicado en `/blog/`.

---

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| API key de IA expuesta | Netlify Function como proxy. Key en variables de entorno. |
| Modo oscuro con flash inicial | Script inline en `<head>` antes de render. |
| Decap CMS auth complicado | Usar Netlify + Identity + Git Gateway. Documentar paso a paso. |
| Widget de IA frágil en Decap | Usar MutationObserver; mantener fallback visual simple. |
| Contenido del sitio no listo | Agregar tareas explícitas de contenido (bio, foto, posts, servicios). |
| Tailwind genérico | Aplicar capa de diseño propia: Noto Sans, paleta semántica, componentes custom. |

---

## Contenido que debe entregar el usuario

Para terminar el sitio, el usuario necesita proveer:

1. Foto de perfil (jpg/png, cuadrada, ~800x800).
2. Bio completa para `sobre-mi.astro`.
3. Lista final de servicios con descripción y precio/rango.
4. Lista de proyectos de portafolio con URLs, descripciones y tags.
5. Correo de contacto real para formulario y enlaces.
6. Primeros 2-3 posts de blog con título, descripción y cuerpo.
7. API key de OpenAI (u optar por Gemini, que requiere cambio de SDK en la función).

---

## Nota sobre proveedor de IA

El plan usa **OpenAI** (`gpt-4o-mini`) por simplicidad y costo. Si se prefiere **Gemini**, se reemplaza el SDK y la llamada en `netlify/functions/ai-assistant.ts`.

---

## Siguiente paso

Plan completo y guardado. Listo para ejecutar usando subagent-driven-development. ¿Procedemos?
