# Rebalance del sitio: blog asistido por IA + servicios + perfil personal

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Transformar Site_Jhonnathan en un blog asistido por IA que hable de tecnología, producto y herramientas, mientras presenta al autor y los servicios que ofrece de forma clara y equilibrada. Reducir el peso actual de la página "Sobre mí", reforzar el blog como sección central y actualizar los servicios para que reflejen la trayectoria real del CV.

**Architecture:** Astro estático + Content Collections para posts + Decap CMS con asistente de IA + páginas de perfil y servicios como soporte. Home debe ser un portal al blog, servicios y perfil, no un currículum expandido.

**Tech Stack:** Astro 5, React, Tailwind CSS 3, Decap CMS, Pagefind, Netlify Functions, OpenAI API.

---

## Diagnóstico actual

- **Sobre mí** es ahora una versión completa del CV: 178 líneas, experiencia detallada, formación, estadísticas. Ocupó demasiado protagonismo.
- **Home** habla solo de desarrollo web y asesoría; no menciona el blog como elemento central.
- **Servicios** son genéricos y no conectan con la experiencia real (gestión TI, ciberseguridad, DevOps, docencia, monitoreo financiero).
- **Blog** existe técnicamente, pero no tiene contenido propio ni se promociona en home.

**Principio de rediseño:** el sitio es un blog asistido por IA. "Sobre mí" y "Servicios" son secciones secundarias que respaldan la autoridad del blog.

---

## Decisiones de contenido

### Sobre mí (resumir)

- Debe ser una tarjeta profesional, no un CV expandido.
- Máximo: foto, rol, 2 párrafos de bio, 3-4 hitos clave, CTA a servicios y blog.
- Mover la experiencia detallada y formación a un post de blog permanente o a `/cv` (opcional futuro). Por ahora, descartar la lista completa de la página estática.

### Home (centrar en blog + servicios + perfil)

- Hero corto: quién soy y qué hace el sitio.
- Destacar últimos posts del blog.
- Tarjeta de "Sobre mí" con link.
- Tarjeta de "Servicios" con link.
- CTA final a suscripción/contacto.

### Servicios (alinear con CV real)

- Consultoría en gestión y gobierno de TI
- Ciberseguridad y continuidad operacional
- Monitoreo, DevOps y dashboards ejecutivos
- Docencia, mentoría y formación técnica
- Desarrollo web con enfoque en IA asistida

### Blog (fortalecer)

- Crear 3-4 posts iniciales que posicionen el blog:
  1. "Cómo elegir un stack tecnológico en 2026"
  2. "Lecciones de 15 años gestionando infraestructura y seguridad"
  3. "Cómo integrar IA en flujos de contenido sin exponer API keys"
  4. "Dashboards que realmente usan los ejecutivos: monitoreo financiero"
- Agregar campo `author` y `category` al esquema (ya existe category; asegurar que funcione).
- Asegurar que Pagefind indexe correctamente y el buscador esté visible.
- Verificar que Decap CMS pueda crear posts y usar el widget de IA.

---

## Fases y tareas

### Task 1: Rediseñar página de inicio como portal del blog

