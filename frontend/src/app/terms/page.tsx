import type { Metadata } from "next";
import { ConsultoriaAccessTheme } from "@/components/consultoria/ConsultoriaAccessTheme";
import { isConsultoriaSiteEnabled } from "@/components/consultoria/release";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";

export function generateMetadata(): Metadata {
  return isConsultoriaSiteEnabled() ? { title: "Termos de Uso | Magaly Abreu" } : {};
}

export default function TermsPage() {
  return <ConsultoriaAccessTheme><LegalDocumentPage kind="TERMS" brandName={isConsultoriaSiteEnabled() ? "Magaly Abreu" : "A Última Cartada"} /></ConsultoriaAccessTheme>;
}
