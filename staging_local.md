# Despliegue de Ambiente Local de Pruebas - Staging

## Requisitos Previos

- Node.js v18.17.0 o superior
- npm v9.0.0 o superior
- Git
- Cuenta en GitHub (para autenticación de Decap CMS)

---

## Paso 1: Crear el proyecto Astro

```bash
cd C:\Users\jhonn\Downloads\Site_Jhonnathan
npm create astro@latest . -- --template basics --yes
```

## Paso 2: Instalar React y Tailwind CSS

```bash
npx astro add react
npx astro add tailwind
```

## Paso 3: Instalar dependencias adicionales

```bash
npm install @astrojs/mdx
npm install pagefind
```

## Paso 4: Configurar Decap CMS

Crear la carpeta y archivos en `public/admin/`:

```
public/admin/
├── index.html
└── config.yml
```

### `public/admin/index.html`

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Content Manager</title>
  </head>
  <body>
    <script src="https://unpkg.com/decap-cms@^3/dist/decap-cms.js"></script>
  </body>
</html>
```

### `public/admin/config.yml`

```yaml
backend:
  name: git-gateway
  branch: main

media_folder: public/uploads
public_folder: /uploads

collections:
  - name: blog
    label: Blog
    folder: src/content/blog
    create: true
    slug: "{{slug}}"
    fields:
      - { label: Título, name: title, widget: string }
      - { label: Fecha, name: date, widget: datetime }
      - { label: Descripción, name: description, widget: string }
      - { label: Imagen, name: image, widget: image, required: false }
      - { label: Cuerpo, name: body, widget: markdown }
  - name: servicios
    label: Servicios
    folder: src/content/servicios
    create: true
    slug: "{{slug}}"
    fields:
      - { label: Título, name: title, widget: string }
      - { label: Descripción, name: description, widget: string }
      - { label: Icono, name: icon, widget: string, required: false }
      - { label: Cuerpo, name: body, widget: markdown }
  - name: portafolio
    label: Portafolio
    folder: src/content/portafolio
    create: true
    slug: "{{slug}}"
    fields:
      - { label: Título, name: title, widget: string }
      - { label: Cliente, name: client, widget: string, required: false }
      - { label: URL, name: url, widget: string, required: false }
      - { label: Imagen, name: image, widget: image, required: false }
      - { label: Cuerpo, name: body, widget: markdown }
```

## Paso 5: Iniciar servidor de desarrollo local

```bash
npm run dev
```

El sitio estará disponible en: `http://localhost:4321`

El panel de administración de Decap CMS estará en: `http://localhost:4321/admin`

---

## Comandos Útiles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia servidor de desarrollo en localhost:4321 |
| `npm run build` | Compila el sitio para producción |
| `npm run preview` | Previsualiza la build de producción localmente |

---

## Notas

- El panel de Decap CMS solo funcionará completamente cuando el proyecto esté conectado a un repositorio de GitHub y configurado con Netlify/Vercel para autenticación.
- En local, los archivos se editan directamente en la carpeta `src/content/`.
- Pagefind requiere ejecutar `npx pagefind --source dist` después de `npm run build` para indexar el contenido.