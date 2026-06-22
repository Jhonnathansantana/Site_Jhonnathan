# Plan del Proyecto: Site_Jhonnathan

## Objetivo
Blog personal y profesional con integración de IA, que sirva como presentación de servicios y portafolio.

---

## Stack Tecnológico

| Componente | Tecnología |
|---|---|
| Framework principal | **Astro** (generación estática + islands) |
| Componentes interactivos | **React** |
| CMS | **Decap CMS** (Netlify CMS) - editor visual, Git-based, Markdown puro |
| Estilos | **Tailwind CSS** |
| Despliegue | **Netlify** o **Vercel** |
| IA - Búsqueda | **Pagefind** + embeddings con **OpenAI API** para búsqueda semántica |
| IA - Redacción | API de **OpenAI** o **Gemini** para asistente de redacción |

---

## Estructura del Sitio

```
Site_Jhonnathan/
├── src/
│   ├── components/       # Componentes React (Navbar, Hero, Card, ChatBot, etc.)
│   ├── layouts/          # Layouts de Astro
│   ├── pages/            # Páginas del sitio
│   │   ├── index.astro
│   │   ├── blog/         # Lista de posts + [slug].astro
│   │   ├── sobre-mi.astro
│   │   ├── servicios.astro
│   │   ├── portafolio.astro
│   │   └── contacto.astro
│   ├── content/          # Markdown gestionado por Decap CMS
│   │   ├── blog/
│   │   ├── servicios/
│   │   └── portafolio/
│   └── styles/
├── public/
│   └── admin/            # Panel de Decap CMS (index.html + config.yml)
├── astro.config.mjs
├── tailwind.config.js
└── package.json
```

---

## Secciones del Sitio

1. **Inicio** - Hero con presentación y llamado a la acción
2. **Sobre mí** - Bio, foto, experiencia, valores
3. **Blog** - Posts con Markdown, categorías, etiquetas, búsqueda IA
4. **Servicios** - Catálogo de servicios profesionales ofrecidos
5. **Portafolio / Proyectos** - Proyectos realizados con enlaces
6. **Contacto** - Formulario / enlaces directos

---

## Funcionalidades de IA

1. **Asistente de redacción** - Botón en el panel de Decap CMS que sugiere títulos, genera borradores y mejora contenido vía API (OpenAI/Gemini)
2. **Búsqueda inteligente** - Pagefind para búsqueda local + embeddings semánticos para búsqueda por concepto en los posts

---

## Fases del Proyecto

| Fase | Tareas |
|---|---|
| **Fase 1: Setup** | `npm create astro`, instalar React + Tailwind, configurar Decap CMS en `/public/admin` |
| **Fase 2: Layout y Componentes** | Crear layout base, Navbar, Footer, Hero, Card, tema visual |
| **Fase 3: Páginas** | Implementar sobre-mi, servicios, portafolio, contacto, blog |
| **Fase 4: CMS** | Configurar colecciones en Decap CMS (blog, servicios, portafolio), conectar con Git |
| **Fase 5: IA** | Integrar Pagefind, crear componente de búsqueda semántica, conectar asistente de redacción |
| **Fase 6: Despliegue** | Publicar en Netlify/Vercel, conectar autenticación de Decap CMS con GitHub |

---

## Archivos Markdown gestionados por Decap CMS

```
src/content/blog/primer-post.md
src/content/servicios/consultoria.md
src/content/servicios/desarrollo-web.md
src/content/portafolio/proyecto-1.md
```