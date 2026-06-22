# Guía de despliegue y configuración en Netlify

Esta guía asume que el repositorio ya está conectado a Netlify (deploy from GitHub) y que la rama por defecto es `main`.

## 1. Configurar variables de entorno

1. Ir al dashboard de Netlify y seleccionar el sitio.
2. Navegar a **Site configuration > Environment variables**.
3. Agregar estas variables:

   | Variable | Valor | ¿Requerida? |
   |---|---|---|
   | `OPENAI_API_KEY` | La clave que te proporcionó OpenAI | Sí |
   | `OPENAI_MODEL` | `gpt-4o-mini` | Sí |
   | `ALLOWED_HOSTS` | `site-jhonnathan.netlify.app` (o tu dominio real) | Opcional |

4. Guardar. Netlify las inyectará automáticamente en el build y en las functions.

**Importante:** nunca copies `OPENAI_API_KEY` en archivos del repositorio.

## 2. Habilitar Netlify Identity

1. En el dashboard, ir a **Site configuration > Identity**.
2. Hacer clic en **Enable Identity**.
3. En **Registration preferences**, elegir **Invite only** (recomendado para un panel privado).
4. En **External providers**, dejar solo los que necesites (por ejemplo, GitHub).
5. En **Identity > Users**, hacer clic en **Invite users** y enviar invitación a tu correo.

## 3. Habilitar Git Gateway

1. Ir a **Site configuration > Identity > Services**.
2. Hacer clic en **Enable Git Gateway**.
3. Autorizar acceso al repositorio `Jhonnathansantana/Site_Jhonnathan`.
4. Confirmar que la rama seleccionada es `main`.

## 4. Probar Decap CMS

1. Desplegar el sitio (o esperar al deploy automático tras push).
2. Acceder a `https://site-jhonnathan.netlify.app/admin/`.
3. Iniciar sesión con la invitación de Identity.
4. Crear o editar una entrada de blog.
5. Verificar que la barra flotante **Asistente IA** aparece con botones: Sugerir títulos, Borrador, Mejorar texto, Resumir.

## 5. Configurar dominio personalizado (cuando esté disponible)

1. En Netlify, ir a **Domain settings > Add custom domain**.
2. Seguir las instrucciones de DNS.
3. Actualizar en el repositorio:
   - `astro.config.mjs`: cambiar `site` al dominio real.
   - `public/admin/config.yml`: descomentar y actualizar `site_url` y `logo_url`.
   - `ALLOWED_HOSTS` en Netlify si se usa validación de origen.
4. Hacer push de los cambios.

## 6. Configurar correo de contacto (cuando lo confirmes)

Actualizar estos archivos con tu correo real:

- `src/config/social.ts` (enlace "Mail").
- `src/pages/services.astro` (href de las tarjetas de servicio).

## Solución de problemas comunes

- **El asistente de IA devuelve 500:** revisar que `OPENAI_API_KEY` esté configurada y que la cuenta tenga saldo/créditos.
- **Decap CMS no carga:** verificar Identity y Git Gateway habilitados, y que el navegador no bloquee cookies de terceros.
- **Los cambios del CMS no se reflejan:** Git Gateway hace commit a `main`; puede tomar unos minutos en desplegar.
- **Error de origen no permitido:** revisar `ALLOWED_HOSTS` y que el dominio de acceso coincida.
