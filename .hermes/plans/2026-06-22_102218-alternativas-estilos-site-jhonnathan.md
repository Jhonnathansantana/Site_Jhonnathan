# Alternativas de estilos para Site_Jhonnathan

**Contexto:** El plan original propone Tailwind CSS. El usuario señala que Tailwind es el más usado y no diferenciable visualmente frente a otras webs. A continuación se evalúan alternativas reales, con pros/contras, costo de adopción y recomendación final.

---

## Alternativas evaluadas

### 1. Tailwind CSS (línea base)

| Aspecto | Valor |
|---|---|
| Ventaja | Rápido, muy documentado, ecosistema grande, funciona con Astro. |
| Desventaja | Sin un design system propio, los sitios se ven similares. Requiere disciplina para no parecer genérico. |
| Costo de cambio | N/A (es la opción base). |
| Diferenciación visual | Baja si se usa sin capa de diseño propia. |

**Conclusión:** Se puede quedar si se combina con tipografía premium, paleta propia y componentes custom. Pero solo con Tailwind no se destaca.

---

### 2. Tailwind CSS + capa de diseño propia

En lugar de reemplazar Tailwind, se personaliza fuertemente:

- Tipografía propia (variables en `fontFamily`, no Inter por defecto).
- Paleta de colores semántica propia.
- Componentes con estilo editorial o brutalista.
- Animaciones restringidas (`transition`, `transform`, `will-change`) sin librerías pesadas.

| Aspecto | Valor |
|---|---|
| Ventaja | Se conserva la velocidad de Tailwind, pero el resultado es visualmente distintivo. |
| Desventaja | Requiere trabajo de diseño previo y decisiones fuertes de identidad visual. |
| Costo de cambio | Bajo. Solo configuración y componentes. |
| Diferenciación visual | Alta si se hace con intención. |

---

### 3. CSS Modules / vanilla-extract

Usar CSS puro o `vanilla-extract` para tener estilos con scope, type-safety y cero runtime.

| Aspecto | Valor |
|---|---|
| Ventaja | Total control visual. Sin dependencia de utilidades. Bundle pequeño. |
| Desventaja | Más lento de escribir. Requiere definir todo el sistema de diseño desde cero. |
| Costo de cambio | Medio. Astro soporta CSS Modules nativamente. |
| Diferenciación visual | Muy alta. |

**Recomendación:** Elegir esta opción solo si se tiene claro el diseño visual y se quiere un sitio "artesanal".

---

### 4. Open Props

Librería de variables CSS predefinidas (colores, espaciado, sombras, tipografía). No es un framework de componentes.

```bash
npm install open-props
```

Se combina con CSS Modules o un CSS global para construir un sistema propio encima.

| Aspecto | Valor |
|---|---|
| Ventaja | Variables CSS sólidas y consistentes. No impone clases de utilidad. Permite diseños distintivos. |
| Desventaja | No da componentes. Hay que escribir más CSS. |
| Costo de cambio | Bajo. Funciona con Astro sin configuración extra. |
| Diferenciación visual | Alta si se usa como base de un sistema propio. |

**URL:** https://open-props.style

---

### 5. Panda CSS

Framework CSS-in-JS que genera estáticamente clases utilitarias pero con API de estilos en TypeScript.

| Aspecto | Valor |
|---|---|
| Ventaja | Type-safe, generación estática, theme propio, buena integración con frameworks modernos. |
| Desventaja | Nuevo ecosistema, curva de aprendizaje, comunidad más pequeña que Tailwind. |
| Costo de cambio | Medio. Requiere configurar `panda.config.ts` y entender su modelo. |
| Diferenciación visual | Alta si se define un theme propio fuerte. |

**URL:** https://panda-css.com

---

### 6. UnoCSS

Motor de CSS atómico configurable. Permite crear reglas propias, shortcuts, presets personalizados.

| Aspecto | Valor |
|---|---|
| Ventaja | Extremadamente rápido en build. Permite un preset propio para forzar un lenguaje visual único. |
| Desventaja | Configuración más avanzada. Menos ejemplos en Astro que Tailwind. |
| Costo de cambio | Medio. Requiere configurar preset propio. |
| Diferenciación visual | Alta si se define un preset custom. |

**URL:** https://unocss.dev

---

### 7. PostCSS + SASS + design tokens

Stack tradicional pero robusto: SASS para organizar estilos, PostCSS para optimizar, design tokens en JSON/YAML.

| Aspecto | Valor |
|---|---|
| Ventaja | Control total. Fácil de mantener para diseños complejos. |
| Desventaja | Más verboso. Necesita más setup. |
| Costo de cambio | Medio. Astro soporta SASS nativamente con `npm install sass`. |
| Diferenciación visual | Alta. |

---

## Comparativa resumida

| Opción | Diferenciación visual | Costo de adopción | Curva de aprendizaje | Comunidad/docs |
|---|---|---|---|---|
| Tailwind puro | Baja | Bajo | Baja | Alta |
| Tailwind + capa propia | Alta | Bajo | Baja | Alta |
| CSS Modules / vanilla-extract | Muy alta | Medio | Media | Media |
| Open Props | Alta | Bajo | Baja | Media |
| Panda CSS | Alta | Medio | Media | Media |
| UnoCSS | Alta | Medio | Media | Media |
| PostCSS + SASS + tokens | Alta | Medio | Media | Alta |

---

## Recomendación final

Para este proyecto, la mejor opción es **Tailwind CSS + capa de diseño propia**.

**Razones:**
1. Astro + Tailwind es el setup más rápido y documentado.
2. La diferenciación no viene del framework, sino de las decisiones de diseño: tipografía, paleta, espaciado, microinteracciones y voz visual.
3. Permite iterar rápido sin aprender una herramienta nueva.
4. Se puede migrar a CSS Modules, Panda o SASS más adelante si el diseño lo demanda.

**Elementos de la capa propia que propongo incluir en el plan:**
- Paleta definida en `tailwind.config.js` usando HSL semántico.
- Fuente principal y fuente de display cargadas como variables CSS.
- Sistema de espaciado y escala tipográfica propios.
- Componentes base (`Button`, `Card`, `Prose`) con estilo editorial/brutalista acorde a la marca personal.
- Animaciones simples con CSS puro y `@keyframes` integrados en Tailwind.

**Alternativa secundaria:** Si el usuario quiere salirse completamente de Tailwind, recomiendo **Open Props + CSS Modules** por su balance entre libertad visual y bajo costo de mantenimiento en Astro.

---

## Nota para el plan actualizado

Al reescribir el plan, reemplazar la línea:

```
Estilos | Tailwind CSS
```

por:

```
Estilos | Tailwind CSS con capa de diseño propia (paleta, tipografía, componentes base custom)
```

Y agregar una tarea explícita en la Fase 2:

> **Definir sistema de diseño visual en `tailwind.config.js`** — paleta semántica, fuentes, espaciado, animaciones y componentes base. Verificar visualmente con una página de estilos (`/design-system`).
