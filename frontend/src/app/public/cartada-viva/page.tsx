import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { ConsultoriaPublicPage } from "@/components/consultoria/ConsultoriaPublicPage";
import { isConsultoriaSiteEnabled } from "@/components/consultoria/release";
import { getConsultoriaMetadata } from "@/components/consultoria/metadata";

export function generateMetadata(): Metadata {
  return isConsultoriaSiteEnabled() ? getConsultoriaMetadata("game") : {};
}

export default function CartadaVivaPage() {
  if (isConsultoriaSiteEnabled()) return <ConsultoriaPublicPage page="game" />;
  permanentRedirect("/public/ultima-cartada");
}
