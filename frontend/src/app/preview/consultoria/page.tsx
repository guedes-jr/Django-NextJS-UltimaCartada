import type { Metadata } from "next";
import { ConsultoriaHome } from "@/components/consultoria/ConsultoriaPages";

export const metadata: Metadata = {
  title: "Consciência para mudar. Hábitos para continuar.",
  description: "Conheça Magaly Abreu, a Mentoria A Última Cartada e o Game Cartada Viva incluído na mentoria.",
};

export default function PreviewPage() {
  return <ConsultoriaHome />;
}
