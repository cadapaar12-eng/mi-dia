import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import { resolve } from "node:path";

export default defineConfig({
  base: "/mi-dia/",
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        id: "/mi-dia/",
        name: "Mi Día",
        short_name: "Mi Día",
        description:
          "Libreta diaria para medicinas, ánimo, sueño y comidas. Hecha para usarse con calma y letra grande.",
        lang: "es",
        display: "standalone",
        background_color: "#fff4e6",
        theme_color: "#e8763b",
        icons: [
          {
            src: "icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  server: { host: "0.0.0.0", port: 5173 },
});
