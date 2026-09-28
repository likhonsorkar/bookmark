import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Writes dist/sw.js from sw-template.js with the exact list of built files,
// so the whole app shell is cached on first visit and works offline (PWA).
function offlineServiceWorker() {
  return {
    name: 'offline-service-worker',
    apply: 'build',
    generateBundle(_, bundle) {
      const built = Object.keys(bundle).map((f) => (f === 'index.html' ? '/' : `/${f}`))
      const skip = new Set(['_routes.json', '_headers', '_redirects', 'sw.js'])
      const publicFiles = fs
        .readdirSync(path.resolve('public'))
        .filter((f) => !skip.has(f))
        .map((f) => `/${f}`)
      const precache = [...new Set([...built, ...publicFiles])]

      const template = fs.readFileSync(path.resolve('sw-template.js'), 'utf8')
      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: template
          .replace('__VERSION__', Date.now().toString(36))
          .replace('__PRECACHE__', JSON.stringify(precache)),
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), offlineServiceWorker()],
  server: {
    // Dev-only proxy (same idea as functions/api/[[path]].js in production)
    proxy: {
      '/api': {
        target: 'https://publicapi.likhon.com.bd',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
    },
  },
})
