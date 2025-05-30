// vite.config.ts
import { defineConfig } from 'vite'
import * as vue from '@vitejs/plugin-vue'
import * as vuetify from 'vite-plugin-vuetify'

import * as path from 'path'

export default defineConfig({
  plugins: [
  vue.default(),
  vuetify.default({ autoImport: true })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
