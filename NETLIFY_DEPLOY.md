# Guía de despliegue y configuración en Netlify

Pasos detallados para publicar el sitio y habilitar CMS, autenticación y la función de IA.

---

## 1. Requisitos previos

- Repositorio en GitHub, GitLab o Bitbucket con este proyecto.
- Cuenta en [Netlify](https://netlify.com).
- Cuenta en [OpenAI](https://platform.openai.com) con una API key válida y saldo disponible.

---

## 2. Configuración del repositorio

Asegúrate de que los siguientes archivos estén en `main` y commiteados:

- `netlify.toml` (build, functions y redirects).
- `public/_redirects` (fallback SPA para `/admin`).
- `public/admin/config.yml` y `public/admin/index.html`.
- `netlify/functions/ai-assistant.js`.
- `package.json` con el script `build`: `astro build && pagefind --site dist`.
- `.env.example` sin valores reales.

Revisa que `.gitignore` no excluya accidentalmente `dist/` (se genera en build) ni la función.

---

## 3. Importar el proyecto en Netlify

1. Inicia sesión en [https://app.netlify.com](https://app.netlify.com).
2. Haz clic en **Add new site > Import an existing project**.
3. Autoriza a Netlify para acceder a tu proveedor Git.
4. Selecciona el repositorio `Site_Jhonnathan`.
5. En la pantalla de configuración del build deja los valores leídos de `netlify.toml`:

   | Campo                   | Valor                         |
   | ----------------------- | ----------------------------- |
   | Build command           | `npm run build`               |
   | Publish directory     | `dist`                        |
   | Functions directory   | `netlify/functions`           |
   | Node version          | `22.12.0` (o superior)        |

6. Haz clic en **Deploy site**.

Netlify comenzará el primer build. Si falla, revisa los logs en **Deploys > Production deploy log**.

---

## 4. Variables de entorno

La función `ai-assistant.js` requiere una clave de OpenAI. Nunca la incluyas en el repositorio.

1. En el panel del sitio, ve a **Site settings > Environment variables**.
2. Añade una nueva variable:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: tu clave real, por ejemplo `sk-...`
3. Añade opcionalmente:
   - **Key**: `OPENAI_MODEL`
   - **Value**: `gpt-4o-mini` (o `gpt-4o`, etc.)
4. Guarda y vuelve a desplegar:
   - **Deploys > Trigger deploy > Clear cache and retry deploy**.

---

## 5. Netlify Identity

Decap CMS usa Netlify Identity para autenticar a los editores.

### 5.1 Habilitar Identity

1. En el panel del sitio ve a la pestaña **Identity**.
2. Haz clic en **Enable Identity**.

### 5.2 Configurar registro

1. Dentro de Identity, ve a **Settings > Registration**.
2. Recomendado para sitios personales: cambia a **Invite only**.
3. Configura los correos de confirmación/invitación si lo deseas.

### 5.3 Proveedores externos (opcional)

1. Ve a **Settings > External providers**.
2. Activa **GitHub** o **Google** para facilitar el inicio de sesión.
3. Guarda los cambios.

---

## 6. Git Gateway

Git Gateway permite que Decap CMS escriba posts directamente en el repositorio.

1. Dentro de **Identity**, selecciona **Services > Git Gateway**.
2. Haz clic en **Enable Git Gateway**.
3. Selecciona el repositorio y la rama `main`.
4. Netlify creará automáticamente un token de acceso privado.
5. Verifica que el estado muestre "Enabled".

Si más adelante mueves el repo o cambias el propietario, deshabilita y vuelve a habilitar Git Gateway.

---

## 7. Invitar usuarios administradores

1. Ve a **Identity > Users**.
2. Haz clic en **Invite users**.
3. Introduce los correos de las personas que editarán contenido.
4. Selecciona el rol adecuado (`Owner`, `Admin` o `Editor`).
5. Envía las invitaciones.

---

## 8. Acceder al CMS

Después del despliegue, el panel está en:

```text
https://<tu-sitio>.netlify.app/admin
```

1. Abre la URL.
2. Inicia sesión con el método configurado (correo/contraseña o proveedor externo).
3. Si Git Gateway e Identity están bien configurados, verás la colección **Blog** lista para editar.

---

## 9. Verificación post-despliegue

### 9.1 Build

- En Netlify: **Deploys > Production deploy log** debe terminar con "Site is live" y sin errores.
- El build local también debe funcionar:

  ```bash
  npm run build
  npm run preview
  ```

### 9.2 Páginas principales

- Home: `/`
- Blog: `/blog`
- Sobre mí: `/sobre-mi`
- Servicios: `/servicios`
- Portafolio: `/portafolio`
- Contacto: `/contacto`

### 9.3 Búsqueda Pagefind

- Comprueba que exista `dist/pagefind/`.
- Prueba el campo de búsqueda en `/blog`.

### 9.4 CMS

- Abre `/admin` y asegúrate de que carga sin errores en consola.
- Crea un borrador de prueba y guárdalo; debe aparecer un PR/branch con `cms/` en GitHub.

### 9.5 Asistente de IA

- Desde el editor de Decap CMS, usa el botón de IA para "Generar borrador".
- Si devuelve texto, la función y la variable `OPENAI_API_KEY` están correctas.

---

## 10. Solución de problemas comunes

| Síntoma                         | Causa probable                          | Solución                                                                 |
| ------------------------------- | --------------------------------------- | ------------------------------------------------------------------------ |
| `/admin` en blanco              | Redirección SPA incorrecta              | Verifica `_redirects` y `netlify.toml`; `/admin/*` debe ir a `index.html`. |
| Login falla                     | Identity deshabilitado                  | Habilita Identity en el panel.                                           |
| CMS no guarda                   | Git Gateway deshabilitado               | Habilita Git Gateway y revisa permisos del repo.                           |
| Error 500 en IA                 | `OPENAI_API_KEY` ausente/inválida       | Configúrala en Environment variables y re-deploy.                        |
| Búsqueda vacía                  | Pagefind no indexó                      | Revisa logs de `npm run build`; `pagefind --site dist` debe ejecutarse.    |
| CSS/JS 404                      | URL base incorrecta                     | Confirma `site` en `astro.config.mjs` con el dominio de Netlify.         |

---

## 11. Actualizar el sitio tras cambios

Cada push a `main` activa un nuevo deploy automáticamente.

Para forzar un rebuild limpio:

1. **Deploys > Trigger deploy > Clear cache and retry deploy**.
2. O localmente:

   ```bash
   npm run build
   npm run preview
   ```

---

## 12. Dominio personalizado (opcional)

1. En el panel: **Domain settings > Add custom domain**.
2. Sigue las instrucciones de DNS.
3. Actualiza `site_url` y `site` en:
   - `astro.config.mjs`
   - `public/admin/config.yml`
4. Vuelve a desplegar.

---

## 13. Lista de verificación final

- [ ] Sitio importado en Netlify con build `npm run build`.
- [ ] `dist` como publish directory.
- [ ] Node version `>=22.12.0`.
- [ ] `OPENAI_API_KEY` en Environment variables.
- [ ] Netlify Identity habilitado.
- [ ] Git Gateway habilitado con rama `main`.
- [ ] Usuario(s) invitado(s) al CMS.
- [ ] `/admin` accesible y funcional.
- [ ] `npm run build` final local exitoso.
- [ ] Pagefind indexa correctamente.
- [ ] Función `/.netlify/functions/ai-assistant` responde (en producción).
