import type { Metadata } from "next";
import { StyleGuide } from "@/components/consultoria/StyleGuide";

export const metadata: Metadata = {
  title: "Guia visual e criativos — Rascunho",
  description: "Paleta, tipografia, componentes e composições de referência para revisão da identidade Magaly Abreu.",
};

export default function StyleGuidePage() {
  return <StyleGuide />;
}
