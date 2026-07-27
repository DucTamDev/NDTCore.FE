// vite.config.ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
    plugins: [vue(), vueDevTools(), vuetify({ autoImport: true }), cloudflare()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
})