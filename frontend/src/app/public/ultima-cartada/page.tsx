import { BarChart3, CheckCircle2, ChevronRight, Gamepad2, Heart, Layers3, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import PublicNavigation from "@/components/landing/PublicNavigation";
import styles from "./UltimaCartadaPage.module.css";

export const metadata: Metadata = {
  title: "Última Cartada | Metodologia para escolhas e hábitos cotidianos",
  description: "Conheça o Método Última Cartada, de Magaly Abreu, seus quatro pilares e a Cartada Viva, o jogo que leva a metodologia à prática diária.",
};
const WHATSAPP_URL = "https://wa.me/5584999181607?text=Olá,%20Magaly!%20Quero%20conhecer%20o%20Método%20Última%20Cartada.";
const pillars = [
  { title: "Corpo", suit: "♣", phrase: "Eu ajo", description: "Cultivar movimento e cuidado com o corpo, respeitando suas possibilidades e seu contexto." },
  { title: "Nutrição", suit: "♦", phrase: "Eu me nutro", description: "Desenvolver atenção à alimentação e às escolhas de cuidado que fazem parte da rotina." },
  { title: "Mentalidade", suit: "♠", phrase: "Eu transformo", description: "Observar pensamentos e experiências, ampliar o autoconhecimento e ajustar a próxima escolha." },
  { title: "Comunidade", suit: "♥", phrase: "Eu pertenço", description: "Construir vínculos e compartilhar o caminho com respeito ao ritmo e à privacidade de cada pessoa." },
];
const principles = [
  "Ações pequenas, possíveis e conectadas à vida real.",
  "Autoconhecimento para perceber o próprio contexto.",
  "Aprendizado contínuo, com espaço para ajustar e retomar.",
  "Autonomia para construir escolhas com mais intenção.",
];
const gameSteps = [
  { icon: Layers3, title: "A cartada do dia", text: "Uma proposta de ação convida a levar os pilares à rotina e registrar uma intenção." },
  { icon: Sparkles, title: "A prática cotidiana", text: "Você experimenta a proposta, respeitando suas possibilidades, e registra a experiência." },
  { icon: BarChart3, title: "O próprio progresso", text: "Histórico e acompanhamento por pilar ajudam a perceber o caminho percorrido." },
  { icon: Heart, title: "A experiência em grupo", text: "A convivência incentiva participação e pertencimento, com compartilhamento opcional." },
];

export default function UltimaCartadaPage() {
  return (
    <main className={styles.page} id="top">
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Última Cartada — voltar à página inicial">
          <span className={styles.brandSymbol} aria-hidden="true">♠</span>
          <span className={styles.brandText}><strong>Última Cartada</strong><small>Metodologia de Magaly Abreu</small></span>
        </Link>
        <PublicNavigation id="metodo-navigation" label="Navegação da Última Cartada" className={styles.nav}>
          <a href="#ideia">A metodologia</a>
          <a href="#telas">Os pilares</a>
          <a href="#jogo">O jogo</a>
          <a href="#contato">Contato</a>
        </PublicNavigation>
      </header>

      <section className={styles.hero} aria-labelledby="metodo-title">
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Método Última Cartada</span>
          <h1 id="metodo-title">Pequenas escolhas. Uma vida com mais intenção.</h1>
          <p>Uma metodologia para desenvolver hábitos, ampliar o autoconhecimento e cultivar autonomia nas escolhas do cotidiano.</p>
          <p>Corpo, nutrição, mentalidade e comunidade se encontram em um caminho de reflexão e prática, com respeito ao seu ritmo.</p>
          <div className={styles.actions}>
            <a className={styles.primaryButton} href="#ideia">Conhecer a metodologia <ChevronRight aria-hidden="true" /></a>
            <a className={styles.secondaryButton} href="#jogo">Conhecer o jogo</a>
          </div>
        </div>
        <div className={styles.heroScreen}>
          <Image className={styles.founderImage} src="/landing/professional/acauamedia-131.jpg" alt="Magaly Abreu, criadora do Método Última Cartada" width={720} height={880} priority sizes="(max-width: 980px) 100vw, 50vw" />
          <p className={styles.photoCaption}>Magaly Abreu • Criadora do Método Última Cartada</p>
        </div>
      </section>

      <section className={styles.idea} id="ideia" aria-labelledby="idea-title">
        <div>
          <span className={styles.eyebrow}>A metodologia</span>
          <h2 id="idea-title">Transformar intenção em uma prática possível.</h2>
          <p className={styles.methodDescription}>O Método Última Cartada propõe aproximar o que você deseja para a sua vida das escolhas que consegue fazer hoje. Reflexão, pequenas ações e aprendizado se conectam nos quatro pilares.</p>
          <p className={styles.methodDescription}>Observar o contexto, experimentar e ajustar a prática ajudam a construir um caminho próprio. Retomar também faz parte desse processo.</p>
        </div>
        <div className={styles.principles}>{principles.map((principle) => <article key={principle}><CheckCircle2 aria-hidden="true" /><p>{principle}</p></article>)}</div>
      </section>

      <section className={styles.screens} id="telas" aria-labelledby="pillars-title">
        <div className={styles.sectionHeader}><h2 id="pillars-title">Quatro pilares para um cuidado integrado.</h2></div>
        <div className={styles.screenList}>{pillars.map((pillar) => <article key={pillar.title}>
          <div className={styles.pillarVisual}><span aria-hidden="true">{pillar.suit}</span><strong>{pillar.phrase}</strong></div>
          <div><h3>{pillar.title}</h3><p>{pillar.description}</p></div>
        </article>)}</div>
      </section>

      <section className={styles.features} id="jogo" aria-labelledby="game-title">
        <div className={styles.sectionHeader}>
          <Gamepad2 aria-hidden="true" />
          <span className={styles.gameEyebrow}>Uma aplicação prática da metodologia</span>
          <h2 id="game-title">Cartada Viva: o método em forma de jogo.</h2>
          <p className={styles.gameDescription}>A Cartada Viva é a experiência educacional e gamificada do Método Última Cartada. Cartas convidam a pequenas ações que incentivam boas práticas do cotidiano nos quatro pilares.</p>
          <p className={styles.gameDescription}>A jornada é organizada em três jogos de 21 dias, combinando intenção, prática, registro e convivência em grupo. O jogo é uma forma de vivenciar a metodologia.</p>
        </div>
        <div id="funciona" className={styles.featureGrid}>{gameSteps.map((step) => {
          const Icon = step.icon;
          return <article key={step.title}><Icon aria-hidden="true" /><h3>{step.title}</h3><p>{step.text}</p></article>;
        })}</div>
        <div className={styles.actions}>
          <Link className={styles.gameButton} href="/login">Já participo: acessar o jogo <ChevronRight aria-hidden="true" /></Link>
          <a className={styles.gameButton} href={WHATSAPP_URL} target="_blank" rel="noreferrer">Saber como participar</a>
        </div>
      </section>

      <section className={styles.finalCta} id="contato">
        <div><h2>Qual cuidado você quer trazer para o seu cotidiano?</h2><p>Converse com Magaly para conhecer a metodologia Última Cartada e suas possibilidades de aplicação, incluindo o jogo Cartada Viva.</p></div>
        <a className={styles.primaryButton} href={WHATSAPP_URL} target="_blank" rel="noreferrer">Conhecer o método <ChevronRight aria-hidden="true" /></a>
      </section>
      <footer className={styles.methodFooter}>
        <Link href="/">Voltar à página inicial</Link>
        <p>A Cartada Viva é uma aplicação educacional para o desenvolvimento de hábitos. Não substitui acompanhamento psicológico, nutricional ou médico.</p>
      </footer>
    </main>
  );
}
