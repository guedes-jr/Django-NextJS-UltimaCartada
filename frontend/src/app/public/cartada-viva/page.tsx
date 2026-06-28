import {
  BarChart3,
  Camera,
  CheckCircle2,
  ChevronRight,
  Gamepad2,
  Layers3,
  Trophy,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import styles from "./CartadaVivaPage.module.css";

export const metadata: Metadata = {
  title: "Cartada Viva | Jogo terapêutico de hábitos",
  description:
    "Página dedicada ao jogo Cartada Viva, uma experiência com cartas, rodadas, evidências, ranking e acompanhamento de hábitos.",
};

const WHATSAPP_URL =
  "https://wa.me/5584994124712?text=Olá,%20Magaly!%20Quero%20conhecer%20o%20jogo%20Cartada%20Viva.";

const features = [
  {
    icon: Layers3,
    title: "Rodadas com cartas",
    description:
      "Cada rodada propõe uma ação prática para transformar intenção em comportamento observável.",
  },
  {
    icon: Camera,
    title: "Evidências",
    description:
      "O jogador registra texto, foto ou vídeo para mostrar que executou o desafio proposto.",
  },
  {
    icon: Trophy,
    title: "Pontuação e ranking",
    description:
      "O progresso fica visível, incentivando participação, constância e senso de conquista.",
  },
  {
    icon: BarChart3,
    title: "Acompanhamento",
    description:
      "A facilitadora visualiza jogadas, evidências e desempenho para orientar melhor o grupo.",
  },
];

const screens = [
  {
    title: "Área do jogador",
    description:
      "Rodada ativa, cartas disponíveis e próximo passo aparecem em uma tela simples de seguir.",
    image: "/landing/cartada-viva/player-home.svg",
  },
  {
    title: "Dashboard administrativo",
    description:
      "A visão da facilitadora reúne jogos, jogadas, pontos distribuídos e evidências pendentes.",
    image: "/landing/cartada-viva/admin-dashboard.svg",
  },
  {
    title: "Revisão de evidências",
    description:
      "Cada evidência pode ser avaliada para fechar o ciclo entre prática real e pontuação.",
    image: "/landing/cartada-viva/evidence-review.svg",
  },
];

const principles = [
  "O jogo reduz a distância entre saber e fazer.",
  "As cartas criam microações possíveis para a rotina.",
  "As evidências reforçam compromisso e consciência.",
  "O ranking torna progresso visível sem perder o cuidado humano.",
];

export default function CartadaVivaPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          <strong>Cartada Viva</strong>
          <span>jogo terapêutico</span>
        </Link>

        <nav className={styles.nav} aria-label="Navegação do Cartada Viva">
          <a href="#ideia">Ideia</a>
          <a href="#telas">Telas</a>
          <a href="#funciona">Como funciona</a>
          <Link href="/public/consultoria">Consultoria</Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Game de hábitos e evidências</span>
          <h1>Cartada Viva transforma cuidado em ação diária.</h1>
          <p>
            Um jogo terapêutico para grupos, mentorias e acompanhamentos:
            cartas propõem desafios, jogadores realizam ações, enviam
            evidências e acompanham sua evolução.
          </p>

          <div className={styles.actions}>
            <a
              className={styles.primaryButton}
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
            >
              Quero conhecer
              <ChevronRight aria-hidden="true" />
            </a>

            <a className={styles.secondaryButton} href="#telas">
              Ver telas
            </a>
          </div>
        </div>

        <div className={styles.heroScreen}>
          <Image
            src="/landing/cartada-viva/player-home.svg"
            alt="Tela do jogador com rodada ativa e cartas disponíveis"
            width={1280}
            height={820}
            priority
          />
        </div>
      </section>

      <section className={styles.idea} id="ideia">
        <div>
          <span className={styles.eyebrow}>Ideia por trás</span>
          <h2>Não é só pontuar. É criar presença, escolha e repetição.</h2>
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
          <h2>Imagens das principais telas</h2>
        </div>

        <div className={styles.screenList}>
          {screens.map((screen) => (
            <article key={screen.title}>
              <Image
                src={screen.image}
                alt={screen.title}
                width={1280}
                height={820}
              />
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
          <h2>Quer usar o Cartada Viva em uma jornada guiada?</h2>
          <p>
            A experiência funciona como apoio para mentorias, grupos e processos
            em que mudança de hábito precisa ser acompanhada de perto.
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
    </main>
  );
}
