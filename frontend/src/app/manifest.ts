import { isConsultoriaSiteEnabled } from "@/components/consultoria/release";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const enabled = isConsultoriaSiteEnabled();
  return {
    name: "Cartada Viva",
    short_name: "Cartada Viva",
    description: enabled ? "Cartada Viva — Game de hábitos incluído na Mentoria A Última Cartada, de Magaly Abreu." : "Cartada Viva — uma aplicação educacional da proposta A Última Cartada, de Magaly Abreu.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: enabled ? "#FAF5EF" : "#fffaf3",
    theme_color: enabled ? "#702C40" : "#1b1813",
    lang: "pt-BR",
    icons: [
      { src: "/pwa-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
