# Mejora de UX/UI y versión móvil para Site_Jhonnathan

> **For Hermes:** Implementa este plan directamente. Tareas pequeñas, cambios visuales, build después de cada grupo de cambios.

**Goal:** Mejorar la experiencia visual y la usabilidad del portafolio, especialmente en móvil, con navegación hamburguesa, sidebar más limpio, tarjetas pulidas, footer simplificado y mejor jerarquía tipográfica.

**Architecture:** El sitio usa Astro + Tailwind CSS 4 con CSS personalizado en `src/styles/global.css`. El layout es sidebar fija + área principal. Los cambios se limitan a estilos, componentes de layout y algunos ajustes de contenido; no se toca la lógica de colecciones ni la función de IA.

**Tech Stack:** Astro 6, Tailwind CSS 4, CSS variables, Noto Sans, JetBrains Mono.

---

## Current context / assumptions

- Rama activa: `main` en `C:\Users\jhonn\Downloads\Site_Jhonnathan`.
- Build actual: 44 páginas, Pagefind 42 páginas / 780 palabras.
- Layout actual: `BaseLayout.astro` renderiza `LeftSidebar` + `RightMain` con `Navbar`, `Footer`.
- Navbar actual es lista horizontal que se flex-wrap en pantallas pequeñas.
- `global.css` ya tiene media queries básicas para `max-width: 1024px` y `768px`.
- El footer muestra enlace "Developer Tools" cuando `SETTINGS.addDevToolsInProduction` es true.
- El sitio usa modo oscuro automático + toggle manual.

---

## Step-by-step plan

### Task 1: Preparar componente de menú móvil (hamburguesa)

**Objective:** Reemplazar la navegación flex-wrap por un menú hamburguesa usable en móvil.

**Files:**
- Modify: `src/components/layout/Navbar.astro`
- Modify: `src/styles/global.css` (sección navbar)

**Step 1: Reescribir `Navbar.astro`**

```astro
---
import { NAV_LINKS, PAGES } from "../../config";

const currentPath = Astro.url.pathname;
const visibleLinks = NAV_LINKS.filter((link) => {
    const isHome = link.href === "/";
    const pageKey = isHome ? "home" : link.href.split("/").filter(Boolean)[0];
    const pageConfig = (PAGES as any)[pageKey];
    return link.isActive !== false && pageConfig?.active !== false;
});
---

<nav class="navbar" aria-label="Principal">
    <div class="navbar-inner">
        <a href="/" class="navbar-brand md:hidden" aria-label="Inicio">
            <span class="font-bold text-foreground">{SITE.title}</span>
        </a>
        <button
            id="nav-toggle"
            class="nav-toggle"
            aria-expanded="false"
            aria-controls="nav-menu"
            aria-label="Abrir menú"
        >
            <span class="nav-toggle-bar" aria-hidden="true"></span>
            <span class="nav-toggle-bar" aria-hidden="true"></span>
            <span class="nav-toggle-bar" aria-hidden="true"></span>
        </button>
    </div>

    <ul id="nav-menu" class="nav-links" role="menubar">
        {
            visibleLinks.map((link) => (
                <li role="none">
                    <a
                        href={link.href}
                        role="menuitem"
                        class={`nav-link ${
                            currentPath === link.href ||
                            (link.href !== "/" && currentPath.startsWith(link.href))
                                ? "active"
                                : "inactive"
                        }`}
                        aria-current={
                            currentPath === link.href ||
                            (link.href !== "/" && currentPath.startsWith(link.href))
                                ? "page"
                                : undefined
                        }
                    >
                        {link.label}
                        <span class="nav-link-line" aria-hidden="true" />
                    </a>
                </li>
            ))
        }
    </ul>
</nav>

<script is:inline>
    (function () {
        const toggle = document.getElementById("nav-toggle");
        const menu = document.getElementById("nav-menu");
        if (!toggle || !menu) return;

        function closeMenu() {
            menu.classList.remove("open");
            toggle.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Abrir menú");
            document.body.style.overflow = "";
        }

        function openMenu() {
            menu.classList.add("open");
            toggle.classList.add("open");
            toggle.setAttribute("aria-expanded", "true");
            toggle.setAttribute("aria-label", "Cerrar menú");
            document.body.style.overflow = "hidden";
        }

        toggle.addEventListener("click", () => {
            if (menu.classList.contains("open")) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        menu.querySelectorAll(".nav-link").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("astro:after-swap", closeMenu);
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeMenu();
        });
    })();
</script>
```

