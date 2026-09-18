import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(() => {
  const noIndex = process.env.STAGING_NOINDEX === "true";

  return {
    base: process.env.VITE_BASE_PATH || "/",
    plugins: [
      react(),
      {
        name: "staging-noindex",
        transformIndexHtml() {
          return noIndex
            ? [
                {
                  tag: "meta",
                  attrs: { name: "robots", content: "noindex, nofollow" },
                  injectTo: "head",
                },
              ]
            : [];
        },
      },
    ],
    build: {
      rollupOptions: {
        output: {
          entryFileNames: "assets/site.[hash].js",
          chunkFileNames: "assets/[name].[hash].js",
          assetFileNames(assetInfo) {
            const names = assetInfo.names || [assetInfo.name || "asset"];
            return names.some((name) => name.endsWith(".css"))
              ? "assets/site.[hash][extname]"
              : "assets/[name].[hash][extname]";
          },
        },
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: "./src/tests/setupTests.js",
    },
  };
});
