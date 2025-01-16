import {defineConfig} from 'vite'
import solid from 'vite-plugin-solid'
import dotenv from 'dotenv'

// only load dot env if env variables have not been injected by docker (if not in a running container)
if (!process.env.VITE_DEBUG) {
    dotenv.config({path: "../.env"})
}

export default defineConfig({
    plugins: [solid()],
    // if in production/running in docker, add static prefix to all files (where the static files are stored)
    base: process.env.VITEINDOCKER? "/static/" : "/",
    build: {
        outDir: "../backend/dist",
    },
    server: {
        port: 3000,
        proxy: {
            "/api": "http://localhost:" + process.env.VITE_DJANGO_PORT,
        }
    }
})