**Objective:** La home debe comunicar inmediatamente que es un blog técnico asistido por IA, con acceso a posts, servicios y perfil.

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/content/config.ts` (si se necesita campo `featured`)

**Step 1: Reemplazar hero actual**

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../layouts/Layout.astro';
import Button from '../components/Button.astro';
import Card from '../components/Card.astro';

const title = 'Jhonnathan Santana — Blog de tecnología y servicios TI';
const latestPosts = (await getCollection('blog', p => !p.data.draft))
  .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
  .slice(0, 3);
---

<Layout title={title} description="Blog de tecnología, ciberseguridad, gestión de TI e inteligencia artificial. Escrito por Jhonnathan Santana.">
  <section class="px-4 py-16 text-center sm:py-24">
    <p class="mb-4 text-sm font-bold uppercase tracking-widest text-accent">Blog asistido por IA</p>
    <h1 class="mx-auto mb-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
      Tecnología, ciberseguridad y gestión de TI explicada con claridad.
    </h1>
    <p class="mx-auto mb-10 max-w-2xl text-lg text-muted">
      Soy Jhonnathan Santana: gerente de TI, docente y consultor. Escribo sobre lo que aprendo
      liderando infraestructura, seguridad, DevOps e integraciones con IA.
    </p>
    <div class="flex flex-wrap items-center justify-center gap-4">
      <Button href="/blog" variant="primary" size="lg">Leer el blog</Button>
      <Button href="/servicios" variant="secondary" size="lg">Ver servicios</Button>
    </div>
  </section>

  <section class="border-y border-border bg-surface px-4 py-16">
    <div class="mx-auto max-w-readable">
      <div class="mb-8 flex items-end justify-between">
        <h2 class="text-2xl font-bold">Últimos artículos</h2>
        <a href="/blog" class="text-sm font-bold text-accent hover:underline">Ver todos →</a>
      </div>

      {latestPosts.length > 0 ? (
        <div class="grid gap-6">
          {latestPosts.map((post) => (
            <Card
              href={`/blog/${post.slug}`}
              title={post.data.title}
              description={post.data.description}
              meta={post.data.pubDate.toLocaleDateString('es-ES', { dateStyle: 'long' })}
            />
          ))}
        </div>
      ) : (
        <p class="text-muted">Próximamente los primeros artículos.</p>
      )}
    </div>
  </section>

  <section class="px-4 py-16">
    <div class="mx-auto grid max-w-readable gap-6 sm:grid-cols-2">
      <Card href="/sobre-mi" title="Sobre mí" description="Gerente de TI, docente y consultor con más de 15 años de experiencia en infraestructura, ciberseguridad y DevOps." />
      <Card href="/servicios" title="Servicios" description="Consultoría en gestión de TI, ciberseguridad, monitoreo, DevOps, formación y desarrollo web asistido por IA." />
    </div>
  </section>
</Layout>
```

**Step 2: Verificar que getCollection funcione**

Run:
```bash
npm run build
```

Expected: build exitoso, home generada con posts o mensaje de "Próximamente".

**Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: redesign homepage as blog portal with latest posts and services card"
```

---

### Task 2: Reducir "Sobre mí" a tarjeta profesional

**Objective:** Convertir la página "Sobre mí" en una presentación breve y auténtica, no una copia del CV.

**Files:**
- Modify: `src/pages/sobre-mi.astro`
- Optional: create `src/content/blog/cv-completo.md` to preserve full CV content as a blog post

**Step 1: Reescribir página con contenido resumido**

```astro
---
import '../styles/global.css';
import Layout from '../layouts/Layout.astro';
import Prose from '../components/Prose.astro';
import Button from '../components/Button.astro';

const title = 'Sobre mí — Jhonnathan Santana';
---

