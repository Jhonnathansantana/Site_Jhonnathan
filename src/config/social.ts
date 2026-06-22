import type { SocialLink } from "../types";

export const SOCIALS: SocialLink[] = [
    {
        name: "Github",
        href: "https://github.com/Jhonnathansantana",
        linkTitle: `Perfil de GitHub de Jhonnathan`,
        isActive: true,
    },
    {
        name: "LinkedIn",
        href: "https://www.linkedin.com/in/jhonnathansantana/",
        linkTitle: `LinkedIn de Jhonnathan`,
        isActive: true,
    },
    {
        name: "Mail",
        href: "mailto:jhonnathan@example.com",
        linkTitle: `Enviar correo a Jhonnathan`,
        isActive: true,
    },
];

export const SOCIAL_ICONS: Record<string, string> = {
    Github: "Github",
    Mail: "Mail",
    Linkedin: "LinkedIn",
    "Google Scholar": "GoogleScholar",
    ORCID: "ORCID",
    RSS: "RSS",
};