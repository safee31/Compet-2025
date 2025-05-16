import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig(({ mode }) => {
  // Load environment variables based on the mode (development/production)
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          {
            src: "node_modules/@pdftron/webviewer/public/*", // Source directory from node_modules
            dest: "lib/webviewer", // Destination directory in the public folder
          },
        ],
      }),
    ],
    optimizeDeps: {
      include: ["@mui/material/Tooltip", "@emotion/styled", "@emotion/react"],
    },
    build: {
      outDir: "dist",
      assetsDir: "assets",
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"), // Alias for src
      },
    },
    server: {
      // host: "0.0.0.0",
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL || "http://localhost:8000", // Use VITE_API_BASE_URL from .env
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""), // Remove /api prefix
        },
      },
    },
    define: {
      "import.meta.env": env, // Make env variables available globally
    },
  };
});
