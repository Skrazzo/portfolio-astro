/** @type {import("prettier").Config} */
const config = {
    trailingComma: "es5",
    printWidth: 120,
    tabWidth: 4,
    semi: true,
    singleQuote: false,
    plugins: ["prettier-plugin-astro"],
    overrides: [
        {
            files: "*.astro",
            options: {
                parser: "astro",
            },
        },
    ],
};

export default config;
