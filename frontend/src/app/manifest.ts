import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "A Última Cartada",
    short_name: "Última Cartada",
    description: "Jogo terapêutico e mentoria em grupo.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#fffdf8",
    theme_color: "#073f4d",
    lang: "pt-BR",
    icons: [
      { src: "/pwa-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
