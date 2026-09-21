import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cartada Viva",
    short_name: "Cartada Viva",
    description: "Jogo terapêutico e mentoria em grupo.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#fffaf3",
    theme_color: "#1b1813",
    lang: "pt-BR",
    icons: [
      { src: "/pwa-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