**Nota:** importar `SITE` en `Navbar.astro` si se usa el brand. Si no se prefiere brand en móvil, omitir.

**Step 2: Actualizar CSS de navbar en `global.css`**

Reemplazar la sección `.navbar`, `.nav-links`, `.nav-link` existente por:

```css
/* Navbar */
.navbar {
    padding: 1rem 1.5rem;
    background: var(--background);
    transition: background 0.3s ease;
}

.navbar-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.navbar-brand {
    font-size: 1rem;
    text-decoration: none;
    color: var(--foreground);
}

.nav-toggle {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 40px;
    height: 40px;
    padding: 0.5rem;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 0.35rem;
    cursor: pointer;
}

.nav-toggle-bar {
    display: block;
    width: 100%;
    height: 2px;
    background: var(--foreground);
    transition: transform 0.3s ease, opacity 0.3s ease;
    border-radius: 1px;
}

.nav-toggle.open .nav-toggle-bar:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
}

.nav-toggle.open .nav-toggle-bar:nth-child(2) {
    opacity: 0;
}

.nav-toggle.open .nav-toggle-bar:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
}

.nav-links {
    display: flex;
    gap: 1.5rem;
    list-style: none;
    padding: 0;
    margin: 0;
    flex-wrap: wrap;
}

.nav-link {
    font-size: 0.9rem;
    font-weight: 600;
    text-decoration: none;
    color: var(--foreground);
    position: relative;
    transition: color 0.2s ease;
    display: inline-block;
    padding: 0.25rem 0;
}

.nav-link.active {
    color: var(--accent);
}

.nav-link.inactive {
    opacity: 0.75;
}

.nav-link-line {
    position: absolute;
    bottom: -0.25rem;
    left: 0;
    width: 0;
    height: 3px;
    background-color: var(--accent);
    transition: width 0.3s ease;
    border-radius: 2px;
}

.nav-link:hover .nav-link-line,
.nav-link.active .nav-link-line {
    width: 100%;
}

@media (max-width: 1024px) {
    .navbar {
        position: sticky;
        top: 0;
        z-index: 20;
        border-bottom: 1px solid var(--border);
        padding: 0.75rem 1rem;
    }

    .nav-toggle {
        display: flex;
    }

    .nav-links {
        display: none;
        position: fixed;
        inset: 60px 0 0 0;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 0;
        padding: 2rem 1rem;
        background: var(--background);
        overflow-y: auto;
        z-index: 30;
    }

    .nav-links.open {
        display: flex;
    }

    .nav-links li {
        width: 100%;
        text-align: center;
        border-bottom: 1px solid var(--border);
    }

    .nav-link {
        display: block;
        padding: 1rem;
        font-size: 1.1rem;
    }

    .nav-link-line {
        display: none;
    }
}
```

**Verification:**
- `npm run build` exitoso.
- Preview en móvil (≈375px): aparece botón hamburguesa, menú ocupa pantalla, cierra al tocar enlace o Escape.
- Desktop: navbar horizontal sin cambios visuales bruscos.

**Step 3: Commit**

```bash
git add src/components/layout/Navbar.astro src/styles/global.css
git commit -m "feat: menú hamburguesa para navegación móvil"
```

---

### Task 2: Rediseñar sidebar para mejor jerarquía y aire

**Objective:** Hacer la sidebar más limpia, con mejor uso del espacio, avatar ligeramente más pequeño en desktop y centrado visual.

**Files:**
- Modify: `src/components/layout/LeftSidebar.astro`
- Modify: `src/styles/global.css` (sección sidebar)

**Step 1: Reescribir `LeftSidebar.astro`**

