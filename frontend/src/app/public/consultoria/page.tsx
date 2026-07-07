import {
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  HeartPulse,
  MessageCircle,
  Sparkles,
  Target,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import styles from "./ConsultoriaPage.module.css";

export const metadata: Metadata = {
  title: "Consultoria Magaly Abreu | A Última Cartada",
  description:
    "Página dedicada à consultoria de Magaly Abreu com acompanhamento para hábitos, rotina, alimentação e mudança emocional.",
};

const WHATSAPP_URL =
  "https://wa.me/5584999181607?text=Olá,%20Magaly!%20Quero%20saber%20mais%20sobre%20a%20consultoria.";

const supportPoints = [
  "Organização de rotina sem extremos.",
  "Apoio para lidar com ansiedade, culpa e autossabotagem.",
  "Construção de hábitos possíveis para a vida real.",
  "Acompanhamento próximo para manter constância.",
];

const steps = [
  {
    icon: MessageCircle,
    title: "Conversa inicial",
    description:
      "Você conta sua rotina, seus objetivos e os pontos que mais travam seu processo.",
  },
  {
    icon: Target,
    title: "Plano com direção",
    description:
      "A consultoria organiza prioridades, hábitos e ações práticas para a sua fase atual.",
  },
  {
    icon: CalendarCheck,
    title: "Acompanhamento",
    description:
      "O processo segue com ajustes, orientação e suporte para você não caminhar no automático.",
  },
];

export default function ConsultoriaPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          <strong>Magaly Abreu</strong>
          <span>Consultoria</span>
        </Link>

        <nav className={styles.nav} aria-label="Navegação da consultoria">
          <a href="#processo">Processo</a>
          <a href="#para-quem">Para quem</a>
          <Link href="/public/cartada-viva">Cartada Viva</Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Consultoria personalizada</span>
          <h1>Uma direção clara para transformar rotina em cuidado.</h1>
          <p>
            A consultoria une escuta, estratégia e prática para mulheres que
            desejam emagrecer, melhorar hábitos e recuperar confiança sem viver
            presas a recomeços.
          </p>

          <div className={styles.actions}>
            <a
              className={styles.primaryButton}
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
            >
              Falar no WhatsApp
              <MessageCircle aria-hidden="true" />
            </a>

            <Link className={styles.secondaryButton} href="/public/cartada-viva">
              Conhecer o jogo
              <ChevronRight aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className={styles.heroMedia}>
          <Image
            src="/landing/professional/acauamedia-131.jpg"
            alt="Magaly Abreu em ensaio profissional"
            width={820}
            height={1100}
            className={styles.heroImage}
            priority
          />
          <div className={styles.heroNote}>
            <HeartPulse aria-hidden="true" />
            <strong>Cuidado com método</strong>
            <span>mentalidade, hábitos e acompanhamento</span>
          </div>
        </div>
      </section>

      <section className={styles.support} id="para-quem">
        <div>
          <span className={styles.eyebrow}>Para quem é</span>
          <h2>Para quem sabe o que precisa fazer, mas não consegue sustentar.</h2>
        </div>

        <div className={styles.supportList}>
          {supportPoints.map((item) => (
            <article key={item}>
              <CheckCircle2 aria-hidden="true" />
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.process} id="processo">
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Como funciona</span>
          <h2>Um acompanhamento para sair da intenção e ir para a prática.</h2>
        </div>

        <div className={styles.stepGrid}>
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article key={step.title}>
                <Icon aria-hidden="true" />
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.gameCallout}>
        <Image
          src="/landing/cartada-viva/player-home.svg"
          alt="Tela do jogador do jogo Cartada Viva"
          width={1280}
          height={820}
        />

        <div>
          <Sparkles aria-hidden="true" />
          <h2>Cartada Viva entra como prática guiada.</h2>
          <p>
            O jogo transforma desafios de hábito em rodadas, cartas e
            evidências. É uma forma leve de acompanhar ação real, evolução e
            consistência durante a jornada.
          </p>
          <Link className={styles.secondaryButton} href="/public/cartada-viva">
            Ver página do Cartada Viva
            <ChevronRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className={styles.finalCta}>
        <h2>Quer entender qual caminho faz sentido para sua rotina?</h2>
        <a
          className={styles.primaryButton}
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
        >
          Chamar Magaly no WhatsApp
          <MessageCircle aria-hidden="true" />
        </a>
      </section>
    </main>
  );
}
