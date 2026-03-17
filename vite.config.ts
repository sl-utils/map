import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// https://vite.dev/config/
export default defineConfig({
  // 让 Vite 将 .gltf 和 .glb 文件视为静态资源处理
  assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.geojson', '**/*.json'],
  plugins: [vue()],
  build: {
    outDir: 'build',
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      name: 'test',
    },
    rollupOptions: {
      output: {
        // 关键配置：保留模块结构
        preserveModules: true,
        inlineDynamicImports: false,
        // 可选，指定保留的根目录，默认为项目根目录
        preserveModulesRoot: 'src',
        format: 'es', // 或 'esm'
        // 控制入口文件的命名
        entryFileNames: '[name].js',
        // 控制其他模块文件的命名，保持目录结构
        chunkFileNames: '[name].js',
      },
    },
  },
  server: {
    port: 5172
  }
})