```astro
---
import { SITE, SOCIALS, SOCIAL_ICONS } from "../../config";
import { getCollection } from "astro:content";
import Icon from "../ui/Icon.astro";
import { Image } from 'astro:assets';

const activeSocials = SOCIALS.filter((s) => s.isActive);
const bioCollection = await getCollection("bio");
const bio = bioCollection[0]?.data;
---

<aside class="sidebar" aria-label="Perfil del autor">
    <div class="sidebar-profile">
        {bio?.avatar && (
            <a href="/" aria-label="Ir al inicio" class="sidebar-avatar-link">
                <Image
                    src={`/${bio.avatar}`}
                    alt={`Avatar de ${bio.name}`}
                    width={160}
                    height={160}
                    densities={[1.5, 2]}
                    format="webp"
                    class="sidebar-avatar"
                    loading="eager"
                />
            </a>
        )}
        <div class="sidebar-text">
            {bio?.name && <h1 class="sidebar-name">{bio.name}</h1>}
            {bio?.institution && (
                <p class="sidebar-info">
                    <Icon name="Institution" size={20} />
                    <span>{bio.institution}</span>
                </p>
            )}
            {bio?.shortBio && (
                <p class="sidebar-bio">{bio.shortBio}</p>
            )}
            <div class="sidebar-socials">
                {activeSocials.map((social) => (
                    <a
                        href={social.href}
                        aria-label={social.linkTitle}
                        title={social.linkTitle}
                        target="_blank"
                        rel="noreferrer"
                        class="social-link"
                    >
                        <Icon name={SOCIAL_ICONS[social.name] || social.name} size={22} />
                    </a>
                ))}
            </div>
        </div>
    </div>
</aside>
```

**Step 2: Actualizar CSS sidebar en `global.css`**

Reemplazar la sección `.sidebar` existente por:

```css
/* Sidebar */
.sidebar {
    width: 280px;
    height: 100vh;
    position: sticky;
    top: 0;
    padding: 3rem 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    background: var(--background);
    border-right: 1px solid var(--border);
    transition: background 0.3s ease;
    overflow-y: auto;
}

.sidebar-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
    gap: 1.25rem;
}

.sidebar-avatar-link {
    display: block;
    line-height: 0;
    border-radius: 50%;
    transition: transform 0.3s ease;
}

.sidebar-avatar-link:hover {
    transform: scale(1.03);
}

.sidebar-avatar {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--border);
    transition: border-color 0.3s ease;
}

.sidebar-avatar:hover {
    border-color: var(--accent);
}

.sidebar-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
}

.sidebar-name {
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.15;
    color: var(--foreground);
    margin: 0;
}

.sidebar-info {
    font-size: 0.8rem;
    color: var(--foreground);
    opacity: 0.7;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    margin: 0;
}

.sidebar-bio {
    font-size: 0.88rem;
    color: var(--foreground);
    opacity: 0.8;
    line-height: 1.55;
    margin: 0.5rem 0 0;
    padding: 0 0.25rem;
}

.sidebar-socials {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 0.75rem;
}
```

**Step 3: Actualizar media queries de sidebar en `global.css`**

Reemplazar `@media (max-width: 1024px)` y `@media (max-width: 768px)` de sidebar por:

```css
@media (max-width: 1024px) {
    .sidebar {
        width: 100%;
        height: auto;
        position: relative;
        border-right: none;
        border-bottom: 1px solid var(--border);
        padding: 1rem;
        flex-direction: row;
        justify-content: center;
    }

    .sidebar-profile {
        flex-direction: row;
        text-align: left;
        gap: 1rem;
        align-items: center;
        max-width: 720px;
    }

    .sidebar-avatar {
        width: 96px;
        height: 96px;
        flex-shrink: 0;
    }

    .sidebar-text {
        align-items: flex-start;
    }

    .sidebar-name {
        font-size: 1.15rem;
    }

    .sidebar-bio {
        display: none;
    }

    .main-body {
        padding: 1rem 1.5rem;
    }

    .main-content {
        width: 100%;
        flex: none;
    }
}

@media (max-width: 480px) {
    .sidebar {
        padding: 0.75rem 1rem;
    }

    .sidebar-profile {
        gap: 0.75rem;
    }

    .sidebar-avatar {
        width: 72px;
        height: 72px;
    }

    .sidebar-name {
        font-size: 1.05rem;
        line-height: 1.2;
    }

    .sidebar-info {
        font-size: 0.75rem;
    }

    .main-body {
        padding: 0.75rem 1rem;
    }
}
```

