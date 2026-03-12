import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'build',
    lib: {
      entry: 'src/sl-utils-map.ts',
      name: 'test',
      fileName: (format) => `sl-utils-map.${format}.js`,
    },
  },
  server: {
    port: 5172
  }
})
