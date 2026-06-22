---
title: "Migrar un sitio personal a Astro 6 + Tailwind CSS 4"
date: "2025-06-22"
description: "Notas técnicas sobre la migración de un portafolio personal a la plantilla academic-portfolio-astro, incluyendo lecciones de Node, Vite y Pagefind."
author: "Jhonnathan De Jesús Araujo Santana"
tags: ["astro", "tailwind css", "pagefind", "portafolio"]
image: "/jhonnathan.jpg"
---

Este mismo sitio es el resultado de una migración reciente. Decidí reemplazar la estructura anterior por la plantilla **academic-portfolio-astro**, aprovechando Astro 6, Tailwind CSS 4, Content Collections y Pagefind.

## Por qué Astro

Astro permite generar sitios estáticos con excelente rendimiento y una experiencia de desarrollo cercana a componentes sin sobrecargar el cliente. Para un portafolio profesional y blog, es una elección natural.

## Retos encontrados

- **Node.js 25** produjo un error `Missing field tsconfigPaths` con Tailwind CSS v4 y Vite. La solución fue instalar **Node 22.23.0** vía nvm.
- **Interfaz de tipografía**: reemplacé Inter por **Noto Sans** para mejorar soporte de idioma español.
- **Tema oscuro automático**: mantuve el modo oscuro como default, con toggle manual persistente.
- **Pagefind** requiere ejecutarse como script `postbuild` para indexar el contenido generado.

## Decisiones de arquitectura

- Colecciones de contenido para posts, proyectos, docencia, bio y CV.
- Decap CMS con asistente de IA privado a través de Netlify Functions.
- Dominio placeholder mientras se configura el dominio personalizado definitivo.
- Variables de entorno seguras; nada de API keys en el repositorio.

## Resultado

Build exitoso con contenido generado en español, Pagefind indexando el sitio, y un panel de administración privado listo para desplegar en Netlify.
