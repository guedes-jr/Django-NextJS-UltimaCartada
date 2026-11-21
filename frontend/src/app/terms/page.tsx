import type { Metadata } from "next";
import { ConsultoriaAccessTheme } from "@/components/consultoria/ConsultoriaAccessTheme";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";

export function generateMetadata(): Metadata {
  return { title: "Termos de Uso | Magaly Abreu" };
}

export default function TermsPage() {
  return <ConsultoriaAccessTheme><LegalDocumentPage kind="TERMS" brandName="Magaly Abreu" /></ConsultoriaAccessTheme>;
}
