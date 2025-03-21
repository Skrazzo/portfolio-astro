// for extended variables to work, global.css needs to be included
/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                "background-opacity-25": "var(--background-opacity-25)",
                "background-opacity-80": "var(--background-opacity-80)",
                light: "var(--text)",
                dimmed: "var(--text-dimmed)",
                dimmer: "var(--text-dimmer)",
                accent: "var(--accent)",
                "accent-light": "var(--accent-light)",
                "panel-background": "var(--panel-background)",
                "panel-background-dimmer": "var(--panel-background-dimmer)",
                "panel-border": "var(--panel-border)",
                "panel-border-lighter": "var(--panel-border-lighter)",
                "panel-border-dimmer": "var(--panel-border-dimmer)",
            },
            fontSize: {
                // Normal font sizes
                title: "var(--text-title)",
                lg: "var(--text-lg)",
                md: "var(--text-md)",
                sm: "var(--text-sm)",
                xs: "var(--text-xs)",

                // Mobile font sizes
                "mobile-title": "var(--text-mobile-title)",
                "mobile-lg": "var(--text-mobile-lg)",
                "mobile-md": "var(--text-mobile-md)",
                "mobile-sm": "var(--text-mobile-sm)",
                "mobile-xs": "var(--text-mobile-xs)",
            },
            screens: {
                sm: "640px",
                md: "768px",
                lg: "1024px",
                xl: "1280px",
                "2xl": "1536px",
            },
            animation: {
                "bounce-slow": "bounce 3s linear infinite",
            },
        },
    },
    plugins: [],
};
