import type { Metadata } from "next";
import { PwaInstall } from "@/components/pwa/PwaInstall";
import "./globals.css";

export const metadata: Metadata = {
  title: "A Última Cartada | Jogo e mentoria",
  description:
    "Jogo terapêutico de hábitos e mentoria em grupo.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "A Última Cartada", statusBarStyle: "default" },
};

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
