import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Build optimizations to reduce bundle size and improve load performance
  build: {
    target: "es2018",
    minify: "esbuild",
    sourcemap: false,
    brotliSize: false,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'vendor_react';
            if (id.includes('lucide-react')) return 'vendor_icons';
            return 'vendor';
          }
        },
      },
    },
  },
}));
