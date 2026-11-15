import { isConsultoriaSiteEnabled } from "@/components/consultoria/release";
import type { Metadata, Viewport } from "next";
import { PwaInstall } from "@/components/pwa/PwaInstall";
import "./globals.css";

export function generateMetadata(): Metadata {
  const enabled = isConsultoriaSiteEnabled();
  return {
    title: enabled ? "Magaly Abreu | Psicóloga e Mentora" : "Cartada Viva | Jogo e mentoria",
    description:
      enabled ? "Mentoria A Última Cartada, de Magaly Abreu, com o Game Cartada Viva incluído." : "Jogo terapêutico de hábitos e mentoria em grupo.",
    manifest: "/manifest.webmanifest",
    icons: { icon: [{ url: "/cartada-viva-favicon.svg", type: "image/svg+xml" }] },
    appleWebApp: { capable: true, title: "Cartada Viva", statusBarStyle: "default" },
  };
}

export function generateViewport(): Viewport {
  return { themeColor: isConsultoriaSiteEnabled() ? "#702C40" : "#1b1813" };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning>{children}<PwaInstall presentation={isConsultoriaSiteEnabled() ? "consultoria" : "legacy"} /></body>
    </html>
  );
}
