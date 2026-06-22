# Site Jhonnathan

Sitio web personal/profesional construido con Astro, React, Tailwind CSS, Decap CMS y Pagefind.

## Stack

- [Astro](https://astro.build) — generación estática y Astro Islands.
- [React](https://react.dev) — componentes interactivos.
- [Tailwind CSS](https://tailwindcss.com) — estilos.
- [Decap CMS](https://decapcms.org) — CMS visual basado en Git (panel en `/admin`).
- [Pagefind](https://pagefind.app) — búsqueda local estática.
- [Netlify](https://netlify.com) — hosting, Identity, Git Gateway y Functions.
- [OpenAI](https://openai.com) — asistente de redacción en el CMS.

## Estructura

```text
/
├── public/
│   ├── admin/             # Decap CMS
│   ├── _redirects         # Reglas de redirección de Netlify
│   └── assets/blog/       # Imágenes subidas desde el CMS
├── netlify/
│   └── functions/
│       └── ai-assistant.js # Función serverless del asistente de IA
├── src/
│   ├── components/        # React/Astro
│   ├── content/           # Markdown del blog/gestión Decap CMS
│   ├── layouts/
│   ├── pages/
│   └── styles/
├── astro.config.mjs
├── netlify.toml
├── package.json
└── .env.example
```

## Comandos

Ejecutar desde la raíz del proyecto:

| Comando            | Acción                                            |
| ------------------ | ------------------------------------------------- |
| `npm install`      | Instala dependencias.                             |
| `npm run dev`      | Servidor local en `http://localhost:4321`.        |
| `npm run build`    | Build estático + índice Pagefind en `./dist/`.    |
| `npm run preview`  | Previsualiza el build local.                      |

## Variables de entorno

Copia `.env.example` como `.env` para desarrollo local y completa los valores:

```bash
cp .env.example .env
```

| Variable         | Requerida | Descripción                          |
| ---------------- | --------- | ------------------------------------ |
| `OPENAI_API_KEY` | Sí        | Clave de API de OpenAI.              |
| `OPENAI_MODEL`   | No        | Modelo. Por defecto: `gpt-4o-mini`.  |

En producción configúralas desde el panel de Netlify: **Site settings > Environment variables**.

## Despliegue en Netlify

### 1. Crear el sitio

1. Entra a [https://app.netlify.com](https://app.netlify.com) e inicia sesión.
2. **Add new site > Import an existing project**.
3. Selecciona el repositorio de GitHub/Bitbucket/GitLab.
4. Deja los valores por defecto que lee de `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
5. Haz clic en **Deploy site**.

### 2. Configurar variables de entorno

1. Ve al panel del sitio: **Site settings > Environment variables**.
2. Añade `OPENAI_API_KEY` con tu clave de OpenAI.
3. Opcional: añade `OPENAI_MODEL` (por ejemplo, `gpt-4o-mini`).
4. Vuelve a desplegar si ya se había iniciado un build (**Deploys > Trigger deploy > Clear cache and retry deploy**).

### 3. Activar Netlify Identity

1. En el panel del sitio ve a **Identity**.
2. Haz clic en **Enable Identity**.
3. Configura los proveedores que desees (por ejemplo, GitHub) en **Settings > External providers**.
4. Opcional: en **Settings > Registration**, cambia a **Invite only** para controlar quién puede acceder.

### 4. Activar Git Gateway

1. Dentro de **Identity**, selecciona **Services > Git Gateway**.
2. Haz clic en **Enable Git Gateway**.
3. Confirma el repositorio y la rama (`main`).
4. Netlify generará un token de acceso para que Decap CMS escriba en el repo.

### 5. Invitar usuarios del CMS

1. En **Identity > Users**, haz clic en **Invite users**.
2. Envía invitaciones a las personas que administrarán el contenido.
3. Los invitados recibirán un correo con enlace para aceptar.

### 6. Acceder al panel de administración

Una vez desplegado, el CMS está disponible en:

```text
https://<tu-sitio>.netlify.app/admin
```

Inicia sesión con el método que configuraste (por ejemplo, correo/contraseña o GitHub).

## Diagnóstico rápido

- Si `/admin` muestra una pantalla en blanco, revisa las reglas `_redirects` y `netlify.toml`; `admin/*` debe servir `admin/index.html`.
- Si el CMS no guarda contenido, verifica que Git Gateway esté habilitado y que el repositorio tenga permisos correctos.
- Si el asistente de IA devuelve error 500, revisa que `OPENAI_API_KEY` exista como variable de entorno en Netlify y que tenga saldo/permisos para `gpt-4o-mini`.
- Si la búsqueda no funciona, confirma que `pagefind` indexa después de Astro (`npm run build` ejecuta `pagefind --site dist`).

## Notas

- Las imágenes del CMS se guardan en `public/assets/blog/` y se exponen públicamente como `/assets/blog/`.
- El sitio usa el workflow editorial de Decap CMS (`publish_mode: editorial_workflow`), por lo que los cambios pasan por estados de borrador/review/publicado antes de llegar a `main`.
- El build local y en Netlify deben generar `dist/pagefind/` con el índice de búsqueda.

---

Autor: Jhonnathan.
