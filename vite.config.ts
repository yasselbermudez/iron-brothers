import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
      deleteOriginFile: false,
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false,
    }),
    visualizer({
      filename: 'bundle-analysis.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React y React-DOM en chunk separado para carga bajo demanda
          if (id.includes('node_modules/react-dom')) {
            return 'react-dom'
          }
          if (id.includes('node_modules/react')) {
            return 'react'
          }
          // Radix-UI
          if (id.includes('@radix-ui')) {
            return 'radix-ui'
          }
          // React Router
          if (id.includes('react-router')) {
            return 'react-router'
          }
          // Lucide icons
          if (id.includes('lucide-react')) {
            return 'lucide-icons'
          }
          // Resto de node_modules
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 3,
      },
      output: {
        comments: false,
      },
    } as any,
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 600,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@radix-ui/react-avatar'],
  },
})