import type { Theme, ThemeColors, ThemeName } from "../types/themes";

export { type Theme, type ThemeName, type ThemeColors };

export const THEMES: Record<string, Theme> = {
    light_default: {
        background: "#f7f8fa",
        foreground: "#1a1d21",
        accent: "#2563eb",
        muted: "#5f6773",
        border: "#e2e5e9",
        surface: "#ffffff",
        isDark: false,
    },
    dark_default: {
        background: "#121519",
        foreground: "#e8eaed",
        accent: "#60a5fa",
        muted: "#8b929d",
        border: "#2c3036",
        surface: "#1b1f24",
        isDark: true,
    },
};