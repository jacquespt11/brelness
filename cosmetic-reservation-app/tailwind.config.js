// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    // Configuration du mode sombre via classe CSS
    darkMode: 'class',

    // Indique à Tailwind où chercher les classes utilisées
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],

    theme: {
        extend: {
            /*
            Les couleurs sont définies dans le fichier tailwind.config.js
            */
            colors: {
                cosmetic: {
                    primary: '#8B5CF6', // violet
                    secondary: '#EC4899', // rose
                    light: '#FDF2F8',   // rose clair
                    dark: '#1F2937',    // gris foncé
                }
            }
        },
    },

    plugins: [],
}