import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { consultoria, consultoriaOfferDetails, getConsultoriaContact, pendingContactNotice, previewRoutes, sharedQuestions, type ConsultoriaRoutes } from "./content";
import styles from "./Consultoria.module.css";

type ActionProps = { href: string; children: ReactNode; secondary?: boolean; external?: boolean };
export function ActionLink({ href, children, secondary = false, external = false }: ActionProps) {
  const externalProps = external ? {
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": typeof children === "string" ? `${children} (abre em nova aba)` : "Abrir link em nova aba",
  } : {};
  return <Link className={secondary ? styles.secondaryButton : styles.primaryButton} href={href} {...externalProps}>{children}<ArrowUpRight size={18} aria-hidden="true" /></Link>;
}

export function Hero({ eyebrow, title, description, children, image = "/landing/professional/acauamedia-130.jpg", alt = "Retrato profissional de Magaly Abreu", caption = "Magaly Abreu · Psicóloga e Mentora", footnote = "Um caminho com espaço para a vida real." }: {
  eyebrow: string; title: ReactNode; description: string; children: ReactNode; image?: string; alt?: string; caption?: string; footnote?: string;
}) {
  return <section className={styles.hero}>
    <div className={styles.heroCopy}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1>{title}</h1>
      <p className={styles.heroDescription}>{description}</p>
      <div className={styles.actions}>{children}</div>
      <p className={styles.heroFootnote}>{footnote}</p>
    </div>
    <figure className={styles.heroFigure}>
      <div className={styles.heroImage}><Image src={image} alt={alt} fill priority sizes="(max-width: 540px) calc(100vw - 32px), (max-width: 760px) 500px, (max-width: 1296px) 48vw, 540px" /></div>
      <figcaption>{caption}</figcaption>
    </figure>
  </section>;
}

export function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return <div className={styles.sectionHeading}><p className={styles.eyebrow}>{eyebrow}</p><h2>{title}</h2>{children && <p>{children}</p>}</div>;
}

export function Inclusion({ compact = false, routes = previewRoutes }: { compact?: boolean; routes?: ConsultoriaRoutes }) {
  return <aside className={compact ? styles.inclusionCompact : styles.inclusion} aria-label="Game incluído na mentoria">
    <span className={styles.inclusionLabel}>Uma experiência incluída</span>
    <h2>Mentoria para acompanhar.<br />Game para praticar.</h2>
    <p>{consultoria.inclusion}</p>
    <Link className={styles.textLink} href={routes.game}>Conhecer o Game Cartada Viva <ArrowRight size={18} aria-hidden="true" /></Link>
  </aside>;
}

export function Questions({ game = false }: { game?: boolean }) {
  const questions = game ? [
    { question: "O que é o Cartada Viva?", answer: "É um game educativo de hábitos, com propostas práticas, registro de intenção e evidência, histórico e acompanhamento do próprio progresso. Ele se conecta à abordagem de Magaly Abreu e à Mentoria A Última Cartada." },
    sharedQuestions[1],
    { question: "Posso comprar ou acessar o game separadamente?", answer: "Esta página apresenta o game e sua inclusão na mentoria. Para conhecer a proposta e esclarecer possibilidades de participação, converse com Magaly. Não há inscrição independente disponível nesta página." },
    { question: "Os meus registros pessoais ficam públicos?", answer: "Os registros de intenção e evidência da jornada diária são privados e têm acesso autorizado. A comunidade é um espaço distinto para convivência em grupo; não é necessário publicar ali um relato íntimo para conhecer a proposta." },
    sharedQuestions[3],
    sharedQuestions[4],
    sharedQuestions[5],
  ] : sharedQuestions;
  return <section className={styles.section} id="perguntas">
    <SectionHeading eyebrow="Antes de começar" title="Clareza para escolher.">Algumas respostas para conhecer a relação entre a mentoria, o game e o seu momento.</SectionHeading>
    <div className={styles.questions}>{questions.map(({ question, answer }) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
  </section>;
}

export function Contact({ game = false, routes = previewRoutes }: { game?: boolean; routes?: ConsultoriaRoutes }) {
  const contact = getConsultoriaContact(game ? "game" : "mentoria");
  return <section className={styles.contact} id="contato" aria-labelledby="contact-title">
    <div><p className={styles.eyebrow}>O próximo passo pode ser uma conversa</p><h2 id="contact-title">Conhecer. Perguntar.<br />Escolher com clareza.</h2><p>Entenda a proposta, esclareça as condições de participação e veja como essa experiência se conecta ao seu momento.</p></div>
    <div className={styles.contactActions}>
      {contact ? <ActionLink href={contact} external>Conversar com Magaly</ActionLink> : <p className={styles.contactPending}>{pendingContactNotice}</p>}
      <Link className={styles.textLink} href={game ? routes.mentorship : routes.game}>{game ? "Conhecer a Mentoria A Última Cartada" : "Conhecer o Game Cartada Viva"}<ArrowRight size={18} aria-hidden="true" /></Link>
    </div>
  </section>;
}


export function OfferConditions({ game = false }: { game?: boolean }) {
  const items = game ? [
    { label: "Participação na mentoria", value: "Inclui a experiência do Game Cartada Viva" },
    { label: "Duração e jornadas incluídas", value: consultoriaOfferDetails.gameDuration },
  ] : [
    { label: "Formato do acompanhamento", value: consultoriaOfferDetails.format },
    { label: "Duração da mentoria", value: consultoriaOfferDetails.mentorshipDuration },
    { label: "Encontros e frequência", value: consultoriaOfferDetails.meetings },
    { label: "Materiais e suporte", value: consultoriaOfferDetails.materials },
    { label: "Game Cartada Viva", value: "Incluído na mentoria, sem nova aquisição do game" },
    { label: "Duração e jornadas do game", value: consultoriaOfferDetails.gameDuration },
  ];
  return <section className={styles.section} id="condicoes">
    <SectionHeading eyebrow="Condições de participação" title="Informações para uma escolha consciente.">A inclusão do game está confirmada. Os detalhes indicados como “A confirmar” ainda estão em definição e precisam ser esclarecidos antes da participação.</SectionHeading>
    <dl className={styles.offerConditions}>{items.map(({ label, value }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
  </section>;
}
