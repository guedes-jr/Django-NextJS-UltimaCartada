import type { Metadata } from "next";
import { ConsultoriaPublicPage } from "@/components/consultoria/ConsultoriaPublicPage";
import { getConsultoriaMetadata } from "@/components/consultoria/metadata";

export function generateMetadata(): Metadata {
  return getConsultoriaMetadata("game");
}

export default function CartadaVivaPage() {
  return <ConsultoriaPublicPage page="game" />;
}
