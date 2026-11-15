import type { Metadata } from "next";
import { ConsultoriaGame } from "@/components/consultoria/ConsultoriaPages";

export const metadata: Metadata = {
  title: "Cartada Viva — Game",
  description: "Conheça o Game Cartada Viva: práticas de hábitos, intenção, evidência e progresso. Uma experiência incluída na Mentoria A Última Cartada.",
};

export default function PreviewPage() {
  return <ConsultoriaGame />;
}
