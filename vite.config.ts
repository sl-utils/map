import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'

const demoWorkerDir = fileURLToPath(new URL('./demo/assets/', import.meta.url))
const mimeTypes: Record<string, string> = {
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
}

function serveDemoWorkers(): Plugin {
  return {
    name: 'serve-demo-workers',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname)
        const prefix = '/assets/'

        if (!pathname.startsWith(prefix)) {
          next()
          return
        }

        const filePath = resolve(demoWorkerDir, pathname.slice(prefix.length))

        if (!filePath.startsWith(demoWorkerDir) || !existsSync(filePath) || !statSync(filePath).isFile()) {
          next()
          return
        }

        res.setHeader('Content-Type', mimeTypes[extname(filePath)] ?? 'application/octet-stream')
        createReadStream(filePath).pipe(res)
      })
    },
  }
}
// https://vite.dev/config/
export default defineConfig({
  // 让 Vite 将 .gltf 和 .glb 文件视为静态资源处理
  assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.geojson', '**/*.json'],
  plugins: [serveDemoWorkers()],
  publicDir: 'demo/assets',
  build: {
    outDir: 'build',
    sourcemap: true,
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
    port: 5172,
  }
})
