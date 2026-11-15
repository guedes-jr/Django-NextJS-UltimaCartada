import type { Metadata } from "next";
import { ConsultoriaAccessTheme } from "@/components/consultoria/ConsultoriaAccessTheme";
import { isConsultoriaSiteEnabled } from "@/components/consultoria/release";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";

export function generateMetadata(): Metadata {
  return isConsultoriaSiteEnabled() ? { title: "Política de Privacidade | Magaly Abreu" } : {};
}

export default function PrivacyPage() {
  return <ConsultoriaAccessTheme><LegalDocumentPage kind="PRIVACY" brandName={isConsultoriaSiteEnabled() ? "Magaly Abreu" : "A Última Cartada"} /></ConsultoriaAccessTheme>;
}
