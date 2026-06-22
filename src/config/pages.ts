import type { PagesConfig } from "../types";

export const PAGES: PagesConfig = {
    home: {
        title: "Sobre mí",
        subtitle: "",
        isActive: true,
    },
    blog: {
        title: "Blog",
        subtitle: "Reflexiones sobre tecnología, ciberseguridad, gestión de TI y educación.",
        isActive: true,
    },
    publications: {
        title: "Publicaciones",
        subtitle: "Artículos, papers y materiales académicos.",
        isActive: false,
    },
    talks: {
        title: "Charlas",
        subtitle: "Presentaciones y conferencias.",
        isActive: false,
    },
    projects: {
        title: "Proyectos",
        subtitle: "Experimentos, repositorios y desarrollo asistido por IA.",
        isActive: true,
    },
    services: {
        title: "Servicios",
        subtitle: "Consultoría y acompañamiento en TI, ciberseguridad, DevOps, docencia e IA productiva.",
        isActive: true,
    },
    teaching: {
        title: "Docencia",
        subtitle: "Cursos, talleres y materiales educativos.",
        isActive: true,
    },
    tags: {
        title: "Etiquetas",
        subtitle: "Explora contenido por tema.",
        isActive: true,
    },
    cv: {
        title: "Currículum",
        subtitle: "Trayectoria académica y profesional.",
        isActive: true,
    },
};
