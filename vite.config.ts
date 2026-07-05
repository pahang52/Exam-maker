import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteSingleFile()
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  build: {
    target: "esnext",

    rollupOptions: {
      // مهم برای Capacitor (حل خطای build GitHub Actions)
      external: [
        "@capacitor/filesystem",
        "@capacitor/share"
      ],
    },

    // جلوگیری از خطاهای chunk در APK
    chunkSizeWarningLimit: 2000,
    minify: "esbuild",
  },

  optimizeDeps: {
    exclude: [
      "@capacitor/filesystem",
      "@capacitor/share"
    ],
  },

  define: {
    // جلوگیری از crash در runtime وب
    global: "window",
  },
});
