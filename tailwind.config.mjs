// for extended variables to work, global.css needs to be included
/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                light: "var(--text)",
                dimmed: "var(--text-dimmed)",
                dimmer: "var(--text-dimmer)",
                accent: "var(--accent)",
                "accent-light": "var(--accent-light)",
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
        },
    },
    plugins: [],
};
