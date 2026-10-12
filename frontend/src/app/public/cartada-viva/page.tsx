import {
  BarChart3,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Gamepad2,
  Layers3,
  Heart,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import styles from "./CartadaVivaPage.module.css";
import PublicNavigation from "@/components/landing/PublicNavigation";

export const metadata: Metadata = {
  title: "Cartada Viva | O Método Última Cartada na prática",
  description:
    "A Cartada Viva é a aplicação educacional e gamificada do Método Última Cartada: pequenas ações nos pilares corpo, nutrição, mentalidade e comunidade.",
};

const WHATSAPP_URL =
  "https://wa.me/5584999181607?text=Olá,%20Magaly!%20Quero%20conhecer%20o%20jogo%20Cartada%20Viva.";

const features = [
  { icon: Layers3, title: "Uma intenção", description: "A cartada do dia convida a reconhecer um cuidado e escolher uma ação possível para a sua rotina." },
  { icon: Sparkles, title: "Uma prática", description: "Você experimenta a proposta no cotidiano, respeitando seu contexto e suas possibilidades." },
  { icon: BarChart3, title: "Um aprendizado", description: "O registro da experiência e o progresso por pilar ajudam a perceber o próprio caminho." },
  { icon: Heart, title: "Um caminho em grupo", description: "Participação e pertencimento acompanham a jornada, com compartilhamento opcional e respeito à privacidade." },
];

const practicalPillars = [
  { title: "Corpo e nutrição", description: "Atenção ao movimento, à alimentação e às escolhas de cuidado que encontram lugar na vida real.", suit: "♣ ♦", phrase: "Eu ajo. Eu me nutro." },
  { title: "Mentalidade", description: "Reflexão e autopercepção para observar experiências, aprender com elas e ajustar a próxima escolha.", suit: "♠", phrase: "Eu transformo." },
  { title: "Comunidade", description: "Uma experiência de pertencimento em que cada pessoa pode participar e retomar no próprio ritmo.", suit: "♥", phrase: "Eu pertenço." },
];

const principles = [
  "A Última Cartada é a metodologia que orienta a experiência.",
  "A Cartada Viva leva os quatro pilares às escolhas do cotidiano.",
  "Pequenas ações aproximam intenção e prática.",
  "Aprender, ajustar e retomar fazem parte do caminho.",
];

export default function CartadaVivaPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          <Image src="/cartada-viva-mark.png" alt="" width={46} height={46} />
          <span className={styles.brandText}><strong>Cartada Viva</strong><small>Método Última Cartada na prática</small></span>
        </Link>

        <PublicNavigation id="cartada-navigation" label="Navegação do Cartada Viva" className={styles.nav}>
          <a href="#ideia">Ideia</a>
          <a href="#telas">Pilares</a>
          <a href="#funciona">Como funciona</a>
          <Link href="/#sobre">Método Última Cartada</Link>
        </PublicNavigation>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Uma aplicação prática do Método Última Cartada</span>
          <h1>Cartada Viva: boas práticas que encontram lugar no seu dia.</h1>
          <p>
            Uma experiência educacional e gamificada que leva a metodologia
            Última Cartada ao cotidiano. Cartas convidam à reflexão e a pequenas
            ações nos pilares corpo, nutrição, mentalidade e comunidade.
          </p>

          <div className={styles.actions}>
            <a
              className={styles.primaryButton}
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
            >
              Conversar sobre a jornada
              <ChevronRight aria-hidden="true" />
            </a>

            <a className={styles.secondaryButton} href="#telas">
              Conhecer os pilares
            </a>
          </div>
        </div>

        <div className={styles.heroScreen}>
          <div className={styles.methodCards} aria-label="Os quatro pilares da jornada">
            <div><span aria-hidden="true">♣</span><strong>Eu ajo</strong><small>Corpo</small></div>
            <div><span aria-hidden="true">♦</span><strong>Eu me nutro</strong><small>Nutrição</small></div>
            <div><span aria-hidden="true">♠</span><strong>Eu transformo</strong><small>Mentalidade</small></div>
            <div><span aria-hidden="true">♥</span><strong>Eu pertenço</strong><small>Comunidade</small></div>
          </div>
        </div>
      </section>

      <section className={styles.idea} id="ideia">
        <div>
          <span className={styles.eyebrow}>Ideia por trás</span>
          <h2>O método dá direção. A cartada convida à prática.</h2>
        </div>

        <div className={styles.principles}>
          {principles.map((principle) => (
            <article key={principle}>
              <CheckCircle2 aria-hidden="true" />
              <p>{principle}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.features} id="funciona">
        <div className={styles.sectionHeader}>
          <Gamepad2 aria-hidden="true" />
          <h2>Como a experiência funciona</h2>
        </div>

        <div className={styles.featureGrid}>
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article key={feature.title}>
                <Icon aria-hidden="true" />
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.screens} id="telas">
        <div className={styles.sectionHeader}>
          <Users aria-hidden="true" />
          <h2>Quatro pilares presentes na jornada</h2>
        </div>

        <div className={styles.screenList}>
          {practicalPillars.map((screen) => (
            <article key={screen.title}>
              <div className={styles.pillarVisual}><span aria-hidden="true">{screen.suit}</span><strong>{screen.phrase}</strong></div>
              <div>
                <h3>{screen.title}</h3>
                <p>{screen.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.finalCta}>
        <div>
          <h2>Conheça o método. Encontre sua forma de praticar.</h2>
          <p>
            A Cartada Viva organiza uma experiência em três jogos de 21 dias,
            combinando prática diária, reflexão e convivência em grupo.
            Converse com Magaly para conhecer a proposta e as possibilidades de participação.
          </p>
        </div>

        <a
          className={styles.primaryButton}
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
        >
          Falar pelo WhatsApp
          <ChevronRight aria-hidden="true" />
        </a>
      </section>
      <footer className={styles.methodFooter}>
        <Link href="/">Conhecer o Método Última Cartada</Link>
        <p>Uma aplicação educacional de desenvolvimento de hábitos. Não substitui acompanhamento psicológico, nutricional ou médico.</p>
      </footer>
    </main>
  );
}
