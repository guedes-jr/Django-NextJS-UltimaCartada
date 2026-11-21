import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import PublicNavigation from "@/components/landing/PublicNavigation";
import { cormorant, montserrat } from "./fonts";
import { consultoria, consultoriaPendingDetails, getConsultoriaInstagram, getConsultoriaProfessionalIdentity, previewRoutes, type ConsultoriaRoutes } from "./content";
import styles from "./Consultoria.module.css";
import theme from "./BrandTheme.module.css";

export function ConsultoriaShell({ children, routes = previewRoutes, preview = true }: { children: ReactNode; routes?: ConsultoriaRoutes; preview?: boolean }) {
  const instagram = getConsultoriaInstagram();
  const professionalIdentity = getConsultoriaProfessionalIdentity();
  return (
    <div className={`${styles.site} ${theme.theme} ${cormorant.variable} ${montserrat.variable}`}>
      <a className={styles.skipLink} href="#conteudo">Pular para o conteúdo</a>
      {preview && <aside className={styles.previewNotice} aria-label="Versão para revisão">
        <span>Prévia para aprovação</span>
        <p>Nova apresentação em desenvolvimento. Duração, contato oficial, dados profissionais e arquivos originais das marcas aguardam confirmação.</p>
        <details className={styles.pendingDetails}>
          <summary>Dados provisórios para revisão final</summary>
          <dl>{consultoriaPendingDetails.map(({ label, value }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        </details>
        <Link href="/preview/consultoria/guia-visual">Conferir o guia visual e os criativos</Link>
        <Link href="/preview/consultoria/revisao">Abrir o roteiro de revisão</Link>
      </aside>}
      <header className={styles.header}>
        <Link className={styles.brand} href={routes.home} aria-label="Magaly Abreu — início">
          <strong>{consultoria.name}</strong>
          <span>{consultoria.role}</span>
        </Link>
        <PublicNavigation id="consultoria-navigation" label="Navegação da apresentação de Magaly Abreu" className={styles.navigation}>
          <Link href={routes.home}>Magaly Abreu</Link>
          <Link href={routes.mentorship}>A mentoria</Link>
          <Link href={routes.game}>O game</Link>
          <a href="#contato">Contato</a>
        </PublicNavigation>
        <Link className={styles.accessLink} href="/login">Entrar na minha área <ArrowUpRight size={15} aria-hidden="true" /></Link>
      </header>
      <main id="conteudo" tabIndex={-1}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <Link className={styles.brand} href={routes.home} aria-label="Magaly Abreu — início">
            <strong>{consultoria.name}</strong><span>{consultoria.role}</span>
          </Link>
          <p>{consultoria.message}</p>
          <nav aria-label="Experiências de Magaly Abreu">
            <Link href={routes.mentorship}>A Última Cartada — Mentoria</Link>
            <Link href={routes.game}>Cartada Viva — Game</Link>
            <Link href="/login">Entrar na minha área</Link>
            {instagram && <a href={instagram.url} target="_blank" rel="noopener noreferrer">Instagram {instagram.username}</a>}
          </nav>
        </div>
        {professionalIdentity && <p className={styles.professionalIdentity}>{professionalIdentity}</p>}
        <div className={styles.footerBottom}>
          <p>O game é uma experiência educativa de hábitos. Não substitui atendimento psicológico, nutricional ou médico.</p>
          <nav aria-label="Informações legais"><Link href="/terms">Termos de uso</Link><Link href="/privacy">Privacidade</Link></nav>
        </div>
        <div className={styles.commercialNote}>
          <p>A atividade comercial de produtos Herbalife é apresentada separadamente das experiências de mentoria e game.</p>
          <Link href={routes.herbalife}>Informações sobre Herbalife <ArrowUpRight size={14} aria-hidden="true" /></Link>
        </div>
      </footer>
    </div>
  );
}
