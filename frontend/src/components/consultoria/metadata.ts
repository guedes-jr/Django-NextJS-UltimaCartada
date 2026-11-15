import type { Metadata } from "next";
import { publicRoutes, type ConsultoriaPage } from "./content";

const descriptions: Record<ConsultoriaPage, { title: string; description: string }> = {
  herbalife: {
    title: "Herbalife — Informação comercial | Magaly Abreu",
    description: "Orientação comercial sobre cadastro e compra de produtos Herbalife, apresentada separadamente da Mentoria A Última Cartada e do Game Cartada Viva.",
  },
  home: {
    title: "Magaly Abreu | Psicóloga e Mentora",
    description: "Consciência para mudar. Hábitos para continuar. Conheça a Mentoria A Última Cartada e o Game Cartada Viva, incluído na mentoria de Magaly Abreu.",
  },
  mentorship: {
    title: "A Última Cartada — Mentoria | Magaly Abreu",
    description: "Conheça a Mentoria A Última Cartada, de Magaly Abreu: consciência e construção de hábitos, com a experiência do Game Cartada Viva incluída.",
  },
  game: {
    title: "Cartada Viva — Game | Magaly Abreu",
    description: "Conheça o Game Cartada Viva, experiência educativa de hábitos incluída na Mentoria A Última Cartada. O percurso depende da jornada vinculada ao seu grupo.",
  },
};

export function getConsultoriaMetadata(page: ConsultoriaPage): Metadata {
  const { title, description } = descriptions[page];
  return {
    metadataBase: new URL("https://magalyabreu.com.br"),
    title,
    description,
    alternates: { canonical: publicRoutes[page] },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: "Magaly Abreu",
      title,
      description,
      url: publicRoutes[page],
    },
    twitter: { card: "summary", title, description },
  };
}