**Verification:**
- `npm run build` exitoso.
- Preview desktop: sidebar centrada, avatar 140px, más aire.
- Preview tablet: sidebar horizontal compacta.
- Preview móvil: sidebar horizontal mínima, avatar 72px, nombre pequeño.

**Step 4: Commit**

```bash
git add src/components/layout/LeftSidebar.astro src/styles/global.css
git commit -m "feat: sidebar más limpia y responsive mejorado"
```

---

### Task 3: Pulir tarjetas de contenido

**Objective:** Mejorar legibilidad y diseño de las tarjetas en listados de blog/proyectos/docencia/servicios.

**Files:**
- Modify: `src/components/ui/BaseItemCard.astro`
- Modify: `src/styles/global.css` (sección card)

**Step 1: Ajustar `BaseItemCard.astro`**

```astro
---
import Tag from "./Tag.astro";
import Icon from "./Icon.astro";

interface Props {
    title: string;
    href: string;
    description?: string;
    date?: string;
    authors?: string;
    extraInput?: string;
    tags?: string[];
    externalUrl?: string;
    ctaText?: string;
}

const { title, href, description, date, authors, extraInput, tags, externalUrl, ctaText = "Ver más" } = Astro.props;
---

<article class="card">
    <div class="card-content">
        <a href={href} class="card-title">{title}</a>

        <div class="card-meta">
            {date && (
                <span class="flex items-center gap-1.5">
                    <Icon name="Calendar" size={16} />
                    <span>{date}</span>
                </span>
            )}
            {authors && (
                <span class="flex items-center gap-1.5">
                    <Icon name="User" size={16} />
                    <span>{authors}</span>
                </span>
            )}
            {extraInput && (
                <span class="flex items-center gap-1.5">
                    <Icon name="Institution" size={16} />
                    <span>{extraInput}</span>
                </span>
            )}
        </div>

        {
            tags && tags.length > 0 && (
                <div class="card-tags">
                    {tags.map((tag) => (
                        <Tag name={tag} size="sm" />
                    ))}
                </div>
            )
        }

        {description && <p class="card-desc">{description}</p>}
    </div>

    {
        externalUrl && (
            <div class="card-action">
                <a href={externalUrl} target="_blank" rel="noopener noreferrer" class="btn btn-sm">
                    {ctaText}
                </a>
            </div>
        )
    }
</article>
```

**Step 2: Actualizar CSS cards en `global.css`**

Reemplazar la sección `.card` por:

```css
/* Card (list items) */
.card {
    padding: 1.25rem 0;
    border-bottom: 1px dashed var(--border);
    transition: opacity 0.2s ease;
}

.card:last-child {
    border-bottom: none;
}

.card:hover {
    opacity: 0.95;
}

.card-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.card-title {
    font-size: 1.2rem;
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: -0.01em;
    text-decoration: none;
    color: var(--foreground);
    display: inline-block;
    transition: color 0.2s ease;
}

.card-title:hover {
    color: var(--accent);
    text-decoration: underline;
    text-underline-offset: 4px;
}

.card-meta {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--foreground);
    opacity: 0.7;
    display: flex;
    gap: 0.75rem;
    align-items: center;
    flex-wrap: wrap;
}

.card-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin: 0.25rem 0 0.25rem;
}

.card-desc {
    font-size: 0.9rem;
    color: var(--foreground);
    opacity: 0.8;
    line-height: 1.55;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0;
}

.card-action {
    margin-top: 0.75rem;
}

.card-link {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--foreground);
    white-space: nowrap;
    transition: color 0.2s ease;
}

.card-link:hover {
    color: var(--accent);
    text-decoration: underline;
}
```

**Verification:**
- `npm run build` exitoso.
- Preview de `/posts`, `/projects`, `/teaching`, `/services`: tarjetas con separación, iconos pequeños, espaciado mejorado.

**Step 3: Commit**

