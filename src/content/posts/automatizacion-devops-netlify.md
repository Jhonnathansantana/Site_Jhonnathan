---
title: "Automatización DevOps con Netlify y GitHub Actions"
date: "2025-04-08"
description: "Lecciones aprendidas automatizando despliegues continuos para sitios estáticos y funciones serverless."
author: "Jhonnathan De Jesús Araujo Santana"
tags: ["devops", "netlify", "github actions", "despliegue continuo"]
image: "/jhonnathan.jpg"
---

Desplegar sitios estáticos con funciones serverless ya no debería requerir procesos manuales. En los últimos proyectos que he liderado, la combinación de **Netlify**, **GitHub Actions** y **Astro** ha permitido reducir el tiempo entre un commit y una versión productiva a pocos minutos.

## El flujo objetivo

1. El desarrollador hace push a `main`.
2. GitHub Actions ejecuta linting, pruebas y build.
3. Netlify recibe el artefacto y despliega automáticamente.
4. Las funciones serverless se despliegan junto al sitio.

## Configuración mínima pero segura

Para un sitio en Astro con funciones de Netlify, la configuración base incluye:

- `netlify.toml` con `[build]`, `[functions]` y redirecciones.
- Variables de entorno gestionadas solo en Netlify, nunca en el repositorio.
- Scripts de post-build como `pagefind --site dist` para generar índice de búsqueda.
- `.env.example` en el repo para documentar variables necesarias.

## Seguridad en el pipeline

Una buena práctica que aplico consistentemente:

- Claves API, tokens y credenciales viven en variables de entorno del dashboard.
- Los secretos nunca se imprimen en logs.
- El acceso a ramas protegidas requiere revisión previa.
- La función serverless valida origen y contenido antes de consumir APIs externas.

## Errores comunes que evito

- Construir en Node 25+ cuando el ecosistema aún no es compatible con Tailwind v4/Vite.
- Depender de librerías que no funcionan en el runtime de Netlify Functions.
- Olvidar actualizar `external` en Vite cuando se carga Pagefind de forma dinámica.

## Resultado

El resultado es un sitio rápido, indexado, seguro y fácil de mantener. El costo operativo se reduce y la confianza del equipo aumenta porque cada cambio pasa por un proceso reproducible.