<Layout title={title} description="Jhonnathan Santana: gerente de TI, ciberseguridad, DevOps y docencia. 15+ años ayudando organizaciones y formando profesionales.">
  <div class="mx-auto max-w-4xl px-4 py-12 sm:py-16">
    <h1 class="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">Sobre mí</h1>

    <div class="mb-10 grid gap-8 sm:grid-cols-[1fr_2fr] sm:items-start">
      <div class="mx-auto aspect-square w-full max-w-[16rem] overflow-hidden rounded-2xl bg-surface border border-border sm:mx-0">
        <div class="flex h-full w-full items-center justify-center text-muted">
          <svg class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
      </div>

      <div>
        <p class="text-sm font-bold uppercase tracking-widest text-accent">
          Gerente de TI · Ciberseguridad · DevOps · Docente
        </p>
        <h2 class="mt-2 text-2xl font-bold">Jhonnathan De Jesús Araujo Santana</h2>
        <p class="mt-4 text-lg text-muted">
          Profesional de tecnología con más de 15 años de experiencia gestionando infraestructura,
          ciberseguridad, consultoría y formación. Lidero la transformación digital en Fundación Sur Futuro
          y enseño en ITLA e INFOTEP.
        </p>
        <p class="mt-4 text-lg text-muted">
          Este blog nace de esa doble vocación: resolver problemas reales con tecnología y compartir lo
          aprendido para que otros profesionales crezcan. Creo firmemente que el conocimiento tecnológico
          es más poderoso cuando se comparte.
        </p>
      </div>
    </div>

    <div class="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div class="rounded-xl border border-border bg-surface p-4 text-center">
        <p class="text-3xl font-bold">15+</p>
        <p class="text-xs uppercase tracking-wider text-muted">Años de experiencia</p>
      </div>
      <div class="rounded-xl border border-border bg-surface p-4 text-center">
        <p class="text-3xl font-bold">8</p>
        <p class="text-xs uppercase tracking-wider text-muted">Roles profesionales</p>
      </div>
      <div class="rounded-xl border border-border bg-surface p-4 text-center">
        <p class="text-3xl font-bold">17</p>
        <p class="text-xs uppercase tracking-wider text-muted">Certificaciones</p>
      </div>
      <div class="rounded-xl border border-border bg-surface p-4 text-center">
        <p class="text-3xl font-bold">2</p>
        <p class="text-xs uppercase tracking-wider text-muted">Maestrías en curso</p>
      </div>
    </div>

    <Prose>
      <h2>Por qué este blog</h2>
      <p>
        Durante años aprendí en la operación: monitoreando sistemas financieros, migrando
        infraestructura, defendiendo redes y formando equipos. Ahora quiero documentar esas lecciones en
        un formato útil para quienes gestionan tecnología, toman decisiones de arquitectura o quieren
        integrar IA de forma segura y práctica.
      </p>

      <h2>Áreas de enfoque</h2>
      <ul>
        <li>Gestión estratégica de TI y gobierno tecnológico.</li>
        <li>Ciberseguridad operacional y continuidad del negocio.</li>
        <li>Monitoreo, DevOps y dashboards ejecutivos.</li>
        <li>Formación técnica y mentoría de equipos.</li>
        <li>Desarrollo web moderno con inteligencia artificial asistida.</li>
      </ul>

      <blockquote>
        <p>“El conocimiento tecnológico es más poderoso cuando se comparte.”</p>
      </blockquote>
    </Prose>

    <div class="mt-12 flex flex-wrap gap-4">
      <Button href="/blog" variant="primary">Leer el blog</Button>
      <Button href="/servicios" variant="secondary">Ver servicios</Button>
      <Button href="/contacto" variant="ghost">Contactar</Button>
    </div>
  </div>
</Layout>
```

**Step 2: Verificar build**

Run:
```bash
npm run build
```

**Step 3: Commit**

```bash
git add src/pages/sobre-mi.astro
git commit -m "feat: simplify about page to professional card, not full CV"
```

---

### Task 3: Actualizar servicios alineados con el perfil real

**Objective:** Los servicios deben reflejar la experiencia real del CV: gestión TI, ciberseguridad, monitoreo, formación y desarrollo asistido por IA.

**Files:**
- Modify: `src/data/services.json`
- Modify: `src/pages/servicios.astro` (minor copy adjustment)

**Step 1: Reescribir services.json**

```json
{
  "services": [
    {
      "id": "gestion-ti",
      "title": "Gestión y gobierno de TI",
      "description": "Consultoría para alinear tecnología con objetivos institucionales: definición de hoja de ruta, optimización de infraestructura, gestión de proveedores, presupuesto y políticas de ciberseguridad.",
      "tags": ["Gobierno TI", "ITIL", "COBIT", "Estrategia"]
    },
    {
      "id": "ciberseguridad",
      "title": "Ciberseguridad y continuidad operacional",
      "description": "Diagnóstico de seguridad, implementación de controles, Microsoft ADR, políticas de acceso, respaldos y planes de continuidad del negocio.",
      "tags": ["Microsoft ADR", "Seguridad de redes", "Continuidad"]
    },
    {
      "id": "monitoreo-devops",
      "title": "Monitoreo, DevOps y dashboards ejecutivos",
      "description": "Diseño e implementación de monitoreo con APPManager, OPManager, Splunk y Azure Monitor. Alertas, dashboards y reportes de SLA para sistemas críticos.",
      "tags": ["Splunk", "Azure Monitor", "SLA", "DevOps"]
    },
    {
      "id": "formacion-mentoria",
      "title": "Formación técnica y mentoría",
      "description": "Programas de capacitación en TI para equipos y organizaciones. Mentoría personalizada en programación, redes, infraestructura, ciberseguridad y crecimiento profesional.",
      "tags": ["ITLA", "INFOTEP", "Mentoría", "Capacitación"]
    },
    {
      "id": "desarrollo-ia",
      "title": "Desarrollo web asistido por IA",
      "description": "Sitios rápidos, accesibles y fáciles de mantener con Astro, React y Tailwind. Integración de búsqueda semántica, asistentes de redacción y flujos automatizados con IA segura.",
      "tags": ["Astro", "React", "Pagefind", "OpenAI"]
    }
  ]
}
```

**Step 2: Ajustar grid en servicios.astro**

El grid actual es `lg:grid-cols-4`. Con 5 servicios, cambiar a `lg:grid-cols-3` o `sm:grid-cols-2`.

Modify: `src/pages/servicios.astro` line 20:

```astro
<section class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
```

**Step 3: Verificar build**

Run:
```bash
npm run build
```

**Step 4: Commit**

```bash
git add src/data/services.json src/pages/servicios.astro
git commit -m "feat: update services to match real TI and security background"
```

---

### Task 4: Crear posts iniciales de blog

**Objective:** Dar contenido propio al blog para que la home tenga qué mostrar y el buscador tenga sentido.

**Files:**
- Create: `src/content/blog/elegir-stack-2026.md`
- Create: `src/content/blog/15-anos-gestionando-ti.md`
- Create: `src/content/blog/ia-sin-exponer-api-keys.md`
- Create: `src/content/blog/dashboards-que-usan-ejecutivos.md`
- Modify: `src/content/config.ts` if needed

**Step 1: Crear primer post**

Create: `src/content/blog/elegir-stack-2026.md`

```md
---
title: "Cómo elegir un stack tecnológico en 2026"
description: "Una guía práctica para equipos que necesitan decidir qué tecnologías usar sin dejarse llevar por el hype."
pubDate: 2026-06-22
category: "desarrollo"
tags: ["astro", "react", "tailwind", "arquitectura"]
draft: false
---

