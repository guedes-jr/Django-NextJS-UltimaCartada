import type { Metadata, Viewport } from "next";
import { PwaInstall } from "@/components/pwa/PwaInstall";
import "./globals.css";

export const metadata: Metadata = {
  title: "Última Cartada | Método e prática cotidiana",
  description:
    "Método Última Cartada, de Magaly Abreu, e sua aplicação prática Cartada Viva: hábitos, autoconhecimento e escolhas do cotidiano.",
  manifest: "/manifest.webmanifest",
  icons: { icon: [{ url: "/cartada-viva-favicon.svg", type: "image/svg+xml" }] },
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
