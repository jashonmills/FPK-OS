
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
      'Cross-Origin-Embedder-Policy': 'credentialless',
      'Cross-Origin-Opener-Policy': 'same-origin'
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
    '**/*.pdf'
  ],
  define: {
    global: 'globalThis',
  },
  build: {
    rollupOptions: {
      external: ['pdfjs-dist/legacy/build/pdf.worker.min.js'],
      output: {
        manualChunks: {
          'pdf-worker': ['pdfjs-dist']
        }
      }
    },
    sourcemap: mode === 'development'
  }
}));
