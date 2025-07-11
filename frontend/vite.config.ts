import {defineConfig} from 'vite'
import solid from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [solid(), tailwindcss()],
    base: process.env.VITE_DOCKER ? "/static/" : "/",
    build: {
        outDir: "./build"
    },
    server: {
        port: 3000,
        proxy: {
            "/api": "http://localhost:8000",
        }
    }
})