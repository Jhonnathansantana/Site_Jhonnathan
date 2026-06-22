# Validación del Plan: Site_Jhonnathan

**Origen del plan revisado:** `C:\Users\jhonn\Downloads\Site_Jhonnathan\Plan_Proyecto.md`

**Estado general:** El plan describe una dirección correcta (Astro + React + Tailwind + Decap CMS + Netlify/Vercel), pero le faltan decisiones técnicas concretas, riesgos, criterios de aceptación y detalles de implementación para poder ejecutarlo sin suposiciones.

---

## Observaciones por sección

### 1. Objetivo

- **Bien:** Define claramente que es un blog personal/profesional con IA, portafolio y servicios.
- **Falta:** Audiencia objetivo, tono de marca, idioma principal del sitio (español/inglés/bilingüe), y qué acción debe realizar el visitante (contactar, leer blog, contratar).

### 2. Stack tecnológico

| Elección | Valoración | Observación |
|---|---|---|
| Astro + React + Tailwind | Correcto | Stack moderno, rápido, ideal para sitios estáticos con islands. |
| Decap CMS | Aceptable | Git-based, gratis. Requiere autenticación OAuth con Netlify Identity o Git Gateway. Eso no está detallado. |
| Pagefind | Correcto | Funciona bien con sitios estáticos, cero backend. |
| Embeddings OpenAI/Gemini | **Riesgoso** | Para un sitio estático, implica un backend/serverless o exponer la API key en el cliente. El plan no aclara dónde corre la búsqueda semántica. |
| OpenAI/Gemini redacción | **Riesgoso** | Mismo problema: si Decap CMS llama a la API desde el frontend, la key queda expuesta. Requiere función serverless/proxy. |

**Falta definir:**
- Proveedor de IA final (OpenAI vs Gemini).
- Cómo se protege la API key.
- Arquitectura de la búsqueda semántica (precomputar embeddings al build time vs. endpoint serverless).
- Presupuesto estimado de uso de IA.

### 3. Estructura del sitio

- **Bien:** La estructura de carpetas es razonable.
- **Falta:**
  - Dónde se configuran las colecciones de contenido (`src/content/config.ts`).
  - Convención de nombres para slugs y frontmatter obligatorio.
  - Si usar Content Collections de Astro (recomendado) o solo Markdown suelto.
  - Si los assets (imágenes) van en `public/` o en `src/assets/`.

### 4. Secciones del sitio

- Lista correcta, pero sin prioridad ni MVP.
- **Recomendación:** Definir cuáles son must-have para el lanzamiento (ej: Inicio, Sobre mí, Blog, Contacto) y cuáles son v2 (Portafolio detallado, búsqueda semántica, asistente IA).

### 5. Funcionalidades de IA

- **Búsqueda inteligente:** Pagefind ya da búsqueda por texto. La parte de "embeddings semánticos" es ambiciosa y poco definida. Requiere decidir:
  - ¿Se generan embeddings al momento del build y se guardan en JSON estático?
  - ¿Se usa una función serverless (Netlify/Vercel) para consultar el embedding y devolver similitud?
  - ¿Qué modelo de embeddings se usa (`text-embedding-3-small`, etc.)?
- **Asistente de redacción:** Decap CMS permite widgets custom, pero no es trivial. El plan no indica:
  - Dónde se agrega el botón en Decap.
  - Cómo se pasa el contenido del campo al asistente.
  - Cómo se inserta la respuesta en el editor.

### 6. Fases del proyecto

- Las fases son lógicas, pero los entregables no son medibles.
- **Falta:**
  - Duración estimada por fase.
  - Criterios de "terminado" para cada fase.
  - Pruebas o smoke tests que se deben pasar.
  - Orden de prioridad dentro de cada fase.

### 7. Archivos Markdown gestionados por Decap CMS

- Bien que mencione ejemplos.
- **Falta:** Esquema de frontmatter por colección, validación de campos y reglas de slug.

---

## Riesgos principales

1. **Exposición de API keys de IA:** si se implementa el asistente o la búsqueda semántica sin backend, la key queda pública.
2. **Decap CMS + autenticación:** muchos proyectos se atoran configurando Git Gateway/Netlify Identity. Necesita su propia tarea con capturas de pantalla de flujo.
3. **Scope creep por IA:** la búsqueda semántica y el asistente de redacción pueden duplicar el esfuerzo. Sugiero hacer MVP sin IA y luego agregar.
4. **No hay estrategia de contenido:** el sitio depende de tener texto, bio, posts y proyectos listos. Sin contenido, el proyecto no termina.
5. **Dependencia de terceros:** OpenAI/Gemini son de pago y Netlify Identity tiene límites. No hay plan B.

---

## Recomendaciones para corregir el plan

1. **Definir MVP:** lanzar primero Astro + Tailwind + Decap CMS + páginas básicas + Pagefind.
2. **Mover IA a fase 2:** búsqueda semántica y asistente de redacción después del MVP, con su propio diseño de arquitectura y protección de keys.
3. **Agregar criterios de aceptación por fase:** por ejemplo, "Fase 1 lista cuando `npm run build` pase sin errores y Decap CMS cargue en `/admin`".
4. **Documentar frontmatter y colecciones de contenido:** crear `src/content/config.ts` con esquemas de Zod.
5. **Incluir plan de contenido:** listar qué textos, fotos y posts necesita el sitio antes del lanzamiento.
6. **Definir hosting final:** Netlify vs Vercel con pros/contras para Decap CMS.

---

## Veredicto

**El plan es un buen borrador de alto nivel, pero no es ejecutable todavía.** Le falta profundidad técnica, arquitectura de la parte de IA, priorización de MVP y criterios de aceptación.

**Siguiente paso recomendado:** reescribir el plan como plan de implementación bajo `.hermes/plans/` con tareas pequeñas (2-5 min cada una), TDD cuando aplique, y el stack final decidido.
