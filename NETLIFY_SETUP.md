# Configuración en Netlify

## 1. Variables de entorno

En el dashboard de Netlify del sitio:

- Ir a **Site configuration > Environment variables**.
- Agregar:
  - `OPENAI_API_KEY` = la clave real (nunca en el repo).
  - `OPENAI_MODEL` = `gpt-4o-mini` (u otro modelo).
  - Opcional: `ALLOWED_HOSTS` = `site-jhonnathan.netlify.app` (o dominio real).

## 2. Netlify Identity

- Ir a **Site configuration > Identity**.
- Hacer clic en **Enable Identity**.
- Configurar registro: recomendado **Invite only** para un panel privado.
- Invitar al usuario administrador.

## 3. Git Gateway

- Dentro de **Identity > Services**, habilitar **Git Gateway**.
- Autorizar acceso al repositorio `Jhonnathansantana/Site_Jhonnathan`.
- Confirmar que la rama es `main`.

## 4. Decap CMS

- Acceder a `https://site-jhonnathan.netlify.app/admin/`.
- Iniciar sesión con la invitación de Identity.
- Verificar que la barra "Asistente IA" aparece al editar una entrada.

## 5. Dominio real

Cuando se configure un dominio personalizado:

- Actualizar `site` en `astro.config.mjs`.
- Descomentar y actualizar `site_url` y `logo_url` en `public/admin/config.yml`.
- Actualizar `ALLOWED_HOSTS` si se usa validación de origen.
