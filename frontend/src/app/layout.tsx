import type { Metadata, Viewport } from "next";
import { PwaInstall } from "@/components/pwa/PwaInstall";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cartada Viva | Jogo e mentoria",
  description:
    "Jogo terapêutico de hábitos e mentoria em grupo.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Cartada Viva", statusBarStyle: "default" },
};

export const viewport: Viewport = { themeColor: "#1b1813" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning>{children}<PwaInstall /></body>
    </html>
  );
}
