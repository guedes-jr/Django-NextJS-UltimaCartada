import type { Metadata } from "next";
import { ConsultoriaMentorship } from "@/components/consultoria/ConsultoriaPages";

export const metadata: Metadata = {
  title: "A Última Cartada — Mentoria",
  description: "Uma mentoria de Magaly Abreu que conecta consciência e hábitos, com o Game Cartada Viva incluído.",
};

export default function PreviewPage() {
  return <ConsultoriaMentorship />;
}
