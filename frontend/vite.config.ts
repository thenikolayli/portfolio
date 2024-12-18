import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import * as dotenv from "dotenv";
dotenv.config({path: "../.env"});

export default defineConfig({
    plugins: [solid()],
    base: process.env.DEBUG === "True" ? "/" : "/static/",
    server: {
        port: 3000,
        proxy: {
          "/api": "http://localhost:8000"
        }
    }
})
