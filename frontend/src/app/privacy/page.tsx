import type { Metadata } from "next";
import { ConsultoriaAccessTheme } from "@/components/consultoria/ConsultoriaAccessTheme";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";

export function generateMetadata(): Metadata {
  return { title: "Política de Privacidade | Magaly Abreu" };
}

export default function PrivacyPage() {
  return <ConsultoriaAccessTheme><LegalDocumentPage kind="PRIVACY" brandName="Magaly Abreu" /></ConsultoriaAccessTheme>;
}
