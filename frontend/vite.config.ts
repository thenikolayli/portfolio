import {defineConfig} from 'vite'
import solid from 'vite-plugin-solid'
import dotenv from 'dotenv'
dotenv.config({path: "../.env"})

export default defineConfig({
    plugins: [solid()],
    base: process.env.VITE_DEBUG === "True" ? "/" : "/static/",
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