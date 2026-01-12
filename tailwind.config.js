/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./App.tsx",
        "./views/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#135bec",
                "primary-light": "#eef4ff",
                "background-light": "#f6f6f8",
                "background-dark": "#101622",
                "surface-dark": "#1e2736",
                "surface-light": "#ffffff",
                "card-dark": "#1c2333",
            },
            fontFamily: {
                "display": ["Noto Sans SC", "sans-serif"],
                "sans": ["Noto Sans SC", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "2xl": "1rem",
                "full": "9999px"
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'),
    ],
}
