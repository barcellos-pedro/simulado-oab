import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const researchPdf = resolve(process.cwd(), "docs/pesquisa.pdf");

function researchPdfPlugin() {
  return {
    name: "serve-research-pdf",
    configureServer(server) {
      server.middlewares.use("/docs/pesquisa.pdf", (_request, response) => {
        response.setHeader("Content-Type", "application/pdf");
        response.end(readFileSync(researchPdf));
      });
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "docs/pesquisa.pdf",
        source: readFileSync(researchPdf),
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    researchPdfPlugin(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Estudos OAB",
        short_name: "Estudos OAB",
        description: "Quiz e acompanhamento para a prova da OAB",
        theme_color: "#f8fafc",
        background_color: "#f8fafc",
        display: "standalone",
        icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
      },
    }),
  ],
});
