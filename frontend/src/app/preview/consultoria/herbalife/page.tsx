import type { Metadata } from "next";
import { HerbalifeInformation } from "@/components/consultoria/HerbalifeInformation";

export const metadata: Metadata = {
  title: "Herbalife — Atividade comercial separada",
  description: "Prévia da separação comercial entre Herbalife, mentoria e game.",
};

export default function HerbalifePreviewPage() {
  return <HerbalifeInformation />;
}