Elegir stack es una decisión que afecta años de mantenimiento. No se trata de usar lo último, sino de responder tres preguntas: ¿quién lo va a mantener?, ¿qué necesita el negocio? y ¿cuánto podemos simplificar?

En este artículo repaso los criterios que uso para recomendar tecnologías, con ejemplos concretos de sitios estáticos, aplicaciones interactivas y productos con IA.
```

**Step 2: Crear post sobre experiencia**

Create: `src/content/blog/15-anos-gestionando-ti.md`

```md
---
title: "Lecciones de 15 años gestionando infraestructura y seguridad"
description: "Lo que aprendí liderando TI en fundaciones, bancos, consultoras y aulas de formación técnica."
pubDate: 2026-06-22
category: "gestion-ti"
tags: ["infraestructura", "ciberseguridad", "liderazgo", "itil"]
draft: false
---

La tecnología bien gestionada no se nota: los usuarios trabajan, los sistemas están disponibles y los incidentes se resuelven antes de escalar. Durante 15 años aprendí que la mayor parte del trabajo estratégico es invisible, pero medible.

Aquí comparto las lecciones más útiles sobre gobierno de TI, continuidad operacional, gestión de proveedores y formación de equipos.
```

**Step 3: Crear post sobre IA segura**

Create: `src/content/blog/ia-sin-exponer-api-keys.md`

```md
---
title: "Cómo integrar IA en flujos de contenido sin exponer API keys"
description: "Estrategia para usar modelos de lenguaje en sitios estáticos protegiendo la clave con funciones serverless."
pubDate: 2026-06-22
category: "ia"
tags: ["openai", "netlify-functions", "decap-cms", "seguridad"]
draft: false
---

Un sitio estático no puede ocultar secretos. Si pones una API key en el frontend, cualquiera puede leerla. Para este blog asistido por IA usé Netlify Functions como proxy: el navegador llama a un endpoint propio, y ese endpoint llama a OpenAI con la clave almacenada en variables de entorno.

Explico la arquitectura paso a paso y los errores comunes que hay que evitar.
```

**Step 4: Crear post sobre monitoreo**

Create: `src/content/blog/dashboards-que-usan-ejecutivos.md`

```md
---
title: "Dashboards que realmente usan los ejecutivos: monitoreo financiero"
description: "Cómo transformar datos técnicos de disponibilidad y rendimiento en informes útiles para la alta dirección."
pubDate: 2026-06-22
category: "devops"
tags: ["splunk", "azure-monitor", "dashboards", "sla"]
draft: false
---

