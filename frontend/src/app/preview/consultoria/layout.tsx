import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ConsultoriaShell } from "@/components/consultoria/ConsultoriaShell";

export const metadata: Metadata = {
  title: { default: "Prévia | Magaly Abreu", template: "%s | Prévia Magaly Abreu" },
  robots: { index: false, follow: false, nocache: true },
};

export default function ConsultoriaPreviewLayout({ children }: { children: ReactNode }) {
  // Não disponibilizar uma apresentação ainda não aprovada em um deploy normal.
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_CONSULTORIA_PREVIEW !== "true") notFound();
  return <ConsultoriaShell>{children}</ConsultoriaShell>;
}
