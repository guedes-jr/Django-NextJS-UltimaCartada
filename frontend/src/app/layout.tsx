import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Magaly Abreu | Bem-estar Premium",
  description:
    "Consultoria Herbalife com acompanhamento personalizado para uma rotina com mais energia, equilíbrio e bem-estar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