```bash
git add src/components/ui/BaseItemCard.astro src/styles/global.css
git commit -m "feat: tarjetas de contenido más limpias y legibles"
```

---

### Task 4: Simplificar footer y ocultar dev-tools en producción

**Objective:** Dejar el footer solo con copyright, créditos mínimos y toggle de tema; ocultar el enlace a dev-tools salvo en desarrollo.

**Files:**
- Modify: `src/components/layout/Footer.astro`

**Step 1: Cambiar lógica de dev-tools**

```astro
const showDevTools = import.meta.env.DEV;
```

(O si se desea mantener opt-in, usar solo `import.meta.env.DEV` en vez del setting.)

**Step 2: Ajustar estructura del footer**

```astro
<footer class="footer">
    <div class="flex items-center gap-4 flex-wrap">
        <span class="body-xs">&copy; {currentYear} {SITE.author}.</span>
        <span class="body-xs hidden sm:inline-block opacity-70">
            Hecho con <a href="https://astro.build" target="_blank" rel="noopener noreferrer" class="link">Astro</a>.
        </span>
    </div>
    <div class="flex items-center gap-3">
        <a
            href="/rss.xml"
            aria-label="RSS Feed"
            title="RSS Feed"
            target="_blank"
            rel="noreferrer"
            class="btn-icon"
        >
            <Icon name="RSS" size={16} />
        </a>
        {
            showToggle && (
                <button
                    id="theme-toggle"
                    aria-label="Cambiar tema oscuro/claro"
                    class="btn-icon"
                >
                    <Icon name="Sun" size={16} class="hidden dark:block" />
                    <Icon name="Moon" size={16} class="block dark:hidden" />
                </button>
            )
        }
        {
            showDevTools && (
                <a
                    href="/dev-tools"
                    aria-label="Developer Tools"
                    title="Developer Tools"
                    class="btn-icon"
                >
                    <Icon name="Settings" size={16} />
                </a>
            )
        }
    </div>
</footer>
```

**Verification:**
- Build de producción (`npm run build`) no incluye enlace a `/dev-tools`.
- Footer más limpio y con etiqueta de tema en español.

**Step 3: Commit**

```bash
git add src/components/layout/Footer.astro
git commit -m "feat: footer simplificado y dev-tools solo en desarrollo"
```

---

### Task 5: Ajustar tipografía base para mejor legibilidad

**Objective:** Aumentar ligeramente el tamaño y el interlineado del cuerpo en móvil, y mejorar la escala de títulos.

**Files:**
- Modify: `src/styles/global.css` (tipografía)

**Step 1: Ajustar tipografía base**

En la sección TYPOGRAPHY, actualizar:

```css
/* Body Text */
p,
.body {
    font-size: 1rem;
    line-height: 1.7;
    color: var(--foreground);
    opacity: 0.92;
}

.body-sm {
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--foreground);
    opacity: 0.85;
}

.body-xs {
    font-size: 0.75rem;
    line-height: 1.5;
    color: var(--foreground);
    opacity: 0.75;
}
```

**Step 2: Ajustar títulos para móvil**

Añadir al final de global.css:

```css
@media (max-width: 480px) {
    h1,
    .title-xl,
    .page-title {
        font-size: 1.35rem;
    }

    h2,
    .title-lg {
        font-size: 1.15rem;
    }

    .card-title {
        font-size: 1.1rem;
    }

    .prose {
        font-size: 0.95rem;
    }
}
```

**Verification:**
- Texto más legible en móvil.
- Build exitoso.

**Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: tipografía más legible en móvil"
```

---

### Task 6: Mejorar página de inicio con enlaces destacados

**Objective:** En móvil, la home es solo texto. Agregar tarjetas de acceso rápido a secciones clave.

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Reescribir home**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import { getCollection } from "astro:content";
import { PAGES } from "../config";
import Icon from "../components/ui/Icon.astro";

const bioCollection = await getCollection("bio");
const BioContent = bioCollection[0]?.rendered?.Content;

const quickLinks = [
    { label: "Servicios", href: "/services", icon: "Briefcase" },
    { label: "Blog", href: "/posts", icon: "FileText" },
    { label: "Proyectos", href: "/projects", icon: "Folder" },
    { label: "CV", href: "/cv", icon: "Award" },
];
---

<BaseLayout title={PAGES.home.title}>
    <div class="prose max-w-none">
        {BioContent ? <BioContent /> : <p>Cargando biografía...</p>}
    </div>

    <section class="mt-8" aria-labelledby="quick-links-title">
        <h2 id="quick-links-title" class="section-title">Enlaces destacados</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickLinks.map((link) => (
                <a
                    href={link.href}
                    class="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface hover:border-accent hover:text-accent transition-colors"
                >
                    <Icon name={link.icon} size={20} />
                    <span class="font-semibold text-sm">{link.label}</span>
                </a>
            ))}
        </div>
    </section>
</BaseLayout>
```

**Nota:** Verificar que los iconos `Briefcase`, `FileText`, `Folder`, `Award` existan en `src/components/ui/Icon.astro`. Si no, usar iconos disponibles o agregarlos.

**Step 2: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: enlaces destacados en la página de inicio"
```

---

### Task 7: Ajustar página de servicios para CTAs claros

**Objective:** Convertir cada servicio en una tarjeta con CTA "Contactar" y mejorar el título.

**Files:**
- Modify: `src/pages/services.astro`

**Step 1: Actualizar servicios**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import BaseItemCard from "../components/ui/BaseItemCard.astro";
import services from "../data/services.json";
import { PAGES } from "../config";

const { title, subtitle } = PAGES.services;
---

<BaseLayout title={title}>
    <header class="page-header">
        {title && <h1 class="page-title">{title}</h1>}
        {subtitle && <p class="page-subtitle">{subtitle}</p>}
    </header>

    <section class="item-list">
        {services.map((service) => (
            <BaseItemCard
                title={service.title}
                description={service.description}
                tags={service.tags}
                href="mailto:jhonnathan@example.com"
                externalUrl="mailto:jhonnathan@example.com"
                ctaText="Contactar"
            />
        ))}
    </section>
</BaseLayout>
```

**Verification:**
- `/services` muestra botones "Contactar" debajo de cada servicio.
- Build exitoso.

**Step 2: Commit**

```bash
git add src/pages/services.astro
git commit -m "feat: CTAs de contacto en página de servicios"
```

---

### Task 8: Build final y push

**Objective:** Verificar que todos los cambios compilen y subirlos.

**Step 1: Build limpio**

```bash
rm -rf dist .astro
npm run build
```

**Expected output:**
- 44 páginas generadas.
- Sin errores nuevos.
- Pagefind indexa contenido en español.

**Step 2: Push**

```bash
git push origin main
```

---

## Tests / validation

- `npm run build` exitoso.
- Preview en 375px de ancho: menú hamburguesa funcional, sidebar compacto, tarjetas legibles.
- Preview en 768px: sidebar horizontal, menú hamburguesa.
- Preview en 1280px+: sidebar fija, navegación horizontal.
- Lighthouse móvil (si se ejecuta): legible sin zoom, elementos táctiles bien espaciados.
- El enlace a `/dev-tools` no aparece en build de producción.

---

## Risks, tradeoffs, and open questions

- **Iconos nuevos:** si `Briefcase`, `FileText`, `Folder`, `Award` no existen en `Icon.astro`, se debe adaptar a iconos existentes o agregarlos manualmente.
- **Menú hamburguesa con ClientRouter:** el script `is:inline` se ejecuta en cada navegación; se incluye cierre en `astro:after-swap` para evitar estados inconsistentes.
- **Brand en navbar móvil:** opcional; si se prefiere no mostrar título del sitio, omitir `.navbar-brand`.
- **Correo placeholder:** aún usa `jhonnathan@example.com`; se actualizará cuando el usuario confirme su correo.

---

## Files likely to change

- `src/components/layout/Navbar.astro`
- `src/components/layout/LeftSidebar.astro`
- `src/components/layout/Footer.astro`
- `src/components/ui/BaseItemCard.astro`
- `src/pages/index.astro`
- `src/pages/services.astro`
- `src/styles/global.css`
- `src/components/ui/Icon.astro` (posible, para iconos nuevos)
