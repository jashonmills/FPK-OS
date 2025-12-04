import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load all env files (including .env.local) from project root and inject into define
  const env = loadEnv(mode, process.cwd(), '');
  const defineFromEnv: Record<string, string> = {};
  Object.keys(env).forEach((key) => {
    // ensure values are stringified for Vite's define replacement
    defineFromEnv[`import.meta.env.${key}`] = JSON.stringify(env[key]);
  });

  return {
    server: {
      host: "::",
      port: 8080,
    },
    // ensure env files are read from project root
    envDir: path.resolve(__dirname),
    // keep default VITE_ prefix behavior explicit
    envPrefix: 'VITE_',
    plugins: [
      react(), 
      mode === "development" && componentTagger(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt'],
        manifest: {
          name: 'FPX CNS-App',
          short_name: 'FPX CNS',
          description: 'Care coordination and progress tracking putting Parents in control',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait',
          icons: [
            {
              src: '/favicon.ico',
              sizes: '64x64 32x32 24x24 16x16',
              type: 'image/x-icon'
            }
          ]
        },
        workbox: {
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB limit
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}']
        }
      })
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // inject env values so import.meta.env.VITE_* is reliably available at runtime
    define: defineFromEnv,
  };
});
