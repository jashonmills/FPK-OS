
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      'Cross-Origin-Opener-Policy': 'same-origin'
    },
    proxy: {
      // If you ever accidentally hit /functions/v1 locally, forward it
      '/functions/v1': {
        target: 'http://127.0.0.1:54321',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/functions\/v1/, '/functions/v1')
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['pdfjs-dist'],
    exclude: ['pdfjs-dist/legacy/build/pdf.worker.min.js']
  },
  assetsInclude: [
    '**/*.pdf',
    '**/pdf.worker.min.js'
  ],
  define: {
    global: 'globalThis',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'pdf-viewer': ['react-pdf', 'pdfjs-dist']
        }
      }
    },
    sourcemap: mode === 'development',
    chunkSizeWarningLimit: 1000, // Increase limit for PDF.js chunks
    assetsInlineLimit: 0 // Don't inline assets, serve them separately for better caching
  },
  worker: {
    format: 'es'
  }
}));