Los dashboards técnicos suelen estar llenos de métricas que solo entienden quienes operan el sistema. Los ejecutivos necesitan otra cosa: tendencias, impacto en el negocio y acciones recomendadas.

En este artículo cuento cómo construí dashboards de monitoreo financiero con Splunk, Azure Monitor y PowerShell, y qué hizo que dejaran de ser papel tapiz.
```

**Step 5: Verificar build**

Run:
```bash
npm run build
```

Expected: 12 páginas generadas (home, 4 posts, listado de blog, detalles, etc.), Pagefind indexa más contenido.

**Step 6: Commit**

```bash
git add src/content/blog

git commit -m "feat: add initial blog posts for technology, management, security and AI"
```

---

### Task 5: Promocionar el asistente de IA del blog

**Objective:** El blog es "asistido por IA". El visitante debe entender cómo se usa la IA: asistente privado de redacción para el autor en Decap CMS.

**Files:**
- Modify: `src/pages/blog/index.astro` — agregar breve nota sobre IA.
- Modify: `public/admin/index.html` — asegurar widget cargado (ya hecho en previo commit).
- Modify: `README.md` — documentar la funcionalidad.

**Step 1: Agregar nota en listado de blog**

Modify: `src/pages/blog/index.astro`, agregar debajo del título:

```astro
<p class="mt-4 text-muted">
  Algunos borradores se inician con ayuda de un asistente de IA integrado en el panel de administración.
  La clave de la API nunca se expone: pasa por una función serverless segura.
</p>
```

**Step 2: Verificar build**

Run:
```bash
npm run build
```

**Step 3: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "docs: clarify AI-assisted writing workflow in blog list"
```

---

### Task 6: Asegurar navegación y redirecciones

**Objective:** Navbar debe reflejar la nueva jerarquía: Blog primero, luego Servicios y Sobre mí.

**Files:**
- Modify: `src/layouts/Layout.astro` o `src/components/Navbar.tsx`

**Step 1: Reordenar links**

Si Navbar es un array, cambiar orden a:

```js
const links = [
  { href: '/', label: 'Inicio' },
  { href: '/blog', label: 'Blog' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/sobre-mi', label: 'Sobre mí' },
  { href: '/portafolio', label: 'Portafolio' },
  { href: '/contacto', label: 'Contacto' },
];
```

**Step 2: Verificar build**

Run:
```bash
npm run build
```

**Step 3: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "chore: reorder navigation to prioritize blog"
```

---

### Task 7: Verificación final y push

**Objective:** Todo el sitio construye correctamente y el mensaje central es claro.

**Step 1: Build completo**

Run:
```bash
npm run build
```

Expected:
- 12+ páginas generadas.
- Pagefind indexa todo.
- Sin errores.

**Step 2: Preview local opcional**

Run:
```bash
npm run preview
```

Abrir:
- `http://localhost:4321/` — home debe mostrar blog primero.
- `http://localhost:4321/blog` — listado con posts y buscador.
- `http://localhost:4321/sobre-mi` — versión resumida.
- `http://localhost:4321/servicios` — 5 servicios actualizados.

**Step 3: Push**

```bash
git push origin master
```

---

## Tests / validation

### Criterios de aceptación

- [ ] Home presenta el sitio como "blog asistido por IA".
- [ ] Home muestra al menos 3 posts recientes o un mensaje claro de próximamente.
- [ ] Sobre mí tiene menos de 100 líneas y no es un CV completo.
- [ ] Servicios reflejan experiencia en gestión TI, ciberseguridad, monitoreo y formación.
- [ ] Hay al menos 4 posts iniciales con categorías y tags.
- [ ] Build pasa sin errores.
- [ ] Pagefind indexa posts y buscador visible en `/blog`.
- [ ] Navbar muestra Blog antes que Servicios y Sobre mí.

---

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Home sin posts visibles si todos son draft | Asegurar `draft: false` en posts iniciales. |
| Servicios quedan genéricos otra vez | Validar contra el CV antes de commitear. |
| Sobre mí sigue siendo largo | Limitar a foto, bio, hitos y áreas de enfoque. |
| IA asistida no se percibe | Agregar nota en home y listado de blog. |

---

## Siguiente paso

Plan completo y guardado. ¿Procedemos a ejecutar usando subagent-driven-development?
