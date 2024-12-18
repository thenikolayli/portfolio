/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
    content: [
        "./index.html",
        "./src/pages/**/*.tsx",
        "./src/components/**/*.tsx",
    ],
    theme: {
        extend: {
            colors: {
                ...colors,
                transparent: 'transparent',
                bg_gray: "#F0F0F0",
                lilac: "#C8A2C8",
                primary: "#58C9FF",
                secondary: "#FF89B5",
                success: "#00B844",
                gold: "#F5C542"
            },
            fontFamily: {
                ibm: ['"IBM Plex Serif"', "serif"],
                code: ['"Source Code Pro"', "sans-serif"],
                vt: ["VT323", "sans-mono"],
                barcode: ['"Libre Barcode 128"', "sans"],
            }
        },
    },
    plugins: [],
}