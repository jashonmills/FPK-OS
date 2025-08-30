
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
      // Proxy SCORM content requests to Supabase edge function
      // Preserve full path: /api/scorm/content/packageId/filePath -> /scorm-content-proxy/packageId/filePath
      '/api/scorm/content': {
        target: 'https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/scorm\/content/, '/scorm-content-proxy'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxying SCORM content request:', req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('SCORM content response:', proxyRes.statusCode, req.url);
          });
        }
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
