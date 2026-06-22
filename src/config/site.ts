import type { SiteConfig, ThemeConfig, SettingsConfig, UmamiAnalyticsConfig, AnalyticsConfig } from "../types";

export const SITE: SiteConfig = {
    website: "https://site-jhonnathan.netlify.app/",
    author: {
        name: "Jhonnathan De Jesús Araujo Santana",
        avatar: "/jhonnathan.jpg",
    },
    desc: "Portafolio académico y profesional de Jhonnathan De Jesús Araujo Santana. TI, ciberseguridad, DevOps y docencia.",
    title: "Jhonnathan De Jesús Araujo Santana",
    ogImage: "/jhonnathan.jpg",
    postPerPage: 5,
    favicon: "/favicon.svg",
    lang: "es",
};

export const THEME_CONFIG: ThemeConfig = {
    lightAndDark: true,
    themeLight: "light_default",
    themeDark: "dark_default",
};

export const SETTINGS: SettingsConfig = {
    showTagsInNavbar: true,
    showRSSInFooter: true,
    addDevToolsInProduction: true,
};

const umami: UmamiAnalyticsConfig = {
    websiteId: "", // e.g., 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
    src: "https://cloud.umami.is/script.js", // Default Umami cloud script URL
}

export const ANALYTICS: AnalyticsConfig = {
    // Google Analytics 4 Measurement ID (e.g., 'G-XXXXXXXXXX')
    ga4Id: "",
    // Umami Analytics configuration
    umami: umami
};
